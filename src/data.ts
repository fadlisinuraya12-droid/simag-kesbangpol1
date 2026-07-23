/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Application } from './types';

export const listUniversities = [
  'Universitas Simalungun (USI) Pematangsiantar',
  'STIE Sultan Agung Pematangsiantar',
  'Universitas HKBP Nommensen Pematangsiantar',
  'STIKOM Tunas Bangsa Pematangsiantar',
  'Universitas Sumatera Utara (USU) Medan',
  'Universitas Negeri Medan (UNIMED)',
  'Universitas Islam Negeri Sumatera Utara (UINSU)',
  'Universitas Muhammadiyah Sumatera Utara (UMSU)',
  'Politeknik Negeri Medan (POLMED)',
  'Universitas Katolik Santo Thomas',
  'Universitas Indonesia (UI)',
  'Universitas Gadjah Mada (UGM)',
  'Lainnya (Tulis Manual)'
];

export const listHighSchools = [
  'SMKN 1 Pematangsiantar',
  'SMKN 2 Pematangsiantar',
  'SMKN 3 Pematangsiantar',
  'SMKN 1 Siantar (Simalungun)',
  'SMK Taman Siswa Pematangsiantar',
  'SMK Telkom Pematangsiantar',
  'SMK Bintang Timur Pematangsiantar',
  'SMK HKBP Pematangsiantar',
  'SMK Surya Pematangsiantar',
  'Lainnya (Tulis Manual)'
];

export const listMajors = [
  'Ilmu Pemerintahan',
  'Administrasi Publik / Negara',
  'Hubungan Internasional',
  'Ilmu Politik',
  'Sosiologi / Antropologi',
  'Hukum',
  'Teknik Informatika / Sistem Informasi',
  'Ilmu Komunikasi / Hubungan Masyarakat',
  'Akuntansi / Manajemen',
  'Psikologi',
  'Teknik Komputer & Jaringan (TKJ) - SMK',
  'RPL (Rekayasa Perangkat Lunak) - SMK',
  'Multimedia / Desain Komunikasi Visual - SMK',
  'Otomatisasi Tata Kelola Perkantoran (OTKP) - SMK',
  'Akuntansi dan Keuangan Lembaga (AKL) - SMK'
];

export const initialMockApplications: Application[] = [
  {
    id: 'app-grace-1',
    registrationCode: 'REG-2026-0088',
    category: 'mahasiswa_magang',
    name: 'GRACE LILIS CHATERINE CLARA NAPITUPULU',
    nimNpm: '240905060',
    institution: 'Universitas Sumatera Utara (USU)',
    address: 'Jl. Dr. Mansyur No. 9, Padang Bulan, Medan (Domisili Pematangsiantar)',
    phone: '081260796914',
    email: 'grace.napitupulu@usu.ac.id',
    major: 'Antropologi Sosial',
    startDate: '2026-07-12',
    endDate: '2026-08-12',
    
    campusLetterNo: '6882/UN5.2.9.5/PK.01.06/2026',
    campusLetterDate: '10 Juli 2026',
    campusLetterSubject: 'Permohonan Magang Mandiri Di Kantor DPRD Kota Pematangsiantar',
    
    targetLocation: 'Kantor DPRD Kota Pematangsiantar',
    targetRecipient: 'Sekretaris DPRD Kota Pematangsiantar',
    officialLetterNo: '028/400.14.5.4/488/VII-2026',
    officialLetterDate: '10 Juli 2026',
    
    srikandiStatus: 'approved_ali',
    srikandiHistory: [
      { id: 'log-1', actor: 'Staff Admin Kesbangpol', action: 'Input permohonan magang & draft surat balasan', timestamp: '2026-07-10T09:00:00Z' },
      { id: 'log-2', actor: 'Pak Yusri', action: 'Verifikasi berkas & kirim ke Kabid', timestamp: '2026-07-10T10:15:00Z' },
      { id: 'log-3', actor: 'Bu Rina', action: 'Paraf persetujuan surat magang ke Kepala Badan', timestamp: '2026-07-10T11:30:00Z' },
      { id: 'log-4', actor: 'Pak Ali', action: 'Penandatanganan Digital (QR Code) oleh Kepala Badan (Ir. ALI AKBAR)', timestamp: '2026-07-10T14:00:00Z' }
    ],
    contactedAt: '2026-07-10T14:10:00Z',
    status: 'approved',
    notes: 'Surat balasan resmi telah disetujui via Srikandi oleh Ir. ALI AKBAR. Pendaftar telah dihubungi untuk mengambil surat.',
    createdAt: '2026-07-10T08:30:00Z',
    documents: [
      { id: 'doc-grace-1', name: 'Surat_Pengantar_USU_Grace.pdf', size: 1450000, type: 'application/pdf' },
      { id: 'doc-grace-2', name: 'CV_Grace_Napitupulu.pdf', size: 920000, type: 'application/pdf' }
    ]
  },
  {
    id: 'app-1',
    registrationCode: 'REG-2026-0082',
    category: 'mahasiswa_pkl',
    name: 'Rian Damanik',
    nimNpm: '210204018',
    institution: 'Universitas Simalungun (USI) Pematangsiantar',
    address: 'Jl. Sutomo No. 45, Kec. Siantar Barat, Kota Pematangsiantar',
    phone: '081260001122',
    email: 'rian.damanik@usi.ac.id',
    major: 'Ilmu Pemerintahan',
    startDate: '2026-08-01',
    endDate: '2026-10-31',
    
    campusLetterNo: '104/USI-IP/VII/2026',
    campusLetterDate: '12 Juli 2026',
    campusLetterSubject: 'Permohonan Izin PKL Mahasiswa Ilmu Pemerintahan',
    
    targetLocation: 'Badan Kesatuan Bangsa dan Politik Kota Pematangsiantar',
    targetRecipient: 'Kepala Badan Kesatuan Bangsa dan Politik Kota Pematangsiantar',
    officialLetterNo: '028/400.14.5.4/489/VII-2026',
    officialLetterDate: '14 Juli 2026',
    
    srikandiStatus: 'sent_to_yusri',
    srikandiHistory: [
      { id: 'log-r1', actor: 'Staff Admin Kesbangpol', action: 'Input permohonan & teruskan ke Pak Yusri', timestamp: '2026-07-15T09:30:00Z' }
    ],
    status: 'pending',
    createdAt: '2026-07-15T09:30:00Z',
    documents: [
      { id: 'doc-1-1', name: 'Surat_Pengantar_USI_Rian.pdf', size: 1250000, type: 'application/pdf' },
      { id: 'doc-1-2', name: 'CV_Rian_Damanik.pdf', size: 850000, type: 'application/pdf' }
    ]
  },
  {
    id: 'app-2',
    registrationCode: 'REG-2026-0081',
    category: 'siswa_smk',
    name: 'Siti Rahmah',
    nimNpm: '0067812901',
    institution: 'SMKN 1 Pematangsiantar',
    address: 'Jl. Merdeka No. 12, Kec. Siantar Timur, Kota Pematangsiantar',
    phone: '085270112233',
    email: 'siti.rahmah@smkn1pematangsiantar.sch.id',
    major: 'Otomatisasi Tata Kelola Perkantoran (OTKP) - SMK',
    startDate: '2026-08-15',
    endDate: '2026-11-15',
    
    campusLetterNo: '421/SMKN1-PS/VII/2026',
    campusLetterDate: '10 Juli 2026',
    campusLetterSubject: 'Permohonan Praktek Kerja Lapangan (PKL) Siswa OTKP',
    
    targetLocation: 'Badan Kesatuan Bangsa dan Politik Kota Pematangsiantar',
    targetRecipient: 'Kepala Badan Kesatuan Bangsa dan Politik Kota Pematangsiantar',
    officialLetterNo: '028/400.14.5.4/485/VII-2026',
    officialLetterDate: '12 Juli 2026',
    
    srikandiStatus: 'approved_ali',
    srikandiHistory: [
      { id: 'log-s1', actor: 'Staff Admin Kesbangpol', action: 'Draft diserahkan', timestamp: '2026-07-12T10:00:00Z' },
      { id: 'log-s2', actor: 'Pak Yusri', action: 'Verifikasi disetujui', timestamp: '2026-07-12T11:00:00Z' },
      { id: 'log-s3', actor: 'Bu Rina', action: 'Paraf disetujui', timestamp: '2026-07-12T13:00:00Z' },
      { id: 'log-s4', actor: 'Pak Ali', action: 'TTD Digital Srikandi Selesai', timestamp: '2026-07-12T14:15:00Z' }
    ],
    status: 'approved',
    notes: 'Persyaratan lengkap dan sesuai dengan kuota bidang Humas & Sekretariat.',
    createdAt: '2026-07-12T14:15:00Z',
    documents: [
      { id: 'doc-2-1', name: 'Surat_Rekomendasi_SMKN1.pdf', size: 1040000, type: 'application/pdf' }
    ]
  },
  {
    id: 'app-3',
    registrationCode: 'REG-2026-0079',
    category: 'mahasiswa_magang',
    name: 'Farhan Purba',
    nimNpm: '220101089',
    institution: 'STIE Sultan Agung Pematangsiantar',
    address: 'Jl. Surabaya No. 10, Kec. Siantar Selatan, Kota Pematangsiantar',
    phone: '081398765432',
    email: 'farhan.purba@stiesultanagung.ac.id',
    major: 'Akuntansi / Manajemen',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    
    campusLetterNo: '088/STIE-SA/VII/2026',
    campusLetterDate: '15 Juli 2026',
    campusLetterSubject: 'Permohonan Magang Mahasiswa Akuntansi',
    
    targetLocation: 'Badan Kesatuan Bangsa dan Politik Kota Pematangsiantar',
    targetRecipient: 'Kepala Badan Kesatuan Bangsa dan Politik Kota Pematangsiantar',
    officialLetterNo: '028/400.14.5.4/492/VII-2026',
    officialLetterDate: '18 Juli 2026',
    
    srikandiStatus: 'sent_to_rina',
    srikandiHistory: [
      { id: 'log-f1', actor: 'Staff Admin Kesbangpol', action: 'Input permohonan', timestamp: '2026-07-18T11:05:00Z' },
      { id: 'log-f2', actor: 'Pak Yusri', action: 'Diperiksa & dikirim ke Bu Rina', timestamp: '2026-07-18T14:00:00Z' }
    ],
    status: 'pending',
    createdAt: '2026-07-18T11:05:00Z',
    documents: [
      { id: 'doc-3-1', name: 'Proposal_Magang_Farhan.pdf', size: 2100000, type: 'application/pdf' },
      { id: 'doc-3-2', name: 'KTM_Farhan.jpg', size: 450000, type: 'image/jpeg' }
    ]
  }
];
