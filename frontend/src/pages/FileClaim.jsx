import { readCollection } from '../utils/storage';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Upload, File, X, AlertCircle } from 'lucide-react';

const FileClaim = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [policies, setPolicies] = useState([]);
  
  const [formData, setFormData] = useState({
    policyId: '',
    incidentType: '',
    incidentDate: '',
    location: '',
    amount: '',
    description: '',
    confirmed: false
  });
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState(null);

  useEffect(() => {
    const storedPolicies = readCollection('ipp_policies');
    setPolicies(storedPolicies.filter(p => p.status === 'Active'));
  }, []);

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles.map(f => ({ name: f.name, size: f.size }))]);
  };

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selected.map(f => ({ name: f.name, size: f.size }))]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      const ref = `CLM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const newClaim = {
        id: ref,
        policyId: formData.policyId,
        policyName: policies.find(p => p.id === formData.policyId)?.name || 'Insurance Policy',
        incident: formData.incidentType,
        date: new Date(formData.incidentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        submittedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: `$${parseInt(formData.amount).toLocaleString()}`,
        status: 'Under Review',
        description: formData.description
      };

      const existingClaims = readCollection('ipp_claims');
      localStorage.setItem('ipp_claims', JSON.stringify([newClaim, ...existingClaims]));
      
      setSubmittedRef(ref);
      setIsSubmitting(false);
      setStep(5); // Success step
    }, 1500);
  };

  const steps = [
    { num: 1, label: 'Policy' },
    { num: 2, label: 'Incident' },
    { num: 3, label: 'Documents' },
    { num: 4, label: 'Review' }
  ];

  if (step === 5) {
    return (
      <div className="max-w-2xl mx-auto mt-12 bg-white rounded-xl shadow-lg border border-borderMain p-10 text-center">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-10 w-10 text-success" />
        </div>
        <h2 className="text-3xl font-bold text-textMain mb-4">Claim Submitted Successfully</h2>
        <div className="bg-gray-50 p-4 rounded-lg inline-block mb-6 border border-borderMain">
          <p className="text-textSecondary text-sm mb-1">Claim Reference</p>
          <p className="text-2xl font-bold text-primary">{submittedRef}</p>
        </div>
        <p className="text-textSecondary mb-8 max-w-md mx-auto leading-relaxed">
          We have received your claim. You can track its progress from your Claims dashboard. An adjuster will review your case within 2-3 business days.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate(`/claims/${submittedRef}`)}
            className="px-6 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors"
          >
            Track Claim
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 border border-borderMain text-textMain rounded-md font-medium hover:bg-gray-50 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-textMain mb-6">File a New Claim</h1>
        
        {/* Progress Bar */}
        <div className="relative flex justify-between items-center">
          <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -z-10 -translate-y-1/2"></div>
          <div className="absolute left-0 top-1/2 h-1 bg-primary -z-10 -translate-y-1/2 transition-all duration-300" style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}></div>
          
          {steps.map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-2">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm border-4 transition-colors ${
                step > s.num ? 'bg-primary border-primary text-white' : 
                step === s.num ? 'bg-white border-primary text-primary' : 'bg-white border-gray-200 text-gray-400'
              }`}>
                {step > s.num ? <CheckCircle className="h-5 w-5" /> : s.num}
              </div>
              <span className={`text-xs font-medium ${step >= s.num ? 'text-textMain' : 'text-gray-400'}`}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-borderMain p-6 md:p-8">
        
        {/* Step 1: Policy */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-textMain">Select Insurance Policy</h2>
            <p className="text-textSecondary text-sm mb-4">Which policy are you claiming against?</p>
            
            <div className="space-y-4">
              {policies.map(policy => (
                <label key={policy.id} className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${formData.policyId === policy.id ? 'border-primary bg-blue-50 ring-1 ring-primary' : 'border-borderMain hover:bg-gray-50'}`}>
                  <input 
                    type="radio" 
                    name="policy" 
                    className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300" 
                    checked={formData.policyId === policy.id}
                    onChange={() => setFormData({...formData, policyId: policy.id})}
                  />
                  <div className="ml-4 flex-1">
                    <span className="block font-medium text-textMain">{policy.name}</span>
                    <span className="block text-sm text-textSecondary">{policy.id} • Coverage: {policy.coverage}</span>
                  </div>
                </label>
              ))}
            </div>
            
            <div className="pt-6 flex justify-end">
              <button 
                onClick={handleNext}
                disabled={!formData.policyId}
                className="px-6 py-2.5 bg-primary text-white rounded-md font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Incident */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-textMain">Incident Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-textMain mb-2">Incident Type</label>
                <select 
                  className="w-full border border-borderMain rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  value={formData.incidentType}
                  onChange={(e) => setFormData({...formData, incidentType: e.target.value})}
                >
                  <option value="">Select type...</option>
                  <option value="Property Damage">Property Damage</option>
                  <option value="Vehicle Accident">Vehicle Accident</option>
                  <option value="Theft">Theft</option>
                  <option value="Fire">Fire</option>
                  <option value="Employee Incident">Employee Incident</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-textMain mb-2">Date of Incident</label>
                <input 
                  type="date" 
                  className="w-full border border-borderMain rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  value={formData.incidentDate}
                  onChange={(e) => setFormData({...formData, incidentDate: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textMain mb-2">Location</label>
                <input 
                  type="text" 
                  placeholder="Where did this happen?"
                  className="w-full border border-borderMain rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textMain mb-2">Estimated Loss Amount ($)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 5000"
                  className="w-full border border-borderMain rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-textMain mb-2">Description of Incident</label>
                <textarea 
                  rows={4}
                  placeholder="Please provide details about what happened..."
                  className="w-full border border-borderMain rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            <div className="pt-6 flex justify-between border-t border-borderMain mt-8">
              <button 
                onClick={handlePrev}
                className="px-6 py-2.5 border border-borderMain text-textMain rounded-md font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button 
                onClick={handleNext}
                disabled={!formData.incidentType || !formData.incidentDate || !formData.description || !formData.amount}
                className="px-6 py-2.5 bg-primary text-white rounded-md font-medium hover:bg-primary-dark disabled:opacity-50 transition-colors"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Documents */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-textMain">Supporting Documents</h2>
            <p className="text-textSecondary text-sm mb-4">Upload photos, police reports, receipts, or any other relevant documents.</p>
            
            <div 
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:bg-gray-50 hover:border-primary transition-colors cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => document.getElementById('file-upload').click()}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-textMain font-medium mb-1">Drag & Drop Supporting Documents</p>
              <p className="text-textSecondary text-sm">or click to Browse Files (JPG, PNG, PDF)</p>
              <input 
                id="file-upload" 
                type="file" 
                multiple 
                className="hidden" 
                onChange={handleFileSelect}
                accept="image/*,.pdf"
              />
            </div>

            {files.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-medium text-textMain">Uploaded Files</h3>
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-borderMain rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <File className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-textMain">{file.name}</p>
                        <p className="text-xs text-textSecondary">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button onClick={() => removeFile(idx)} className="p-1 hover:bg-gray-200 rounded-md text-textSecondary">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-6 flex justify-between border-t border-borderMain mt-8">
              <button onClick={handlePrev} className="px-6 py-2.5 border border-borderMain text-textMain rounded-md font-medium hover:bg-gray-50">Back</button>
              <button onClick={handleNext} className="px-6 py-2.5 bg-primary text-white rounded-md font-medium hover:bg-primary-dark">Next Step</button>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-textMain">Review Your Claim</h2>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex gap-3 text-yellow-800 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>Please review all information carefully. Submitting false information may result in claim denial or policy cancellation.</p>
            </div>

            <div className="border border-borderMain rounded-lg divide-y divide-borderMain">
              <div className="p-4 grid grid-cols-3 gap-4">
                <span className="text-textSecondary text-sm">Policy</span>
                <span className="col-span-2 font-medium text-textMain">{policies.find(p=>p.id === formData.policyId)?.name}</span>
              </div>
              <div className="p-4 grid grid-cols-3 gap-4">
                <span className="text-textSecondary text-sm">Incident Type</span>
                <span className="col-span-2 font-medium text-textMain">{formData.incidentType}</span>
              </div>
              <div className="p-4 grid grid-cols-3 gap-4">
                <span className="text-textSecondary text-sm">Date</span>
                <span className="col-span-2 font-medium text-textMain">{formData.incidentDate}</span>
              </div>
              <div className="p-4 grid grid-cols-3 gap-4">
                <span className="text-textSecondary text-sm">Location</span>
                <span className="col-span-2 font-medium text-textMain">{formData.location}</span>
              </div>
              <div className="p-4 grid grid-cols-3 gap-4">
                <span className="text-textSecondary text-sm">Amount Claimed</span>
                <span className="col-span-2 font-medium text-textMain">${formData.amount}</span>
              </div>
              <div className="p-4 grid grid-cols-3 gap-4">
                <span className="text-textSecondary text-sm">Description</span>
                <span className="col-span-2 text-sm text-textMain">{formData.description}</span>
              </div>
              <div className="p-4 grid grid-cols-3 gap-4">
                <span className="text-textSecondary text-sm">Documents</span>
                <span className="col-span-2 text-sm text-textMain">{files.length} file(s) attached</span>
              </div>
            </div>

            <label className="flex items-start gap-3 mt-6">
              <input 
                type="checkbox" 
                className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" 
                checked={formData.confirmed}
                onChange={(e) => setFormData({...formData, confirmed: e.target.checked})}
              />
              <span className="text-sm text-textMain">
                I confirm that the information provided is correct and complete to the best of my knowledge.
              </span>
            </label>

            <div className="pt-6 flex justify-between border-t border-borderMain mt-8">
              <button onClick={handlePrev} disabled={isSubmitting} className="px-6 py-2.5 border border-borderMain text-textMain rounded-md font-medium hover:bg-gray-50 disabled:opacity-50">Back</button>
              <button 
                onClick={handleSubmit} 
                disabled={!formData.confirmed || isSubmitting}
                className="px-6 py-2.5 bg-primary text-white rounded-md font-medium hover:bg-primary-dark disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Submitting...</>
                ) : 'Submit Claim'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FileClaim;
