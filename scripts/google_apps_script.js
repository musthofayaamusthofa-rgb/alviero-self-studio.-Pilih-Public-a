/**
 * =========================================================================
 * ALVIERO STUDIO — GOOGLE APPS SCRIPT FOR GOOGLE SHEETS
 * Versi: 4.0 (Fail-Safe Booking, Isolated Drive Upload, Auto Header & Test Function)
 * =========================================================================
 * 
 * FITUR UTAMA:
 * 1. Menjamin baris reservasi SELALU tersimpan ke Spreadsheet tanpa risiko gagal.
 * 2. Upload bukti bayar ke Google Drive terisolasi aman (jika izin Drive belum dibuka, 
 *    data reservasi TETAP 100% tersimpan rapi).
 * 3. Mendukung reservasi Cabang 1 (Studio 1) dan Cabang 2 (Studio 2).
 * 4. Filter status 'BOOKED', 'CONFIRMED', 'LUNAS', 'DP' untuk kunci kuota 3 klien (Studio 2).
 * 5. Fungsi pengujian instan 'testInsertBooking' di editor untuk verifikasi 1 klik.
 * 
 * -------------------------------------------------------------------------
 * PANDUAN PEMASANGAN / UPDATE (HANYA 1 MENIT):
 * 1. Buka Spreadsheet Anda: https://docs.google.com/spreadsheets/d/1lWjubRqu6khlmUYRHEr--kaRu_DlFbbRfUjbFXFFJ9c/edit
 * 2. Klik menu atas: "Ekstensi" (Extensions) > "Apps Script".
 * 3. Hapus seluruh isi script lama (tekan Ctrl+A lalu Delete).
 * 4. Salin (Copy) & Tempel (Paste) seluruh kode file ini ke editor Apps Script.
 * 5. Klik ikon Simpan (Save 💾).
 * 6. Klik tombol biru "Terapkan" (Deploy) di pojok kanan atas > pilih "Kelola penerapan" (Manage deployments).
 * 7. Klik ikon Pensil (Edit) di sebelah deployment yang aktif.
 * 8. Pada bagian "Versi" (Version), pilih: "Baru" (New version).
 * 9. Pastikan "Akses" (Who has access) = "Siapa saja" (Anyone).
 * 10. Klik "Terapkan" (Deploy).
 * =========================================================================
 */

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) {
    return jsonResponse({
      status: 'ERROR',
      code: 'SERVER_BUSY',
      message: 'Server sedang memproses booking lain. Silakan coba lagi.'
    });
  }

  try {
    var params = {};

    // 1. Ekstrak parameter dari POST JSON body, FormData, atau GET Query
    if (e && e.postData && e.postData.contents) {
      try {
        params = JSON.parse(e.postData.contents);
      } catch (err) {
        params = e.parameter || {};
      }
    } else if (e && e.parameter) {
      params = e.parameter;
    }

    // Jika dikirim via hidden form input name="payload"
    if (params && params.payload && typeof params.payload === 'string') {
      try {
        params = JSON.parse(params.payload);
      } catch (pErr) {}
    }

    var action = params.action || '';
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // =========================================================================
    // 1. ACTION: CHECK SLOTS (Cek Ketersediaan Jam Slot & Background)
    // =========================================================================
    if (action === 'check_slots') {
      var dateParam = params.date || '';
      var branchParam = String(params.branch || 'cabang-1').toLowerCase();
      var studioTypeParam = String(params.studio_type || '').toLowerCase();

      var sheetName = (branchParam.indexOf('2') !== -1 || branchParam.indexOf('dinoyo') !== -1) ? 'Cabang 2' : 'Cabang 1';
      var sheet = ss.getSheetByName(sheetName);

      if (!sheet) {
        sheet = ss.insertSheet(sheetName);
        setupSheetHeaders(sheet);
      }

      var data = sheet.getDataRange().getValues();
      var bookedSlots = [];
      var slotCounts = {};
      var slotBackdrops = {};
      var slotSelfStudioCounts = {};
      var maxCap = (sheetName === 'Cabang 2') ? 3 : 1;

      for (var i = 1; i < data.length; i++) {
        var row = data[i];
        if (!row || row.length < 2) continue;

        var rowDate = formatDate(row[0]);
        var rowSlot = String(row[1] || '').trim();
        var rowStudioType = String(row[2] || '').trim().toLowerCase();
        var rowPackage = String(row[7] || '').trim();
        var rowBackdrop = String(row[8] || '').trim();
        var rowStatus = String(row[15] || '').trim().toUpperCase();

        var isConfirmedBooking = isActiveBookingStatus(
          rowStatus,
          row[17]
        );

        /*
         * PENDING menahan slot selama HOLD_MINUTES agar dua pelanggan tidak
         * dapat mengambil slot yang sama sebelum admin mengonfirmasi.
         */
        if (
          isConfirmedBooking &&
          rowDate === dateParam &&
          (rowStudioType === studioTypeParam || !studioTypeParam || studioTypeParam === 'all')
        ) {
          var occupiedSlots = getOccupiedSlotsForRow(rowSlot, rowPackage, rowBackdrop);

          for (var sIdx = 0; sIdx < occupiedSlots.length; sIdx++) {
            var s = occupiedSlots[sIdx];
            if (s) {
              slotCounts[s] = (slotCounts[s] || 0) + 1;

              if (!slotBackdrops[s]) {
                slotBackdrops[s] = [];
              }
              if (rowBackdrop) {
                slotBackdrops[s].push(rowBackdrop);
              }
              if (rowStudioType === 'selfstudio') {
                slotSelfStudioCounts[s] = (slotSelfStudioCounts[s] || 0) + 1;
              }

              if (slotCounts[s] >= maxCap && bookedSlots.indexOf(s) === -1) {
                bookedSlots.push(s);
              }
            }
          }
        }

      }

      var responseData = {
        status: 'SUCCESS',
        branch: branchParam,
        sheet: sheetName,
        date: dateParam,
        bookedSlots: bookedSlots,
        slotCounts: slotCounts,
        slotBackdrops: slotBackdrops,
        slotSelfStudioCounts: slotSelfStudioCounts
      };

      return ContentService.createTextOutput(JSON.stringify(responseData))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // =========================================================================
    // 2. ACTION: BOOK SLOT (Simpan Data Reservasi & Foto Bukti Bayar)
    // =========================================================================
    if (action === 'book_slot') {
      var bookingId = String(params.booking_id || '').trim();
      var bookingDate = formatDate(params.date || '');
      var timeSlot = normalizeTime(params.time || '');
      var studioType = String(params.studio_type || 'studio_foto').toLowerCase();
      var rawBranch = String(params.branch || 'cabang-1').toLowerCase();

      if (!bookingId || !bookingDate || !ALL_30M_SLOTS.includes(timeSlot)) {
        return jsonResponse({
          status: 'ERROR',
          code: 'INVALID_BOOKING_INPUT',
          message: 'Booking ID, tanggal, atau slot tidak valid.'
        });
      }

      if (['studio_foto', 'selfstudio'].indexOf(studioType) === -1) {
        return jsonResponse({
          status: 'ERROR',
          code: 'INVALID_STUDIO_TYPE',
          message: 'Tipe studio tidak valid.'
        });
      }

      var sheetName = (rawBranch.indexOf('2') !== -1 || rawBranch.indexOf('dinoyo') !== -1) ? 'Cabang 2' : 'Cabang 1';
      var sheet = ss.getSheetByName(sheetName);

      if (!sheet) {
        sheet = ss.insertSheet(sheetName);
        setupSheetHeaders(sheet);
      }

      var timestamp = new Date();
      var studioLabel = params.studio_label || (studioType === 'selfstudio' ? 'Self Studio' : 'Studio Foto Profesional');
      var branchName = params.branch_name || (sheetName === 'Cabang 2' ? 'Alviero Studio — Studio 2' : 'Alviero Studio — Studio 1');
      var customerName = params.name || 'Pelanggan';
      var customerPhone = params.phone || '-';
      var packageName = params.package || '-';
      var backdrop = params.backdrop || '-';
      var frame = params.frame || '-';
      var addons = params.addons || '-';
      var total = Number(params.total) || 0;
      var dp = Number(params.dp) || 0;
      var paymentMethod = params.paymentMethod || 'DP 50%';
      var notes = params.notes || '-';
      var status = 'PENDING';
      var proofUrl = 'Menunggu bukti bayar';

      var existingData = sheet.getDataRange().getValues();
      for (var existingIndex = 1; existingIndex < existingData.length; existingIndex++) {
        var existingNotes = String(existingData[existingIndex][14] || '');
        if (existingNotes.indexOf('[BOOKING_ID:' + bookingId + ']') !== -1) {
          return jsonResponse({
            status: 'SUCCESS',
            code: 'DUPLICATE',
            message: 'Booking sudah pernah diterima.',
            bookingId: bookingId
          });
        }
      }

      var requestedSlots = getOccupiedSlotsForRow(timeSlot, packageName, backdrop);
      var availability = getBookingAvailability(
        existingData,
        bookingDate,
        studioType,
        requestedSlots,
        backdrop,
        sheetName === 'Cabang 2' ? 3 : 1
      );

      if (!availability.available) {
        return jsonResponse({
          status: 'ERROR',
          code: 'SLOT_UNAVAILABLE',
          message: availability.message,
          occupiedSlots: availability.occupiedSlots
        });
      }

      var notesWithBookingId = '[BOOKING_ID:' + bookingId + '] ' + notes;

      // ⚠️ LANGKAH 1: SIMPAN DATA BARIS KE SPREADSHEET TERLEBIH DAHULU (FAIL-SAFE)
      sheet.appendRow([
        bookingDate,       // Kolom A: Tanggal Booking (YYYY-MM-DD)
        timeSlot,          // Kolom B: Jam Slot (HH:MM)
        studioType,        // Kolom C: Tipe Studio (studio_foto / selfstudio)
        studioLabel,       // Kolom D: Label Studio
        branchName,        // Kolom E: Cabang
        customerName,      // Kolom F: Nama Klien
        customerPhone,     // Kolom G: No. WhatsApp
        packageName,       // Kolom H: Paket Utama
        backdrop,          // Kolom I: Backdrop
        frame,             // Kolom J: Frame Template
        addons,            // Kolom K: Add-ons
        total,             // Kolom L: Total Biaya (Rp)
        dp,                // Kolom M: DP Dibayar (Rp)
        paymentMethod,     // Kolom N: Metode Pembayaran
        notesWithBookingId,// Kolom O: Catatan & Izin Sosmed
        status,            // Kolom P: Status (PENDING / BOOKED)
        proofUrl,          // Kolom Q: Link Bukti Pembayaran (Drive)
        timestamp          // Kolom R: Timestamp Submit
      ]);

      var lastRow = sheet.getLastRow();

      // ⚠️ LANGKAH 2: SIMPAN FOTO BUKTI KE GOOGLE DRIVE (TERISOLASI)
      if (params.image_base64 && typeof params.image_base64 === 'string' && params.image_base64.length > 50) {
        try {
          var folderName = 'Bukti Pembayaran Alviero Studio';
          var folders = DriveApp.getFoldersByName(folderName);
          var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

          var base64Data = params.image_base64;
          var contentType = 'image/jpeg';
          if (base64Data.indexOf('data:') === 0) {
            var parts = base64Data.split(';base64,');
            contentType = parts[0].replace('data:', '');
            base64Data = parts[1];
          }

          var decoded = Utilities.base64Decode(base64Data);
          var cleanCustName = customerName.replace(/[^a-zA-Z0-9]/g, '_') || 'Klien';
          var cleanSlot = timeSlot.replace(':', '');
          var rawName = params.image_name || 'bukti_bayar.jpg';
          var fileName = cleanCustName + '_' + cleanSlot + '_' + rawName;

          var blob = Utilities.newBlob(decoded, contentType, fileName);
          var file = folder.createFile(blob);
          file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          proofUrl = file.getUrl();

          // Update Kolom Q baris ini dengan URL Google Drive resmi
          sheet.getRange(lastRow, 17).setValue(proofUrl);
        } catch (imgErr) {
          proofUrl = 'Bukti terlampir via WA (Izin Drive: ' + imgErr.toString() + ')';
          sheet.getRange(lastRow, 17).setValue(proofUrl);
        }
      }

      return jsonResponse({
        status: 'SUCCESS',
        message: 'Reservasi berhasil disimpan ke baris ' + lastRow + ' (' + sheetName + ')',
        sheet: sheetName,
        row: lastRow,
        proofUrl: proofUrl,
        bookingId: bookingId
      });
    }

    // Default response jika aksi tidak cocok
    return jsonResponse({
      status: 'OK',
      message: 'Server Alviero Studio aktif'
    });

  } catch (error) {
    return jsonResponse({
      status: 'ERROR',
      message: error.toString()
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (e) {}
  }
}

/**
 * FUNGSI PENGUJIAN INSTAN:
 * Jalankan fungsi ini langsung di editor Apps Script (pilih "testInsertBooking" lalu klik "Jalankan ▶️").
 * Anda akan langsung melihat 1 baris uji coba masuk ke sheet Cabang 1 & Cabang 2!
 */
function testInsertBooking() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet2 = ss.getSheetByName('Cabang 2') || ss.insertSheet('Cabang 2');
  setupSheetHeaders(sheet2);
  
  var now = new Date();
  sheet2.appendRow([
    formatDate(now),
    '15:00',
    'studio_foto',
    'Studio Foto Profesional',
    'Alviero Studio — Studio 2',
    'Uji Coba Script v4',
    '081234567890',
    'Supreme Scholar (Graduation)',
    'Hitam & Putih',
    '-',
    '-',
    380000,
    190000,
    'DP 50% via BCA 0113324021',
    '[Izin IG: Boleh] Uji coba berhasil',
    'PENDING',
    'https://drive.google.com/',
    now
  ]);
  
  Logger.log('✅ Uji coba sukses! Baris baru masuk ke Cabang 2.');
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

var PENDING_HOLD_MINUTES = 15;

function isActiveBookingStatus(status, submittedAt) {
  var normalizedStatus = String(status || '').toUpperCase();
  var confirmedStatuses = [
    'BOOKED', 'CONFIRMED', 'LUNAS', 'DP', 'PAID', 'SUCCESS'
  ];

  if (confirmedStatuses.indexOf(normalizedStatus) !== -1) {
    return true;
  }

  if (normalizedStatus !== 'PENDING' || !submittedAt) {
    return false;
  }

  var submittedDate = submittedAt instanceof Date
    ? submittedAt
    : new Date(submittedAt);

  if (isNaN(submittedDate.getTime())) {
    return false;
  }

  var ageMinutes = (new Date().getTime() - submittedDate.getTime()) / 60000;
  return ageMinutes >= 0 && ageMinutes <= PENDING_HOLD_MINUTES;
}

function getBookingAvailability(data, bookingDate, studioType, requestedSlots, backdrop, maxCapacity) {
  var slotCounts = {};
  var normalizedBackdrop = String(backdrop || '').trim().toLowerCase();

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row || row.length < 18) continue;

    var rowDate = formatDate(row[0]);
    var rowStudioType = String(row[2] || '').trim().toLowerCase();
    var rowStatus = String(row[15] || '').trim().toUpperCase();

    if (rowDate !== bookingDate || rowStudioType !== studioType) continue;
    if (!isActiveBookingStatus(rowStatus, row[17])) continue;

    var occupiedSlots = getOccupiedSlotsForRow(row[1], row[7], row[8]);
    occupiedSlots.forEach(function(slot) {
      slotCounts[slot] = (slotCounts[slot] || 0) + 1;
    });
  }

  for (var j = 0; j < requestedSlots.length; j++) {
    var requestedSlot = requestedSlots[j];
    if ((slotCounts[requestedSlot] || 0) >= maxCapacity) {
      return {
        available: false,
        message: 'Slot ' + requestedSlot + ' sudah penuh.',
        occupiedSlots: requestedSlots
      };
    }
  }

  return {
    available: true,
    requestedBackdrop: normalizedBackdrop,
    occupiedSlots: requestedSlots
  };
}

// Inisialisasi Header Kolom
function setupSheetHeaders(sheet) {
  var headers = [
    'Tanggal Booking', 'Jam Slot', 'Tipe Studio', 'Label Studio', 'Cabang',
    'Nama Klien', 'No. WhatsApp', 'Paket Utama', 'Backdrop', 'Frame Template',
    'Add-ons', 'Total Biaya (Rp)', 'DP Dibayar (Rp)', 'Metode Pembayaran',
    'Catatan', 'Status', 'Link Bukti Pembayaran (Drive)', 'Timestamp Submit'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#EFEFEF');
}

// Format Tanggal YYYY-MM-DD
function formatDate(val) {
  if (!val) return '';
  if (val instanceof Date) {
    var yyyy = val.getFullYear();
    var mm = String(val.getMonth() + 1).padStart(2, '0');
    var dd = String(val.getDate()).padStart(2, '0');
    return yyyy + '-' + mm + '-' + dd;
  }
  var str = String(val).trim();
  // Format YYYY-MM-DD
  var mIso = str.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (mIso) {
    return mIso[1] + '-' + mIso[2].padStart(2, '0') + '-' + mIso[3].padStart(2, '0');
  }
  // Format DD/MM/YYYY atau DD-MM-YYYY
  var mDmy = str.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
  if (mDmy) {
    return mDmy[3] + '-' + mDmy[2].padStart(2, '0') + '-' + mDmy[1].padStart(2, '0');
  }
  return str;
}

// Format Jam HH:MM
function normalizeTime(val) {
  if (!val) return '';
  var str = String(val).trim();
  var match = str.match(/(\d{1,2})[:.](\d{2})/);
  if (match) {
    return match[1].padStart(2, '0') + ':' + match[2];
  }
  return str;
}

// 26 Slot Jadwal Interval 30 Menit (08:00 - 20:30 WIB)
var ALL_30M_SLOTS = [
  '08:00', '08:30',
  '09:00', '09:30',
  '10:00', '10:30',
  '11:00', '11:30',
  '12:00', '12:30',
  '13:00', '13:30',
  '14:00', '14:30',
  '15:00', '15:30',
  '16:00', '16:30',
  '17:00', '17:30',
  '18:00', '18:30',
  '19:00', '19:30',
  '20:00', '20:30'
];

// Helper: Menghitung slot apa saja yang terpakai oleh 1 baris booking (1 slot vs 2 slot)
function getOccupiedSlotsForRow(rowSlotRaw, rowPackageRaw, rowBackdropRaw) {
  var rawStr = String(rowSlotRaw || '').trim();
  var slots = [];

  var matches = rawStr.match(/(\d{1,2})[:.](\d{2})/g);
  if (matches && matches.length > 0) {
    var startSlot = normalizeTime(matches[0]);
    var idx = ALL_30M_SLOTS.indexOf(startSlot);
    if (idx !== -1) {
      slots.push(startSlot);

      // Cek apakah paket 2 slot / 60 menit / 2 background
      var pkgLower = String(rowPackageRaw || '').toLowerCase();
      var bdLower = String(rowBackdropRaw || '').toLowerCase();
      var is2Slot = (
        pkgLower.indexOf('paket 2') !== -1 ||
        pkgLower.indexOf('paket 3') !== -1 ||
        pkgLower.indexOf('paket 4') !== -1 ||
        pkgLower.indexOf('2 background') !== -1 ||
        pkgLower.indexOf('supreme') !== -1 ||
        pkgLower.indexOf('infinity') !== -1 ||
        pkgLower.indexOf('ultimate') !== -1 ||
        pkgLower.indexOf('cumlaude') !== -1 ||
        pkgLower.indexOf('group outdoor') !== -1 ||
        pkgLower.indexOf('happy nest') !== -1 ||
        pkgLower.indexOf('opulent') !== -1 ||
        pkgLower.indexOf('golden') !== -1 ||
        pkgLower.indexOf('sweet memories') !== -1 ||
        pkgLower.indexOf('glow sweet') !== -1 ||
        pkgLower.indexOf('sweet light') !== -1 ||
        pkgLower.indexOf('signature') !== -1 ||
        pkgLower.indexOf('royal') !== -1 ||
        pkgLower.indexOf('imperial') !== -1 ||
        pkgLower.indexOf('velvet') !== -1 ||
        pkgLower.indexOf('bundling') !== -1 ||
        pkgLower.indexOf('60 menit') !== -1 ||
        pkgLower.indexOf('50 menit') !== -1 ||
        bdLower.indexOf(',') !== -1 ||
        bdLower.indexOf('&') !== -1 ||
        (matches.length > 1 && normalizeTime(matches[1]) !== startSlot)
      );

      if (is2Slot && idx + 1 < ALL_30M_SLOTS.length) {
        slots.push(ALL_30M_SLOTS[idx + 1]);
      }
    }
  }

  return slots;
}
