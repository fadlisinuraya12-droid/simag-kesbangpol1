/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  GraduationCap, 
  School, 
  ExternalLink, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  FileSpreadsheet, 
  FileText, 
  Check, 
  X, 
  MessageSquare, 
  RefreshCw,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Application, ApplicationStatus, RegistrationCategory } from '../types';
import { getCategoryLabel, getStatusLabel, exportToWord, exportAllToCSV } from '../utils/export';

interface AdminDashboardProps {
  applications: Application[];
  onUpdateStatus: (id: string, status: ApplicationStatus, notes?: string) => void;
  onDeleteApplication: (id: string) => void;
  onResetMockData: () => void;
}

export default function AdminDashboard({ 
  applications, 
  onUpdateStatus, 
  onDeleteApplication,
  onResetMockData 
}: AdminDashboardProps) {
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ApplicationStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | RegistrationCategory>('all');
  
  // Selected application for detail view (defaults to first applicant if exists)
  const [selectedId, setSelectedId] = useState<string | null>(
    applications.length > 0 ? applications[0].id : null
  );

  // Status update states inside the details pane
  const [showVerificationAction, setShowVerificationAction] = useState<ApplicationStatus | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  // Selected applicant object lookup
  const selectedApp = useMemo(() => {
    const found = applications.find(app => app.id === selectedId);
    if (!found && applications.length > 0) {
      return applications[0];
    }
    return found || null;
  }, [applications, selectedId]);

  // Statistics calculation
  const stats = useMemo(() => {
    const s = {
      total: applications.length,
      pending: 0,
      approved: 0,
      rejected: 0,
      mahasiswa: 0,
      smk: 0
    };
    applications.forEach(app => {
      // Status
      if (app.status === 'pending') s.pending++;
      else if (app.status === 'approved') s.approved++;
      else if (app.status === 'rejected') s.rejected++;
      
      // Category
      if (app.category === 'siswa_smk') s.smk++;
      else s.mahasiswa++;
    });
    return s;
  }, [applications]);

  // Filtering logic
  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const matchSearch = 
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.registrationCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'all' ? true : app.status === statusFilter;
      const matchCategory = categoryFilter === 'all' ? true : app.category === categoryFilter;

      return matchSearch && matchStatus && matchCategory;
    });
  }, [applications, searchTerm, statusFilter, categoryFilter]);

  // Handle submit status verification
  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !showVerificationAction) return;

    onUpdateStatus(selectedApp.id, showVerificationAction, adminNotes);
    setShowVerificationAction(null);
    setAdminNotes('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="admin-dashboard">
      
      {/* Dashboard Heading & Export Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            Dashboard Kesbangpol Kota Pematangsiantar
            <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Internal</span>
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Sistem Pengelolaan, Verifikasi & Rekap Data Pendaftaran PKL dan Magang Kesbangpol Kota Pematangsiantar.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onResetMockData}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 px-4 py-2.5 rounded-xl font-semibold transition-all shadow-xs"
            title="Reset Mock Data ke Pengaturan Awal"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Data Demo
          </button>
          
          <button
            onClick={() => exportAllToCSV(applications)}
            disabled={applications.length === 0}
            className={`flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm ${applications.length > 0 ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer shadow-green-100' : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'}`}
            id="btn-export-spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Ekspor Rekap Excel (CSV)
          </button>
        </div>
      </div>

      {/* Analytics Summary Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8" id="statistics-cards">
        {/* Total Registered */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-4">
          <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center shrink-0">
            <Users className="w-5 sm:w-6 h-5 sm:h-6" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Pendaftar</span>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-800 font-mono block leading-tight">{stats.total}</span>
          </div>
        </div>

        {/* Pending Verification */}
        <div className="bg-white border border-amber-100/50 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-4">
          <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 sm:w-6 h-5 sm:h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">Menunggu Verifikasi</span>
            <span className="text-xl sm:text-2xl font-extrabold text-amber-600 font-mono block leading-tight">{stats.pending}</span>
          </div>
        </div>

        {/* Approved / Active */}
        <div className="bg-white border border-green-100/50 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-4">
          <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 sm:w-6 h-5 sm:h-6" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">Diterima / Aktif</span>
            <span className="text-xl sm:text-2xl font-extrabold text-green-600 font-mono block leading-tight">{stats.approved}</span>
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-white border border-red-100/50 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-4">
          <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <XCircle className="w-5 sm:w-6 h-5 sm:h-6" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">Ditolak</span>
            <span className="text-xl sm:text-2xl font-extrabold text-red-600 font-mono block leading-tight">{stats.rejected}</span>
          </div>
        </div>
      </div>

      {/* Breakdown Ratios Panel */}
      <div className="bg-slate-50 rounded-2xl p-4 mb-8 border border-slate-100/75 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="text-slate-500 text-xs font-semibold">Rasio Kategori Pendaftar:</div>
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-700">
            <GraduationCap className="w-3.5 h-3.5 text-red-600" />
            <span>Mahasiswa: {stats.mahasiswa} ({stats.total > 0 ? Math.round((stats.mahasiswa / stats.total) * 100) : 0}%)</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-700">
            <School className="w-3.5 h-3.5 text-slate-600" />
            <span>Siswa SMK: {stats.smk} ({stats.total > 0 ? Math.round((stats.smk / stats.total) * 100) : 0}%)</span>
          </div>
        </div>

        <div className="text-slate-400 text-[11px] font-mono">
          Database: Local Encrypted Storage
        </div>
      </div>

      {/* Main Split Layout: Left Table vs Right Details Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COMPONENT: APPLICANTS MASTER LIST */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden flex flex-col h-[70vh]">
          {/* List Search & Filter Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-3.5">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kode pendaftaran, nama, sekolah..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-red-500 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none transition-colors shadow-xs"
                id="admin-search-input"
              />
            </div>

            <div className="flex gap-2">
              {/* Category Filter */}
              <div className="flex-1">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 focus:outline-none"
                  id="admin-filter-category"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="mahasiswa_pkl">PKL Mahasiswa</option>
                  <option value="mahasiswa_magang">Magang Mandiri</option>
                  <option value="siswa_smk">Siswa SMK</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex-1">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 focus:outline-none"
                  id="admin-filter-status"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Menunggu Verifikasi</option>
                  <option value="approved">Disetujui / Aktif</option>
                  <option value="rejected">Ditolak</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-y-auto" id="applicants-scroll-container">
            {filteredApps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mb-3">
                  <Filter className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Tidak ada pendaftar ditemukan</h3>
                <p className="text-slate-500 text-xs mt-1">Coba sesuaikan kata kunci pencarian atau bersihkan filter Anda.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredApps.map((app) => {
                  const isActive = app.id === selectedId;
                  return (
                    <div
                      key={app.id}
                      onClick={() => {
                        setSelectedId(app.id);
                        setShowVerificationAction(null);
                        setAdminNotes(app.notes || '');
                      }}
                      className={`p-4 cursor-pointer transition-all hover:bg-slate-50 flex items-center justify-between border-l-4 ${isActive ? 'bg-red-50/10 border-red-500' : 'border-transparent'}`}
                      id={`applicant-row-${app.id}`}
                    >
                      <div className="min-w-0 flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[10px] font-extrabold text-slate-400">{app.registrationCode}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wider ${app.category === 'siswa_smk' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                            {app.category === 'siswa_smk' ? 'SMK' : 'MHS'}
                          </span>
                        </div>
                        
                        <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate">{app.name}</h4>
                        
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 truncate">
                          <span>{app.institution}</span>
                          <span>•</span>
                          <span>{app.major}</span>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="shrink-0 flex flex-col items-end gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          app.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          app.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-amber-100 text-amber-800 animate-pulse'
                        }`}>
                          {getStatusLabel(app.status)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(app.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-500 flex justify-between items-center font-medium">
            <span>Menampilkan {filteredApps.length} dari {applications.length} pendaftar</span>
            <span>SIMAG v1.0</span>
          </div>
        </div>

        {/* RIGHT COMPONENT: APPLICANT PROFILE DOSSIER */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden min-h-[70vh]">
          {selectedApp ? (
            <div className="flex flex-col h-full" id="applicant-dossier-panel">
              {/* Dossier Header */}
              <div className="p-6 bg-slate-900 text-white relative">
                {/* Delete/Remove button */}
                <button
                  onClick={() => {
                    if (confirm(`Apakah Anda yakin ingin menghapus data pendaftaran ${selectedApp.name}?`)) {
                      onDeleteApplication(selectedApp.id);
                      setSelectedId(null);
                    }
                  }}
                  className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-red-600 hover:text-white transition-all text-slate-300"
                  title="Hapus Pengajuan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-red-400 tracking-wider uppercase bg-red-950/40 border border-red-900/50 px-2 py-0.5 rounded-sm">
                    {selectedApp.registrationCode}
                  </span>
                  <span className="text-[11px] text-slate-300">| {getCategoryLabel(selectedApp.category)}</span>
                </div>

                <h3 className="text-lg font-extrabold tracking-tight leading-snug">{selectedApp.name}</h3>
                <p className="text-xs text-slate-300 mt-1">{selectedApp.institution}</p>

                {/* Status Indicator Bar */}
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                  <span className="text-slate-400 font-medium">Status Pengajuan:</span>
                  <span className={`font-bold uppercase tracking-wider ${
                    selectedApp.status === 'approved' ? 'text-green-400' :
                    selectedApp.status === 'rejected' ? 'text-red-400' :
                    'text-amber-400'
                  }`}>
                    {getStatusLabel(selectedApp.status)}
                  </span>
                </div>
              </div>

              {/* Dossier Body */}
              <div className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[45vh]">
                
                {/* Personal Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Biodata Pendaftar</h4>
                  
                  <div className="grid grid-cols-1 gap-3.5 text-xs">
                    <div className="flex items-start gap-2.5">
                      <School className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-500 block">Jurusan / Program Studi</span>
                        <span className="font-bold text-slate-800">{selectedApp.major}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-500 block">Nomor Telepon / WhatsApp</span>
                        <span className="font-bold text-slate-800 hover:text-red-700 transition-colors cursor-pointer">{selectedApp.phone}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-500 block">Alamat Email</span>
                        <span className="font-bold text-slate-800">{selectedApp.email}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-500 block">Alamat Domisili</span>
                        <span className="font-medium text-slate-700 leading-relaxed">{selectedApp.address}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-500 block">Periode Pelaksanaan PKL/Magang</span>
                        <span className="font-bold text-red-600 bg-red-50 border border-red-100 rounded-sm px-2 py-0.5 inline-block mt-0.5">
                          {new Date(selectedApp.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} s.d. {new Date(selectedApp.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification/Admin Notes Display if any */}
                {selectedApp.notes && (
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs">
                    <span className="inline-flex items-center gap-1 font-bold text-slate-700 uppercase tracking-wider mb-1">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                      Catatan Verifikasi Admin
                    </span>
                    <p className="text-slate-600 italic leading-relaxed">{selectedApp.notes}</p>
                  </div>
                )}

                {/* Uploaded Documents List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Berkas Penunjang</h4>
                  
                  {selectedApp.documents.length === 0 ? (
                    <p className="text-xs text-slate-500">Tidak ada berkas yang dilampirkan.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-2.5">
                      {selectedApp.documents.map((doc) => (
                        <div 
                          key={doc.id}
                          className="flex items-center justify-between border border-slate-100 hover:border-slate-200 bg-slate-50/50 p-2.5 rounded-xl text-xs transition-colors"
                        >
                          <div className="flex items-center gap-2 overflow-hidden mr-4">
                            <FileText className="w-4 h-4 text-red-600 shrink-0" />
                            <div className="min-w-0">
                              <span className="font-semibold text-slate-800 truncate block">{doc.name}</span>
                              <span className="text-[10px] text-slate-400">{(doc.size / 1000000).toFixed(2)} MB • PDF/Surat</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => alert(`Simulasi pratinjau berkas: ${doc.name}\n\nDi lingkungan web produksi, admin dapat langsung membaca dokumen digital ini secara aman.`)}
                            className="text-[10px] text-red-600 hover:text-red-700 font-bold flex items-center gap-0.5 shrink-0 hover:underline"
                          >
                            Buka
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action and Export Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
                
                {/* Official MS Word Export */}
                <div className="flex justify-between items-center gap-4 bg-white border border-slate-200/60 p-3 rounded-xl shadow-xs">
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">Berkas Administrasi Word</span>
                    <span className="text-[10px] text-slate-500">Ekspor bukti verifikasi instansi Kesbangpol (.doc).</span>
                  </div>
                  <button
                    onClick={() => exportToWord(selectedApp)}
                    className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-3 py-2 rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Unduh (.DOC)
                  </button>
                </div>

                {/* Approval & Reject buttons */}
                {showVerificationAction ? (
                  <form onSubmit={handleVerifySubmit} className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                        Catatan / Alasan {showVerificationAction === 'approved' ? 'Persetujuan' : 'Penolakan'} *
                      </label>
                      <textarea
                        rows={2}
                        required
                        placeholder={showVerificationAction === 'approved' 
                          ? 'Contoh: Berkas lengkap. Ditempatkan di Bagian Hubungan Masyarakat.' 
                          : 'Contoh: Kuota bidang humas penuh untuk periode yang diajukan.'
                        }
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-red-500 rounded-lg p-2.5 text-xs focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => { setShowVerificationAction(null); setAdminNotes(''); }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] px-3.5 py-1.5 rounded-lg"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className={`text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg flex items-center gap-1 ${showVerificationAction === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                      >
                        {showVerificationAction === 'approved' ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        Konfirmasi {showVerificationAction === 'approved' ? 'Setujui' : 'Tolak'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setShowVerificationAction('rejected'); setAdminNotes(selectedApp.notes || ''); }}
                      className="flex-1 inline-flex items-center justify-center gap-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs"
                      id="btn-reject-applicant"
                    >
                      <XCircle className="w-4 h-4" />
                      Tolak Pengajuan
                    </button>
                    <button
                      onClick={() => { setShowVerificationAction('approved'); setAdminNotes(selectedApp.notes || ''); }}
                      className="flex-1 inline-flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-green-100"
                      id="btn-approve-applicant"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Setujui Pengajuan
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-24 px-4 text-slate-400">
              <Users className="w-12 h-12 mb-3" />
              <p className="text-sm font-bold">Pilih Pendaftar</p>
              <p className="text-xs mt-1">Klik salah satu pendaftar di daftar sebelah kiri untuk menampilkan rincian dokumen.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
