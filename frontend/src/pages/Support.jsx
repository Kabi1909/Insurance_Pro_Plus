import React from 'react';
import { MessageSquare, Mail, Phone, LifeBuoy } from 'lucide-react';

const Support = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-textMain mb-4">How Can We Help?</h1>
        <p className="text-textSecondary max-w-2xl mx-auto">Our dedicated support team is here to assist you with any questions or issues you may have.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        {[
          { icon: MessageSquare, title: 'Live Chat', desc: 'Available 24/7' },
          { icon: Mail, title: 'Email Support', desc: 'support@insuranceproplus.demo' },
          { icon: Phone, title: 'Call Us', desc: '+1 800 555 0123' },
          { icon: LifeBuoy, title: 'Help Center', desc: 'Browse our guides' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-borderMain shadow-sm text-center flex flex-col items-center">
            <div className="h-12 w-12 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-4">
              <item.icon className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-textMain mb-2">{item.title}</h3>
            <p className="text-sm text-textSecondary">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl border border-borderMain shadow-sm">
        <h2 className="text-2xl font-bold text-textMain mb-6 text-center">Send Us a Message</h2>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-textMain mb-1">Name</label>
              <input required type="text" className="w-full border border-borderMain rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-textMain mb-1">Email</label>
              <input required type="email" className="w-full border border-borderMain rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-textMain mb-1">Subject</label>
            <input required type="text" className="w-full border border-borderMain rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-textMain mb-1">Message</label>
            <textarea required rows="5" className="w-full border border-borderMain rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"></textarea>
          </div>
          <button type="submit" className="w-full bg-primary text-white py-3 rounded-md font-medium hover:bg-primary-dark transition-colors">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Support;
