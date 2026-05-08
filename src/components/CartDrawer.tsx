import { useState } from 'react';
import { ShoppingCart, X, Plus, Minus, MessageCircle, Truck, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, ShippingRate, SiteSettings } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  shippingRates: ShippingRate[];
  settings: SiteSettings;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({ isOpen, onClose, items, shippingRates, settings, onUpdateQuantity, onRemoveItem, onClearCart }: CartDrawerProps) {
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>(() => {
    return localStorage.getItem('yaqten_last_governorate') || '';
  });

  const handleGovernorateChange = (gov: string) => {
    setSelectedGovernorate(gov);
    localStorage.setItem('yaqten_last_governorate', gov);
  };

  const getDiscountedPrice = (item: CartItem) => {
    return item.discountPercentage 
      ? item.price * (1 - item.discountPercentage / 100) 
      : item.price;
  };

  const subtotal = items.reduce((sum, item) => sum + getDiscountedPrice(item) * item.quantity, 0);
  const shippingRate = shippingRates.find(r => r.governorate === selectedGovernorate);
  const shippingPrice = shippingRate ? shippingRate.price : 0;
  const total = subtotal + shippingPrice;

  const handleWhatsAppCheckout = () => {
    if (!selectedGovernorate) {
        alert('اختار المحافطة من فضلك');
        return;
    }
    const message = `مرحباً، أود إتمام الطلب التالي:\n\n` + 
      items.map(item => `- ${item.title} (${item.quantity}x) - ${getDiscountedPrice(item).toFixed(2)} ج.م`).join('\n') + 
      `\n\nالمحافظة: ${selectedGovernorate}` +
      `\nالشحن: ${shippingPrice.toFixed(2)} ج.م` +
      `\nالإجمالي النهائي: ${total.toFixed(2)} ج.م`;
    
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    
    // Clear cart after redirect
    onClearCart();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[50]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-full sm:w-[450px] bg-white shadow-2xl z-[60] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-zinc-100 flex-row-reverse">
              <div className="flex items-center gap-3">
                <ShoppingCart className="text-primary w-6 h-6" />
                <h2 className="text-xl font-bold text-primary">سلة المشتريات</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400 hover:text-red-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                  <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
                  <p>سلتك فارغة حالياً</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 relative group flex-row-reverse text-right"
                    >
                      <img 
                        src={item.coverImage} 
                        alt={item.title} 
                        className="w-20 h-28 object-cover rounded-lg shadow-sm"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-sm text-zinc-900 mb-1 leading-tight">{item.title}</h3>
                          {item.isBundle ? (
                            <p className="text-xs text-secondary font-bold">عرض خاص / باقة</p>
                          ) : (
                            <p className="text-xs text-zinc-500">{item.author}</p>
                          )}
                        </div>
                        <div className="flex justify-between items-end flex-row-reverse">
                          <div className="flex items-center gap-3 bg-white border border-zinc-200 rounded-full px-2 py-1">
                            <button 
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="text-primary hover:bg-zinc-100 p-1 rounded-full transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="text-primary hover:bg-zinc-100 p-1 rounded-full transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-primary font-bold">{(getDiscountedPrice(item) * item.quantity).toFixed(2)} ج.م</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="absolute -top-2 -left-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 bg-zinc-50 border-t border-zinc-200 text-right">
                <div className="mb-6 space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-zinc-400 flex items-center justify-end gap-2">
                      <span>اختر المحافظة للشحن</span>
                      <MapPin className="w-3 h-3" />
                    </label>
                    <select 
                      value={selectedGovernorate}
                      onChange={(e) => handleGovernorateChange(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all text-right"
                    >
                      <option value="">-- اختر محافظة --</option>
                      {shippingRates.map(rate => (
                        <option key={rate.governorate} value={rate.governorate}>
                          {rate.governorate}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-zinc-500 text-sm flex-row-reverse">
                    <span>المجموع الفرعي</span>
                    <span>{subtotal.toFixed(2)} ج.م</span>
                  </div>
                  <div className="flex justify-between text-zinc-500 text-sm flex-row-reverse">
                    <span>الشحن</span>
                    <span className="text-primary font-medium">
                      {selectedGovernorate ? `${shippingPrice.toFixed(2)} ج.م` : 'يرجى اختيار المحافظة'}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-zinc-200 flex justify-between font-bold text-lg text-zinc-900 flex-row-reverse">
                    <span>الإجمالي الكلي</span>
                    <span>{total.toFixed(2)} ج.م</span>
                  </div>
                </div>

                <button 
                  onClick={handleWhatsAppCheckout}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all active:scale-95 flex-row-reverse"
                >
                  <MessageCircle className="w-6 h-6" />
                  إتمام الطلب مع المنسق
                </button>
                <p className="text-center text-[10px] text-zinc-400 mt-4">
                  سيتم تحويلك إلى واتساب لإرسال تفاصيل الطلب مباشرة
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
