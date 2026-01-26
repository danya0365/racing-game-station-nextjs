'use client';

import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

// Print styles for proper page margins
const printStyles = `
  @page {
    margin: 20mm;
    size: A4 portrait;
  }
  @media print {
    html, body {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      font-size: 11pt !important;
    }
    .print-container {
      padding: 0 !important;
      max-width: 100% !important;
    }
    section {
      padding: 10px 0 !important;
      margin-bottom: 15px !important;
      break-inside: avoid;
    }
    .print-section-cover {
      padding: 40px 20px !important;
      margin-bottom: 20px !important;
      break-after: page;
    }
    .print-content-box {
      padding: 15px !important;
      margin: 10px 0 !important;
      border: 1px solid #e5e7eb !important;
      border-radius: 8px !important;
    }
    h1, h2, h3 {
      break-after: avoid;
    }
    ul, ol {
      break-inside: avoid;
    }
    /* Force background colors */
    .bg-gray-50 { background-color: #f9fafb !important; }
    .bg-purple-100 { background-color: #f3e8ff !important; }
    .bg-cyan-100 { background-color: #cffafe !important; }
    /* ... add other essential print colors if needed or rely on exact-print-adjust */
  }
`;

export default function PrintDocsPage() {
  const printAllRef = useRef<HTMLDivElement>(null);
  const printCustomerRef = useRef<HTMLDivElement>(null);
  const printAdminRef = useRef<HTMLDivElement>(null);
  const printGameControlRef = useRef<HTMLDivElement>(null);

  const handlePrintAll = useReactToPrint({
    contentRef: printAllRef,
    documentTitle: 'คู่มือการใช้งาน Racing Game Station',
    pageStyle: printStyles,
  });

  const handlePrintCustomer = useReactToPrint({
    contentRef: printCustomerRef,
    documentTitle: 'คู่มือสำหรับลูกค้า - Racing Game Station',
    pageStyle: printStyles,
  });

  const handlePrintAdmin = useReactToPrint({
    contentRef: printAdminRef,
    documentTitle: 'คู่มือสำหรับแอดมิน - Racing Game Station',
    pageStyle: printStyles,
  });

  const handlePrintGameControl = useReactToPrint({
    contentRef: printGameControlRef,
    documentTitle: 'คู่มือห้องควบคุมเกม - Racing Game Station',
    pageStyle: printStyles,
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Control Panel - Fixed at top */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-lg print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">🖨️ เลือกส่วนที่ต้องการพิมพ์</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">คลิกปุ่มด้านล่างเพื่อพิมพ์เอกสาร (อัปเดตล่าสุด)</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handlePrintAll()}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium rounded-lg shadow hover:shadow-lg transition-all flex items-center gap-2"
              >
                📖 พิมพ์ทั้งหมด
              </button>
              <button
                onClick={() => handlePrintCustomer()}
                className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white font-medium rounded-lg shadow hover:shadow-lg transition-all flex items-center gap-2"
              >
                👤 พิมพ์คู่มือลูกค้า
              </button>
              <button
                onClick={() => handlePrintAdmin()}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg shadow hover:shadow-lg transition-all flex items-center gap-2"
              >
                ⚙️ พิมพ์คู่มือแอดมิน
              </button>
              <button
                onClick={() => handlePrintGameControl()}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-medium rounded-lg shadow hover:shadow-lg transition-all flex items-center gap-2"
              >
                🎛️ พิมพ์คู่มือห้องควบคุม
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Content - Print All */}
      <div ref={printAllRef} className="print-container max-w-4xl mx-auto px-8 py-12 bg-white text-black">
        {/* Cover Page */}
        <CoverPage />

        {/* Table of Contents */}
        <TableOfContents />

        {/* Customer Guide Content */}
        <div ref={printCustomerRef}>
          <CustomerGuide />
        </div>

        {/* Admin Guide Content */}
        <div ref={printAdminRef}>
          <AdminGuide />
        </div>

        {/* Game Control Guide Content */}
        <div ref={printGameControlRef}>
          <GameControlGuide />
        </div>

        {/* Back Cover */}
        <BackCover />
      </div>
    </div>
  );
}

// ========== COMPONENTS ==========

function CoverPage() {
  return (
    <section className="print-section-cover text-center py-20 border-b-4 border-purple-500">
      <div className="text-8xl mb-6">📖</div>
      <h1 className="text-5xl font-bold text-gray-900 mb-4">คู่มือการใช้งาน</h1>
      <h2 className="text-3xl text-purple-600 font-semibold mb-8">Racing Game Station</h2>
      <p className="text-xl text-gray-600">ระบบจองเวลาเล่นเกม</p>

      <div className="mt-16 text-gray-500">
        <p className="text-lg">เวอร์ชัน 1.1</p>
        <p>มกราคม 2026</p>
      </div>
    </section>
  );
}

function TableOfContents() {
  return (
    <section className="print-section-cover py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b-2 border-gray-200 pb-4">📋 สารบัญ</h2>

      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-purple-600 mb-4">👤 ส่วนที่ 1: คู่มือสำหรับลูกค้า</h3>
          <ul className="space-y-2 text-gray-700 ml-8">
            <li className="flex justify-between border-b border-dotted border-gray-300 pb-1">
              <span>1.1 วิธีจองคิวหน้าร้าน (Walk-in)</span>
              <span className="text-gray-500">หน้า 3</span>
            </li>
            <li className="flex justify-between border-b border-dotted border-gray-300 pb-1">
              <span>1.2 วิธีจองเวลาเล่นล่วงหน้า</span>
              <span className="text-gray-500">หน้า 4</span>
            </li>
             <li className="flex justify-between border-b border-dotted border-gray-300 pb-1">
              <span>1.3 ดูสถานะการจอง</span>
              <span className="text-gray-500">หน้า 5</span>
            </li>
             <li className="flex justify-between border-b border-dotted border-gray-300 pb-1">
              <span>1.4 ดูตารางการจอง</span>
              <span className="text-gray-500">หน้า 6</span>
            </li>
          </ul>
        </div>

        <div>
           <h3 className="text-xl font-bold text-cyan-600 mb-4">⚙️ ส่วนที่ 2: คู่มือสำหรับแอดมิน</h3>
           <ul className="space-y-2 text-gray-700 ml-8">
              <li className="flex justify-between border-b border-dotted border-gray-300 pb-1">
                 <span>2.1 แท็บ Dashboard</span>
                 <span className="text-gray-500">หน้า 7</span>
              </li>
              <li className="flex justify-between border-b border-dotted border-gray-300 pb-1">
                 <span>2.2 จัดการเครื่อง (Machines)</span>
                 <span className="text-gray-500">หน้า 8</span>
              </li>
              <li className="flex justify-between border-b border-dotted border-gray-300 pb-1">
                 <span>2.3 จัดการลูกค้า (Customers)</span>
                 <span className="text-gray-500">หน้า 9</span>
              </li>
              <li className="flex justify-between border-b border-dotted border-gray-300 pb-1">
                 <span>2.4 คิวหน้าร้าน (Walk-in Queue)</span>
                 <span className="text-gray-500">หน้า 10</span>
              </li>
              <li className="flex justify-between border-b border-dotted border-gray-300 pb-1">
                 <span>2.5 จองเวลา & ประวัติการเล่น</span>
                 <span className="text-gray-500">หน้า 11</span>
              </li>
           </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold text-pink-600 mb-4">🎛️ ส่วนที่ 3: คู่มือห้องควบคุมเกม</h3>
          <ul className="space-y-2 text-gray-700 ml-8">
            <li className="flex justify-between border-b border-dotted border-gray-300 pb-1">
              <span>3.1 เข้าหน้าห้องควบคุม</span>
              <span className="text-gray-500">หน้า 12</span>
            </li>
            <li className="flex justify-between border-b border-dotted border-gray-300 pb-1">
              <span>3.2 สถานะเครื่องเล่น (Overview)</span>
              <span className="text-gray-500">หน้า 12</span>
            </li>
             <li className="flex justify-between border-b border-dotted border-gray-300 pb-1">
              <span>3.3 การจัดการรอบเล่น (Session)</span>
              <span className="text-gray-500">หน้า 13</span>
            </li>
             <li className="flex justify-between border-b border-dotted border-gray-300 pb-1">
              <span>3.4 ประวัติการเล่น (History)</span>
              <span className="text-gray-500">หน้า 14</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function BackCover() {
    return (
        <section className="print-section-cover text-center py-40 break-before-page">
            <div className="text-6xl mb-6">🏁</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Racing Game Station</h2>
            <p className="text-xl text-gray-600">ขอให้สนุกกับการเล่นเกม!</p>
            <div className="mt-16 text-sm text-gray-400">
                <p>เอกสารภายในสำหรับพนักงานและลูกค้า</p>
                <p>© 2026 Racing Game Station</p>
            </div>
        </section>
    );
}

// --------------------------------------------------------------------------------
// CUSTOMER GUIDE
// --------------------------------------------------------------------------------
function CustomerGuide() {
  return (
    <>
      <section className="print-section-cover py-16 bg-purple-50 rounded-2xl mb-8 text-center border border-purple-100">
        <div className="text-6xl mb-4">👤</div>
        <h2 className="text-4xl font-bold text-gray-900">ส่วนที่ 1</h2>
        <h3 className="text-2xl text-purple-600 mt-2">คู่มือสำหรับลูกค้า</h3>
        <p className="text-gray-600 mt-4">วิธีใช้งานระบบจองเวลาเล่นเกม</p>
      </section>

      {/* 1.1 Walk-in */}
      <section className="py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-amber-500">🚶</span> 1.1 วิธีจองคิวหน้าร้าน (Walk-in)
        </h2>
        <div className="print-content-box bg-gray-50">
           <div className="space-y-4">
             <div className="flex gap-4">
               <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm">1</div>
               <div>
                  <h3 className="font-bold text-gray-900">ไปที่จุดลงทะเบียน</h3>
                  <p className="text-gray-600">แจ้งพนักงานหรือกดปุ่มเพื่อรับบัตรคิวที่หน้าเคาน์เตอร์ หรือกดปุ่ม "เข้าคิวทันที" ในหน้าเว็บ</p>
               </div>
             </div>
             <div className="flex gap-4">
               <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm">2</div>
               <div>
                  <h3 className="font-bold text-gray-900">กรอกข้อมูล</h3>
                  <p className="text-gray-600">ระบุชื่อ เบอร์โทร และจำนวนผู้เล่น</p>
               </div>
             </div>
             <div className="flex gap-4">
               <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm">3</div>
               <div>
                  <h3 className="font-bold text-gray-900">รอเรียกคิว</h3>
                  <p className="text-gray-600">รอพนักงานเรียกหมายเลขคิวของคุณ หรือดูสถานะคิวได้ที่หน้าจอมอนิเตอร์ในร้าน</p>
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* 1.2 Booking */}
       <section className="py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-purple-500">📅</span> 1.2 วิธีจองเวลาเล่นล่วงหน้า
        </h2>
        <div className="print-content-box bg-gray-50">
           <div className="space-y-4">
             <div className="flex gap-4">
               <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-sm">1</div>
               <div>
                  <h3 className="font-bold text-gray-900">เข้าหน้าจองเวลา</h3>
                  <p className="text-gray-600">คลิกที่เมนู "จองเวลา" บนแถบเมนู หรือกดปุ่ม "📅 จองล่วงหน้า" ที่หน้าแรก</p>
                  <p className="text-sm text-gray-500 mt-1">💡 Tip: สามารถสแกน QR Code ที่ร้านเพื่อเข้าหน้าจองได้โดยตรง</p>
               </div>
             </div>
             <div className="flex gap-4">
               <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-sm">2</div>
               <div>
                  <h3 className="font-bold text-gray-900">เลือกเครื่องเล่น</h3>
                  <p className="text-gray-600">เลือกเครื่องที่ต้องการเล่น ระบบจะแสดงรายชื่อเครื่องที่พร้อมใช้งาน</p>
               </div>
             </div>
             <div className="flex gap-4">
               <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-sm">3</div>
               <div>
                  <h3 className="font-bold text-gray-900">เลือกวันและเวลา</h3>
                  <p className="text-gray-600">เลื่อนเลือกวันที่ต้องการ (ล่วงหน้าได้ 7 วัน) แล้วเลือกช่วงเวลาที่ว่าง (สีเขียว)</p>
               </div>
             </div>
             <div className="flex gap-4">
               <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-sm">4</div>
               <div>
                  <h3 className="font-bold text-gray-900">กรอกข้อมูลและยืนยัน</h3>
                  <p className="text-gray-600">กรอกชื่อและเบอร์โทร เลือกระยะเวลาเล่น แล้วกดยืนยัน (แนะนำ 60 นาที)</p>
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* 1.3 Status */}
      <section className="py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-cyan-500">📋</span> 1.3 ดูสถานะการจอง
        </h2>
        <div className="print-content-box bg-gray-50">
           <p className="text-gray-600 mb-3">ไปที่เมนู <span className="text-cyan-600 font-bold">"สถานะการจอง"</span></p>
           <ol className="list-decimal ml-6 space-y-1 text-gray-600">
             <li>กรอกเบอร์โทรศัพท์ที่ใช้จอง</li>
             <li>ระบบจะแสดงรายการจองทั้งหมดของคุณ</li>
             <li>สถานะ: <span className="text-purple-600">รอ</span>, <span className="text-emerald-600">ยืนยัน</span>, <span className="text-gray-600">เสร็จ</span>, <span className="text-red-600">ยกเลิก</span></li>
           </ol>
        </div>
      </section>

      {/* 1.4 History */}
      <section className="py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-pink-500">📜</span> 1.4 ดูตารางการจอง
        </h2>
        <div className="print-content-box bg-gray-50">
           <p className="text-gray-600 mb-3">ไปที่เมนู <span className="text-pink-600 font-bold">"ตารางจอง"</span></p>
           <ul className="list-disc ml-6 space-y-1 text-gray-600">
             <li>ดูตารางการจองทั้งหมดของวันนี้</li>
             <li>สามารถเลือกดูวันอื่นได้ หรือกรองตามเครื่องที่ต้องการ</li>
             <li>ช่วยให้เห็นช่วงเวลาว่างก่อนทำการจอง</li>
           </ul>
        </div>
      </section>
    </>
  );
}

// --------------------------------------------------------------------------------
// ADMIN GUIDE
// --------------------------------------------------------------------------------
function AdminGuide() {
  return (
    <>
      <section className="print-section-cover py-16 bg-cyan-50 rounded-2xl mb-8 text-center border border-cyan-100 break-before-page">
        <div className="text-6xl mb-4">⚙️</div>
        <h2 className="text-4xl font-bold text-gray-900">ส่วนที่ 2</h2>
        <h3 className="text-2xl text-cyan-600 mt-2">คู่มือสำหรับแอดมิน</h3>
        <p className="text-gray-600 mt-4">วิธีจัดการระบบ เครื่อง และการจอง</p>
      </section>

      {/* 2.1 Dashboard */}
      <section className="py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-cyan-500">📊</span> 2.1 แท็บ Dashboard
        </h2>
        <div className="print-content-box bg-gray-50">
           <p className="text-gray-600 mb-3">หน้าแรกสำหรับดูภาพรวมของร้าน ประกอบด้วย:</p>
           <ul className="list-disc ml-6 space-y-2 text-gray-600">
             <li><strong>Real-time Status:</strong> การ์ดแสดงจำนวนเครื่องว่าง, คิวรอ, และรายได้วันนี้</li>
             <li><strong>Incoming Bookings:</strong> ตารางแสดง Booking ที่กำลังจะมาถึง (เตรียมเครื่องให้พร้อม) และ <span className="text-red-500">Overdue</span> (เลยเวลานัด)</li>
             <li><strong>Traffic Source:</strong> กราฟเปรียบเทียบลูกค้า Walk-in vs Booking</li>
           </ul>
           <div className="mt-3 p-3 bg-cyan-100 rounded text-sm text-cyan-800">
             💡 Tips: ใช้ปุ่ม <strong>"🖨️ Print QR"</strong> มุมขวาบน เพื่อพิมพ์ QR Code ให้ลูกค้าสแกนจองหน้าร้าน
           </div>
        </div>
      </section>

      {/* 2.2 Machines */}
      <section className="py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-emerald-500">🎮</span> 2.2 จัดการเครื่อง (Machines)
        </h2>
        <div className="print-content-box bg-gray-50">
           <p className="text-gray-600 mb-3">จัดการสถานะและข้อมูลของเครื่องเล่น:</p>
           <div className="grid grid-cols-2 gap-4">
             <div className="p-3 bg-white border rounded">
                <h4 className="font-bold text-gray-900">เปลี่ยนสถานะ</h4>
                <p className="text-sm text-gray-500">กดปุ่มสถานะเพื่อเปลี่ยนทันที เช่น "✅ เปิดใช้งาน" หรือ "🔧 ซ่อมบำรุง"</p>
             </div>
             <div className="p-3 bg-white border rounded">
                <h4 className="font-bold text-gray-900">แก้ไขข้อมูล</h4>
                <p className="text-sm text-gray-500">กดปุ่ม "✏️ แก้ไข" เพื่อเปลี่ยนชื่อเครื่อง, รายละเอียด, หรือซ่อน/แสดงเครื่อง</p>
             </div>
           </div>
        </div>
      </section>

      {/* 2.3 Customers */}
      <section className="py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-orange-500">👥</span> 2.3 จัดการลูกค้า (Customers)
        </h2>
        <div className="print-content-box bg-gray-50">
           <ul className="list-disc ml-6 space-y-2 text-gray-600">
             <li><strong>Stats:</strong> ดูจำนวนลูกค้าทั้งหมด, ลูกค้า <span className="text-amber-500">VIP</span>, ลูกค้าใหม่วันนี้, และลูกค้าประจำ</li>
             <li><strong>Search & Filter:</strong> ค้นหาชื่อ/เบอร์โทร หรือกดปุ่ม Filter เพื่อดูเฉพาะกลุ่ม</li>
             <li><strong>VIP Management:</strong> กดปุ่ม "⭐ VIP" เพื่อปรับสถานะลูกค้าให้เป็น VIP</li>
             <li><strong>Add/Edit:</strong> เพิ่มลูกค้าใหม่เข้าระบบ หรือแก้ไขข้อมูลลูกค้าเดิม</li>
           </ul>
        </div>
      </section>

      {/* 2.4 Queue */}
      <section className="py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-amber-500">🚶</span> 2.4 คิวหน้าร้าน (Walk-in Queue)
        </h2>
        <div className="print-content-box bg-gray-50">
           <p className="text-gray-600 mb-3">จัดการลูกค้าที่มารอหน้าร้าน:</p>
           <ol className="list-decimal ml-6 space-y-2 text-gray-600">
             <li><strong>ลงทะเบียนคิวใหม่:</strong> กดปุ่ม "➕ เพิ่มคิว" ใส่ชื่อและเบอร์โทร</li>
             <li><strong>เรียกคิว:</strong> เมื่อเครื่องว่าง กดปุ่ม "📢 เรียกคิว" ที่รายการแรกสุด</li>
             <li><strong>รับลูกค้า (Assign):</strong> เมื่อลูกค้าแสดงตัว กด "Assign" แล้วเลือกเครื่องที่จะให้เล่น</li>
             <li><strong>ข้าม/ยกเลิก (Cancel):</strong> หากลูกค้าไม่มา กด "❌ ยกเลิก"</li>
           </ol>
        </div>
      </section>

      {/* 2.5 History */}
      <section className="py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-pink-500">📜</span> 2.5 จองเวลา & ประวัติการเล่น
        </h2>
        <div className="print-content-box bg-gray-50">
           <ul className="list-disc ml-6 space-y-2 text-gray-600">
             <li><strong>แท็บ จองเวลา (Bookings):</strong> ดูตารางการจองล่วงหน้าทั้งหมด</li>
             <li><strong>แท็บ ประวัติการเล่น (Sessions):</strong> ดูประวัติการเล่นที่จบไปแล้ว พร้อมยอดเงินรายรับ และแก้ไขสถานะการจ่ายเงิน</li>
           </ul>
        </div>
      </section>
    </>
  );
}

// --------------------------------------------------------------------------------
// GAME CONTROL GUIDE
// --------------------------------------------------------------------------------
function GameControlGuide() {
  return (
    <>
       <section className="print-section-cover py-16 bg-pink-50 rounded-2xl mb-8 text-center border border-pink-100 break-before-page">
        <div className="text-6xl mb-4">🎛️</div>
        <h2 className="text-4xl font-bold text-gray-900">ส่วนที่ 3</h2>
        <h3 className="text-2xl text-pink-600 mt-2">คู่มือห้องควบคุมเกม</h3>
        <p className="text-gray-600 mt-4">วิธีควบคุมเครื่องเล่น บันทึกเวลา และจัดการลูกค้า</p>
      </section>

      {/* 3.1 Access */}
      <section className="py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-pink-500">🚀</span> 3.1 เข้าหน้าห้องควบคุม
        </h2>
        <div className="print-content-box bg-gray-50">
           <p className="text-gray-600">เข้า URL: <code className="bg-gray-200 px-2 rounded font-mono">/backend/control</code></p>
           <p className="text-sm text-gray-500 mt-2">💡 แนะนำ: ควรใช้บน Tablet หรือหน้าจอ Monitor หลักของร้าน</p>
        </div>
      </section>

      {/* 3.2 Overview */}
      <section className="py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-purple-500">📊</span> 3.2 สถานะเครื่องเล่น (Overview)
        </h2>
        <div className="print-content-box bg-gray-50">
           <p className="text-gray-600 mb-3">ระบบแสดงสถานะการ์ด:</p>
           <div className="space-y-3">
             <div className="flex gap-3">
                <span className="text-green-600 font-bold">✅ ว่าง (Available)</span>
                <span className="text-gray-600">- เครื่องว่างพร้อมให้บริการ (กด "เริ่มเล่น" หรือ "เลือกจากคิว")</span>
             </div>
             <div className="flex gap-3">
                <span className="text-yellow-600 font-bold">📅 จองไว้ (Reserved)</span>
                <span className="text-gray-600">- มีลูกค้าจอง (รอ "Check-in" หรือจะขึ้นสีแดงถ้า Late)</span>
             </div>
              <div className="flex gap-3">
                <span className="text-orange-600 font-bold">🏁 กำลังเล่น (In Use)</span>
                <span className="text-gray-600">- กำลังใช้งาน (จับเวลา) กดเพื่อดูรายละเอียด/จบการเล่น</span>
             </div>
           </div>
        </div>
      </section>

      {/* 3.3 Sessions */}
      <section className="py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-cyan-500">⏱️</span> 3.3 การจัดการรอบเล่น (Session)
        </h2>
        <div className="print-content-box bg-gray-50">
           <div className="space-y-4">
             <div>
               <h3 className="font-bold text-gray-900">1. การเริ่มเล่น (Start)</h3>
               <ul className="list-disc ml-6 text-gray-600">
                  <li><strong>Walk-in:</strong> กดปุ่ม "เริ่มเล่น" ใส่ชื่อและเวลา</li>
                  <li><strong>Queue:</strong> กดปุ่ม "เลือกจากคิว" ดึงข้อมูลที่รอ</li>
                  <li><strong>Booking:</strong> กดปุ่ม "Check-in" เมื่อลูกค้ามาถึง</li>
               </ul>
             </div>
             <div>
               <h3 className="font-bold text-gray-900">2. ระหว่างเล่น (In Progress)</h3>
               <p className="text-gray-600">ระบบจับเวลาอัตโนมัติ คลิกการ์ดเพื่อแก้ไขราคารวม หรือดูเวลาที่เหลือ</p>
             </div>
             <div>
               <h3 className="font-bold text-gray-900">3. จบการเล่น (Finish)</h3>
               <ul className="list-disc ml-6 text-gray-600">
                  <li>กดปุ่ม <span className="text-red-600">"⏹️ จบการเล่น"</span></li>
                  <li>ระบบสรุปยอดเงินและเวลา</li>
                  <li>กดยืนยันเพื่อบันทึกและคืนสถานะเครื่องเป็น "ว่าง"</li>
               </ul>
             </div>
           </div>
        </div>
      </section>

      {/* 3.4 History */}
      <section className="py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-blue-500">📜</span> 3.4 ประวัติการเล่น (History)
        </h2>
        <div className="print-content-box bg-gray-50">
           <p className="text-gray-600">
             สามารถดูประวัติย้อนหลังของแต่ละเครื่องได้โดยกดปุ่ม 🕒 มุมขวาบนของการ์ดเครื่อง ระบบจะแสดง 5 รายการล่าสุด
           </p>
        </div>
      </section>
    </>
  );
}
