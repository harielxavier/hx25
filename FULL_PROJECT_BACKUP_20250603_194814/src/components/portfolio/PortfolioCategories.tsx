import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PortfolioCategory } from '../../services/portfolioCategoryService';
import cloudinaryService from '../../services/cloudinaryService';
import { useInView } from 'react-intersection-observer';
import './PortfolioCategories.css';

interface PortfolioCategoriesProps {
  categories: PortfolioCategory[];
  layout?: 'grid' | 'carousel';
  showCount?: boolean;
}

export default function PortfolioCategories({
  categories,
  layout = 'grid',
  showCount = true
}: PortfolioCategoriesProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (categories.length > 0) {
      setIsLoading(false);
    }
  }, [categories]);

  // Category component with lazy loading
  const CategoryItem = ({ category }: { category: PortfolioCategory }) => {
    const { ref, inView } = useInView({
      threshold: 0.1,
      triggerOnce: true
    });

    // Generate optimized image URLs using Cloudinary
    const coverImageUrl = category.coverImage.startsWith('http')
      ? cloudinaryService.getCloudinaryUrl(
          category.coverImage,
          cloudinaryService.CloudinaryPreset.MEDIUM
        )
      : category.coverImage; // Use as is if it's a local path

    const blurImageUrl = category.coverImage.startsWith('http')
      ? cloudinaryService.getCloudinaryUrl(
          category.coverImage,
          cloudinaryService.CloudinaryPreset.BLUR
        )
      : category.coverImage;

    return (
      <div ref={ref} className="portfolio-category-item">
        <Link to={`/portfolio/${category.slug}`} className="category-link">
          <div className="category-image-container">
            {inView ? (
              <>
                <img
                  src={blurImageUrl}
                  className="category-image-blur"
                  alt={category.title}
                />
                <img
                  src={coverImageUrl}
                  alt={category.title}
                  className="category-image"
                  loading="lazy"
                />
              </>
            ) : (
              <div className="category-image-placeholder" />
            )}
            <div className="category-overlay">
              <div className="category-details">
                <h2>{category.title}</h2>
                {category.description && <p>{category.description}</p>}
                {showCount && category.imageCount !== undefined && (
                  <span className="image-count">{category.imageCount} images</span>
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div className={`portfolio-categories-container ${isLoading ? 'loading' : ''}`}>
      {isLoading ? (
        <div className="loading-spinner">Loading categories...</div>
      ) : (
        <div className={`portfolio-categories ${layout === 'carousel' ? 'carousel-layout' : 'grid-layout'}`}>
          {categories.length > 0 ? (
            categories.map(category => (
              <CategoryItem key={category.id} category={category} />
            ))
          ) : (
            <div className="no-categories">
              <p>No portfolio categories found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
