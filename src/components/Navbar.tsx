import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import { motion } from 'motion/react';
import Logo from './Logo';

interface NavbarProps {
  onCartClick: () => void;
  cartCount: number;
  onAdminClick: () => void;
  onHomeClick: () => void;
  onBooksClick: () => void;
  currentView: string;
}

export default function Navbar({ onCartClick, cartCount, onAdminClick, onHomeClick, onBooksClick, currentView }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-zinc-100 sticky top-0 w-full z-40 transition-all duration-300">
      <div className="flex flex-row items-center justify-between w-full px-6 md:px-12 max-w-7xl mx-auto h-24">
        {/* Brand Logo */}
        <div className="flex-1 flex justify-start">
          <div 
            onClick={onHomeClick}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <Logo size="md" className="rotate-[-8deg] group-hover:rotate-0 transition-all duration-500 shadow-lg" />
            <div>
              <h1 className="text-xl font-bold text-primary tracking-tight leading-none mb-1">مكتبة اليقطين</h1>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest text-right">أرشيف المعرفة</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-10">
          <button 
            onClick={onHomeClick}
            className={`text-sm font-bold transition-all hover:text-primary ${currentView === 'home' ? 'text-primary' : 'text-zinc-500'}`}
          >
            الرئيسية
          </button>
          <button 
            onClick={onBooksClick}
            className="text-sm font-bold text-zinc-500 hover:text-primary transition-all"
          >
            الكتب
          </button>
          <button 
            onClick={onAdminClick}
            className={`text-sm font-bold transition-all hover:text-primary ${currentView === 'admin' ? 'text-primary underline decoration-2 underline-offset-8' : 'text-zinc-500'}`}
          >
            لوحة الإدارة
          </button>
        </div>

        {/* Search Bar & Actions */}
        <div className="flex-1 flex items-center gap-4 md:gap-8 justify-end">
          <div className="relative hidden sm:block w-48 lg:w-72">
            <input 
              type="text" 
              placeholder="البحث عن كتاب..." 
              className="w-full bg-zinc-100 border-none rounded-2xl py-3 pr-12 pl-6 text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onCartClick}
              className="relative p-3 bg-zinc-100 hover:bg-zinc-200 rounded-2xl transition-all active:scale-95 group"
            >
              <ShoppingCart className="w-5 h-5 text-zinc-600 group-hover:text-primary transition-colors" />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-lg"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
            <Logo size="sm" className="md:hidden" />
            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center cursor-pointer hover:bg-zinc-200 transition-colors md:hidden">
                <Menu className="w-5 h-5 text-zinc-600" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
