import React, { useState } from 'react';

const DataTable = ({ columns, data, onRowClick }) => {
  const [page,setPage]=useState(0);
  const pages=Math.max(1,Math.ceil(data.length/10));
  const current=Math.min(page,pages-1);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
            {columns.map((col, idx) => (
              <th key={idx} className="p-4">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-8 text-center text-slate-500">
                No data available.
              </td>
            </tr>
          ) : (
            data.slice(current*10,current*10+10).map((row, rowIdx) => (
              <tr
                key={row.id || rowIdx}
                className={`hover:bg-slate-50 transition-colors duration-150 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={`p-4 ${col.className || ''}`}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500"><span>{data.length} records · Page {current+1} of {pages}</span><div className="flex gap-2"><button disabled={current===0} onClick={()=>setPage(current-1)} className="px-3 py-1 border rounded-md disabled:opacity-50">Previous</button><button disabled={current>=pages-1} onClick={()=>setPage(current+1)} className="px-3 py-1 border rounded-md disabled:opacity-50">Next</button></div></div>
    </div>
  );
};

export default DataTable;
