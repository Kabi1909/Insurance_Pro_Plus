import React from 'react';

const DataTable = ({ columns, data, onRowClick }) => {
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
            data.map((row, rowIdx) => (
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
    </div>
  );
};

export default DataTable;
