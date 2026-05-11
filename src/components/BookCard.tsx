import { ShoppingCart, Star, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { MouseEvent } from 'react';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  onClick: () => void;
  onAddToCart: (e: MouseEvent) => void;
  onToggleWishlist?: (e: MouseEvent) => void;
  isInWishlist?: boolean;
}

export default function BookCard({ book, onClick, onAddToCart, onToggleWishlist, isInWishlist }: BookCardProps) {
  const discountedPrice = book.discountPercentage 
    ? book.price * (1 - book.discountPercentage / 100) 
    : book.price;
  const isOutOfStock = book.stock === 0;

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className={`bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-zinc-100 group cursor-pointer h-full flex flex-col ${isOutOfStock ? 'opacity-75' : ''}`}
      onClick={onClick}
    >
      <div className="relative aspect-[3/4.5] overflow-hidden bg-zinc-50 flex items-center justify-center p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <motion.img 
          layoutId={`book-image-${book.id}`}
          src={book.coverImage} 
          alt={book.title} 
          className="w-full h-full object-cover rounded-lg shadow-xl group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Wishlist Button */}
        {onToggleWishlist && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(e);
            }}
            className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg z-20 ${
              isInWishlist 
                ? 'bg-primary text-white scale-110' 
                : 'bg-white/80 backdrop-blur-md text-zinc-400 hover:text-primary lg:opacity-0 lg:group-hover:opacity-100'
            }`}
          >
            <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Discount Badge */}
        {book.discountPercentage !== undefined && book.discountPercentage > 0 && (
          <div className="absolute top-4 right-4 bg-red-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-lg z-10 flex items-center gap-1">
            <span>{book.discountPercentage}%</span>
            <span>خصم</span>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="bg-zinc-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl">
              نفد من المخزن
            </span>
          </div>
        )}
        
        {/* Quick Actions overlay */}
        {!isOutOfStock && (
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 translate-y-0 lg:translate-y-full lg:group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-white/90 to-transparent lg:from-transparent lg:to-transparent">
             <button 
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(e);
              }}
              className="w-full bg-primary text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-primary-light active:scale-95 transition-all text-sm sm:text-base"
             >
               <ShoppingCart className="w-4 h-4" />
               أضف للسلة
             </button>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1 text-right">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#f59e0b] bg-[#f59e0b]/10 px-2 py-0.5 rounded">
            {book.category}
          </span>
          <div className="flex items-center gap-1 text-[#f59e0b]">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs font-bold">{book.rating}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-zinc-900 mb-1 line-clamp-1 group-hover:text-primary transition-colors leading-tight">
          {book.title}
        </h3>
        <p className="text-sm text-zinc-500 mb-4">{book.author}</p>
        
        <div className="mt-auto flex items-center justify-between border-t border-zinc-50 pt-4">
           <div className="text-right">
             <div className="flex items-center gap-2 flex-row-reverse">
               <div className="text-lg font-bold text-primary">{discountedPrice.toFixed(2)} ج.م</div>
               {book.discountPercentage !== undefined && book.discountPercentage > 0 && (
                 <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-red-100">
                   -{book.discountPercentage}%
                 </span>
               )}
             </div>
             {((book.oldPrice !== undefined && book.oldPrice > 0) || (book.discountPercentage !== undefined && book.discountPercentage > 0)) && (
               <div className="text-xs text-zinc-400 line-through">
                 {(book.oldPrice || book.price).toFixed(2)} ج.م
               </div>
             )}
           </div>
           <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
             {book.isNew ? 'جديد' : ''}
           </div>
        </div>
      </div>
    </motion.div>
  );
}
