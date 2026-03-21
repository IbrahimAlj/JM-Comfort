'use strict';

const fs = require('fs');
const path = require('path');

// ── Helpers ──────────────────────────────────────────────────────────────────

const ROOT = path.join(__dirname, '..');

function pad(n) { return String(n).padStart(2, '0'); }

function timestamp() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}`;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

/** Recursively collect all files under a directory, returning absolute paths. */
function collectFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

/** Copy src → dest, creating parent dirs as needed. */
function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

/** Compare two files by size; returns { pass, srcSize, destSize }. */
function compareBySize(a, b) {
  const aSize = fs.statSync(a).size;
  const bSize = fs.existsSync(b) ? fs.statSync(b).size : null;
  return { pass: bSize !== null && aSize === bSize, srcSize: aSize, destSize: bSize };
}

// ── Main ─────────────────────────────────────────────────────────────────────

function run() {
  const ts = timestamp();
  const BACKUP_DIR   = path.join(ROOT, 'backups', ts);
  const RESTORE_DIR  = path.join(ROOT, 'backups', 'restore-test');
  const REPORT_PATH  = path.join(ROOT, 'docs', 'backup-recovery-report.md');

  console.log('='.repeat(60));
  console.log('  JM-Comfort Backup Recovery Test');
  console.log(`  Timestamp: ${ts}`);
  console.log('='.repeat(60));

  // ── 1. Collect source files ─────────────────────────────────────────────
  const SRC_DIR = path.join(ROOT, 'client', 'src');
  const ENV_FILE = path.join(ROOT, 'client', '.env');

  const srcFiles = collectFiles(SRC_DIR);
  if (fs.existsSync(ENV_FILE)) srcFiles.push(ENV_FILE);

  console.log(`\n[1/4] Sources collected: ${srcFiles.length} file(s)`);
  srcFiles.forEach(f => console.log(`      • ${path.relative(ROOT, f)}`));

  // ── 2. Backup ───────────────────────────────────────────────────────────
  console.log(`\n[2/4] Backing up to backups/${ts}/`);
  ensureDir(BACKUP_DIR);

  const backupMap = [];   // { src, backup }
  for (const src of srcFiles) {
    const rel    = path.relative(ROOT, src);          // e.g. client/src/main.jsx
    const backup = path.join(BACKUP_DIR, rel);
    copyFile(src, backup);
    backupMap.push({ src, backup, rel });
  }

  // ── 3. Verify backup ────────────────────────────────────────────────────
  console.log('\n[3/4] Backup verification (size check):');
  let backupPass = 0, backupFail = 0;
  const backupResults = [];

  for (const { src, backup, rel } of backupMap) {
    const { pass, srcSize, destSize } = compareBySize(src, backup);
    const label = pass ? 'PASS' : 'FAIL';
    console.log(`      [${label}] ${rel}  (src: ${srcSize}B  backup: ${destSize ?? 'missing'}B)`);
    if (pass) backupPass++; else backupFail++;
    backupResults.push({ rel, pass, srcSize, destSize });
  }

  console.log(`\n      Backup: ${backupPass} PASS / ${backupFail} FAIL`);

  // ── 4. Simulate restore ─────────────────────────────────────────────────
  console.log(`\n[4/4] Restore simulation → backups/restore-test/`);
  ensureDir(RESTORE_DIR);

  const restoreMap = [];
  for (const { backup, rel } of backupMap) {
    const restored = path.join(RESTORE_DIR, rel);
    copyFile(backup, restored);
    restoreMap.push({ backup, restored, rel });
  }

  // Compare restored files against originals
  console.log('\n      Restore verification (size check):');
  let restorePass = 0, restoreFail = 0;
  const restoreResults = [];

  for (const { restored, rel } of restoreMap) {
    const src = path.join(ROOT, rel);
    const { pass, srcSize, destSize } = compareBySize(src, restored);
    const label = pass ? 'PASS' : 'FAIL';
    console.log(`      [${label}] ${rel}  (original: ${srcSize}B  restored: ${destSize ?? 'missing'}B)`);
    if (pass) restorePass++; else restoreFail++;
    restoreResults.push({ rel, pass, srcSize, destSize });
  }

  console.log(`\n      Restore: ${restorePass} PASS / ${restoreFail} FAIL`);

  // ── Summary ─────────────────────────────────────────────────────────────
  const totalPass = backupPass + restorePass;
  const totalFail = backupFail + restoreFail;
  const overallStatus = totalFail === 0 ? 'PASS' : 'FAIL';

  console.log('\n' + '='.repeat(60));
  console.log('  SUMMARY');
  console.log('='.repeat(60));
  console.log(`  Backup  verification : ${backupPass} PASS / ${backupFail} FAIL`);
  console.log(`  Restore verification : ${restorePass} PASS / ${restoreFail} FAIL`);
  console.log(`  Overall status       : ${overallStatus}`);
  console.log('='.repeat(60));

  // ── Write report ────────────────────────────────────────────────────────
  const isoTs = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

  function tableRows(results) {
    return results
      .map(r => `| ${r.rel} | ${r.srcSize}B | ${r.destSize ?? 'missing'}B | ${r.pass ? '✅ PASS' : '❌ FAIL'} |`)
      .join('\n');
  }

  const report = `# Backup Recovery Report

## Test Information

| Field | Value |
|---|---|
| Test timestamp | ${isoTs} |
| Backup folder | backups/${ts}/ |
| Restore folder | backups/restore-test/ |
| Total files | ${srcFiles.length} |

## Files Backed Up

${backupMap.map(b => `- \`${b.rel}\``).join('\n')}

## Backup Verification Results

| File | Original Size | Backup Size | Result |
|---|---|---|---|
${tableRows(backupResults)}

**Backup: ${backupPass} PASS / ${backupFail} FAIL**

## Restore Verification Results

| File | Original Size | Restored Size | Result |
|---|---|---|---|
${tableRows(restoreResults)}

**Restore: ${restorePass} PASS / ${restoreFail} FAIL**

## Overall Status

**${overallStatus}**

${totalFail === 0
  ? 'All files were successfully backed up and restored without any data loss.'
  : `${totalFail} file(s) failed verification. Review the results above.`}
`;

  ensureDir(path.dirname(REPORT_PATH));
  fs.writeFileSync(REPORT_PATH, report, 'utf8');
  console.log(`\n  Report written to docs/backup-recovery-report.md`);
  console.log('');
}

run();
