import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { showToast } from '../utils/toast';
import MessageThread from './MessageThread';
export default function SupportInbox({ admin=false }) {
  const [tickets,setTickets]=useState([]);
  const [error,setError]=useState('');
  async function refresh(){try{setTickets(await api(admin?'/admin/tickets':'/tickets'));setError('');}catch(e){setError(e.message);}}
  useEffect(()=>{let active=true;api(admin?'/admin/tickets':'/tickets').then(v=>{if(active)setTickets(v);}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[admin]);
  function update(t){setTickets(list=>list.map(x=>x.id===t.id?t:x));}
  return <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4"><div className="flex justify-between"><h2 className="text-lg font-bold">{admin?'Support requests':'My support requests'}</h2><button onClick={refresh} className="text-blue-600">Refresh</button></div>{error&&<p role="alert">{error}</p>}{!error&&!tickets.length&&<p className="text-slate-500">No support requests yet.</p>}{tickets.map(t=><details key={t.id} className="border border-slate-200 rounded-lg p-4"><summary className="cursor-pointer font-semibold">{t.subject} · {t.status}</summary><p className="text-xs text-slate-500 my-2">{t.id} · {t.name} · {t.email}</p><p className="whitespace-pre-wrap mb-4">{t.message}</p><MessageThread kind="tickets" record={t} onUpdate={update}/>{admin&&<button className="text-blue-600 mt-3" onClick={async()=>{try{update(await api('/admin/tickets/'+t.id,{method:'PATCH',body:{status:t.status==='Open'?'Closed':'Open'}}));}catch(e){showToast(e.message,'error');}}}>{t.status==='Open'?'Close request':'Reopen request'}</button>}</details>)}</section>;
}
