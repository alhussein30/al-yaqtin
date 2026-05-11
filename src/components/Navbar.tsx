import { useState, useRef } from 'react';
import { ShoppingCart, User, Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

interface NavbarProps {
  onCartClick: () => void;
  onWishlistClick: () => void;
  cartCount: number;
  wishlistCount: number;
  onAdminClick: () => void;
  onHomeClick: () => void;
  onBooksClick: () => void;
  currentView: string;
}

export default function Navbar({ 
  onCartClick, 
  onWishlistClick,
  cartCount, 
  wishlistCount,
  onAdminClick, 
  onHomeClick, 
  onBooksClick, 
  currentView 
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleMobileNav = (callback: () => void) => {
    callback();
    setIsMobileMenuOpen(false);
  };

  const handleLogoMouseDown = () => {
    pressTimer.current = setTimeout(() => {
      onAdminClick();
    }, 3000); // 3 seconds long press
  };

  const handleLogoMouseUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  return (
    <nav className="bg-white border-b border-zinc-100 sticky top-0 w-full z-40 transition-all duration-300">
      <div className="flex flex-row items-center justify-between w-full px-6 md:px-12 max-w-7xl mx-auto h-24">
        {/* Brand Logo */}
        <div className="flex-1 flex justify-start">
          <div 
            onClick={onHomeClick}
            onMouseDown={handleLogoMouseDown}
            onMouseUp={handleLogoMouseUp}
            onTouchStart={handleLogoMouseDown}
            onTouchEnd={handleLogoMouseUp}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <Logo size="md" className="rotate-[-8deg] group-hover:rotate-0 transition-all duration-500 shadow-lg" />
            <div>
              <h1 className="text-xl font-bold text-primary tracking-tight leading-none mb-1">مكتبة اليقطين</h1>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest text-right">أرشيف المعرفة</p>
            </div>
          </div>
        </div>

        {/* Navigation Links (Desktop) */}
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
        </div>

        {/* Search Bar & Actions */}
        <div className="flex-1 flex items-center gap-4 md:gap-8 justify-end">
          <div className="flex items-center gap-4">
            <button 
              onClick={onWishlistClick}
              className="relative p-3 bg-zinc-100 hover:bg-zinc-200 rounded-2xl transition-all active:scale-95 group hidden md:flex"
            >
              <Heart className={`w-5 h-5 ${currentView === 'wishlist' ? 'text-primary' : 'text-zinc-600'} group-hover:text-primary transition-colors`} />
              {wishlistCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-lg"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </button>
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
            <div 
              onClick={toggleMobileMenu}
              className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center cursor-pointer hover:bg-zinc-200 transition-colors md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-zinc-600" /> : <Menu className="w-5 h-5 text-zinc-600" />}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-zinc-100 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              <button 
                onClick={() => handleMobileNav(onHomeClick)}
                className={`text-right py-3 px-4 rounded-xl font-bold transition-all ${currentView === 'home' ? 'bg-primary/5 text-primary' : 'text-zinc-600 hover:bg-zinc-50'}`}
              >
                الرئيسية
              </button>
              <button 
                onClick={() => handleMobileNav(onWishlistClick)}
                className={`text-right py-3 px-4 rounded-xl font-bold transition-all ${currentView === 'wishlist' ? 'bg-primary/5 text-primary' : 'text-zinc-600 hover:bg-zinc-50'}`}
              >
                قائمة الرغبات ({wishlistCount})
              </button>
              <button 
                onClick={() => handleMobileNav(onBooksClick)}
                className="text-right py-3 px-4 rounded-xl font-bold text-zinc-600 hover:bg-zinc-50"
              >
                الكتب
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
