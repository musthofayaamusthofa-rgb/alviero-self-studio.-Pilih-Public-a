/**
 * =========================================================================
 * ALVIERO STUDIO — GOOGLE APPS SCRIPT FOR GOOGLE SHEETS
 * Versi: 2.0 (Support Kapasitas 3 Klien per Slot & Filter Status BOOKED)
 * =========================================================================
 * 
 * CARA MEMASANG / UPDATE DI GOOGLE SHEETS:
 * 1. Buka Google Spreadsheet Anda.
 * 2. Klik menu "Ekstensi" (Extensions) > "Apps Script".
 * 3. Hapus seluruh isi kode lama di editor, lalu paste (tempel) kode di bawah ini.
 * 4. Klik icon "Simpan" (Ctrl+S / Cmd+S).
 * 5. Klik tombol "Terapkan" (Deploy) di kanan atas > "Kelola penerapan" (Manage deployments).
 * 6. Klik icon Pensil (Edit) pada penerapan aktif > pilih Versi: "Baru" (New version).
 * 7. Klik "Terapkan" (Deploy).
 */

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var params = e ? e.parameter : {};
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
        // Jika sheet belum ada, buat sheet baru
        sheet = ss.insertSheet(sheetName);
        setupSheetHeaders(sheet);
      }

      var data = sheet.getDataRange().getValues();
      var bookedSlots = [];
      var slotCounts = {};
      var slotBackdrops = {};

      // Filter baris (mulai dari baris ke-2 / index 1 karena index 0 adalah Header)
      for (var i = 1; i < data.length; i++) {
        var row = data[i];
        if (!row || row.length < 2) continue;

        var rowDate = formatDate(row[0]); // Kolom A: Tanggal Booking
        var rowSlot = normalizeTime(row[1]); // Kolom B: Jam Slot
        var rowStudioType = String(row[2] || '').trim().toLowerCase(); // Kolom C: Tipe Studio
        var rowBackdrop = String(row[8] || '').trim(); // Kolom I: Backdrop
        var rowStatus = String(row[15] || '').trim().toUpperCase(); // Kolom P: Status

        // ATURAN STATUS:
        // Hanya status 'BOOKED', 'CONFIRMED', 'LUNAS', 'DP', 'PAID', 'SUCCESS' yang dihitung mengunci slot!
        // Status 'PENDING', 'CANCELLED', 'BATAL', atau kosong TIDAK DIHITUNG mengunci slot.
        var isConfirmedBooking = (
          rowStatus === 'BOOKED' ||
          rowStatus === 'CONFIRMED' ||
          rowStatus === 'LUNAS' ||
          rowStatus === 'DP' ||
          rowStatus === 'PAID' ||
          rowStatus === 'SUCCESS'
        );

        if (!isConfirmedBooking) {
          continue; // Lewati baris yang masih PENDING atau CANCELLED
        }

        // Cocokkan Tanggal & Tipe Studio
        if (rowDate === dateParam && (rowStudioType === studioTypeParam || !studioTypeParam)) {
          if (rowSlot) {
            // Hitung jumlah klien confirmed di slot ini
            slotCounts[rowSlot] = (slotCounts[rowSlot] || 0) + 1;

            if (!slotBackdrops[rowSlot]) {
              slotBackdrops[rowSlot] = [];
            }
            if (rowBackdrop) {
              slotBackdrops[rowSlot].push(rowBackdrop);
            }

            // Jika sudah mencapai kapasitas maksimal (>= 3 klien), tandai sebagai PENUH
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
    // 2. ACTION: BOOK SLOT (Simpan Reservasi Baru ke Spreadsheet)
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

      // Tambahkan baris baru di spreadsheet
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
        timestamp          // Q: Timestamp Waktu Submit
      ]);

      return ContentService.createTextOutput(JSON.stringify({
        status: 'SUCCESS',
        message: 'Reservasi berhasil disimpan ke Google Spreadsheet'
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
    'Catatan', 'Status', 'Timestamp Submit'
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
