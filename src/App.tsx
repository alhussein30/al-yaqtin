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
import ProductDetails from './components/ProductDetails';
import Wishlist from './components/Wishlist';
import AdminDashboard from './components/AdminDashboard';
import CartDrawer from './components/CartDrawer';
import AdminBookForm from './components/AdminBookForm';
import PomodoroTimer from './components/PomodoroTimer';
import AdminAccessoryForm from './components/AdminAccessoryForm';
import { Book, Bundle, CartItem, View, ShippingRate, SiteSettings, Accessory } from './types';
import { SAMPLE_BOOKS, EGYPT_GOVERNORATES } from './constants';
import AdminBundleForm from './components/AdminBundleForm';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, User, Loader2 } from 'lucide-react';
import Logo from './components/Logo';
import { db, auth, handleFirestoreError, OperationType, signInAnonymously } from './lib/firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc
} from 'firebase/firestore';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<View>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Book | Bundle | Accessory | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const booksSectionRef = useRef<HTMLDivElement>(null);

  // Cart State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('yaqten_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState<(Book | Bundle | Accessory)[]>(() => {
    const saved = localStorage.getItem('yaqten_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist Cart
  useEffect(() => {
    localStorage.setItem('yaqten_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Persist Wishlist
  useEffect(() => {
    localStorage.setItem('yaqten_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Persist Login
  useEffect(() => {
    const saved = localStorage.getItem('yaqten_is_logged_in');
    if (saved === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('yaqten_is_logged_in', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  // Library State
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('yaqten_books_cache');
    return saved ? JSON.parse(saved) : [];
  });
  const [bundles, setBundles] = useState<Bundle[]>(() => {
    const saved = localStorage.getItem('yaqten_bundles_cache');
    return saved ? JSON.parse(saved) : [];
  });
  const [accessories, setAccessories] = useState<Accessory[]>(() => {
    const saved = localStorage.getItem('yaqten_accessories_cache');
    return saved ? JSON.parse(saved) : [];
  });
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>(() => {
    const saved = localStorage.getItem('yaqten_shipping_cache');
    return saved ? JSON.parse(saved) : [];
  });
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('yaqten_settings_cache');
    return saved ? JSON.parse(saved) : {
      heroBookId: '',
      heroTag: 'إصدار متميز لعام 2023',
      heroTitle1: 'يمكنك أن تبحر بلا بحر',
      heroSubtitle: 'اكتشف عالم القراءة مع مكتبة اليقطين، حيث تجد أرقى الكتب وأحدث الإصدارات في مكان واحد.',
      footerDescription: 'تأسست في عام 2023 لتكون وجهتكم الأولى للثقافة والمعرفة. نحن نؤمن بأن كل كتاب هو بداية لرحلة معرفية جديدة ومتميزة.',
      whatsappNumber: '201116135630',
      whatsappChannel: 'https://whatsapp.com/channel/0029VbCWI9CKGGG8hZIMIu3W',
      instagramUrl: 'https://www.instagram.com/el_yaqten1?igsh=MXc0Mm5tdXZrcXMyeg==',
      facebookUrl: 'https://www.facebook.com/share/1BfYdHJasd/',
      tiktokUrl: 'https://www.tiktok.com/@el_yaqten1',
      footerCopyright: '© 2023 مكتبة اليقطين الحديثة. جميع الحقوق محفوظة.'
    };
  });

  // Firestore Sync
  useEffect(() => {
    const unsubBooks = onSnapshot(collection(db, 'books'), (snapshot) => {
      if (snapshot.empty) {
        // Initialize with sample data if empty - only if authenticated
        if (isLoggedIn) {
          SAMPLE_BOOKS.forEach(async (book) => {
            try {
              await setDoc(doc(db, 'books', book.id), book);
            } catch (error) {
              console.warn('Seeding books failed:', error);
            }
          });
        }
      } else {
        const booksData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Book));
        setBooks(booksData);
        localStorage.setItem('yaqten_books_cache', JSON.stringify(booksData));
      }
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'books');
      setIsLoading(false);
    });

    const unsubBundles = onSnapshot(collection(db, 'bundles'), (snapshot) => {
      const bundlesData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Bundle));
      setBundles(bundlesData);
      localStorage.setItem('yaqten_bundles_cache', JSON.stringify(bundlesData));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'bundles');
    });

    const unsubAccessories = onSnapshot(collection(db, 'accessories'), (snapshot) => {
      const accessoriesData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Accessory));
      setAccessories(accessoriesData);
      localStorage.setItem('yaqten_accessories_cache', JSON.stringify(accessoriesData));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'accessories');
    });

    const unsubShipping = onSnapshot(collection(db, 'shipping_rates'), (snapshot) => {
      if (snapshot.empty) {
        if (isLoggedIn) {
          EGYPT_GOVERNORATES.forEach(async (gov) => {
            try {
              await setDoc(doc(db, 'shipping_rates', gov), { governorate: gov, price: 50 });
            } catch (error) {
               console.warn('Seeding shipping rates failed');
            }
          });
        }
      } else {
        const shippingData = snapshot.docs.map(doc => ({ ...doc.data() } as ShippingRate));
        setShippingRates(shippingData);
        localStorage.setItem('yaqten_shipping_cache', JSON.stringify(shippingData));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'shipping_rates');
    });

    const unsubSettings = onSnapshot(doc(db, 'settings', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as SiteSettings;
        setSiteSettings(data);
        localStorage.setItem('yaqten_settings_cache', JSON.stringify(data));
      } else {
        const defaultSettings: SiteSettings = {
          heroBookId: '',
          heroTag: 'إصدار متميز لعام 2023',
          heroTitle1: 'يمكنك أن تبحر بلا بحر',
          heroTitle2: 'فقط ان أمسكت كتابا',
          heroSubtitle: 'اكتشف عالم القراءة مع مكتبة اليقطين، حيث تجد أرقى الكتب وأحدث الإصدارات في مكان واحد.',
          footerDescription: 'تأسست في عام 2023 لتكون وجهتكم الأولى للثقافة والمعرفة. نحن نؤمن بأن كل كتاب هو بداية لرحلة معرفية جديدة ومتميزة.',
          whatsappNumber: '201116135630',
          whatsappChannel: 'https://whatsapp.com/channel/0029VbCWI9CKGGG8hZIMIu3W',
          instagramUrl: 'https://www.instagram.com/el_yaqten1?igsh=MXc0Mm5tdXZrcXMyeg==',
          facebookUrl: 'https://www.facebook.com/share/1BfYdHJasd/',
          tiktokUrl: 'https://www.tiktok.com/@el_yaqten1',
          footerCopyright: '© 2023 مكتبة اليقطين الحديثة. جميع الحقوق محفوظة.'
        };
        try {
          setDoc(doc(db, 'settings', 'main'), defaultSettings);
        } catch (error) {
           console.warn('Seeding settings failed');
        }
      }
    }, (error) => {
      if (!error.message.includes('permission-denied')) {
        handleFirestoreError(error, OperationType.GET, 'settings/main');
      }
    });

    return () => {
      unsubBooks();
      unsubBundles();
      unsubAccessories();
      unsubShipping();
      unsubSettings();
    };
  }, [isLoggedIn]); // Re-run when login state changes to trigger seeding if needed

  // Admin Form State
  const [isAdminFormOpen, setIsAdminFormOpen] = useState(false);
  const [isAdminBundleFormOpen, setIsAdminBundleFormOpen] = useState(false);
  const [isAdminAccessoryFormOpen, setIsAdminAccessoryFormOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
  const [accessoryToEdit, setAccessoryToEdit] = useState<Accessory | null>(null);

  // Handlers
  const handleItemSelect = useCallback((item: Book | Bundle | Accessory) => {
    setSelectedItem(item);
    setCurrentView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleToggleWishlist = useCallback((item: Book | Bundle | Accessory) => {
    setWishlist(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.filter(i => i.id !== item.id);
      }
      return [...prev, item];
    });
  }, []);

  const handleAddToCart = useCallback((item: Book | Bundle | Accessory, e?: MouseEvent) => {
    if (e) e.stopPropagation();
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      const coverImage = 'coverImage' in item ? item.coverImage : 'image' in item ? item.image : '';
      return [...prev, { ...item, quantity: 1, coverImage } as CartItem];
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

  const handleClearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const handleAddBook = () => {
    setBookToEdit(null);
    setIsAdminFormOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setBookToEdit(book);
    setIsAdminFormOpen(true);
  };

  const handleDeleteBook = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'books', id));
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleAddBundle = () => {
    setIsAdminBundleFormOpen(true);
  };

  const handleAdminBundleFormSubmit = async (bundleData: Partial<Bundle>) => {
    try {
      const bundleRef = doc(collection(db, 'bundles'));
      const newBundle: Bundle = {
        ...bundleData,
        id: bundleRef.id,
        isBundle: true,
      } as Bundle;
      await setDoc(bundleRef, newBundle);
      setIsAdminBundleFormOpen(false);
    } catch (error) {
      console.error('Error adding bundle:', error);
    }
  };

  const handleDeleteBundle = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'bundles', id));
    } catch (error) {
      console.error('Error deleting bundle:', error);
    }
  };

  const handleAddAccessory = () => {
    setAccessoryToEdit(null);
    setIsAdminAccessoryFormOpen(true);
  };

  const handleEditAccessory = (accessory: Accessory) => {
    setAccessoryToEdit(accessory);
    setIsAdminAccessoryFormOpen(true);
  };

  const handleDeleteAccessory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'accessories', id));
    } catch (error) {
      console.error('Error deleting accessory:', error);
    }
  };

  const handleAdminAccessoryFormSubmit = async (accessoryData: Partial<Accessory>) => {
    try {
      if (accessoryToEdit) {
        await updateDoc(doc(db, 'accessories', accessoryToEdit.id), { ...accessoryData });
      } else {
        const accessoryRef = doc(collection(db, 'accessories'));
        const newAccessory: Accessory = {
          ...accessoryData,
          id: accessoryRef.id,
          rating: Number((Math.random() * 1 + 3.9).toFixed(1)),
          reviewsCount: Math.floor(Math.random() * 50),
        } as Accessory;
        await setDoc(accessoryRef, newAccessory);
      }
      setIsAdminAccessoryFormOpen(false);
    } catch (error) {
      console.error('Error saving accessory:', error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginForm({ username: '', password: '' });
  };

  const handleAdminFormSubmit = async (bookData: Partial<Book>) => {
    try {
      if (bookToEdit) {
        await updateDoc(doc(db, 'books', bookToEdit.id), { ...bookData });
      } else {
        const bookRef = doc(collection(db, 'books'));
        const newBook: Book = {
          ...bookData,
          id: bookRef.id,
          rating: Number((Math.random() * 1 + 3.9).toFixed(1)), // Mock rating for new books
          reviewsCount: Math.floor(Math.random() * 100),
          publishDate: new Date().toLocaleDateString('ar-SA'),
        } as Book;
        await setDoc(bookRef, newBook);
      }
      setIsAdminFormOpen(false);
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleUpdateShippingRates = async (rates: ShippingRate[]) => {
    try {
      for (const rate of rates) {
        await setDoc(doc(db, 'shipping_rates', rate.governorate), rate);
      }
    } catch (error) {
      console.error('Error updating shipping rates:', error);
    }
  };

  const handleUpdateSettings = async (settings: SiteSettings) => {
    try {
      await setDoc(doc(db, 'settings', 'main'), settings);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
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
      try {
        await signInAnonymously(auth);
        setIsLoggedIn(true);
        setLoginError('');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Auth error:', errorMessage);
        
        if (errorMessage.includes('auth/configuration-not-found')) {
          setLoginError('خطأ: خدمة تسجيل الدخول غير مفعلة. يرجى تفعيل "Anonymous Auth" من لوحة تحكم Firebase.');
        } else {
          setLoginError('حدث خطأ أثناء تسجيل الدخول. يرجى التحقق من الاتصال.');
        }
      }
    } else {
      setLoginError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Navbar 
        onCartClick={() => setIsCartOpen(true)} 
        onWishlistClick={() => setCurrentView('wishlist')}
        cartCount={cartItems.reduce((s, i) => s + i.quantity, 0)}
        wishlistCount={wishlist.length}
        onAdminClick={() => setCurrentView('admin')}
        onHomeClick={() => {
          setSearchQuery('');
          setCurrentView('home');
        }}
        onBooksClick={handleBooksScroll}
        onPomodoroClick={() => setCurrentView('pomodoro')}
        currentView={currentView}
      />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex items-center justify-center bg-white"
            >
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-zinc-500 font-bold">جاري تحميل البيانات...</p>
              </div>
            </motion.div>
          ) : (
            <div key="content" className="flex-1">
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
                    accessories={accessories}
                    settings={siteSettings}
                    searchQuery={searchQuery}
                    wishlist={wishlist}
                    onSearchChange={setSearchQuery}
                    onBookSelect={handleItemSelect} 
                    onBundleSelect={handleItemSelect}
                    onAccessorySelect={handleItemSelect}
                    onAddToCart={handleAddToCart} 
                    onToggleWishlist={handleToggleWishlist}
                  />
                </motion.div>
              )}

              {currentView === 'pomodoro' && (
                <motion.div 
                  key="pomodoro"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <PomodoroTimer />
                </motion.div>
              )}

              {currentView === 'wishlist' && (
                <motion.div 
                  key="wishlist"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Wishlist 
                    items={wishlist}
                    onBack={() => setCurrentView('home')}
                    onRemove={(id) => setWishlist(prev => prev.filter(i => i.id !== id))}
                    onSelect={handleItemSelect}
                    onAddToCart={handleAddToCart}
                  />
                </motion.div>
              )}

              {currentView === 'details' && selectedItem && (
                <motion.div 
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductDetails 
                    product={selectedItem} 
                    allBooks={books}
                    isInWishlist={wishlist.some(i => i.id === selectedItem.id)}
                    onBack={() => setCurrentView('home')} 
                    onAddToCart={(item) => handleAddToCart(item)}
                    onToggleWishlist={handleToggleWishlist}
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
                      accessories={accessories}
                      shippingRates={shippingRates}
                      settings={siteSettings}
                      onUpdateShippingRates={handleUpdateShippingRates}
                      onUpdateSettings={handleUpdateSettings}
                      onAddBook={handleAddBook}
                      onEditBook={handleEditBook}
                      onDeleteBook={handleDeleteBook}
                      onAddBundle={handleAddBundle}
                      onDeleteBundle={handleDeleteBundle}
                      onAddAccessory={handleAddAccessory}
                      onEditAccessory={handleEditAccessory}
                      onDeleteAccessory={handleDeleteAccessory}
                      onLogout={handleLogout}
                    />
                  )}
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </main>

      {currentView !== 'admin' && <Footer settings={siteSettings} />}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        shippingRates={shippingRates}
        settings={siteSettings}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
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

      <AdminAccessoryForm 
        isOpen={isAdminAccessoryFormOpen}
        onClose={() => setIsAdminAccessoryFormOpen(false)}
        onSave={handleAdminAccessoryFormSubmit}
        editAccessory={accessoryToEdit}
      />
    </div>
  );
}

