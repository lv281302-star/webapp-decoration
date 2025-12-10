'use client';

import { X, Minus, Plus, Trash2, Tag, MapPin } from 'lucide-react';
import { CartItem, ShippingInfo } from '@/lib/types';
import { useState, useEffect } from 'react';
import {
  calculateSubtotal,
  calculateDiscount,
  calculateTotal,
  calculateShipping,
  FIRST_PURCHASE_COUPON,
  wasCouponUsed,
  markCouponAsUsed,
} from '@/lib/cart';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemIndex: number, newQuantity: number) => void;
  onRemoveItem: (itemIndex: number) => void;
  couponApplied: boolean;
  onApplyCoupon: (code: string) => void;
}

export default function Cart({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  couponApplied,
  onApplyCoupon,
}: CartProps) {
  const [cep, setCep] = useState('');
  const [shipping, setShipping] = useState<ShippingInfo | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const subtotal = calculateSubtotal(items);
  const discount = calculateDiscount(subtotal, couponApplied);
  const shippingCost = shipping?.cost || 0;
  const total = calculateTotal(subtotal, discount, shippingCost);

  const handleCalculateShipping = () => {
    const result = calculateShipping(cep);
    if (result) {
      setShipping(result);
    } else {
      alert('CEP inválido. Digite um CEP válido com 8 dígitos.');
    }
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    
    if (wasCouponUsed()) {
      setCouponError('Cupom já utilizado anteriormente');
      return;
    }

    if (couponCode.toUpperCase() === FIRST_PURCHASE_COUPON) {
      onApplyCoupon(couponCode);
      markCouponAsUsed();
      setCouponCode('');
    } else {
      setCouponError('Cupom inválido');
    }
  };

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Cart sidebar */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-white z-50 shadow-2xl transform transition-transform duration-300 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Carrinho</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          <p className="text-blue-100 text-sm mt-1">
            {items.length} {items.length === 1 ? 'item' : 'itens'}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <X className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg font-semibold">Carrinho vazio</p>
              <p className="text-gray-400 text-sm mt-2">
                Adicione produtos para começar
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Items */}
              {items.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-sm mb-1">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        Cor: {item.selectedColor.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              onUpdateQuantity(index, Math.max(1, item.quantity - 1))
                            }
                            className="p-1 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="text-sm font-semibold w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                            className="p-1 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                        <button
                          onClick={() => onRemoveItem(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-right font-bold text-blue-600">
                      R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>
              ))}

              {/* Coupon */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-semibold text-gray-800">Cupom de desconto</h3>
                </div>
                {couponApplied ? (
                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold">
                    ✓ Cupom {FIRST_PURCHASE_COUPON} aplicado (10% OFF)
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Digite o cupom"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Aplicar
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-red-500 text-xs mt-2">{couponError}</p>
                    )}
                    <p className="text-xs text-gray-600 mt-2">
                      Use <strong>{FIRST_PURCHASE_COUPON}</strong> para 10% de desconto na primeira compra
                    </p>
                  </>
                )}
              </div>

              {/* Shipping */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-800">Calcular frete</h3>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cep}
                    onChange={(e) => setCep(formatCep(e.target.value))}
                    placeholder="00000-000"
                    maxLength={9}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleCalculateShipping}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Calcular
                  </button>
                </div>
                {shipping && (
                  <div className="mt-3 bg-white rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      <strong>Frete:</strong> R$ {shipping.cost.toFixed(2).replace('.', ',')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Entrega em até {shipping.estimatedDays} dias úteis
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">
                  R$ {subtotal.toFixed(2).replace('.', ',')}
                </span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Desconto (10%):</span>
                  <span className="font-semibold">
                    - R$ {discount.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              )}
              {shipping && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frete:</span>
                  <span className="font-semibold">
                    R$ {shippingCost.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
                <span>Total:</span>
                <span className="text-blue-600">
                  R$ {total.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
            <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl">
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </>
  );
}
