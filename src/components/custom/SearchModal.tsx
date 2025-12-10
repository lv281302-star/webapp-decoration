'use client';

import { useState } from 'react';
import { X, Search, SlidersHorizontal } from 'lucide-react';
import { SearchFilters } from '@/lib/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: SearchFilters) => void;
}

export default function SearchModal({ isOpen, onClose, onSearch }: SearchModalProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    minPrice: 0,
    maxPrice: 5000,
    category: 'all',
  });

  if (!isOpen) return null;

  const handleSearch = () => {
    onSearch(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      query: '',
      minPrice: 0,
      maxPrice: 5000,
      category: 'all',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#2C2C2C] rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Search className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-white">Pesquisar Produtos</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome do Produto
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={filters.query}
                onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Mesa de Jantar, Cadeira..."
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Categoria
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: 'all', label: 'Todos' },
                { value: 'mesa', label: 'Mesas' },
                { value: 'cadeira', label: 'Cadeiras' },
                { value: 'pacote', label: 'Pacotes' },
              ].map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setFilters({ ...filters, category: cat.value as any })}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    filters.category === cat.value
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-[#1A1A1A] text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <SlidersHorizontal className="w-5 h-5 text-gray-400" />
              <label className="text-sm font-medium text-gray-300">
                Faixa de Preço
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-2">Preço Mínimo</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                    className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2">Preço Máximo</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                    className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="50"
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 text-center text-sm text-gray-400">
              R$ {filters.minPrice.toFixed(2)} - R$ {filters.maxPrice.toFixed(2)}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleReset}
              className="flex-1 px-6 py-3 bg-[#1A1A1A] hover:bg-gray-700 text-white font-semibold rounded-xl transition-all duration-300"
            >
              Limpar Filtros
            </button>
            <button
              onClick={handleSearch}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Pesquisar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
