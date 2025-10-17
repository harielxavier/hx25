import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import SEO from '../components/SEO';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQPage: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const faqs: FAQItem[] = [
    {
      id: 'luxury-investment',
      question: 'What investment level should couples expect for luxury wedding photography?',
      answer: 'Our curated collections begin at $2,295 for intimate celebrations and ascend to $5,495 for our flagship Skylands Signature experience. Each tier represents exceptional value through meticulously crafted deliverables, including museum-quality prints, heirloom albums, and lifetime gallery hosting. We believe your wedding day deserves nothing less than extraordinary documentation.'
    },
    {
      id: 'service-excellence',
      question: 'What distinguishes your approach to wedding photography?',
      answer: 'We operate as visual storytellers, not merely photographers. Our methodology combines artistic vision with technical mastery, ensuring every moment is captured with intention and artistry. From pre-wedding consultations to post-production refinement, we provide a white-glove experience that exceeds expectations and creates lasting legacies.'
    },
    {
      id: 'creative-collaboration',
      question: 'How do you approach the creative process with couples?',
      answer: 'Our process begins with an intimate consultation where we explore your vision, aesthetic preferences, and personal narrative. This collaborative foundation allows us to craft a bespoke photography experience that authentically represents your unique love story. Every image we create is infused with intention and meaning.'
    },
    {
      id: 'operational-excellence',
      question: 'What level of coordination and planning do you provide?',
      answer: 'We function as an extension of your planning team, providing comprehensive timeline development, vendor coordination, and day-of orchestration. Our expertise ensures seamless execution while allowing you to remain fully present in your celebration. We anticipate needs before they arise and adapt gracefully to any situation.'
    },
    {
      id: 'delivery-excellence',
      question: 'How do you ensure exceptional image delivery and presentation?',
      answer: 'Our post-production process is an art form in itself. Each image undergoes meticulous curation and enhancement before presentation. Preview selections arrive within 48 hours, while your complete collection is delivered within 4-6 weeks through our premium gallery platform. We also offer expedited processing for time-sensitive needs.'
    },
    {
      id: 'reliability-assurance',
      question: 'What safeguards ensure our wedding day is protected?',
      answer: 'Our commitment to reliability is absolute. We maintain redundant systems, professional networks, and comprehensive contingency protocols. While we have never missed a celebration, our backup infrastructure ensures complete peace of mind. Your once-in-a-lifetime moment deserves unwavering dedication and professional excellence.'
    },
    {
      id: 'venue-mastery',
      question: 'How does your venue expertise enhance our photography experience?',
      answer: 'Our intimate knowledge of Sussex County\'s premier venues—from Picatinny Club\'s grandeur to Perona Farms\' rustic elegance—allows us to maximize every location\'s photographic potential. We understand lighting nuances, optimal timing, and hidden gems that create truly exceptional imagery. This expertise translates directly into superior results for your celebration.'
    }
  ];

  return (
    <>
      <SEO
        title="Wedding Photography FAQ Sparta NJ | Sussex County Wedding Photographer"
        description="Get answers to common questions about wedding photography costs, packages, and services in Sparta, NJ and Sussex County. Expert wedding photographer FAQs."
        keywords="wedding photography FAQ Sparta NJ, wedding photographer cost Sussex County, Picatinny Club wedding photography, engagement photography Sparta NJ, wedding timeline planning"
        type="website"
      />
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-gray-800 to-black text-white pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4">
            Luxury Wedding Photography Excellence
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Sophisticated answers for discerning couples seeking extraordinary documentation of their most precious moments
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white border border-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-6 py-5 text-left flex justify-between items-start hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200"
                >
                  <h3 className="font-serif text-lg text-gray-900 pr-6 leading-relaxed font-medium">
                    {faq.question}
                  </h3>
                  {openItems.has(faq.id) ? (
                    <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
                  )}
                </button>
                {openItems.has(faq.id) && (
                  <div className="px-6 pb-6">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-gray-700 leading-relaxed font-light">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 text-white">
            <h2 className="font-serif text-3xl mb-4 text-white">
              Begin Your Extraordinary Journey
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
              Let us craft a bespoke photography experience that captures the essence of your love story with unparalleled artistry and sophistication.
            </p>
            <a
              href="https://calendly.com/harielxavierphotography/hariel-xavier-photography-meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-accent to-rose-dark text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:from-rose-dark hover:to-accent transform hover:-translate-y-1"
            >
              Schedule Private Consultation
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default FAQPage;
