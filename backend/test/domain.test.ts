import test from 'node:test';
import assert from 'node:assert/strict';

function isOfficialDomain(email: string): boolean {
  const parts = email.trim().toLowerCase().split('@');
  return parts.length === 2 && parts[1] === 'hbplus.fit';
}

test('accepts exact HB Plus domain case-insensitively', () => {
  assert.equal(isOfficialDomain('USER@HBPLUS.FIT'), true);
});

test('rejects Gmail and lookalike domains', () => {
  assert.equal(isOfficialDomain('user@gmail.com'), false);
  assert.equal(isOfficialDomain('user@fakehbplus.fit'), false);
  assert.equal(isOfficialDomain('user@hbplus.fit.fake.com'), false);
  assert.equal(isOfficialDomain('xhbplus.fit@example.com'), false);
});
