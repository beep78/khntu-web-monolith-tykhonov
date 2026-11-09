// Перевірка API: node scripts/check.js lr4|lr5|lr6. Виводить запити, відповіді та PASS/FAIL.
const BASE = process.env.BASE_URL || 'http://localhost:3000';
let failed = 0;
async function call(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = 'Bearer ' + token;
  const res = await fetch(BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  let data = null;
  try { data = await res.json(); } catch {}
  return { status: res.status, data };
}
function show(title, method, path, body, r) {
  console.log(`\n### ${title}`);
  console.log(`> ${method} ${path}` + (body ? `\n  тіло: ${JSON.stringify(body)}` : ''));
  console.log(`< ${r.status} ${JSON.stringify(r.data)}`);
}
function expect(name, cond) {
  console.log((cond ? '  PASS ' : '  FAIL ') + name);
  if (!cond) failed++;
}
module.exports = { call, show, expect, done: () => { console.log(`\nПідсумок: ${failed === 0 ? 'усі перевірки пройдено' : failed + ' помилок'}`); process.exit(failed ? 1 : 0); } };
