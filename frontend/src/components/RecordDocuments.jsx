import React, { useEffect, useState } from 'react';
import { api, download, uploadFile } from '../utils/api';
import { showToast } from '../utils/toast';
export default function RecordDocuments({related, admin=false}) {
  const [documents,setDocuments]=useState([]);const [busy,setBusy]=useState(false);
  const refresh=()=>api(admin?'/admin/documents':'/documents').then(list=>setDocuments(list.filter(d=>d.related===related)));
  useEffect(()=>{let active=true;api(admin?'/admin/documents':'/documents').then(list=>{if(active)setDocuments(list.filter(d=>d.related===related));}).catch(err=>showToast(err.message,'error'));return()=>{active=false;};},[related,admin]);
  const upload=async e=>{const file=e.target.files[0];e.target.value='';if(!file)return;setBusy(true);try{await uploadFile(file,related);await refresh();showToast('Document uploaded.');}catch(err){showToast(err.message,'error');}finally{setBusy(false);}};
  return <div className="space-y-3">{!documents.length&&<p className="text-sm text-slate-500">No documents uploaded yet.</p>}{documents.map(doc=><button key={doc.id} onClick={()=>download(`/documents/${doc.id}/download`)} className="flex justify-between gap-3 w-full p-3 rounded-lg border border-slate-200 text-left hover:bg-slate-50"><span>{doc.name}</span><span className="text-sm text-blue-600">{doc.status} · Download</span></button>)}<label className="inline-flex cursor-pointer text-blue-600 font-semibold text-sm">{busy?'Uploading...':'Upload Document'}<input aria-label="Upload Document" type="file" accept=".pdf,.png,.jpg,.jpeg,.txt" disabled={busy} onChange={upload} className="sr-only" /></label></div>;
}
