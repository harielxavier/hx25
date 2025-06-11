import React from 'react';

interface WeddingImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  size: 'small' | 'medium' | 'large' | 'full';
  caption?: string;
}

const FeaturedEditorialWedding: React.FC = () => {
  // Sample featured wedding data - replace with actual data from CMS
  const featuredWedding = {
    couple: 'Alexandra & James',
    date: 'June 12, 2024',
    venue: 'Villa Cimbrone',
    location: 'Ravello, Italy',
    story: `Their love story began in Paris and culminated in a breathtaking celebration overlooking the Amalfi Coast. Every detail was meticulously curated to reflect their journey together, from the hand-calligraphed vows to the custom floral installations that transformed the centuries-old venue.`,
    images: [
      {
        id: '1',
        src: 'https://source.unsplash.com/random/1600x900/?wedding,editorial',
        alt: 'Alexandra and James exchanging vows at Villa Cimbrone',
        width: 1600,
        height: 900,
        size: 'full',
        caption: 'As the sun began to set over the Amalfi Coast, Alexandra and James exchanged heartfelt vows in the Infinity Terrace.'
      },
      {
        id: '2',
        src: 'https://source.unsplash.com/random/800x1200/?wedding,bride',
        alt: 'Alexandra in her custom Vera Wang gown',
        width: 800,
        height: 1200,
        size: 'medium',
        caption: 'Alexandra wore a custom Vera Wang gown with hand-embroidered details inspired by the architecture of Villa Cimbrone.'
      },
      {
        id: '3',
        src: 'https://source.unsplash.com/random/800x600/?wedding,groom',
        alt: 'James in his bespoke tuxedo',
        width: 800,
        height: 600,
        size: 'small',
        caption: 'James chose a midnight blue tuxedo from Brioni, complemented by his grandfather\'s vintage cufflinks.'
      },
      {
        id: '4',
        src: 'https://source.unsplash.com/random/1200x800/?wedding,venue',
        alt: 'The reception setup at Villa Cimbrone',
        width: 1200,
        height: 800,
        size: 'large',
        caption: 'The reception featured a canopy of fairy lights and cascading florals that transformed the ancient cloister into an enchanted garden.'
      },
      {
        id: '5',
        src: 'https://source.unsplash.com/random/900x1200/?wedding,couple',
        alt: 'Alexandra and James portrait at sunset',
        width: 900,
        height: 1200,
        size: 'medium',
        caption: 'We stole away for a few moments during the golden hour to capture these intimate portraits overlooking the Mediterranean.'
      },
      {
        id: '6',
        src: 'https://source.unsplash.com/random/1600x900/?wedding,dance',
        alt: 'First dance under the stars',
        width: 1600,
        height: 900,
        size: 'full',
        caption: 'Their first dance took place under the stars, with a string quartet playing their favorite piece by Ludovico Einaudi.'
      }
    ] as WeddingImage[]
  };
  
  return (
    <section className="featured-editorial-wedding py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <header className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl mb-4">The Complete Experience</h2>
          <p className="font-body text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            An editorial approach to wedding photography that captures the complete narrative of your celebration.
          </p>
        </header>
        
        <div className="wedding-story max-w-5xl mx-auto">
          {/* Couple information */}
          <div className="text-center mb-12">
            <h3 className="font-display text-2xl md:text-3xl mb-2">{featuredWedding.couple}</h3>
            <p className="font-body text-gray-600 dark:text-gray-400">
              {featuredWedding.venue} • {featuredWedding.location} • {featuredWedding.date}
            </p>
          </div>
          
          {/* Wedding story */}
          <div className="mb-16">
            <p className="font-body text-lg text-center max-w-3xl mx-auto leading-relaxed">
              {featuredWedding.story}
            </p>
          </div>
          
          {/* Magazine-style layout with varied image sizes */}
          <div className="wedding-gallery grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredWedding.images.map((image) => (
              <figure 
                key={image.id} 
                className={`relative overflow-hidden ${
                  image.size === 'full' ? 'col-span-full' : 
                  image.size === 'large' ? 'col-span-2' : 
                  image.size === 'medium' ? 'col-span-1 row-span-2' : 
                  'col-span-1'
                }`}
              >
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* Narrative caption */}
                {image.caption && (
                  <figcaption className="bg-white dark:bg-gray-900 p-4 text-sm leading-relaxed">
                    <p className="font-body italic text-gray-700 dark:text-gray-300">
                      {image.caption}
                    </p>
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEditorialWedding;
