import Link from 'next/link';

export default function GameControlDocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 print:max-w-none print:px-0 print:py-0">
      {/* Print Cover - Only visible when printing */}
      <div className="hidden print:block print:mb-8 print:pb-8 print:border-b-2 print:border-pink-500 print:text-center">
        <div className="text-6xl mb-4">🎛️</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">คู่มือห้องควบคุมเกม</h1>
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
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-3xl">
            🎛️
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">คู่มือห้องควบคุมเกม</h1>
            <p className="text-gray-600 dark:text-gray-400">วิธีควบคุมเครื่องเล่นและจัดการเซสชัน</p>
          </div>
        </div>
      </header>

      {/* Section 1: เข้าหน้าห้องควบคุม */}
      <section id="access" className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-500/20 border border-pink-300 dark:border-pink-500/30 flex items-center justify-center text-xl">
            🚀
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">เข้าหน้าห้องควบคุม</h2>
        </div>

        <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            เข้าสู่หน้าห้องควบคุมได้ 2 วิธี:
          </p>
          
          <ol className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-pink-600 dark:text-pink-400">1.</span>
              จากหน้าแอดมิน คลิกที่ <span className="text-pink-600 dark:text-pink-400 font-medium">&ldquo;🎛️ ห้องควบคุม&rdquo;</span> ในส่วนลิงก์ด้านล่าง
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-600 dark:text-pink-400">2.</span>
              หรือเข้า URL โดยตรง: <code className="px-2 py-1 bg-gray-200 dark:bg-white/10 rounded text-pink-700 dark:text-pink-300 text-sm">/backend/control</code>
            </li>
          </ol>

          <div className="mt-4 p-4 bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/30 rounded-xl">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              💡 <strong>Tip:</strong> หน้านี้ออกแบบมาสำหรับใช้งานบนหน้าจอขนาดใหญ่ แนะนำให้ใช้บน Tablet หรือ PC
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: ภาพรวมหน้าจอหลัก */}
      <section id="overview" className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-500/30 flex items-center justify-center text-xl">
            📊
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">ภาพรวมหน้าจอหลัก</h2>
        </div>

        <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 space-y-6">
          <p className="text-gray-600 dark:text-gray-400">
            หน้าห้องควบคุมแสดงข้อมูลแบบเรียลไทม์:
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">✓</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">เครื่องว่าง</div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">🏁</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">กำลังเล่น</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">📅</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">การจองวันนี้</div>
            </div>
            <div className="bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">⏰</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Slots ว่าง</div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 rounded-xl">
            <h4 className="font-bold text-purple-700 dark:text-purple-400 mb-2">การ์ดเครื่องแต่ละเครื่อง</h4>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>🟢 <strong>เครื่องว่าง</strong> - แสดงกรอบสีเขียว พร้อมรายการจองถัดไป</li>
              <li>🟠 <strong>กำลังเล่น</strong> - แสดงกรอบสีส้ม พร้อมข้อมูลลูกค้าและเวลาเหลือ</li>
              <li>📊 <strong>แถบตารางวันนี้</strong> - แสดง slots ทั้งหมดของวัน (เขียว=ว่าง, แดง=จองแล้ว)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 3: ระบบจับเวลา */}
      <section id="timer" className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-300 dark:border-cyan-500/30 flex items-center justify-center text-xl">
            ⏱️
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">ระบบจับเวลา (Session Timer)</h2>
        </div>

        <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            ระบบจับเวลาช่วยบันทึกเวลาเล่นจริงของลูกค้า:
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="px-3 py-1 bg-cyan-500 text-white rounded-full text-xs font-bold">▶️ เริ่ม</span>
              <div>
                <p className="text-gray-700 dark:text-gray-300 font-medium">เริ่มจับเวลา</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">กดเมื่อลูกค้าเริ่มเล่น ระบบจะบันทึกเวลาเริ่มต้น</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold">⏸️ หยุด</span>
              <div>
                <p className="text-gray-700 dark:text-gray-300 font-medium">หยุดชั่วคราว</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">กดเพื่อพักเวลา เช่น ลูกค้าเข้าห้องน้ำ หรือพักเบรก</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-bold">▶️ ต่อ</span>
              <div>
                <p className="text-gray-700 dark:text-gray-300 font-medium">เริ่มจับเวลาต่อ (Resume)</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">กดเพื่อจับเวลาต่อจากที่หยุดไว้ ระบบจะรวมเวลาสะสม</p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 rounded-xl">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              💡 <strong>Tip:</strong> ระบบรองรับการ หยุด-เริ่มต่อ หลายครั้ง และจะรวมเวลาทั้งหมดที่เล่นจริง
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: จัดการการจองปัจจุบัน */}
      <section id="current" className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-center text-xl">
            ✅
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">จัดการการจองปัจจุบัน</h2>
        </div>

        <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            เมื่อมีการจองที่กำลังเล่นอยู่:
          </p>
          
          <ol className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">1.</span>
              มองหาการ์ดเครื่องที่มี <span className="text-orange-600 dark:text-orange-400 font-medium">&ldquo;🏁 กำลังเล่น&rdquo;</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">2.</span>
              จะเห็นข้อมูล: ชื่อลูกค้า, เบอร์โทร, เวลาเริ่ม-สิ้นสุด, และเวลาที่เหลือ
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">3.</span>
              ใช้ปุ่มจับเวลาเพื่อบันทึกเวลาเล่นจริง
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">4.</span>
              กดปุ่ม <span className="text-emerald-600 dark:text-emerald-400 font-medium">&ldquo;✅ เสร็จสิ้น&rdquo;</span> เมื่อลูกค้าเล่นเสร็จก่อนเวลา
            </li>
          </ol>

          <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              💡 <strong>หมายเหตุ:</strong> การจองจะเปลี่ยนเป็น &ldquo;สำเร็จ&rdquo; อัตโนมัติเมื่อหมดเวลา หรือกดปุ่มเสร็จสิ้นก่อนได้
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: ดูรายละเอียดการจอง */}
      <section id="details" className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-500/30 flex items-center justify-center text-xl">
            📋
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">ดูรายละเอียดการจอง</h2>
        </div>

        <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            คลิกที่ส่วนใดก็ได้ของการจองเพื่อดูรายละเอียดเพิ่มเติม:
          </p>
          
          <ul className="space-y-2 text-gray-600 dark:text-gray-400 ml-4 list-disc">
            <li>คลิกที่ <span className="text-orange-600 dark:text-orange-400 font-medium">&ldquo;🏁 กำลังเล่น&rdquo;</span> badge</li>
            <li>คลิกที่กล่องข้อมูลการจองปัจจุบัน</li>
            <li>คลิกที่รายการจองถัดไปในส่วน &ldquo;📅 การจองถัดไป&rdquo;</li>
          </ul>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl">
            <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-2">ข้อมูลที่แสดงในหน้าต่างรายละเอียด</h4>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>📊 ข้อมูลลูกค้า (ชื่อ, เบอร์โทร)</li>
              <li>⏰ เวลาจอง และระยะเวลา</li>
              <li>📜 ประวัติการจับเวลา (Session Logs)</li>
              <li>🎮 ปุ่มควบคุมเซสชัน (เริ่ม/หยุด)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Quick Links - Hidden in Print */}
      <section className="bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-500/10 dark:to-rose-500/10 border border-pink-300 dark:border-pink-500/30 rounded-2xl p-6 print:hidden">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">🔗 ลิงก์ที่เกี่ยวข้อง</h3>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/backend" className="bg-white/50 dark:bg-cyan-500/20 hover:bg-white dark:hover:bg-cyan-500/30 border border-cyan-300 dark:border-cyan-500/30 rounded-xl p-4 text-center transition-all">
            <span className="text-2xl block mb-2">📊</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">Dashboard</span>
          </Link>
          <Link href="/backend/control" className="bg-white/50 dark:bg-pink-500/20 hover:bg-white dark:hover:bg-pink-500/30 border border-pink-300 dark:border-pink-500/30 rounded-xl p-4 text-center transition-all">
            <span className="text-2xl block mb-2">🎛️</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">เปิดห้องควบคุม</span>
          </Link>
        </div>
      </section>

      {/* Navigation - Hidden in Print */}
      <div className="mt-12 flex justify-between print:hidden">
        <Link 
          href="/docs/admin"
          className="px-6 py-3 bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-500/20 dark:hover:bg-cyan-500/30 border border-cyan-300 dark:border-cyan-500/30 rounded-xl text-cyan-700 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-white transition-all"
        >
          ← คู่มือแอดมิน
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
        <p>Racing Game Station - คู่มือห้องควบคุมเกม | หน้า _____</p>
      </div>
    </div>
  );
}
