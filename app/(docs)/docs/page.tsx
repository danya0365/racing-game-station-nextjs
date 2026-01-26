import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 print:max-w-none print:px-0 print:py-0">
      {/* Print Cover - Only visible when printing */}
      <div className="hidden print:block print:mb-8 print:pb-8 print:border-b-2 print:border-purple-500 print:text-center">
        <div className="text-6xl mb-4">📖</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">คู่มือการใช้งาน</h1>
        <p className="text-xl text-gray-600">Racing Game Station - ระบบจองเวลาเล่นเกม</p>
        <p className="text-sm text-gray-500 mt-4">พิมพ์เมื่อ: มกราคม 2026</p>
      </div>

      {/* Header */}
      <header className="text-center mb-16 print:hidden">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600 text-5xl shadow-2xl shadow-purple-500/30 mb-6">
          📖
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            คู่มือการใช้งาน
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Racing Game Station - ระบบจองเวลาเล่นเกม
        </p>
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">

            <Link 
              href="/docs/print"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all font-medium"
            >
              🖨️ พิมพ์คู่มือทั้งหมด
            </Link>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 italic">
            * คลิกที่นี่สำหรับพิมพ์เป็นเล่มหรือบันทึกเป็น PDF
          </p>
        </div>
      </header>

      {/* Quick Start Cards - Hidden in Print */}
      <section className="grid md:grid-cols-3 gap-6 mb-16 print:hidden">
        <Link href="/docs/customer" className="group">
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-500/10 dark:to-pink-500/10 border border-purple-300 dark:border-purple-500/30 hover:border-purple-400 rounded-2xl p-6 transition-all group-hover:shadow-lg group-hover:shadow-purple-500/20">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-3xl mb-4">
              👤
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">สำหรับลูกค้า</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">วิธีจองเวลา ดูสถานะ และใช้งานระบบ</p>
            <span className="inline-flex items-center text-purple-600 dark:text-purple-400 group-hover:text-purple-500 dark:group-hover:text-purple-300">
              เริ่มต้นใช้งาน →
            </span>
          </div>
        </Link>

        <Link href="/docs/admin" className="group">
          <div className="bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-500/10 dark:to-blue-500/10 border border-cyan-300 dark:border-cyan-500/30 hover:border-cyan-400 rounded-2xl p-6 transition-all group-hover:shadow-lg group-hover:shadow-cyan-500/20">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl mb-4">
              ⚙️
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">สำหรับแอดมิน</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">วิธีจัดการเครื่อง คิว และการจอง</p>
            <span className="inline-flex items-center text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-500 dark:group-hover:text-cyan-300">
              ดูวิธีจัดการ →
            </span>
          </div>
        </Link>

        <Link href="/docs/game-control" className="group">
          <div className="bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-500/10 dark:to-rose-500/10 border border-pink-300 dark:border-pink-500/30 hover:border-pink-400 rounded-2xl p-6 transition-all group-hover:shadow-lg group-hover:shadow-pink-500/20">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-3xl mb-4">
              🎛️
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">ห้องควบคุมเกม</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">วิธีควบคุมเครื่องและจับเวลา</p>
            <span className="inline-flex items-center text-pink-600 dark:text-pink-400 group-hover:text-pink-500 dark:group-hover:text-pink-300">
              เปิดคู่มือควบคุม →
            </span>
          </div>
        </Link>
      </section>

      {/* Table of Contents */}
      <section className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <span className="text-2xl">📋</span>
          สารบัญ
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-purple-600 dark:text-purple-400 mb-2">👤 คู่มือลูกค้า</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400 ml-6">
              <li>
                <Link href="/docs/customer#booking" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  → วิธีจองเวลาเล่น
                </Link>
              </li>
              <li>
                <Link href="/docs/customer#status" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  → ดูสถานะการจอง
                </Link>
              </li>
              <li>
                <Link href="/docs/customer#history" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  → ดูตารางการจอง
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-cyan-600 dark:text-cyan-400 mb-2">⚙️ คู่มือแอดมิน</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400 ml-6">
              <li>
                <Link href="/docs/admin#dashboard" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  → หน้า Dashboard
                </Link>
              </li>
              <li>
                <Link href="/docs/admin#machines" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  → จัดการเครื่อง
                </Link>
              </li>
              <li>
                <Link href="/docs/admin#bookings" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  → จัดการการจอง
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-pink-600 dark:text-pink-400 mb-2">🎛️ คู่มือห้องควบคุมเกม</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400 ml-6">
              <li>
                <Link href="/docs/game-control#access" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  → เข้าหน้าห้องควบคุม
                </Link>
              </li>
              <li>
                <Link href="/docs/game-control#timer" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  → ระบบจับเวลา
                </Link>
              </li>
              <li>
                <Link href="/docs/game-control#current" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  → จัดการการจองปัจจุบัน
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer - Hidden in Print */}
      <footer className="mt-16 text-center text-gray-500 text-sm print:hidden">
        <p>เวอร์ชัน 1.0 | อัปเดตล่าสุด: มกราคม 2026</p>
      </footer>

      {/* Print-only Table of Contents */}
      <div className="hidden print:block print:mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 สารบัญ</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-purple-700 mb-2">👤 คู่มือลูกค้า</h3>
            <ul className="space-y-1 text-gray-600 ml-6">
              <li>• วิธีจองเวลาเล่น</li>
              <li>• ดูสถานะการจอง</li>
              <li>• ดูตารางการจอง</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-cyan-700 mb-2">⚙️ คู่มือแอดมิน</h3>
            <ul className="space-y-1 text-gray-600 ml-6">
              <li>• หน้า Dashboard</li>
              <li>• แท็บต่างๆ ในหน้าแอดมิน</li>
              <li>• วิธีเปลี่ยนสถานะเครื่อง</li>
              <li>• ยืนยัน/ยกเลิกการจอง</li>
              <li>• พิมพ์ QR Code</li>
            </ul>
          </div>
        </div>
        
        <p className="mt-8 text-sm text-gray-500 border-t border-gray-300 pt-4">
          Racing Game Station - คู่มือการใช้งาน | หน้า 1
        </p>
      </div>
    </div>
  );
}
