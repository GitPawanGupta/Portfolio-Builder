import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({ 
  title = 'Portfolio Builder - Create Professional Portfolios Online',
  description = 'Build stunning professional portfolios in minutes. Free portfolio builder with customizable templates.',
  keywords = 'portfolio builder, online portfolio, professional portfolio',
  image = '/og-image.jpg',
  type = 'website'
}) => {
  const location = useLocation();
  const url = `https://portfoliobuilder.pasuai.online${location.pathname}`;

  useEffect(() => {
    // Update title
    document.title = title;

    // Update meta tags
    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'keywords', keywords);
    
    // Open Graph
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:url', url);
    updateMetaTag('property', 'og:image', image);
    updateMetaTag('property', 'og:type', type);
    
    // Twitter
    updateMetaTag('property', 'twitter:title', title);
    updateMetaTag('property', 'twitter:description', description);
    updateMetaTag('property', 'twitter:image', image);
    
    // Canonical
    updateCanonical(url);
  }, [title, description, keywords, image, type, url]);

  return null;
};

const updateMetaTag = (attr, key, content) => {
  let element = document.querySelector(`meta[${attr}="${key}"]`);
  if (element) {
    element.setAttribute('content', content);
  } else {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    element.setAttribute('content', content);
    document.head.appendChild(element);
  }
};

const updateCanonical = (url) => {
  let link = document.querySelector('link[rel="canonical"]');
  if (link) {
    link.setAttribute('href', url);
  } else {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    document.head.appendChild(link);
  }
};

export default SEO;
