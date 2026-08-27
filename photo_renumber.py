#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Photo Renumber Tool
====================
Software sederhana untuk mengubah urutan & menomori ulang banyak foto sekaligus,
dengan awalan huruf dan nomor mulai yang bisa dikustomisasi.

Contoh hasil: DSC001.jpg, DSC002.jpg, DSC003.jpg, ...
atau         : A01.jpg, A02.jpg, A03.jpg, ...

Dibuat dengan Python + Tkinter (bawaan Python, tidak perlu install tambahan
untuk menjalankan dari source). Bisa di-compile jadi .exe dengan PyInstaller
(lihat README.md / build.bat).
"""

import os
import sys
import uuid
import tkinter as tk
from tkinter import ttk, filedialog, messagebox

# Coba pakai Pillow untuk baca EXIF (tanggal foto diambil).
# Jika tidak ada, fitur "Urutkan berdasarkan Tanggal Foto (EXIF)" otomatis
# fallback ke tanggal modifikasi file.
try:
    from PIL import Image
    from PIL.ExifTags import TAGS
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

IMAGE_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".bmp", ".gif", ".tif", ".tiff", ".webp",
    ".heic", ".heif", ".cr2", ".cr3", ".nef", ".arw", ".dng", ".raf",
    ".orf", ".rw2", ".pef", ".srw"
}


def get_exif_date(path):
    """Ambil tanggal 'DateTimeOriginal' dari EXIF jika ada, else None."""
    if not HAS_PIL:
        return None
    try:
        img = Image.open(path)
        exif = img._getexif()
        if not exif:
            return None
        for tag_id, value in exif.items():
            tag = TAGS.get(tag_id, tag_id)
            if tag == "DateTimeOriginal":
                return value  # format: "YYYY:MM:DD HH:MM:SS" (string, bisa diurutkan langsung)
    except Exception:
        return None
    return None


class PhotoRenumberApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Photo Renumber Tool")
        self.root.geometry("880x600")
        self.root.minsize(760, 520)

        self.folder_path = tk.StringVar(value="")
        self.files = []  # list of full path, urutan sesuai tampilan di listbox

        # Opsi penomoran
        self.prefix_var = tk.StringVar(value="IMG_")
        self.start_num_var = tk.StringVar(value="1")
        self.digit_var = tk.StringVar(value="3")
        self.suffix_var = tk.StringVar(value="")
        self.lower_ext_var = tk.BooleanVar(value=False)

        self._drag_start_index = None

        self._build_ui()

    # ---------------------------------------------------------------
    # UI
    # ---------------------------------------------------------------
    def _build_ui(self):
        pad = {"padx": 8, "pady": 6}

        # --- Baris atas: pilih folder ---
        top = ttk.Frame(self.root)
        top.pack(fill="x", **pad)

        ttk.Button(top, text="Pilih Folder Foto...", command=self.choose_folder).pack(side="left")
        ttk.Label(top, textvariable=self.folder_path, foreground="#555").pack(side="left", padx=10)

        # --- Area tengah: list kiri, opsi kanan ---
        middle = ttk.Frame(self.root)
        middle.pack(fill="both", expand=True, **pad)

        # -- Kiri: daftar file + tombol urutkan --
        left = ttk.Frame(middle)
        left.pack(side="left", fill="both", expand=True)

        sortbar = ttk.Frame(left)
        sortbar.pack(fill="x")
        ttk.Label(sortbar, text="Urutkan:").pack(side="left")
        ttk.Button(sortbar, text="Nama (A-Z)", command=lambda: self.sort_files("name")).pack(side="left", padx=3)
        ttk.Button(sortbar, text="Tanggal Modifikasi", command=lambda: self.sort_files("mtime")).pack(side="left", padx=3)
        ttk.Button(sortbar, text="Tanggal Foto (EXIF)", command=lambda: self.sort_files("exif")).pack(side="left", padx=3)

        listframe = ttk.Frame(left)
        listframe.pack(fill="both", expand=True, pady=(6, 0))

        scrollbar = ttk.Scrollbar(listframe)
        scrollbar.pack(side="right", fill="y")

        self.listbox = tk.Listbox(
            listframe, selectmode="extended", yscrollcommand=scrollbar.set,
            activestyle="dotbox"
        )
        self.listbox.pack(side="left", fill="both", expand=True)
        scrollbar.config(command=self.listbox.yview)

        # drag & drop manual untuk reorder
        self.listbox.bind("<Button-1>", self._on_drag_start)
        self.listbox.bind("<B1-Motion>", self._on_drag_motion)

        movebar = ttk.Frame(left)
        movebar.pack(fill="x", pady=4)
        ttk.Button(movebar, text="↑ Naik", command=lambda: self.move_selected(-1)).pack(side="left")
        ttk.Button(movebar, text="↓ Turun", command=lambda: self.move_selected(1)).pack(side="left", padx=6)
        ttk.Button(movebar, text="Hapus dari daftar", command=self.remove_selected).pack(side="left", padx=6)
        ttk.Label(movebar, text="(Tips: klik-tahan lalu geser untuk mengubah urutan manual)",
                  foreground="#777").pack(side="left", padx=10)

        # -- Kanan: opsi penomoran --
        right = ttk.LabelFrame(middle, text="Pengaturan Penomoran")
        right.pack(side="left", fill="y", padx=(10, 0))

        r = 0
        ttk.Label(right, text="Awalan / Huruf depan:").grid(row=r, column=0, sticky="w", padx=8, pady=(10, 2))
        r += 1
        ttk.Entry(right, textvariable=self.prefix_var, width=20).grid(row=r, column=0, padx=8, pady=2, sticky="w")
        r += 1

        ttk.Label(right, text="Nomor mulai:").grid(row=r, column=0, sticky="w", padx=8, pady=(10, 2))
        r += 1
        ttk.Entry(right, textvariable=self.start_num_var, width=20).grid(row=r, column=0, padx=8, pady=2, sticky="w")
        r += 1

        ttk.Label(right, text="Jumlah digit (padding nol):").grid(row=r, column=0, sticky="w", padx=8, pady=(10, 2))
        r += 1
        ttk.Spinbox(right, from_=1, to=8, textvariable=self.digit_var, width=18).grid(row=r, column=0, padx=8, pady=2, sticky="w")
        r += 1

        ttk.Label(right, text="Akhiran (opsional, sebelum ekstensi):").grid(row=r, column=0, sticky="w", padx=8, pady=(10, 2))
        r += 1
        ttk.Entry(right, textvariable=self.suffix_var, width=20).grid(row=r, column=0, padx=8, pady=2, sticky="w")
        r += 1

        ttk.Checkbutton(right, text="Ekstensi huruf kecil (.JPG -> .jpg)",
                         variable=self.lower_ext_var).grid(row=r, column=0, sticky="w", padx=8, pady=(12, 2))
        r += 1

        ttk.Label(right, text="Contoh hasil:").grid(row=r, column=0, sticky="w", padx=8, pady=(16, 2))
        r += 1
        self.preview_label = ttk.Label(right, text="-", foreground="#0a7d2c", font=("TkDefaultFont", 10, "bold"))
        self.preview_label.grid(row=r, column=0, sticky="w", padx=8, pady=2)
        r += 1

        for var in (self.prefix_var, self.start_num_var, self.digit_var, self.suffix_var):
            var.trace_add("write", lambda *a: self.update_preview())

        ttk.Button(right, text="Preview Semua Perubahan", command=self.preview_all).grid(
            row=r, column=0, padx=8, pady=(20, 4), sticky="we")
        r += 1
        ttk.Button(right, text="RENAME SEKARANG", command=self.do_rename).grid(
            row=r, column=0, padx=8, pady=4, sticky="we")

        # --- Bawah: log ---
        bottom = ttk.LabelFrame(self.root, text="Log / Preview")
        bottom.pack(fill="both", expand=False, padx=8, pady=(0, 8))
        self.log_text = tk.Text(bottom, height=10, wrap="none", state="disabled", bg="#f7f7f7")
        self.log_text.pack(fill="both", expand=True)

        self.update_preview()

    # ---------------------------------------------------------------
    # Folder & file list
    # ---------------------------------------------------------------
    def choose_folder(self):
        folder = filedialog.askdirectory(title="Pilih folder berisi foto")
        if not folder:
            return
        self.folder_path.set(folder)
        self.load_files(folder)

    def load_files(self, folder):
        self.files = []
        for name in os.listdir(folder):
            full = os.path.join(folder, name)
            if os.path.isfile(full):
                ext = os.path.splitext(name)[1].lower()
                if ext in IMAGE_EXTENSIONS:
                    self.files.append(full)
        self.files.sort(key=lambda p: os.path.basename(p).lower())
        self.refresh_listbox()
        self.log(f"Ditemukan {len(self.files)} foto di folder terpilih.")

    def refresh_listbox(self):
        self.listbox.delete(0, "end")
        for f in self.files:
            self.listbox.insert("end", os.path.basename(f))
        self.update_preview()

    def sort_files(self, mode):
        if not self.files:
            return
        if mode == "name":
            self.files.sort(key=lambda p: os.path.basename(p).lower())
        elif mode == "mtime":
            self.files.sort(key=lambda p: os.path.getmtime(p))
        elif mode == "exif":
            if not HAS_PIL:
                messagebox.showwarning(
                    "Pillow belum terpasang",
                    "Untuk mengurutkan berdasarkan EXIF, install dulu library Pillow:\n\n"
                    "pip install Pillow\n\nSementara ini akan diurutkan berdasarkan tanggal modifikasi file."
                )
                self.files.sort(key=lambda p: os.path.getmtime(p))
            else:
                def sort_key(p):
                    d = get_exif_date(p)
                    return d if d else "9999:99:99 99:99:99"
                self.files.sort(key=sort_key)
        self.refresh_listbox()
        self.log(f"Daftar diurutkan berdasarkan: {mode}")

    def move_selected(self, direction):
        sel = list(self.listbox.curselection())
        if not sel:
            return
        if direction < 0:
            indices = sel
        else:
            indices = reversed(sel)
        for i in indices:
            j = i + direction
            if 0 <= j < len(self.files):
                self.files[i], self.files[j] = self.files[j], self.files[i]
        self.refresh_listbox()
        for i in sel:
            new_i = max(0, min(len(self.files) - 1, i + direction))
            self.listbox.selection_set(new_i)

    def remove_selected(self):
        sel = list(self.listbox.curselection())
        if not sel:
            return
        for i in sorted(sel, reverse=True):
            del self.files[i]
        self.refresh_listbox()

    # drag & drop reorder manual dengan mouse
    def _on_drag_start(self, event):
        self._drag_start_index = self.listbox.nearest(event.y)

    def _on_drag_motion(self, event):
        if self._drag_start_index is None:
            return
        new_index = self.listbox.nearest(event.y)
        if new_index != self._drag_start_index and 0 <= new_index < len(self.files):
            self.files[self._drag_start_index], self.files[new_index] = (
                self.files[new_index], self.files[self._drag_start_index]
            )
            self._drag_start_index = new_index
            self.refresh_listbox()
            self.listbox.selection_set(new_index)

    # ---------------------------------------------------------------
    # Penomoran
    # ---------------------------------------------------------------
    def build_name(self, index, ext):
        """index dimulai dari 0 (urutan foto ke-index dalam daftar)."""
        try:
            start = int(self.start_num_var.get())
        except ValueError:
            start = 1
        try:
            digits = int(self.digit_var.get())
        except ValueError:
            digits = 3

        number = start + index
        number_str = str(number).zfill(digits)
        prefix = self.prefix_var.get()
        suffix = self.suffix_var.get()

        if self.lower_ext_var.get():
            ext = ext.lower()

        return f"{prefix}{number_str}{suffix}{ext}"

    def update_preview(self):
        if self.files:
            ext = os.path.splitext(self.files[0])[1]
        else:
            ext = ".jpg"
        try:
            example = self.build_name(0, ext)
        except Exception:
            example = "-"
        self.preview_label.config(text=example)

    def preview_all(self):
        if not self.files:
            messagebox.showinfo("Info", "Belum ada foto yang dimuat. Pilih folder dulu.")
            return
        self.log_clear()
        self.log("=== PREVIEW PERUBAHAN NAMA (belum diterapkan) ===")
        used_names = set()
        has_conflict = False
        for idx, path in enumerate(self.files):
            old_name = os.path.basename(path)
            ext = os.path.splitext(path)[1]
            new_name = self.build_name(idx, ext)
            flag = ""
            if new_name in used_names:
                flag = "  <-- DUPLIKAT! Perbaiki pengaturan."
                has_conflict = True
            used_names.add(new_name)
            self.log(f"{old_name}   ->   {new_name}{flag}")
        if has_conflict:
            self.log("\nPERHATIAN: ada nama hasil yang duplikat. Cek pengaturan digit/awalan.")

    # ---------------------------------------------------------------
    # Rename
    # ---------------------------------------------------------------
    def do_rename(self):
        if not self.files:
            messagebox.showinfo("Info", "Belum ada foto yang dimuat. Pilih folder dulu.")
            return

        # Validasi duplikat dulu
        planned = []
        used_names = set()
        for idx, path in enumerate(self.files):
            ext = os.path.splitext(path)[1]
            new_name = self.build_name(idx, ext)
            if new_name in used_names:
                messagebox.showerror(
                    "Nama duplikat",
                    f"Nama hasil '{new_name}' muncul lebih dari sekali.\n"
                    "Perbesar jumlah digit atau ubah pengaturan lain."
                )
                return
            used_names.add(new_name)
            planned.append((path, new_name))

        confirm = messagebox.askyesno(
            "Konfirmasi",
            f"Akan mengganti nama {len(planned)} foto sesuai preview.\n"
            "Proses ini akan mengubah nama file ASLI di folder tersebut.\n\n"
            "Lanjutkan?"
        )
        if not confirm:
            return

        folder = self.folder_path.get()
        self.log_clear()
        self.log("=== PROSES RENAME ===")

        # Tahap 1: rename semua ke nama sementara (hindari bentrok nama)
        temp_map = []
        try:
            for old_path, new_name in planned:
                temp_name = f"__tmp_{uuid.uuid4().hex}{os.path.splitext(old_path)[1]}"
                temp_path = os.path.join(folder, temp_name)
                os.rename(old_path, temp_path)
                temp_map.append((temp_path, new_name))

            # Tahap 2: rename dari nama sementara ke nama final
            final_files = []
            for temp_path, new_name in temp_map:
                final_path = os.path.join(folder, new_name)
                os.rename(temp_path, final_path)
                final_files.append(final_path)
                self.log(f"OK -> {new_name}")

            self.files = final_files
            self.refresh_listbox()
            self.log(f"\nSelesai! {len(final_files)} foto berhasil diganti nama.")
            messagebox.showinfo("Selesai", f"{len(final_files)} foto berhasil diganti nama.")

        except Exception as e:
            self.log(f"\nERROR: {e}")
            messagebox.showerror(
                "Terjadi kesalahan",
                f"Rename dihentikan karena error:\n{e}\n\n"
                "Beberapa file mungkin masih bernama sementara (__tmp_...). "
                "Cek folder dan jalankan ulang jika perlu."
            )

    # ---------------------------------------------------------------
    # Log helper
    # ---------------------------------------------------------------
    def log(self, text):
        self.log_text.config(state="normal")
        self.log_text.insert("end", text + "\n")
        self.log_text.see("end")
        self.log_text.config(state="disabled")

    def log_clear(self):
        self.log_text.config(state="normal")
        self.log_text.delete("1.0", "end")
        self.log_text.config(state="disabled")


def main():
    root = tk.Tk()
    try:
        style = ttk.Style()
        if sys.platform.startswith("win"):
            style.theme_use("vista")
        else:
            style.theme_use("clam")
    except Exception:
        pass
    app = PhotoRenumberApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
