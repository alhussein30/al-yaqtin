import { useState } from 'react';
import { motion } from 'motion/react';
import { Book, Bundle, SiteSettings, Accessory } from '../types';
import BookCard from './BookCard';
import { MouseEvent } from 'react';
import { Ticket, ShoppingCart, Package, Search } from 'lucide-react';

interface HomeProps {
  books: Book[];
  bundles: Bundle[];
  accessories: Accessory[];
  settings: SiteSettings;
  searchQuery?: string;
  wishlist: (Book | Bundle | Accessory)[];
  onSearchChange?: (query: string) => void;
  onBookSelect: (book: Book) => void;
  onBundleSelect: (bundle: Bundle) => void;
  onAccessorySelect: (accessory: Accessory) => void;
  onAddToCart: (item: Book | Bundle | Accessory, e: MouseEvent) => void;
  onToggleWishlist: (item: Book | Bundle | Accessory) => void;
}

export default function Home({ 
  books, 
  bundles, 
  accessories, 
  settings, 
  searchQuery = '',
  wishlist,
  onSearchChange,
  onBookSelect, 
  onBundleSelect, 
  onAccessorySelect, 
  onAddToCart,
  onToggleWishlist
}: HomeProps) {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const categories = ['الكل', ...new Set(books.map(b => b.category))];

  const filteredBooks = books.filter(b => {
    const matchesCategory = activeCategory === 'الكل' || b.category === activeCategory;
    const matchesSearch = !searchQuery || 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredBundles = bundles.filter(b => 
    !searchQuery || 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAccessories = accessories.filter(a => 
    !searchQuery || 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredBook = settings.heroBookId 
    ? books.find(b => b.id === settings.heroBookId) || books[0]
    : books[0];

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-primary">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-full flex flex-col md:flex-row items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:w-1/2 text-white text-right order-2 md:order-1"
          >
            <div className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold mb-6 border border-white/20">
               {settings.heroTag}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-white">{settings.heroTitle1}</span> <br />
              <span className="text-gold">{settings.heroTitle2}</span>
            </h1>
            <p className="text-lg text-white/70 mb-10 max-w-lg ml-auto leading-relaxed">
              {settings.heroSubtitle}
            </p>
            <div className="flex items-center gap-6 justify-end">
               <button 
                onClick={() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-primary transition-all flex items-center gap-3 group shadow-xl"
               >
                 <span>عن المكتبة</span>
                 <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                   ←
                 </div>
               </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="md:w-1/2 flex justify-center py-12 order-1 md:order-2"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-110" />
              <motion.img 
                src={featuredBook?.coverImage || "https://images.unsplash.com/photo-1544640808-32ca72ac7f37?auto=format&fit=crop&q=80&w=1000"} 
                alt={featuredBook?.title || "Library"} 
                className="w-64 md:w-80 h-auto rounded-xl shadow-[0_50px_100px_rgba(0,0,0,0.4)] cursor-pointer"
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [6, 4, 6]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                onClick={() => featuredBook && onBookSelect(featuredBook)}
              />
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Bundles Section */}
      {filteredBundles && filteredBundles.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 bg-primary/5 rounded-[4rem] my-20">
          <div className="flex flex-row items-center justify-between gap-6 mb-12">
            <div className="flex gap-2">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-400 border border-zinc-100 hover:text-primary transition-colors cursor-pointer">→</div>
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-400 border border-zinc-100 hover:text-primary transition-colors cursor-pointer">←</div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-primary text-white rounded-full text-xs font-bold mb-4 flex-row-reverse">
                <Ticket className="w-3 h-3" />
                عروض حصرية
              </div>
              <h2 className="text-4xl font-bold mb-3">قوائم التوفير</h2>
              <p className="text-zinc-500">اختر مجموعتك المفضلة ووفر أكثر مع عروضنا الخاصة.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBundles.map((bundle) => (
              <motion.div 
                key={bundle.id}
                whileHover={{ y: -10 }}
                onClick={() => onBundleSelect(bundle)}
                className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 shadow-xl shadow-primary/5 flex flex-col items-end text-right group relative overflow-hidden cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem] -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700" />
                
                <div className="w-full h-48 bg-zinc-50 rounded-3xl overflow-hidden mb-8 relative z-10 flex items-center justify-center">
                    {bundle.coverImage ? (
                        <img src={bundle.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                    ) : (
                        <div className="flex -space-x-6 items-center justify-center">
                            {bundle.books.slice(0, 3).map((bookId, i) => {
                                const book = books.find(b => b.id === bookId);
                                return book ? (
                                    <img 
                                        key={bookId}
                                        src={book.coverImage} 
                                        className="w-24 h-32 object-cover rounded-lg shadow-lg border-2 border-white"
                                        style={{ transform: `rotate(${i * 10 - 10}deg)`, zIndex: 10 - i }}
                                        alt="" 
                                    />
                                ) : null;
                            })}
                        </div>
                    )}
                </div>

                <h3 className="text-2xl font-bold text-zinc-900 mb-4 group-hover:text-primary transition-colors">{bundle.title}</h3>
                <p className="text-zinc-500 text-sm mb-6 line-clamp-2 leading-relaxed">{bundle.description}</p>
                
                <div className="flex flex-wrap gap-2 justify-end mb-8">
                  {bundle.books.map(bookId => {
                    const book = books.find(b => b.id === bookId);
                    return book ? (
                      <span key={bookId} className="text-[10px] font-bold px-3 py-1 bg-zinc-50 text-zinc-400 rounded-full border border-zinc-100">
                        {book.title}
                      </span>
                    ) : null;
                  })}
                </div>

                <div className="w-full pt-6 border-t border-zinc-50 flex items-center justify-between">
                  <button 
                    onClick={(e) => onAddToCart(bundle, e)}
                    className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                  <div className="text-right">
                    <div className="text-2xl font-black text-primary">
                        {bundle.price.toFixed(2)} ج.م
                    </div>
                    {bundle.oldPrice !== undefined && bundle.oldPrice > 0 && (
                      <div className="text-xs text-zinc-400 line-through font-bold">{bundle.oldPrice.toFixed(2)} ج.م</div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Accessories Section */}
      {filteredAccessories && filteredAccessories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 bg-zinc-50/50">
          <div className="flex flex-row items-center justify-between gap-6 mb-12">
            <div className="flex gap-2">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-400 border border-zinc-100 hover:text-primary transition-colors cursor-pointer">→</div>
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-400 border border-zinc-100 hover:text-primary transition-colors cursor-pointer">←</div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-zinc-100 text-zinc-500 rounded-full text-xs font-bold mb-4 flex-row-reverse">
                <Package className="w-3 h-3" />
                تحف وهدايا
              </div>
              <h2 className="text-4xl font-bold mb-3">إكسسوارات القراءة</h2>
              <p className="text-zinc-500">مجموعة من الإكسسوارات المميزة لكل محبي القراءة.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredAccessories.map((accessory, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                key={accessory.id}
                onClick={() => onAccessorySelect(accessory)}
                className="bg-white rounded-[2.5rem] p-6 border border-zinc-100 shadow-xl shadow-primary/5 group cursor-pointer"
              >
                <div className="relative aspect-square mb-6 overflow-hidden rounded-3xl bg-zinc-50">
                  <img 
                    src={accessory.image} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={accessory.title} 
                  />
                  {accessory.isNew && (
                    <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg z-10">
                      NEW
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold mb-2 line-clamp-1 text-right">{accessory.title}</h3>
                <p className="text-zinc-400 text-xs mb-6 line-clamp-2 text-right">{accessory.description}</p>
                
                <div className="flex items-center justify-between flex-row-reverse">
                  <div className="text-right">
                    <div className="text-lg font-black text-primary">
                      {accessory.price.toFixed(2)} ج.م
                    </div>
                  </div>
                  <button 
                    onClick={(e) => onAddToCart(accessory, e)}
                    className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Categories & Filter */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 mt-6 md:-mt-10 relative z-20">
        <div className="bg-white p-3 md:p-4 rounded-[2rem] shadow-xl border border-zinc-100 overflow-x-auto scrollbar-hide snap-x">
          <div className="flex items-center gap-2 min-w-max px-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold transition-all snap-start ${
                  activeCategory === cat 
                    ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' 
                    : 'text-zinc-500 hover:bg-zinc-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Book Grid */}
      <section id="books-grid" className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8 mb-12">
          <div className="text-right w-full md:w-auto">
            <h2 className="text-3xl font-bold mb-2">المجموعة المختارة</h2>
            <p className="text-zinc-400">كتب تم اختيارها بعناية من قبل قيّمينا.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
            <div className="relative w-full sm:w-80">
              <input 
                type="text" 
                placeholder="البحث عن كتاب او مؤلف..." 
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full bg-zinc-100 border-none rounded-2xl py-4 pr-12 pl-6 text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium text-right"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
            </div>
            
            <div className="hidden md:flex gap-2">
              <div className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 cursor-pointer hover:border-primary hover:text-primary transition-all">→</div>
              <div className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 cursor-pointer hover:border-primary hover:text-primary transition-all">←</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredBooks.map((book, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={book.id}
            >
              <BookCard 
                book={book} 
                onClick={() => onBookSelect(book)}
                onAddToCart={(e) => onAddToCart(book, e)}
                onToggleWishlist={(e) => {
                  e.stopPropagation();
                  onToggleWishlist(book);
                }}
                isInWishlist={wishlist.some(i => i.id === book.id)}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Library Section */}
      <section id="about-section" className="max-w-7xl mx-auto px-6 md:px-12 mb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all" />
              <img 
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1000" 
                alt="Library" 
                className="relative z-10 w-full h-[400px] object-cover rounded-[3rem] shadow-2xl"
              />
            </div>
          </div>
          <div className="text-right order-1 md:order-2">
            <div className="inline-block px-4 py-1 bg-primary/5 rounded-full text-xs font-bold text-primary mb-6">
              من نحن
            </div>
            <h2 className="text-4xl font-bold mb-6 text-zinc-900">عن المكتبة</h2>
            <div className="space-y-6 text-zinc-600 leading-loose">
              <p className="text-lg">
                تأسست مكتبتنا في عام <span className="text-primary font-black">2023</span> لتكون وجهة ثقافية رائدة تجمع بين عراقة الحرف ومعاصرة الفكر. نحن نؤمن بأن كل كتاب هو رحلة جديدة، ونحرص على اختيار أفضل العناوين التي تفتح آفاقاً جديدة للقراء.
              </p>
              <p>
                نهدف إلى توفير بيئة ملهمة لكل محبي القراءة، من خلال تقديم تشكيلة متنوعة من الكتب المختارة بعناية في مجالات الفلسفة، الأدب، العلوم، والفنون. رحلتنا بدأت بشغف، وتستمر بدعمكم لتطوير مجتمع قارئ ومثقف.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mt-12">
              <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100 flex flex-col items-center">
                <div className="text-3xl font-black text-primary mb-1">2023</div>
                <div className="text-xs font-bold text-zinc-400 text-center">عام التأسيس</div>
              </div>
              <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100 flex flex-col items-center">
                <div className="text-3xl font-black text-primary mb-1">+5000</div>
                <div className="text-xs font-bold text-zinc-400 text-center">كتاب مختار</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-20">
        <div className="bg-secondary rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden text-right">
          <div className="absolute right-0 top-0 w-1/2 h-full bg-white/5 skew-x-[-20deg] translate-x-20" />
          <div className="relative z-10 max-w-2xl ml-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">هل تبحث عن كتاب نادر؟</h2>
            <p className="text-white/70 text-lg mb-10 leading-relaxed">
              خدمة توفير الكتب الخاصة من ميراد توفر لك فرصة اقتناء أندر النسخ من جميع أنحاء العالم. أخبرنا عما تبحث عنه وسنتولى المهمة.
            </p>
            <button 
              onClick={() => window.open(`https://wa.me/${settings.whatsappNumber}`, '_blank')}
              className="bg-white text-secondary px-10 py-5 rounded-2xl font-bold hover:scale-105 transition-transform flex items-center gap-3 ml-auto"
            >
              تواصل مع المنسق
              <span className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center">←</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
