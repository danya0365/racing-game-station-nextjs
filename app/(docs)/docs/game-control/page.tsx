import Link from 'next/link';

export default function GameControlDocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 print:max-w-none print:px-0 print:py-0">
      {/* Print Cover - Only visible when printing */}
      <div className="hidden print:block print:mb-8 print:pb-8 print:border-b-2 print:border-racing-flag print:text-center">
        <div className="text-6xl mb-4">🎛️</div>
        <h1 className="text-4xl font-bold text-foreground mb-2">คู่มือห้องควบคุมเกม</h1>
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
            🎛️
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">คู่มือห้องควบคุมเกม</h1>
            <p className="text-muted">วิธีควบคุมเครื่องเล่น บันทึกเวลา และจัดการลูกค้า</p>
          </div>
        </div>
      </header>

      {/* Section 1: เข้าหน้าห้องควบคุม */}
      <section id="access" className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-racing-flag-dim border border-racing-flag/30 flex items-center justify-center text-xl">
            🚀
          </div>
          <h2 className="text-2xl font-bold text-foreground">เข้าหน้าห้องควบคุม</h2>
        </div>

        <div className="bg-muted-light border border-border rounded-2xl p-6 space-y-4">
          <p className="text-muted">
            หน้าห้องควบคุม (Control Room) เป็นหน้าที่ออกแบบมาสำหรับพนักงานดูแลร้านโดยเฉพาะ โดยมี URL คือ:
            <code className="mx-2 px-2 py-1 bg-muted-light rounded text-racing-flag-text text-sm">/backend/control</code>
          </p>
          
          <div className="mt-4 p-4 bg-racing-flag-dim border border-racing-flag/30 rounded-xl">
            <p className="text-sm text-foreground">
              💡 <strong>แนะนำ:</strong> ควรใช้หน้านี้บน Tablet หรือหน้าจอ Monitor หลักของร้าน เพื่อให้เห็นสถานะเครื่องทั้งหมดได้ชัดเจน
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: สถานะเครื่องเล่น */}
      <section id="overview" className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-racing-flag-dim border border-racing-flag/30 flex items-center justify-center text-xl">
            📊
          </div>
          <h2 className="text-2xl font-bold text-foreground">สถานะเครื่องเล่น (Overview)</h2>
        </div>

        <div className="bg-muted-light border border-border rounded-2xl p-6 space-y-6">
          <p className="text-muted">
            ระบบจะแสดงเครื่องเล่นทั้งหมดในรูปแบบการ์ด โดยสถานะจะเปลี่ยนไปตามการใช้งานจริง:
          </p>

          {/* Cards Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Available */}
            <div className="border border-racing-led-go/30 rounded-xl p-4 bg-racing-led-go/10">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded-full bg-racing-led-go"></span>
                <h3 className="font-bold text-foreground">✅ ว่าง (Available)</h3>
              </div>
              <p className="text-sm text-muted mb-3">
                เครื่องว่างพร้อมให้บริการ
              </p>
              <ul className="text-xs text-muted space-y-1 ml-4 list-disc">
                <li>ปุ่ม <strong>"▶️ เริ่มเล่น"</strong>: สำหรับลูกค้า Walk-in ทั่วไป</li>
                <li>ปุ่ม <strong>"📋 เลือกจากคิว"</strong>: เรียกคิวที่รออยู่มาลงเครื่องนี้</li>
              </ul>
            </div>

            {/* Reserved */}
            <div className="border border-racing-led-warn/30 rounded-xl p-4 bg-racing-led-warn/10">
               <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded-full bg-racing-led-warn"></span>
                <h3 className="font-bold text-foreground">📅 จองไว้ (Reserved)</h3>
              </div>
              <p className="text-sm text-muted mb-3">
                มีลูกค้าจองล่วงหน้าในช่วงเวลานี้
              </p>
              <ul className="text-xs text-muted space-y-1 ml-4 list-disc">
                 <li>แสดงชื่อลูกค้าและเวลาจอง</li>
                 <li>ปุ่ม <strong>"✅ Check-in"</strong>: กดเมื่อลูกค้ามาถึงเพื่อเริ่มเล่น</li>
                 <li><span className="text-racing-flag-text font-bold">สีแดง</span>: หากเลยเวลานัดแล้วยังไม่มา</li>
              </ul>
            </div>

            {/* In Use */}
            <div className="border border-racing-led-warn/30 rounded-xl p-4 bg-racing-led-warn/10">
               <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded-full bg-racing-led-warn animate-pulse"></span>
                <h3 className="font-bold text-foreground">🏁 กำลังเล่น (In Use)</h3>
              </div>
              <p className="text-sm text-muted mb-3">
                มีลูกค้ากำลังใช้งานอยู่
              </p>
              <ul className="text-xs text-muted space-y-1 ml-4 list-disc">
                 <li>แสดงเวลาที่เล่นไปแล้ว</li>
                 <li>ปุ่ม <strong>"⏹️ จบการเล่น"</strong>: กดเมื่อลูกค้าเล่นเสร็จแล้ว</li>
                 <li>คลิกที่การ์ดเพื่อดูรายละเอียด/แก้ไขราคา</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: การจัดการรอบเล่น */}
      <section id="session-management" className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-racing-flag-dim border border-racing-flag/30 flex items-center justify-center text-xl">
            ⏱️
          </div>
          <h2 className="text-2xl font-bold text-foreground">การจัดการรอบเล่น (Session)</h2>
        </div>

        <div className="bg-muted-light border border-border rounded-2xl p-6 space-y-8">
          
          {/* 1. Start Session */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-racing-led-info text-white flex items-center justify-center text-xs">1</span>
              การเริ่มเล่น (Start)
            </h3>
            <p className="text-muted mb-3 ml-8">
              ทำได้ 3 วิธี ขึ้นอยู่กับประเภทลูกค้า:
            </p>
            <div className="grid md:grid-cols-3 gap-4 ml-8">
               <div className="bg-surface p-3 rounded-lg border border-border">
                 <strong className="text-racing-flag-text block mb-1">ลูกค้า Walk-in</strong>
                 <p className="text-xs text-muted">
                   กดปุ่ม "เริ่มเล่น" ใส่ชื่อลูกค้าและเลือกเวลาเล่น
                 </p>
               </div>
               <div className="bg-surface p-3 rounded-lg border border-border">
                 <strong className="text-racing-flag-text block mb-1">จากคิว (Queue)</strong>
                 <p className="text-xs text-muted">
                   กดปุ่ม "เลือกจากคิว" เพื่อดึงข้อมูลลูกค้าจากคิวที่รออยู่
                 </p>
               </div>
               <div className="bg-surface p-3 rounded-lg border border-border">
                 <strong className="text-racing-flag-text block mb-1">ลูกค้าจอง (Booking)</strong>
                 <p className="text-xs text-muted">
                   รอลูกค้ามาถึง แล้วกดปุ่ม "Check-in" ที่การ์ดสีเหลือง
                 </p>
               </div>
            </div>
          </div>

          <div className="border-t border-border"></div>

          {/* 2. During Session */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-racing-led-warn text-white flex items-center justify-center text-xs">2</span>
              ระหว่างเล่น (In Progress)
            </h3>
            <div className="ml-8 text-muted">
              <p className="mb-2">
                เมื่อกดเริ่มแล้ว สถานะจะเป็น <span className="text-racing-flag-text font-bold">"กำลังเล่น"</span> ระบบจะจับเวลาอัตโนมัติ
              </p>
              <p className="text-sm">
                <strong>📝 การแก้ไขข้อมูล:</strong> คลิกที่การ์ดเพื่อเปิดดูรายละเอียด สามารถ:
              </p>
              <ul className="list-disc ml-6 mt-1 text-sm space-y-1">
                <li>แก้ไขราคารวม (หากมีการเพิ่มเวลา/ส่วนลด)</li>
                <li>ดูเวลาที่เหลือ (Count down)</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border"></div>

          {/* 3. End Session */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-racing-led-stop text-white flex items-center justify-center text-xs">3</span>
              จบการเล่น (Finish)
            </h3>
            <div className="ml-8 text-muted">
              <ol className="list-decimal space-y-2 ml-4">
                <li>
                  กดปุ่ม <span className="text-racing-flag-text font-bold">"⏹️ จบการเล่น"</span>
                </li>
                <li>
                  ระบบจะสรุปยอดเงินและเวลาเล่นทั้งหมด
                </li>
                <li>
                  กดยืนยันเพื่อบันทึกประวัติ และคืนสถานะเครื่องเป็น "ว่าง"
                </li>
              </ol>
            </div>
          </div>

        </div>
      </section>

      {/* Section 4: ประวัติและรายงาน */}
      <section id="history" className="mb-16 print:break-before-page print:pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-racing-flag-dim border border-racing-flag/30 flex items-center justify-center text-xl">
            📜
          </div>
          <h2 className="text-2xl font-bold text-foreground">ประวัติการเล่น (History)</h2>
        </div>

        <div className="bg-muted-light border border-border rounded-2xl p-6 space-y-4">
          <p className="text-muted">
            ท่านสามารถดูประวัติย้อนหลังของแต่ละเครื่องได้โดยกดปุ่ม <span className="bg-white/20 px-2 rounded">🕒</span> มุมขวาบนของการ์ดเครื่อง
            ระบบจะแสดงรายการล่าสุด 5 รายการ พร้อมสถานะการชำระเงิน
          </p>
        </div>
      </section>

      {/* Navigation - Hidden in Print */}
      <div className="mt-12 flex justify-between print:hidden">
        <Link 
          href="/docs/admin"
          className="px-6 py-3 bg-racing-flag-dim border border-racing-flag/30 rounded-xl text-racing-flag-text hover:bg-racing-flag/20 transition-all"
        >
          ← คู่มือแอดมิน
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
        <p>Racing Game Station - คู่มือห้องควบคุมเกม | หน้า _____</p>
      </div>
    </div>
  );
}
