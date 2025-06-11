import React from 'react';

export default function Featured() {
  const galleries = [
    {
      title: "Sarah & John",
      location: "Central Park, NYC",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2940",
      date: "Fall 2023"
    },
    {
      title: "Emma & James",
      location: "Jersey Shore",
      image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=2940",
      date: "Summer 2023"
    },
    {
      title: "Maria & David",
      location: "Brooklyn Bridge",
      image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=2940",
      date: "Spring 2023"
    }
  ];

  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <p className="text-gold uppercase tracking-[0.2em] mb-4">Featured Stories</p>
          <h2 className="font-serif text-5xl mb-6">Recent Love Stories</h2>
          <p className="text-gray-600 font-light leading-relaxed">
            Every wedding tells a unique story. Here are some of our recent favorites,
            where love, laughter, and precious moments come together in perfect harmony.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12">
          {galleries.map((gallery, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative overflow-hidden mb-6">
                <img
                  src={gallery.image}
                  alt={gallery.title}
                  className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
              <p className="text-gold uppercase tracking-[0.2em] text-sm mb-2">{gallery.date}</p>
              <h3 className="font-serif text-2xl mb-1">{gallery.title}</h3>
              <p className="text-gray-600 font-light">{gallery.location}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button className="border-2 border-black text-black px-12 py-4 hover:bg-black hover:text-white transition-all duration-300 tracking-widest uppercase text-sm">
            View All Stories
          </button>
        </div>
      </div>
    </section>
  );
}