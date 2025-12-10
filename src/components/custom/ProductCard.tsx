'use client';

import { Product, ColorOption } from '@/lib/types';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, color: ColorOption) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [selectedColor, setSelectedColor] = useState<ColorOption>(product.colors[0]);
  const [isLiked, setIsLiked] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product, selectedColor);
  };

  const getCategoryBadge = () => {
    const badges = {
      mesa: { text: 'Mesa', color: 'bg-blue-100 text-blue-700' },
      cadeira: { text: 'Cadeira', color: 'bg-purple-100 text-purple-700' },
      pacote: { text: 'Pacote', color: 'bg-green-100 text-green-700' },
    };
    return badges[product.category];
  };

  const badge = getCategoryBadge();

  // Render stars
  const renderStars = () => {
    const rating = product.rating || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 opacity-50" />
        );
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  // Determine if product has promotional price
  const hasPromotion = product.promotionalPrice && product.promotionalPrice < product.price;
  const displayPrice = hasPromotion ? product.promotionalPrice : product.price;

  return (
    <div className="group bg-[#F5F5F5] rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200">
      {/* Image */}
      <div className="relative h-64 overflow-hidden bg-gray-200">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
            {badge.text}
          </span>
        </div>

        {/* Like button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 shadow-lg"
        >
          <Heart
            className={`w-5 h-5 transition-all duration-300 ${
              isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>

        {/* Promotional badge */}
        {hasPromotion && (
          <div className="absolute bottom-3 left-3">
            <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold shadow-lg animate-pulse">
              🔥 PROMOÇÃO
            </span>
          </div>
        )}

        {/* Featured badge */}
        {product.featured && !hasPromotion && (
          <div className="absolute bottom-3 left-3">
            <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold shadow-lg">
              ⭐ Destaque
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-0.5">
              {renderStars()}
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {product.rating.toFixed(1)}
            </span>
            {product.reviews && (
              <span className="text-xs text-gray-500">
                ({product.reviews.length} {product.reviews.length === 1 ? 'avaliação' : 'avaliações'})
              </span>
            )}
          </div>
        )}

        {/* Color selection */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-700 mb-2">Cor:</p>
          <div className="flex gap-2 flex-wrap">
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color)}
                className={`group/color relative w-8 h-8 rounded-full transition-all duration-300 ${
                  selectedColor.name === color.name
                    ? 'ring-2 ring-blue-600 ring-offset-2 scale-110'
                    : 'hover:scale-105'
                }`}
                title={color.name}
              >
                <div
                  className="w-full h-full rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: color.hex }}
                />
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">{selectedColor.name}</p>
        </div>

        {/* Price and action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            {hasPromotion && (
              <p className="text-sm text-gray-500 line-through">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </p>
            )}
            <p className={`text-2xl font-bold ${hasPromotion ? 'text-red-600' : 'text-blue-600'}`}>
              R$ {displayPrice!.toFixed(2).replace('.', ',')}
            </p>
            <p className="text-xs text-gray-500">ou 12x sem juros</p>
          </div>
          <button
            onClick={handleAddToCart}
            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
