export interface HowItsGoingSubmission {
  id: string;
  coupleNames: string;
  weddingDate: string;
  milestoneType: 'honeymoon' | 'anniversary' | 'baby' | 'family' | 'life' | 'other';
  location?: string;
  caption: string;
  weddingPhoto: string; // URL to their wedding photo from your portfolio
  currentPhoto: string; // URL to their submitted "how it's going" photo
  additionalPhotos?: string[]; // Optional additional photos
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean; // To highlight on landing page
  sortOrder: number; // For custom ordering
  created_at: string;
  updated_at: string;
}

export interface HowItsGoingFormData {
  coupleNames: string;
  weddingDate: string;
  milestoneType: string;
  location: string;
  caption: string;
  weddingPhoto: File | null;
  currentPhoto: File | null;
  additionalPhotos: File[];
  agreeToTerms: boolean;
}

export const MILESTONE_TYPES = {
  honeymoon: {
    label: '🌴 Honeymoon Adventures',
    emoji: '🌴',
    color: 'bg-blue-100 text-blue-800'
  },
  anniversary: {
    label: '🎂 Anniversary Milestone',
    emoji: '🎂',
    color: 'bg-pink-100 text-pink-800'
  },
  baby: {
    label: '👶 Growing Our Family',
    emoji: '👶',
    color: 'bg-purple-100 text-purple-800'
  },
  family: {
    label: '🏡 Family Life',
    emoji: '🏡',
    color: 'bg-green-100 text-green-800'
  },
  life: {
    label: '💕 Just Loving Life',
    emoji: '💕',
    color: 'bg-rose-100 text-rose-800'
  },
  other: {
    label: '✨ Other Milestone',
    emoji: '✨',
    color: 'bg-amber-100 text-amber-800'
  }
} as const;
