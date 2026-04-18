import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/src/presentation/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "นโยบายความเป็นส่วนตัว | Racing Game Station",
  description: "นโยบายการเก็บรวบรวมและใช้ข้อมูลส่วนบุคคลของ Racing Game Station",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="นโยบายความเป็นส่วนตัว"
        icon="🔒"
        showHomeButton
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-surface rounded-2xl border border-border p-6 md:p-8 space-y-8">
          {/* Last Updated */}
          <div className="flex items-center gap-2 text-sm text-muted">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            อัพเดตล่าสุด: 18 เมษายน 2026
          </div>

          {/* Introduction */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full bg-purple-500" />
              คำนำ
            </h2>
            <p className="text-muted leading-relaxed">
              Racing Game Station ให้ความสำคัญกับความเป็นส่วนตัวของผู้ใช้บริการ
              นโยบายนี้อธิบายวิธีการเก็บรวบรวม ใช้ และปกป้องข้อมูลส่วนบุคคลของท่าน
            </p>
          </section>

          {/* Section 1 */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-sm font-bold">
                1
              </span>
              ข้อมูลที่เราเก็บรวบรวม
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-surface/50 border border-border/50">
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <span className="text-cyan-500">👤</span>
                  ข้อมูลบัญชี
                </h4>
                <ul className="text-sm text-muted space-y-1">
                  <li>• ชื่อ-นามสกุล</li>
                  <li>• อีเมล</li>
                  <li>• เบอร์โทรศัพท์</li>
                  <li>• รูปโปรไฟล์ (ถ้ามี)</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-surface/50 border border-border/50">
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <span className="text-amber-500">📅</span>
                  ข้อมูลการใช้บริการ
                </h4>
                <ul className="text-sm text-muted space-y-1">
                  <li>• ประวัติการจอง</li>
                  <li>• เวลาใช้บริการ</li>
                  <li>• เครื่องที่ใช้</li>
                  <li>• ยอดการใช้จ่าย</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                2
              </span>
              วัตถุประสงค์การใช้ข้อมูล
            </h3>
            <div className="space-y-3">
              {[
                { icon: "🔔", text: "ส่งการแจ้งเตือนการจองและโปรโมชั่น" },
                { icon: "⚡", text: "ปรับปรุงประสบการณ์การใช้งาน" },
                { icon: "📊", text: "วิเคราะห์พฤติกรรมผู้ใช้เพื่อพัฒนาบริการ" },
                { icon: "🛡️", text: "ป้องกันการฉ้อโกงและรักษาความปลอดภัย" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg bg-surface/30 border border-border/30"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-muted">{item.text}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-sm font-bold">
                3
              </span>
              การเก็บรักษาข้อมูล
            </h3>
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <p className="text-emerald-500 text-sm leading-relaxed">
                ข้อมูลของท่านถูกเก็บไว้บน Supabase ที่มีการเข้ารหัส SSL
                และเราไม่ขายหรือส่งต่อข้อมูลให้บุคคลที่สามเพื่อวัตถุประสงค์ทางการตลาด
              </p>
            </div>
            <ul className="space-y-3 text-muted pl-4">
              <li className="flex gap-3">
                <span className="text-emerald-500 mt-1">•</span>
                <span>เก็บข้อมูลตามระยะเวลาที่กฎหมายกำหนด</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-500 mt-1">•</span>
                <span>เข้ารหัสข้อมูล sensitive ทั้งหมด</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-500 mt-1">•</span>
                <span>จำกัดการเข้าถึงเฉพาะผู้ได้รับอนุญาต</span>
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-sm font-bold">
                4
              </span>
              สิทธิ์ของท่าน
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: "สิทธิ์เข้าถึง", desc: "ขอดูข้อมูลที่เราเก็บไว้" },
                { title: "สิทธิ์แก้ไข", desc: "ปรับปรุงข้อมูลไม่ถูกต้อง" },
                { title: "สิทธิ์ลบ", desc: "ขอลบบัญชีและข้อมูล" },
                { title: "สิทธิ์คัดค้าน", desc: "ปฏิเสธการใช้ข้อมูลบางอย่าง" },
              ].map((right, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/30"
                >
                  <h4 className="font-medium text-pink-400 mb-1">{right.title}</h4>
                  <p className="text-sm text-muted">{right.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-sm font-bold">
                5
              </span>
              การใช้งาน Cookies
            </h3>
            <p className="text-muted leading-relaxed">
              เราใช้ cookies เพื่อจดจำการตั้งค่าและปรับปรุงประสบการณ์การใช้งาน
              ท่านสามารถปิดการใช้งาน cookies ได้จากการตั้งค่าเบราว์เซอร์
              แต่อาจส่งผลต่อฟังก์ชั่นบางอย่าง
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-500 to-slate-600 flex items-center justify-center text-white text-sm font-bold">
                6
              </span>
              การเปลี่ยนแปลงนโยบาย
            </h3>
            <div className="p-4 rounded-xl bg-surface/50 border border-border/50">
              <p className="text-muted text-sm leading-relaxed">
                เราอาจปรับปรุงนโยบายนี้เป็นครั้งคราว
                การเปลี่ยนแปลงจะมีผลทันทีที่เผยแพร่บนเว็บไซต์
                กรุณาตรวจสอบหน้านี้เป็นระยะ
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="pt-6 border-t border-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-medium text-foreground">ติดต่อ DPO</h4>
                <p className="text-sm text-muted">Data Protection Officer</p>
              </div>
              <Link
                href="/customer/booking-history"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium hover:from-purple-400 hover:to-pink-500 transition-all"
              >
                ติดต่อเรื่องข้อมูลส่วนตัว
                <span>→</span>
              </Link>
            </div>
          </section>
        </div>

        {/* Footer Links */}
        <div className="flex justify-center gap-6 mt-8 text-sm text-muted">
          <Link href="/terms" className="hover:text-purple-400 transition-colors">
            เงื่อนไขการใช้บริการ
          </Link>
          <span>•</span>
          <Link href="/" className="hover:text-purple-400 transition-colors">
            หน้าหลัก
          </Link>
        </div>
      </main>
    </div>
  );
}
