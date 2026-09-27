import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, HeartHandshake, FileText, ShieldCheck, Users, Compass } from 'lucide-react';

const About = () => (
  <div className="bg-white text-[#071A3D]">
    <section className="bg-[#F6FAFF] border-b border-[#D8E4F2]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 lg:py-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <p className="text-sm font-bold tracking-widest uppercase text-[#0866FF] mb-5">About Insurance Pro Plus</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">Protection starts with <span className="text-[#0866FF]">understanding.</span></h1>
          <p className="text-lg leading-relaxed text-[#52627A] mb-8">Insurance can feel complicated. Our purpose is simple: help individuals, families and businesses explore their options and keep their insurance information in one place.</p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-[#0866FF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Explore Insurance <ArrowRight className="w-4 h-4" aria-hidden="true" /></Link>
        </div>
        <figure className="overflow-hidden rounded-3xl bg-white border border-[#D8E4F2] shadow-sm">
          <img src="/images/happy-family.jpg" alt="Family spending time together" className="w-full h-72 sm:h-96 object-cover object-center" />
          <figcaption className="px-6 py-5 flex items-center gap-4">
            <ShieldCheck className="h-9 w-9 text-[#0866FF] shrink-0" aria-hidden="true" />
            <div><p className="font-bold">For the people and plans that matter.</p><p className="text-sm text-[#52627A] mt-1">Personal and business insurance, made easier to navigate.</p></div>
          </figcaption>
        </figure>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-6 sm:px-10 py-14 lg:py-20" aria-labelledby="mission-title">
      <div className="grid lg:grid-cols-3 gap-8 lg:gap-16">
        <div><p className="text-sm font-bold uppercase tracking-widest text-[#0866FF] mb-3">Our purpose</p><h2 id="mission-title" className="text-3xl font-bold tracking-tight">Make insurance easier to understand.</h2></div>
        <div className="lg:col-span-2 text-[#52627A] text-lg leading-relaxed space-y-4">
          <p>Whether you are thinking about your family's future or the next chapter of your business, understanding your protection is an important part of planning ahead.</p>
          <p>Insurance Pro Plus brings insurance categories, policy information and claim tracking into a clear digital experience. We aim to give you a practical starting point, with guidance and support when you need to take the next step.</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-6 mt-12">
        {[
          { icon: Compass, title: 'Clarity first', text: 'Straightforward information to help you explore cover and ask informed questions.' },
          { icon: FileText, title: 'Less complexity', text: 'A single place to view policy details and follow the progress of a claim.' },
          { icon: HeartHandshake, title: 'People at the centre', text: 'An experience designed around the needs of individuals and business owners.' },
        ].map(({ icon: Icon, title, text }) => (
          <article key={title} className="rounded-2xl border border-[#D8E4F2] p-6 sm:p-7 bg-[#F8FBFF]">
            <Icon className="h-7 w-7 text-[#0866FF] mb-5" aria-hidden="true" /><h3 className="font-bold text-xl mb-3">{title}</h3><p className="text-[#52627A] leading-relaxed">{text}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="bg-[#F6FAFF] py-14 lg:py-20" aria-labelledby="audience-title">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <h2 id="audience-title" className="text-3xl font-bold tracking-tight mb-3">Built around your world.</h2>
        <p className="text-[#52627A] text-lg mb-8">Different priorities. One place to get started.</p>
        <div className="grid md:grid-cols-2 gap-6">
          <article className="rounded-2xl border border-[#D8E4F2] bg-white p-7 sm:p-9"><Users className="h-8 w-8 text-[#0866FF] mb-5" aria-hidden="true" /><h3 className="text-2xl font-bold mb-3">Individuals & families</h3><p className="text-[#52627A] leading-relaxed">Explore insurance for your health, home, vehicle and life. Keep the needs of your household at the centre of your planning.</p></article>
          <article className="rounded-2xl border border-[#D8E4F2] bg-white p-7 sm:p-9"><Building2 className="h-8 w-8 text-[#0866FF] mb-5" aria-hidden="true" /><h3 className="text-2xl font-bold mb-3">Businesses & teams</h3><p className="text-[#52627A] leading-relaxed">Explore protection for your property, vehicles and employees. Organize your insurance as your business grows and changes.</p></article>
        </div>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-6 sm:px-10 py-14 lg:py-20">
      <div className="rounded-3xl bg-[#0F2747] text-white p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="max-w-xl"><h2 className="text-3xl font-bold mb-3">Let's make your next step clearer.</h2><p className="text-blue-100 leading-relaxed">Explore our insurance categories or visit the support centre for help finding your way.</p></div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0"><Link to="/products" className="text-center px-5 py-3 rounded-lg bg-white text-[#0F2747] font-semibold hover:bg-blue-50">View Insurance</Link><Link to="/support" className="text-center px-5 py-3 rounded-lg border border-blue-200 text-white font-semibold hover:bg-white/10">Contact Support</Link></div>
      </div>
    </section>
  </div>
);

export default About;
