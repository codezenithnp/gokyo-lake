'use client';
import { useState } from 'react';
import { FiPhone, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp, FaFacebook } from 'react-icons/fa';

const ContactUsPage = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailTo = "info@hotelgokyolake.com";
    const subject = `Contact Inquiry from ${fullName}`;
    const body = `Name: ${fullName}\nPhone: ${phone}\n\nMessage:\n${message}`;
    window.location.href = `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="bg-[#f6f6f6]">
      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Contact Information Card */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
            <div className="space-y-4 text-gray-800">
              <div className="flex items-start">
                <FiMapPin className="text-yellow-600 mt-1 mr-4 shrink-0" size={20} />
                <span>Pokhara Lakeside, Street No. 5, Pokhara, Nepal</span>
              </div>
              <div className="flex items-center">
                <FiPhone className="text-yellow-600 mr-4 shrink-0" size={20} />
                <span>+977 9841598973, +977 9851198973, 061-453471</span>
              </div>
              <div className="flex items-center">
                <FaWhatsapp className="text-green-500 mr-4 shrink-0" size={20} />
                <span>+977 9841598973</span>
              </div>
              <div className="flex items-center">
                <FaFacebook className="text-blue-600 mr-4 shrink-0" size={20} />
                <a href="https://www.facebook.com/hotelgokyolake" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  facebook.com/hotelgokyolake
                </a>
              </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <a href="tel:+9779841598973" className="text-center bg-yellow-500 text-black px-6 py-3 font-bold rounded-lg hover:bg-yellow-600 transition-colors">
                Call Now
              </a>
              <a href="https://wa.me/9779841598973" target="_blank" rel="noopener noreferrer" className="text-center bg-green-500 text-white px-6 py-3 font-bold rounded-lg hover:bg-green-600 transition-colors">
                WhatsApp
              </a>
              <a href="https://www.facebook.com/hotelgokyolake" target="_blank" rel="noopener noreferrer" className="text-center border-2 border-blue-600 text-blue-600 px-6 py-3 font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                Facebook Page
              </a>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="space-y-4">
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Full Name" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required 
                />
                <input 
                  type="tel" 
                  name="phone" 
                  placeholder="Phone" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <textarea 
                  name="message" 
                  placeholder="Message" 
                  rows={5} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="text-center mt-6">
                <button type="submit" className="bg-blue-800 text-white px-10 py-3 font-bold rounded-lg hover:bg-blue-900 transition-colors text-lg">
                  Submit
                </button>
                <p className="text-xs text-gray-600 mt-3">This opens your email app (no online submission).</p>
              </div>
            </form>
          </div>
        </div>

        {/* Google Map Card */}
        <div className="bg-white p-6 rounded-xl shadow-md">
           <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Find us on Map</h2>
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3515.828969138635!2d83.9519195751318!3d28.21280317589818!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3995951344565239%3A0x35c3313a1ed02a9f!2sHotel%20Gokyo%20Lake!5e0!3m2!1sen!2snp!4v1721213833353!5m2!1sen!2snp"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;


