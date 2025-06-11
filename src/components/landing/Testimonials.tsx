import { Star } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: "Roberto Tatis",
      date: "November 2023",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop",
      quote: "Mauricio's photography is exceptional. He captured the essence of our wedding day with such artistry and attention to detail. The photos tell our story beautifully."
    },
    {
      name: "Sarah & John",
      date: "October 2023",
      image: "https://images.unsplash.com/photo-1623778392472-f1760984fe52?q=80&w=2940",
      quote: "Mauricio captured our day perfectly. Every time we look at our photos, we relive those precious moments all over again."
    },
    {
      name: "Emma & James",
      date: "September 2023",
      image: "https://images.unsplash.com/photo-1622290319146-7b63df48a635?q=80&w=2940",
      quote: "Working with Mauricio was the best decision we made for our wedding. His attention to detail and artistic eye are unmatched."
    }
  ];

  return (
    <section className="py-20 bg-white bg-[url('/images/backgroundclient.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl mb-4">Love Notes</h2>
          <p className="text-gray-600 font-light max-w-2xl mx-auto">
            Words from the heart of couples who trusted us to capture their special day.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="relative">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
              </div>
              <div className="bg-cream p-8 pt-12 text-center">
                <p className="text-gray-700 font-light mb-6 italic">"{testimonial.quote}"</p>
                <div className="w-20 h-20 mx-auto mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="font-serif text-xl mb-1">{testimonial.name}</h3>
                <p className="text-gray-500 text-sm">{testimonial.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}