import React from 'react';
import { Helmet } from 'react-helmet-async';
import EnhancedContactForm from '../components/landing/EnhancedContactForm';
import { Link } from 'react-router-dom';

const ContactPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Contact Hariel Xavier Photography | Wedding Photographer Sussex County NJ</title>
        <meta name="description" content="Contact Hariel Xavier Photography for your wedding photography needs in Sussex County, NJ. Professional wedding photographer serving New Jersey and surrounding areas. Call (862) 355-3502 or email Hi@HarielXavier.com." />
        <meta name="keywords" content="contact wedding photographer, Sussex County NJ photographer, Hariel Xavier Photography contact, wedding photography inquiry, New Jersey wedding photographer" />
        <link rel="canonical" href="https://harielxavier.com/contact" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Contact Hariel Xavier Photography | Wedding Photographer Sussex County NJ" />
        <meta property="og:description" content="Contact Hariel Xavier Photography for your wedding photography needs in Sussex County, NJ. Professional wedding photographer serving New Jersey and surrounding areas." />
        <meta property="og:url" content="https://harielxavier.com/contact" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Contact Hariel Xavier Photography | Wedding Photographer Sussex County NJ" />
        <meta name="twitter:description" content="Contact Hariel Xavier Photography for your wedding photography needs in Sussex County, NJ. Professional wedding photographer serving New Jersey and surrounding areas." />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact Hariel Xavier Photography",
            "description": "Contact information for Hariel Xavier Photography, professional wedding photographer in Sussex County, New Jersey",
            "url": "https://harielxavier.com/contact",
            "mainEntity": {
              "@type": "LocalBusiness",
              "name": "Hariel Xavier Photography",
              "image": "https://harielxavier.com/black.png",
              "telephone": "+1-862-355-3502",
              "email": "Hi@HarielXavier.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Sussex County",
                "@addressRegion": "NJ",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "41.1",
                "longitude": "-74.7"
              },
              "openingHours": [
                "Mo-Fr 09:00-18:00",
                "Sa 10:00-16:00",
                "Su by appointment"
              ],
              "serviceArea": {
                "@type": "State",
                "name": "New Jersey"
              }
            }
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-black to-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="https://res.cloudinary.com/dos0qac90/image/upload/v1761593379/hariel-xavier-photography/MoStuff/black.png"
                alt="Hariel Xavier Photography"
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-4xl font-light">Contact Hariel Xavier Photography</h1>
                <nav className="mt-2">
                  <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link> 
                  <span className="mx-2 text-gray-400">›</span> 
                  <span className="text-white">Contact</span>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Enhanced Contact Form */}
        <EnhancedContactForm />

        {/* Contact Information Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-light text-gray-800 mb-4">Get in Touch</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  We're excited to hear from you! Whether you have questions about our services, pricing, or availability, 
                  we're here to help make your photography dreams come true.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-8 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Location</h3>
                  <p className="text-gray-600">Sussex County, NJ</p>
                  <p className="text-sm text-gray-500 mt-2">Serving all of New Jersey and surrounding areas</p>
                </div>

                <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Email</h3>
                  <a href="mailto:Hi@HarielXavier.com" className="text-blue-600 hover:text-blue-800 transition-colors font-medium">
                    Hi@HarielXavier.com
                  </a>
                  <p className="text-sm text-gray-500 mt-2">We respond within 24 hours</p>
                </div>

                <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Phone</h3>
                  <a href="tel:+18623553502" className="text-green-600 hover:text-green-800 transition-colors font-medium">
                    (862) 355-3502
                  </a>
                  <p className="text-sm text-gray-500 mt-2">Voice calls only (no text)</p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="mt-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-light text-gray-800 mb-6 text-center">Business Hours</h3>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Monday - Friday</h4>
                    <p className="text-gray-600">9:00 AM - 6:00 PM</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Saturday</h4>
                    <p className="text-gray-600">10:00 AM - 4:00 PM</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Sunday</h4>
                    <p className="text-gray-600">By Appointment Only</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gradient-to-r from-black to-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">&copy; {new Date().getFullYear()} Hariel Xavier Photography. All rights reserved.</p>
          <p className="text-gray-400 text-sm mt-2">Capturing timeless love stories across New Jersey</p>
        </div>
      </footer>
      </div>
    </>
  );
};

export default ContactPage;
