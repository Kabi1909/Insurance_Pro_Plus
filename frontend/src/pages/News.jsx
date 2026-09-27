import React from 'react';

const News = () => (
  <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <h1 className="text-3xl font-bold text-textMain mb-8">Insurance News & Updates</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { t: "How to Protect Your Small Business in 2026", d: "Oct 15, 2026", cat: "Business Guides" },
        { t: "New Online Claim Features Available", d: "Oct 01, 2026", cat: "Product Update" },
        { t: "Understanding Business Property Insurance", d: "Sep 20, 2026", cat: "Education" },
      ].map((n, i) => (
        <div key={i} className="bg-white rounded-xl border border-borderMain overflow-hidden shadow-sm flex flex-col">
          <div className="h-48 bg-gray-200 w-full flex items-center justify-center text-gray-400">Image Placeholder</div>
          <div className="p-6 flex-1 flex flex-col">
            <span className="text-xs font-medium text-primary mb-2">{n.cat}</span>
            <h3 className="text-lg font-bold text-textMain mb-2">{n.t}</h3>
            <p className="text-xs text-textSecondary mb-4">{n.d}</p>
            <p className="text-sm text-textSecondary mb-6 flex-1">Insurance trends and guides to help you make the best decisions for your future.</p>
            <button className="text-primary font-medium text-sm self-start hover:underline">Read More</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default News;
