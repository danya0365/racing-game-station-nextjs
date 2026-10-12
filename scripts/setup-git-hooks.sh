#!/bin/bash
#
# setup-git-hooks.sh — ติดตั้ง git hooks ของโปรเจค
#
# ใช้งาน: npm run setup:git-hooks
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
HOOKS_SRC="$SCRIPT_DIR/git-hooks"
HOOKS_DEST="$PROJECT_ROOT/.git/hooks"

if [ ! -d "$HOOKS_DEST" ]; then
    echo "❌ ไม่พบ .git/hooks — ยืนยันว่าอยู่ใน git repository"
    exit 1
fi

if [ ! -f "$HOOKS_SRC/pre-commit" ]; then
    echo "❌ ไม่พบ $HOOKS_SRC/pre-commit"
    exit 1
fi

echo "📦 ติดตั้ง git hooks..."

cp "$HOOKS_SRC/pre-commit" "$HOOKS_DEST/pre-commit"
chmod +x "$HOOKS_DEST/pre-commit"

# macOS: ป้องกันการถากเหตุผลเมื่อ commit ผิดปกติ
if [ ! -f "$HOOKS_DEST/commit-msg" ]; then
    cat > "$HOOKS_DEST/commit-msg" <<'HOOK'
#!/bin/sh
# ป้องกัน commit message ว่างเปล่า
if [ -z "$(head -n 1 "$1")" ]; then
    echo "❌ commit message ห้ามว่าง"
    exit 1
fi
exit 0
HOOK
    chmod +x "$HOOKS_DEST/commit-msg"
    echo "   ✅ pre-commit"
    echo "   ✅ commit-msg (ป้องกัน message ว่าง)"
else
    echo "   ✅ pre-commit"
    echo "   ⏭️  commit-msg (มีอยู่แล้ว — ไม่ทับ)"
fi

echo ""
echo "✅ ติดตั้งเสร็จแล้ว"
echo ""
echo "   Hook ที่ทำงาน:"
echo "   • บล็อกการ commit บน main / master / develop"
echo "   • เตือนชื่อ branch ที่ไม่ตรง convention"
echo "   • บล็อก commit message ว่าง"
echo ""
echo "   ข้ามได้: git commit --no-verify"
echo "   ปิดการตรวจชื่อ branch: SKIP_BRANCH_CHECK=1 git commit"
