import Link from 'next/link';

export default function AdminDocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 print:max-w-none print:px-0 print:py-0">
      {/* Print Cover - Only visible when printing */}
      <div className="hidden print:block print:mb-8 print:pb-8 print:border-b-2 print:border-cyan-500 print:text-center">
        <div className="text-6xl mb-4">⚙️</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">คู่มือสำหรับแอดมิน</h1>
        <p className="text-xl text-gray-600">Racing Game Station - ระบบจองเวลาเล่นเกม</p>
        <p className="text-sm text-gray-500 mt-4">พิมพ์เมื่อ: มกราคม 2026</p>
      </div>

      {/* Header */}
      <header className="mb-12 print:hidden">
        <Link 
          href="/docs"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-6"
        >
          ← กลับหน้าคู่มือ
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl">
            ⚙️
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">คู่มือสำหรับแอดมิน</h1>
            <p className="text-gray-600 dark:text-gray-400">วิธีจัดการระบบ เครื่อง และการจอง</p>
          </div>
        </div>
      </header>

      {/* Section 1: Dashboard */}
      <section id="dashboard" className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-300 dark:border-cyan-500/30 flex items-center justify-center text-xl">
            📊
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">แท็บ Dashboard</h2>
        </div>

        <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            หน้าแรกสำหรับดูภาพรวมของร้าน ประกอบด้วย:
          </p>
          
          <ul className="space-y-3 text-gray-600 dark:text-gray-400 list-disc ml-4">
            <li>
              <strong>Real-time Status:</strong> การ์ดแสดงจำนวนเครื่องว่าง, คิวรอ, และรายได้วันนี้
            </li>
            <li>
              <strong>Incoming Bookings:</strong> ตารางแสดง Booking ที่กำลังจะมาถึง (เตรียมเครื่องให้พร้อม) และ <span className="text-red-500 font-bold">Overdue</span> (เลยเวลานัด)
            </li>
            <li>
              <strong>Traffic Source:</strong> กราฟเปรียบเทียบลูกค้า Walk-in vs Booking
            </li>
          </ul>

          <div className="mt-4 p-4 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 rounded-xl">
            <h4 className="font-bold text-cyan-700 dark:text-cyan-400 mb-2">💡 Tips</h4>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>หากมีรายการ <span className="text-red-500">Overdue Booking</span> ให้รีบโทรตามลูกค้าทันที</li>
              <li>ใช้ปุ่ม <strong>"🖨️ Print QR"</strong> มุมขวาบน เพื่อพิมพ์ QR Code ให้ลูกค้าสแกนจองหน้าร้าน</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 2: Manage Machines */}
      <section id="machines" className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-center text-xl">
            🎮
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">จัดการเครื่อง (Machines)</h2>
        </div>

        <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            ในแท็บนี้ ท่านสามารถจัดการสถานะและข้อมูลของเครื่องเล่นแต่ละเครื่อง:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
             <div className="border border-gray-200 dark:border-white/10 rounded-xl p-4 bg-white/50 dark:bg-black/20">
               <h4 className="font-bold text-gray-900 dark:text-white mb-2">เปลี่ยนสถานะ</h4>
               <p className="text-sm text-gray-500 dark:text-gray-400">
                 กดปุ่มสถานะเพื่อเปลี่ยนทันที เช่น <span className="text-emerald-600 font-medium">"✅ เปิดใช้งาน"</span> หรือ <span className="text-gray-500 font-medium">"🔧 ซ่อมบำรุง"</span>
               </p>
             </div>
             <div className="border border-gray-200 dark:border-white/10 rounded-xl p-4 bg-white/50 dark:bg-black/20">
               <h4 className="font-bold text-gray-900 dark:text-white mb-2">แก้ไขข้อมูล</h4>
               <p className="text-sm text-gray-500 dark:text-gray-400">
                 กดปุ่ม <span className="text-blue-500 font-medium">"✏️ แก้ไข"</span> เพื่อเปลี่ยนชื่อเครื่อง, รายละเอียด, หรือซ่อน/แสดงเครื่อง
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* Section 3: Manage Customers */}
      <section id="customers" className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-500/20 border border-orange-300 dark:border-orange-500/30 flex items-center justify-center text-xl">
            👥
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">จัดการลูกค้า (Customers)</h2>
        </div>

        <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            แท็บสำหรับดูข้อมูลและจัดการลูกค้าทั้งหมดในระบบ:
          </p>

          <ul className="space-y-3 text-gray-600 dark:text-gray-400 list-disc ml-4">
            <li>
               <strong>Stats:</strong> ดูจำนวนลูกค้าทั้งหมด, ลูกค้า <span className="text-amber-500 font-bold">VIP</span>, ลูกค้าใหม่วันนี้, และลูกค้าประจำ
            </li>
            <li>
               <strong>Search & Filter:</strong> ค้นหาชื่อ/เบอร์โทร หรือกดปุ่ม Filter เพื่อดูเฉพาะกลุ่ม (เช่น เฉพาะ VIP)
            </li>
            <li>
               <strong>VIP Management:</strong> กดปุ่ม <span className="text-amber-500 font-bold">"⭐ VIP"</span> เพื่อปรับสถานะลูกค้าให้เป็น VIP (ได้รับสิทธิพิเศษ)
            </li>
            <li>
               <strong>Add/Edit:</strong> เพิ่มลูกค้าใหม่เข้าระบบ หรือแก้ไขข้อมูลลูกค้าเดิม
            </li>
          </ul>
        </div>
      </section>

      {/* Section 4: Manage Queue */}
      <section id="walk-in" className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/30 flex items-center justify-center text-xl">
            🚶
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">คิวหน้าร้าน (Walk-in Queue)</h2>
        </div>

        <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            ใช้แท็บนี้สำหรับจัดการลูกค้าที่มารอหน้าร้านโดยไม่ได้จองล่วงหน้า:
          </p>
          
          <ol className="list-decimal space-y-3 ml-4 text-gray-600 dark:text-gray-400">
            <li>
               <strong>ลงทะเบียนคิวใหม่:</strong> กดปุ่ม "➕ เพิ่มคิว" ใส่ชื่อและเบอร์โทร
            </li>
            <li>
               <strong>เรียกคิว:</strong> เมื่อเครื่องว่าง กดปุ่ม "📢 เรียกคิว" ที่รายการแรกสุด
            </li>
            <li>
               <strong>รับลูกค้า (Assign):</strong> เมื่อลูกค้าแสดงตัว กด "Assign" แล้วเลือกเครื่องที่จะให้เล่น
            </li>
            <li>
               <strong>ข้าม/ยกเลิก (Cancel):</strong> หากลูกค้าไม่มา กด "❌ ยกเลิก"
            </li>
          </ol>
        </div>
      </section>

      {/* Section 4: History & Bookings */}
      <section id="bookings" className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-500/20 border border-pink-300 dark:border-pink-500/30 flex items-center justify-center text-xl">
            📜
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">จองเวลา & ประวัติการเล่น</h2>
        </div>

        <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 space-y-4">
          <div className="space-y-4">
             <div>
                <h4 className="font-bold text-pink-600 dark:text-pink-400 mb-1">📅 แท็บ จองเวลา (Bookings)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ดูตารางการจองล่วงหน้าทั้งหมด สามารถดูแยกตามวัน หรือค้นหาชื่อลูกค้าได้
                </p>
             </div>
             <div>
                <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-1">⏱️ แท็บ ประวัติการเล่น (Sessions)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ดูประวัติการเล่นที่จบไปแล้ว (Completed Sessions) พร้อมยอดเงินรายรับ สามารถกดแก้ไขสถานะ "จ่ายแล้ว/ยังไม่จ่าย" ได้ที่นี่
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* Quick Links - Hidden in Print */}
      <section className="bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-500/10 dark:to-blue-500/10 border border-cyan-300 dark:border-cyan-500/30 rounded-2xl p-6 print:hidden">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">🔗 ลิงก์แอดมิน</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Link href="/backend" className="bg-white/50 dark:bg-cyan-500/20 hover:bg-white dark:hover:bg-cyan-500/30 border border-cyan-300 dark:border-cyan-500/30 rounded-xl p-4 text-center transition-all">
            <span className="text-2xl block mb-2">📊</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">Dashboard</span>
          </Link>
          <Link href="/backend/control" className="bg-white/50 dark:bg-pink-500/20 hover:bg-white dark:hover:bg-pink-500/30 border border-pink-300 dark:border-pink-500/30 rounded-xl p-4 text-center transition-all">
            <span className="text-2xl block mb-2">🎛️</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">ห้องควบคุม</span>
          </Link>
          <Link href="/docs/game-control" className="bg-white/50 dark:bg-purple-500/20 hover:bg-white dark:hover:bg-purple-500/30 border border-purple-300 dark:border-purple-500/30 rounded-xl p-4 text-center transition-all">
            <span className="text-2xl block mb-2">📖</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">คู่มือห้องควบคุม</span>
          </Link>
        </div>
      </section>

      {/* Navigation - Hidden in Print */}
      <div className="mt-12 flex justify-between print:hidden">
        <Link 
          href="/docs/customer"
          className="px-6 py-3 bg-purple-100 hover:bg-purple-200 dark:bg-purple-500/20 dark:hover:bg-purple-500/30 border border-purple-300 dark:border-purple-500/30 rounded-xl text-purple-700 hover:text-purple-800 dark:text-purple-400 dark:hover:text-white transition-all"
        >
          ← คู่มือลูกค้า
        </Link>
        <Link 
          href="/docs"
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all"
        >
          กลับหน้าคู่มือ
        </Link>
      </div>

      {/* Print Footer */}
      <div className="hidden print:block print:mt-8 print:pt-4 print:border-t print:border-gray-300 print:text-center print:text-sm print:text-gray-500">
        <p>Racing Game Station - คู่มือสำหรับแอดมิน | หน้า _____</p>
      </div>
    </div>
  );
}
