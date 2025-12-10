'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/custom/Header';
import ProductCard from '@/components/custom/ProductCard';
import Cart from '@/components/custom/Cart';
import AuthModal from '@/components/custom/AuthModal';
import SearchModal from '@/components/custom/SearchModal';
import { products, getFeaturedProducts, searchProducts } from '@/lib/products';
import { Product, ColorOption, CartItem, Cart as CartType, User, SearchFilters } from '@/lib/types';
import { getCart, saveCart } from '@/lib/cart';
import { getCurrentUser, logoutUser } from '@/lib/auth';
import { Play, ChevronDown, Star, TrendingUp, Package } from 'lucide-react';

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [cart, setCart] = useState<CartType>({ items: [], couponApplied: false });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'mesa' | 'cadeira' | 'pacote'>('all');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  // Load cart and user from localStorage on mount
  useEffect(() => {
    setCart(getCart());
    setCurrentUser(getCurrentUser());
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  // Auto-hide intro after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Update filtered products when category changes
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory]);

  const handleAddToCart = (product: Product, color: ColorOption) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.items.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor.name === color.name
      );

      if (existingItemIndex >= 0) {
        const newItems = [...prevCart.items];
        newItems[existingItemIndex].quantity += 1;
        return { ...prevCart, items: newItems };
      } else {
        return {
          ...prevCart,
          items: [...prevCart.items, { product, quantity: 1, selectedColor: color }],
        };
      }
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (itemIndex: number, newQuantity: number) => {
    setCart((prevCart) => {
      const newItems = [...prevCart.items];
      newItems[itemIndex].quantity = newQuantity;
      return { ...prevCart, items: newItems };
    });
  };

  const handleRemoveItem = (itemIndex: number) => {
    setCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.filter((_, index) => index !== itemIndex),
    }));
  };

  const handleApplyCoupon = (code: string) => {
    setCart((prevCart) => ({
      ...prevCart,
      couponApplied: true,
      couponCode: code,
    }));
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  const handleSearch = (filters: SearchFilters) => {
    const results = searchProducts(
      filters.query,
      filters.minPrice,
      filters.maxPrice,
      filters.category
    );
    setFilteredProducts(results);
    setSelectedCategory(filters.category as any);
  };

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  // Intro screen with sophisticated design
  if (showIntro) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#2C2C2C] to-[#3D3D3D] flex items-center justify-center z-50 overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        {/* Content */}
        <div className="relative text-center px-4 animate-fade-in">
          {/* Sophisticated Logo - SEM BRILHOS NOS CANTOS */}
          <div className="mb-12 flex justify-center">
            <div className="relative">
              {/* Logo container - sem brilhos nos cantos */}
              <div className="relative w-40 h-40 bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-500">
                <div className="absolute inset-2 bg-[#1A1A1A] rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-6xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">DR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Title with gradient */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-slide-up">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Decoration Room
            </span>
          </h1>

          {/* Slogan */}
          <p className="text-3xl md:text-4xl text-gray-300 mb-12 animate-slide-up delay-200 font-light">
            Sua sala, nossa <span className="text-blue-400 font-semibold">decoração</span>
          </p>

          {/* Play icon */}
          <div className="flex justify-center mb-8 animate-bounce">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
              <Play className="w-12 h-12 text-white fill-white ml-2" />
            </div>
          </div>

          {/* Skip button */}
          <button
            onClick={() => setShowIntro(false)}
            className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 mx-auto group"
          >
            <span>Pular introdução</span>
            <ChevronDown className="w-4 h-4 animate-bounce group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8E8E8] to-[#F5F5F5]">
      <Header 
        onCartClick={() => setIsCartOpen(true)} 
        cartItemsCount={totalItems}
        onSearchClick={() => setIsSearchOpen(true)}
        onAuthClick={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-[#2C2C2C] via-[#3D3D3D] to-[#1A1A1A] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Transforme sua sala com <span className="text-blue-400">estilo</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in delay-200">
              Mesas e cadeiras de alta qualidade com design moderno
            </p>
            <div className="flex flex-wrap gap-4 justify-center animate-fade-in delay-300">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <p className="text-sm">✓ Frete para todo Brasil</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <p className="text-sm">✓ 12x sem juros</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <p className="text-sm">✓ 10% OFF primeira compra</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            <h3 className="text-3xl font-bold text-gray-800">Produtos em Destaque</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFeaturedProducts().map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 bg-[#E8E8E8]">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-8 h-8 text-blue-600" />
            <h3 className="text-3xl font-bold text-gray-800">Todos os Produtos</h3>
          </div>
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-[#F5F5F5] text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedCategory('mesa')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                selectedCategory === 'mesa'
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-[#F5F5F5] text-gray-700 hover:bg-gray-200'
              }`}
            >
              Mesas
            </button>
            <button
              onClick={() => setSelectedCategory('cadeira')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                selectedCategory === 'cadeira'
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-[#F5F5F5] text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cadeiras
            </button>
            <button
              onClick={() => setSelectedCategory('pacote')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                selectedCategory === 'pacote'
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-[#F5F5F5] text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pacotes
            </button>
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="py-16 px-4 bg-[#E8E8E8]">
        <div className="container mx-auto">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">Nenhum produto encontrado com os filtros aplicados.</p>
              <button
                onClick={() => {
                  setFilteredProducts(products);
                  setSelectedCategory('all');
                }}
                className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300"
              >
                Ver todos os produtos
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-16 px-4 bg-gradient-to-r from-yellow-400 to-orange-500">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <TrendingUp className="w-16 h-16 text-white mx-auto mb-4" />
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              10% OFF na primeira compra!
            </h3>
            <p className="text-xl text-white/90 mb-6">
              Use o cupom <strong className="bg-white/20 px-4 py-2 rounded-lg">PRIMEIRA10</strong> no carrinho
            </p>
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-8 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Ver Carrinho
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2C2C2C] text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">DR</span>
            </div>
            <div className="text-left">
              <h4 className="text-xl font-bold">Decoration Room</h4>
              <p className="text-sm text-gray-400">Sua sala, nossa decoração</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 Decoration Room. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart.items}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        couponApplied={cart.couponApplied}
        onApplyCoupon={handleApplyCoupon}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
      />
    </div>
  );
}
