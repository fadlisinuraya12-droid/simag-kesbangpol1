/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  GraduationCap, 
  School, 
  BookOpen,
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  FileText, 
  Trash2, 
  CheckCircle2, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Bookmark,
  Sparkles,
  Download,
  Building2,
  FileCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { RegistrationCategory, UploadedFile, Application } from '../types';
import { listUniversities, listHighSchools, listMajors } from '../data';
import { exportOfficialLetterToWord, printOfficialLetterPDF } from '../utils/export';

interface RegistrationFormProps {
  onRegister: (application: Omit<Application, 'id' | 'registrationCode' | 'status' | 'createdAt'>) => Application;
}

export default function RegistrationForm({ onRegister }: RegistrationFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // Category selection
  const [selectedCategory, setSelectedCategory] = useState<RegistrationCategory>('mahasiswa_magang');

  // Form Fields
  const [name, setName] = useState('');
  const [nimNpm, setNimNpm] = useState('');
  const [institution, setInstitution] = useState('');
  const [customInstitution, setCustomInstitution] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [major, setMajor] = useState('');
  const [customMajor, setCustomMajor] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Data Surat Pengantar dari Kampus / Sekolah
  const [campusLetterNo, setCampusLetterNo] = useState('');
  const [campusLetterDate, setCampusLetterDate] = useState('');
  const [campusLetterSubject, setCampusLetterSubject] = useState('');
  
  // Tempat Magang / Unit Tujuan Penempatan
  const [targetLocation, setTargetLocation] = useState('');
  const [targetRecipient, setTargetRecipient] = useState('');

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Completed registration details
  const [completedApp, setCompletedApp] = useState<Application | null>(null);

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Drag and Drop files handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files);
    }
  };

  const handleFileSelection = (files: FileList) => {
    const newFiles: UploadedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      newFiles.push({
        id: `file-${Date.now()}-${i}`,
        name: file.name,
        size: file.size,
        type: file.type
      });
    }
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Nama lengkap wajib diisi';
    if (!nimNpm.trim()) newErrors.nimNpm = 'NIM / NPM / NISN wajib diisi';
    
    const finalInst = institution === 'Lainnya (Tulis Manual)' ? customInstitution : institution;
    if (!finalInst.trim()) newErrors.institution = 'Asal sekolah/universitas wajib diisi';
    
    if (!address.trim()) newErrors.address = 'Alamat domisili wajib diisi';
    
    if (!phone.trim()) {
      newErrors.phone = 'Nomor telepon / WhatsApp wajib diisi agar dapat ditelpon bila surat selesai';
    } else if (!/^[0-9+-\s]{8,18}$/.test(phone)) {
      newErrors.phone = 'Format nomor telepon tidak valid';
    }

    if (!email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Format email tidak valid';
    }

    const finalMajor = major === 'Lainnya (Tulis Manual)' ? customMajor : major;
    if (!finalMajor.trim()) newErrors.major = 'Jurusan atau program studi wajib diisi';
    
    if (!startDate) newErrors.startDate = 'Tanggal mulai wajib ditentukan';
    if (!endDate) {
      newErrors.endDate = 'Tanggal selesai (siap) wajib ditentukan';
    } else if (startDate && new Date(endDate) <= new Date(startDate)) {
      newErrors.endDate = 'Tanggal selesai harus setelah tanggal mulai';
    }

    if (!targetLocation.trim()) newErrors.targetLocation = 'Tempat magang / unit penempatan wajib diisi';

    if (uploadedFiles.length === 0) {
      newErrors.files = 'Harap unggah berkas surat pengantar dari kampus/sekolah';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const finalInstitution = institution === 'Lainnya (Tulis Manual)' ? customInstitution : institution;
    const finalMajor = major === 'Lainnya (Tulis Manual)' ? customMajor : major;

    // Generate auto official letter number
    const year = new Date().getFullYear();
    const randNo = Math.floor(400 + Math.random() * 90);
    const generatedOfficialNo = `028/400.14.5.4/${randNo}/VII-${year}`;
    const todayStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const registered = onRegister({
      category: selectedCategory,
      name,
      nimNpm,
      institution: finalInstitution,
      address,
      phone,
      email,
      major: finalMajor,
      startDate,
      endDate,
      
      campusLetterNo: campusLetterNo.trim() || '6882/UN5.2.9.5/PK.01.06/2026',
      campusLetterDate: campusLetterDate.trim() || todayStr,
      campusLetterSubject: campusLetterSubject.trim() || 'Permohonan Magang Mandiri / PKL',
      
      targetLocation: targetLocation.trim() || 'Badan Kesatuan Bangsa dan Politik Kota Pematangsiantar',
      targetRecipient: targetRecipient.trim() || 'Kepala Badan Kesatuan Bangsa dan Politik Kota Pematangsiantar',
      officialLetterNo: generatedOfficialNo,
      officialLetterDate: todayStr,
      
      srikandiStatus: 'draft',
      srikandiHistory: [
        {
          id: `log-${Date.now()}`,
          actor: 'Staff Admin Kesbangpol',
          action: 'Pendaftaran diterima di loket, berkas diunggah pendaftar',
          timestamp: new Date().toISOString()
        }
      ],
      documents: uploadedFiles
    });

    setCompletedApp(registered);
    setStep(3);
  };

  const resetForm = () => {
    setName('');
    setNimNpm('');
    setInstitution('');
    setCustomInstitution('');
    setAddress('');
    setPhone('');
    setEmail('');
    setMajor('');
    setCustomMajor('');
    setStartDate('');
    setEndDate('');
    setCampusLetterNo('');
    setCampusLetterDate('');
    setCampusLetterSubject('');
    setTargetLocation('');
    setTargetRecipient('');
    setUploadedFiles([]);
    setErrors({});
    setCompletedApp(null);
    setStep(1);
  };

  const autoFillDemoData = () => {
    setSelectedCategory('mahasiswa_magang');
    setName('GRACE LILIS CHATERINE CLARA NAPITUPULU');
    setNimNpm('240905060');
    setInstitution('Universitas Sumatera Utara (USU) Medan');
    setAddress('Jl. Dr. Mansyur No. 9, Medan (Domisili Pematangsiantar)');
    setPhone('0812 6079 6914');
    setEmail('grace.napitupulu@usu.ac.id');
    setMajor('Sosiologi / Antropologi');
    setStartDate('2026-07-12');
    setEndDate('2026-08-12');
    
    setCampusLetterNo('6882/UN5.2.9.5/PK.01.06/2026');
    setCampusLetterDate('10 Juli 2026');
    setCampusLetterSubject('Permohonan Magang Mandiri Di Kantor DPRD Kota Pematangsiantar');
    
    setTargetLocation('Kantor DPRD Kota Pematangsiantar');
    setTargetRecipient('Sekretaris DPRD Kota Pematangsiantar');
    
    setUploadedFiles([
      { id: 'demo-doc-1', name: 'Surat_Pengantar_USU_Grace_Napitupulu.pdf', size: 1450000, type: 'application/pdf' },
      { id: 'demo-doc-2', name: 'KTM_dan_CV_Grace.pdf', size: 920000, type: 'application/pdf' }
    ]);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Progress Indicators */}
      <div className="mb-8" id="progress-indicator">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${step >= 1 ? 'bg-red-600 text-white shadow-md shadow-red-100' : 'bg-slate-100 text-slate-400'}`}>1</div>
            <span className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-1.5">Langkah 1: Kategori</span>
          </div>
          <div className={`flex-1 h-0.5 mx-2 transition-all duration-500 ${step >= 2 ? 'bg-red-500' : 'bg-slate-100'}`} />
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${step >= 2 ? 'bg-red-600 text-white shadow-md shadow-red-100' : 'bg-slate-100 text-slate-400'}`}>2</div>
            <span className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-1.5">Langkah 2: Data Surat</span>
          </div>
          <div className={`flex-1 h-0.5 mx-2 transition-all duration-500 ${step >= 3 ? 'bg-red-500' : 'bg-slate-100'}`} />
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${step >= 3 ? 'bg-green-600 text-white shadow-md shadow-green-100' : 'bg-slate-100 text-slate-400'}`}>3</div>
            <span className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-1.5">Langkah 3: Tanda Bukti</span>
          </div>
        </div>
      </div>

      {/* STEP 1: CATEGORY SELECTION */}
      {step === 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-xl p-6 md:p-8"
          id="step-category-selection"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <Building2 className="w-3.5 h-3.5" /> Kesbangpol Kota Pematangsiantar
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Pilih Kategori Permohonan</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Sesuai jenis surat pengantar resmi yang dibawa dari kampus atau sekolah Anda</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {/* Magang Mandiri */}
            <div 
              onClick={() => setSelectedCategory('mahasiswa_magang')}
              className={`cursor-pointer rounded-2xl border-2 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-md ${selectedCategory === 'mahasiswa_magang' ? 'border-red-500 bg-red-50/20' : 'border-slate-200 bg-white hover:border-slate-300'}`}
            >
              <div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${selectedCategory === 'mahasiswa_magang' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">Magang Mandiri / Internship</h3>
                <p className="text-xs text-slate-500 mt-1">Mahasiswa D3/D4/S1 yang membawa surat permohonan magang mandiri ke OPD/Kesbangpol.</p>
              </div>
              <div className="mt-4 text-xs font-semibold text-red-600">
                {selectedCategory === 'mahasiswa_magang' ? '✓ Terpilih' : 'Klik untuk memilih'}
              </div>
            </div>

            {/* PKL Mahasiswa */}
            <div 
              onClick={() => setSelectedCategory('mahasiswa_pkl')}
              className={`cursor-pointer rounded-2xl border-2 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-md ${selectedCategory === 'mahasiswa_pkl' ? 'border-red-500 bg-red-50/20' : 'border-slate-200 bg-white hover:border-slate-300'}`}
            >
              <div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${selectedCategory === 'mahasiswa_pkl' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">PKL (Praktek Kerja Lapangan)</h3>
                <p className="text-xs text-slate-500 mt-1">Praktik Kerja Lapangan kurikulum akademik wajib dari perguruan tinggi.</p>
              </div>
              <div className="mt-4 text-xs font-semibold text-red-600">
                {selectedCategory === 'mahasiswa_pkl' ? '✓ Terpilih' : 'Klik untuk memilih'}
              </div>
            </div>

            {/* Siswa SMK */}
            <div 
              onClick={() => setSelectedCategory('siswa_smk')}
              className={`cursor-pointer rounded-2xl border-2 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-md ${selectedCategory === 'siswa_smk' ? 'border-red-500 bg-red-50/20' : 'border-slate-200 bg-white hover:border-slate-300'}`}
            >
              <div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${selectedCategory === 'siswa_smk' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <School className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">Siswa SMK / Kejuruan</h3>
                <p className="text-xs text-slate-500 mt-1">Siswa Sekolah Menengah Kejuruan (SMK) yang mengikuti program Prakerin/PKL.</p>
              </div>
              <div className="mt-4 text-xs font-semibold text-red-600">
                {selectedCategory === 'siswa_smk' ? '✓ Terpilih' : 'Klik untuk memilih'}
              </div>
            </div>

            {/* Penelitian / Riset */}
            <div 
              onClick={() => setSelectedCategory('penelitian')}
              className={`cursor-pointer rounded-2xl border-2 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-md ${selectedCategory === 'penelitian' ? 'border-red-500 bg-red-50/20' : 'border-slate-200 bg-white hover:border-slate-300'}`}
            >
              <div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${selectedCategory === 'penelitian' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">Izin Penelitian / Skripsi / Riset</h3>
                <p className="text-xs text-slate-500 mt-1">Permohonan izin penelitian / riset akademis di Wilayah Kota Pematangsiantar.</p>
              </div>
              <div className="mt-4 text-xs font-semibold text-red-600">
                {selectedCategory === 'penelitian' ? '✓ Terpilih' : 'Klik untuk memilih'}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={autoFillDemoData}
              className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 font-bold px-3 py-2 rounded-xl transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Isi Contoh Data Otomatis (Grace Napitupulu - USU)
            </button>

            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-red-100 cursor-pointer"
            >
              Lanjutkan ke Langkah 2
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: REGISTRATION FORM */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-xl p-6 md:p-8"
          id="step-registration-form"
        >
          {/* Back to category button */}
          <button 
            type="button"
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-semibold mb-6 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Kembali ke Langkah 1 (Pilih Kategori)
          </button>

          <div className="mb-6 border-b border-slate-100 pb-4">
            <div className="inline-block bg-red-100 text-red-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
              Kategori: {selectedCategory === 'siswa_smk' ? 'Siswa SMK' : selectedCategory === 'penelitian' ? 'Izin Penelitian' : selectedCategory === 'mahasiswa_pkl' ? 'PKL Mahasiswa' : 'Magang Mandiri'}
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Input Data Surat Pengantar & Biodata Peserta</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Isi data di bawah ini sesuai surat pengantar dari kampus / sekolah Anda.</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* BAGIAN A: DATA SURAT PENGANTAR DARI KAMPUS / SEKOLAH */}
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <FileCheck className="w-4 h-4 text-red-600" />
                A. Data Surat Pengantar Asal Kampus / Sekolah
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Surat Pengantar Kampus *</label>
                  <input
                    type="text"
                    placeholder="Contoh: 6882/UN5.2.9.5/PK.01.06/2026"
                    value={campusLetterNo}
                    onChange={(e) => setCampusLetterNo(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Tertera pada kepala surat dari instansi/perguruan tinggi asal.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Surat Pengantar *</label>
                  <input
                    type="text"
                    placeholder="Contoh: 10 Juli 2026"
                    value={campusLetterDate}
                    onChange={(e) => setCampusLetterDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Perihal Surat Pengantar Kampus *</label>
                <input
                  type="text"
                  placeholder="Contoh: Permohonan Magang Mandiri Di Kantor DPRD Kota Pematangsiantar"
                  value={campusLetterSubject}
                  onChange={(e) => setCampusLetterSubject(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200/60">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tempat Magang / Unit Penempatan *</label>
                  <input
                    type="text"
                    placeholder="Contoh: Kantor DPRD Kota Pematangsiantar"
                    value={targetLocation}
                    onChange={(e) => setTargetLocation(e.target.value)}
                    className={`w-full bg-white border ${errors.targetLocation ? 'border-red-400' : 'border-slate-200'} focus:border-red-500 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none`}
                  />
                  {errors.targetLocation && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.targetLocation}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Yang Terhormat (Tujuan Surat) *</label>
                  <input
                    type="text"
                    placeholder="Contoh: Sekretaris DPRD Kota Pematangsiantar"
                    value={targetRecipient}
                    onChange={(e) => setTargetRecipient(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* BAGIAN B: BIODATA PESERTA */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <Bookmark className="w-4 h-4 text-red-600" />
                B. Biodata Peserta & Kontak
              </div>

              {/* Nama & NIM */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Nama Lengkap Peserta *</label>
                  <input
                    type="text"
                    placeholder="Contoh: GRACE LILIS CHATERINE CLARA NAPITUPULU"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full bg-slate-50 border ${errors.name ? 'border-red-400' : 'border-slate-200'} focus:border-red-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">NIM / NPM / NISN *</label>
                  <input
                    type="text"
                    placeholder="Contoh: 240905060"
                    value={nimNpm}
                    onChange={(e) => setNimNpm(e.target.value)}
                    className={`w-full bg-slate-50 border ${errors.nimNpm ? 'border-red-400' : 'border-slate-200'} focus:border-red-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none`}
                  />
                  {errors.nimNpm && <p className="text-red-500 text-xs mt-1 font-medium">{errors.nimNpm}</p>}
                </div>
              </div>

              {/* No. HP & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">No. HP / WhatsApp (Mandatori) *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Contoh: 0812 6079 6914"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full bg-slate-50 border ${errors.phone ? 'border-red-400' : 'border-slate-200'} focus:border-red-500 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none`}
                    />
                  </div>
                  {errors.phone ? (
                    <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>
                  ) : (
                    <p className="text-[10px] text-slate-400 mt-1">Nomor ini akan ditelpon/di-WA saat surat balasan disetujui untuk diambil.</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Alamat Email Aktif *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="Contoh: grace.napitupulu@usu.ac.id"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full bg-slate-50 border ${errors.email ? 'border-red-400' : 'border-slate-200'} focus:border-red-500 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none`}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                </div>
              </div>

              {/* Asal Sekolah/Perguruan Tinggi & Jurusan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {selectedCategory === 'siswa_smk' ? 'Asal Sekolah SMK *' : 'Asal Perguruan Tinggi / Kampus *'}
                  </label>
                  <select
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className={`w-full bg-slate-50 border ${errors.institution ? 'border-red-400' : 'border-slate-200'} focus:border-red-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none`}
                  >
                    <option value="">-- Pilih Instansi --</option>
                    {selectedCategory === 'siswa_smk' 
                      ? listHighSchools.map((sch, i) => <option key={i} value={sch}>{sch}</option>)
                      : listUniversities.map((univ, i) => <option key={i} value={univ}>{univ}</option>)
                    }
                  </select>
                  {errors.institution && <p className="text-red-500 text-xs mt-1 font-medium">{errors.institution}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Jurusan / Program Studi *</label>
                  <select
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className={`w-full bg-slate-50 border ${errors.major ? 'border-red-400' : 'border-slate-200'} focus:border-red-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none`}
                  >
                    <option value="">-- Pilih Jurusan --</option>
                    {listMajors.map((mjr, i) => <option key={i} value={mjr}>{mjr}</option>)}
                    <option value="Lainnya (Tulis Manual)">Lainnya (Tulis Manual)</option>
                  </select>
                  {errors.major && <p className="text-red-500 text-xs mt-1 font-medium">{errors.major}</p>}
                </div>
              </div>

              {(institution === 'Lainnya (Tulis Manual)' || major === 'Lainnya (Tulis Manual)') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {institution === 'Lainnya (Tulis Manual)' && (
                    <div>
                      <input
                        type="text"
                        placeholder="Manual Nama Kampus / Sekolah"
                        value={customInstitution}
                        onChange={(e) => setCustomInstitution(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-red-500 rounded-xl px-4 py-2 text-sm focus:outline-none"
                      />
                    </div>
                  )}
                  {major === 'Lainnya (Tulis Manual)' && (
                    <div>
                      <input
                        type="text"
                        placeholder="Manual Nama Jurusan"
                        value={customMajor}
                        onChange={(e) => setCustomMajor(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-red-500 rounded-xl px-4 py-2 text-sm focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Alamat Domisili */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Alamat Domisili *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Contoh: Jl. Dr. Mansyur No. 9, Medan (Domisili Pematangsiantar)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`w-full bg-slate-50 border ${errors.address ? 'border-red-400' : 'border-slate-200'} focus:border-red-500 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none`}
                  />
                </div>
                {errors.address && <p className="text-red-500 text-xs mt-1 font-medium">{errors.address}</p>}
              </div>

              {/* Periode Tanggal Mulai - Selesai */}
              <div className="bg-slate-50/60 rounded-xl p-4 border border-slate-100">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase mb-2">
                  <Calendar className="w-4 h-4 text-red-600" />
                  Periode Tanggal Mulai - Siap / Selesai PKL *
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tanggal Mulai PKL *</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className={`w-full bg-white border ${errors.startDate ? 'border-red-400' : 'border-slate-200'} focus:border-red-500 rounded-lg px-3 py-2 text-sm focus:outline-none`}
                    />
                    {errors.startDate && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.startDate}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tanggal Siap / Selesai PKL *</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className={`w-full bg-white border ${errors.endDate ? 'border-red-400' : 'border-slate-200'} focus:border-red-500 rounded-lg px-3 py-2 text-sm focus:outline-none`}
                    />
                    {errors.endDate && <p className="text-red-500 text-[10px] mt-0.5 font-medium">{errors.endDate}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Unggah Berkas */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                Unggah File Surat Pengantar Resmi Kampus / Sekolah *
              </label>
              
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${dragActive ? 'border-red-500 bg-red-50/20' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileInputChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                />
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700">Pilih Berkas atau Tarik ke Sini</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">PDF, Word (.DOC/.DOCX), atau Foto Surat Pengantar</p>
                </div>
              </div>

              {errors.files && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.files}</p>}

              {uploadedFiles.length > 0 && (
                <div className="mt-3 space-y-2 bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Berkas Terlampir ({uploadedFiles.length})</div>
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between bg-white border border-slate-100 px-3 py-2 rounded-lg text-xs">
                      <div className="flex items-center gap-2 overflow-hidden mr-4">
                        <FileText className="w-4 h-4 text-red-500 shrink-0" />
                        <span className="font-semibold text-slate-700 truncate">{file.name}</span>
                      </div>
                      <button type="button" onClick={() => removeFile(file.id)} className="text-slate-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl transition-colors"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-red-100 cursor-pointer"
              >
                Kirim Pendaftaran & Buat Draft Surat
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* STEP 3: SUCCESS & RECEIPT */}
      {step === 3 && completedApp && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden"
          id="step-registration-success"
        >
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">Pendaftaran Terkirim di Kesbangpol!</h2>
            <p className="text-red-100 text-xs sm:text-sm mt-1">Data surat pengantar & biodata Anda sudah masuk ke sistem verifikasi Srikandi Kesbangpol.</p>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Kode Pendaftaran Anda</span>
              <span className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight font-mono">{completedApp.registrationCode}</span>
              <p className="text-slate-500 text-[11px] mt-2 max-w-sm mx-auto">
                Nomor HP Anda (<span className="font-bold text-slate-800">{completedApp.phone}</span>) sudah tercatat. Setelah surat balasan disetujui Pak Ali Akbar via Srikandi, Anda akan ditelpon/di-WA untuk mengambil surat fisik.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Rincian Surat & Biodata Peserta</h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                <div className="flex py-2.5 px-4 bg-slate-50/50">
                  <span className="w-1/3 text-slate-500 font-semibold">Nama Lengkap</span>
                  <span className="w-2/3 text-slate-800 font-bold">{completedApp.name}</span>
                </div>
                <div className="flex py-2.5 px-4">
                  <span className="w-1/3 text-slate-500 font-semibold">NIM / NPM</span>
                  <span className="w-2/3 text-slate-800 font-mono font-bold">{completedApp.nimNpm}</span>
                </div>
                <div className="flex py-2.5 px-4 bg-slate-50/50">
                  <span className="w-1/3 text-slate-500 font-semibold">No. HP / WA</span>
                  <span className="w-2/3 text-slate-800 font-bold text-red-600">{completedApp.phone}</span>
                </div>
                <div className="flex py-2.5 px-4">
                  <span className="w-1/3 text-slate-500 font-semibold">Asal Instansi</span>
                  <span className="w-2/3 text-slate-800 font-semibold">{completedApp.institution} ({completedApp.major})</span>
                </div>
                <div className="flex py-2.5 px-4 bg-slate-50/50">
                  <span className="w-1/3 text-slate-500 font-semibold">Tempat Magang</span>
                  <span className="w-2/3 text-slate-800 font-bold">{completedApp.targetLocation}</span>
                </div>
                <div className="flex py-2.5 px-4">
                  <span className="w-1/3 text-slate-500 font-semibold">Periode Mulai - Selesai</span>
                  <span className="w-2/3 text-slate-800 font-bold">
                    {new Date(completedApp.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} s/d {new Date(completedApp.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Print Word Official Letter Template */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Pratinjau Surat Balasan Kesbangpol (.DOC)</h4>
                  <p className="text-[10px] text-slate-300 mt-0.5">Template Word resmi dengan Kop Pemko Pematangsiantar, perihal, nomor surat, & tabel peserta.</p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => exportOfficialLetterToWord(completedApp)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm shrink-0"
                >
                  <Download className="w-4 h-4" />
                  Unduh Word (.DOC)
                </button>
                <button
                  onClick={() => printOfficialLetterPDF(completedApp)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3 py-2.5 rounded-xl transition-all shrink-0"
                >
                  Cetak / PDF
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <div className="text-xs text-slate-500 text-center sm:text-left flex-1 self-center">
                ℹ️ Silakan serahkan fisik surat pengantar kampus ke loket Kesbangpol. Staff akan memproses persetujuan Srikandi (Pak Yusri → Bu Rina → Pak Ali Akbar).
              </div>
              <button
                onClick={resetForm}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors shadow-sm"
              >
                Pendaftaran Baru / Selesai
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
