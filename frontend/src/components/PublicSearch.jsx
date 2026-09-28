import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import Modal from './admin/Modal';
export default function PublicSearch({onClose, customer=false}){
 const [query,setQuery]=useState(''),[items,setItems]=useState([]),[error,setError]=useState('');
 useEffect(()=>{let active=true;Promise.all([api('/products'),...(customer?[api('/policies'),api('/claims')]:[])]).then(([products,policies=[],claims=[]])=>{if(active)setItems([...products.map(p=>({id:p.id,label:p.name,description:p.desc,link:'/products/'+p.id})),...policies.map(p=>({id:p.id,label:p.name,description:p.id,link:'/policies/'+p.id})),...claims.map(c=>({id:c.id,label:c.id,description:c.incident,link:'/claims/'+c.id}))]);}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[customer]);
 const results=items.filter(i=>(i.label+' '+i.description).toLowerCase().includes(query.toLowerCase()));
 return <Modal isOpen title="Search insurance" onClose={onClose}><input autoFocus aria-label="Search insurance" value={query} onChange={e=>setQuery(e.target.value)} className="w-full border border-slate-300 p-3 rounded-lg" placeholder="Search products or records"/>{error&&<p role="alert">{error}</p>}<div className="max-h-80 overflow-y-auto mt-3">{results.map(r=><Link key={r.id} to={r.link} onClick={onClose} className="block p-3 rounded-lg hover:bg-slate-50"><p className="font-semibold text-blue-600">{r.label}</p><p className="text-xs text-slate-500">{r.description}</p></Link>)}{!results.length&&!error&&<p className="p-3 text-slate-500">No matching records.</p>}</div></Modal>;
}
