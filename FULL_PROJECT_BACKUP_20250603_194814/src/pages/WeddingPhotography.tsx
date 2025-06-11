import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import BeforeAfterSlider from '../components/wedding/BeforeAfterSlider';
import WeddingTimeline from '../components/wedding/WeddingTimeline';
import WeddingStyleQuiz from '../components/wedding/WeddingStyleQuiz';
import WeddingBookingSystem from '../components/wedding/WeddingBookingSystem';


import './WeddingPhotography.css';

const WeddingPhotography: React.FC = () => {
  return (
    <div className="wedding-photography-page">
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center">
        {/* Hero Background with ManagedImage */}
        <div className="absolute inset-0 z-0">
          <img
            src="/MoStuff/Portfolio/crystadavid/cd14.jpg"
            alt="Wedding Photography Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-[800px] px-5">
          <h1 className="text-5xl md:text-6xl font-serif mb-4">Wedding Photography</h1>
          <p className="text-xl mb-8">Capturing timeless moments on your special day</p>
          <button className="bg-white text-black px-8 py-3 font-medium hover:bg-gray-100 transition-colors">
            Check Availability
          </button>
        </div>
      </section>

      <section className="intro-section">
        <div className="container">
          <h2>Your Love Story, Beautifully Told</h2>
          <p>
            I believe your wedding photos should be as unique as your love story. My approach combines 
            artistic vision with genuine emotion to create images that will transport you back to every 
            special moment of your wedding day for years to come.
          </p>
          <div className="approach-highlights">
            <div className="highlight-item">
              <h3>Unobtrusive</h3>
              <p>I blend into the background, capturing authentic moments without interrupting them.</p>
            </div>
            <div className="highlight-item">
              <h3>Emotional</h3>
              <p>I focus on the real feelings and connections that make your day meaningful.</p>
            </div>
            <div className="highlight-item">
              <h3>Artistic</h3>
              <p>Every image is thoughtfully composed and beautifully edited to stand the test of time.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="before-after-section">
        <div className="container">
          <h2>The Art of Wedding Editing</h2>
          <p>See how professional editing transforms your wedding photos into timeless works of art</p>
          
          <div className="before-after-examples">
            <BeforeAfterSlider 
              beforeImage="/images/wedding/before-1.jpg" 
              afterImage="/images/wedding/after-1.jpg" 
              beforeAlt="Raw wedding photo" 
              afterAlt="Professionally edited wedding photo" 
            />
            
            <div className="editing-description">
              <h3>Professional Editing Makes the Difference</h3>
              <p>
                Every image from your wedding receives meticulous attention to enhance colors, 
                perfect skin tones, and create the signature look that makes your photos uniquely yours. 
                Move the slider to see the transformation.
              </p>
              <ul className="editing-features">
                <li>Natural skin tone enhancement</li>
                <li>Mood-setting color grading</li>
                <li>Subtle retouching for a timeless look</li>
                <li>Consistent style across your entire gallery</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="timeline-section">
        <WeddingTimeline />
      </section>

      <section className="quiz-section">
        <WeddingStyleQuiz />
      </section>

      <section className="booking-section py-24 bg-gray-50" id="availability">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl mb-4">Ready to Book Your Wedding?</h2>
              <div className="w-16 h-px bg-black mx-auto mb-4"></div>
              <p className="text-gray-600 max-w-2xl mx-auto mb-10">
                Begin your journey with Hariel Xavier Photography by scheduling a consultation today
              </p>
              <a 
                href="https://calendly.com/harielxavierphotography/hariel-xavier-photography-meeting" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-black text-white px-12 py-4 hover:bg-gray-800 transition-all duration-300 tracking-wider uppercase text-sm hover:shadow-lg hover:translate-y-[-2px] inline-block"
              >
                Book a Consultation
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="booking-section">
        <WeddingBookingSystem />
      </section>

      <section className="testimonials-section">
        <div className="container">
          <h2>What Couples Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="couple-image">
                <img 
                  src="/MoStuff/Portfolio/crystadavid/cd2.jpg" 
                  alt="Sarah & Michael - Happy wedding couple" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <blockquote>
                "Our wedding photos are absolutely stunning. They captured not just how the day looked, but how it felt. Every time we look at them, we're transported back to those precious moments."
              </blockquote>
              <div className="couple-name">— Sarah & Michael</div>
            </div>
            <div className="testimonial-card">
              <div className="couple-image">
                <img 
                  src="/MoStuff/Portfolio/crystadavid/cd5.jpg" 
                  alt="Emma & James - Happy wedding couple" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <blockquote>
                "Working with such a talented photographer made our wedding day so much more relaxed. They were practically invisible during the ceremony but somehow captured every meaningful glance and tear."
              </blockquote>
              <div className="couple-name">— Emma & James</div>
            </div>
            <div className="testimonial-card">
              <div className="couple-image">
                <img 
                  src="/MoStuff/Portfolio/crystadavid/cd7.jpg" 
                  alt="Jessica & David - Happy wedding couple" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <blockquote>
                "From our first meeting to receiving our final album, the entire experience exceeded our expectations. Our photos are works of art that we'll cherish forever."
              </blockquote>
              <div className="couple-name">— Jessica & David</div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How far in advance should I book?</h3>
              <p>For peak wedding season (May-October), I recommend booking 12-18 months in advance. For off-season weddings, 6-12 months is usually sufficient.</p>
            </div>
            <div className="faq-item">
              <h3>How many photos will we receive?</h3>
              <p>For a typical 8-hour wedding, you can expect to receive 500-700 professionally edited images, depending on your events and guest count.</p>
            </div>
            <div className="faq-item">
              <h3>Do you bring backup equipment?</h3>
              <p>Absolutely! I bring multiple professional cameras, lenses, and lighting equipment to ensure I'm prepared for any situation.</p>
            </div>
            <div className="faq-item">
              <h3>When will we receive our photos?</h3>
              <p>You'll receive a sneak peek within 1 week of your wedding, and your full gallery will be delivered within 4-6 weeks.</p>
            </div>
            <div className="faq-item">
              <h3>Do you offer engagement sessions?</h3>
              <p>Yes! All wedding packages include a complimentary engagement session, which is a great way for us to work together before the big day.</p>
            </div>
            <div className="faq-item">
              <h3>What happens if you get sick on our wedding day?</h3>
              <p>I have a network of professional photographers with similar styles who can step in if there's an emergency. Your wedding will be covered no matter what.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Weddings Section */}
      <section className="featured-weddings-section py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif mb-4 text-center">Featured Weddings</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12 text-center">
            Browse through some of my recent wedding photography work at beautiful venues across New Jersey
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Crysta & David at Skylands Manor */}
            <div className="group relative overflow-hidden transition-all duration-500 rounded-lg shadow-lg">
              <div className="relative h-80 w-full overflow-hidden">
                <img 
                  src="/MoStuff/Portfolio/crystadavid/cd14.jpg" 
                  alt="Crysta & David's Wedding at Skylands Manor"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-500 group-hover:translate-y-0 translate-y-2">
                <h3 className="text-2xl font-serif mb-2">Crysta & David</h3>
                <div className="flex items-center text-white/80 mb-2">
                  <span className="mr-4">Skylands Manor</span>
                </div>
                <div className="flex items-center text-white/70 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>Ringwood, NJ</span>
                </div>
                <Link 
                  to="/crysta-david"
                  className="inline-flex items-center text-white border-b border-white pb-1 hover:text-rose-200 hover:border-rose-200 transition-colors"
                >
                  View Gallery
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
            
            {/* Bianca & Jeffrey */}
            <div className="group relative overflow-hidden transition-all duration-500 rounded-lg shadow-lg">
              <div className="relative h-80 w-full overflow-hidden">
                <img 
                  src="/MoStuff/Featured Wedding/Bianca & Jeffrey's Wedding/The Ceremony/Bianca & Jeff_s Wedding-826.jpg" 
                  alt="Bianca & Jeffrey's Wedding at Park Chateau"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-500 group-hover:translate-y-0 translate-y-2">
                <h3 className="text-2xl font-serif mb-2">Bianca & Jeffrey</h3>
                <div className="flex items-center text-white/80 mb-2">
                  <span className="mr-4">Park Chateau Estate</span>
                </div>
                <div className="flex items-center text-white/70 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>East Brunswick, NJ</span>
                </div>
                <Link 
                  to="/bianca-jeffrey"
                  className="inline-flex items-center text-white border-b border-white pb-1 hover:text-rose-200 hover:border-rose-200 transition-colors"
                >
                  View Gallery
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
            
            {/* Jackie & Chris */}
            <div className="group relative overflow-hidden transition-all duration-500 rounded-lg shadow-lg">
              <div className="relative h-80 w-full overflow-hidden">
                <img 
                  src="/MoStuff/Featured Wedding/Jackie & Chriss Wedding /jmt (44 of 61).jpg" 
                  alt="Jackie & Chris's Wedding at The Inn at Millrace Pond"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-500 group-hover:translate-y-0 translate-y-2">
                <h3 className="text-2xl font-serif mb-2">Jackie & Chris</h3>
                <div className="flex items-center text-white/80 mb-2">
                  <span className="mr-4">The Inn at Millrace Pond</span>
                </div>
                <div className="flex items-center text-white/70 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>Hope, NJ</span>
                </div>
                <Link 
                  to="/jackie-chris"
                  className="inline-flex items-center text-white border-b border-white pb-1 hover:text-rose-200 hover:border-rose-200 transition-colors"
                >
                  View Gallery
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/showcase"
              className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-3 hover:bg-gray-900 transition-all duration-300 group rounded"
            >
              View All Wedding Galleries
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
      
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Capture Your Wedding Day?</h2>
          <p>Let's create beautiful memories together</p>
          <div className="cta-buttons">
            <a href="#availability" className="primary-button">Check My Availability</a>
            <button className="secondary-button">View Wedding Portfolio</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WeddingPhotography;
