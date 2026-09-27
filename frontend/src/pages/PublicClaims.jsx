import React from 'react';
import { Link } from 'react-router-dom';

const PublicClaims = () => {
  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center min-h-[60vh] flex flex-col justify-center">
      <h1 className="text-4xl md:text-5xl font-bold text-[#071A3D] mb-6">Claims Processing</h1>
      <p className="text-lg text-[#52627A] mb-8 leading-relaxed">
        Filing a claim should be simple and stress-free. Our online claims center allows you to submit, 
        track, and manage your claims 24/7. Log in to your account to start a new claim or check the 
        status of an existing one.
      </p>
      <div className="flex justify-center gap-4">
        <Link to="/login" className="bg-[#0866FF] text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          Log In to File Claim
        </Link>
        <Link to="/support" className="bg-white border border-[#0866FF] text-[#0866FF] px-8 py-3 rounded-lg font-semibold hover:bg-[#F8FBFF] transition-colors">
          Contact Support
        </Link>
      </div>
    </div>
  );
};

export default PublicClaims;
