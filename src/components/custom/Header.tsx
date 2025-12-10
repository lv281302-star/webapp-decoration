'use client';

import { ShoppingCart, Menu, Search, User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { User as UserType } from '@/lib/types';

interface HeaderProps {
  onCartClick: () => void;
  cartItemsCount: number;
  onSearchClick: () => void;
  onAuthClick: () => void;
  currentUser: UserType | null;
  onLogout: () => void;
}

export default function Header({ 
  onCartClick, 
  cartItemsCount, 
  onSearchClick,
  onAuthClick,
  currentUser,
  onLogout
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#2C2C2C]/95 backdrop-blur-md shadow-lg'
          : 'bg-gradient-to-b from-[#2C2C2C] to-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-xl">DR</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white">Decoration Room</h1>
              <p className="text-xs text-gray-400">Sua sala, nossa decoração</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search Button */}
            <button
              onClick={onSearchClick}
              className="p-3 bg-[#1A1A1A] hover:bg-[#333333] text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* User Button */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-white">{currentUser.name}</p>
                  <p className="text-xs text-gray-400">{currentUser.email}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  title="Sair"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <User className="w-5 h-5" />
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
