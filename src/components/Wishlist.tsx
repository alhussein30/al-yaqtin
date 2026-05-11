import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Bundle, Accessory } from '../types';

interface WishlistProps {
  items: (Book | Bundle | Accessory)[];
  onRemove: (id: string) => void;
  onSelect: (item: Book | Bundle | Accessory) => void;
  onAddToCart: (item: Book | Bundle | Accessory) => void;
  onBack: () => void;
}

export default function Wishlist({ items, onRemove, onSelect, onAddToCart, onBack }: WishlistProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-6 md:px-12 py-12"
    >
      <div className="flex flex-row items-center justify-between mb-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors group"
        >
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          <span className="font-bold">العودة للرئيسية</span>
        </button>
        <div className="text-right">
          <h1 className="text-4xl font-bold text-zinc-900 mb-2">قائمة الرغبات</h1>
          <p className="text-zinc-500">المنتجات التي قمت بحفظها للرجوع إليها لاحقاً.</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-zinc-50 rounded-[3rem] py-24 px-6 text-center border-2 border-dashed border-zinc-200">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-zinc-100">
            <Heart className="w-10 h-10 text-zinc-300" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">قائمة الرغبات فارغة</h2>
          <p className="text-zinc-500 mb-10 max-w-md mx-auto">لم تقم بحفظ أي منتجات حتى الآن. ابدأ بتصفح كتبنا المميزة وأضف ما يعجبك هنا.</p>
          <button 
            onClick={onBack}
            className="bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary-light transition-all shadow-xl shadow-primary/20"
          >
            تصفح الكتب الآن
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {items.map((item) => {
              const image = 'coverImage' in item ? item.coverImage : 'image' in item ? (item as Accessory).image : '';
              const isBundle = 'isBundle' in item;
              
              return (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-[2.5rem] p-6 border border-zinc-100 shadow-xl shadow-primary/5 group"
                >
                  <div 
                    onClick={() => onSelect(item)}
                    className="relative aspect-[3/4] mb-6 overflow-hidden rounded-3xl bg-zinc-50 cursor-pointer"
                  >
                    <img 
                      src={image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="bg-white text-zinc-900 px-6 py-2 rounded-full font-bold text-sm shadow-xl items-center flex gap-2">
                         عرض التفاصيل
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <h3 className="text-xl font-bold text-zinc-900 mb-2 line-clamp-1">{item.title}</h3>
                    {'author' in item && <p className="text-sm text-primary font-medium mb-4">{(item as Book).author}</p>}
                    <div className="flex items-center justify-between mb-6 flex-row-reverse">
                      <span className="text-2xl font-bold text-primary">{item.price.toFixed(2)} ج.م</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => onRemove(item.id)}
                          className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={() => onAddToCart(item)}
                      className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-lg active:scale-95"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      إضافة للسلة
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
