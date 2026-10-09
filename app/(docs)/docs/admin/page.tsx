import Link from 'next/link';

export default function AdminDocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 print:max-w-none print:px-0 print:py-0">
      {/* Print Cover - Only visible when printing */}
      <div className="hidden print:block print:mb-8 print:pb-8 print:border-b-2 print:border-racing-flag print:text-center">
        <div className="text-6xl mb-4">⚙️</div>
        <h1 className="text-4xl font-bold text-foreground mb-2">คู่มือสำหรับแอดมิน</h1>
        <p className="text-xl text-muted">Racing Game Station - ระบบจองเวลาเล่นเกม</p>
        <p className="text-sm text-muted mt-4">พิมพ์เมื่อ: มกราคม 2026</p>
      </div>

      {/* Header */}
      <header className="mb-12 print:hidden">
        <Link 
          href="/docs"
          className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors mb-6"
        >
          ← กลับหน้าคู่มือ
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-racing-flag flex items-center justify-center text-3xl">
            ⚙️
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">คู่มือสำหรับแอดมิน</h1>
            <p className="text-muted">วิธีจัดการระบบ เครื่อง และการจอง</p>
          </div>
        </div>
      </header>

      {/* Section 1: Dashboard */}
      <section id="dashboard" className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-racing-flag-dim border border-racing-flag/30 flex items-center justify-center text-xl">
            📊
          </div>
          <h2 className="text-2xl font-bold text-foreground">แท็บ Dashboard</h2>
        </div>

        <div className="bg-muted-light border border-border rounded-2xl p-6 space-y-4">
          <p className="text-muted">
            หน้าแรกสำหรับดูภาพรวมของร้าน ประกอบด้วย:
          </p>
          
          <ul className="space-y-3 text-muted list-disc ml-4">
            <li>
              <strong>Real-time Status:</strong> การ์ดแสดงจำนวนเครื่องว่าง, คิวรอ, และรายได้วันนี้
            </li>
            <li>
              <strong>Incoming Bookings:</strong> ตารางแสดง Booking ที่กำลังจะมาถึง (เตรียมเครื่องให้พร้อม) และ <span className="text-racing-flag-text font-bold">Overdue</span> (เลยเวลานัด)
            </li>
            <li>
              <strong>Traffic Source:</strong> กราฟเปรียบเทียบลูกค้า Walk-in vs Booking
            </li>
          </ul>

          <div className="mt-4 p-4 bg-racing-flag-dim border border-racing-flag/30 rounded-xl">
            <h4 className="font-bold text-racing-flag-text mb-2">💡 Tips</h4>
            <ul className="space-y-1 text-sm text-foreground">
              <li>หากมีรายการ <span className="text-racing-flag-text">Overdue Booking</span> ให้รีบโทรตามลูกค้าทันที</li>
              <li>ใช้ปุ่ม <strong>"🖨️ Print QR"</strong> มุมขวาบน เพื่อพิมพ์ QR Code ให้ลูกค้าสแกนจองหน้าร้าน</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 2: Manage Machines */}
      <section id="machines" className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-racing-flag-dim border border-racing-flag/30 flex items-center justify-center text-xl">
            🎮
          </div>
          <h2 className="text-2xl font-bold text-foreground">จัดการเครื่อง (Machines)</h2>
        </div>

        <div className="bg-muted-light border border-border rounded-2xl p-6 space-y-4">
          <p className="text-muted">
            ในแท็บนี้ ท่านสามารถจัดการสถานะและข้อมูลของเครื่องเล่นแต่ละเครื่อง:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
             <div className="border border-border rounded-xl p-4 bg-surface">
               <h4 className="font-bold text-foreground mb-2">เปลี่ยนสถานะ</h4>
               <p className="text-sm text-muted">
                 กดปุ่มสถานะเพื่อเปลี่ยนทันที เช่น <span className="text-racing-led-go font-medium">"✅ เปิดใช้งาน"</span> หรือ <span className="text-muted font-medium">"🔧 ซ่อมบำรุง"</span>
               </p>
             </div>
             <div className="border border-border rounded-xl p-4 bg-surface">
               <h4 className="font-bold text-foreground mb-2">แก้ไขข้อมูล</h4>
               <p className="text-sm text-muted">
                 กดปุ่ม <span className="text-racing-flag-text font-medium">"✏️ แก้ไข"</span> เพื่อเปลี่ยนชื่อเครื่อง, รายละเอียด, หรือซ่อน/แสดงเครื่อง
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* Section 3: Manage Customers */}
      <section id="customers" className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-racing-flag-dim border border-racing-flag/30 flex items-center justify-center text-xl">
            👥
          </div>
          <h2 className="text-2xl font-bold text-foreground">จัดการลูกค้า (Customers)</h2>
        </div>

        <div className="bg-muted-light border border-border rounded-2xl p-6 space-y-4">
          <p className="text-muted">
            แท็บสำหรับดูข้อมูลและจัดการลูกค้าทั้งหมดในระบบ:
          </p>

          <ul className="space-y-3 text-muted list-disc ml-4">
            <li>
               <strong>Stats:</strong> ดูจำนวนลูกค้าทั้งหมด, ลูกค้า <span className="text-racing-flag-text font-bold">VIP</span>, ลูกค้าใหม่วันนี้, และลูกค้าประจำ
            </li>
            <li>
               <strong>Search & Filter:</strong> ค้นหาชื่อ/เบอร์โทร หรือกดปุ่ม Filter เพื่อดูเฉพาะกลุ่ม (เช่น เฉพาะ VIP)
            </li>
            <li>
               <strong>VIP Management:</strong> กดปุ่ม <span className="text-racing-flag-text font-bold">"⭐ VIP"</span> เพื่อปรับสถานะลูกค้าให้เป็น VIP (ได้รับสิทธิพิเศษ)
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
          <div className="w-10 h-10 rounded-lg bg-racing-flag-dim border border-racing-flag/30 flex items-center justify-center text-xl">
            🚶
          </div>
          <h2 className="text-2xl font-bold text-foreground">คิวหน้าร้าน (Walk-in Queue)</h2>
        </div>

        <div className="bg-muted-light border border-border rounded-2xl p-6 space-y-4">
          <p className="text-muted">
            ใช้แท็บนี้สำหรับจัดการลูกค้าที่มารอหน้าร้านโดยไม่ได้จองล่วงหน้า:
          </p>
          
          <ol className="list-decimal space-y-3 ml-4 text-muted">
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
          <div className="w-10 h-10 rounded-lg bg-racing-flag-dim border border-racing-flag/30 flex items-center justify-center text-xl">
            📜
          </div>
          <h2 className="text-2xl font-bold text-foreground">จองเวลา & ประวัติการเล่น</h2>
        </div>

        <div className="bg-muted-light border border-border rounded-2xl p-6 space-y-4">
          <div className="space-y-4">
             <div>
                <h4 className="font-bold text-racing-flag-text mb-1">📅 แท็บ จองเวลา (Bookings)</h4>
                <p className="text-sm text-muted">
                  ดูตารางการจองล่วงหน้าทั้งหมด สามารถดูแยกตามวัน หรือค้นหาชื่อลูกค้าได้
                </p>
             </div>
             <div>
                <h4 className="font-bold text-racing-flag-text mb-1">⏱️ แท็บ ประวัติการเล่น (Sessions)</h4>
                <p className="text-sm text-muted">
                  ดูประวัติการเล่นที่จบไปแล้ว (Completed Sessions) พร้อมยอดเงินรายรับ สามารถกดแก้ไขสถานะ "จ่ายแล้ว/ยังไม่จ่าย" ได้ที่นี่
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* Quick Links - Hidden in Print */}
      <section className="bg-racing-flag-dim border border-racing-flag/30 rounded-2xl p-6 print:hidden">
        <h3 className="font-bold text-foreground mb-4">🔗 ลิงก์แอดมิน</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Link href="/backend" className="bg-surface hover:bg-muted-light border border-border rounded-xl p-4 text-center transition-all">
            <span className="text-2xl block mb-2">📊</span>
            <span className="text-sm text-foreground">Dashboard</span>
          </Link>
          <Link href="/backend/control" className="bg-surface hover:bg-muted-light border border-border rounded-xl p-4 text-center transition-all">
            <span className="text-2xl block mb-2">🎛️</span>
            <span className="text-sm text-foreground">ห้องควบคุม</span>
          </Link>
          <Link href="/docs/game-control" className="bg-surface hover:bg-muted-light border border-border rounded-xl p-4 text-center transition-all">
            <span className="text-2xl block mb-2">📖</span>
            <span className="text-sm text-foreground">คู่มือห้องควบคุม</span>
          </Link>
        </div>
      </section>

      {/* Navigation - Hidden in Print */}
      <div className="mt-12 flex justify-between print:hidden">
        <Link 
          href="/docs/customer"
          className="px-6 py-3 bg-racing-flag-dim border border-racing-flag/30 rounded-xl text-racing-flag-text hover:bg-racing-flag/20 transition-all"
        >
          ← คู่มือลูกค้า
        </Link>
        <Link 
          href="/docs"
          className="px-6 py-3 bg-muted-light hover:bg-muted-light bg-surface hover:bg-muted-light border border-border rounded-xl text-muted hover:text-foreground transition-all"
        >
          กลับหน้าคู่มือ
        </Link>
      </div>

      {/* Print Footer */}
      <div className="hidden print:block print:mt-8 print:pt-4 print:border-t print:border-border print:text-center print:text-sm print:text-muted">
        <p>Racing Game Station - คู่มือสำหรับแอดมิน | หน้า _____</p>
      </div>
    </div>
  );
}
