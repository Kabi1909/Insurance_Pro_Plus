import RecordFilter from '../../components/admin/RecordFilter';
import { api, download, uploadFile } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { readCollection } from '../../utils/storage';
import React, { useState, useEffect } from 'react';
import { Search, Filter, FileText, CheckCircle, Clock, XCircle, FileImage, File, Upload, Grid, List, Download, Eye } from 'lucide-react';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { showToast } from '../../utils/toast';

const AdminDocuments = () => {
  const [statusFilter,setStatusFilter]=useState('');
  const navigate=useNavigate();const [uploadOpen,setUploadOpen]=useState(false);const [uploadBusy,setUploadBusy]=useState(false);const [reason,setReason]=useState('');
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [activeCategory, setActiveCategory] = useState('All Documents');

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {

    const data = await readCollection('ipp_admin_documents');
    if (active) setDocuments(data);

      } catch (error) { if (active) showToast(error.message, 'error'); }
    })();
    return () => { active = false; };
  }, []);

  const categories = ['All Documents', 'Policy Documents', 'Claim Documents', 'Identity Documents', 'Business Documents', 'Payment Documents'];

  const filteredDocs = documents.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.related.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All Documents' || d.category === activeCategory;
    return matchesSearch && matchesCategory && (!statusFilter||d.status===statusFilter);
  });

  const changeStatus=async(id,status)=>{try{const value=await api('/admin/documents/'+id,{method:'PATCH',body:{status,reason}});setDocuments(list=>list.map(d=>d.id===id?value:d));if(selectedDoc?.id===id)setSelectedDoc(value);setShowRejectConfirm(false);showToast('Document updated.');}catch(e){showToast(e.message,'error');}};
  const handleVerify=id=>changeStatus(id,'Verified');
  const handleReject=()=>{if(!reason.trim()){showToast('Enter a rejection reason.','error');return;}changeStatus(selectedDoc.id,'Rejected');};
  const handleUpload=async e=>{e.preventDefault();if(uploadBusy)return;setUploadBusy(true);const data=new FormData(e.currentTarget);try{const value=await uploadFile(data.get('file'),data.get('related'));setDocuments(list=>[value,...list]);setUploadOpen(false);showToast('Document uploaded.');}catch(e){showToast(e.message,'error');}finally{setUploadBusy(false);}};

  const openPreview = (doc) => {
    setSelectedDoc(doc);
    setShowPreview(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Documents</h1>
          <p className="text-slate-500">Review and manage customer, policy and claim documents.</p>
        </div>
        <button onClick={()=>setUploadOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
          <Upload className="h-4 w-4" /> Upload Document
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Documents" value={documents.length} icon={FileText} color="blue" />
        <StatCard title="Pending Verification" value={documents.filter(d => d.status === 'Pending Verification').length} icon={Clock} color="yellow" />
        <StatCard title="Verified" value={documents.filter(d => d.status === 'Verified').length} icon={CheckCircle} color="green" />
        <StatCard title="Rejected" value={documents.filter(d => d.status === 'Rejected').length} icon={XCircle} color="red" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
        {/* Categories */}
        <div className="p-4 border-b border-slate-200 overflow-x-auto hide-scrollbar">
           <div className="flex gap-2">
             {categories.map(cat => (
               <button
                 key={cat}
                 onClick={() => setActiveCategory(cat)}
                 className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
               >
                 {cat}
               </button>
             ))}
           </div>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents, customers, policies or claims..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
             <RecordFilter data={documents} value={statusFilter} onChange={setStatusFilter}/>
             <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden">
               <button
                 onClick={() => setViewMode('list')}
                 className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-slate-100 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
               >
                 <List className="h-5 w-5" />
               </button>
               <button
                 onClick={() => setViewMode('grid')}
                 className={`p-2 border-l border-slate-200 transition-colors ${viewMode === 'grid' ? 'bg-slate-100 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
               >
                 <Grid className="h-5 w-5" />
               </button>
             </div>
          </div>
        </div>

        {/* Content */}
        {filteredDocs.length === 0 ? (
          <div className="p-12 text-center">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <FileText className="h-8 w-8 text-slate-400" />
             </div>
             <h3 className="text-lg font-bold text-slate-900 mb-1">No documents found</h3>
             <p className="text-slate-500 mb-6">Documents uploaded by customers and staff will appear here.</p>
             <button onClick={()=>setUploadOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium inline-flex items-center">
               <Upload className="h-4 w-4 mr-2" /> Upload Document
             </button>
          </div>
        ) : viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                  <th className="p-4">Document</th>
                  <th className="p-4">Related</th>
                  <th className="p-4">Uploaded</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => openPreview(doc)}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                           {doc.type === 'PDF' ? <FileText className="h-5 w-5" /> : doc.type === 'Archive' ? <File className="h-5 w-5" /> : <FileImage className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{doc.name}</p>
                          <p className="text-xs text-slate-500">{doc.type} • {doc.size}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{doc.customer}</p>
                      <p className="text-xs text-slate-500">{doc.related}</p>
                    </td>
                    <td className="p-4">
                      <p>{doc.uploadDate}</p>
                      <p className="text-xs text-slate-500">by {doc.uploadedBy}</p>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={doc.status} />
                    </td>
                    <td className="p-4">
                      <button onClick={(e) => { e.stopPropagation(); openPreview(doc); }} className="text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-50 px-3 py-1.5 rounded-md transition-colors">
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
             {filteredDocs.map((doc) => (
               <div key={doc.id} onClick={() => openPreview(doc)} className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer bg-white group">
                  <div className="h-32 bg-slate-50 rounded-lg flex items-center justify-center mb-4 border border-slate-100 group-hover:bg-blue-50 transition-colors">
                     {doc.type === 'PDF' ? <FileText className="h-10 w-10 text-slate-400 group-hover:text-blue-500" /> : doc.type === 'Archive' ? <File className="h-10 w-10 text-slate-400 group-hover:text-blue-500" /> : <FileImage className="h-10 w-10 text-slate-400 group-hover:text-blue-500" />}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm truncate mb-1" title={doc.name}>{doc.name}</h3>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-slate-500">{doc.size}</span>
                    <span className="text-xs text-slate-500">{doc.uploadDate}</span>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs font-medium text-slate-700 truncate">{doc.customer}</p>
                    <p className="text-[10px] text-slate-500">{doc.related}</p>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <StatusBadge status={doc.status} />
                    <button onClick={()=>openPreview(doc)} aria-label="Review document" className="text-slate-400 hover:text-blue-600 p-1"><Eye className="h-4 w-4" /></button>
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>

      <Modal isOpen={uploadOpen} onClose={()=>setUploadOpen(false)} title="Upload Document"><form onSubmit={handleUpload} className="space-y-4"><label className="block text-sm font-semibold">Policy or claim ID<input name="related" required className="block w-full border border-slate-300 rounded-lg p-2 mt-1"/></label><input aria-label="Document" name="file" required type="file" accept=".pdf,.png,.jpg,.jpeg,.txt"/><p className="text-sm text-slate-500">Maximum 5 MB. The file belongs to the customer on the related record.</p><button disabled={uploadBusy} className="bg-blue-600 text-white rounded-lg px-4 py-2">{uploadBusy?'Uploading…':'Upload'}</button></form></Modal>
      <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} title="Document Review" maxWidth="max-w-4xl">
         {selectedDoc && (
           <div className="flex flex-col lg:flex-row gap-6">
              {/* Preview Area */}
              <div className="flex-1 bg-slate-100 rounded-lg border border-slate-200 min-h-[400px] flex items-center justify-center relative overflow-hidden">
                 <div className="text-center p-6">
                   {selectedDoc.type === 'PDF' ? <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" /> : selectedDoc.type === 'Archive' ? <File className="h-16 w-16 text-slate-400 mx-auto mb-4" /> : <FileImage className="h-16 w-16 text-slate-400 mx-auto mb-4" />}
                   <p className="text-slate-600 font-medium">Download the file to review its contents</p>
                   <p className="text-slate-400 text-sm mt-1">{selectedDoc.name}</p>
                 </div>
              </div>

              {/* Details Sidebar */}
              <div className="w-full lg:w-80 flex flex-col gap-6">
                 <div>
                   <h3 className="text-lg font-bold text-slate-900 break-all">{selectedDoc.name}</h3>
                   <div className="flex items-center gap-2 mt-2">
                     <StatusBadge status={selectedDoc.status} />
                     <span className="text-xs text-slate-500">{selectedDoc.size}</span>
                   </div>
                 </div>

                 <div className="space-y-4 text-sm">
                   <div>
                     <p className="text-slate-500 mb-1">Customer</p>
                     <p className="font-semibold text-slate-900">{selectedDoc.customer}</p>
                   </div>
                   <div>
                     <p className="text-slate-500 mb-1">Related Reference</p>
                     <button onClick={()=>navigate('/admin/'+(selectedDoc.related.startsWith('CLM')?'claims/':'policies/')+selectedDoc.related)} className="font-semibold text-blue-600 hover:underline">{selectedDoc.related}</button>
                   </div>
                   <div>
                     <p className="text-slate-500 mb-1">Upload Details</p>
                     <p className="text-slate-900">{selectedDoc.uploadDate} by {selectedDoc.uploadedBy}</p>
                   </div>
                 </div>

                 <div className="mt-auto space-y-3 pt-6 border-t border-slate-200">
                    <button onClick={()=>download('/documents/'+selectedDoc.id+'/download')} className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                      <Download className="h-4 w-4" /> Download File
                    </button>
                    {selectedDoc.status === 'Pending Verification' && (
                      <>
                        <button
                          onClick={() => handleVerify(selectedDoc.id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
                        >
                          <CheckCircle className="h-4 w-4" /> Mark as Verified
                        </button>
                        <button
                          onClick={() => setShowRejectConfirm(true)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium"
                        >
                          <XCircle className="h-4 w-4" /> Reject Document
                        </button>
                      </>
                    )}
                 </div>
              </div>
           </div>
         )}
      </Modal>

      {/* Reject Confirmation */}
      <Modal isOpen={showRejectConfirm} onClose={() => setShowRejectConfirm(false)} title="Reject Document">
         <p className="text-slate-600 mb-4">Are you sure you want to reject this document? The customer will be notified to upload a replacement.</p>
         <div className="mb-6">
           <label className="block text-sm font-medium text-slate-700 mb-2">Reason for rejection *</label>
           <textarea value={reason} onChange={e=>setReason(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" rows="3" placeholder="e.g. Document is blurry or illegible..."></textarea>
         </div>
         <div className="flex justify-end gap-3">
            <button onClick={() => setShowRejectConfirm(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">Cancel</button>
            <button onClick={handleReject} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-sm">Confirm Rejection</button>
         </div>
      </Modal>
    </div>
  );
};

export default AdminDocuments;
