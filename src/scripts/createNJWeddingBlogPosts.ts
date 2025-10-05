import { collection, addDoc, serverTimestamp, query, getDocs, limit, where } from 'firebase/firestore';
import { db } from '../firebase/config';

// Killer blog posts targeting NJ brides
const njWeddingBlogPosts = [
  {
    title: '15 Most Breathtaking Wedding Venues in New Jersey (2024 Guide)',
    slug: '15-breathtaking-wedding-venues-new-jersey-2024',
    excerpt: 'From elegant estates to rustic barns, discover the most stunning wedding venues across New Jersey that will make your dream wedding a reality.',
    content: `
      <p>Planning your New Jersey wedding and searching for the perfect venue? Look no further! As a premier wedding photographer who has captured countless celebrations across the Garden State, I'm sharing the 15 most breathtaking wedding venues in New Jersey.</p>
      
      <h2>1. The Ryland Inn - Whitehouse Station</h2>
      <p>This historic property combines rustic elegance with modern amenities. The barn-style venue features exposed wooden beams, soaring ceilings, and beautiful natural light—perfect for both ceremonies and receptions. The surrounding countryside provides stunning photo opportunities.</p>
      
      <h2>2. The Manor - West Orange</h2>
      <p>Known for its spectacular ballrooms and exceptional service, The Manor offers a classic, elegant setting for luxury weddings. Their crystal chandeliers and ornate details create a timeless ambiance.</p>
      
      <h2>3. Farmhouse at The Grand Colonial - Hampton</h2>
      <p>This stunning venue offers both indoor and outdoor spaces with picturesque views of rolling hills. The rustic-chic aesthetic is perfect for couples seeking a blend of elegance and countryside charm.</p>
      
      <h2>4. Pleasantdale Chateau - West Orange</h2>
      <p>Set on 14 acres of manicured grounds, this French-style chateau offers fairy-tale elegance. The European-inspired architecture and lush gardens create endless photo opportunities.</p>
      
      <h2>5. The Hilltop - Mendham</h2>
      <p>Perched on a hilltop with panoramic views, this venue is perfect for couples who want elegant simplicity. The floor-to-ceiling windows flood the space with natural light.</p>
      
      <h2>6. The Palace at Somerset Park - Somerset</h2>
      <p>This grand venue features ornate ballrooms, crystal chandeliers, and impeccable service. Perfect for couples planning a luxury celebration.</p>
      
      <h2>7. Mallard Island Yacht Club - Manahawkin</h2>
      <p>For waterfront wedding dreams, this venue offers stunning views of the bay. The nautical elegance and sunset backdrops are photographer favorites.</p>
      
      <h2>8. The Stone House at Stirling Ridge - Warren</h2>
      <p>This restored 18th-century stone house combines historic charm with modern amenities. The surrounding gardens and natural settings are perfect for romantic wedding photos.</p>
      
      <h2>9. Liberty House Restaurant - Jersey City</h2>
      <p>With unparalleled Manhattan skyline views, this waterfront venue is perfect for sophisticated urban weddings. The floor-to-ceiling windows make for dramatic ceremony backdrops.</p>
      
      <h2>10. The Park Savoy Estate - Florham Park</h2>
      <p>This European-style estate offers multiple elegant ballrooms and beautiful outdoor spaces. The manicured grounds provide countless photo opportunities.</p>
      
      <h2>11. The Grove - Cedar Grove</h2>
      <p>Nestled in the woods, this modern venue features floor-to-ceiling windows overlooking a serene pond. The contemporary aesthetic appeals to modern couples.</p>
      
      <h2>12. Perona Farms - Andover</h2>
      <p>This rustic-elegant barn venue is surrounded by beautiful countryside. The exposed beams, chandeliers, and natural surroundings create the perfect romantic atmosphere.</p>
      
      <h2>13. The Madison Hotel - Morristown</h2>
      <p>For couples seeking luxury hotel elegance, this venue offers sophisticated spaces and exceptional service. The ballroom features classic elegance with modern touches.</p>
      
      <h2>14. Bonnet Island Estate - Manahawkin</h2>
      <p>This waterfront estate offers panoramic bay views and multiple event spaces. The nautical elegance and stunning sunsets make every photo magical.</p>
      
      <h2>15. The Skylands at Randolph - Randolph</h2>
      <p>This versatile venue offers both rustic charm and modern elegance. The barn-style space with its romantic lighting and natural wood tones creates the perfect ambiance.</p>
      
      <h2>Choosing Your Perfect New Jersey Wedding Venue</h2>
      <p>When selecting your venue, consider the season, your guest count, your wedding style, and most importantly—how the venue makes you feel. Each of these venues offers something unique, from waterfront elegance to rustic charm.</p>
      
      <p>As your wedding photographer, I'll work with you to maximize the beauty of your chosen venue, capturing every moment against the stunning backdrop you've selected. Ready to book your dream New Jersey wedding? Let's connect!</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
    category: 'Wedding',
    tags: ['NJ weddings', 'wedding venues', 'New Jersey', 'venue guide', 'wedding planning'],
    author: 'Hariel Xavier',
    status: 'published',
    views: 0,
    featured: true,
    seo_title: '15 Best Wedding Venues in New Jersey (2024) | NJ Wedding Photographer Guide',
    seo_description: 'Discover the 15 most breathtaking wedding venues in New Jersey, from elegant estates to rustic barns. Expert guide by a premier NJ wedding photographer.'
  },
  {
    title: 'New Jersey Wedding Photography: Ultimate Guide for 2024 Brides',
    slug: 'nj-wedding-photography-ultimate-guide-2024-brides',
    excerpt: 'Everything you need to know about choosing your New Jersey wedding photographer and capturing your perfect day.',
    content: `
      <p>Your wedding day is one of the most important days of your life, and choosing the right photographer to capture it is crucial. As a New Jersey wedding photographer with years of experience capturing celebrations across the Garden State, I'm sharing everything you need to know.</p>
      
      <h2>Why New Jersey Wedding Photography Is Unique</h2>
      <p>New Jersey offers incredible diversity in wedding settings—from waterfront venues along the Jersey Shore to elegant estates in the countryside, urban sophistication in Jersey City, and rustic charm in Sussex County. Your photographer should understand how to make the most of these distinct locations.</p>
      
      <h2>When to Book Your NJ Wedding Photographer</h2>
      <p>The best New Jersey wedding photographers book up 12-18 months in advance, especially for popular wedding months (May, June, September, October). For spring and fall weddings, start your search as soon as you've set your date.</p>
      
      <h2>What to Look for in a New Jersey Wedding Photographer</h2>
      <h3>1. Experience with NJ Venues</h3>
      <p>A photographer familiar with New Jersey venues will know the best photo locations, lighting conditions, and timing for optimal shots. They'll have relationships with venue coordinators and know how to navigate unique venue rules.</p>
      
      <h3>2. Weather Preparedness</h3>
      <p>New Jersey weather can be unpredictable. Your photographer should have contingency plans for rain, extreme heat, or unexpected conditions, and should be skilled at working with indoor lighting.</p>
      
      <h3>3. Style That Matches Your Vision</h3>
      <p>Review photographer portfolios carefully. Are you drawn to light and airy images? Moody and dramatic? Candid documentary style? Choose a photographer whose natural style aligns with your aesthetic.</p>
      
      <h2>New Jersey Wedding Photography Investment</h2>
      <p>Professional wedding photography in New Jersey typically ranges from $3,000-$8,000+ depending on experience, coverage hours, and deliverables. Remember—these photos will be your lasting memories, making it one of the most valuable investments in your wedding.</p>
      
      <h2>Popular New Jersey Wedding Photo Locations</h2>
      <ul>
        <li>Liberty State Park (Jersey City) - Manhattan skyline views</li>
        <li>Duke Farms (Hillsborough) - lush gardens and landscapes</li>
        <li>Asbury Park Boardwalk - beach and urban blend</li>
        <li>Princeton University Campus - classic architecture</li>
        <li>Grounds For Sculpture (Hamilton) - artistic backdrop</li>
      </ul>
      
      <h2>Questions to Ask Your NJ Wedding Photographer</h2>
      <ol>
        <li>How many weddings have you photographed at my venue?</li>
        <li>What's your backup plan for equipment failure?</li>
        <li>Do you have backup photographers available if needed?</li>
        <li>What's your turnaround time for photos?</li>
        <li>How many photos will we receive?</li>
        <li>Do you offer engagement sessions?</li>
        <li>What's included in your packages?</li>
      </ol>
      
      <h2>Seasonal Considerations for NJ Weddings</h2>
      <h3>Spring Weddings (March-May)</h3>
      <p>Cherry blossoms, tulips, and fresh greenery create beautiful backdrops. Be prepared for occasional rain but enjoy mild temperatures.</p>
      
      <h3>Summer Weddings (June-August)</h3>
      <p>Long daylight hours allow for sunset photos, but humidity can be challenging. Plan for midday shade and stay hydrated.</p>
      
      <h3>Fall Weddings (September-November)</h3>
      <p>Peak foliage in October creates stunning photos. Comfortable temperatures and gorgeous colors make fall incredibly popular.</p>
      
      <h3>Winter Weddings (December-February)</h3>
      <p>Dramatic lighting, potential for snow photos, and cozy indoor venues. Earlier sunsets require adjusted timeline planning.</p>
      
      <h2>Making the Most of Your NJ Wedding Photos</h2>
      <p>Trust your photographer's expertise, build in extra time for photos in your timeline, prepare a short "must-have" shot list, and most importantly—be present in the moments. The best photos happen when you're genuinely enjoying your celebration.</p>
      
      <p>Ready to book your New Jersey wedding photographer? Let's connect and start planning how to capture your perfect day!</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200',
    category: 'Wedding',
    tags: ['NJ wedding photographer', 'New Jersey weddings', 'wedding photography tips', 'bride guide', 'wedding planning'],
    author: 'Hariel Xavier',
    status: 'published',
    views: 0,
    featured: true,
    seo_title: 'NJ Wedding Photography Guide 2024 | Everything Brides Need to Know',
    seo_description: 'Complete guide to New Jersey wedding photography. Learn when to book, what to look for, and how to choose the perfect photographer for your NJ wedding.'
  }
];

// Continue with more posts in next comment due to length...

export const createNJWeddingBlogPosts = async (): Promise<void> => {
  try {
    console.log('Creating NJ wedding blog posts...');
    
    const postsRef = collection(db, 'posts');
    
    for (const post of njWeddingBlogPosts) {
      const now = serverTimestamp();
      
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
    
    console.log('NJ wedding blog posts creation complete!');
  } catch (error) {
    console.error('Error creating NJ wedding blog posts:', error);
  }
};

export default createNJWeddingBlogPosts;
