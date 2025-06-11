import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyApMtpFIqQpbf9HmuaJQcwqnpwZY4_IBEU",
  authDomain: "harielxavier-f4f41.firebaseapp.com",
  projectId: "harielxavier-f4f41",
  storageBucket: "harielxavier-f4f41.firebasestorage.app",
  messagingSenderId: "974654026173",
  appId: "1:974654026173:web:de236f0a0d36d7bbfee2d4",
  measurementId: "G-9QYMMLFFVH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createSamplePosts() {
  try {
    const samplePosts = [
      {
        title: 'Wedding Photography Tips for Beginners',
        slug: 'wedding-photography-tips-beginners',
        excerpt: 'Learn essential tips and tricks for capturing beautiful wedding moments as a beginner photographer.',
        content: '<p>Wedding photography is both an art and a science. As a beginner, it\'s important to understand the fundamentals before diving into your first wedding shoot.</p><p>First, always bring backup equipment. Camera bodies, lenses, batteries, and memory cards can all fail at the worst possible moment. Having backups ensures you won\'t miss critical shots.</p><p>Second, scout the location beforehand. Understanding the venue\'s lighting conditions and identifying potential shooting spots will save you time and stress on the wedding day.</p>',
        category: 'Wedding',
        author: {
          name: 'Hariel Xavier',
          avatar: '/MoStuff/Asset 1.png'
        },
        image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a',
        tags: ['wedding', 'photography', 'beginners', 'tips'],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        status: 'published',
        publishedAt: Timestamp.now(),
        featured: true,
        seo: {
          title: 'Wedding Photography Tips for Beginners | Hariel Xavier Photography',
          description: 'Learn essential tips and tricks for capturing beautiful wedding moments as a beginner photographer.',
          keywords: ['wedding photography', 'beginner tips', 'photography guide'],
          ogImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a'
        },
        views: 42
      },
      {
        title: 'How to Choose the Perfect Portrait Lens',
        slug: 'choose-perfect-portrait-lens',
        excerpt: 'A comprehensive guide to selecting the ideal lens for portrait photography based on your style and budget.',
        content: '<p>Choosing the right lens for portrait photography can dramatically impact the quality and style of your images.</p><p>For beginners, a 50mm f/1.8 lens (often called a "nifty fifty") is an excellent starting point. It\'s affordable, versatile, and produces beautiful bokeh when shot wide open.</p><p>If you\'re looking to upgrade, consider an 85mm f/1.4 or f/1.8 lens. These are considered the gold standard for portrait photography, offering flattering compression and stunning background separation.</p>',
        category: 'Equipment',
        author: {
          name: 'Hariel Xavier',
          avatar: '/MoStuff/Asset 1.png'
        },
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
        tags: ['portrait', 'lenses', 'equipment', 'photography'],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        status: 'published',
        publishedAt: Timestamp.now(),
        featured: false,
        seo: {
          title: 'How to Choose the Perfect Portrait Lens | Hariel Xavier Photography',
          description: 'A comprehensive guide to selecting the ideal lens for portrait photography based on your style and budget.',
          keywords: ['portrait lens', 'photography equipment', 'lens guide'],
          ogImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32'
        },
        views: 28
      },
      {
        title: 'Mastering Natural Light in Outdoor Photography',
        slug: 'mastering-natural-light-outdoor-photography',
        excerpt: 'Discover techniques for working with natural light to create stunning outdoor portraits and landscapes.',
        content: '<p>Natural light is a photographer\'s best friend and greatest challenge. Learning to work with it effectively can elevate your outdoor photography to new heights.</p><p>The golden hour—the period shortly after sunrise or before sunset—provides warm, soft light that flatters subjects and creates a magical atmosphere. Plan your shoots around these times whenever possible.</p>',
        category: 'Techniques',
        author: {
          name: 'Hariel Xavier',
          avatar: '/MoStuff/Asset 1.png'
        },
        image: 'https://images.unsplash.com/photo-1500051638674-ff996a0ec29e',
        tags: ['natural light', 'outdoor', 'techniques', 'golden hour'],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        status: 'published',
        publishedAt: Timestamp.now(),
        featured: true,
        seo: {
          title: 'Mastering Natural Light in Outdoor Photography | Hariel Xavier Photography',
          description: 'Discover techniques for working with natural light to create stunning outdoor portraits and landscapes.',
          keywords: ['natural light photography', 'outdoor portraits', 'golden hour'],
          ogImage: 'https://images.unsplash.com/photo-1500051638674-ff996a0ec29e'
        },
        views: 35
      },
      {
        title: 'Essential Post-Processing Tips for Wedding Photos',
        slug: 'essential-post-processing-tips-wedding-photos',
        excerpt: 'Learn how to enhance your wedding photography with these professional post-processing techniques.',
        content: '<p>Post-processing is where wedding photos truly come to life. Here are some essential tips to enhance your wedding photography without over-editing.</p><p>Start with proper calibration. Ensure your monitor is calibrated correctly so that what you see is what clients will get when prints are made.</p>',
        category: 'Post-Processing',
        author: {
          name: 'Hariel Xavier',
          avatar: '/MoStuff/Asset 1.png'
        },
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc',
        tags: ['post-processing', 'editing', 'wedding', 'lightroom'],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        status: 'draft',
        publishedAt: null,
        featured: false,
        seo: {
          title: 'Essential Post-Processing Tips for Wedding Photos | Hariel Xavier Photography',
          description: 'Learn how to enhance your wedding photography with these professional post-processing techniques.',
          keywords: ['photo editing', 'wedding photography', 'post-processing'],
          ogImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc'
        },
        views: 0
      },
      {
        title: 'Building Your Photography Portfolio: A Step-by-Step Guide',
        slug: 'building-photography-portfolio-guide',
        excerpt: 'Learn how to create a compelling photography portfolio that showcases your best work and attracts your ideal clients.',
        content: '<p>A strong portfolio is essential for any photographer looking to attract clients and showcase their skills. Here\'s how to build one that stands out.</p><p>First, be ruthlessly selective. Include only your absolute best work—15-20 outstanding images are better than 50 mediocre ones. Remember, you\'re only as good as your worst portfolio image.</p>',
        category: 'Business',
        author: {
          name: 'Hariel Xavier',
          avatar: '/MoStuff/Asset 1.png'
        },
        image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d',
        tags: ['portfolio', 'business', 'marketing', 'career'],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        status: 'published',
        publishedAt: Timestamp.now(),
        featured: false,
        seo: {
          title: 'Building Your Photography Portfolio: A Step-by-Step Guide | Hariel Xavier Photography',
          description: 'Learn how to create a compelling photography portfolio that showcases your best work and attracts your ideal clients.',
          keywords: ['photography portfolio', 'career guide', 'marketing for photographers'],
          ogImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d'
        },
        views: 19
      }
    ];

    for (const post of samplePosts) {
      const docRef = await addDoc(collection(db, 'blog_posts'), post);
      console.log('Created blog post with ID:', docRef.id);
    }

    console.log('Successfully created 5 sample blog posts!');
  } catch (error) {
    console.error('Error creating sample posts:', error);
  }
}

createSamplePosts();
