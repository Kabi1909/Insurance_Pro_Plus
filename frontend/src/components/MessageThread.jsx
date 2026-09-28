import { useState } from 'react';
import { api } from '../utils/api';
import { showToast } from '../utils/toast';
export default function MessageThread({ kind, record, onUpdate }) {
  const [busy,setBusy]=useState(false);
  const messages=record[kind==='tickets'?'replies':'messages']||[];
  async function send(e){e.preventDefault();if(busy)return;const form=e.currentTarget;setBusy(true);try{const value=await api(`/${kind}/${record.id}/messages`,{method:'POST',body:{message:new FormData(form).get('message')}});onUpdate(value);form.reset();}catch(error){showToast(error.message,'error');}finally{setBusy(false);}}
  return <div className="space-y-4">{messages.map(m=><div key={m.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200"><p className="text-sm whitespace-pre-wrap">{m.text}</p><p className="text-xs text-slate-500 mt-2">{m.author} · {new Date(m.time).toLocaleString()}</p></div>)}{!messages.length&&<p className="text-sm text-slate-500">No messages yet.</p>}<form onSubmit={send} className="space-y-3"><textarea name="message" aria-label="Message" required minLength={1} maxLength={4000} rows={3} className="w-full p-3 border border-slate-300 rounded-lg" placeholder="Write a message"/><button disabled={busy} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">{busy?'Sending…':'Send message'}</button></form></div>;
}
