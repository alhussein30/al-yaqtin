import { useState } from 'react';
import { ArrowRight, ChevronLeft, ShoppingCart, Star, Share2, Bookmark, Mail, FileText, Globe, BookOpen, Heart, Package, Ticket, Check, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Bundle, Accessory } from '../types';
import Logo from './Logo';

type Product = Book | Bundle | Accessory;

interface ProductDetailsProps {
  product: Product;
  allBooks?: Book[];
  isInWishlist: boolean;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
}

export default function ProductDetails({ product, allBooks = [], isInWishlist, onBack, onAddToCart, onToggleWishlist }: ProductDetailsProps) {
  const [showToast, setShowToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const isBook = 'author' in product;
  const isBundle = 'isBundle' in product;
  const isAccessory = !isBook && !isBundle;

  const discountedPrice = (product as any).discountPercentage 
    ? product.price * (1 - (product as any).discountPercentage / 100) 
    : product.price;
    
  const isOutOfStock = (product as any).stock === 0 && !isBundle;
  
  const image = isBook 
    ? (product as Book).coverImage 
    : isBundle 
      ? (product as Bundle).coverImage 
      : (product as Accessory).image;

  const category = isBook 
    ? (product as Book).category 
    : isAccessory 
      ? (product as Accessory).category 
      : 'قوائم التوفير';

  const triggerToast = (message: string, type: 'success' | 'info' = 'success') => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      triggerToast('تم نسخ الرابط إلى الحافظة');
    }
  };

  const handleWishlist = () => {
    onToggleWishlist(product);
    triggerToast(isInWishlist ? 'تمت الإزالة من قائمة الرغبات' : 'تمت الإضافة إلى قائمة الرغبات');
  };

  const handleWhatsAppSend = () => {
    const text = encodeURIComponent(`شاهد هذا المنتج الرائع من مكتبة اليقطين:\n\n*${product.title}*\n${product.description}\n\nالرابط: ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-6 md:px-12 py-12 relative"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-50 bg-zinc-900 shadow-2xl text-white px-8 py-4 rounded-2xl flex items-center gap-4 min-w-[300px] justify-center border border-white/10 backdrop-blur-xl"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold">{showToast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-12 text-sm text-zinc-500 font-medium">
        <button onClick={onBack} className="hover:text-primary transition-colors">الرئيسية</button>
        <ChevronLeft className="w-4 h-4" />
        <span className="hover:text-primary cursor-pointer transition-colors px-2">{category}</span>
        <ChevronLeft className="w-4 h-4" />
        <span className="text-zinc-900 line-clamp-1">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Gallery Column */}
        <div className="lg:col-span-5">
          <motion.div 
            layoutId={`product-image-${product.id}`}
            className="bg-white rounded-3xl p-10 md:p-16 shadow-2xl border border-zinc-100 flex items-center justify-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <img 
              src={image} 
              alt={product.title} 
              className="max-w-full h-auto rounded-lg shadow-2xl hover:scale-[1.03] transition-transform duration-500"
            />
            {(product as any).discountPercentage && (product as any).discountPercentage > 0 && (
              <div className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded-2xl font-bold shadow-xl rotate-3">
                خصم {(product as any).discountPercentage}%
              </div>
            )}
          </motion.div>
          
          <div className="flex justify-center gap-10 mt-10">
            <button 
              onClick={handleShare}
              className="flex items-center gap-3 text-zinc-500 hover:text-primary transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">مشاركة</span>
            </button>
            <button 
              onClick={handleWishlist}
              className={`flex items-center gap-3 transition-all group ${isInWishlist ? 'text-primary' : 'text-zinc-500 hover:text-primary'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isInWishlist ? 'bg-primary/10' : 'bg-zinc-100 group-hover:bg-primary/10'}`}>
                <Bookmark className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
              </div>
              <span className="text-sm font-medium">{isInWishlist ? 'محفوظ' : 'حفظ'}</span>
            </button>
            <button 
              onClick={handleWhatsAppSend}
              className="flex items-center gap-3 text-zinc-500 hover:text-green-500 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-green-500/10 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">واتساب</span>
            </button>
          </div>
        </div>

        {/* Content Column */}
        <div className="lg:col-span-7 flex flex-col pt-4 text-right">
          <div className="mb-10 text-right">
            <div className="flex items-center gap-3 justify-end mb-6">
              <motion.span 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-block px-4 py-1 bg-accent/20 text-zinc-700 rounded-full text-xs font-bold"
              >
                {isBook ? 'كتاب مختار' : isBundle ? 'عرض توفير' : 'إكسسوار متميز'}
              </motion.span>
              <Logo size="sm" className="rounded-xl shadow-sm border border-zinc-100" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4 leading-tight">{product.title}</h1>
            {isBook && <p className="text-2xl font-medium text-primary mb-6">تأليف: {(product as Book).author}</p>}
            
            <div className="flex items-center gap-2 text-[#f59e0b] justify-end">
              <span className="text-zinc-500 text-sm font-medium ml-2">({(product as any).reviewsCount || 0} تقييم)</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor((product as any).rating || 5) ? 'fill-current' : ''}`} />
                ))}
              </div>
            </div>
          </div>

          <div className="py-10 border-y border-zinc-100 mb-10 text-right">
            <div className="flex items-baseline gap-6 mb-4 justify-end">
              {((product.oldPrice !== undefined && product.oldPrice > 0) || ((product as any).discountPercentage !== undefined && (product as any).discountPercentage > 0)) && (
                <span className="text-xl text-zinc-400 line-through">{(product.oldPrice || product.price).toFixed(2)} ج.م</span>
              )}
              <span className="text-4xl font-bold text-primary">{discountedPrice.toFixed(2)} ج.م</span>
            </div>
            {!isBundle && (
              <div className={`text-sm flex items-center gap-2 justify-end ${isOutOfStock ? 'text-red-500' : 'text-zinc-500'}`}>
                {isOutOfStock 
                  ? 'عذراً، هذا المنتج غير متوفر حالياً.' 
                  : `متاح في المخزون (${(product as any).stock || 10} قطعة) - الشحن على حسب المحافظة`}
                <div className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-green-500'}`} />
              </div>
            )}
          </div>

          <div className="flex gap-4 mb-12">
            <button 
              onClick={handleWishlist}
              className={`px-6 border-2 rounded-2xl transition-all flex items-center justify-center group ${isInWishlist ? 'border-primary bg-primary/5 text-primary' : 'border-zinc-100 text-zinc-400 hover:bg-zinc-50'}`}
            >
              <Heart className={`w-6 h-6 transition-transform group-hover:scale-110 ${isInWishlist ? 'fill-current' : ''}`} />
            </button>
            <button 
              disabled={isOutOfStock}
              onClick={() => onAddToCart(product)}
              className={`flex-1 ${isOutOfStock ? 'bg-zinc-200 cursor-not-allowed' : 'bg-primary shadow-xl hover:bg-primary-light hover:translate-y-[-2px] active:scale-95'} text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-4 transition-all`}
            >
              <ShoppingCart className="w-6 h-6" />
              {isOutOfStock ? 'نفد من المخزن' : 'إضافة إلى السلة'}
            </button>
          </div>

          {/* Detailed Info Chips */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
            {isBook ? (
              <>
                <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100 flex items-center gap-4 flex-row-reverse">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-zinc-400 mb-1 font-bold">الصفحات</div>
                    <div className="text-sm font-bold text-zinc-900">{(product as Book).pages} صفحة</div>
                  </div>
                </div>
                <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100 flex items-center gap-4 flex-row-reverse">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-zinc-400 mb-1 font-bold">اللغة</div>
                    <div className="text-sm font-bold text-zinc-900">{(product as Book).language}</div>
                  </div>
                </div>
                <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100 flex items-center gap-4 flex-row-reverse">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-zinc-400 mb-1 font-bold">الفئة</div>
                    <div className="text-sm font-bold text-zinc-900">{(product as Book).category}</div>
                  </div>
                </div>
              </>
            ) : isBundle ? (
              <>
                <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100 flex items-center gap-4 flex-row-reverse">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-zinc-400 mb-1 font-bold">المنتج</div>
                    <div className="text-sm font-bold text-zinc-900">عرض توفير</div>
                  </div>
                </div>
                <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100 flex items-center gap-4 flex-row-reverse">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-zinc-400 mb-1 font-bold">عدد الكتب</div>
                    <div className="text-sm font-bold text-zinc-900">{(product as Bundle).books.length} كتب</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100 flex items-center gap-4 flex-row-reverse">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-zinc-400 mb-1 font-bold">النوع</div>
                    <div className="text-sm font-bold text-zinc-900">إكسسوار قراءة</div>
                  </div>
                </div>
                <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100 flex items-center gap-4 flex-row-reverse">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-zinc-400 mb-1 font-bold">الفئة</div>
                    <div className="text-sm font-bold text-zinc-900">{(product as Accessory).category || 'أخرى'}</div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mb-16">
            <h3 className="text-2xl font-bold text-zinc-900 mb-6 underline decoration-accent decoration-4 underline-offset-8">عن المنتج</h3>
            <div className="text-lg text-zinc-600 leading-relaxed space-y-6">
              <p>{product.description}</p>
              {isBundle && (
                <div className="mt-8">
                  <h4 className="text-xl font-bold mb-4">الكتب المضمنة في العرض:</h4>
                  <ul className="list-disc list-inside space-y-2">
                    {(product as Bundle).books.map(bookId => {
                      const book = allBooks.find(b => b.id === bookId);
                      return <li key={bookId}>{book?.title || 'كتاب متميز'}</li>;
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {isBook && (
            <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2 text-right">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">تاريخ النشر</h4>
                  <p className="text-zinc-900 font-medium">{(product as Book).publishDate}</p>
                </div>
                <div className="space-y-2 text-right">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">نوع الغلاف</h4>
                  <p className="text-zinc-900 font-medium">{(product as Book).coverType}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
