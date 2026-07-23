/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RegistrationCategory = 
  | 'mahasiswa_pkl'       // PKL Mahasiswa
  | 'mahasiswa_magang'    // Magang Mandiri / Internship
  | 'siswa_smk'           // Siswa SMK
  | 'penelitian';         // Penelitian / Riset

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export type SrikandiStatus = 
  | 'draft'               // Baru Diinput / Menunggu Proses
  | 'sent_to_yusri'       // Diisi Admin -> Dikirim ke Pak Yusri (Verifikasi Staff)
  | 'approved_yusri'      // Disetujui Pak Yusri -> Siap ke Bu Rina
  | 'sent_to_rina'        // Dikirim ke Bu Rina (Paraf Kabid Kesatuan Bangsa)
  | 'approved_rina'       // Diparaf Bu Rina -> Siap ke Pak Ali
  | 'sent_to_ali'         // Dikirim ke Pak Ali Akbar (TTD Digital Kepala Badan)
  | 'approved_ali';       // Disetujui & TTD Digital QR Code oleh Pak Ali Akbar (Siap Cetak & Ambil)

export interface SrikandiLog {
  id: string;
  actor: 'Pak Yusri' | 'Bu Rina' | 'Pak Ali' | 'Staff Admin Kesbangpol';
  action: string;
  timestamp: string;
  notes?: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl?: string; // For mock previewing
}

export interface Application {
  id: string;
  registrationCode: string; // Unique generated code like REG-2026-XXXX
  category: RegistrationCategory;
  name: string;
  nimNpm: string; // NIM / NPM / NISN (Mandatori)
  institution: string; // Asal Sekolah / Perguruan Tinggi
  address: string;
  phone: string; // Nomor HP / WA (Mandatori untuk dipanggil)
  email: string;
  major: string; // Jurusan / Program Studi
  startDate: string; // Tanggal Mulai PKL
  endDate: string; // Tanggal Siap / Selesai PKL
  
  // Data Surat Pengantar dari Kampus/Sekolah
  campusLetterNo: string; // Nomor Surat Kampus (contoh: 6882/UN5.2.9.5/PK.01.06/2026)
  campusLetterDate: string; // Tanggal Surat Kampus (contoh: 10 Juli 2026)
  campusLetterSubject: string; // Perihal Surat Kampus (contoh: Permohonan Magang Mandiri Di Kantor DPRD Kota Pematangsiantar)
  
  // Data Surat Balasan Resmi Kesbangpol Kota Pematangsiantar
  targetLocation: string; // Tempat Magang / Unit Tujuan (contoh: Kantor DPRD Kota Pematangsiantar)
  targetRecipient: string; // Yang Terhormat (contoh: Sekretaris DPRD Kota Pematangsiantar)
  officialLetterNo: string; // Nomor Surat Keluar (contoh: 028/400.14.5.4/488/VII-2026)
  officialLetterDate: string; // Tanggal Surat Balasan
  
  // Alur Integrasi Srikandi & TTD Digital
  srikandiStatus: SrikandiStatus;
  srikandiHistory?: SrikandiLog[];
  contactedAt?: string; // Tanggal Ditelpon/Di-WA untuk Pengambilan Surat
  
  status: ApplicationStatus;
  notes?: string; // Admin notes
  createdAt: string;
  documents: UploadedFile[];
}

export interface Statistics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  mahasiswaPkl: number;
  mahasiswaMagang: number;
  siswaSmk: number;
  penelitian: number;
  srikandiSelesai: number;
}
