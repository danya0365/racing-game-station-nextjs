import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 print:max-w-none print:px-0 print:py-0">
      {/* Print Cover - Only visible when printing */}
      <div className="hidden print:block print:mb-8 print:pb-8 print:border-b-2 print:border-racing-flag print:text-center">
        <div className="text-6xl mb-4">📖</div>
        <h1 className="text-4xl font-bold text-foreground mb-2">คู่มือการใช้งาน</h1>
        <p className="text-xl text-muted">Racing Game Station - ระบบจองเวลาเล่นเกม</p>
        <p className="text-sm text-muted mt-4">พิมพ์เมื่อ: มกราคม 2026</p>
      </div>

      {/* Header */}
      <header className="text-center mb-16 print:hidden">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-racing-flag text-racing-on-flag shadow-2xl shadow-racing-flag/30 mb-6">
          📖
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-racing-flag via-racing-flag-soft to-racing-flag-soft bg-clip-text text-transparent">
            คู่มือการใช้งาน
          </span>
        </h1>
        <p className="text-muted text-lg">
          Racing Game Station - ระบบจองเวลาเล่นเกม
        </p>
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">

            <Link 
              href="/docs/print"
              className="inline-flex items-center gap-2 px-6 py-3 bg-racing-flag text-racing-on-flag rounded-xl shadow-lg shadow-racing-flag/20 hover:shadow-racing-flag/40 transition-all font-medium"
            >
              🖨️ พิมพ์คู่มือทั้งหมด
            </Link>
          </div>
          <p className="text-xs text-muted italic">
            * คลิกที่นี่สำหรับพิมพ์เป็นเล่มหรือบันทึกเป็น PDF
          </p>
        </div>
      </header>

      {/* Quick Start Cards - Hidden in Print */}
      <section className="grid md:grid-cols-3 gap-6 mb-16 print:hidden">
        <Link href="/docs/customer" className="group">
          <div className="bg-racing-flag-dim border border-racing-flag/30 hover:border-racing-flag rounded-2xl p-6 transition-all group-hover:shadow-lg group-hover:shadow-racing-flag/20">
            <div className="w-16 h-16 rounded-xl bg-racing-flag flex items-center justify-center text-3xl mb-4">
              👤
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">สำหรับลูกค้า</h2>
            <p className="text-muted mb-4">วิธีจองเวลา ดูสถานะ และใช้งานระบบ</p>
            <span className="inline-flex items-center text-racing-flag-text group-hover:text-racing-flag-soft">
              เริ่มต้นใช้งาน →
            </span>
          </div>
        </Link>

        <Link href="/docs/admin" className="group">
          <div className="bg-racing-flag-dim border border-racing-flag/30 hover:border-racing-flag rounded-2xl p-6 transition-all group-hover:shadow-lg group-hover:shadow-racing-flag/20">
            <div className="w-16 h-16 rounded-xl bg-racing-flag flex items-center justify-center text-3xl mb-4">
              ⚙️
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">สำหรับแอดมิน</h2>
            <p className="text-muted mb-4">วิธีจัดการเครื่อง คิว และการจอง</p>
            <span className="inline-flex items-center text-racing-flag-text group-hover:text-racing-flag-soft">
              ดูวิธีจัดการ →
            </span>
          </div>
        </Link>

        <Link href="/docs/game-control" className="group">
          <div className="bg-racing-flag-dim border border-racing-flag/30 hover:border-racing-flag rounded-2xl p-6 transition-all group-hover:shadow-lg group-hover:shadow-racing-flag/20">
            <div className="w-16 h-16 rounded-xl bg-racing-flag flex items-center justify-center text-3xl mb-4">
              🎛️
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">ห้องควบคุมเกม</h2>
            <p className="text-muted mb-4">วิธีควบคุมเครื่องและจับเวลา</p>
            <span className="inline-flex items-center text-racing-flag-text group-hover:text-racing-flag-soft">
              เปิดคู่มือควบคุม →
            </span>
          </div>
        </Link>
      </section>

      {/* Table of Contents */}
      <section className="bg-muted-light border border-border rounded-2xl p-8">
        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
          <span className="text-2xl">📋</span>
          สารบัญ
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-racing-flag-text mb-2">👤 คู่มือลูกค้า</h3>
            <ul className="space-y-2 text-muted ml-6">
              <li>
                <Link href="/docs/customer#walk-in" className="hover:text-foreground transition-colors">
                  → วิธีจองคิวหน้าร้าน (Walk-in)
                </Link>
              </li>
              <li>
                <Link href="/docs/customer#booking" className="hover:text-foreground transition-colors">
                  → วิธีจองเวลาเล่นล่วงหน้า
                </Link>
              </li>
              <li>
                <Link href="/docs/customer#status" className="hover:text-foreground transition-colors">
                  → ดูสถานะการจอง
                </Link>
              </li>
              <li>
                <Link href="/docs/customer#history" className="hover:text-foreground transition-colors">
                  → ดูตารางการจอง
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-racing-flag-text mb-2">⚙️ คู่มือแอดมิน</h3>
            <ul className="space-y-2 text-muted ml-6">
              <li>
                <Link href="/docs/admin#dashboard" className="hover:text-foreground transition-colors">
                  → หน้า Dashboard
                </Link>
              </li>
              <li>
                <Link href="/docs/admin#walk-in" className="hover:text-foreground transition-colors">
                  → จัดการคิวหน้าร้าน
                </Link>
              </li>
              <li>
                <Link href="/docs/admin#machines" className="hover:text-foreground transition-colors">
                  → จัดการเครื่อง
                </Link>
              </li>
              <li>
                <Link href="/docs/admin#bookings" className="hover:text-foreground transition-colors">
                  → จัดการการจอง
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-racing-flag-text mb-2">🎛️ คู่มือห้องควบคุมเกม</h3>
            <ul className="space-y-2 text-muted ml-6">
              <li>
                <Link href="/docs/game-control#access" className="hover:text-foreground transition-colors">
                  → เข้าหน้าห้องควบคุม
                </Link>
              </li>
              <li>
                <Link href="/docs/game-control#timer" className="hover:text-foreground transition-colors">
                  → ระบบจับเวลา
                </Link>
              </li>
              <li>
                <Link href="/docs/game-control#current" className="hover:text-foreground transition-colors">
                  → จัดการการจองปัจจุบัน
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer - Hidden in Print */}
      <footer className="mt-16 text-center text-muted text-sm print:hidden">
        <p>เวอร์ชัน 1.0 | อัปเดตล่าสุด: มกราคม 2026</p>
      </footer>

      {/* Print-only Table of Contents */}
      <div className="hidden print:block print:mt-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">📋 สารบัญ</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-racing-flag-text mb-2">👤 คู่มือลูกค้า</h3>
            <ul className="space-y-1 text-muted ml-6">
              <li>• วิธีจองเวลาเล่น</li>
              <li>• ดูสถานะการจอง</li>
              <li>• ดูตารางการจอง</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-racing-flag-text mb-2">⚙️ คู่มือแอดมิน</h3>
            <ul className="space-y-1 text-muted ml-6">
              <li>• หน้า Dashboard</li>
              <li>• แท็บต่างๆ ในหน้าแอดมิน</li>
              <li>• วิธีเปลี่ยนสถานะเครื่อง</li>
              <li>• ยืนยัน/ยกเลิกการจอง</li>
              <li>• พิมพ์ QR Code</li>
            </ul>
          </div>
        </div>
        
        <p className="mt-8 text-sm text-muted border-t border-border pt-4">
          Racing Game Station - คู่มือการใช้งาน | หน้า 1
        </p>
      </div>
    </div>
  );
}
