// Script to create blog images for all blog posts
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source directory for wedding stock images
const sourceDir = path.join(__dirname, '../public/images/stock/wedding');
// Target directory for blog images
const targetDir = path.join(__dirname, '../public/images/stock/blog');

// Blog categories and their corresponding image styles
const blogCategories = [
  { name: 'Wedding', count: 5, style: { brightness: 1.0, saturation: 1.2 } },
  { name: 'Engagement', count: 3, style: { brightness: 1.1, saturation: 1.1 } },
  { name: 'Portrait', count: 3, style: { brightness: 1.05, saturation: 1.0 } },
  { name: 'Equipment', count: 2, style: { brightness: 0.95, saturation: 0.9 } },
  { name: 'Business', count: 2, style: { brightness: 1.0, saturation: 0.95 } },
  { name: 'Tips', count: 3, style: { brightness: 1.1, saturation: 1.05 } },
  { name: 'Venues', count: 2, style: { brightness: 1.0, saturation: 1.1 } },
];

// Blog post titles from blogInitializer.ts
const blogPosts = [
  { title: 'The Art of Wedding Storytelling', category: 'Wedding' },
  { title: 'Lighting Techniques for Outdoor Portrait Sessions', category: 'Portrait' },
  { title: 'Creating Authentic Moments in Engagement Photography', category: 'Engagement' },
  { title: 'Essential Gear for Wedding Photographers in 2025', category: 'Equipment' },
  { title: 'How to Prepare Clients for Their Engagement Session', category: 'Engagement' },
  { title: 'Capturing Emotional Moments: A Guide to Candid Wedding Photography', category: 'Wedding' },
  { title: 'The Ultimate Wedding Day Timeline for Photographers', category: 'Wedding' },
  { title: 'Post-Processing Workflow for Wedding Photographers', category: 'Tips' },
  { title: 'Choosing the Perfect Wedding Venue for Photography', category: 'Venues' },
  { title: 'Building a Photography Portfolio That Attracts Your Ideal Clients', category: 'Business' }
];

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`Created directory: ${targetDir}`);
}

// Get all wedding stock images
const getSourceImages = () => {
  try {
    const files = fs.readdirSync(sourceDir);
    return files.filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'));
  } catch (error) {
    console.error('Error reading source directory:', error);
    return [];
  }
};

// Create a blog image with specific style
const createBlogImage = async (sourceImage, targetImage, style, metadata) => {
  try {
    // Apply transformations based on category style
    await sharp(path.join(sourceDir, sourceImage))
      .resize(1200, 800, { fit: 'cover', position: 'center' })
      .modulate({ brightness: style.brightness, saturation: style.saturation })
      .composite([{
        input: Buffer.from(`
          <svg width="1200" height="800">
            <rect x="0" y="650" width="1200" height="150" fill="rgba(0,0,0,0.5)" />
            <text x="50" y="720" font-family="Arial" font-size="40" fill="white">${metadata.title}</text>
            <text x="50" y="770" font-family="Arial" font-size="24" fill="rgba(255,255,255,0.8)">${metadata.category}</text>
          </svg>
        `),
        gravity: 'southeast',
      }])
      .toFile(path.join(targetDir, targetImage));
    
    console.log(`Created blog image: ${targetImage}`);
    return true;
  } catch (error) {
    console.error(`Error creating blog image ${targetImage}:`, error);
    return false;
  }
};

// Generate slug from title
const generateSlug = (title) => {
  return title.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Main function to create all blog images
const createAllBlogImages = async () => {
  const sourceImages = getSourceImages();
  
  if (sourceImages.length === 0) {
    console.error('No source images found!');
    return;
  }
  
  console.log(`Found ${sourceImages.length} source images`);
  
  // Create blog images for each blog post
  for (let i = 0; i < blogPosts.length; i++) {
    const post = blogPosts[i];
    const category = blogCategories.find(cat => cat.name === post.category);
    
    if (!category) {
      console.warn(`Category not found for post: ${post.title}`);
      continue;
    }
    
    // Select a source image (cycling through available images)
    const sourceImage = sourceImages[i % sourceImages.length];
    const slug = generateSlug(post.title);
    const targetImage = `blog-${slug}.jpg`;
    
    // Create the blog image
    await createBlogImage(sourceImage, targetImage, category.style, {
      title: post.title,
      category: post.category
    });
  }
  
  console.log('Blog image creation completed!');
};

// Update the images utility to include blog images
const updateImagesUtility = () => {
  const utilsPath = path.join(__dirname, '../src/utils/images.ts');
  
  try {
    let content = fs.readFileSync(utilsPath, 'utf8');
    
    // Check if blog category already exists
    if (!content.includes("'blog'")) {
      // Add blog to StockImageCategory type
      content = content.replace(
        "export type StockImageCategory = \n  | 'wedding'\n  | 'engagement'\n  | 'portrait'\n  | 'landscape'\n  | 'equipment'\n  | 'avatar';",
        "export type StockImageCategory = \n  | 'wedding'\n  | 'engagement'\n  | 'portrait'\n  | 'landscape'\n  | 'equipment'\n  | 'avatar'\n  | 'blog';"
      );
      
      // Add blog to getUnsplashStockImage categories
      content = content.replace(
        "const categories = {\n    wedding: 'bride-groom',\n    engagement: 'couple-ring',\n    portrait: 'professional-portrait',\n    landscape: 'nature-scenery',\n    equipment: 'camera-gear',\n    avatar: 'person-silhouette'",
        "const categories = {\n    wedding: 'bride-groom',\n    engagement: 'couple-ring',\n    portrait: 'professional-portrait',\n    landscape: 'nature-scenery',\n    equipment: 'camera-gear',\n    avatar: 'person-silhouette',\n    blog: 'photography-blog'"
      );
      
      // Add blog to FALLBACK_IMAGES
      content = content.replace(
        "export const FALLBACK_IMAGES = {\n  AVATAR: getStockImage('avatar', 150, 150),\n  BLOG_POST: getStockImage('wedding', 1200, 800),\n  GALLERY: getStockImage('wedding', 1920, 1080)\n};",
        "export const FALLBACK_IMAGES = {\n  AVATAR: getStockImage('avatar', 150, 150),\n  BLOG_POST: getStockImage('blog', 1200, 800),\n  GALLERY: getStockImage('wedding', 1920, 1080)\n};"
      );
      
      fs.writeFileSync(utilsPath, content);
      console.log('Updated images utility file to include blog category');
    }
  } catch (error) {
    console.error('Error updating images utility:', error);
  }
};

// Update blog initializer to use the new blog images
const updateBlogInitializer = () => {
  const initializerPath = path.join(__dirname, '../src/utils/blogInitializer.ts');
  
  try {
    let content = fs.readFileSync(initializerPath, 'utf8');
    
    // Replace all instances of getStockImage('wedding') with specific blog images
    for (const post of blogPosts) {
      const slug = generateSlug(post.title);
      const blogImagePath = `/images/stock/blog/blog-${slug}.jpg`;
      
      // Replace the featuredImage for this specific post
      const postTitleEscaped = post.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`title: '${postTitleEscaped}',[\\s\\S]*?featuredImage: getStockImage\\('wedding'\\)`, 'g');
      
      content = content.replace(regex, `title: '${post.title}',\\$&`.replace('featuredImage: getStockImage(\'wedding\')', `featuredImage: '${blogImagePath}'`));
    }
    
    fs.writeFileSync(initializerPath, content);
    console.log('Updated blog initializer to use new blog images');
  } catch (error) {
    console.error('Error updating blog initializer:', error);
  }
};

// Execute the script
(async () => {
  try {
    await createAllBlogImages();
    updateImagesUtility();
    updateBlogInitializer();
    console.log('Blog image creation and updates completed successfully!');
  } catch (error) {
    console.error('Error executing script:', error);
  }
})();
