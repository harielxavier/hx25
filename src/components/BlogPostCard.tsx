import { BlogPost } from '../services/supabaseBlogService';
import { ImageWithFallback } from './ImageWithFallback';

export const BlogPostCard = ({ post }: { post: BlogPost }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <ImageWithFallback
      src={post.featuredImage}
      alt={post.title}
      category="blog"
      className="w-full h-48 object-cover"
      width={400}
      height={300}
    />
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
      <p className="text-gray-600 mb-4">{post.excerpt}</p>
      <div className="flex items-center text-sm text-gray-500">
        <span>{post.readTime} min read</span>
      </div>
    </div>
  </div>
);
