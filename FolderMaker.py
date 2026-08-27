"""
FolderMaker - Aplikasi pembuat folder otomatis berdasarkan daftar nama client
Dibuat dengan Python + tkinter, siap di-compile ke .exe dengan PyInstaller

Cara pakai:
1. Isi/tempel daftar nama client di kotak kiri. Boleh dipisah dengan:
   - baris baru (enter)
   - koma (,)
   - titik koma (;)
   - bisa juga ada nomor urut di depan seperti "1. Nama" atau "1) Nama" (nomornya otomatis dibuang)
2. Pilih "Lokasi Tujuan" -> folder induk tempat semua folder client dibuat
3. Klik "Buat Folder"

Format folder yang dibuat: "NamaClient" (nomor urut sudah dihapus, tidak dipakai lagi)
"""

import tkinter as tk
from tkinter import filedialog, messagebox, scrolledtext
import os
import re


class FolderMakerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Folder Maker - Pembuat Folder Client Otomatis")
        self.root.geometry("650x550")
        self.root.configure(bg="#1e1e1e")

        self.dest_folder = tk.StringVar()

        self._build_ui()

    # ---------- UI ----------
    def _build_ui(self):
        FG = "#e0e0e0"
        BG = "#1e1e1e"
        ENTRY_BG = "#2d2d2d"
        ACCENT = "#3a7bd5"

        title = tk.Label(
            self.root, text="Folder Maker", font=("Segoe UI", 16, "bold"),
            fg=ACCENT, bg=BG
        )
        title.pack(pady=(15, 5))

        subtitle = tk.Label(
            self.root,
            text="Buat banyak folder client sekaligus dari daftar nama",
            font=("Segoe UI", 9), fg="#9a9a9a", bg=BG
        )
        subtitle.pack(pady=(0, 15))

        # --- Nama Client ---
        frame_names = tk.Frame(self.root, bg=BG)
        frame_names.pack(fill="both", expand=True, padx=20, pady=5)

        tk.Label(
            frame_names, text="Nama Client (satu nama per baris):",
            font=("Segoe UI", 10, "bold"), fg=FG, bg=BG, anchor="w"
        ).pack(fill="x")

        self.text_names = scrolledtext.ScrolledText(
            frame_names, height=12, font=("Consolas", 10),
            bg=ENTRY_BG, fg=FG, insertbackground=FG,
            relief="flat", borderwidth=4
        )
        self.text_names.pack(fill="both", expand=True, pady=(5, 0))

        tk.Label(
            frame_names,
            text="Bisa dipisah baris baru, koma (,), atau titik koma (;)",
            font=("Segoe UI", 8), fg="#8a8a8a", bg=BG, anchor="w"
        ).pack(fill="x", pady=(4, 0))

        # --- Lokasi Tujuan ---
        frame_options = tk.Frame(self.root, bg=BG)
        frame_options.pack(fill="x", padx=20, pady=15)

        tk.Label(
            frame_options, text="Lokasi Tujuan:",
            font=("Segoe UI", 10, "bold"), fg=FG, bg=BG
        ).grid(row=0, column=0, sticky="w")

        entry_dest = tk.Entry(
            frame_options, textvariable=self.dest_folder,
            font=("Segoe UI", 10), bg=ENTRY_BG, fg=FG,
            insertbackground=FG, relief="flat", width=45
        )
        entry_dest.grid(row=1, column=0, columnspan=2, sticky="we", pady=(5, 0), ipady=4)

        btn_browse = tk.Button(
            frame_options, text="Pilih Folder...", command=self.browse_folder,
            font=("Segoe UI", 9), bg="#3a3a3a", fg=FG,
            activebackground="#4a4a4a", relief="flat", cursor="hand2"
        )
        btn_browse.grid(row=1, column=2, sticky="w", padx=(10, 0))

        frame_options.grid_columnconfigure(0, weight=1)

        # --- Tombol Buat Folder ---
        btn_create = tk.Button(
            self.root, text="Buat Folder", command=self.create_folders,
            font=("Segoe UI", 11, "bold"), bg=ACCENT, fg="white",
            activebackground="#2a5ea8", relief="flat", cursor="hand2",
            padx=20, pady=10
        )
        btn_create.pack(pady=15)

        # --- Log status ---
        self.log_box = scrolledtext.ScrolledText(
            self.root, height=6, font=("Consolas", 9),
            bg="#151515", fg="#8fce8f", relief="flat", borderwidth=4
        )
        self.log_box.pack(fill="both", expand=False, padx=20, pady=(0, 15))
        self.log_box.configure(state="disabled")

    # ---------- Logic ----------
    def browse_folder(self):
        folder = filedialog.askdirectory(title="Pilih Lokasi Tujuan")
        if folder:
            self.dest_folder.set(folder)

    def log(self, message):
        self.log_box.configure(state="normal")
        self.log_box.insert("end", message + "\n")
        self.log_box.see("end")
        self.log_box.configure(state="disabled")

    def create_folders(self):
        raw_names = self.text_names.get("1.0", "end").strip()
        dest = self.dest_folder.get().strip()

        if not raw_names:
            messagebox.showwarning("Peringatan", "Daftar nama client masih kosong.")
            return

        if not dest:
            messagebox.showwarning("Peringatan", "Lokasi tujuan belum dipilih.")
            return

        if not os.path.isdir(dest):
            messagebox.showerror("Error", "Lokasi tujuan tidak valid / tidak ditemukan.")
            return

        names = self._parse_names(raw_names)

        if not names:
            messagebox.showwarning("Peringatan", "Tidak ada nama valid ditemukan.")
            return

        self.log_box.configure(state="normal")
        self.log_box.delete("1.0", "end")
        self.log_box.configure(state="disabled")

        created = 0
        skipped = 0

        for name in names:
            folder_name = self._sanitize(name)
            if not folder_name:
                continue

            full_path = os.path.join(dest, folder_name)

            if os.path.exists(full_path):
                self.log(f"[LEWATI] Sudah ada: {folder_name}")
                skipped += 1
                continue

            try:
                os.makedirs(full_path)
                self.log(f"[BERHASIL] {folder_name}")
                created += 1
            except Exception as e:
                self.log(f"[GAGAL] {folder_name} -> {e}")

        self.log("-" * 40)
        self.log(f"Selesai. Dibuat: {created}, Dilewati: {skipped}, Total: {len(names)}")

        messagebox.showinfo(
            "Selesai",
            f"Berhasil membuat {created} folder.\n"
            f"Dilewati (sudah ada): {skipped}\n"
            f"Lokasi: {dest}"
        )

    @staticmethod
    def _parse_names(raw_text):
        """
        Pecah teks input jadi daftar nama, mendukung berbagai format:
        - satu nama per baris
        - dipisah koma (,)
        - dipisah titik koma (;)
        - ada nomor urut di depan seperti "1. Nama", "1) Nama", "1 - Nama"
        """
        # Pecah dulu berdasarkan baris baru, koma, atau titik koma
        raw_items = re.split(r"[\n,;]+", raw_text)

        names = []
        for item in raw_items:
            item = item.strip()
            if not item:
                continue
            # Buang nomor urut di depan, misal: "1. ", "12) ", "3 - "
            item = re.sub(r"^\s*\d+\s*[\.\)\-]\s*", "", item)
            item = item.strip()
            if item:
                names.append(item)

        return names

    @staticmethod
    def _sanitize(name):
        # Hilangkan karakter yang tidak valid untuk nama folder Windows
        invalid_chars = '<>:"/\\|?*'
        for ch in invalid_chars:
            name = name.replace(ch, "")
        return name.strip()


if __name__ == "__main__":
    root = tk.Tk()
    app = FolderMakerApp(root)
    root.mainloop()
