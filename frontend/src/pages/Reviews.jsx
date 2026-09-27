import React from 'react';

const Reviews = () => (
  <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <h1 className="text-3xl font-bold text-textMain mb-8 text-center">What Our Customers Say</h1>
    <div className="text-center mb-12">
      <div className="text-4xl font-bold text-textMain">4.8 / 5</div>
      <div className="text-accent flex justify-center my-2 gap-1">
        {[1,2,3,4,5].map(i => <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
      </div>
      <p className="text-textSecondary">Based on 2,500+ reviews</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
       <div className="bg-white p-6 rounded-xl border border-borderMain shadow-sm">
         <div className="flex items-center gap-4 mb-4">
           <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-primary text-xl">A</div>
           <div>
             <h3 className="font-bold text-textMain">Albert</h3>
             <p className="text-xs text-textSecondary">Small Business Owner</p>
           </div>
         </div>
         <div className="text-accent flex gap-1 mb-3">
           {[1,2,3,4,5].map(i => <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
         </div>
         <p className="text-textSecondary italic">"Insurance Pro Plus makes managing our policies simple. I can renew policies, make payments and submit claims without visiting an office."</p>
         <p className="text-xs text-gray-400 mt-4">Oct 20, 2026</p>
       </div>
    </div>
  </div>
);

export default Reviews;
