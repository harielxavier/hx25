// This script creates sample blog posts in Firestore
// Run with: node --experimental-specifier-resolution=node src/scripts/createSampleBlogPosts.js

import { collection, getDocs, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export async function createSampleBlogPosts() {
  try {
    // Check if posts already exist
    const postsCollection = collection(db, 'blog_posts');
    const querySnapshot = await getDocs(postsCollection);
    
    // Count published posts
    let publishedPostCount = 0;
    querySnapshot.forEach(doc => {
      const data = doc.data();
      if (data.status === 'published') {
        publishedPostCount++;
      }
    });
    
    // If there are already 6 or more published posts, don't create more
    if (publishedPostCount >= 6) {
      console.log('Sample posts already exist. Skipping creation.');
      return;
    }
    
    // Create sample posts
    const samplePosts = [
      {
        title: "Mastering Landscape Photography: Techniques and Tips",
        slug: "mastering-landscape-photography",
        excerpt: "Explore techniques for capturing breathtaking landscape photos in any environment and lighting condition.",
        content: `
          <h1>Mastering Landscape Photography: Techniques and Tips</h1>
          
          <p>Landscape photography is one of the most rewarding genres in photography. There's something magical about capturing the beauty of nature in a single frame that can transport viewers to that location.</p>
          
          <h2>Finding the Perfect Location</h2>
          <p>Research is key when it comes to landscape photography. Use apps like PhotoPills or The Photographer's Ephemeris to plan your shoot around the best light. Scout locations in advance when possible, and always have a backup plan in case weather conditions change.</p>
          
          <h2>The Golden Hours</h2>
          <p>The hours around sunrise and sunset provide the most dramatic and flattering light for landscape photography. The low angle of the sun creates long shadows, enhances textures, and bathes the landscape in warm, golden light.</p>
          
          <h2>Composition Techniques</h2>
          <ul>
            <li><strong>Rule of Thirds</strong>: Place key elements along the grid lines or at their intersections.</li>
            <li><strong>Leading Lines</strong>: Use natural lines like rivers, roads, or shorelines to lead the viewer's eye through the image.</li>
            <li><strong>Foreground Interest</strong>: Include compelling elements in the foreground to create depth.</li>
            <li><strong>Frame Within a Frame</strong>: Use natural elements like tree branches or rock formations to frame your subject.</li>
          </ul>
          
          <h2>Essential Equipment</h2>
          <ul>
            <li>A sturdy tripod is non-negotiable for landscape photography</li>
            <li>Wide-angle lens (16-35mm) for expansive scenes</li>
            <li>Neutral density filters to control exposure in bright conditions</li>
            <li>Polarizing filter to reduce reflections and enhance colors</li>
            <li>Remote shutter release to avoid camera shake</li>
          </ul>
          
          <h2>Post-Processing Tips</h2>
          <ul>
            <li>Use graduated filters in Lightroom to balance exposure between sky and land</li>
            <li>Enhance colors selectively rather than applying global saturation</li>
            <li>Pay attention to the horizon line and ensure it's level</li>
            <li>Use the dehaze tool sparingly to add clarity to distant elements</li>
          </ul>
          
          <p>Remember, the best landscape photographs tell a story and evoke emotion. Don't just document a scene—interpret it through your unique vision.</p>
        `,
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        category: "Landscape",
        tags: ["landscape photography", "composition", "outdoor photography", "nature photography"],
        status: "published",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        publishedAt: Timestamp.now(),
        featured: true,
        author: {
          name: "Hariel Xavier",
          avatar: "/images/author.jpg",
          bio: "Professional photographer with over 10 years of experience capturing life's precious moments."
        },
        views: 215,
        readTime: "6 min read",
        seo: {
          title: "Mastering Landscape Photography - Techniques and Tips",
          description: "Explore techniques for capturing breathtaking landscape photos in any environment and lighting condition.",
          keywords: ["landscape photography", "composition", "outdoor photography", "nature photography"],
          ogImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
        }
      },
      {
        title: "The Art of Portrait Photography: Connecting with Your Subject",
        slug: "art-of-portrait-photography",
        excerpt: "Learn how to create meaningful portrait photographs that capture the essence of your subject.",
        content: `
          <h1>The Art of Portrait Photography: Connecting with Your Subject</h1>
          
          <p>Portrait photography is about much more than just taking a picture of someone's face. It's about capturing personality, emotion, and the essence of who they are in a single frame.</p>
          
          <h2>Building Rapport</h2>
          <p>The most important skill in portrait photography isn't technical—it's interpersonal. Take time to talk with your subject before the session. Learn about their interests, what makes them comfortable, and what they hope to see in their portraits.</p>
          
          <h2>Directing Without Controlling</h2>
          <p>Give your subjects enough direction that they feel confident, but not so much that they become stiff. Simple prompts like "Think about something that made you laugh recently" can elicit genuine expressions.</p>
          
          <h2>The Eyes Have It</h2>
          <p>The eyes are the focal point of most portraits. Ensure they're sharp, well-lit, and expressive. A catchlight (the reflection of your light source in the eyes) adds life and dimension.</p>
          
          <h2>Lighting for Portraits</h2>
          <ul>
            <li><strong>Rembrandt lighting</strong>: Creates a triangle of light on the cheek opposite the light source</li>
            <li><strong>Butterfly lighting</strong>: Places the light source directly in front of and above the subject</li>
            <li><strong>Split lighting</strong>: Illuminates half the face, creating dramatic contrast</li>
            <li><strong>Loop lighting</strong>: Creates a small shadow of the nose on the cheek</li>
          </ul>
          
          <h2>Lens Selection</h2>
          <p>A medium telephoto lens (85-135mm) is ideal for portraits. This focal length creates flattering compression and allows you to maintain a comfortable distance from your subject.</p>
          
          <h2>Post-Processing Considerations</h2>
          <ul>
            <li>Skin retouching should be subtle—preserve texture and character</li>
            <li>Pay attention to color tones, especially skin tones</li>
            <li>Consider the mood you want to convey with your color grading</li>
            <li>Black and white conversion can emphasize form and expression</li>
          </ul>
          
          <p>Remember, the best portraits reveal something about the subject that might otherwise go unnoticed. Your job as a portrait photographer is to see people as they are and help them see themselves through your eyes.</p>
        `,
        image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        category: "Portrait",
        tags: ["portrait photography", "people", "lighting", "posing"],
        status: "published",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        publishedAt: Timestamp.now(),
        featured: false,
        author: {
          name: "Hariel Xavier",
          avatar: "/images/author.jpg",
          bio: "Professional photographer with over 10 years of experience capturing life's precious moments."
        },
        views: 187,
        readTime: "5 min read",
        seo: {
          title: "The Art of Portrait Photography - Connecting with Your Subject",
          description: "Learn how to create meaningful portrait photographs that capture the essence of your subject.",
          keywords: ["portrait photography", "people", "lighting", "posing"],
          ogImage: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
        }
      },
      {
        title: "Essential Gear for Wedding Photography",
        slug: "essential-gear-wedding-photography",
        excerpt: "A comprehensive guide to the camera equipment and accessories every wedding photographer should have in their kit.",
        content: `
          <h1>Essential Gear for Wedding Photography</h1>
          
          <p>Wedding photography demands versatility, reliability, and preparedness. From dimly lit ceremonies to fast-paced receptions, your gear needs to perform flawlessly in a variety of challenging conditions.</p>
          
          <h2>Camera Bodies</h2>
          <p>For wedding photography, having backup equipment isn't optional—it's essential:</p>
          <ul>
            <li>Carry at least two professional-grade camera bodies</li>
            <li>Look for cameras with good low-light performance (high ISO capabilities)</li>
            <li>Dual card slots provide immediate backup of irreplaceable moments</li>
            <li>Silent shooting modes are valuable during ceremonies</li>
            <li>Good battery life or plenty of spares is crucial for long wedding days</li>
          </ul>
          
          <h2>Essential Lenses</h2>
          <p>A versatile lens selection helps you adapt to changing wedding environments:</p>
          <ul>
            <li><strong>24-70mm f/2.8:</strong> The workhorse zoom for getting ready shots, group photos, and reception coverage</li>
            <li><strong>70-200mm f/2.8:</strong> Perfect for ceremonies, candid moments, and portraits with beautiful compression</li>
            <li><strong>Prime lenses:</strong> 35mm, 50mm, and 85mm options are excellent in low light with beautiful bokeh for portraits</li>
            <li><strong>Macro lens:</strong> For detail shots of rings, invitations, and other small elements</li>
            <li><strong>Wide-angle lens:</strong> 16-35mm for venue shots, large group photos, and tight spaces</li>
          </ul>
          
          <h2>Lighting Equipment</h2>
          <p>Wedding lighting conditions can change dramatically throughout the day:</p>
          <ul>
            <li>Multiple speedlights/flashes with wireless triggers</li>
            <li>Flash modifiers (diffusers, bounce cards, grids)</li>
            <li>LED continuous lights for video or dark getting-ready rooms</li>
            <li>Reflectors and diffusers for outdoor portraits</li>
            <li>Light stands and brackets for off-camera flash setups</li>
          </ul>
          
          <h2>Memory Cards and Storage</h2>
          <p>Don't compromise on storage solutions:</p>
          <ul>
            <li>Multiple high-speed, high-capacity memory cards</li>
            <li>Memory card case for organization and protection</li>
            <li>Portable hard drives for backup during the wedding day</li>
            <li>Consider a laptop for immediate backups at longer events</li>
          </ul>
          
          <h2>Accessories and Support Gear</h2>
          <p>These items round out a complete wedding photography kit:</p>
          <ul>
            <li>Multiple camera straps or harness systems for carrying two bodies</li>
            <li>Sturdy tripod for formal portraits and low-light situations</li>
            <li>Monopod for stability during long ceremonies</li>
            <li>Plenty of extra batteries for cameras and flashes</li>
            <li>Battery chargers and power banks</li>
            <li>Lens cleaning supplies</li>
            <li>Comfortable, professional camera bag</li>
            <li>Emergency kit (gaffer tape, safety pins, energy bars, pain relievers)</li>
          </ul>
          
          <p>While this list may seem extensive, wedding photography requires preparation for any situation. You don't need to acquire everything at once—many photographers gradually build their kit as they gain experience and book more weddings.</p>
        `,
        image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        category: "Wedding",
        tags: ["wedding photography", "camera gear", "equipment", "professional photography"],
        status: "published",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        publishedAt: Timestamp.now(),
        featured: true,
        author: {
          name: "Hariel Xavier",
          avatar: "/images/author.jpg",
          bio: "Professional photographer with over 10 years of experience capturing life's precious moments."
        },
        views: 342,
        readTime: "7 min read",
        seo: {
          title: "Essential Gear for Wedding Photography - Complete Guide",
          description: "A comprehensive guide to the camera equipment and accessories every wedding photographer should have in their kit.",
          keywords: ["wedding photography", "camera gear", "photography equipment", "professional photography"],
          ogImage: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
        }
      },
      {
        title: "Understanding Light: The Foundation of Great Photography",
        slug: "understanding-light-foundation-photography",
        excerpt: "Master the fundamentals of light in photography to elevate your images from good to extraordinary.",
        content: `
          <h1>Understanding Light: The Foundation of Great Photography</h1>
          
          <p>Light is the raw material of photography. Understanding how to see, interpret, and manipulate light is what separates casual snapshots from compelling photographs.</p>
          
          <h2>The Four Characteristics of Light</h2>
          <p>To master light, you need to understand its four key characteristics:</p>
          <ul>
            <li><strong>Quality:</strong> Hard light creates strong shadows and contrast, while soft light produces gentle transitions and flattering effects</li>
            <li><strong>Direction:</strong> Where light comes from relative to your subject dramatically affects mood and dimension</li>
            <li><strong>Color:</strong> The color temperature of light influences the emotional tone of your image</li>
            <li><strong>Intensity:</strong> The brightness of light affects exposure settings and the overall feel of your photograph</li>
          </ul>
          
          <h2>Natural Light Throughout the Day</h2>
          <p>The sun offers an ever-changing light source:</p>
          <ul>
            <li><strong>Golden Hour:</strong> The hour after sunrise and before sunset provides warm, directional light with soft shadows</li>
            <li><strong>Blue Hour:</strong> The time just before sunrise and after sunset offers ethereal blue tones perfect for cityscapes and landscapes</li>
            <li><strong>Midday Light:</strong> Often harsh but can be dramatic for black and white photography or when diffused through clouds</li>
            <li><strong>Overcast Days:</strong> Nature's softbox, providing even, diffused light ideal for portraits and saturated colors</li>
          </ul>
          
          <h2>Reading and Shaping Light</h2>
          <p>Developing your ability to see light is crucial:</p>
          <ul>
            <li>Practice observing how light interacts with different subjects and surfaces</li>
            <li>Look for catchlights in eyes, highlight and shadow transitions, and reflections</li>
            <li>Use reflectors to bounce light into shadow areas</li>
            <li>Employ diffusers to soften harsh light</li>
            <li>Position subjects relative to light sources to create desired effects</li>
          </ul>
          
          <h2>Artificial Lighting Fundamentals</h2>
          <p>When natural light isn't enough:</p>
          <ul>
            <li><strong>On-camera flash:</strong> Convenient but often creates flat lighting unless modified</li>
            <li><strong>Off-camera flash:</strong> Provides dimensional lighting and creative control</li>
            <li><strong>Continuous lighting:</strong> Allows you to see the effect before shooting, ideal for beginners</li>
            <li><strong>Light modifiers:</strong> Softboxes, umbrellas, grids, and snoots shape light for specific effects</li>
          </ul>
          
          <h2>Creative Lighting Techniques</h2>
          <p>Expand your lighting repertoire with these approaches:</p>
          <ul>
            <li><strong>Backlighting:</strong> Creates rim lighting and dramatic silhouettes</li>
            <li><strong>Side lighting:</strong> Reveals texture and creates dimension</li>
            <li><strong>Chiaroscuro:</strong> Dramatic contrast between light and dark areas</li>
            <li><strong>Low-key lighting:</strong> Predominantly dark tones with selective highlights</li>
            <li><strong>High-key lighting:</strong> Bright, airy images with minimal shadows</li>
          </ul>
          
          <p>Remember that there is no "perfect" light—only light that serves your creative vision. The more you practice seeing and working with different lighting conditions, the more versatile and confident you'll become as a photographer.</p>
        `,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        category: "Technique",
        tags: ["lighting", "photography basics", "natural light", "studio lighting"],
        status: "published",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        publishedAt: Timestamp.now(),
        featured: false,
        author: {
          name: "Hariel Xavier",
          avatar: "/images/author.jpg",
          bio: "Professional photographer with over 10 years of experience capturing life's precious moments."
        },
        views: 276,
        readTime: "6 min read",
        seo: {
          title: "Understanding Light: The Foundation of Great Photography",
          description: "Master the fundamentals of light in photography to elevate your images from good to extraordinary.",
          keywords: ["photography lighting", "natural light", "artificial lighting", "light direction"],
          ogImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
        }
      },
      {
        title: "Building Your Photography Portfolio: A Step-by-Step Guide",
        slug: "building-photography-portfolio-guide",
        excerpt: "Learn how to create a compelling photography portfolio that showcases your best work and attracts your ideal clients.",
        content: `
          <h1>Building Your Photography Portfolio: A Step-by-Step Guide</h1>
          
          <p>Your photography portfolio is more than just a collection of images—it's a strategic marketing tool that showcases your skills, defines your style, and attracts your ideal clients.</p>
          
          <h2>Define Your Purpose and Audience</h2>
          <p>Before selecting a single image, clarify your goals:</p>
          <ul>
            <li>Identify the specific type of work you want to attract</li>
            <li>Research and define your ideal client persona</li>
            <li>Determine if you need different portfolios for different services</li>
            <li>Consider how and where your portfolio will be viewed (print, online, social media)</li>
          </ul>
          
          <h2>Curate Your Best Work</h2>
          <p>Quality always trumps quantity in portfolio creation:</p>
          <ul>
            <li>Start with a large collection of your best work, then ruthlessly edit down</li>
            <li>Include only your strongest images that represent your desired style and clients</li>
            <li>Aim for 15-25 images for a focused online portfolio</li>
            <li>Ask for honest feedback from trusted colleagues or mentors</li>
            <li>Remove any image that doesn't immediately impress or that you need to "explain"</li>
          </ul>
          
          <h2>Create a Cohesive Narrative</h2>
          <p>Your portfolio should tell a cohesive story:</p>
          <ul>
            <li>Arrange images in a logical sequence that guides viewers through your work</li>
            <li>Start and end with particularly strong images</li>
            <li>Consider how images relate to each other in terms of color, mood, and subject</li>
            <li>For client-focused portfolios, include complete stories (e.g., a wedding from start to finish)</li>
            <li>Maintain consistent editing style throughout</li>
          </ul>
          
          <h2>Choose the Right Platform</h2>
          <p>Select portfolio platforms that serve your specific needs:</p>
          <ul>
            <li>Dedicated website with a custom domain (WordPress, Squarespace, Format, etc.)</li>
            <li>Portfolio-specific platforms (Behance, Adobe Portfolio)</li>
            <li>Social media platforms as supplementary showcases (Instagram, Pinterest)</li>
            <li>Consider print portfolios for in-person client meetings</li>
          </ul>
          
          <h2>Optimize for Viewing Experience</h2>
          <p>Make your portfolio easy and enjoyable to navigate:</p>
          <ul>
            <li>Ensure fast loading times by properly sizing and optimizing images</li>
            <li>Create a clean, distraction-free design that puts focus on your work</li>
            <li>Make navigation intuitive and straightforward</li>
            <li>Ensure mobile responsiveness for on-the-go viewing</li>
            <li>Include appropriate metadata and alt text for accessibility and SEO</li>
          </ul>
          
          <h2>Regularly Update and Refine</h2>
          <p>Your portfolio should evolve as your skills and business grow:</p>
          <ul>
            <li>Schedule regular portfolio reviews (quarterly or bi-annually)</li>
            <li>Replace older work with newer, stronger images</li>
            <li>Track which images receive the most engagement or client inquiries</li>
            <li>Adjust based on the type of work you're attracting vs. wanting</li>
          </ul>
          
          <p>Creating an effective photography portfolio is a balance of artistic expression and strategic marketing. By thoughtfully curating and presenting your work, you not only showcase your technical and creative abilities but also communicate your unique vision and value to potential clients.</p>
        `,
        image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        category: "Business",
        tags: ["portfolio", "photography business", "marketing", "professional development"],
        status: "published",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        publishedAt: Timestamp.now(),
        featured: false,
        author: {
          name: "Hariel Xavier",
          avatar: "/images/author.jpg",
          bio: "Professional photographer with over 10 years of experience capturing life's precious moments."
        },
        views: 198,
        readTime: "7 min read",
        seo: {
          title: "Building Your Photography Portfolio: A Step-by-Step Guide",
          description: "Learn how to create a compelling photography portfolio that showcases your best work and attracts your ideal clients.",
          keywords: ["photography portfolio", "portfolio building", "photography business", "marketing for photographers"],
          ogImage: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
        }
      },
      {
        title: "Mobile Photography: Professional Results with Your Smartphone",
        slug: "mobile-photography-professional-results-smartphone",
        excerpt: "Discover techniques and apps that will help you create stunning professional-quality photos using just your smartphone.",
        content: `
          <h1>Mobile Photography: Professional Results with Your Smartphone</h1>
          
          <p>Smartphone cameras have evolved dramatically in recent years, enabling photographers to capture professional-quality images without carrying bulky equipment. With the right techniques and tools, your phone can be a powerful creative instrument.</p>
          
          <h2>Understanding Your Smartphone Camera</h2>
          <p>Get to know your device's capabilities:</p>
          <ul>
            <li>Learn about all available camera modes (portrait, night, panorama, etc.)</li>
            <li>Understand your phone's multiple lenses and when to use each</li>
            <li>Explore manual controls if available (exposure, focus, white balance)</li>
            <li>Familiarize yourself with HDR and when to enable/disable it</li>
            <li>Test your phone's low-light capabilities and limitations</li>
          </ul>
          
          <h2>Composition Principles for Mobile</h2>
          <p>The same composition rules apply to mobile photography:</p>
          <ul>
            <li>Use the rule of thirds grid (enable it in your camera settings)</li>
            <li>Look for leading lines to create depth</li>
            <li>Pay attention to negative space</li>
            <li>Simplify your compositions—less is often more on the smaller screen</li>
            <li>Try unusual perspectives that smartphones make easy (very low or overhead shots)</li>
          </ul>
          
          <h2>Lighting for Smartphone Photography</h2>
          <p>Light remains the most important factor:</p>
          <ul>
            <li>Avoid using the built-in flash whenever possible</li>
            <li>Use window light for indoor portraits</li>
            <li>Shoot during golden hour for warm, flattering outdoor light</li>
            <li>Create silhouettes by placing subjects against bright backgrounds</li>
            <li>Consider small portable LED lights for more control</li>
            <li>Use reflective surfaces (white paper, car sunshade) as makeshift reflectors</li>
          </ul>
          
          <h2>Essential Mobile Photography Apps</h2>
          <p>Expand your capabilities with these apps:</p>
          <ul>
            <li><strong>Camera replacement apps:</strong> Halide, ProCamera, Camera+ 2</li>
            <li><strong>Editing apps:</strong> Snapseed, Lightroom Mobile, VSCO</li>
            <li><strong>Specialized tools:</strong> TouchRetouch (object removal), Slow Shutter Cam (long exposures)</li>
            <li><strong>Creative effects:</strong> Prisma, Afterlight, RNI Films</li>
            <li><strong>Planning tools:</strong> PhotoPills, The Photographer's Ephemeris</li>
          </ul>
          
          <h2>Advanced Mobile Photography Techniques</h2>
          <p>Push your smartphone photography further:</p>
          <ul>
            <li>Use burst mode for action shots</li>
            <li>Create panoramas for expansive landscapes</li>
            <li>Try focus stacking for macro photography</li>
            <li>Experiment with long exposure effects</li>
            <li>Use portrait mode creatively for subjects beyond people</li>
            <li>Shoot in RAW format when available for maximum editing flexibility</li>
          </ul>
          
          <h2>Accessories to Enhance Mobile Photography</h2>
          <p>Consider these tools to expand your capabilities:</p>
          <ul>
            <li>Clip-on lenses (wide-angle, macro, fisheye)</li>
            <li>Smartphone gimbal for stable video and long exposures</li>
            <li>Mini tripod and phone mount</li>
            <li>Remote shutter release (often built into earbuds)</li>
            <li>External LED lights designed for smartphones</li>
          </ul>
          
          <p>Remember that the best camera is the one you have with you. Your smartphone's portability means you'll capture moments you might otherwise miss. Embrace its strengths, work around its limitations, and focus on developing your eye for composition and light.</p>
        `,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        category: "Mobile",
        tags: ["smartphone photography", "mobile photography", "iphone photography", "photography apps"],
        status: "published",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        publishedAt: Timestamp.now(),
        featured: false,
        author: {
          name: "Hariel Xavier",
          avatar: "/images/author.jpg",
          bio: "Professional photographer with over 10 years of experience capturing life's precious moments."
        },
        views: 231,
        readTime: "6 min read",
        seo: {
          title: "Mobile Photography: Professional Results with Your Smartphone",
          description: "Discover techniques and apps that will help you create stunning professional-quality photos using just your smartphone.",
          keywords: ["smartphone photography", "mobile photography", "iphone photography", "photography apps"],
          ogImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
        }
      }
    ];

    // Add each sample post to Firestore
    for (const post of samplePosts) {
      // Use the slug as the document ID for easier retrieval
      await setDoc(doc(db, 'blog_posts', post.slug), post);
      console.log(`Created post: ${post.title}`);
    }
    
    console.log('Sample blog posts created successfully!');
  } catch (error) {
    console.error('Error creating sample blog posts:', error);
  }
}

// Uncomment to run directly
createSampleBlogPosts();
