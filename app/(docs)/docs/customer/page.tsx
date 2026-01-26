import Link from 'next/link';

export default function CustomerDocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 print:max-w-none print:px-0 print:py-0">
      {/* Print Cover - Only visible when printing */}
      <div className="hidden print:block print:mb-8 print:pb-8 print:border-b-2 print:border-purple-500 print:text-center">
        <div className="text-6xl mb-4">📖</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">คู่มือสำหรับลูกค้า</h1>
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
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">คู่มือสำหรับลูกค้า</h1>
            <p className="text-gray-600 dark:text-gray-400">วิธีใช้งานระบบจองเวลาเล่นเกม</p>
          </div>
        </div>
      </header>

      {/* Section 1: วิธีจองเวลา */}
      <section id="booking" className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-500/30 flex items-center justify-center text-xl">
            📅
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">วิธีจองเวลาเล่น</h2>
        </div>

        <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 space-y-6">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
              1
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">เข้าหน้าจองเวลา</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                คลิกที่เมนู <span className="text-purple-600 dark:text-purple-400 font-medium">&ldquo;จองเวลา&rdquo;</span> บนแถบเมนู 
                หรือกดปุ่ม <span className="text-pink-600 dark:text-pink-400 font-medium">&ldquo;📅 จองเลย&rdquo;</span> ที่หน้าแรก
              </p>
              <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 rounded-xl">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  💡 <strong>Tip:</strong> สามารถสแกน QR Code ที่ร้านเพื่อเข้าหน้าจองได้โดยตรง
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
              2
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">เลือกเครื่องเล่น</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                เลือกเครื่องที่ต้องการเล่น จะมีแสดงรายชื่อเครื่องที่พร้อมใช้งาน
              </p>
              <ul className="text-gray-600 dark:text-gray-400 text-sm space-y-1 ml-4 list-disc">
                <li>แตะที่เครื่องที่ต้องการ</li>
                <li>ระบบจะไปขั้นตอนถัดไปอัตโนมัติ</li>
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
              3
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">เลือกวันและเวลา</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                เลื่อนเลือกวันที่ต้องการ (ล่วงหน้าได้ 7 วัน) แล้วเลือกช่วงเวลาที่ว่าง
              </p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 rounded-lg p-3 text-center">
                  <div className="w-4 h-4 rounded bg-emerald-500 mx-auto mb-1"></div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">ว่าง</p>
                </div>
                <div className="bg-red-50 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 rounded-lg p-3 text-center">
                  <div className="w-4 h-4 rounded bg-red-500 mx-auto mb-1"></div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">จองแล้ว</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-500/20 border border-gray-300 dark:border-gray-500/30 rounded-lg p-3 text-center">
                  <div className="w-4 h-4 rounded bg-gray-400 dark:bg-gray-500 mx-auto mb-1"></div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">ผ่านไปแล้ว</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="text-pink-600 dark:text-pink-400">สีชมพู</span> = ช่วงเวลาที่คุณเลือก
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
              4
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">กรอกข้อมูลและยืนยัน</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                กรอกชื่อและเบอร์โทร เลือกระยะเวลาเล่น แล้วกดยืนยัน
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/30 rounded text-amber-700 dark:text-amber-300">แนะนำ</span>
                  <span className="text-gray-600 dark:text-gray-400">60 นาที - ราคาคุ้มค่าที่สุด</span>
                </div>
              </div>
            </div>
          </div>

          {/* Success */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
              ✓
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-emerald-600 dark:text-emerald-400 mb-2">จองสำเร็จ!</h3>
              <p className="text-gray-600 dark:text-gray-400">
                เมื่อจองสำเร็จ ระบบจะแสดงรายละเอียดการจอง และบันทึกเบอร์โทรเพื่อเช็คสถานะได้ในภายหลัง
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: ดูสถานะการจอง */}
      <section id="status" className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-300 dark:border-cyan-500/30 flex items-center justify-center text-xl">
            📋
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">ดูสถานะการจอง</h2>
        </div>

        <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            ไปที่เมนู <span className="text-cyan-600 dark:text-cyan-400 font-medium">&ldquo;สถานะการจอง&rdquo;</span> บนแถบเมนู
          </p>
          
          <ol className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-cyan-600 dark:text-cyan-400">1.</span>
              กรอกเบอร์โทรศัพท์ที่ใช้จอง
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-600 dark:text-cyan-400">2.</span>
              ระบบจะแสดงรายการจองทั้งหมดของคุณ
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-600 dark:text-cyan-400">3.</span>
              สามารถดูรายละเอียด วันที่ เวลา และสถานะได้
            </li>
          </ol>

          <div className="mt-4 p-4 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 rounded-xl">
            <h4 className="font-bold text-cyan-700 dark:text-cyan-400 mb-2">สถานะการจอง</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-purple-500 text-white rounded text-xs">รอ</span>
                <span className="text-gray-700 dark:text-gray-300">รอถึงเวลานัดหมาย</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-500 text-white rounded text-xs">ยืนยัน</span>
                <span className="text-gray-700 dark:text-gray-300">การจองได้รับการยืนยันแล้ว</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-gray-500 text-white rounded text-xs">เสร็จ</span>
                <span className="text-gray-700 dark:text-gray-300">เล่นเสร็จแล้ว</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-red-500 text-white rounded text-xs">ยกเลิก</span>
                <span className="text-gray-700 dark:text-gray-300">การจองถูกยกเลิก</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 3: ดูตารางการจอง */}
      <section id="history" className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-500/20 border border-pink-300 dark:border-pink-500/30 flex items-center justify-center text-xl">
            📜
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">ดูตารางการจอง</h2>
        </div>

        <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            ไปที่เมนู <span className="text-pink-600 dark:text-pink-400 font-medium">&ldquo;ตารางจอง&rdquo;</span> บนแถบเมนู
          </p>
          
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <p>หน้านี้แสดง:</p>
            <ul className="ml-4 space-y-2 list-disc">
              <li>ตารางการจองทั้งหมดของวันนี้</li>
              <li>สามารถเลือกดูวันอื่นได้</li>
              <li>กรองตามเครื่องที่ต้องการดู</li>
              <li>เห็นช่วงเวลาว่าง/จองแล้ว</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/30 rounded-xl">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              💡 <strong>Tip:</strong> ใช้หน้านี้เพื่อดูว่าช่วงไหนว่างก่อนจอง
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links - Hidden in Print */}
      <section className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-500/10 dark:to-pink-500/10 border border-purple-300 dark:border-purple-500/30 rounded-2xl p-6 print:hidden">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">🔗 ลิงก์ใช้งาน</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/time-booking" className="bg-white/50 dark:bg-purple-500/20 hover:bg-white dark:hover:bg-purple-500/30 border border-purple-300 dark:border-purple-500/30 rounded-xl p-4 text-center transition-all">
            <span className="text-2xl block mb-2">📅</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">จองเวลา</span>
          </Link>
          <Link href="/customer/booking-status" className="bg-white/50 dark:bg-cyan-500/20 hover:bg-white dark:hover:bg-cyan-500/30 border border-cyan-300 dark:border-cyan-500/30 rounded-xl p-4 text-center transition-all">
            <span className="text-2xl block mb-2">📋</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">สถานะการจอง</span>
          </Link>
          <Link href="/customer/booking-history" className="bg-white/50 dark:bg-pink-500/20 hover:bg-white dark:hover:bg-pink-500/30 border border-pink-300 dark:border-pink-500/30 rounded-xl p-4 text-center transition-all">
            <span className="text-2xl block mb-2">📜</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">ตารางจอง</span>
          </Link>
          <Link href="/" className="bg-white/50 dark:bg-gray-500/20 hover:bg-white dark:hover:bg-gray-500/30 border border-gray-300 dark:border-gray-500/30 rounded-xl p-4 text-center transition-all">
            <span className="text-2xl block mb-2">🏠</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">หน้าแรก</span>
          </Link>
        </div>
      </section>

      {/* Navigation - Hidden in Print */}
      <div className="mt-12 flex justify-between print:hidden">
        <Link 
          href="/docs"
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all"
        >
          ← กลับหน้าคู่มือ
        </Link>
        <Link 
          href="/docs/admin"
          className="px-6 py-3 bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-500/20 dark:hover:bg-cyan-500/30 border border-cyan-300 dark:border-cyan-500/30 rounded-xl text-cyan-700 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-white transition-all"
        >
          คู่มือแอดมิน →
        </Link>
      </div>

      {/* Print Footer */}
      <div className="hidden print:block print:mt-8 print:pt-4 print:border-t print:border-gray-300 print:text-center print:text-sm print:text-gray-500">
        <p>Racing Game Station - คู่มือสำหรับลูกค้า | หน้า _____</p>
      </div>
    </div>
  );
}
