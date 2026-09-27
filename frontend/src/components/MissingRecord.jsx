import React from 'react';
import { Link } from 'react-router-dom';

export default function MissingRecord({ label, backTo }) {
  return (
    <div className="p-8 text-center text-slate-600" role="status">
      <h1 className="text-xl font-semibold mb-3">{label} not found</h1>
      <p className="mb-4">This record is unavailable. Check the link or return to the list.</p>
      <Link to={backTo} className="text-blue-600 font-semibold">Back to list</Link>
    </div>
  );
}
