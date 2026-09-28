import { paymentText } from '../utils/paymentText';
import React, { useEffect, useState } from 'react';
import { api, download } from '../utils/api';
export default function RelatedRecords({ tab, record, entity }) {
  const [rows,setRows]=useState([]);const [error,setError]=useState('');
  useEffect(()=>{let active=true;setError('');setRows([]);const kind=tab==='Activity'?'audit':tab==='Assigned Work'?'claims':tab.toLowerCase();
    if(tab==='Coverage'||tab==='Permissions')return;
    api('/admin/'+kind).then(list=>{if(active)setRows(list.filter(r=>entity==='customer'?r.owner===record.id:entity==='staff'?r.officerId===record.id||r.owner===record.id:r.policyId===record.id||r.related===record.id||r.resourceId===record.id));}).catch(err=>{if(active)setError(err.message);});return()=>{active=false;};
  },[tab,record.id,entity]);
  if(tab==='Coverage')return <ul className="list-disc pl-5 space-y-2">{(record.benefits||[]).map(b=><li key={b}>{b}</li>)}</ul>;
  if(tab==='Permissions')return <p className="text-slate-600">Role: {record.role}. System administrators manage staff and settings. Staff access is enforced by the server.</p>;
  return <div className="space-y-3">{error&&<p role="alert" className="text-red-600">{error}</p>}{!error&&!rows.length&&<p className="text-slate-500">No {tab.toLowerCase()} records yet.</p>}{rows.map(row=><div key={row.id} className="border border-slate-200 rounded-lg p-4 flex justify-between gap-4"><div><p className="font-semibold">{row.name||row.policyName||paymentText(row.action)||row.id}</p><p className="text-sm text-slate-500">{row.id} · {row.status}</p></div>{tab==='Documents'&&<button onClick={()=>download(`/documents/${row.id}/download`)} className="text-primary">Download</button>}</div>)}</div>;
}
