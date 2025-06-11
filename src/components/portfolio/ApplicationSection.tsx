import React from 'react';

const ApplicationSection: React.FC = () => {
  return (
    <section id="apply" className="application-section py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <header className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl mb-4">Apply to Work Together</h2>
          <p className="font-body text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Begin the conversation about your wedding photography experience.
            <br />All inquiries receive a response within 24 hours.
          </p>
        </header>
        
        <div className="max-w-4xl mx-auto">
          <form className="bg-white dark:bg-gray-900 shadow-xl p-8 md:p-12 rounded-sm">
            {/* Sophisticated form with qualifying questions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <label htmlFor="name" className="block font-display text-sm mb-2">Your Name*</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 bg-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="partnerName" className="block font-display text-sm mb-2">Partner's Name*</label>
                <input 
                  type="text" 
                  id="partnerName" 
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 bg-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block font-display text-sm mb-2">Email Address*</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 bg-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block font-display text-sm mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 bg-transparent"
                />
              </div>
            </div>
            
            <div className="mb-8">
              <label htmlFor="weddingDate" className="block font-display text-sm mb-2">Wedding Date*</label>
              <input 
                type="date" 
                id="weddingDate" 
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 bg-transparent"
                required
              />
            </div>
            
            <div className="mb-8">
              <label htmlFor="venue" className="block font-display text-sm mb-2">Wedding Venue & Location*</label>
              <input 
                type="text" 
                id="venue" 
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 bg-transparent"
                placeholder="Venue Name, City, Country"
                required
              />
            </div>
            
            <div className="mb-8">
              <label className="block font-display text-sm mb-2">Which experience are you interested in?*</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="editorialExperience" 
                    name="experience" 
                    className="mr-2"
                    required
                  />
                  <label htmlFor="editorialExperience" className="font-body">The Editorial Experience</label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="destinationExperience" 
                    name="experience" 
                    className="mr-2"
                  />
                  <label htmlFor="destinationExperience" className="font-body">The Destination Experience</label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="intimateExperience" 
                    name="experience" 
                    className="mr-2"
                  />
                  <label htmlFor="intimateExperience" className="font-body">The Intimate Experience</label>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <label htmlFor="guestCount" className="block font-display text-sm mb-2">Approximate Guest Count*</label>
              <select 
                id="guestCount" 
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 bg-transparent"
                required
              >
                <option value="">Select an option</option>
                <option value="intimate">Intimate (1-50 guests)</option>
                <option value="medium">Medium (51-150 guests)</option>
                <option value="large">Large (151-250 guests)</option>
                <option value="grand">Grand (251+ guests)</option>
              </select>
            </div>
            
            <div className="mb-8">
              <label htmlFor="vision" className="block font-display text-sm mb-2">Share your vision for your wedding day*</label>
              <textarea 
                id="vision" 
                rows={5} 
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 bg-transparent"
                placeholder="Tell me about the atmosphere, aesthetic, and emotional elements you envision for your celebration..."
                required
              ></textarea>
            </div>
            
            <div className="mb-8">
              <label htmlFor="discovery" className="block font-display text-sm mb-2">How did you discover my work?</label>
              <select 
                id="discovery" 
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 bg-transparent"
              >
                <option value="">Select an option</option>
                <option value="planner">Wedding Planner Recommendation</option>
                <option value="venue">Venue Recommendation</option>
                <option value="past-client">Past Client</option>
                <option value="instagram">Instagram</option>
                <option value="pinterest">Pinterest</option>
                <option value="publication">Wedding Publication</option>
                <option value="search">Online Search</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="text-center">
              <button 
                type="submit" 
                className="inline-block bg-black dark:bg-white text-white dark:text-black px-10 py-4 font-display text-lg tracking-wider transition-all duration-300 hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                Submit Application
              </button>
              
              <p className="mt-4 font-body text-sm text-gray-500 dark:text-gray-400">
                Alternatively, schedule a video consultation directly via <a href="#" className="underline">Calendly</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ApplicationSection;
