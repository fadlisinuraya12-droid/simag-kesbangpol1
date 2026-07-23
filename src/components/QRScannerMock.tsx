/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Smartphone, Sparkles, Building2, CheckCircle, ArrowRight } from 'lucide-react';
import QRCode from 'react-qr-code';
import { motion } from 'motion/react';

interface QRScannerMockProps {
  onScanSuccess: () => void;
}

export default function QRScannerMock({ onScanSuccess }: QRScannerMockProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<'idle' | 'scanning' | 'success'>('idle');

  const handleSimulateScan = () => {
    setIsScanning(true);
    setScanStep('scanning');
    
    // Simulate camera focal search & processing
    setTimeout(() => {
      setScanStep('success');
      setTimeout(() => {
        onScanSuccess();
      }, 1200);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full text-center"
      >
        <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 uppercase tracking-wider">
          <Building2 className="w-3.5 h-3.5" />
          BADAN KESBANGPOL KOTA PEMATANGSIANTAR
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight mb-3">
          Sistem Informasi Pendaftaran PKL & Magang
        </h1>
        <p className="text-slate-600 max-w-lg mx-auto mb-12 text-sm md:text-base">
          Saat tiba di kantor Kesbangpol, silakan pindai <b>QR Code</b> pada meja resepsionis untuk mengakses formulir pendaftaran digital langsung dari perangkat Anda.
        </p>

        {/* The interactive QR code stand mockup */}
        <div className="relative mx-auto w-72 md:w-80 bg-slate-50 rounded-3xl border border-slate-200 shadow-2xl p-6 mb-10 overflow-hidden group">
          {/* Acrylic stand reflection/effect */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-slate-100 via-white to-slate-200" />
          
          <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col items-center relative shadow-sm">
            {/* Header of stand */}
            <div className="flex items-center gap-1 text-slate-700 font-bold text-xs uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              Kesbangpol Digital Desk
            </div>

            {/* QR Code Graphic Container */}
            <div className="relative w-44 h-44 bg-white-50 border-4 border-slate-800 rounded-xl p-3 flex items-center justify-center overflow-hidden">
              {/* Scan indicator animation */}
              {scanStep === 'scanning' && (
                <div className="absolute left-0 right-0 h-1 bg-red-500 animate-bounce top-0 bottom-0 shadow-lg shadow-red-500/50" style={{ animationDuration: '2s' }} />
              )}
              
              <div className="w-full h-full text-slate-800 flex items-center justify-center relative">
                {scanStep === 'success' ? (
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center text-green-600"
                  >
                    <CheckCircle className="w-16 h-16" />
                    <span className="text-xs font-bold mt-2">QR Terbaca</span>
                  </motion.div>
                ) : (
                  <QRCode
                      value="https://simag-kesbangpol1.vercel.app/"
                      size={180}
                      level="H"
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                    />
                )}
              </div>
            </div>

            {/* Footer of stand instructions */}
            <p className="text-[11px] text-slate-500 text-center font-medium mt-4 max-w-[180px]">
              Arahkan kamera ponsel Anda ke kode QR untuk membuka pendaftaran
            </p>
          </div>

          {/* Wooden desk table-top projection */}
          <div className="h-6 w-full bg-gradient-to-r from-amber-800 to-amber-900 border-t border-amber-700 mt-4 rounded-b-xl flex items-center justify-center">
            <div className="h-1 w-24 bg-amber-950/40 rounded-full" />
          </div>
        </div>

        {/* Scanner Simulation Controls */}
        <div className="flex flex-col items-center gap-4">
          {scanStep === 'idle' && (
            <button
              onClick={handleSimulateScan}
              className="flex items-center gap-2.5 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-semibold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-95 group"
              id="btn-simulate-scan"
            >
              <Smartphone className="w-4 h-4 group-hover:rotate-6 transition-transform" />
              Pindai QR Code Sekarang
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          {scanStep === 'scanning' && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2.5 bg-slate-100 text-slate-800 px-6 py-2.5 rounded-full border border-slate-200 font-medium text-sm">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                Mengaktifkan kamera & memindai QR Code...
              </div>
              <p className="text-xs text-slate-400 font-mono">Camera: Back Wide Sensor 1x</p>
            </div>
          )}

          {scanStep === 'success' && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-6 py-2.5 rounded-full font-medium text-sm animate-pulse">
              <CheckCircle className="w-4 h-4" />
              Berhasil dialihkan ke halaman formulir!
            </div>
          )}

          <div className="mt-4 flex items-center gap-1.5 text-slate-400 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Atau, pendaftar dapat langsung masuk jika diarahkan oleh resepsionis.</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
