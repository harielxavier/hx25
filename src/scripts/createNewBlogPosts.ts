// REMOVED FIREBASE: import { collection, addDoc, serverTimestamp, query, getDocs, limit, where // REMOVED FIREBASE
// REMOVED FIREBASE: import { db } from '../firebase/config';

// New blog posts with modern photography topics
const newBlogPosts = [
  {
    title: 'The Art of Wedding Storytelling',
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
    featured_image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80',
    category: 'Wedding',
    tags: ['wedding photography', 'storytelling', 'photojournalism'],
    author: 'Hariel Xavier',
    status: 'published',
    views: 0,
    featured: true, // This is the featured post
    seo_title: 'The Art of Wedding Storytelling | Capturing Your Complete Wedding Day',
    seo_description: 'Learn how professional photographers create a comprehensive visual narrative of your wedding day through thoughtful storytelling techniques.',
    videoEmbed: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    title: 'Lighting Techniques for Outdoor Portrait Sessions',
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
    featured_image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&q=80',
    category: 'Portrait',
    tags: ['lighting', 'outdoor photography', 'portrait techniques'],
    author: 'Hariel Xavier',
    status: 'published',
    views: 0,
    featured: false,
    seo_title: 'Mastering Outdoor Portrait Lighting | Natural Light Photography Guide',
    seo_description: 'Learn professional techniques for working with natural light and modifiers to create stunning outdoor portrait photography in any environment.'
  },
  {
    title: 'Creating Authentic Moments in Engagement Photography',
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
    featured_image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80',
    category: 'Engagement',
    tags: ['engagement photography', 'couples', 'authentic moments'],
    author: 'Hariel Xavier',
    status: 'published',
    views: 0,
    featured: false,
    seo_title: 'Creating Authentic Engagement Photos | Beyond Posed Pictures',
    seo_description: 'Discover how to guide couples into natural, meaningful interactions that result in authentic engagement photos that truly reflect their relationship.',
    videoEmbed: 'https://vimeo.com/76979871'
  },
  {
    title: 'Color Grading for Consistent Photography Style',
    slug: 'color-grading-consistent-photography-style',
    excerpt: 'Develop a signature look for your photography through intentional color grading techniques.',
    content: `
      <p>Color grading is one of the most powerful tools for developing a consistent, recognizable photography style. This guide explores how to develop your unique approach to color.</p>
      
      <h2>Understanding Color Theory in Photography</h2>
      <p>Before developing a color grading style, it's important to understand how colors interact and evoke emotional responses. Color temperature, complementary colors, and color harmony all play important roles.</p>
      
      <h2>Analyzing Your Aesthetic Preferences</h2>
      <p>Your personal style should reflect your artistic vision. Study images that resonate with you and analyze their color characteristics. Are you drawn to warm, golden tones? Cool, cinematic blues? Muted, film-inspired palettes?</p>
      
      <h2>Creating Custom Presets</h2>
      <p>Once you've identified your preferred color characteristics, develop custom presets that can be applied consistently across your work while allowing for adjustments based on specific shooting conditions.</p>
      
      <h2>Maintaining Consistency Across Environments</h2>
      <p>Different lighting conditions present challenges for maintaining a consistent look. Learn techniques for adapting your color grading approach while preserving your signature style.</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80',
    category: 'Editing',
    tags: ['color grading', 'editing', 'photography style'],
    author: 'Hariel Xavier',
    status: 'published',
    views: 0,
    featured: false,
    seo_title: 'Developing a Signature Color Style | Photography Color Grading Guide',
    seo_description: 'Learn professional color grading techniques to create a consistent, recognizable style across your photography portfolio.'
  },
  {
    title: 'Destination Wedding Photography: A Complete Guide',
    slug: 'destination-wedding-photography-complete-guide',
    excerpt: 'Everything photographers need to know about capturing weddings in unfamiliar locations around the world.',
    content: `
      <p>Destination weddings offer incredible opportunities for unique and stunning photography, but they also present unique challenges. This comprehensive guide covers everything you need to know about photographing weddings away from home.</p>
      
      <h2>Preparation and Research</h2>
      <p>Success begins long before you board the plane. Research the location thoroughly, including typical weather conditions, cultural considerations, and potential shooting locations. Virtual location scouting through Google Earth and local photographers' work can provide valuable insights.</p>
      
      <h2>Equipment Considerations</h2>
      <p>Traveling with photography gear requires careful planning. This section covers packing strategies, backup equipment, international power solutions, and navigating airline and customs regulations.</p>
      
      <h2>On-Location Scouting</h2>
      <p>Arrive early enough to scout locations in person. This section discusses how to make the most of your scouting time, including assessing lighting conditions at different times of day and identifying backup locations.</p>
      
      <h2>Working with Local Vendors</h2>
      <p>Building relationships with local wedding vendors can enhance your work and provide valuable local knowledge. Learn how to connect and collaborate effectively across cultural and language barriers.</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=1200&q=80',
    category: 'Wedding',
    tags: ['destination wedding', 'travel photography', 'wedding planning'],
    author: 'Hariel Xavier',
    status: 'published',
    views: 0,
    featured: false,
    seo_title: 'The Complete Guide to Destination Wedding Photography',
    seo_description: 'A comprehensive guide for photographers covering everything you need to know about capturing beautiful destination weddings anywhere in the world.'
  },
  {
    title: 'Building a Photography Portfolio That Attracts Your Ideal Clients',
    slug: 'building-photography-portfolio-attracts-ideal-clients',
    excerpt: 'Strategic approaches to curating a portfolio that speaks directly to the clients you want to work with.',
    content: `
      <p>Your photography portfolio is your most powerful marketing tool. This guide explores how to strategically curate images that attract your ideal clients while authentically representing your style and approach.</p>
      
      <h2>Defining Your Ideal Client</h2>
      <p>Before curating your portfolio, clearly define who you want to work with. Consider demographics, aesthetic preferences, values, and the type of photography experience they're seeking.</p>
      
      <h2>Quality Over Quantity</h2>
      <p>A smaller collection of exceptional images is more effective than a larger gallery of varying quality. This section discusses how to objectively evaluate your work and make strategic selections.</p>
      
      <h2>Telling a Cohesive Story</h2>
      <p>Your portfolio should tell a cohesive story about your style and approach. Learn how to organize images to create a narrative flow that guides potential clients through the experience of working with you.</p>
      
      <h2>Showcasing Diversity Within Consistency</h2>
      <p>While maintaining a consistent style is important, showing range within that style demonstrates versatility. This section explores how to balance consistency with variety in your portfolio.</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&q=80',
    category: 'Business',
    tags: ['portfolio', 'client attraction', 'photography business'],
    author: 'Hariel Xavier',
    status: 'published',
    views: 0,
    featured: false,
    seo_title: 'Creating a Client-Attracting Photography Portfolio | Strategic Curation Guide',
    seo_description: 'Learn how to strategically build and curate a photography portfolio that authentically represents your style while attracting your ideal clients.'
  },
  {
    title: 'Modern Approaches to Family Photography',
    slug: 'modern-approaches-family-photography',
    excerpt: 'Moving beyond traditional posed portraits to create contemporary family images with lasting impact.',
    content: `
      <p>Family photography has evolved significantly beyond the formal studio portraits of previous generations. This guide explores contemporary approaches to creating meaningful family images that reflect authentic connections and modern aesthetics.</p>
      
      <h2>Documentary Family Photography</h2>
      <p>Documentary approaches focus on capturing real family life as it unfolds. This section discusses techniques for observing and photographing genuine family moments without direction or intervention.</p>
      
      <h2>Lifestyle Family Sessions</h2>
      <p>Lifestyle photography blends natural moments with gentle direction. Learn how to guide families into activities and interactions that produce authentic-looking images while ensuring flattering results.</p>
      
      <h2>Environmental Family Portraits</h2>
      <p>Location plays a crucial role in contemporary family photography. This section explores how to use meaningful environments to add context and depth to family portraits.</p>
      
      <h2>Incorporating Family Stories</h2>
      <p>The most impactful family photography goes beyond appearances to capture unique family dynamics and stories. Learn techniques for discovering and incorporating these narratives into your sessions.</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&q=80',
    category: 'Family',
    tags: ['family photography', 'documentary', 'lifestyle'],
    author: 'Hariel Xavier',
    status: 'published',
    views: 0,
    featured: false,
    seo_title: 'Modern Family Photography | Contemporary Approaches and Techniques',
    seo_description: 'Discover contemporary approaches to family photography that go beyond traditional poses to capture authentic connections and create meaningful images.'
  }
];

/**
 * Creates new blog posts in Firestore
 */
export const createNewBlogPosts = async (): Promise<void> => {
  try {
    console.log('Creating new blog posts...');
    
    // Add each new post
    const postsRef = collection(db, 'posts');
    
    for (const post of newBlogPosts) {
      const now = serverTimestamp();
      
      // Check if a post with this slug already exists
      const slugQuery = query(postsRef, where('slug', '==', post.slug), limit(1));
      const slugSnapshot = await getDocs(slugQuery);
      
      if (slugSnapshot.empty) {
        await addDoc(collection(db, 'posts'), {
          ...post,
          created_at: now,
          updated_at: now,
          published_at: now
        });
        console.log(`Added post: ${post.title}`);
      } else {
        console.log(`Post with slug ${post.slug} already exists, skipping`);
      }
    }
    
    console.log('New blog posts creation complete!');
  } catch (error) {
    console.error('Error creating new blog posts:', error);
  }
};

// Execute the function when this script is run directly
if (require.main === module) {
  createNewBlogPosts()
    .then(() => console.log('Script completed successfully'))
    .catch(error => console.error('Script failed:', error));
}

export default createNewBlogPosts;
