import { HowItsGoingSubmission } from '../types/howItsGoing';

// Mock data for "How It's Going" feature
export const mockHowItsGoingData: HowItsGoingSubmission[] = [
  {
    id: '1',
    coupleNames: 'Sarah & Michael',
    weddingDate: '2022-06-15',
    milestoneType: 'honeymoon',
    location: 'Santorini, Greece',
    caption: 'From saying "I do" at our dream wedding to watching sunsets in Greece! Thank you for capturing our special day perfectly. Now we\'re living our best life! 🌅',
    weddingPhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', // Wedding ceremony
    currentPhoto: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80', // Santorini sunset
    additionalPhotos: [],
    submittedAt: '2024-09-10T10:00:00Z',
    status: 'approved',
    featured: true,
    sortOrder: 1,
    created_at: '2024-09-10T10:00:00Z',
    updated_at: '2024-09-10T10:00:00Z'
  },
  {
    id: '2',
    coupleNames: 'Jessica & David',
    weddingDate: '2021-09-20',
    milestoneType: 'baby',
    location: 'Home Sweet Home',
    caption: 'Three years later and our family has grown! From our perfect wedding day to welcoming baby Emma. We treasure our wedding photos more than ever now. 💕👶',
    weddingPhoto: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80', // Wedding kiss
    currentPhoto: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80', // New parents with baby
    additionalPhotos: [],
    submittedAt: '2024-09-15T14:30:00Z',
    status: 'approved',
    featured: true,
    sortOrder: 2,
    created_at: '2024-09-15T14:30:00Z',
    updated_at: '2024-09-15T14:30:00Z'
  },
  {
    id: '3',
    coupleNames: 'Amanda & Chris',
    weddingDate: '2020-10-10',
    milestoneType: 'anniversary',
    location: 'Napa Valley, CA',
    caption: 'Celebrating 4 years of marriage with a trip to wine country! Every time we look at our wedding album, we fall in love all over again. Best decision ever hiring you! 🍷',
    weddingPhoto: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80', // Wedding couple outdoor
    currentPhoto: 'https://images.unsplash.com/photo-1474740937522-9b4e17864f51?w=800&q=80', // Wine tasting couple
    additionalPhotos: [],
    submittedAt: '2024-09-18T16:45:00Z',
    status: 'approved',
    featured: true,
    sortOrder: 3,
    created_at: '2024-09-18T16:45:00Z',
    updated_at: '2024-09-18T16:45:00Z'
  },
  {
    id: '4',
    coupleNames: 'Emily & James',
    weddingDate: '2023-04-22',
    milestoneType: 'family',
    location: 'New Jersey',
    caption: 'One year later and we just closed on our first home! Our wedding photos have the place of honor in our new living room. Forever grateful for these memories! 🏡',
    weddingPhoto: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80', // Wedding first dance
    currentPhoto: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80', // Couple at new house
    additionalPhotos: [],
    submittedAt: '2024-09-20T11:20:00Z',
    status: 'approved',
    featured: true,
    sortOrder: 4,
    created_at: '2024-09-20T11:20:00Z',
    updated_at: '2024-09-20T11:20:00Z'
  },
  {
    id: '5',
    coupleNames: 'Lauren & Ryan',
    weddingDate: '2019-08-15',
    milestoneType: 'life',
    location: 'Traveling the World',
    caption: 'Five years strong! We\'ve been to 12 countries together and our wedding album comes with us everywhere we go. Thank you for capturing the start of our adventure! ✈️',
    weddingPhoto: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80', // Romantic wedding
    currentPhoto: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80', // Travel couple
    additionalPhotos: [],
    submittedAt: '2024-09-22T09:15:00Z',
    status: 'approved',
    featured: true,
    sortOrder: 5,
    created_at: '2024-09-22T09:15:00Z',
    updated_at: '2024-09-22T09:15:00Z'
  }
];

// Additional mock submissions for the full gallery page
export const mockGalleryData: HowItsGoingSubmission[] = [
  ...mockHowItsGoingData,
  {
    id: '6',
    coupleNames: 'Nicole & Brandon',
    weddingDate: '2022-05-14',
    milestoneType: 'honeymoon',
    location: 'Bali, Indonesia',
    caption: 'From our gorgeous wedding to the trip of a lifetime! Every moment has been magical thanks to you capturing our love story perfectly.',
    weddingPhoto: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
    currentPhoto: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    additionalPhotos: [],
    submittedAt: '2024-09-25T13:30:00Z',
    status: 'approved',
    featured: false,
    sortOrder: 0,
    created_at: '2024-09-25T13:30:00Z',
    updated_at: '2024-09-25T13:30:00Z'
  },
  {
    id: '7',
    coupleNames: 'Megan & Tyler',
    weddingDate: '2021-07-10',
    milestoneType: 'baby',
    location: 'Sparta, NJ',
    caption: 'Our little family of three! Baby Noah arrived and we couldn\'t be happier. Looking at our wedding photos reminds us of where it all began.',
    weddingPhoto: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80',
    currentPhoto: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
    additionalPhotos: [],
    submittedAt: '2024-09-26T15:45:00Z',
    status: 'approved',
    featured: false,
    sortOrder: 0,
    created_at: '2024-09-26T15:45:00Z',
    updated_at: '2024-09-26T15:45:00Z'
  },
  {
    id: '8',
    coupleNames: 'Sophia & Alex',
    weddingDate: '2020-11-28',
    milestoneType: 'anniversary',
    location: 'Paris, France',
    caption: 'Celebrating our 4th anniversary in the city of love! We brought our wedding album to show how far we\'ve come. Merci beaucoup! 🗼',
    weddingPhoto: 'https://images.unsplash.com/photo-1594552072238-45af0c5eb7f5?w=800&q=80',
    currentPhoto: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    additionalPhotos: [],
    submittedAt: '2024-09-27T10:00:00Z',
    status: 'approved',
    featured: false,
    sortOrder: 0,
    created_at: '2024-09-27T10:00:00Z',
    updated_at: '2024-09-27T10:00:00Z'
  }
];
