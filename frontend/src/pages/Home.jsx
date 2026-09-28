import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Car, House, HeartPulse, Users, Plane, BriefcaseBusiness, Headphones, Zap, ArrowRight, Shield } from 'lucide-react';

const Home = () => {
  return (
    <div className="w-full">
      {/* 4. HERO SECTION */}
      <section className="w-full bg-gradient-to-br from-[#F8FBFF] to-[#EAF4FF]/40 relative overflow-hidden">
        {/* Subtle background abstract shape */}
        <div className="absolute top-0 right-0 w-[60%] h-full bg-[#EAF4FF] rounded-l-[100px] opacity-50 blur-3xl -z-10 hidden lg:block"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[120%] bg-[#0866FF]/5 rounded-full blur-3xl -z-10 hidden lg:block"></div>

        {/* Abstract oversized shield outline behind family */}
        <div className="absolute top-1/2 right-[10%] -translate-y-1/2 -z-10 opacity-[0.03] pointer-events-none hidden lg:block">
           <Shield className="w-[500px] h-[500px]" strokeWidth={0.5} />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-8 min-h-[500px]">
          {/* Left Column */}
          <div className="w-full lg:w-[48%] flex flex-col z-10 lg:pl-[2%] xl:pl-[5%] pt-8 lg:pt-0 text-center lg:text-left">
            {/* Small rounded badge */}
            <div className="inline-flex items-center gap-2 bg-[#EAF4FF] text-[#0866FF] px-4 py-2 rounded-full font-semibold text-sm mb-6 w-fit mx-auto lg:mx-0 shadow-sm border border-[#0866FF]/10">
               <ShieldCheck className="w-4 h-4" />
               Reliable Insurance for a Safer Tomorrow
            </div>

            {/* Large Heading */}
            <h1 className="text-[38px] md:text-[48px] lg:text-[56px] xl:text-[64px] font-[800] leading-[1.1] text-[#071A3D] mb-6 tracking-tight">
              Protect What <br className="hidden lg:block" />
              Matters to <span className="text-[#0866FF]">You</span>
            </h1>

            {/* Description */}
            <p className="text-[18px] md:text-[20px] text-[#52627A] max-w-[570px] leading-relaxed mb-8 mx-auto lg:mx-0">
              Manage your insurance policies, renew coverage, submit claims and make secure payments — all in one place.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-5 w-full justify-center lg:justify-start">
              <Link to="/register" className="w-full sm:w-[215px] h-[54px] flex items-center justify-center gap-2 bg-[#0866FF] hover:bg-[#0753d4] text-white font-semibold rounded-lg transition-colors shadow-[0_4px_14px_rgba(8,102,255,0.3)] text-[16px]">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/about" className="w-full sm:w-[215px] h-[54px] flex items-center justify-center border border-[#0866FF] text-[#0866FF] bg-white hover:bg-[#EAF4FF] font-semibold rounded-lg transition-colors text-[16px]">
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Column (Image + Floating labels) */}
          <div className="w-full lg:w-[52%] relative flex justify-center mt-10 lg:mt-0 z-10 px-4 sm:px-10 lg:px-0">
            {/* Image mask container */}
            <div className="relative w-full max-w-[650px] aspect-[4/3] lg:aspect-[4/3]">
               {/* Masking the image so the bottom/edges softly blend into background.
                   Using a gentle vignette radial gradient via Tailwind arbitrary mask. */}
               <div className="absolute inset-0 rounded-[32px] overflow-hidden shadow-xl border border-white/50" style={{ maskImage: 'radial-gradient(ellipse at center, black 65%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 65%, transparent 100%)' }}>
                 <img src="/images/happy-family.jpg" alt="Happy family using laptop" className="w-full h-full object-cover object-center" />
               </div>

               {/* To satisfy "Do NOT put the image inside a rectangular card. Avoid obvious hard image edges"
                   The mask above will softly fade the edges. But just in case mask isn't supported,
                   it's rounded.
               */}
            </div>

            {/* Floating Labels */}
            <div className="absolute top-[10%] left-[0%] sm:left-[5%] lg:left-[-5%] flex items-center gap-3 bg-white p-3 pr-5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-[3px] transition-transform duration-300 z-20 border border-[#E4ECF7]/50">
              <div className="w-10 h-10 rounded-full bg-[#EAF4FF] flex items-center justify-center">
                <Car className="w-5 h-5 text-[#0866FF]" />
              </div>
              <span className="font-bold text-[#081A3A] text-sm leading-tight">Vehicle<br/>Insurance</span>
            </div>

            <div className="absolute top-[45%] left-[-5%] sm:left-[0%] lg:left-[-15%] flex items-center gap-3 bg-white p-3 pr-5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-[3px] transition-transform duration-300 z-20 border border-[#E4ECF7]/50">
              <div className="w-10 h-10 rounded-full bg-[#FEF2F2] flex items-center justify-center">
                <HeartPulse className="w-5 h-5 text-[#EF4444]" />
              </div>
              <span className="font-bold text-[#081A3A] text-sm leading-tight">Health<br/>Insurance</span>
            </div>

            <div className="absolute top-[20%] right-[0%] sm:right-[5%] lg:right-[-2%] flex items-center gap-3 bg-white p-3 pr-5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-[3px] transition-transform duration-300 z-20 border border-[#E4ECF7]/50">
              <div className="w-10 h-10 rounded-full bg-[#FFF7ED] flex items-center justify-center">
                <House className="w-5 h-5 text-[#FF8A1F]" />
              </div>
              <span className="font-bold text-[#081A3A] text-sm leading-tight">Home<br/>Insurance</span>
            </div>

            <div className="absolute top-[60%] right-[0%] sm:right-[0%] lg:right-[-8%] flex items-center gap-3 bg-white p-3 pr-5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-[3px] transition-transform duration-300 z-20 border border-[#E4ECF7]/50">
              <div className="w-10 h-10 rounded-full bg-[#F5F3FF] flex items-center justify-center">
                <BriefcaseBusiness className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <span className="font-bold text-[#081A3A] text-sm leading-tight">Business<br/>Insurance</span>
            </div>

          </div>
        </div>
      </section>

      {/* 12. BENEFIT / TRUST STRIP */}
      <section className="w-full bg-white border-y border-[#E4ECF7]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Grid setup based on screen size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-[#E4ECF7] lg:min-h-[115px]">

            <div className="flex items-center gap-4 py-6 px-2 lg:px-8 justify-center sm:justify-start lg:justify-center xl:justify-start">
              <div className="w-[50px] h-[50px] rounded-full bg-[#EAF4FF] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#0866FF]" />
              </div>
              <div>
                <h4 className="font-bold text-[#081A3A] text-[16px]">Secure & Protected</h4>
                <p className="text-[#52627A] text-[14px]">Your data is safe with us</p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-6 px-2 lg:px-8 justify-center sm:justify-start lg:justify-center xl:justify-start">
              <div className="w-[50px] h-[50px] rounded-full bg-[#ECFDF5] flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6 text-[#10A66A]" />
              </div>
              <div>
                <h4 className="font-bold text-[#081A3A] text-[16px]">24/7 Support</h4>
                <p className="text-[#52627A] text-[14px]">Always here for you</p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-6 px-2 lg:px-8 justify-center sm:justify-start lg:justify-center xl:justify-start">
              <div className="w-[50px] h-[50px] rounded-full bg-[#FFF7ED] flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-[#FF8A1F]" />
              </div>
              <div>
                <h4 className="font-bold text-[#081A3A] text-[16px]">Fast Claims</h4>
                <p className="text-[#52627A] text-[14px]">Quick and easy process</p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-6 px-2 lg:px-8 justify-center sm:justify-start lg:justify-center xl:justify-start">
              <div className="w-[50px] h-[50px] rounded-full bg-[#F5F3FF] flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-[#7C3AED]" />
              </div>
              <div>
                <h4 className="font-bold text-[#081A3A] text-[16px]">Trusted by Thousands</h4>
                <p className="text-[#52627A] text-[14px]">Individuals and businesses</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 13. INSURANCE SOLUTIONS SECTION */}
      <section className="w-full bg-[#F8FBFF] pt-[70px] pb-[100px]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[32px] md:text-[36px] font-[800] text-[#071A3D] mb-3">Our Insurance Solutions</h2>
            <p className="text-[16px] md:text-[18px] text-[#52627A]">Comprehensive insurance solutions for individuals and businesses.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 xl:gap-5">
            {/* 1. Motor */}
            <div className="group bg-white border border-[#E4ECF7] rounded-[12px] p-6 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:-translate-y-[4px] transition-all duration-200 ease-in-out flex flex-col items-center">
              <div className="w-[56px] h-[56px] rounded-full bg-[#EAF4FF] flex items-center justify-center mb-5">
                <Car className="w-7 h-7 text-[#0866FF]" />
              </div>
              <h3 className="font-bold text-[#081A3A] text-[18px] mb-2">Motor Insurance</h3>
              <p className="text-[#52627A] text-[14px] leading-[1.6] mb-5 flex-grow">Protection for you and your vehicle.</p>
              <Link to="/products" className="text-[#0866FF] font-semibold text-[14px] flex items-center gap-1 group-hover:text-[#064bbb] transition-colors mt-auto">
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 2. Home */}
            <div className="group bg-white border border-[#E4ECF7] rounded-[12px] p-6 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:-translate-y-[4px] transition-all duration-200 ease-in-out flex flex-col items-center">
              <div className="w-[56px] h-[56px] rounded-full bg-[#FFF7ED] flex items-center justify-center mb-5">
                <House className="w-7 h-7 text-[#FF8A1F]" />
              </div>
              <h3 className="font-bold text-[#081A3A] text-[18px] mb-2">Home Insurance</h3>
              <p className="text-[#52627A] text-[14px] leading-[1.6] mb-5 flex-grow">Keep your home and belongings safe.</p>
              <Link to="/products" className="text-[#0866FF] font-semibold text-[14px] flex items-center gap-1 group-hover:text-[#064bbb] transition-colors mt-auto">
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 3. Health */}
            <div className="group bg-white border border-[#E4ECF7] rounded-[12px] p-6 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:-translate-y-[4px] transition-all duration-200 ease-in-out flex flex-col items-center">
              <div className="w-[56px] h-[56px] rounded-full bg-[#FEF2F2] flex items-center justify-center mb-5">
                <HeartPulse className="w-7 h-7 text-[#EF4444]" />
              </div>
              <h3 className="font-bold text-[#081A3A] text-[18px] mb-2">Health Insurance</h3>
              <p className="text-[#52627A] text-[14px] leading-[1.6] mb-5 flex-grow">Better health for a brighter tomorrow.</p>
              <Link to="/products" className="text-[#0866FF] font-semibold text-[14px] flex items-center gap-1 group-hover:text-[#064bbb] transition-colors mt-auto">
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 4. Life */}
            <div className="group bg-white border border-[#E4ECF7] rounded-[12px] p-6 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:-translate-y-[4px] transition-all duration-200 ease-in-out flex flex-col items-center">
              <div className="w-[56px] h-[56px] rounded-full bg-[#F5F3FF] flex items-center justify-center mb-5">
                <Users className="w-7 h-7 text-[#7C3AED]" />
              </div>
              <h3 className="font-bold text-[#081A3A] text-[18px] mb-2">Life Insurance</h3>
              <p className="text-[#52627A] text-[14px] leading-[1.6] mb-5 flex-grow">Financial security for your loved ones.</p>
              <Link to="/products" className="text-[#0866FF] font-semibold text-[14px] flex items-center gap-1 group-hover:text-[#064bbb] transition-colors mt-auto">
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 5. Travel */}
            <div className="group bg-white border border-[#E4ECF7] rounded-[12px] p-6 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:-translate-y-[4px] transition-all duration-200 ease-in-out flex flex-col items-center">
              <div className="w-[56px] h-[56px] rounded-full bg-[#EAF4FF] flex items-center justify-center mb-5">
                <Plane className="w-7 h-7 text-[#0866FF]" />
              </div>
              <h3 className="font-bold text-[#081A3A] text-[18px] mb-2">Travel Insurance</h3>
              <p className="text-[#52627A] text-[14px] leading-[1.6] mb-5 flex-grow">Travel with confidence anywhere in the world.</p>
              <Link to="/products" className="text-[#0866FF] font-semibold text-[14px] flex items-center gap-1 group-hover:text-[#064bbb] transition-colors mt-auto">
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 6. Business */}
            <div className="group bg-white border border-[#E4ECF7] rounded-[12px] p-6 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:-translate-y-[4px] transition-all duration-200 ease-in-out flex flex-col items-center">
              <div className="w-[56px] h-[56px] rounded-full bg-[#ECFDF5] flex items-center justify-center mb-5">
                <BriefcaseBusiness className="w-7 h-7 text-[#10A66A]" />
              </div>
              <h3 className="font-bold text-[#081A3A] text-[18px] mb-2">Business Insurance</h3>
              <p className="text-[#52627A] text-[14px] leading-[1.6] mb-5 flex-grow">Flexible protection for your business.</p>
              <Link to="/products" className="text-[#0866FF] font-semibold text-[14px] flex items-center gap-1 group-hover:text-[#064bbb] transition-colors mt-auto">
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
