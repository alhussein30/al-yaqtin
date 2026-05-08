import { ArrowRight, ChevronLeft, ShoppingCart, Star, Share2, Bookmark, Mail, FileText, Globe, BookOpen, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Book } from '../types';
import Logo from './Logo';

interface BookDetailsProps {
  book: Book;
  onBack: () => void;
  onAddToCart: (book: Book) => void;
}

export default function BookDetails({ book, onBack, onAddToCart }: BookDetailsProps) {
  const discountedPrice = book.discountPercentage 
    ? book.price * (1 - book.discountPercentage / 100) 
    : book.price;
  const isOutOfStock = book.stock === 0;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-6 md:px-12 py-12"
    >
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-12 text-sm text-zinc-500 font-medium">
        <button onClick={onBack} className="hover:text-primary transition-colors">الرئيسية</button>
        <ChevronLeft className="w-4 h-4" />
        <span className="hover:text-primary cursor-pointer transition-colors px-2">{book.category}</span>
        <ChevronLeft className="w-4 h-4" />
        <span className="text-zinc-900 line-clamp-1">{book.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Gallery Column */}
        <div className="lg:col-span-5">
          <motion.div 
            layoutId={`book-image-${book.id}`}
            className="bg-white rounded-3xl p-10 md:p-16 shadow-2xl border border-zinc-100 flex items-center justify-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <img 
              src={book.coverImage} 
              alt={book.title} 
              className="max-w-full h-auto rounded-lg shadow-2xl hover:scale-[1.03] transition-transform duration-500"
            />
            {book.discountPercentage && book.discountPercentage > 0 && (
              <div className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded-2xl font-bold shadow-xl rotate-3">
                خصم {book.discountPercentage}%
              </div>
            )}
          </motion.div>
          
          <div className="flex justify-center gap-10 mt-10">
            <button className="flex items-center gap-3 text-zinc-500 hover:text-primary transition-all group">
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">مشاركة</span>
            </button>
            <button className="flex items-center gap-3 text-zinc-500 hover:text-primary transition-all group">
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Bookmark className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">حفظ</span>
            </button>
            <button className="flex items-center gap-3 text-zinc-500 hover:text-primary transition-all group">
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">إرسال</span>
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
                كتاب مختار
              </motion.span>
              <Logo size="sm" className="rounded-xl shadow-sm border border-zinc-100" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4 leading-tight">{book.title}</h1>
            <p className="text-2xl font-medium text-primary mb-6">تأليف: {book.author}</p>
            
            <div className="flex items-center gap-2 text-[#f59e0b] justify-end">
              <span className="text-zinc-500 text-sm font-medium ml-2">({book.reviewsCount} تقييم)</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(book.rating) ? 'fill-current' : ''}`} />
                ))}
              </div>
            </div>
          </div>

          <div className="py-10 border-y border-zinc-100 mb-10 text-right">
            <div className="flex items-baseline gap-6 mb-4 justify-end">
              {(book.oldPrice || book.discountPercentage) && (
                <span className="text-xl text-zinc-400 line-through">{(book.oldPrice || book.price).toFixed(2)} ج.م</span>
              )}
              <span className="text-4xl font-bold text-primary">{discountedPrice.toFixed(2)} ج.م</span>
            </div>
            <div className={`text-sm flex items-center gap-2 justify-end ${isOutOfStock ? 'text-red-500' : 'text-zinc-500'}`}>
              {isOutOfStock 
                ? 'عذراً، هذا الكتاب غير متوفر حالياً.' 
                : `متاح في المخزون (${book.stock} قطعة) - الشحن على حسب المحافظة`}
              <div className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-green-500'}`} />
            </div>
          </div>

          <div className="flex gap-4 mb-12">
            <button className="px-6 border-2 border-zinc-100 text-primary rounded-2xl hover:bg-zinc-50 transition-all flex items-center justify-center group">
              <Heart className="w-6 h-6 transition-transform group-hover:scale-110" />
            </button>
            <button 
              disabled={isOutOfStock}
              onClick={() => onAddToCart(book)}
              className={`flex-1 ${isOutOfStock ? 'bg-zinc-200 cursor-not-allowed' : 'bg-primary shadow-xl hover:bg-primary-light hover:translate-y-[-2px] active:scale-95'} text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-4 transition-all`}
            >
              <ShoppingCart className="w-6 h-6" />
              {isOutOfStock ? 'نفد من المخزن' : 'إضافة إلى السلة'}
            </button>
          </div>

          {/* Detailed Info Chips */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
            <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100 flex items-center gap-4 flex-row-reverse">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-right">
                <div className="text-xs text-zinc-400 mb-1 font-bold">الصفحات</div>
                <div className="text-sm font-bold text-zinc-900">{book.pages} صفحة</div>
              </div>
            </div>
            <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100 flex items-center gap-4 flex-row-reverse">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                <Globe className="w-5 h-5" />
              </div>
              <div className="text-right">
                <div className="text-xs text-zinc-400 mb-1 font-bold">اللغة</div>
                <div className="text-sm font-bold text-zinc-900">{book.language}</div>
              </div>
            </div>
            <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100 flex items-center gap-4 flex-row-reverse">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-right">
                <div className="text-xs text-zinc-400 mb-1 font-bold">الفئة</div>
                <div className="text-sm font-bold text-zinc-900">{book.category}</div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h3 className="text-2xl font-bold text-zinc-900 mb-6 underline decoration-accent decoration-4 underline-offset-8">عن الكتاب</h3>
            <div className="text-lg text-zinc-600 leading-relaxed space-y-6">
              <p>{book.description}</p>
              <p>من خلال فصول هذا الكتاب المتميز، نكتشف أسرار توزيع الإضاءة، واختيار الألوان الهادئة، وتأثير الزخارف الهندسية على الحالة النفسية لرواد المجلس، مما يجعله مرجعاً هاماً للمصممين والمهتمين بالثقافة العربية المعاصرة.</p>
            </div>
          </div>

          <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-2 text-right">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">الرقم الدولي (ISBN)</h4>
                <p className="text-zinc-900 font-medium">{book.isbn}</p>
              </div>
              <div className="space-y-2 text-right">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">تاريخ النشر</h4>
                <p className="text-zinc-900 font-medium">{book.publishDate}</p>
              </div>
              <div className="space-y-2 text-right">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">نوع الغلاف</h4>
                <p className="text-zinc-900 font-medium">{book.coverType}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
