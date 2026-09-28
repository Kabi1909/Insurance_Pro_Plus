import { useState } from 'react';
import { Filter } from 'lucide-react';
import Modal from './Modal';
export default function RecordFilter({ data, value, onChange }) {
  const [open,setOpen]=useState(false);
  return <><button onClick={()=>setOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium"><Filter className="h-4 w-4"/>Filters{value?' · '+value:''}</button><Modal isOpen={open} onClose={()=>setOpen(false)} title="Filter records"><label className="block text-sm font-medium">Status<select value={value} onChange={e=>onChange(e.target.value)} className="block w-full border border-slate-300 rounded-lg p-2 mt-2"><option value="">All statuses</option>{[...new Set(data.map(r=>r.status).filter(Boolean))].map(s=><option key={s}>{s}</option>)}</select></label><button onClick={()=>{onChange('');setOpen(false);}} className="text-blue-600 mt-4">Clear filters</button></Modal></>;
}
