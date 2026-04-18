import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/src/presentation/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "เงื่อนไขการใช้บริการ | Racing Game Station",
  description: "เงื่อนไขและข้อกำหนดในการใช้บริการ Racing Game Station",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="เงื่อนไขการใช้บริการ"
        icon="📋"
        showHomeButton
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-surface rounded-2xl border border-border p-6 md:p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full bg-purple-500" />
              ข้อตกลงทั่วไป
            </h2>
            <p className="text-muted leading-relaxed">
              ยินดีต้อนรับสู่ Racing Game Station การใช้บริการของท่านถือว่ายอมรับเงื่อนไขต่อไปนี้
              กรุณาอ่านอย่างละเอียดก่อนใช้บริการ
            </p>
          </section>

          {/* Section 1 */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-sm font-bold">
                1
              </span>
              การจองและการเข้าคิว
            </h3>
            <ul className="space-y-3 text-muted pl-4">
              <li className="flex gap-3">
                <span className="text-emerald-500 mt-1">•</span>
                <span>ผู้ใช้สามารถจองเวลาเล่นล่วงหน้าผ่านระบบออนไลน์ได้</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-500 mt-1">•</span>
                <span>กรุณามาถึงก่อนเวลาที่จองไว้ 5-10 นาที</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-500 mt-1">•</span>
                <span>หากมาช้าเกิน 15 นาที สิทธิ์การจองอาจถูกยกเลิก</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-500 mt-1">•</span>
                <span>Walk-in queue ทำงานตามลำดับการเข้าคิวจริง</span>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                2
              </span>
              การชำระเงิน
            </h3>
            <ul className="space-y-3 text-muted pl-4">
              <li className="flex gap-3">
                <span className="text-cyan-500 mt-1">•</span>
                <span>รับชำระผ่านเงินสด, QR Code, และบัตรเครดิต</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-500 mt-1">•</span>
                <span>ค่าบริการคิดตามเวลาใช้งานจริงหรือตามโปรโมชั่น</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-500 mt-1">•</span>
                <span>ไม่มีการคืนเงินสำหรับเวลาที่เหลือจากการยกเลิกก่อนกำหนด</span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-sm font-bold">
                3
              </span>
              กฎระเบียบการใช้เครื่อง
            </h3>
            <ul className="space-y-3 text-muted pl-4">
              <li className="flex gap-3">
                <span className="text-pink-500 mt-1">•</span>
                <span>ห้ามรับประทานอาหารหรือเครื่องดื่มใกล้เครื่องเล่น</span>
              </li>
              <li className="flex gap-3">
                <span className="text-pink-500 mt-1">•</span>
                <span>ห้ามติดตั้งซอฟต์แวร์หรือแก้ไขการตั้งค่าเครื่อง</span>
              </li>
              <li className="flex gap-3">
                <span className="text-pink-500 mt-1">•</span>
                <span>ห้ามใช้เครื่องในเชิงพาณิชย์หรือการแข่งขันที่ไม่ได้รับอนุญาต</span>
              </li>
              <li className="flex gap-3">
                <span className="text-pink-500 mt-1">•</span>
                <span>เครื่องเสียหายจากการใช้งานผิดปกติต้องรับผิดชอบค่าเสียหาย</span>
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-sm font-bold">
                4
              </span>
              ความรับผิดชอบ
            </h3>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <p className="text-amber-500 text-sm leading-relaxed">
                Racing Game Station ไม่รับผิดชอบต่อทรัพย์สินสูญหาย
                กรุณาดูแลทรัพย์สินส่วนตัวของท่านให้ดี
                เรามีกล้องวงจรปิดเพื่อความปลอดภัย แต่ไม่รับประกันความเสียหายใดๆ
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-sm font-bold">
                5
              </span>
              การยกเลิกและเปลี่ยนแปลง
            </h3>
            <ul className="space-y-3 text-muted pl-4">
              <li className="flex gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>สามารถยกเลิกการจองได้ล่วงหน้า 2 ชั่วโมง</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>เงื่อนไขอาจมีการเปลี่ยนแปลงโดยไม่ต้องแจ้งให้ทราบล่วงหน้า</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>การใช้บริการต่อเนื่องถือว่ายอมรับเงื่อนไขใหม่</span>
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section className="pt-6 border-t border-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-medium text-foreground">ติดต่อสอบถาม</h4>
                <p className="text-sm text-muted">หากมีข้อสงสัยเกี่ยวกับเงื่อนไขการใช้บริการ</p>
              </div>
              <Link
                href="/customer/booking-history"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium hover:from-purple-400 hover:to-pink-500 transition-all"
              >
                ติดต่อเรา
                <span>→</span>
              </Link>
            </div>
          </section>
        </div>

        {/* Footer Links */}
        <div className="flex justify-center gap-6 mt-8 text-sm text-muted">
          <Link href="/privacy" className="hover:text-purple-400 transition-colors">
            นโยบายความเป็นส่วนตัว
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
