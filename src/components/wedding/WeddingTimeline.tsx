import React from 'react';
import { FaHeart, FaCamera, FaCalendarAlt, FaComments, FaPhotoVideo, FaGift } from 'react-icons/fa';
import './WeddingTimeline.css';

interface TimelineStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  testimonial?: {
    quote: string;
    client: string;
    image?: string;
  };
}

const WeddingTimeline: React.FC = () => {
  const timelineSteps: TimelineStep[] = [
    {
      icon: <FaHeart />,
      title: "Initial Consultation",
      description: "We'll meet (in person or virtually) to discuss your vision, venue, and wedding style to create a personalized photography plan.",
      testimonial: {
        quote: "From our first meeting, we knew we were in good hands. They asked questions about our relationship that other photographers never thought to ask.",
        client: "Emma & James",
        image: "/images/testimonials/emma-james.jpg"
      }
    },
    {
      icon: <FaCalendarAlt />,
      title: "Engagement Session",
      description: "A relaxed photoshoot that helps us get comfortable working together before the big day.",
      testimonial: {
        quote: "Our engagement photos were so natural and captured our personalities perfectly. It really helped us feel at ease for the wedding day.",
        client: "Michael & Sarah",
        image: "/images/testimonials/michael-sarah.jpg"
      }
    },
    {
      icon: <FaComments />,
      title: "Pre-Wedding Planning",
      description: "Two weeks before your wedding, we'll finalize the shot list, timeline, and special moments you want captured.",
    },
    {
      icon: <FaCamera />,
      title: "Your Wedding Day",
      description: "I'll arrive early to capture getting ready moments and stay through the key events, blending into the background while documenting every special moment.",
      testimonial: {
        quote: "We barely noticed our photographer was there, yet somehow they captured EVERY moment. Even our guests commented on how professional and unobtrusive they were.",
        client: "David & Jennifer",
        image: "/images/testimonials/david-jennifer.jpg"
      }
    },
    {
      icon: <FaPhotoVideo />,
      title: "Editing & Delivery",
      description: "Within 3 weeks, you'll receive a curated online gallery with 500+ professionally edited images telling the story of your day.",
    },
    {
      icon: <FaGift />,
      title: "Heirloom Album Design",
      description: "We'll work together to design a premium wedding album that will become a family heirloom for generations.",
      testimonial: {
        quote: "Our wedding album is absolutely stunning. The quality is incredible, and it perfectly tells the story of our day from start to finish.",
        client: "Rebecca & Thomas",
        image: "/images/testimonials/rebecca-thomas.jpg"
      }
    }
  ];

  return (
    <div className="wedding-timeline-container">
      <h2>Your Wedding Journey With Us</h2>
      <p className="timeline-intro">From first contact to final album delivery, here's how we'll work together to capture your perfect day</p>
      
      <div className="timeline">
        {timelineSteps.map((step, index) => (
          <div key={index} className={`timeline-step ${index % 2 === 0 ? 'left' : 'right'}`}>
            <div className="timeline-icon">{step.icon}</div>
            <div className="timeline-content">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              
              {step.testimonial && (
                <div className="timeline-testimonial">
                  <blockquote>"{step.testimonial.quote}"</blockquote>
                  <div className="testimonial-author">
                    {step.testimonial.image && (
                      <img src={step.testimonial.image} alt={step.testimonial.client} />
                    )}
                    <span>{step.testimonial.client}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeddingTimeline;
