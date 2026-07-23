/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Application } from '../types';

/**
 * Maps registration categories to Indonesian readable terms.
 */
export const getCategoryLabel = (category: string): string => {
  switch (category) {
    case 'mahasiswa_pkl':
      return 'PKL Mahasiswa';
    case 'mahasiswa_magang':
      return 'Magang Mandiri / Internship';
    case 'siswa_smk':
      return 'PKL Siswa SMK';
    case 'penelitian':
      return 'Izin Penelitian / Riset';
    default:
      return 'PKL / Magang';
  }
};

/**
 * Calculates duration in months between start and end date
 */
export const calculateDurationMonths = (startStr: string, endStr: string): number => {
  if (!startStr || !endStr) return 1;
  const start = new Date(startStr);
  const end = new Date(endStr);
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  return Math.max(1, months || 1);
};

/**
 * Number to Indonesian words (1 -> Satu, 2 -> Dua, etc.)
 */
export const numberToIndonesianWord = (num: number): string => {
  const words = ['Nol', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas', 'Dua Belas'];
  return words[num] || String(num);
};

/**
 * Helper to generate the exact HTML string for the Official Kesbangpol Pematangsiantar Letter
 */
export const generateOfficialLetterHTML = (app: Application) => {
  const duration = calculateDurationMonths(app.startDate, app.endDate);
  const durationText = `${duration} (${numberToIndonesianWord(duration)})`;
  
  const formattedStart = app.startDate 
    ? new Date(app.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '12 Juli 2026';
    
  const formattedEnd = app.endDate 
    ? new Date(app.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '12 Agustus 2026';

  const letterDate = app.officialLetterDate || '10 Juli 2026';
  const letterNo = app.officialLetterNo || '028/400.14.5.4/488/VII-2026';
  const campusNo = app.campusLetterNo || '6882/UN5.2.9.5/PK.01.06/2026';
  const campusDate = app.campusLetterDate || '10 Juli 2026';
  const campusSubject = app.campusLetterSubject || 'Permohonan Magang Mandiri';
  const recipient = app.targetRecipient || 'Sekretaris DPRD';
  const location = app.targetLocation || 'Kantor DPRD Kota Pematangsiantar';
  const nim = app.nimNpm || '240905060';

  return `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" 
          xmlns:w="urn:schemas-microsoft-com:office:word" 
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>Surat Balasan Kesbangpol - ${app.name}</title>
      <style>
        @page Section1 {
          size: 8.5in 13.0in; /* Folio / F4 */
          margin: 0.8in 1.0in 0.8in 1.0in;
        }
        div.Section1 { page: Section1; }
        body {
          font-family: 'Bookman Old Style', 'Times New Roman', serif;
          font-size: 11pt;
          line-height: 1.35;
          color: #000000;
        }
        .header-table {
          width: 100%;
          border-collapse: collapse;
          border-bottom: 3px double #000000;
          padding-bottom: 8px;
          margin-bottom: 15px;
        }
        .header-logo {
          width: 75px;
          text-align: center;
          vertical-align: middle;
        }
        .header-text {
          text-align: center;
          vertical-align: middle;
        }
        .header-title-1 {
          font-size: 13pt;
          font-weight: bold;
          margin: 0;
          text-transform: uppercase;
        }
        .header-title-2 {
          font-size: 15pt;
          font-weight: bold;
          margin: 2px 0;
          text-transform: uppercase;
        }
        .header-address {
          font-size: 8.5pt;
          font-family: 'Arial', sans-serif;
          margin: 1px 0;
        }
        .date-right {
          text-align: right;
          margin-bottom: 15px;
          font-size: 11pt;
        }
        .surat-meta {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
        }
        .surat-meta td {
          vertical-align: top;
          padding: 2px 0;
        }
        .meta-label { width: 15%; }
        .meta-colon { width: 3%; text-align: center; }
        .meta-value { width: 82%; }
        
        .recipient-block {
          margin-top: 10px;
          margin-bottom: 20px;
          line-height: 1.4;
        }
        
        .body-paragraph {
          text-align: justify;
          text-indent: 0.5in;
          margin-bottom: 15px;
          line-height: 1.4;
        }
        
        .table-peserta {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0 20px 0;
        }
        .table-peserta th, .table-peserta td {
          border: 1px solid #000000;
          padding: 6px 8px;
          font-size: 10pt;
          text-align: center;
        }
        .table-peserta th {
          background-color: #f2f2f2;
          font-weight: bold;
          text-transform: uppercase;
        }
        
        .signature-block {
          margin-top: 30px;
          float: right;
          width: 45%;
          text-align: center;
        }
        .qr-placeholder {
          margin: 10px auto;
          width: 80px;
          height: 80px;
        }
        
        .tembusan {
          clear: both;
          margin-top: 40px;
          font-size: 9.5pt;
        }
        .tembusan-title {
          font-weight: bold;
          text-decoration: underline;
          margin-bottom: 3px;
        }
      </style>
    </head>
    <body>
      <div class="Section1">
        
        <!-- KOP SURAT RESMI PEMKO PEMATANGSIANTAR -->
        <table class="header-table">
          <tr>
            <td class="header-logo">
              <!-- Logo Kota Pematangsiantar SVG Representation -->
              <svg width="65" height="75" viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 5 L90 25 L85 90 L50 110 L15 90 L10 25 Z" fill="#15803d" stroke="#000000" stroke-width="3"/>
                <path d="M25 35 L75 35 L70 85 L50 100 L30 85 Z" fill="#dc2626"/>
                <polygon points="50,45 55,60 70,60 58,70 62,85 50,75 38,85 42,70 30,60 45,60" fill="#facc15"/>
              </svg>
            </td>
            <td class="header-text">
              <div class="header-title-1">PEMERINTAH KOTA PEMATANGSIANTAR</div>
              <div class="header-title-2">BADAN KESATUAN BANGSA DAN POLITIK</div>
              <div class="header-address">Jalan H. Adam Malik No. 2 Pematangsiantar, Kode Pos 21117</div>
              <div class="header-address">E-mail kesbangpol.siantar@gmail.com, Website https://kesbangpol.pematangsiantar.go.id</div>
            </td>
          </tr>
        </table>

        <!-- TANGGAL SURAT -->
        <div class="date-right">
          Pematangsiantar, ${letterDate}
        </div>

        <!-- NOMOR SURAT & METADATA -->
        <table class="surat-meta">
          <tr>
            <td class="meta-label">Nomor</td>
            <td class="meta-colon">:</td>
            <td class="meta-value">${letterNo}</td>
          </tr>
          <tr>
            <td class="meta-label">Sifat</td>
            <td class="meta-colon">:</td>
            <td class="meta-value">Biasa</td>
          </tr>
          <tr>
            <td class="meta-label">Lampiran</td>
            <td class="meta-colon">:</td>
            <td class="meta-value">-</td>
          </tr>
          <tr>
            <td class="meta-label">Hal</td>
            <td class="meta-colon">:</td>
            <td class="meta-value"><b>${campusSubject}</b></td>
          </tr>
        </table>

        <!-- TUJUAN SURAT -->
        <div class="recipient-block">
          Yth. <b>${recipient}</b><br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Kota Pematangsiantar</b><br>
          di -<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>TEMPAT</b>
        </div>

        <!-- ISI SURAT -->
        <div class="body-paragraph">
          Menindaklanjuti Surat Saudara Nomor <b>${campusNo}</b> tanggal <b>${campusDate}</b> Perihal <b>${campusSubject}</b>, dengan ini disampaikan bahwa Mahasiswa/i tersebut dapat Mengikuti Magang /Praktek Internship di <b>${location}</b> selama <b>${durationText}</b> bulan dimulai dari tanggal <b>${formattedStart}</b> s/d <b>${formattedEnd}</b> sebagaimana surat permohonan tersebut diatas.
        </div>

        <div>
          Yang Melaksanakan Magang /Praktek Internship sebagai berikut :
        </div>

        <!-- TABEL PESERTA -->
        <table class="table-peserta">
          <thead>
            <tr>
              <th style="width: 8%;">NO</th>
              <th style="width: 46%;">NAMA</th>
              <th style="width: 23%;">NIM/NPM</th>
              <th style="width: 23%;">NO.HP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1.</td>
              <td style="text-align: left; font-weight: bold;">${app.name.toUpperCase()}</td>
              <td>${nim}</td>
              <td>${app.phone}</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 15px;">
          Demikian kami sampaikan, untuk keperluan selanjutnya.
        </div>

        <!-- TANDA TANGAN DIGITAL KEPALA BADAN (SRIKANDI) -->
        <div class="signature-block">
          <div><b>KEPALA BADAN</b></div>
          <div style="margin: 12px 0;">
            <!-- QR Code Srikandi Digital Signature Badge -->
            <div style="border: 1px border-slate-400; padding: 4px; display: inline-block; background: #fafafa;">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=SRIKANDI_PEMKO_PEMATANGSIANTAR_ALI_AKBAR_${letterNo}" alt="TTD Srikandi" width="80" height="80" />
            </div>
          </div>
          <div><b><u>Ir. ALI AKBAR</u></b></div>
          <div>Pembina Utama Muda</div>
          <div>NIP. 19670923 199303 1 004</div>
        </div>

        <div style="clear: both;"></div>

        <!-- TEMBUSAN -->
        <div class="tembusan">
          <div class="tembusan-title">Tembusan Yth.</div>
          <ol style="margin: 3px 0; padding-left: 18px;">
            <li>Ketua Program Studi ${app.major} ${app.institution}</li>
          </ol>
        </div>

      </div>
    </body>
    </html>
  `;
};

/**
 * Exports official Kesbangpol letter directly to Microsoft Word (.doc)
 */
export const exportOfficialLetterToWord = (app: Application) => {
  const htmlContent = generateOfficialLetterHTML(app);
  const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Surat_Balasan_Kesbangpol_${app.registrationCode}_${app.name.replace(/\s+/g, '_')}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Prints or saves PDF for official Kesbangpol letter
 */
export const printOfficialLetterPDF = (app: Application) => {
  const htmlContent = generateOfficialLetterHTML(app);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
};

/**
 * Translates status into Indonesian.
 */
export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'Menunggu Verifikasi';
    case 'approved':
      return 'Disetujui / Aktif';
    case 'rejected':
      return 'Ditolak';
    default:
      return status;
  }
};

/**
 * Exports single application details to a beautifully formatted Microsoft Word (.doc) document.
 * This utilizes MS Word's built-in rendering of HTML with custom margins and typography.
 */
export const exportToWord = (app: Application) => {
  const categoryStr = getCategoryLabel(app.category);
  const statusStr = getStatusLabel(app.status);
  const formattedDate = new Date(app.createdAt).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const htmlContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" 
          xmlns:w="urn:schemas-microsoft-com:office:word" 
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>Lembar Verifikasi Pendaftaran PKL/Magang Kesbangpol</title>
      <style>
        @page Section1 {
          size: 8.5in 11.0in;
          margin: 1.0in 1.0in 1.0in 1.0in;
          mso-header-margin: .5in;
          mso-footer-margin: .5in;
          mso-paper-source: 0;
        }
        div.Section1 {
          page: Section1;
        }
        body {
          font-family: 'Arial', sans-serif;
          font-size: 11pt;
          line-height: 1.5;
          color: #000000;
        }
        .kop-surat {
          text-align: center;
          border-bottom: 3px double #000000;
          padding-bottom: 12px;
          margin-bottom: 24px;
        }
        .kop-title {
          font-size: 14pt;
          font-weight: bold;
          margin: 0;
          text-transform: uppercase;
        }
        .kop-subtitle {
          font-size: 16pt;
          font-weight: bold;
          margin: 2px 0;
          text-transform: uppercase;
        }
        .kop-address {
          font-size: 9pt;
          font-weight: normal;
          font-style: italic;
          margin: 0;
        }
        .doc-title {
          text-align: center;
          font-size: 12pt;
          font-weight: bold;
          text-decoration: underline;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .doc-number {
          text-align: center;
          font-size: 10pt;
          margin-bottom: 24px;
        }
        .info-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
        }
        .info-table td {
          padding: 6px 4px;
          vertical-align: top;
        }
        .label {
          width: 32%;
          font-weight: bold;
        }
        .colon {
          width: 3%;
          text-align: center;
        }
        .value {
          width: 65%;
        }
        .divider {
          border-top: 1px solid #cccccc;
          margin: 15px 0;
        }
        .footer-section {
          margin-top: 50px;
          width: 100%;
        }
        .signature-table {
          width: 100%;
          border-collapse: collapse;
        }
        .signature-td {
          width: 50%;
          text-align: center;
          vertical-align: top;
        }
      </style>
    </head>
    <body lang="id-ID">
      <div class="Section1">
        <div class="kop-surat">
          <p class="kop-title">Pemerintah Kota Pematangsiantar</p>
          <p class="kop-subtitle">Badan Kesatuan Bangsa dan Politik</p>
          <p class="kop-address">Jl. Merdeka No. 1, Kota Pematangsiantar, Sumatera Utara, Email: kesbangpol@pematangsiantar.go.id</p>
        </div>

        <p class="doc-title">Lembar Bukti Pendaftaran PKL / Magang</p>
        <p class="doc-number">Nomor Pendaftaran: <b>${app.registrationCode}</b></p>

        <p>Dengan ini menerangkan bahwa permohonan PKL / Magang Kerja di Lingkungan Badan Kesatuan Bangsa dan Politik (Kesbangpol) telah terekam dalam sistem dengan rincian data sebagai berikut:</p>

        <table class="info-table">
          <tr>
            <td class="label">Nama Lengkap</td>
            <td class="colon">:</td>
            <td class="value"><b>${app.name.toUpperCase()}</b></td>
          </tr>
          <tr>
            <td class="label">Kategori Pendaftaran</td>
            <td class="colon">:</td>
            <td class="value">${categoryStr}</td>
          </tr>
          <tr>
            <td class="label">Asal Sekolah/Kampus</td>
            <td class="colon">:</td>
            <td class="value">${app.institution}</td>
          </tr>
          <tr>
            <td class="label">Jurusan/Prodi</td>
            <td class="colon">:</td>
            <td class="value">${app.major}</td>
          </tr>
          <tr>
            <td class="label">Nomor Telepon/WA</td>
            <td class="colon">:</td>
            <td class="value">${app.phone}</td>
          </tr>
          <tr>
            <td class="label">Alamat Email</td>
            <td class="colon">:</td>
            <td class="value">${app.email}</td>
          </tr>
          <tr>
            <td class="label">Alamat Domisili</td>
            <td class="colon">:</td>
            <td class="value">${app.address}</td>
          </tr>
          <tr>
            <td class="label">Periode Kegiatan</td>
            <td class="colon">:</td>
            <td class="value"><b>${new Date(app.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} s.d. ${new Date(app.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</b></td>
          </tr>
          <tr>
            <td class="label">Status Pengajuan</td>
            <td class="colon">:</td>
            <td class="value" style="color: ${app.status === 'approved' ? '#16a34a' : app.status === 'rejected' ? '#dc2626' : '#ea580c'}; font-weight: bold;">
              ${statusStr.toUpperCase()}
            </td>
          </tr>
          ${app.notes ? `
          <tr>
            <td class="label">Catatan Admin</td>
            <td class="colon">:</td>
            <td class="value"><i>${app.notes}</i></td>
          </tr>
          ` : ''}
          <tr>
            <td class="label">Waktu Pendaftaran</td>
            <td class="colon">:</td>
            <td class="value">${formattedDate}</td>
          </tr>
        </table>

        <p>Lembar verifikasi ini diterbitkan secara otomatis oleh Sistem Informasi SIMAG Kesbangpol sebagai bukti otentik pendaftaran awal.</p>
        
        <div class="divider"></div>

        <div class="footer-section">
          <table class="signature-table">
            <tr>
              <td class="signature-td">
                <p>Pendaftar PKL/Magang,</p>
                <br><br><br><br>
                <p><b>( ${app.name} )</b></p>
              </td>
              <td class="signature-td">
                <p>Mengetahui,<br>Admin Kesbangpol,</p>
                <br><br><br><br>
                <p><b>( Bagian Kepegawaian & Umum )</b></p>
                <p style="font-size: 8pt; color: #555555; margin-top: 2px;">Diverifikasi secara Elektronik</p>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </body>
    </html>
  `;

  // Create a blob and initiate download
  const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Formulir_Pendaftaran_${app.registrationCode}_${app.name.replace(/\s+/g, '_')}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Exports all applications to an Excel-compatible CSV file.
 */
export const exportAllToCSV = (apps: Application[]) => {
  const headers = [
    'Kode Registrasi',
    'Kategori',
    'Nama Lengkap',
    'Asal Instansi',
    'Jurusan',
    'Email',
    'Nomor Telepon',
    'Alamat',
    'Mulai',
    'Selesai',
    'Status',
    'Catatan Admin',
    'Tanggal Pendaftaran'
  ];

  const rows = apps.map(app => [
    app.registrationCode,
    getCategoryLabel(app.category),
    `"${app.name.replace(/"/g, '""')}"`,
    `"${app.institution.replace(/"/g, '""')}"`,
    `"${app.major.replace(/"/g, '""')}"`,
    app.email,
    app.phone,
    `"${app.address.replace(/"/g, '""')}"`,
    app.startDate,
    app.endDate,
    getStatusLabel(app.status),
    `"${(app.notes || '').replace(/"/g, '""')}"`,
    new Date(app.createdAt).toLocaleString('id-ID')
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(e => e.join(','))
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Laporan_Pendaftar_Kesbangpol_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
