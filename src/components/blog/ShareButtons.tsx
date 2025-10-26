import React from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  PinterestShareButton,
  LinkedinShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  PinterestIcon,
  LinkedinIcon,
  EmailIcon
} from 'react-share';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  hashtags?: string[];
  className?: string;
}

/**
 * Social Sharing Buttons Component
 *
 * Allows readers to easily share blog posts on social media
 *
 * Usage:
 * <ShareButtons
 *   url={window.location.href}
 *   title={post.title}
 *   description={post.excerpt}
 *   image={post.featured_image}
 *   hashtags={['wedding', 'photography']}
 * />
 */
export const ShareButtons: React.FC<ShareButtonsProps> = ({
  url,
  title,
  description = '',
  image = '',
  hashtags = [],
  className = ''
}) => {
  const iconSize = 40;
  const iconBorderRadius = 8;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm text-gray-600 font-medium mr-2">Share:</span>

      {/* Facebook */}
      <FacebookShareButton
        url={url}
        quote={title}
        hashtag={hashtags[0] ? `#${hashtags[0]}` : undefined}
      >
        <FacebookIcon size={iconSize} borderRadius={iconBorderRadius} />
      </FacebookShareButton>

      {/* Twitter/X */}
      <TwitterShareButton
        url={url}
        title={title}
        hashtags={hashtags}
        related={['harielxavier']}
      >
        <TwitterIcon size={iconSize} borderRadius={iconBorderRadius} />
      </TwitterShareButton>

      {/* Pinterest - Perfect for wedding photography! */}
      <PinterestShareButton
        url={url}
        media={image || `${window.location.origin}/og-image.jpg`}
        description={description || title}
      >
        <PinterestIcon size={iconSize} borderRadius={iconBorderRadius} />
      </PinterestShareButton>

      {/* LinkedIn */}
      <LinkedinShareButton
        url={url}
        title={title}
        summary={description}
        source="Hariel Xavier Photography"
      >
        <LinkedinIcon size={iconSize} borderRadius={iconBorderRadius} />
      </LinkedinShareButton>

      {/* Email */}
      <EmailShareButton
        url={url}
        subject={title}
        body={`I thought you'd enjoy this article: ${title}\n\n${description}\n\n`}
      >
        <EmailIcon size={iconSize} borderRadius={iconBorderRadius} />
      </EmailShareButton>
    </div>
  );
};

/**
 * Sticky Share Bar (for longer blog posts)
 *
 * Displays share buttons in a fixed position on the side of the article
 */
export const StickyShareBar: React.FC<ShareButtonsProps> = (props) => {
  return (
    <div className="hidden lg:block fixed left-8 top-1/2 transform -translate-y-1/2 z-20">
      <div className="flex flex-col gap-3 bg-white p-3 rounded-lg shadow-lg">
        <span className="text-xs text-gray-500 text-center mb-1">Share</span>
        <ShareButtons {...props} className="flex-col" />
      </div>
    </div>
  );
};

export default ShareButtons;
