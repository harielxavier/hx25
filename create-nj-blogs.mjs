import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, query, getDocs, limit, where } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const njWeddingBlogPosts = [
  {
    title: '15 Most Breathtaking Wedding Venues in New Jersey (2024 Guide)',
    slug: '15-breathtaking-wedding-venues-new-jersey-2024',
    excerpt: 'From elegant estates to rustic barns, discover the most stunning wedding venues across New Jersey that will make your dream wedding a reality.',
    content: `
      <p>Planning your New Jersey wedding and searching for the perfect venue? Look no further! As a premier wedding photographer who has captured countless celebrations across the Garden State, I'm sharing the 15 most breathtaking wedding venues in New Jersey.</p>
      
      <h2>1. The Ryland Inn - Whitehouse Station</h2>
      <p>This historic property combines rustic elegance with modern amenities. The barn-style venue features exposed wooden beams, soaring ceilings, and beautiful natural light—perfect for both ceremonies and receptions.</p>
      
      <h2>2. The Manor - West Orange</h2>
      <p>Known for its spectacular ballrooms and exceptional service, The Manor offers a classic, elegant setting for luxury weddings.</p>
      
      <h2>3. Farmhouse at The Grand Colonial - Hampton</h2>
      <p>This stunning venue offers both indoor and outdoor spaces with picturesque views of rolling hills.</p>
      
      <h2>4. Pleasantdale Chateau - West Orange</h2>
      <p>Set on 14 acres of manicured grounds, this French-style chateau offers fairy-tale elegance.</p>
      
      <h2>5. The Hilltop - Mendham</h2>
      <p>Perched on a hilltop with panoramic views, this venue is perfect for couples who want elegant simplicity.</p>
      
      <p>As your wedding photographer, I'll work with you to maximize the beauty of your chosen venue. Ready to book your dream New Jersey wedding? Let's connect!</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
    category: 'Wedding',
    tags: ['NJ weddings', 'wedding venues', 'New Jersey', 'venue guide'],
    author: 'Hariel Xavier',
    status: 'published',
    views: 0,
    featured: true,
    seo_title: '15 Best Wedding Venues in New Jersey (2024) | NJ Wedding Photographer',
    seo_description: 'Discover the 15 most breathtaking wedding venues in New Jersey, from elegant estates to rustic barns. Expert guide by a premier NJ wedding photographer.'
  },
  {
    title: 'Top 10 Wedding Photo Locations in New Jersey',
    slug: 'top-10-wedding-photo-locations-new-jersey',
    excerpt: 'Discover the most Instagram-worthy and romantic photo spots across New Jersey for your wedding day.',
    content: `
      <p>As a New Jersey wedding photographer, I've discovered countless stunning locations perfect for wedding photos. Here are my top 10 picks!</p>
      
      <h2>1. Liberty State Park, Jersey City</h2>
      <p>The Manhattan skyline backdrop is simply unbeatable. Golden hour here creates magic! Perfect for urban-elegant couples.</p>
      
      <h2>2. Duke Farms, Hillsborough</h2>
      <p>1,000+ acres of stunning gardens, lakes, and natural beauty. Every season offers something spectacular.</p>
      
      <h2>3. Grounds For Sculpture, Hamilton</h2>
      <p>Artistic couples love this location! 42 acres of sculptures and landscaped gardens create unique, creative backdrops.</p>
      
      <h2>4. Princeton University Campus</h2>
      <p>Gothic architecture and beautiful courtyards offer timeless, elegant photo opportunities.</p>
      
      <h2>5. Asbury Park Boardwalk</h2>
      <p>Vintage charm meets beachy vibes. The Convention Hall and boardwalk create fun, relaxed photos.</p>
      
      <h2>6. Allaire State Park, Wall Township</h2>
      <p>Historic village setting with rustic buildings and natural scenery—perfect for romantic, countryside vibes.</p>
      
      <h2>7. Skylands Manor, Ringwood</h2>
      <p>This castle-like mansion surrounded by botanical gardens is straight out of a fairytale.</p>
      
      <h2>8. Cape May Historic District</h2>
      <p>Victorian homes, charming streets, and beach access create diverse photo opportunities.</p>
      
      <h2>9. Branch Brook Park, Newark</h2>
      <p>Home to over 5,000 cherry blossom trees! April weddings here are absolutely spectacular.</p>
      
      <h2>10. Barnegat Lighthouse</h2>
      <p>Classic Jersey Shore imagery with dramatic coastal scenery. Sunset photos here are breathtaking.</p>
      
      <h2>Planning Your New Jersey Wedding Photos</h2>
      <p>When selecting locations, consider permits, timing, and travel logistics. I help couples navigate these details to ensure stunning photos without stress!</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&q=80',
    category: 'Wedding',
    tags: ['NJ wedding photography', 'photo locations', 'New Jersey', 'wedding venues'],
    author: 'Hariel Xavier',
    status: 'published',
    views: 0,
    featured: false,
    seo_title: 'Top 10 Wedding Photo Locations in NJ | Best Spots for Wedding Pictures',
    seo_description: 'Discover the most stunning wedding photo locations in New Jersey. From Liberty State Park to Cape May, find your perfect backdrop.'
  },
  {
    title: 'NJ Beach Wedding Photography: Complete Planning Guide',
    slug: 'nj-beach-wedding-photography-planning-guide',
    excerpt: 'Everything you need to know about planning and photographing a beautiful Jersey Shore wedding.',
    content: `
      <p>Dreaming of a Jersey Shore wedding? As a New Jersey wedding photographer specializing in beach weddings, I'm sharing everything you need to know!</p>
      
      <h2>Best Jersey Shore Wedding Locations</h2>
      <h3>Spring Lake</h3>
      <p>Known as the "Irish Riviera," Spring Lake offers pristine beaches and elegant Victorian architecture. The non-commercial beach creates a sophisticated backdrop.</p>
      
      <h3>Cape May</h3>
      <p>Historic Victorian charm meets beach beauty. The colorful houses and beautiful beaches offer diverse photo opportunities.</p>
      
      <h3>Asbury Park</h3>
      <p>Modern, artistic vibe with vintage touches. Perfect for couples wanting unique, creative beach wedding photos.</p>
      
      <h3>Long Beach Island</h3>
      <p>Miles of beautiful beaches with the iconic Barnegat Lighthouse. More relaxed, family-friendly atmosphere.</p>
      
      <h2>Timing Your Beach Wedding Photography</h2>
      <p>Golden hour (one hour before sunset) creates the most magical beach photos. However, morning ceremonies offer beautiful soft light and cooler temperatures.</p>
      
      <h2>What to Wear for Beach Wedding Photos</h2>
      <ul>
        <li>Choose lightweight, flowing fabrics that move beautifully in the breeze</li>
        <li>Avoid heavy trains that drag in the sand</li>
        <li>Consider ditching the shoes for barefoot beach photos</li>
        <li>Grooms: lighter suits or linen blend for comfort</li>
      </ul>
      
      <h2>Beach Wedding Photography Challenges & Solutions</h2>
      <h3>Wind</h3>
      <p>I embrace it! Flowing dresses and hair create romantic, dynamic images. Keep hair spray handy for more controlled moments.</p>
      
      <h3>Harsh Sunlight</h3>
      <p>We work with the light, not against it. Backlighting creates stunning effects, and I use reflectors to balance exposure.</p>
      
      <h3>Crowds</h3>
      <p>We scout quieter areas and time photos strategically. My experience at Jersey Shore locations helps us find the best spots.</p>
      
      <h2>Permits and Regulations</h2>
      <p>Many New Jersey beaches require permits for wedding photography. I help couples navigate these requirements for each location.</p>
      
      <h2>Best Time of Year for NJ Beach Weddings</h2>
      <p>May-June and September-October offer beautiful weather with fewer crowds. July-August are gorgeous but busier and hotter.</p>
      
      <h2>Making the Most of Your Beach Wedding</h2>
      <p>Trust your photographer's expertise with beach lighting, plan for extra time (beach walking takes longer!), and embrace the natural elements. The best beach wedding photos happen when you're relaxed and enjoying the moment!</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
    category: 'Wedding',
    tags: ['beach wedding', 'Jersey Shore', 'NJ wedding', 'beach photography'],
    author: 'Hariel Xavier',
    status: 'published',
    views: 0,
    featured: false,
    seo_title: 'Jersey Shore Beach Wedding Photography Guide | NJ Beach Wedding Tips',
    seo_description: 'Complete guide to planning your New Jersey beach wedding photography. Best locations, timing, and expert tips from a Jersey Shore wedding photographer.'
  },
  {
    title: 'Fall Wedding Photography in New Jersey: Capturing Peak Foliage',
    slug: 'fall-wedding-photography-new-jersey-foliage',
    excerpt: 'Make the most of New Jersey\'s stunning autumn colors with this complete guide to fall wedding photography.',
    content: `
      <p>Fall is the most popular wedding season in New Jersey, and for good reason! The vibrant foliage, comfortable temperatures, and golden light create absolutely stunning wedding photos.</p>
      
      <h2>When is Peak Foliage in New Jersey?</h2>
      <p>Peak fall colors typically occur mid-October in North Jersey and late October in South Jersey. However, early October through early November offers beautiful autumn scenery.</p>
      
      <h2>Best New Jersey Locations for Fall Wedding Photos</h2>
      
      <h3>Northern NJ (Peak: Early-Mid October)</h3>
      <ul>
        <li><strong>Skylands Manor, Ringwood</strong> - Surrounded by botanical gardens with incredible fall colors</li>
        <li><strong>The Ryland Inn, Whitehouse Station</strong> - Rolling countryside with vibrant autumn foliage</li>
        <li><strong>Branch Brook Park, Newark</strong> - Though famous for cherry blossoms, fall foliage is equally stunning</li>
      </ul>
      
      <h3>Central NJ (Peak: Mid-October)</h3>
      <ul>
        <li><strong>Duke Farms, Hillsborough</strong> - 1,000+ acres of stunning fall landscapes</li>
        <li><strong>The Stone House at Stirling Ridge</strong> - Historic charm surrounded by autumn beauty</li>
        <li><strong>Colonial Park, Somerset</strong> - Rose gardens and fall foliage combine beautifully</li>
      </ul>
      
      <h3>Southern NJ (Peak: Late October)</h3>
      <ul>
        <li><strong>Laurita Winery</strong> - Vineyard rows in autumn are spectacular</li>
        <li><strong>Smithville Village</strong> - Historic setting with beautiful fall scenery</li>
        <li><strong>Batsto Village</strong> - Pine Barrens beauty with autumn accents</li>
      </ul>
      
      <h2>Fall Wedding Photo Timing</h2>
      <p>Golden hour in October occurs earlier (around 5:30-6:30 PM). Plan your timeline accordingly! I recommend scheduling formal photos 1.5 hours before sunset for optimal lighting.</p>
      
      <h2>What to Wear for Fall Wedding Photos</h2>
      <h3>Color Palette Considerations</h3>
      <p>Earth tones, burgundy, navy, emerald, and metallics photograph beautifully against fall foliage. Avoid competing with the scenery—complement it!</p>
      
      <h3>Fabric Choices</h3>
      <p>Long sleeves look elegant in fall photos. Velvet, satin, and heavier fabrics photograph luxuriously and suit the season.</p>
      
      <h3>Accessories</h3>
      <p>Shawls, fur stoles, and wraps add elegance and practical warmth. They also create beautiful movement in photos!</p>
      
      <h2>Weather Considerations for NJ Fall Weddings</h2>
      <p>October weather in New Jersey can range from 45-70°F. Always have a backup plan for rain, but don't let weather worries stop you—some of the most dramatic fall photos happen on overcast days!</p>
      
      <h2>Incorporating Fall Elements</h2>
      <ul>
        <li>Pumpkins and gourds as props</li>
        <li>Apple orchards for engagement sessions</li>
        <li>Leaf toss photos (so fun!)</li>
        <li>Cozy blankets for outdoor portraits</li>
        <li>Fire pits for evening ambiance</li>
      </ul>
      
      <h2>Booking Your Fall Wedding Photographer</h2>
      <p>Fall is the busiest wedding season! Book your photographer 12-18 months in advance. Saturdays in October book up fastest, so consider Friday or Sunday weddings for more availability.</p>
      
      <h2>Making the Most of Fall Light</h2>
      <p>Fall offers incredible light! The sun sits lower in the sky, creating that coveted golden glow throughout the afternoon. As your photographer, I'll work with this beautiful natural light to create stunning, warm images that capture the magic of your autumn wedding.</p>
    `,
    featured_image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1200&q=80',
    category: 'Wedding',
    tags: ['fall wedding', 'autumn wedding', 'NJ wedding', 'fall foliage', 'seasonal photography'],
    author: 'Hariel Xavier',
    status: 'published',
    views: 0,
    featured: false,
    seo_title: 'NJ Fall Wedding Photography Guide | Capturing Peak Foliage 2024',
    seo_description: 'Complete guide to fall wedding photography in New Jersey. Best locations, timing, and tips for capturing stunning autumn wedding photos.'
  }
];

async function createBlogPosts() {
  try {
    console.log('Creating NJ wedding blog posts...');
    
    const postsRef = collection(db, 'posts');
    
    for (const post of njWeddingBlogPosts) {
      const now = serverTimestamp();
      
      const slugQuery = query(postsRef, where('slug', '==', post.slug), limit(1));
      const slugSnapshot = await getDocs(slugQuery);
      
      if (slugSnapshot.empty) {
        await addDoc(postsRef, {
          ...post,
          created_at: now,
          updated_at: now,
          published_at: now
        });
        console.log(`✅ Added post: ${post.title}`);
      } else {
        console.log(`⏭️  Post with slug ${post.slug} already exists, skipping`);
      }
    }
    
    console.log('\n🎉 NJ wedding blog posts creation complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating NJ wedding blog posts:', error);
    process.exit(1);
  }
}

createBlogPosts();
