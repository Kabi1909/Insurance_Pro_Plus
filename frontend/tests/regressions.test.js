import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { isAdminCredentials, isCustomerCredentials } from '../src/utils/credentials.js';
import { readSession, writeSession, clearSession, updateSession } from '../src/utils/session.js';
import { readCollection } from '../src/utils/storage.js';
import { initializeDemoData } from '../src/utils/demoData.js';
import { initializeAdminDemoData } from '../src/utils/adminDemoData.js';

function memoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key),
  };
}
const user = { id: 'test-user', name: 'Test User', email: 'test@example.com' };
beforeEach(() => {
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: memoryStorage() });
  Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, value: memoryStorage() });
});

test('default administrator accepts normalized email and exact password', () => {
  assert.equal(isAdminCredentials('admin@insuranceproplus.com', 'Admin@123'), true);
  assert.equal(isAdminCredentials(' ADMIN@INSURANCEPROPLUS.COM ', 'Admin@123'), true);
  for (const password of ['', 'admin@123', 'Admin@123 ', 'wrong']) {
    assert.equal(isAdminCredentials('admin@insuranceproplus.com', password), false);
  }
  assert.equal(isAdminCredentials('someone@example.com', 'Admin@123'), false);
});

test('customer credentials do not authenticate an administrator', () => {
  assert.equal(isCustomerCredentials(' ALBERT@DEMO.COM ', 'Albert123'), true);
  assert.equal(isAdminCredentials('albert@demo.com', 'Albert123'), false);
  assert.equal(isCustomerCredentials('admin@insuranceproplus.com', 'Admin@123'), false);
});

test('malformed and invalid session shapes recover without throwing', () => {
  for (const raw of ['broken{', 'null', '[]', '42', '{}', '{"name":5}']) {
    localStorage.setItem('ipp_user', raw);
    assert.equal(readSession('ipp_user'), null);
    assert.equal(localStorage.getItem('ipp_user'), null);
  }
});

test('remember me selects persistence and logout clears both stores', () => {
  writeSession('ipp_user', user);
  assert.equal(localStorage.getItem('ipp_user'), null);
  assert.deepEqual(readSession('ipp_user'), user);
  writeSession('ipp_user', user, true);
  assert.equal(sessionStorage.getItem('ipp_user'), null);
  assert.deepEqual(JSON.parse(localStorage.getItem('ipp_user')), user);
  clearSession('ipp_user');
  assert.equal(readSession('ipp_user'), null);
});

test('profile updates preserve selected persistence', () => {
  for (const remember of [true, false]) {
    writeSession('ipp_user', user, remember);
    updateSession('ipp_user', { ...user, name: 'Updated' });
    assert.equal(readSession('ipp_user').name, 'Updated');
    assert.equal(localStorage.getItem('ipp_user') !== null, remember);
  }
});

test('blocked storage does not crash session restoration and rejects login clearly', () => {
  for (const name of ['localStorage', 'sessionStorage']) {
    Object.defineProperty(globalThis, name, {
      configurable: true, get() { throw new Error('Storage blocked'); },
    });
  }
  assert.equal(readSession('ipp_user'), null);
  assert.doesNotThrow(() => clearSession('ipp_user'));
  assert.throws(() => writeSession('ipp_user', user), /Allow browser storage/);
});

test('collections reject malformed JSON and non-record arrays', () => {
  for (const raw of ['broken{', '{}', 'null', '[null]', '[1]', '[[]]']) {
    localStorage.setItem('records', raw);
    assert.deepEqual(readCollection('records'), []);
  }
  localStorage.setItem('records', JSON.stringify([{ id: '1' }]));
  assert.deepEqual(readCollection('records'), [{ id: '1' }]);
});

test('demo initialization populates direct links and preserves existing edits', () => {
  initializeDemoData();
  initializeAdminDemoData();
  assert.ok(readCollection('ipp_policies').length > 0);
  assert.ok(readCollection('ipp_admin_customers').length > 0);
  localStorage.setItem('ipp_admin_customers', JSON.stringify([{ id: 'custom' }]));
  initializeAdminDemoData();
  assert.deepEqual(readCollection('ipp_admin_customers'), [{ id: 'custom' }]);
  localStorage.setItem('ipp_admin_claims', 'broken{');
  initializeAdminDemoData();
  assert.ok(readCollection('ipp_admin_claims').length > 0);
  localStorage.setItem('ipp_policies', '[]');
  initializeDemoData();
  assert.deepEqual(readCollection('ipp_policies'), []);
});
