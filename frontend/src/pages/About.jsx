import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center min-h-[60vh] flex flex-col justify-center">
      <h1 className="text-4xl md:text-5xl font-bold text-[#071A3D] mb-6">About Insurance Pro Plus</h1>
      <p className="text-lg text-[#52627A] mb-8 leading-relaxed">
        We are a leading provider of comprehensive insurance solutions for individuals and businesses. 
        Our mission is to make insurance simple, transparent, and accessible to everyone. With our modern 
        digital platform, managing your policies and claims has never been easier.
      </p>
      <div>
        <Link to="/register" className="bg-[#0866FF] text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block">
          Join Us Today
        </Link>
      </div>
    </div>
  );
};

export default About;
