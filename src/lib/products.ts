import { Product, ColorOption, Review } from './types';

// Available colors for products
export const availableColors: ColorOption[] = [
  { name: 'Branco', hex: '#FFFFFF' },
  { name: 'Preto', hex: '#000000' },
  { name: 'Cinza', hex: '#808080' },
  { name: 'Marrom', hex: '#8B4513' },
  { name: 'Bege', hex: '#F5F5DC' },
  { name: 'Azul Marinho', hex: '#000080' },
];

// Sample reviews
const sampleReviews: Review[] = [
  {
    id: 'rev-1',
    userId: 'user-1',
    userName: 'Maria Silva',
    rating: 5,
    comment: 'Produto excelente! Superou minhas expectativas.',
    date: '2024-01-15',
  },
  {
    id: 'rev-2',
    userId: 'user-2',
    userName: 'João Santos',
    rating: 4,
    comment: 'Muito bom, entrega rápida e produto de qualidade.',
    date: '2024-01-10',
  },
  {
    id: 'rev-3',
    userId: 'user-3',
    userName: 'Ana Costa',
    rating: 5,
    comment: 'Adorei! Ficou perfeito na minha sala.',
    date: '2024-01-08',
  },
];

// Products catalog
export const products: Product[] = [
  // Mesas
  {
    id: 'mesa-1',
    name: 'Mesa de Jantar Elegance',
    category: 'mesa',
    price: 1299.90,
    description: 'Mesa de jantar moderna com tampo em MDF e pés em aço',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=600&fit=crop',
    colors: [availableColors[0], availableColors[1], availableColors[3]],
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: [sampleReviews[0], sampleReviews[1]],
  },
  {
    id: 'mesa-2',
    name: 'Mesa de Centro Premium',
    category: 'mesa',
    price: 899.90,
    description: 'Mesa de centro com design minimalista e acabamento premium',
    image: 'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=600&h=600&fit=crop',
    colors: [availableColors[0], availableColors[2], availableColors[4]],
    inStock: true,
    rating: 4.5,
    reviews: [sampleReviews[2]],
  },
  {
    id: 'mesa-3',
    name: 'Mesa Lateral Compact',
    category: 'mesa',
    price: 449.90,
    description: 'Mesa lateral compacta ideal para espaços pequenos',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=600&fit=crop',
    colors: [availableColors[1], availableColors[3], availableColors[4]],
    inStock: true,
    rating: 4.3,
    reviews: [sampleReviews[0]],
  },
  
  // Cadeiras
  {
    id: 'cadeira-1',
    name: 'Cadeira Confort Plus',
    category: 'cadeira',
    price: 599.99,
    originalPrice: 599.99,
    promotionalPrice: 399.99,
    description: 'Cadeira estofada com design ergonômico e confortável, estrutura de madeira clara com estofado premium',
    image: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/4a873b46-f170-4780-b8b5-0ef5d3131c2c.jpg',
    colors: [availableColors[0], availableColors[2]], // Branco e Cinza
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: [sampleReviews[0], sampleReviews[2]],
  },
  {
    id: 'cadeira-2',
    name: 'Cadeira Moderna Style',
    category: 'cadeira',
    price: 349.90,
    description: 'Cadeira com design moderno e estrutura resistente',
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&h=600&fit=crop',
    colors: [availableColors[0], availableColors[1], availableColors[3]],
    inStock: true,
    rating: 4.6,
    reviews: [sampleReviews[1]],
  },
  {
    id: 'cadeira-3',
    name: 'Cadeira Office Pro',
    category: 'cadeira',
    price: 599.90,
    description: 'Cadeira profissional com ajuste de altura e apoio lombar',
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&h=600&fit=crop',
    colors: [availableColors[1], availableColors[2], availableColors[5]],
    inStock: true,
    rating: 4.7,
    reviews: [sampleReviews[0], sampleReviews[1], sampleReviews[2]],
  },
  
  // Pacotes
  {
    id: 'pacote-1',
    name: 'Pacote Sala de Jantar Completa',
    category: 'pacote',
    price: 2899.90,
    description: 'Mesa Elegance + 4 Cadeiras Confort Plus',
    image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=600&h=600&fit=crop',
    colors: [availableColors[0], availableColors[1], availableColors[3]],
    inStock: true,
    featured: true,
    rating: 5.0,
    reviews: [sampleReviews[0], sampleReviews[2]],
  },
  {
    id: 'pacote-2',
    name: 'Pacote Home Office',
    category: 'pacote',
    price: 1799.90,
    description: 'Mesa Lateral + Cadeira Office Pro',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&h=600&fit=crop',
    colors: [availableColors[1], availableColors[2], availableColors[5]],
    inStock: true,
    rating: 4.8,
    reviews: [sampleReviews[1]],
  },
];

// Get products by category
export const getProductsByCategory = (category: string) => {
  if (category === 'all') return products;
  return products.filter(p => p.category === category);
};

// Get featured products
export const getFeaturedProducts = () => {
  return products.filter(p => p.featured);
};

// Search and filter products
export const searchProducts = (
  query: string,
  minPrice: number,
  maxPrice: number,
  category: string
) => {
  let filtered = category === 'all' ? products : getProductsByCategory(category);
  
  // Filter by name
  if (query) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  // Filter by price range
  filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);
  
  return filtered;
};
