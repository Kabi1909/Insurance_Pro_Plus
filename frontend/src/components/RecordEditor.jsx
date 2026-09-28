import React, { useState } from 'react';
import Modal from './admin/Modal';
import { api } from '../utils/api';
export default function RecordEditor({title, path, fields, initial={}, onSaved, onClose, method='PATCH'}) {
  const [error,setError]=useState('');const [busy,setBusy]=useState(false);
  const submit=async e=>{e.preventDefault();setBusy(true);try{const value=await api(path,{method,body:Object.fromEntries(new FormData(e.currentTarget))});await onSaved?.(value);onClose();}catch(err){setError(err.message);}finally{setBusy(false);}};
  return <Modal isOpen title={title} onClose={onClose}><form onSubmit={submit} className="space-y-4">{error&&<p role="alert" className="text-red-600">{error}</p>}{fields.map(field=><label key={field.name} className="block text-sm font-semibold text-slate-700">{field.label}{field.options?<select name={field.name} defaultValue={initial[field.name]||field.options[0]} className="mt-1 w-full border border-slate-300 rounded-lg p-2.5">{field.options.map(o=><option key={o}>{o}</option>)}</select>:<input name={field.name} type={field.type||'text'} required={field.required!==false} minLength={field.type==='password'?8:undefined} defaultValue={initial[field.name]||''} className="mt-1 w-full border border-slate-300 rounded-lg p-2.5"/>}</label>)}<button disabled={busy} className="bg-primary text-white px-5 py-2 rounded-lg disabled:opacity-50">Save Changes</button></form></Modal>;
}
