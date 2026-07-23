/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import QRScannerMock from './components/QRScannerMock';
import RegistrationForm from './components/RegistrationForm';
import AdminDashboard from './components/AdminDashboard';
import { Application, ApplicationStatus } from './types';
import { initialMockApplications } from './data';
import { Landmark, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

const LOCAL_STORAGE_KEY = 'kesbangpol_magang_applications';

export default function App() {
  const [currentView, setCurrentView] = useState<'applicant' | 'admin'>('applicant');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);

  // Load applications from localStorage on component mount & check URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'scan') {
      setShowQRScanner(true);
    } else {
      setShowQRScanner(false);
    }
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setApplications(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse applications from localStorage, resetting to mock data', e);
        setApplications(initialMockApplications);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialMockApplications));
      }
    } else {
      setApplications(initialMockApplications);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialMockApplications));
    }
  }, []);

  // Handler to register a new application
  const handleRegister = (newApp: Omit<Application, 'id' | 'registrationCode' | 'status' | 'createdAt'>): Application => {
    // Generate next serial code like REG-2026-0083
    const year = new Date().getFullYear();
    const count = applications.length + 80; // offset to make codes look realistic
    const code = `REG-${year}-${String(count).padStart(4, '0')}`;
    
    const created: Application = {
      ...newApp,
      id: `app-${Date.now()}`,
      registrationCode: code,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updated = [created, ...applications];
    setApplications(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return created;
  };

  // Handler for Admin to approve or reject
  const handleUpdateStatus = (id: string, status: ApplicationStatus, notes?: string) => {
    const updated = applications.map(app => {
      if (app.id === id) {
        return { ...app, status, notes };
      }
      return app;
    });
    setApplications(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  // Handler for Admin to delete
  const handleDeleteApplication = (id: string) => {
    const updated = applications.filter(app => app.id !== id);
    setApplications(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  // Handler to reset/restore mock data
  const handleResetMockData = () => {
    if (confirm('Apakah Anda yakin ingin menyetel ulang data pendaftaran ke data bawaan simulasi?')) {
      setApplications(initialMockApplications);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialMockApplications));
    }
  };

  // Reset applicant flow directly to step 1
  const handleResetToQR = () => {
    setShowQRScanner(false);
    setCurrentView('applicant');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      
      {/* Universal Header with view toggle and status branding */}
      <Header 
        currentView={currentView} 
        onChangeView={setCurrentView}
        onResetToQR={handleResetToQR}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'applicant' ? (
          <div>
            <div className="bg-red-50/80 border-b border-red-100 py-2 px-4 text-center text-xs text-red-800 font-medium flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span>📍 Formulir Pendaftaran Digital PKL & Magang — Badan Kesatuan Bangsa dan Politik Kota Pematangsiantar</span>
            </div>
            {showQRScanner ? (
              <QRScannerMock onScanSuccess={() => setShowQRScanner(false)} />
            ) : (
              <RegistrationForm onRegister={handleRegister} />
            )}
          </div>
        ) : (
          <AdminDashboard 
            applications={applications}
            onUpdateStatus={handleUpdateStatus}
            onDeleteApplication={handleDeleteApplication}
            onResetMockData={handleResetMockData}
          />
        )}
      </main>

      {/* Modern, clean footer */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-slate-500">
            <Landmark className="w-4 h-4 text-red-600" />
            <span>Badan Kesatuan Bangsa dan Politik Kota Pematangsiantar © {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => {
                alert(
                  "ALUR PENDAFTARAN KESBANGPOL KOTA PEMATANGSIANTAR:\n1. Pendaftar melakukan scan QR Code di meja/loket Kesbangpol Kota Pematangsiantar.\n2. Sistem langsung menampilkan Langkah 1 (Pilih Kategori: Mahasiswa PKL/Magang atau Siswa SMK).\n3. Mengisi data pribadi lengkap & mengunggah berkas pengantar/CV.\n4. Mengunduh Bukti Pendaftaran (.DOC Word) ber-kop resmi Pemko Pematangsiantar.\n5. Admin Kesbangpol memverifikasi berkas, memperbarui status, dan mencetak laporan Excel."
                );
              }}
              className="hover:text-red-600 transition-colors font-medium flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Petunjuk Alur Sistem
            </button>
            <span>•</span>
            <span className="font-mono text-[10px]">Pematangsiantar Server</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
