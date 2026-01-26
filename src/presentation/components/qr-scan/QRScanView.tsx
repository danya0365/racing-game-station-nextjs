'use client';

import { AnimatedCard } from '@/src/presentation/components/ui/AnimatedCard';
import { GlowButton } from '@/src/presentation/components/ui/GlowButton';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

// Shop configuration
const SHOP_CONFIG = {
  name: 'Racing Game Station',
  tagline: 'ประสบการณ์แข่งรถเสมือนจริงระดับพรีเมียม',
  address: 'อ.เมือง จ.นราธิวาส 96000',
  phone: '02-XXX-XXXX',
  openHours: 'เปิดบริการ 24 ชั่วโมง',
  bookingUrl: '/time-booking',
};

// Printable QR Component - Optimized for single A4 page
const PrintableQRCode = React.forwardRef<HTMLDivElement, { url: string }>(
  ({ url }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: '210mm',
          height: '297mm',
          padding: '15mm',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <style type="text/css" media="print">
          {`
            @page { 
              size: A4 portrait;
              margin: 0; 
            }
            @media print {
              html, body {
                width: 210mm;
                height: 297mm;
                margin: 0;
                padding: 0;
              }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          `}
        </style>

        {/* Header - Logo & Brand */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          marginBottom: '12px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
          }}>
            🏎️
          </div>
          <div>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              color: '#111',
              margin: 0,
            }}>
              {SHOP_CONFIG.name}
            </h1>
            <p style={{ 
              fontSize: '14px', 
              color: '#666',
              margin: 0,
            }}>
              {SHOP_CONFIG.tagline}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          width: '100%',
          height: '4px',
          background: 'linear-gradient(90deg, #06b6d4, #2563eb, #9333ea)',
          borderRadius: '2px',
          marginBottom: '20px',
        }} />

        {/* Main Content - QR Code */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* QR Code Container */}
          <div style={{
            padding: '20px',
            border: '3px solid #e5e7eb',
            borderRadius: '16px',
            backgroundColor: 'white',
            marginBottom: '20px',
          }}>
            <QRCodeSVG value={url} size={280} level="H" />
          </div>

          {/* Scan Instructions */}
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#111',
            margin: '0 0 8px 0',
            textAlign: 'center',
          }}>
            📅 สแกนเพื่อจองเวลา
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#666',
            margin: '0 0 16px 0',
          }}>
            Scan to Book in Advance
          </p>

          {/* URL */}
          <div style={{
            backgroundColor: '#f3f4f6',
            padding: '12px 24px',
            borderRadius: '8px',
          }}>
            <code style={{
              fontSize: '14px',
              color: '#374151',
              fontFamily: 'monospace',
            }}>
              {url}
            </code>
          </div>
        </div>

        {/* Footer - Shop Info */}
        <div style={{
          width: '100%',
          backgroundColor: '#f9fafb',
          padding: '16px',
          borderRadius: '12px',
          marginTop: '20px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '14px',
            color: '#374151',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>📍</span>
              <span>{SHOP_CONFIG.address}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>📞</span>
              <span>{SHOP_CONFIG.phone}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🕐</span>
              <span>เปิดบริการ: {SHOP_CONFIG.openHours}</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p style={{
          fontSize: '12px',
          color: '#9ca3af',
          marginTop: '12px',
          textAlign: 'center',
        }}>
          © 2026 {SHOP_CONFIG.name} - All Rights Reserved
        </p>
      </div>
    );
  }
);


PrintableQRCode.displayName = 'PrintableQRCode';

// Main View Component
export function QRScanView() {
  const printRef = useRef<HTMLDivElement>(null);
  const [bookingUrl, setBookingUrl] = useState<string | null>(null);

  // Determine the booking URL only on client side to avoid hydration mismatch
  useEffect(() => {
    setBookingUrl(`${window.location.origin}${SHOP_CONFIG.bookingUrl}`);
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  return (
    <div className="min-h-screen bg-racing-gradient">
      {/* Hero Section */}
      <section className="px-4 md:px-8 py-12 bg-gradient-to-br from-cyan-500/10 via-background to-purple-500/10">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-5xl mb-6 shadow-xl shadow-cyan-500/30 animate-bounce-slow">
              📅
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                QR Code จองเวลา
              </span>
            </h1>
            <p className="text-xl text-muted max-w-2xl mx-auto">
              สแกน QR Code เพื่อจองเวลา เลือกวันและเวลาที่ต้องการ หรือพิมพ์ออกมาติดหน้าร้าน
            </p>
          </div>
        </div>
      </section>

      {/* QR Code Display */}
      <section className="px-4 md:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <AnimatedCard
            className="p-8 md:p-12 text-center"
            glowColor="rgba(0, 212, 255, 0.3)"
          >
            {/* Shop Logo & Name */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-4xl shadow-lg">
                🏎️
              </div>
              <div className="text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  {SHOP_CONFIG.name}
                </h2>
                <p className="text-muted">{SHOP_CONFIG.tagline}</p>
              </div>
            </div>

            {/* QR Code */}
            <div className="inline-block bg-white p-6 rounded-2xl shadow-2xl mb-8">
              {bookingUrl ? (
                <QRCodeSVG
                  value={bookingUrl}
                  size={280}
                  level="H"
                  className="mx-auto"
                />
              ) : (
                <div className="w-[280px] h-[280px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">กำลังโหลด...</span>
                </div>
              )}
            </div>

            {/* Scan Text */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                📅 สแกนเพื่อจองเวลา
              </h3>
              <p className="text-muted">
                ใช้กล้องโทรศัพท์สแกน QR Code ด้านบน เพื่อจองเวลาที่ต้องการ
              </p>
            </div>

            {/* URL Display */}
            <div className="bg-surface border border-border rounded-xl px-6 py-3 inline-block mb-8">
              <code className="text-cyan-400 text-sm md:text-base">
                {bookingUrl || 'กำลังโหลด...'}
              </code>
            </div>

            {/* Shop Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-sm">
              <div className="flex items-center justify-center gap-2 bg-surface border border-border rounded-xl px-4 py-3">
                <span className="text-xl">📍</span>
                <span className="text-muted">{SHOP_CONFIG.address}</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-surface border border-border rounded-xl px-4 py-3">
                <span className="text-xl">📞</span>
                <span className="text-muted">{SHOP_CONFIG.phone}</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-surface border border-border rounded-xl px-4 py-3">
                <span className="text-xl">🕐</span>
                <span className="text-muted">{SHOP_CONFIG.openHours}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <GlowButton
                color="cyan"
                size="lg"
                onClick={() => handlePrint && handlePrint()}
              >
                🖨️ พิมพ์ QR Code
              </GlowButton>
              <Link href="/time-booking">
                <GlowButton color="purple" size="lg">
                  ⚡ จองเวลาเลย
                </GlowButton>
              </Link>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Tips Section */}
      <section className="px-4 md:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-foreground mb-6 text-center">
            💡 วิธีจองเวลา
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatedCard className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl mx-auto mb-4">
                1
              </div>
              <h4 className="font-bold text-foreground mb-2">สแกน QR Code</h4>
              <p className="text-sm text-muted">
                ใช้กล้องโทรศัพท์หรือแอพสแกน QR
              </p>
            </AnimatedCard>
            <AnimatedCard className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-2xl mx-auto mb-4">
                2
              </div>
              <h4 className="font-bold text-foreground mb-2">เลือกวันและเวลา</h4>
              <p className="text-sm text-muted">
                เลือกวัน เวลา และเครื่องเล่นที่ต้องการ
              </p>
            </AnimatedCard>
            <AnimatedCard className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-2xl mx-auto mb-4">
                3
              </div>
              <h4 className="font-bold text-foreground mb-2">ยืนยันการจอง</h4>
              <p className="text-sm text-muted">
                มาถึงตามเวลาที่จอง พร้อมเล่นได้ทันที!
              </p>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 md:px-8 py-12 bg-gradient-to-br from-purple-500/5 via-background to-cyan-500/5">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-foreground mb-6 text-center">
            ✨ ข้อดีของการจองเวลา
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatedCard className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-2xl shrink-0">
                  ⏰
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-2">ไม่ต้องรอคิว</h4>
                  <p className="text-sm text-muted">
                    จองเวลาที่ต้องการล่วงหน้า มาถึงเล่นได้เลย ไม่ต้องรอ
                  </p>
                </div>
              </div>
            </AnimatedCard>
            <AnimatedCard className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center text-2xl shrink-0">
                  📆
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-2">วางแผนได้ล่วงหน้า</h4>
                  <p className="text-sm text-muted">
                    เลือกวันและเวลาที่สะดวก จัดตารางได้ตามใจ
                  </p>
                </div>
              </div>
            </AnimatedCard>
            <AnimatedCard className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 flex items-center justify-center text-2xl shrink-0">
                  🎮
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-2">เลือกเครื่องได้</h4>
                  <p className="text-sm text-muted">
                    เลือกเครื่องซิมูเลเตอร์ที่ชอบ การันตีได้เครื่องที่จอง
                  </p>
                </div>
              </div>
            </AnimatedCard>
            <AnimatedCard className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center text-2xl shrink-0">
                  📱
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-2">จองง่ายผ่านมือถือ</h4>
                  <p className="text-sm text-muted">
                    สแกน QR หรือเข้าเว็บ จองได้ทุกที่ทุกเวลา
                  </p>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Hidden Printable Component */}
      <div style={{ display: 'none' }}>
        {bookingUrl && <PrintableQRCode ref={printRef} url={bookingUrl} />}
      </div>
    </div>
  );
}
