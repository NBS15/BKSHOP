import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
}

export function SEO({ title, description }: SEOProps) {
  return (
    <Helmet>
      <title>{title} | BK Shop</title>
      <meta name="description" content={description || 'La meilleure boutique de vêtements en ligne.'} />
    </Helmet>
  );
}
