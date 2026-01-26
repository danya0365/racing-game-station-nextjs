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

      {/* Section 1: เข้าหน้าแอดมิน */}
      <section id="dashboard" className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-300 dark:border-cyan-500/30 flex items-center justify-center text-xl">
            📊
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">เข้าหน้า Dashboard</h2>
        </div>

        <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            เข้าสู่หน้าแอดมินได้ 2 วิธี:
          </p>
          
          <ol className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-cyan-600 dark:text-cyan-400">1.</span>
              คลิกที่เมนู <span className="text-cyan-600 dark:text-cyan-400 font-medium">&ldquo;แอดมิน&rdquo;</span> บนแถบเมนู
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-600 dark:text-cyan-400">2.</span>
              หรือเข้า URL โดยตรง: <code className="px-2 py-1 bg-gray-200 dark:bg-white/10 rounded text-cyan-700 dark:text-cyan-300 text-sm">/backend</code>
            </li>
          </ol>

          <div className="mt-4 p-4 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 rounded-xl">
            <h4 className="font-bold text-cyan-700 dark:text-cyan-400 mb-2">หน้า Dashboard แสดงอะไรบ้าง?</h4>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>📊 สถิติรวม - จำนวนเครื่อง, เครื่องว่าง, คิวรอ, กำลังเล่น</li>
              <li>📋 คิวล่าสุดวันนี้</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 2: Tabs */}
      <section className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-500/30 flex items-center justify-center text-xl">
            📑
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">แท็บต่างๆ ในหน้าแอดมิน</h2>
        </div>

        <div className="grid gap-4">
          {/* Dashboard Tab */}
          <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
              <span className="text-cyan-600 dark:text-cyan-400">📊</span> Dashboard
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              ภาพรวมของร้าน สถิติเครื่อง และคิวล่าสุด
            </p>
          </div>

          {/* Machines Tab */}
          <div id="machines" className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
              <span className="text-emerald-600 dark:text-emerald-400">🎮</span> จัดการเครื่อง
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              จัดการเครื่องเล่นทั้งหมด
            </p>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 ml-4 list-disc">
              <li>เปลี่ยนสถานะเครื่อง (ว่าง / กำลังเล่น / ปิดซ่อม)</li>
              <li>ดูคิวของแต่ละเครื่อง</li>
              <li>Reset คิวเครื่อง</li>
            </ul>
          </div>

          {/* Customers Tab */}
          <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
              <span className="text-orange-600 dark:text-orange-400">👥</span> จัดการลูกค้า
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              ดูและจัดการข้อมูลลูกค้า
            </p>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 ml-4 list-disc">
              <li>ค้นหาลูกค้าจากเบอร์โทร</li>
              <li>ดูประวัติการจอง</li>
            </ul>
          </div>

          {/* Bookings Tab */}
          <div id="bookings" className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
              <span className="text-pink-600 dark:text-pink-400">📅</span> จองเวลา
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              จัดการการจองเวลาทั้งหมด
            </p>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 ml-4 list-disc">
              <li>ดูตารางการจองแยกตามเครื่อง</li>
              <li>ยืนยัน / ยกเลิกการจอง</li>
              <li>เลือกดูวันอื่นๆ ได้</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 3: เปลี่ยนสถานะเครื่อง */}
      <section className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-center text-xl">
            🔄
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">วิธีเปลี่ยนสถานะเครื่อง</h2>
        </div>

        <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            ไปที่แท็บ <span className="text-emerald-600 dark:text-emerald-400 font-medium">&ldquo;จัดการเครื่อง&rdquo;</span>
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-bold">ว่าง</span>
              <p className="text-gray-600 dark:text-gray-400 text-sm">เครื่องพร้อมใช้งาน ลูกค้าจองได้</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-bold">กำลังเล่น</span>
              <p className="text-gray-600 dark:text-gray-400 text-sm">มีลูกค้ากำลังเล่นอยู่</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="px-3 py-1 bg-gray-500 text-white rounded-full text-xs font-bold">ปิดซ่อม</span>
              <p className="text-gray-600 dark:text-gray-400 text-sm">เครื่องอยู่ในโหมดซ่อมบำรุง ลูกค้าจองไม่ได้</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              💡 <strong>วิธีเปลี่ยน:</strong> กดปุ่ม <span className="text-emerald-600 dark:text-emerald-400">&ldquo;🔧 ปิดซ่อม&rdquo;</span> หรือ <span className="text-emerald-600 dark:text-emerald-400">&ldquo;✅ เปิดเครื่อง&rdquo;</span>
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: จัดการการจอง */}
      <section className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-500/20 border border-pink-300 dark:border-pink-500/30 flex items-center justify-center text-xl">
            ✅
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">ยืนยัน/ยกเลิกการจอง</h2>
        </div>

        <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            ไปที่แท็บ <span className="text-pink-600 dark:text-pink-400 font-medium">&ldquo;จองเวลา&rdquo;</span>
          </p>
          
          <ol className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-pink-600 dark:text-pink-400">1.</span>
              เลือกเครื่องที่ต้องการดู (หรือเลือก &ldquo;ทุกเครื่อง&rdquo;)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-600 dark:text-pink-400">2.</span>
              เลือกวันที่ต้องการดู
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-600 dark:text-pink-400">3.</span>
              ดูรายการจองในตาราง
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-600 dark:text-pink-400">4.</span>
              กดปุ่ม <span className="text-emerald-600 dark:text-emerald-400">&ldquo;✅&rdquo;</span> เพื่อยืนยัน หรือ <span className="text-red-600 dark:text-red-400">&ldquo;❌&rdquo;</span> เพื่อยกเลิก
            </li>
          </ol>
        </div>
      </section>

      {/* Section 5: Print QR */}
      <section className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-500/30 flex items-center justify-center text-xl">
            🖨️
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">พิมพ์ QR Code</h2>
        </div>

        <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            กดปุ่ม <span className="text-blue-600 dark:text-blue-400 font-medium">&ldquo;🖨️ Print QR&rdquo;</span> ที่ด้านบนของหน้าแอดมิน
          </p>
          
          <p className="text-gray-600 dark:text-gray-400">
            ระบบจะพิมพ์ QR Code สำหรับให้ลูกค้าสแกนเพื่อจองเวลา ติดไว้ที่ร้านได้เลย
          </p>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              💡 <strong>Tip:</strong> QR Code จะลิงก์ไปที่หน้าจองเวลาโดยตรง
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links - Hidden in Print */}
      <section className="bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-500/10 dark:to-blue-500/10 border border-cyan-300 dark:border-cyan-500/30 rounded-2xl p-6 print:hidden">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">🔗 ลิงก์แอดมิน</h3>
        <div className="grid grid-cols-3 gap-3">
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
