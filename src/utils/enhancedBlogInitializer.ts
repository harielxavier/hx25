// Enhanced Blog initialization utilities
import { collection, addDoc, getDocs, Timestamp, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getStockImage } from './images';

// Improved helper function to sanitize image URLs
const sanitizeImageUrl = (url: string | undefined): string => {
  if (!url) return getStockImage('wedding');
  
  // If it's a relative path starting with /, it's a valid local image
  if (url.startsWith('/')) {
    return url;
  }
  
  try {
    // Check if URL is valid
    new URL(url);
    return url;
  } catch (error) {
    console.error('Image URL sanitization failed:', error);
    // Return a wedding stock image if the URL is invalid
    return getStockImage('wedding');
  }
};

// Generate a realistic read time based on content length
const calculateReadTime = (content: string): number => {
  // Average reading speed is about 200-250 words per minute
  const wordCount = content.split(/\s+/).length;
  const readTimeMinutes = Math.ceil(wordCount / 225);
  return Math.max(2, readTimeMinutes); // Minimum 2 minutes read time
};

// Sample blog posts with consistent field naming and properly structured data
const blogPosts = [
  {
    title: 'Skylands Manor Engagement Photography Sparta NJ | Marisa & Kyle\'s Pre-Wedding Session',
    slug: 'skylands-manor-engagement-marisa-kyle',
    excerpt: 'Discover our approach to engagement photography at Skylands Manor in Sparta, NJ. See how we prepare couples like Marisa & Kyle for their upcoming Perona Farms wedding through guided poses and authentic moments.',
    content: `
      <p>When Marisa and Kyle reached out about their upcoming wedding at Perona Farms, we knew we had to create something special for their engagement session. They wanted something that would not only capture their love story but also prepare them for their big day. That's when we suggested Skylands Manor—a stunning location that perfectly complements their rustic-chic Perona Farms wedding vision.</p>
      
      <h2>Our Trending "Micro-Wedding Training" Approach</h2>
      <p>Here's the thing about engagement sessions that most couples don't realize: they're not just pretty photos for your save-the-dates. Think of them as your wedding day dress rehearsal. We've developed what we call our "micro-wedding training" approach—it's trending in the wedding industry because it actually works.</p>
      
      <p>During Marisa and Kyle's session, we started with simple, fun prompts that got them laughing and comfortable in front of the camera. "Walk toward each other like you're seeing each other for the first time" became "Now look at each other and think about your first date." These guided moments teach couples how to move naturally, how to interact authentically, and most importantly, how to trust the process.</p>
      
      <h2>Building Confidence Through Guided Authenticity</h2>
      <p>Our approach is all about building confidence. We start with what we call "training wheels poses"—simple, flattering positions that anyone can nail. For Marisa and Kyle, this meant starting with classic embraces and gentle walking shots around Skylands Manor's beautiful stone architecture.</p>
      
      <p>As the session progressed, we gradually introduced more dynamic moments. "Now let's try something a little different," we'd say, and suddenly they're creating these incredible candid moments that felt completely natural. This is the magic of our process—by the end of the session, couples are moving and posing like they've been doing it their whole lives.</p>
      
      <h2>Planning Conversations That Matter</h2>
      <p>While we're capturing these beautiful moments, we're also diving deep into wedding day planning. With Marisa and Kyle, we discussed everything from timeline logistics to emotional moments. One of the biggest decisions we helped them navigate? Whether to do a first look.</p>
      
      <p>For their Perona Farms wedding, we talked through the pros and cons. A first look means more time for couple portraits during golden hour, but it also means missing that traditional aisle moment. We showed them how both scenarios would play out photographically, helping them make an informed decision that felt right for their story.</p>
      
      <h2>Why Skylands Manor Was Perfect for Their Story</h2>
      <p>Skylands Manor provided the perfect backdrop for Marisa and Kyle's engagement session. The rustic stone architecture, sprawling gardens, and natural light created a romantic atmosphere that felt both intimate and grand. It's the kind of location that makes our job easy—every corner offers a new opportunity for beautiful imagery.</p>
      
      <p>The variety of settings within Skylands Manor also gave us the chance to practice different types of shots they'll want on their wedding day. From intimate close-ups in the garden to sweeping romantic shots with the manor in the background, we covered all the bases.</p>
      
      <h2>Preparing for Perona Farms</h2>
      <p>Since Marisa and Kyle are getting married at Perona Farms in Andover, we used their engagement session to discuss how we'll approach their wedding day photography. Perona Farms offers incredible variety—from rustic barn settings to elegant indoor spaces—and we wanted to make sure they felt confident about every aspect of their coverage.</p>
      
      <p>We talked about timing, lighting, and how to make the most of Perona Farms' beautiful grounds. By the end of their engagement session, they had a clear vision of how their wedding day would flow and felt completely prepared for what to expect.</p>
      
      <h2>The Psychology Behind Our Approach</h2>
      <p>There's a psychology to our engagement session approach that's become incredibly popular in the wedding industry. We're not just taking pretty pictures—we're building trust, establishing comfort, and creating a foundation for an amazing wedding day experience.</p>
      
      <p>When couples arrive at their wedding day having already worked with us, there's this incredible ease and confidence. They know how we work, they trust our vision, and they're excited rather than nervous. It's like having a friend photograph your wedding instead of a stranger.</p>
      
      <h2>Creating Lasting Memories</h2>
      <p>Marisa and Kyle's engagement session at Skylands Manor resulted in a collection of images that perfectly capture their personalities and love story. But more importantly, it gave them the confidence and preparation they needed for their upcoming Perona Farms wedding.</p>
      
      <p>These images will serve as beautiful save-the-dates and social media announcements, but they'll also be treasured memories of this exciting time in their lives. The engagement session is often when couples really start to feel like they're getting married, and we love being part of that magical transition.</p>
      
      <h2>Ready for Your Own Engagement Session?</h2>
      <p>If you're planning a wedding in Sussex County, Sparta, or anywhere in Northern New Jersey, we'd love to help you prepare for your big day with an engagement session that's both beautiful and purposeful. Whether you're getting married at Perona Farms, Skylands Manor, or another stunning venue, we'll create an experience that builds confidence and captures your unique love story.</p>
      
      <p>Contact us today to start planning your engagement session and wedding day photography. Let's create something beautiful together.</p>
    `,
    author: 'Hariel Xavier',
    publishedAt: new Date('2025-10-16'),
    updatedAt: new Date('2025-10-16'),
    category: 'Engagement Photography',
    tags: ['Skylands Manor', 'Engagement Photography', 'Sparta NJ', 'Sussex County', 'Perona Farms', 'Northern NJ', 'Wedding Preparation'],
    featuredImage: 'https://cdn.marblism.com/GPMtj94zVZE.jpg',
    readTime: 6,
    seoTitle: 'Skylands Manor Engagement Photography Sparta NJ | Marisa & Kyle\'s Pre-Wedding Session',
    seoDescription: 'Discover our trending approach to engagement photography at Skylands Manor in Sparta, NJ. See how we prepare couples like Marisa & Kyle for their upcoming Perona Farms wedding through guided poses and authentic moments.',
    seoKeywords: 'Skylands Manor engagement photography, Sparta NJ engagement photographer, Sussex County engagement sessions, Perona Farms wedding preparation, Northern NJ engagement photography, wedding day training, engagement session approach',
    isPublished: true,
    views: 0,
    likes: 0,
    comments: [],
    gallery: [
      {
        url: 'https://cdn.marblism.com/GPMtj94zVZE.jpg',
        alt: 'Romantic Garden Embrace at Skylands Manor',
        caption: 'Romantic Garden Embrace'
      },
      {
        url: 'https://cdn.marblism.com/_pCOgR6C731.jpg',
        alt: 'Sunlit Garden Engagement at Skylands Manor',
        caption: 'Sunlit Garden Engagement'
      },
      {
        url: 'https://cdn.marblism.com/8hyFjgHgmyj.jpg',
        alt: 'Engaged Couple at Stone Venue',
        caption: 'Engaged Couple at Stone Venue'
      },
      {
        url: 'https://cdn.marblism.com/gogZtRHEzCm.jpg',
        alt: 'Romantic Wedding Dip by the Pond',
        caption: 'Romantic Wedding Dip by the Pond'
      }
    ]
  },
  {
    title: 'Wedding Photography Storytelling in Sparta NJ | Sussex County Weddings',
    slug: 'art-of-wedding-storytelling',
    excerpt: 'How to capture the complete narrative of a wedding day through thoughtful photography.',
    content: `
      <p>Wedding photography is more than just capturing beautiful moments—it's about telling a complete story that couples will cherish for a lifetime. In this post, we explore the art of wedding storytelling through photography.</p>
      
      <h2>Start with the Details</h2>
      <p>Every wedding has unique details that set the tone for the day. From the invitation suite to the carefully chosen decor, these elements help establish the visual narrative of your story.</p>
      
      <h2>Document the Emotions</h2>
      <p>The heart of wedding storytelling lies in capturing authentic emotions. The nervous excitement before the ceremony, the joy during the first look, the tears during vows—these emotional moments create the narrative arc of the day.</p>
      
      <h2>Capture the Relationships</h2>
      <p>Weddings bring together important people from all aspects of a couple's life. Documenting these relationships adds depth to the wedding story and preserves connections that might not be captured again.</p>
      
      <h2>Include Environmental Context</h2>
      <p>The venue and surroundings play a crucial role in the wedding story. Wide shots that show the setting provide context and help viewers feel immersed in the day's events.</p>
      
      <h2>Follow the Natural Flow</h2>
      <p>The best wedding stories unfold naturally. While having a shot list is important, being present and responsive to unplanned moments often results in the most meaningful images.</p>
    `,
    featuredImage: '/images/stock/blog/blog-the-art-of-wedding-storytelling.jpg',
    category: 'Wedding',
    tags: ['wedding photography', 'storytelling', 'photojournalism'],
    author: {
      name: 'Hariel Xavier',
      avatar: '/images/stock/blog/blog-the-art-of-wedding-storytelling.jpg',
      bio: 'Professional wedding photographer with over 10 years of experience capturing special moments.'
    },
    status: 'published',
    views: 0,
    featured: true,
    seoTitle: 'The Art of Wedding Storytelling | Capturing Your Complete Wedding Day',
    seoDescription: 'Learn how to document the complete narrative of your Sparta NJ wedding day through thoughtful photography that captures emotions, relationships, and meaningful moments.',
    videoEmbed: '',
    commentsEnabled: true
  },
  {
    title: 'Outdoor Portrait Photography Sparta NJ | Sussex County Engagement Sessions',
    slug: 'lighting-techniques-outdoor-portrait-sessions',
    excerpt: 'Master the art of working with natural light and modifiers for stunning outdoor portraits.',
    content: `
      <p>Outdoor portrait photography presents unique lighting challenges and opportunities. This guide will help you master natural light and use modifiers effectively to create stunning portraits in any outdoor setting.</p>
      
      <h2>Understanding the Quality of Light</h2>
      <p>Natural light varies dramatically throughout the day. Morning and evening light offers a soft, golden quality perfect for portraits, while midday sun creates harsh shadows that require different techniques.</p>
      
      <h2>Finding and Using Open Shade</h2>
      <p>Open shade provides even, flattering light for portraits. Look for areas shaded by buildings or large trees with open sky in front to provide gentle illumination.</p>
      
      <h2>Working with Backlighting</h2>
      <p>Placing your subject with the sun behind them creates a beautiful rim light effect. This technique requires careful exposure and potentially fill light or reflectors to properly illuminate your subject's face.</p>
      
      <h2>Essential Light Modifiers</h2>
      <p>Even in natural settings, modifiers can dramatically improve your portraits. 5-in-1 reflectors, diffusers, and portable flash units are valuable tools for outdoor portrait photographers.</p>
    `,
    featuredImage: '/images/stock/blog/blog-lighting-techniques-for-outdoor-portrait-sessions.jpg',
    category: 'Portrait',
    tags: ['lighting', 'outdoor photography', 'portrait techniques'],
    author: {
      name: 'Hariel Xavier',
      avatar: '/images/stock/blog/blog-lighting-techniques-for-outdoor-portrait-sessions.jpg',
      bio: 'Professional wedding photographer with over 10 years of experience capturing special moments.'
    },
    status: 'published',
    views: 0,
    featured: false,
    seoTitle: 'Mastering Outdoor Portrait Lighting | Natural Light Photography Guide',
    seoDescription: 'Learn professional techniques for working with natural light and modifiers to create stunning outdoor portrait photography in any environment.',
    videoEmbed: '',
    commentsEnabled: true
  },
  {
    title: 'Engagement Photography Sparta NJ | Authentic Moments Sussex County',
    slug: 'authentic-moments-engagement-photography',
    excerpt: 'How to guide couples into natural, meaningful interactions during engagement sessions.',
    content: `
      <p>The most compelling engagement photos capture authentic moments between couples. This post explores techniques for creating genuine interactions that reflect each couple's unique relationship.</p>
      
      <h2>Start with Conversation</h2>
      <p>Begin your session by having couples share their story. Ask about how they met, their proposal, or what they love about each other. This creates emotional connection and natural expressions.</p>
      
      <h2>Movement-Based Prompts</h2>
      <p>Static poses rarely capture authentic emotion. Instead, give couples movement-based prompts: "Walk toward me and whisper something funny in your partner's ear" or "Dance together like no one's watching."</p>
      
      <h2>Create Meaningful Activities</h2>
      <p>Plan activities that reflect the couple's relationship. Whether it's making coffee together, visiting their favorite bookstore, or hiking a meaningful trail, activities create natural moments.</p>
      
      <h2>Capture the In-Between</h2>
      <p>Often the most genuine moments happen between posed shots. Keep your camera ready to capture laughs, glances, and small gestures that happen spontaneously.</p>
    `,
    featuredImage: '/images/stock/blog/blog-creating-authentic-moments-in-engagement-photography.jpg',
    category: 'Engagement',
    tags: ['engagement photography', 'couples', 'authentic moments'],
    author: {
      name: 'Hariel Xavier',
      avatar: '/images/stock/blog/blog-creating-authentic-moments-in-engagement-photography.jpg',
      bio: 'Professional wedding photographer with over 10 years of experience capturing special moments.'
    },
    status: 'published',
    views: 0,
    featured: false,
    seoTitle: 'Creating Authentic Moments in Engagement Photography | Natural Couple Photos',
    seoDescription: 'Learn how to guide couples to create genuine, meaningful moments during engagement photo sessions that truly reflect their unique relationship.',
    videoEmbed: '',
    commentsEnabled: true
  },
  {
    title: 'Wedding Photography Equipment Guide | Sparta NJ Wedding Photographer',
    slug: 'essential-gear-wedding-photographers-2025',
    excerpt: 'The must-have equipment for modern wedding photography that balances quality, reliability, and portability.',
    content: `
      <p>The right photography gear can make or break your wedding photography business. This comprehensive guide covers the essential equipment every wedding photographer needs in 2025.</p>
      
      <h2>Camera Bodies: Balancing Features and Size</h2>
      <p>Modern mirrorless cameras offer the perfect balance of image quality, speed, and portability. Look for dual card slots, excellent low-light performance, and reliable autofocus in challenging conditions.</p>
      
      <h2>Versatile Lens Selection</h2>
      <p>A typical wedding kit should include: a 24-70mm f/2.8 for versatility, a 70-200mm f/2.8 for ceremonies and candids, and fast primes like 35mm f/1.4 and 85mm f/1.4 for low light and creative portraits.</p>
      
      <h2>Lighting Equipment</h2>
      <p>At minimum, carry two speedlights with wireless triggers, light stands, and modifiers like bounce cards and small softboxes. These allow for creative lighting in any venue situation.</p>
      
      <h2>Backup Systems</h2>
      <p>Always bring backup for everything: additional camera bodies, batteries, cards, and even a backup lighting system. Wedding days offer no second chances.</p>
    `,
    featuredImage: '/images/stock/blog/blog-essential-gear-for-wedding-photographers-in-2025.jpg',
    category: 'Equipment',
    tags: ['wedding photography', 'camera gear', 'equipment'],
    author: {
      name: 'Hariel Xavier',
      avatar: '/images/stock/blog/blog-essential-gear-for-wedding-photographers-in-2025.jpg',
      bio: 'Professional wedding photographer with over 10 years of experience capturing special moments.'
    },
    status: 'published',
    views: 0,
    featured: false,
    seoTitle: 'Essential Wedding Photography Gear for 2025 | Professional Equipment Guide',
    seoDescription: 'Discover the must-have photography equipment for wedding photographers in 2025, from camera bodies and lenses to lighting and backup systems.',
    videoEmbed: '',
    commentsEnabled: true
  },
  {
    title: 'Color Grading Techniques to Define Your Photography Style',
    slug: 'color-grading-techniques-define-photography-style',
    excerpt: 'How to develop and apply consistent color grading that becomes your signature look and attracts your ideal clients.',
    content: `
      <p>Developing a consistent color grading style is one of the most powerful ways to differentiate your photography brand. This guide explores techniques for creating a signature look through color.</p>
      
      <h2>Understanding Color Theory in Photography</h2>
      <p>Before developing your style, understand how colors interact and evoke emotions. Warm tones (oranges, yellows) create intimacy and joy, while cool tones (blues, greens) can convey calm or distance.</p>
      
      <h2>Finding Your Aesthetic</h2>
      <p>Study photographers whose work you admire. Analyze the common color characteristics in your favorite images. Your personal style often emerges from what naturally attracts you.</p>
      
      <h2>Creating Custom Presets</h2>
      <p>Develop base presets that reflect your style foundations. These should be flexible enough to work across different lighting conditions while maintaining your signature look.</p>
      
      <h2>Consistency Across Platforms</h2>
      <p>Ensure your color grading translates consistently from editing software to web and print. Regular calibration of your monitors and understanding how colors shift across mediums is essential.</p>
    `,
    featuredImage: '/images/stock/blog/blog-color-grading-techniques-to-define-your-photography-style.jpg',
    category: 'Editing',
    tags: ['color grading', 'editing', 'photography style'],
    author: {
      name: 'Hariel Xavier',
      avatar: '/images/stock/blog/blog-color-grading-techniques-to-define-your-photography-style.jpg',
      bio: 'Professional wedding photographer with over 10 years of experience capturing special moments.'
    },
    status: 'published',
    views: 0,
    featured: false,
    seoTitle: 'Color Grading Techniques for Photographers | Developing Your Signature Style',
    seoDescription: 'Learn how to develop and apply consistent color grading techniques that define your photography style and attract your ideal clients.',
    videoEmbed: '',
    commentsEnabled: true
  },
  {
    title: 'Mastering Client Communication for Wedding Photographers',
    slug: 'mastering-client-communication-wedding-photographers',
    excerpt: 'How to build trust, set expectations, and create exceptional experiences through effective communication.',
    content: `
      <p>Exceptional photography skills are only half the equation for a successful wedding photography business. This guide focuses on the equally important skill of client communication.</p>
      
      <h2>Pre-Booking Communication</h2>
      <p>The client experience begins with your first interaction. Respond promptly, address questions thoroughly, and focus on understanding their vision rather than immediately selling your services.</p>
      
      <h2>Setting Clear Expectations</h2>
      <p>Detailed contracts and pre-wedding questionnaires prevent misunderstandings. Clearly outline deliverables, timeline expectations, and what happens in various scenarios.</p>
      
      <h2>Wedding Day Communication</h2>
      <p>Develop a confident but calming presence. Give clear direction while remaining flexible. Remember that your demeanor affects the couple's experience and the emotions captured in their photos.</p>
      
      <h2>Post-Wedding Follow-Up</h2>
      <p>Maintain communication after the wedding with regular updates on editing progress. Exceed expectations with thoughtful touches like sneak peeks and personalized delivery experiences.</p>
    `,
    featuredImage: '/images/stock/blog/blog-mastering-client-communication-for-wedding-photographers.jpg',
    category: 'Business',
    tags: ['client communication', 'wedding photography', 'business tips'],
    author: {
      name: 'Hariel Xavier',
      avatar: '/images/stock/blog/blog-mastering-client-communication-for-wedding-photographers.jpg',
      bio: 'Professional wedding photographer with over 10 years of experience capturing special moments.'
    },
    status: 'published',
    views: 0,
    featured: false,
    seoTitle: 'Mastering Client Communication for Wedding Photographers | Building Trust',
    seoDescription: 'Learn effective client communication strategies for wedding photographers to build trust, set clear expectations, and create exceptional client experiences.',
    videoEmbed: '',
    commentsEnabled: true
  },
  {
    title: 'Building a Photography Portfolio That Attracts Your Ideal Clients',
    slug: 'building-photography-portfolio-attracts-ideal-clients',
    excerpt: 'Strategic approaches to curating a portfolio that speaks directly to the clients you want to work with.',
    content: `
      <p>Your portfolio is your most powerful marketing tool. This guide explores how to strategically curate a collection that attracts your ideal clients while authentically representing your work.</p>
      
      <h2>Define Your Ideal Client</h2>
      <p>Before curating your portfolio, clearly define who you want to attract. Consider their aesthetic preferences, values, budget range, and the type of events or sessions they're planning.</p>
      
      <h2>Quality Over Quantity</h2>
      <p>A smaller collection of exceptional images is more effective than a large gallery of good ones. Be ruthless in editing down to only your absolute best work that represents your style.</p>
      
      <h2>Show What You Want to Shoot</h2>
      <p>Your portfolio acts as a filter. Include only the types of photography you want to continue doing, in the style you prefer. Clients will book you based on what they see.</p>
      
      <h2>Update Regularly</h2>
      <p>Your portfolio should evolve as your skills and style develop. Schedule quarterly reviews to add new work and remove images that no longer represent your best efforts.</p>
    `,
    featuredImage: '/images/stock/blog/blog-building-a-photography-portfolio-that-attracts-your-ideal-clients.jpg',
    category: 'Business',
    tags: ['portfolio', 'client attraction', 'photography business'],
    author: {
      name: 'Hariel Xavier',
      avatar: '/images/stock/blog/blog-building-a-photography-portfolio-that-attracts-your-ideal-clients.jpg',
      bio: 'Professional wedding photographer with over 10 years of experience capturing special moments.'
    },
    status: 'published',
    views: 0,
    featured: false,
    seoTitle: 'Building a Photography Portfolio That Attracts Your Ideal Clients | Curation Guide',
    seoDescription: 'Learn strategic approaches to curating a photography portfolio that effectively attracts your ideal clients while authentically representing your work and style.',
    videoEmbed: '',
    commentsEnabled: true
  }
];

/**
 * Create new blog posts with distributed dates
 */
export const createEnhancedBlogPosts = async (): Promise<void> => {
  console.log('Creating enhanced blog posts with distributed dates...');
  
  try {
    // Check if we already have the expected number of posts
    const postsRef = collection(db, 'posts');
    const querySnapshot = await getDocs(postsRef);
    
    if (querySnapshot.size >= blogPosts.length) {
      console.log(`Blog already has ${querySnapshot.size} posts. Clearing existing posts to create fresh ones.`);
      
      // Delete existing posts (in a production app, you'd want to confirm this action)
      for (const doc of querySnapshot.docs) {
        try {
          await deleteDoc(doc.ref);
          console.log(`Deleted post with ID: ${doc.id}`);
        } catch (error) {
          console.error(`Error deleting post ${doc.id}:`, error);
        }
      }
    }
    
    console.log(`Adding ${blogPosts.length} enhanced blog posts with distributed dates...`);
    
    // Add posts with distributed dates
    for (let i = 0; i < blogPosts.length; i++) {
      try {
        const post = blogPosts[i];
        
        // Create distributed dates - most recent post is today, others go back exactly 2 weeks per post
        const now = new Date();
        const weeksBack = i * 2; // Each post is exactly 2 weeks apart
        const publishedDate = new Date(now);
        publishedDate.setDate(now.getDate() - (weeksBack * 7)); // Go back by the specified number of weeks
        
        const createdDate = new Date(publishedDate);
        createdDate.setDate(publishedDate.getDate() - 3); // Created 3 days before published
        
        // Calculate read time based on content length
        const readTime = calculateReadTime(post.content);
        
        const postData = {
          ...post,
          status: 'published', // Ensure all posts are published
          featuredImage: sanitizeImageUrl(post.featuredImage),
          author: {
            ...post.author,
            avatar: sanitizeImageUrl(post.featuredImage)
          },
          readTime,
          publishedAt: Timestamp.fromDate(publishedDate),
          createdAt: Timestamp.fromDate(createdDate),
          updatedAt: Timestamp.fromDate(publishedDate)
        };
        
        const docRef = await addDoc(collection(db, 'posts'), postData);
        console.log(`Added post: ${post.title} with ID: ${docRef.id} (Published: ${publishedDate.toLocaleDateString()})`);
      } catch (error) {
        console.error(`Error adding post "${blogPosts[i].title}":`, error);
      }
    }
    
    console.log('Successfully created enhanced blog posts with distributed dates!');
  } catch (error) {
    console.error('Error creating enhanced blog posts:', error);
    throw new Error(`Failed to create enhanced blog posts: ${error}`);
  }
};
