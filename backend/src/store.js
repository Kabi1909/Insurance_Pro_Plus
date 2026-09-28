import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { id } from './security.js';
import { defaultSettings } from './catalog.js';

export function createStore(filename) {
  if (filename !== ':memory:') mkdirSync(dirname(filename), { recursive: true });
  const db = new DatabaseSync(filename);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS accounts(id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE COLLATE NOCASE, data TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions(hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES accounts(id), expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS records(id TEXT PRIMARY KEY, kind TEXT NOT NULL, owner TEXT REFERENCES accounts(id), data TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS records_kind_owner ON records(kind,owner);
    CREATE TABLE IF NOT EXISTS files(id TEXT PRIMARY KEY REFERENCES records(id), bytes BLOB NOT NULL);
    CREATE TABLE IF NOT EXISTS settings(id INTEGER PRIMARY KEY CHECK(id=1), data TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS webhook_events(id TEXT PRIMARY KEY, created TEXT NOT NULL);
  `);
  db.prepare('INSERT OR IGNORE INTO settings VALUES (1,?)').run(JSON.stringify(defaultSettings));
  const store = {
    db,
    user: key => { const row = db.prepare('SELECT data FROM accounts WHERE id=? OR email=?').get(key,key); return row ? JSON.parse(row.data) : null; },
    users: () => db.prepare('SELECT data FROM accounts').all().map(r => JSON.parse(r.data)),
    saveUser: user => { db.prepare('INSERT INTO accounts VALUES (?,?,?) ON CONFLICT(id) DO UPDATE SET email=excluded.email,data=excluded.data').run(user.id,user.email,JSON.stringify(user)); return user; },
    list: (kind, owner) => (owner === undefined ? db.prepare('SELECT data FROM records WHERE kind=? ORDER BY rowid DESC').all(kind) : db.prepare('SELECT data FROM records WHERE kind=? AND owner=? ORDER BY rowid DESC').all(kind,owner)).map(r => JSON.parse(r.data)),
    get: (kind, key) => { const row = db.prepare('SELECT data FROM records WHERE kind=? AND id=?').get(kind,key); return row ? JSON.parse(row.data) : null; },
    save: (kind, data) => { db.prepare('INSERT INTO records VALUES (?,?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data').run(data.id,kind,data.owner || null,JSON.stringify(data)); return data; },
    settings: () => JSON.parse(db.prepare('SELECT data FROM settings WHERE id=1').get().data),
    saveSettings: data => db.prepare('UPDATE settings SET data=? WHERE id=1').run(JSON.stringify(data)),
    transaction: fn => { db.exec('BEGIN IMMEDIATE'); try { const value=fn(); db.exec('COMMIT'); return value; } catch(error) { db.exec('ROLLBACK'); throw error; } },
    close: () => db.close(),
  };
  store.audit = (user, action, resource, resourceId) => store.save('audit', { id:id('AUD'), owner:user.id, date:new Date().toISOString(), staff:user.name, role:user.role, action, resource, resourceId, status:'Success' });
  store.notify = (owner, title, message, category, link) => { const key={Policies:'Policy Renewals',Claims:'Claim Updates',Payments:'Payment Receipts'}[category];if(key && store.user(owner)?.preferences?.[key]===false)return null;return store.save('notifications', { id:id('NTF'), owner, title, message, category, link, read:false, date:new Date().toISOString(), time:new Date().toISOString() }); };
  return store;
}
