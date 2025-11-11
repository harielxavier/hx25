// STUB SERVICE - Uses static slider data, no database needed

export interface Slide {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  order: number;
}

// Static slider data - no Firebase needed
export const getSlides = async (): Promise<Slide[]> => {
  return [
    {
      id: '1',
      image: '/images/slider/wedding-1.jpg',
      title: 'Capture Your Perfect Moment',
      subtitle: 'Professional Wedding Photography',
      order: 1
    },
    {
      id: '2',
      image: '/images/slider/engagement-1.jpg',
      title: 'Tell Your Love Story',
      subtitle: 'Engagement & Couples Photography',
      order: 2
    },
    {
      id: '3',
      image: '/images/slider/family-1.jpg',
      title: 'Preserve Precious Memories',
      subtitle: 'Family & Portrait Photography',
      order: 3
    }
  ];
};

export const getSlideById = async (id: string): Promise<Slide | null> => {
  const slides = await getSlides();
  return slides.find(s => s.id === id) || null;
};
