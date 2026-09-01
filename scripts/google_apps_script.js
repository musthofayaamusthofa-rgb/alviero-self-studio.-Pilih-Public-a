/**
 * =========================================================================
 * ALVIERO STUDIO — GOOGLE APPS SCRIPT FOR GOOGLE SHEETS
 * Versi: 3.1 (Support Kapasitas 3 Klien, Filter BOOKED, & Upload Bukti Bayar ke Drive/Sheet)
 * =========================================================================
 * 
 * FITUR UTAMA:
 * 1. Menerima upload foto bukti pembayaran dari web secara otomatis.
 * 2. Foto disimpan ke folder Google Drive "Bukti Pembayaran Alviero Studio".
 * 3. Link foto bukti transfer otomatis dimasukkan ke kolom Spreadsheet.
 * 4. Filter ketersediaan slot jam berdasarkan status 'BOOKED'.
 * 
 * ⚠️ CARA MENGATASI ERROR IZIN GOOGLE DRIVE (HANYA DILAKUKAN 1 KALI):
 * Jika muncul error: "Anda tidak memiliki izin untuk memanggil DriveApp...":
 * 1. Di editor Apps Script, pada menu dropdown fungsi di bagian atas (sebelah tombol Debug/Run), pilih fungsi: "authorizeDrivePermissions".
 * 2. Klik tombol "Jalankan" (Run ▶️).
 * 3. Akan muncul jendela popup "Otorisasi Diperlukan" (Authorization Required) > Klik "Tinjau Izin" (Review Permissions).
 * 4. Pilih Akun Google Anda.
 * 5. Jika muncul "Google belum memverifikasi aplikasi ini", klik "Lanjutan" (Advanced) > klik "Buka ... (tidak aman)".
 * 6. Klik tombol "Izinkan" (Allow).
 * 7. Setelah selesai, klik tombol "Terapkan" (Deploy) di kanan atas > "Kelola penerapan" (Manage deployments) > Edit (ikon Pensil) > pilih Versi: "Baru" (New version) > Klik "Terapkan" (Deploy).
 */

/**
 * FUNGSI BANTUAN UNTUK OTORISASI IZIN GOOGLE DRIVE (Jalankan fungsi ini di editor jika diminta izin)
 */
function authorizeDrivePermissions() {
  var folderName = 'Bukti Pembayaran Alviero Studio';
  var folders = DriveApp.getFoldersByName(folderName);
  var folder;
  if (folders.hasNext()) {
    folder = folders.next();
  } else {
    folder = DriveApp.createFolder(folderName);
  }
  Logger.log('✅ Otorisasi Google Drive Berhasil! Folder ID: ' + folder.getId());
}

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000);

  try {
    var params = {};

    // Baca parameter dari POST body JSON jika ada
    if (e && e.postData && e.postData.contents) {
      try {
        params = JSON.parse(e.postData.contents);
      } catch (err) {
        params = e.parameter || {};
      }
    } else if (e && e.parameter) {
      params = e.parameter;
    }

    var action = params.action || '';
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // =========================================================================
    // 1. ACTION: CHECK SLOTS (Cek Ketersediaan Jam Slot & Background)
    // =========================================================================
    if (action === 'check_slots') {
      var dateParam = params.date || '';
      var branchParam = params.branch || 'cabang-1'; // 'cabang-1' atau 'cabang-2'
      var studioTypeParam = params.studio_type || 'studio_foto'; // 'studio_foto' atau 'selfstudio'

      var sheetName = (branchParam === 'cabang-2' || branchParam === 'Studio 2') ? 'Cabang 2' : 'Cabang 1';
      var sheet = ss.getSheetByName(sheetName);

      if (!sheet) {
        sheet = ss.insertSheet(sheetName);
        setupSheetHeaders(sheet);
      }

      var data = sheet.getDataRange().getValues();
      var bookedSlots = [];
      var slotCounts = {};
      var slotBackdrops = {};

      for (var i = 1; i < data.length; i++) {
        var row = data[i];
        if (!row || row.length < 2) continue;

        var rowDate = formatDate(row[0]); // Kolom A: Tanggal Booking
        var rowSlot = normalizeTime(row[1]); // Kolom B: Jam Slot
        var rowStudioType = String(row[2] || '').trim().toLowerCase(); // Kolom C: Tipe Studio
        var rowBackdrop = String(row[8] || '').trim(); // Kolom I: Backdrop
        var rowStatus = String(row[15] || '').trim().toUpperCase(); // Kolom P: Status

        // ATURAN STATUS: Hanya status 'BOOKED', 'CONFIRMED', 'LUNAS', 'DP', 'PAID', 'SUCCESS' yang mengunci slot
        var isConfirmedBooking = (
          rowStatus === 'BOOKED' ||
          rowStatus === 'CONFIRMED' ||
          rowStatus === 'LUNAS' ||
          rowStatus === 'DP' ||
          rowStatus === 'PAID' ||
          rowStatus === 'SUCCESS'
        );

        if (!isConfirmedBooking) {
          continue; // PENDING & CANCELLED OTOMATIS DILEWATI
        }

        if (rowDate === dateParam && (rowStudioType === studioTypeParam || !studioTypeParam)) {
          if (rowSlot) {
            slotCounts[rowSlot] = (slotCounts[rowSlot] || 0) + 1;

            if (!slotBackdrops[rowSlot]) {
              slotBackdrops[rowSlot] = [];
            }
            if (rowBackdrop) {
              slotBackdrops[rowSlot].push(rowBackdrop);
            }

            if (slotCounts[rowSlot] >= 3 && bookedSlots.indexOf(rowSlot) === -1) {
              bookedSlots.push(rowSlot);
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
        slotBackdrops: slotBackdrops
      };

      return ContentService.createTextOutput(JSON.stringify(responseData))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // =========================================================================
    // 2. ACTION: BOOK SLOT (Simpan Data Reservasi & Foto Bukti Bayar)
    // =========================================================================
    if (action === 'book_slot') {
      var branch = params.branch || 'cabang-1';
      var sheetName = (branch === 'cabang-2' || branch === 'Studio 2') ? 'Cabang 2' : 'Cabang 1';
      var sheet = ss.getSheetByName(sheetName);

      if (!sheet) {
        sheet = ss.insertSheet(sheetName);
        setupSheetHeaders(sheet);
      }

      var timestamp = new Date();
      var bookingDate = params.date || '';
      var timeSlot = normalizeTime(params.time || '');
      var studioType = params.studio_type || 'studio_foto';
      var studioLabel = params.studio_label || 'Studio Foto Profesional';
      var branchName = params.branch_name || (branch === 'cabang-2' ? 'Alviero Studio — Studio 2' : 'Alviero Studio — Studio 1');
      var customerName = params.name || '-';
      var customerPhone = params.phone || '-';
      var packageName = params.package || '-';
      var backdrop = params.backdrop || '-';
      var frame = params.frame || '-';
      var addons = params.addons || '-';
      var total = Number(params.total) || 0;
      var dp = Number(params.dp) || 0;
      var paymentMethod = params.paymentMethod || 'dp';
      var notes = params.notes || '-';
      var status = (params.status || 'PENDING').toUpperCase();

      // UPLOAD FOTO BUKTI PEMBAYARAN KE GOOGLE DRIVE
      var proofUrl = '-';
      if (params.image_base64 && typeof params.image_base64 === 'string' && params.image_base64.length > 50) {
        try {
          var folderName = 'Bukti Pembayaran Alviero Studio';
          var folders = DriveApp.getFoldersByName(folderName);
          var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

          var base64Data = params.image_base64;
          var contentType = 'image/png';
          if (base64Data.indexOf('data:') === 0) {
            var parts = base64Data.split(';base64,');
            contentType = parts[0].replace('data:', '');
            base64Data = parts[1];
          }

          var decoded = Utilities.base64Decode(base64Data);
          var cleanCustName = customerName.replace(/[^a-zA-Z0-9]/g, '_') || 'Klien';
          var cleanSlot = timeSlot.replace(':', '');
          var rawName = params.image_name || 'bukti_bayar.png';
          var fileName = cleanCustName + '_' + cleanSlot + '_' + rawName;

          var blob = Utilities.newBlob(decoded, contentType, fileName);
          var file = folder.createFile(blob);
          file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          proofUrl = file.getUrl();
        } catch (imgErr) {
          proofUrl = 'Gagal upload: ' + imgErr.toString();
        }
      }

      // Tambahkan baris baru ke Google Sheets
      sheet.appendRow([
        bookingDate,       // A: Tanggal Booking (YYYY-MM-DD)
        timeSlot,          // B: Jam Slot (HH:MM)
        studioType,        // C: Tipe Studio (studio_foto / selfstudio)
        studioLabel,       // D: Label Studio
        branchName,        // E: Cabang
        customerName,      // F: Nama Klien
        customerPhone,     // G: No. WhatsApp
        packageName,       // H: Paket Utama
        backdrop,          // I: Backdrop
        frame,             // J: Frame Template
        addons,            // K: Add-ons
        total,             // L: Total Biaya (Rp)
        dp,                // M: DP Dibayar (Rp)
        paymentMethod,     // N: Metode Pembayaran
        notes,             // O: Catatan
        status,            // P: Status (PENDING / BOOKED)
        proofUrl,          // Q: Link Bukti Pembayaran (Google Drive)
        timestamp          // R: Timestamp Submit
      ]);

      return ContentService.createTextOutput(JSON.stringify({
        status: 'SUCCESS',
        message: 'Reservasi & Bukti Transfer berhasil disimpan ke Spreadsheet',
        proofUrl: proofUrl
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'ERROR',
      message: 'Aksi tidak dikenali'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'ERROR',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
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
  return String(val).trim();
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
