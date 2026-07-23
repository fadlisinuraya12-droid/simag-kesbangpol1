/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, User, Building, Clock, LogIn, LogOut, KeyRound, Menu, X, QrCode, Printer } from 'lucide-react';
import QRCode from 'react-qr-code';

interface HeaderProps {
  currentView: 'applicant' | 'admin';
  onChangeView: (view: 'applicant' | 'admin') => void;
  onResetToQR: () => void;
}

export default function Header({ currentView, onChangeView, onResetToQR }: HeaderProps) {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showStandeeModal, setShowStandeeModal] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleAdminAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123' || password === '') {
      onChangeView('admin');
      setShowAdminLogin(false);
      setPassword('');
      setLoginError('');
    } else {
      setLoginError('Kode Akses salah! (Gunakan "admin123" atau kosongkan)');
    }
  };

  const handleLogout = () => {
    onChangeView('applicant');
  };

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-xs" id="main-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={onResetToQR}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white shadow-md shadow-red-200">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-800 text-lg tracking-tight">SIMAG</span>
                <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Pematangsiantar</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Kesbangpol Kota Pematangsiantar</p>
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-4">
            
            {/* Live Indicator Date/Time (Indonesian Format) */}
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-100 px-3.5 py-1.5 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-red-600" />
              <span>{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
            </div>

            {/* Standee QR Code Button */}
            <button
              onClick={() => setShowStandeeModal(true)}
              className="flex items-center gap-1.5 text-xs text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition-all font-semibold shadow-xs"
              id="btn-show-qr-standee"
              title="Tampilkan & Cetak Papan QR Code untuk Meja Loket Kesbangpol"
            >
              <QrCode className="w-4 h-4 text-red-600" />
              <span className="hidden sm:inline">Papan QR Code Meja</span>
            </button>

            {/* Mode Switch Button */}
            {currentView === 'applicant' ? (
              <button
                onClick={() => setShowAdminLogin(true)}
                className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-red-700 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-100 px-3 py-1.5 rounded-lg transition-all font-medium"
                id="btn-admin-login-trigger"
              >
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                Portal Admin
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Mode Admin
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs text-white bg-slate-800 hover:bg-slate-900 px-3 py-1.5 rounded-lg transition-all font-medium shadow-sm"
                  id="btn-admin-logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Keluar Admin
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin Passcode Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 px-6 py-5 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-base">Autentikasi Admin Kesbangpol</h3>
              </div>
              <button 
                onClick={() => { setShowAdminLogin(false); setLoginError(''); setPassword(''); }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdminAccess} className="p-6">
              <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                Halaman admin dilindungi untuk menjaga kerahasiaan data pendaftar. Masukkan kode akses admin untuk masuk.
              </p>

              <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 text-xs mb-4">
                💡 <b>Petunjuk Demo:</b> Masukkan <b>admin123</b> atau langsung klik <b>Masuk Portal</b> (kosongkan) untuk kemudahan pengujian.
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Kode Akses Admin</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-red-500 focus:bg-white rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
                  autoFocus
                />
                {loginError && <p className="text-red-500 text-xs mt-1.5 font-medium">{loginError}</p>}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowAdminLogin(false); setLoginError(''); setPassword(''); }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2.5 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors shadow-sm"
                >
                  Masuk Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Standee QR Code Modal (Desain Papan Meja Resepsionis Loket) */}
      {showStandeeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden border border-slate-200 text-center animate-in fade-in zoom-in duration-200 my-8">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white p-5 relative">
              <button 
                onClick={() => setShowStandeeModal(false)}
                className="absolute top-3 right-3 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center mb-2 border border-white/20">
                <Building className="w-6 h-6 text-white" />
              </div>
              <p className="text-[10px] font-bold tracking-widest text-red-200 uppercase">PEMERINTAH KOTA PEMATANGSIANTAR</p>
              <h3 className="text-base font-extrabold tracking-tight">BADAN KESATUAN BANGSA DAN POLITIK</h3>
              <p className="text-xs text-red-100 mt-1 font-medium">LOKET PELAYANAN PKL & MAGANG DIGITAL</p>
            </div>

            {/* Standee Body */}
            <div className="p-6 bg-slate-50 flex flex-col items-center">
              <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-md flex flex-col items-center w-full">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-3">
                  SCAN QR UNTUK DAFTAR ONLINE
                </span>

                {/* QR Image */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-inner">
                  <QRCode
                    value="https://simag-kesbangpol1.vercel.app/"
                    size={200}
                    level="H"
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                  />
                </div>

                <p className="text-[11px] font-semibold text-slate-800 mt-3 font-mono bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  https://simag-kesbangpol1.vercel.app/
                </p>
              </div>

              <p className="text-xs text-slate-500 mt-4 leading-relaxed px-2">
                Papan ini siap dicetak & dipajang di <b>Meja Resepsionis / Loket Kantor Kesbangpol Kota Pematangsiantar</b> untuk di-scan pendaftar.
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2 w-full mt-5">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-red-100 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Cetak / Print Standee
                </button>
                <button
                  type="button"
                  onClick={() => setShowStandeeModal(false)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
