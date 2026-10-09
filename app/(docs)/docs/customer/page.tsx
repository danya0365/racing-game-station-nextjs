import Link from 'next/link';

export default function CustomerDocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 print:max-w-none print:px-0 print:py-0">
      {/* Print Cover - Only visible when printing */}
      <div className="hidden print:block print:mb-8 print:pb-8 print:border-b-2 print:border-racing-flag print:text-center">
        <div className="text-6xl mb-4">📖</div>
        <h1 className="text-4xl font-bold text-foreground mb-2">คู่มือสำหรับลูกค้า</h1>
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
            👤
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">คู่มือสำหรับลูกค้า</h1>
            <p className="text-muted">วิธีใช้งานระบบจองเวลาเล่นเกม</p>
          </div>
        </div>
      </header>

      {/* Section 1: จองคิวหน้าร้าน (Walk-in) */}
      <section id="walk-in" className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-racing-flag-dim border border-racing-flag/30 flex items-center justify-center text-xl">
            🚶
          </div>
          <h2 className="text-2xl font-bold text-foreground">วิธีจองคิวหน้าร้าน (Walk-in)</h2>
        </div>

        <div className="bg-muted-light border border-border rounded-2xl p-6 space-y-6">
          <div className="flex gap-4">
             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-racing-led-warn text-white flex items-center justify-center font-bold">
               1
             </div>
             <div className="flex-1">
               <h3 className="font-bold text-foreground mb-2">ไปที่จุดลงทะเบียน</h3>
               <p className="text-muted mb-2">
                 แจ้งพนักงานหรือกดปุ่มเพื่อรับบัตรคิวที่หน้าเคาน์เตอร์ หรือกดปุ่ม <span className="text-racing-flag-text font-medium">"เข้าคิวทันที"</span> ในหน้าเว็บ
               </p>
             </div>
          </div>
          <div className="flex gap-4">
             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-racing-led-warn text-white flex items-center justify-center font-bold">
               2
             </div>
             <div className="flex-1">
               <h3 className="font-bold text-foreground mb-2">กรอกข้อมูล</h3>
               <p className="text-muted mb-2">
                 ระบุชื่อ เบอร์โทร และจำนวนผู้เล่น
               </p>
             </div>
          </div>
           <div className="flex gap-4">
             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-racing-led-warn text-white flex items-center justify-center font-bold">
               3
             </div>
             <div className="flex-1">
               <h3 className="font-bold text-foreground mb-2">รอเรียกคิว</h3>
               <p className="text-muted mb-2">
                 รอพนักงานเรียกหมายเลขคิวของคุณ หรือดูสถานะคิวได้ที่หน้าจอมอนิเตอร์ในร้าน
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* Section 2: วิธีจองเวลาล่วงหน้า */}
      <section id="booking" className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-racing-flag-dim border border-racing-flag/30 flex items-center justify-center text-xl">
            📅
          </div>
          <h2 className="text-2xl font-bold text-foreground">วิธีจองเวลาเล่นล่วงหน้า</h2>
        </div>

        <div className="bg-muted-light border border-border rounded-2xl p-6 space-y-6">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-racing-flag text-racing-on-flag flex items-center justify-center font-bold">
              1
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground mb-2">เข้าหน้าจองเวลา</h3>
              <p className="text-muted mb-4">
                คลิกที่เมนู <span className="text-racing-flag-text font-medium">&ldquo;จองเวลา&rdquo;</span> บนแถบเมนู 
                หรือกดปุ่ม <span className="text-racing-flag-text font-medium">&ldquo;📅 จองล่วงหน้า&rdquo;</span> ที่หน้าแรก
              </p>
              <div className="mt-4 p-4 bg-racing-flag-dim border border-racing-flag/30 rounded-xl">
                <p className="text-sm text-foreground">
                  💡 <strong>Tip:</strong> สามารถสแกน QR Code ที่ร้านเพื่อเข้าหน้าจองได้โดยตรง
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-racing-flag text-racing-on-flag flex items-center justify-center font-bold">
              2
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground mb-2">เลือกเครื่องเล่น</h3>
              <p className="text-muted mb-2">
                เลือกเครื่องที่ต้องการเล่น จะมีแสดงรายชื่อเครื่องที่พร้อมใช้งาน
              </p>
              <ul className="text-muted text-sm space-y-1 ml-4 list-disc">
                <li>แตะที่เครื่องที่ต้องการ</li>
                <li>ระบบจะไปขั้นตอนถัดไปอัตโนมัติ</li>
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-racing-flag text-racing-on-flag flex items-center justify-center font-bold">
              3
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground mb-2">เลือกวันและเวลา</h3>
              <p className="text-muted mb-4">
                เลื่อนเลือกวันที่ต้องการ (ล่วงหน้าได้ 7 วัน) แล้วเลือกช่วงเวลาที่ว่าง
              </p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-racing-led-go/10 border border-racing-led-go/30 rounded-lg p-3 text-center">
                  <div className="w-4 h-4 rounded bg-racing-led-go mx-auto mb-1"></div>
                  <p className="text-xs text-foreground">ว่าง</p>
                </div>
                <div className="bg-racing-led-stop/10 border border-racing-led-stop/30 rounded-lg p-3 text-center">
                  <div className="w-4 h-4 rounded bg-racing-led-stop mx-auto mb-1"></div>
                  <p className="text-xs text-foreground">จองแล้ว</p>
                </div>
                <div className="bg-muted-light border border-border border-racing-led-off/30 rounded-lg p-3 text-center">
                  <div className="w-4 h-4 rounded bg-racing-led-off mx-auto mb-1"></div>
                  <p className="text-xs text-foreground">ผ่านไปแล้ว</p>
                </div>
              </div>
              <p className="text-sm text-muted">
                <span className="text-racing-flag-text">สีชมพู</span> = ช่วงเวลาที่คุณเลือก
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-racing-flag text-racing-on-flag flex items-center justify-center font-bold">
              4
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground mb-2">กรอกข้อมูลและยืนยัน</h3>
              <p className="text-muted mb-4">
                กรอกชื่อและเบอร์โทร เลือกระยะเวลาเล่น แล้วกดยืนยัน
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-racing-flag-dim border border-racing-flag/30 rounded text-racing-flag-text">แนะนำ</span>
                  <span className="text-muted">60 นาที - ราคาคุ้มค่าที่สุด</span>
                </div>
              </div>
            </div>
          </div>

          {/* Success */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-racing-led-go text-white flex items-center justify-center font-bold">
              ✓
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-racing-flag-text mb-2">จองสำเร็จ!</h3>
              <p className="text-muted">
                เมื่อจองสำเร็จ ระบบจะแสดงรายละเอียดการจอง และบันทึกเบอร์โทรเพื่อเช็คสถานะได้ในภายหลัง
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: ดูสถานะการจอง */}
      <section id="status" className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-racing-flag-dim border border-racing-flag/30 flex items-center justify-center text-xl">
            📋
          </div>
          <h2 className="text-2xl font-bold text-foreground">ดูสถานะการจอง</h2>
        </div>

        <div className="bg-muted-light border border-border rounded-2xl p-6 space-y-4">
          <p className="text-muted">
            ไปที่เมนู <span className="text-racing-flag-text font-medium">&ldquo;สถานะการจอง&rdquo;</span> บนแถบเมนู
          </p>
          
          <ol className="space-y-3 text-muted">
            <li className="flex items-start gap-2">
              <span className="text-racing-flag-text">1.</span>
              กรอกเบอร์โทรศัพท์ที่ใช้จอง
            </li>
            <li className="flex items-start gap-2">
              <span className="text-racing-flag-text">2.</span>
              ระบบจะแสดงรายการจองทั้งหมดของคุณ
            </li>
            <li className="flex items-start gap-2">
              <span className="text-racing-flag-text">3.</span>
              สามารถดูรายละเอียด วันที่ เวลา และสถานะได้
            </li>
          </ol>

          <div className="mt-4 p-4 bg-racing-flag-dim border border-racing-flag/30 rounded-xl">
            <h4 className="font-bold text-racing-flag-text mb-2">สถานะการจอง</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-racing-flag text-racing-on-flag rounded text-xs">รอ</span>
                <span className="text-foreground">รอถึงเวลานัดหมาย</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-racing-led-go text-white rounded text-xs">ยืนยัน</span>
                <span className="text-foreground">การจองได้รับการยืนยันแล้ว</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-racing-led-off text-racing-led-on rounded text-xs">เสร็จ</span>
                <span className="text-foreground">เล่นเสร็จแล้ว</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-racing-led-stop text-white rounded text-xs">ยกเลิก</span>
                <span className="text-foreground">การจองถูกยกเลิก</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 3: ดูตารางการจอง */}
      <section id="history" className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-racing-flag-dim border border-racing-flag/30 flex items-center justify-center text-xl">
            📜
          </div>
          <h2 className="text-2xl font-bold text-foreground">ดูตารางการจอง</h2>
        </div>

        <div className="bg-muted-light border border-border rounded-2xl p-6 space-y-4">
          <p className="text-muted">
            ไปที่เมนู <span className="text-racing-flag-text font-medium">&ldquo;ตารางจอง&rdquo;</span> บนแถบเมนู
          </p>
          
          <div className="space-y-3 text-muted">
            <p>หน้านี้แสดง:</p>
            <ul className="ml-4 space-y-2 list-disc">
              <li>ตารางการจองทั้งหมดของวันนี้</li>
              <li>สามารถเลือกดูวันอื่นได้</li>
              <li>กรองตามเครื่องที่ต้องการดู</li>
              <li>เห็นช่วงเวลาว่าง/จองแล้ว</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-racing-flag-dim border border-racing-flag/30 rounded-xl">
            <p className="text-sm text-foreground">
              💡 <strong>Tip:</strong> ใช้หน้านี้เพื่อดูว่าช่วงไหนว่างก่อนจอง
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links - Hidden in Print */}
      <section className="bg-racing-flag-dim border border-racing-flag/30 rounded-2xl p-6 print:hidden">
        <h3 className="font-bold text-foreground mb-4">🔗 ลิงก์ใช้งาน</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/time-booking" className="bg-surface hover:bg-muted-light border border-border rounded-xl p-4 text-center transition-all">
            <span className="text-2xl block mb-2">📅</span>
            <span className="text-sm text-foreground">จองเวลา</span>
          </Link>
          <Link href="/customer/booking-status" className="bg-surface hover:bg-muted-light border border-border rounded-xl p-4 text-center transition-all">
            <span className="text-2xl block mb-2">📋</span>
            <span className="text-sm text-foreground">สถานะการจอง</span>
          </Link>
          <Link href="/customer/booking-history" className="bg-surface hover:bg-muted-light border border-border rounded-xl p-4 text-center transition-all">
            <span className="text-2xl block mb-2">📜</span>
            <span className="text-sm text-foreground">ตารางจอง</span>
          </Link>
          <Link href="/" className="bg-surface hover:bg-muted-light border border-border border-racing-led-off/30 rounded-xl p-4 text-center transition-all">
            <span className="text-2xl block mb-2">🏠</span>
            <span className="text-sm text-foreground">หน้าแรก</span>
          </Link>
        </div>
      </section>

      {/* Navigation - Hidden in Print */}
      <div className="mt-12 flex justify-between print:hidden">
        <Link 
          href="/docs"
          className="px-6 py-3 bg-muted-light hover:bg-muted-light bg-surface hover:bg-muted-light border border-border rounded-xl text-muted hover:text-foreground transition-all"
        >
          ← กลับหน้าคู่มือ
        </Link>
        <Link 
          href="/docs/admin"
          className="px-6 py-3 bg-racing-flag-dim border border-racing-flag/30 rounded-xl text-racing-flag-text hover:bg-racing-flag/20 transition-all"
        >
          คู่มือแอดมิน →
        </Link>
      </div>

      {/* Print Footer */}
      <div className="hidden print:block print:mt-8 print:pt-4 print:border-t print:border-border print:text-center print:text-sm print:text-muted">
        <p>Racing Game Station - คู่มือสำหรับลูกค้า | หน้า _____</p>
      </div>
    </div>
  );
}
