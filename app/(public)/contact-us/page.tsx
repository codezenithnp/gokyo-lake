import { FiPhone, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const ContactUsPage = () => {
  const emailAddress = "info@hotelgokyolake.com"; // Replace with a real email if available

  return (
    <div>
      {/* Top Blue Block */}
      <div className="bg-blue-900 py-24 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-widest">
            CONTACT-US
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-5xl">
          
          {/* Contact Information Card */}
          <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg mb-16">
            <h2 className="text-3xl font-serif font-bold text-center mb-8">Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-8 text-lg text-gray-700">
              <div className="space-y-4">
                <div className="flex items-start">
                  <FiMapPin className="text-yellow-600 mt-1 mr-4 flex-shrink-0" size={20} />
                  <span>Pokhara Lakeside, Street No. 5, Pokhara, Nepal</span>
                </div>
                <div className="flex items-center">
                  <FiPhone className="text-yellow-600 mr-4 flex-shrink-0" size={20} />
                  <span>+977 9841598973, +977 9851198973, 061-453471</span>
                </div>
                <div className="flex items-center">
                  <FaWhatsapp className="text-yellow-600 mr-4 flex-shrink-0" size={20} />
                  <span>+977 9841598973</span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4 pt-8 md:pt-0">
                <a href="tel:+9779841598973" className="w-full max-w-xs text-center bg-yellow-500 text-black px-8 py-3 font-bold hover:bg-yellow-400 rounded-full transition-transform transform hover:scale-105">
                  Call Now
                </a>
                <a href="https://wa.me/9779841598973" target="_blank" rel="noopener noreferrer" className="w-full max-w-xs text-center bg-green-500 text-white px-8 py-3 font-bold hover:bg-green-400 rounded-full transition-transform transform hover:scale-105">
                  WhatsApp
                </a>
                <a href="https://www.facebook.com/hotelgokyolake" target="_blank" rel="noopener noreferrer" className="w-full max-w-xs text-center bg-blue-600 text-white px-8 py-3 font-bold hover:bg-blue-500 rounded-full transition-transform transform hover:scale-105">
                  Facebook Page
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg mb-16">
            <h2 className="text-3xl font-serif font-bold text-center mb-8">Send us a Message</h2>
            <form action={`mailto:${emailAddress}`} method="post" encType="text/plain">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <input type="text" name="name" placeholder="Full Name" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
                <input type="tel" name="phone" placeholder="Phone" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500" />
              </div>
              <div className="mb-6">
                <textarea name="message" placeholder="Message" rows={6} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500" required></textarea>
              </div>
              <div className="text-center">
                <button type="submit" className="bg-yellow-500 text-black px-10 py-3 font-bold hover:bg-yellow-400 rounded-full text-lg">
                  Send
                </button>
                <p className="text-xs text-gray-500 mt-4">This form opens your email app (no online submission).</p>
              </div>
            </form>
          </div>

          {/* Google Map */}
          <div className="bg-white p-4 rounded-lg shadow-lg">
             <h2 className="text-3xl font-serif font-bold text-center mb-8">Our Location</h2>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              {/* Replace this with your actual Google Maps embed iframe */}
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
    </div>
  );
};

export default ContactUsPage;


