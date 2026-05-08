/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, MouseEvent, useRef, FormEvent, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import BookDetails from './components/BookDetails';
import AdminDashboard from './components/AdminDashboard';
import CartDrawer from './components/CartDrawer';
import AdminBookForm from './components/AdminBookForm';
import { Book, Bundle, CartItem, View, ShippingRate, SiteSettings } from './types';
import { SAMPLE_BOOKS, EGYPT_GOVERNORATES } from './constants';
import AdminBundleForm from './components/AdminBundleForm';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, User } from 'lucide-react';
import Logo from './components/Logo';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const booksSectionRef = useRef<HTMLDivElement>(null);

  // Cart State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Library State
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('library_books');
    return saved ? JSON.parse(saved) : SAMPLE_BOOKS;
  });

  // Bundles State
  const [bundles, setBundles] = useState<Bundle[]>(() => {
    const saved = localStorage.getItem('library_bundles');
    return saved ? JSON.parse(saved) : [];
  });

  // Shipping Rates State
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>(() => {
    const saved = localStorage.getItem('shipping_rates');
    if (saved) return JSON.parse(saved);
    return EGYPT_GOVERNORATES.map(gov => ({ governorate: gov, price: 50 })); // Default 50 EGP
  });

  // Site Settings State
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('site_settings');
    if (saved) return JSON.parse(saved);
    return {
      heroTag: 'إصدار متميز لعام 2023',
      heroTitle1: 'يمكنك أن تبحر بلا بحر',
      heroTitle2: 'وأن تسافر وأنت جالس',
      heroSubtitle: 'اكتشف عالم القراءة مع مكتبة اليقطين، حيث تجد أرقى الكتب وأحدث الإصدارات في مكان واحد.',
      footerDescription: 'تأسست في عام 2023 لتكون وجهتكم الأولى للثقافة والمعرفة. نحن نؤمن بأن كل كتاب هو بداية لرحلة معرفية جديدة ومتميزة.',
      whatsappNumber: '201116135630',
      footerCopyright: '© 2023 مكتبة اليقطين الحديثة. جميع الحقوق محفوظة.'
    };
  });

  // Persist books to localStorage
  useEffect(() => {
    localStorage.setItem('library_books', JSON.stringify(books));
  }, [books]);

  // Persist bundles to localStorage
  useEffect(() => {
    localStorage.setItem('library_bundles', JSON.stringify(bundles));
  }, [bundles]);

  // Persist shipping rates to localStorage
  useEffect(() => {
    localStorage.setItem('shipping_rates', JSON.stringify(shippingRates));
  }, [shippingRates]);

  // Persist site settings to localStorage
  useEffect(() => {
    localStorage.setItem('site_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  // Admin Form State
  const [isAdminFormOpen, setIsAdminFormOpen] = useState(false);
  const [isAdminBundleFormOpen, setIsAdminBundleFormOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);

  // Handlers
  const handleBookClick = useCallback((book: Book) => {
    setSelectedBook(book);
    setCurrentView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAddToCart = useCallback((item: Book | Bundle, e?: MouseEvent) => {
    if (e) e.stopPropagation();
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 } as CartItem];
    });
    setIsCartOpen(true);
  }, []);

  const handleUpdateQuantity = useCallback((id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleAddBook = () => {
    setBookToEdit(null);
    setIsAdminFormOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setBookToEdit(book);
    setIsAdminFormOpen(true);
  };

  const handleDeleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  const handleAddBundle = () => {
    setIsAdminBundleFormOpen(true);
  };

  const handleAdminBundleFormSubmit = (bundleData: Partial<Bundle>) => {
    const newBundle: Bundle = {
      ...bundleData,
      id: Math.random().toString(36).substr(2, 9),
      isBundle: true,
    } as Bundle;
    setBundles(prev => [newBundle, ...prev]);
    setIsAdminBundleFormOpen(false);
  };

  const handleDeleteBundle = (id: string) => {
    setBundles(prev => prev.filter(b => b.id !== id));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginForm({ username: '', password: '' });
  };

  const handleAdminFormSubmit = (bookData: Partial<Book>) => {
    if (bookToEdit) {
      setBooks(prev => prev.map(b => b.id === bookToEdit.id ? { ...b, ...bookData } as Book : b));
    } else {
      const newBook: Book = {
        ...bookData,
        id: Math.random().toString(36).substr(2, 9),
        rating: 0,
        reviewsCount: 0,
        publishDate: new Date().toLocaleDateString('ar-SA'),
      } as Book;
      setBooks(prev => [newBook, ...prev]);
    }
    setIsAdminFormOpen(false);
  };

  const handleBooksScroll = () => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const element = document.getElementById('books-grid');
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById('books-grid');
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    
    const TARGET_USERNAME = 'HUSSEIN';
    const TARGET_PASSWORD_HASH = 'd7d25d1704f95c976598b0f7cbf9f71b4ba5c66b294b51dd043d392c8a1763ff'; 

    // Simple hash function for comparison
    const sha256 = async (message: string) => {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const enteredUsername = loginForm.username.trim().toUpperCase();
    const enteredPassword = loginForm.password.trim();
    const enteredPasswordHash = await sha256(enteredPassword);

    if (enteredUsername === 'HUSSEIN' && enteredPasswordHash === TARGET_PASSWORD_HASH) {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Navbar 
        onCartClick={() => setIsCartOpen(true)} 
        cartCount={cartItems.reduce((s, i) => s + i.quantity, 0)}
        onAdminClick={() => setCurrentView('admin')}
        onHomeClick={() => setCurrentView('home')}
        onBooksClick={handleBooksScroll}
        currentView={currentView}
      />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Home 
                books={books} 
                bundles={bundles}
                settings={siteSettings}
                onBookSelect={handleBookClick} 
                onAddToCart={handleAddToCart} 
              />
            </motion.div>
          )}

          {currentView === 'details' && selectedBook && (
            <motion.div 
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <BookDetails 
                book={selectedBook} 
                onBack={() => setCurrentView('home')} 
                onAddToCart={(book) => handleAddToCart(book)}
              />
            </motion.div>
          )}

          {currentView === 'admin' && (
            <motion.div 
              key="admin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              {!isLoggedIn ? (
                <div className="min-h-[80vh] flex items-center justify-center p-6">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-zinc-100 w-full max-w-md text-right"
                  >
                    <Logo size="xl" className="mx-auto mb-8 shadow-2xl shadow-primary/10" />
                    <h2 className="text-3xl font-bold text-zinc-900 mb-2">تسجيل الدخول</h2>
                    <p className="text-zinc-500 mb-10">يرجى إدخال البيانات للوصول للوحة الإدارة</p>
                    
                    <form onSubmit={handleLogin} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mr-2">اسم المستخدم</label>
                        <div className="relative">
                          <input 
                            type="text"
                            required
                            value={loginForm.username}
                            onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                            className="w-full bg-zinc-50 border-none rounded-2xl py-4 pr-12 pl-6 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            placeholder="HUSSEIN"
                          />
                          <User className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mr-2">كلمة المرور</label>
                        <div className="relative">
                          <input 
                            type="password"
                            required
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                            className="w-full bg-zinc-50 border-none rounded-2xl py-4 pr-12 pl-6 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            placeholder="••••••"
                          />
                          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                        </div>
                      </div>

                      {loginError && (
                        <p className="text-red-500 text-sm font-medium">{loginError}</p>
                      )}

                      <button 
                        type="submit"
                        className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:bg-primary-light transition-all active:scale-95"
                      >
                        دخول النظام
                      </button>
                    </form>
                  </motion.div>
                </div>
              ) : (
                <AdminDashboard 
                  books={books} 
                  bundles={bundles}
                  shippingRates={shippingRates}
                  settings={siteSettings}
                  onUpdateShippingRates={setShippingRates}
                  onUpdateSettings={setSiteSettings}
                  onAddBook={handleAddBook}
                  onEditBook={handleEditBook}
                  onDeleteBook={handleDeleteBook}
                  onAddBundle={handleAddBundle}
                  onDeleteBundle={handleDeleteBundle}
                  onLogout={handleLogout}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {currentView !== 'admin' && <Footer settings={siteSettings} />}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        shippingRates={shippingRates}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <AdminBookForm 
        isOpen={isAdminFormOpen}
        onClose={() => setIsAdminFormOpen(false)}
        onSave={handleAdminFormSubmit}
        editBook={bookToEdit}
      />

      <AdminBundleForm 
        isOpen={isAdminBundleFormOpen}
        books={books}
        onClose={() => setIsAdminBundleFormOpen(false)}
        onSave={handleAdminBundleFormSubmit}
      />
    </div>
  );
}

