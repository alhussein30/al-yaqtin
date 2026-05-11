import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Book as BookIcon, Package, Users, TrendingUp, Filter, LogOut, Ticket, Truck, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Bundle, ShippingRate, SiteSettings, Accessory } from '../types';
import Logo from './Logo';

interface AdminDashboardProps {
  books: Book[];
  bundles: Bundle[];
  accessories: Accessory[];
  shippingRates: ShippingRate[];
  settings: SiteSettings;
  onUpdateShippingRates: (rates: ShippingRate[]) => void;
  onUpdateSettings: (settings: SiteSettings) => void;
  onAddBook: () => void;
  onEditBook: (book: Book) => void;
  onDeleteBook: (id: string) => void;
  onAddBundle: () => void;
  onDeleteBundle: (id: string) => void;
  onAddAccessory: () => void;
  onEditAccessory: (accessory: Accessory) => void;
  onDeleteAccessory: (id: string) => void;
  onLogout: () => void;
}

export default function AdminDashboard({ 
  books, 
  bundles, 
  accessories,
  shippingRates,
  settings,
  onUpdateShippingRates,
  onUpdateSettings,
  onAddBook, 
  onEditBook, 
  onDeleteBook, 
  onAddBundle,
  onDeleteBundle,
  onAddAccessory,
  onEditAccessory,
  onDeleteAccessory,
  onLogout 
}: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'books' | 'bundles' | 'accessories' | 'shipping' | 'settings'>('books');

  const categories = ['All', ...new Set(books.map(b => b.category))];
  const accessoryCategories = ['All', ...new Set(accessories.map(a => a.category || 'أخرى'))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || book.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredBundles = bundles.filter(bundle => 
    bundle.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAccessories = accessories.filter(accessory => {
    const matchesSearch = accessory.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || accessory.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const confirmDelete = (id: string) => {
    if (activeTab === 'books') {
      onDeleteBook(id);
    } else if (activeTab === 'bundles') {
      onDeleteBundle(id);
    } else if (activeTab === 'accessories') {
      onDeleteAccessory(id);
    }
    setDeleteConfirmId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 text-right">
      <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-6 mb-12">
        <div className="text-right flex items-center gap-4 flex-row-reverse">
          <Logo size="lg" className="rounded-3xl shadow-xl shadow-primary/10" />
          <div>
            <div className="flex items-center gap-4 flex-row-reverse mb-1">
              <h1 className="text-3xl font-bold text-zinc-900">لوحة التحكم</h1>
              <button 
                onClick={onLogout}
                className="px-4 py-2 text-xs font-bold text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2 flex-row-reverse"
              >
                <LogOut className="w-3 h-3" />
                خروج
              </button>
            </div>
            <p className="text-zinc-500">إدارة المخزون، الكتب، والعروض الخاصة لمكتبة اليقطين.</p>
          </div>
        </div>
        
        <div className="flex flex-wrap md:flex-nowrap gap-4 w-full md:w-auto">
          <button 
            onClick={onAddAccessory}
            className="flex-1 min-w-[140px] bg-white border-2 border-zinc-200 text-zinc-600 px-4 md:px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 md:gap-3 hover:bg-zinc-50 transition-all active:scale-95 shadow-sm text-sm md:text-base"
          >
            <Package className="w-5 h-5" />
            إضافة إكسسوار
          </button>
          <button 
            onClick={onAddBundle}
            className="flex-1 min-w-[140px] bg-white border-2 border-primary text-primary px-4 md:px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 md:gap-3 hover:bg-primary/5 transition-all active:scale-95 shadow-sm text-sm md:text-base"
          >
            <Ticket className="w-5 h-5" />
            إضافة عرض
          </button>
          <button 
            onClick={onAddBook}
            className="flex-1 min-w-[140px] bg-primary text-white px-4 md:px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 md:gap-3 shadow-xl hover:bg-primary-light transition-all active:scale-95 shadow-primary/20 text-sm md:text-base"
          >
            <Plus className="w-5 h-5" />
            إضافة كتاب
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 flex-row-reverse overflow-x-auto whitespace-nowrap pb-4 scrollbar-hide snap-x">
        <button 
          onClick={() => setActiveTab('books')}
          className={`flex-shrink-0 px-8 py-3 rounded-xl font-bold text-sm transition-all snap-start ${
            activeTab === 'books' 
              ? 'bg-primary text-white shadow-lg shadow-primary/20' 
              : 'bg-white text-zinc-400 hover:text-zinc-600 border border-zinc-100'
          }`}
        >
          الكتب ({books.length})
        </button>
        <button 
          onClick={() => setActiveTab('bundles')}
          className={`flex-shrink-0 px-8 py-3 rounded-xl font-bold text-sm transition-all snap-start ${
            activeTab === 'bundles' 
              ? 'bg-primary text-white shadow-lg shadow-primary/20' 
              : 'bg-white text-zinc-400 hover:text-zinc-600 border border-zinc-100'
          }`}
        >
          العروض والحزم ({bundles.length})
        </button>
        <button 
          onClick={() => { setActiveTab('accessories'); setFilterCategory('All'); }}
          className={`flex-shrink-0 px-8 py-3 rounded-xl font-bold text-sm transition-all snap-start ${
            activeTab === 'accessories' 
              ? 'bg-primary text-white shadow-lg shadow-primary/20' 
              : 'bg-white text-zinc-400 hover:text-zinc-600 border border-zinc-100'
          }`}
        >
          الإكسسوارات ({accessories.length})
        </button>
        <button 
          onClick={() => setActiveTab('shipping')}
          className={`flex-shrink-0 px-8 py-3 rounded-xl font-bold text-sm transition-all snap-start ${
            activeTab === 'shipping' 
              ? 'bg-primary text-white shadow-lg shadow-primary/20' 
              : 'bg-white text-zinc-400 hover:text-zinc-600 border border-zinc-100'
          }`}
        >
          أسعار الشحن ({shippingRates.length})
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex-shrink-0 px-8 py-3 rounded-xl font-bold text-sm transition-all snap-start ${
            activeTab === 'settings' 
              ? 'bg-primary text-white shadow-lg shadow-primary/20' 
              : 'bg-white text-zinc-400 hover:text-zinc-600 border border-zinc-100'
          }`}
        >
          إعدادات الموقع
        </button>
      </div>

      {/* Stats Cards */}
      {activeTab === 'books' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-in fade-in duration-500">
          <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm flex items-center gap-6 flex-row-reverse">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
              <BookIcon className="w-7 h-7" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-zinc-900">{books.length}</div>
              <div className="text-xs text-zinc-400 font-bold uppercase tracking-widest">إجمالي الكتب</div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm flex items-center gap-6 flex-row-reverse">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-zinc-900">45,230</div>
              <div className="text-xs text-zinc-400 font-bold uppercase tracking-widest">المبيعات (ج.م)</div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm flex items-center gap-6 flex-row-reverse">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500">
              <Users className="w-7 h-7" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-zinc-900">1,280</div>
              <div className="text-xs text-zinc-400 font-bold uppercase tracking-widest">العملاء</div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm flex items-center gap-6 flex-row-reverse">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
              <Package className="w-7 h-7" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-zinc-900">{categories.length - 1}</div>
              <div className="text-xs text-zinc-400 font-bold uppercase tracking-widest">التصنيفات</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
        {activeTab !== 'shipping' && activeTab !== 'settings' && (
          <div className="p-8 border-b border-zinc-50 flex flex-col sm:flex-row-reverse items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <input 
                type="text" 
                placeholder={activeTab === 'books' ? "البحث في الكتب..." : activeTab === 'accessories' ? "البحث في الإكسسوارات..." : "البحث في العروض..."} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-50 border-none rounded-xl py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all text-right"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            </div>
            
            {(activeTab === 'books' || activeTab === 'accessories') && (
              <div className="flex gap-4 w-full sm:w-auto">
                <div className="relative min-w-[150px]">
                  <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full appearance-none bg-zinc-50 border border-zinc-100 rounded-xl px-10 py-3 text-sm font-bold text-zinc-500 outline-none focus:ring-2 focus:ring-primary/10 transition-all text-right"
                  >
                    {(activeTab === 'books' ? categories : accessoryCategories).map(cat => (
                      <option key={cat} value={cat}>{cat === 'All' ? 'جميع التصنيفات' : cat}</option>
                    ))}
                  </select>
                  <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                </div>
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 border border-zinc-100 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-50 transition-all flex-row-reverse">
                  تصدير بيانات
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'shipping' ? (
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8 flex-row-reverse">
              <Truck className="text-primary w-6 h-6" />
              <h2 className="text-xl font-bold text-zinc-900">إدارة أسعار الشحن للمحافظات</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shippingRates.map((rate, index) => (
                <div key={rate.governorate} className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 flex flex-col gap-4">
                  <div className="flex justify-between items-center flex-row-reverse">
                    <span className="font-bold text-zinc-900">{rate.governorate}</span>
                    <Truck className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-zinc-400">ج.م</span>
                    <input 
                      type="number"
                      value={rate.price}
                      onChange={(e) => {
                        const newRates = [...shippingRates];
                        newRates[index] = { ...rate, price: parseFloat(e.target.value) || 0 };
                        onUpdateShippingRates(newRates);
                      }}
                      className="flex-1 bg-white border border-zinc-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all text-right"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'settings' ? (
          <div className="p-8 text-right">
            <div className="flex items-center gap-3 mb-8 flex-row-reverse">
              <Settings className="text-primary w-6 h-6" />
              <h2 className="text-xl font-bold text-zinc-900">إعدادات محتوى الموقع</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-8 max-w-3xl ml-auto">
              {/* Hero Section Settings */}
              <div className="space-y-6 bg-zinc-50 p-8 rounded-[2rem] border border-zinc-100">
                <h3 className="text-lg font-bold text-zinc-900 mb-4 border-b border-zinc-200 pb-2">قسم الترحيب (Hero)</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-500 block">الكتاب المميز (يظهر بجانب النص)</label>
                  <select 
                    value={settings.heroBookId || ''}
                    onChange={(e) => onUpdateSettings({ ...settings, heroBookId: e.target.value })}
                    className="w-full bg-white border border-zinc-200 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all text-right appearance-none"
                  >
                    <option value="">اختر كتاباً...</option>
                    {books.map(book => (
                      <option key={book.id} value={book.id}>{book.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-500 block">نص الشارة العلوي</label>
                  <input 
                    type="text"
                    value={settings.heroTag}
                    onChange={(e) => onUpdateSettings({ ...settings, heroTag: e.target.value })}
                    className="w-full bg-white border border-zinc-200 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all text-right"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-500 block">العنوان الرئيسي 1</label>
                    <input 
                      type="text"
                      value={settings.heroTitle1}
                      onChange={(e) => onUpdateSettings({ ...settings, heroTitle1: e.target.value })}
                      className="w-full bg-white border border-zinc-200 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all text-right"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-500 block">العنوان الملون</label>
                    <input 
                      type="text"
                      value={settings.heroTitle2}
                      onChange={(e) => onUpdateSettings({ ...settings, heroTitle2: e.target.value })}
                      className="w-full bg-white border border-zinc-200 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all text-right text-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-500 block">الوصف الثانوي</label>
                  <textarea 
                    rows={3}
                    value={settings.heroSubtitle}
                    onChange={(e) => onUpdateSettings({ ...settings, heroSubtitle: e.target.value })}
                    className="w-full bg-white border border-zinc-200 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all text-right resize-none"
                  />
                </div>
              </div>

              {/* Footer Section Settings */}
              <div className="space-y-6 bg-zinc-50 p-8 rounded-[2rem] border border-zinc-100">
                <h3 className="text-lg font-bold text-zinc-900 mb-4 border-b border-zinc-200 pb-2">تذييل الصفحة (Footer)</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-500 block">وصف المكتبة</label>
                  <textarea 
                    rows={3}
                    value={settings.footerDescription}
                    onChange={(e) => onUpdateSettings({ ...settings, footerDescription: e.target.value })}
                    className="w-full bg-white border border-zinc-200 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all text-right resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-500 block">رقم واتساب (بدون +)</label>
                  <input 
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => onUpdateSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full bg-white border border-zinc-200 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all text-left font-mono"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-500 block">نص حقوق الملكية</label>
                  <input 
                    type="text"
                    value={settings.footerCopyright}
                    onChange={(e) => onUpdateSettings({ ...settings, footerCopyright: e.target.value })}
                    className="w-full bg-white border border-zinc-200 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all text-right"
                  />
                </div>
              </div>

              {/* Social Media Settings */}
              <div className="space-y-6 bg-zinc-50 p-8 rounded-[2rem] border border-zinc-100">
                <h3 className="text-lg font-bold text-zinc-900 mb-4 border-b border-zinc-200 pb-2">روابط التواصل الاجتماعي</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-500 block">قناة الواتساب</label>
                  <input 
                    type="text"
                    value={settings.whatsappChannel}
                    onChange={(e) => onUpdateSettings({ ...settings, whatsappChannel: e.target.value })}
                    className="w-full bg-white border border-zinc-200 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all text-left"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-500 block">رابط فيسبوك</label>
                  <input 
                    type="text"
                    value={settings.facebookUrl}
                    onChange={(e) => onUpdateSettings({ ...settings, facebookUrl: e.target.value })}
                    className="w-full bg-white border border-zinc-200 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all text-left"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-500 block">رابط انستجرام</label>
                  <input 
                    type="text"
                    value={settings.instagramUrl}
                    onChange={(e) => onUpdateSettings({ ...settings, instagramUrl: e.target.value })}
                    className="w-full bg-white border border-zinc-200 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all text-left"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-500 block">رابط تيك توك</label>
                  <input 
                    type="text"
                    value={settings.tiktokUrl}
                    onChange={(e) => onUpdateSettings({ ...settings, tiktokUrl: e.target.value })}
                    className="w-full bg-white border border-zinc-200 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-xl border border-green-100 font-bold text-sm justify-center">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                يتم حفظ التغييرات تلقائياً وبشكل فوري
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto text-right" dir="rtl">
            <div className="min-w-[800px]">
              <table className="w-full">
                <thead>
                  <tr className="bg-zinc-50 text-zinc-400 text-xs font-bold uppercase tracking-widest text-right">
                    <th className="px-8 py-5">{activeTab === 'books' ? 'الكتاب' : activeTab === 'accessories' ? 'الإكسسوار' : 'العرض'}</th>
                    <th className="px-8 py-5">{activeTab === 'books' ? 'الفئة' : activeTab === 'accessories' ? 'الفئة' : 'عدد الكتب'}</th>
                    <th className="px-8 py-5">المخزن</th>
                    <th className="px-8 py-5">السعر</th>
                    <th className="px-8 py-5 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                <AnimatePresence mode="popLayout">
                  {activeTab === 'books' ? (
                    filteredBooks.map((book) => (
                      <motion.tr 
                        layout
                        key={book.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="hover:bg-zinc-50/50 transition-colors group"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4 flex-row-reverse">
                            <img src={book.coverImage} className="w-12 h-16 object-cover rounded-lg shadow-sm" alt="" />
                            <div className="text-right">
                              <div className="font-bold text-zinc-900 group-hover:text-primary transition-colors line-clamp-1">{book.title}</div>
                              <div className="text-xs text-zinc-400">{book.author}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="inline-block px-3 py-1 bg-zinc-100 text-zinc-500 rounded-lg text-xs font-bold">
                            {book.category}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`font-bold ${book.stock && book.stock < 5 ? 'text-red-500' : 'text-zinc-600'}`}>
                            {book.stock || 0} وحدة
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="font-bold text-primary">
                            {book.price.toFixed(2)} ج.م
                            {book.discountPercentage ? (
                              <span className="text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded-md mr-1">
                                -{book.discountPercentage}%
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex gap-2 justify-center">
                            <button 
                              onClick={() => onEditBook(book)}
                              className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-zinc-100 text-zinc-400 hover:text-primary transition-all"
                              title="تعديل"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            
                            {deleteConfirmId === book.id ? (
                              <div className="flex items-center gap-1">
                                <button 
                                  onClick={() => confirmDelete(book.id)}
                                  className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg hover:bg-red-600 transition-all"
                                >
                                  تأكيد
                                </button>
                                <button 
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-3 py-1 bg-zinc-100 text-zinc-500 text-[10px] font-bold rounded-lg hover:bg-zinc-200 transition-all"
                                >
                                  إلغاء
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => setDeleteConfirmId(book.id)}
                                className="p-2 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 text-zinc-400 hover:text-red-500 transition-all"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : activeTab === 'accessories' ? (
                    filteredAccessories.map((accessory) => (
                      <motion.tr 
                        layout
                        key={accessory.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="hover:bg-zinc-50/50 transition-colors group"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4 flex-row-reverse">
                            <img src={accessory.image} className="w-12 h-12 object-cover rounded-lg shadow-sm" alt="" />
                            <div className="text-right">
                              <div className="font-bold text-zinc-900 group-hover:text-primary transition-colors line-clamp-1">{accessory.title}</div>
                              <div className="text-xs text-zinc-400">{accessory.description.substring(0, 30)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="inline-block px-3 py-1 bg-zinc-100 text-zinc-500 rounded-lg text-xs font-bold">
                            {accessory.category || 'أخرى'}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`font-bold ${accessory.stock && accessory.stock < 5 ? 'text-red-500' : 'text-zinc-600'}`}>
                            {accessory.stock || 0} وحدة
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="font-bold text-primary">
                            {accessory.price.toFixed(2)} ج.م
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex gap-2 justify-center">
                            <button 
                              onClick={() => onEditAccessory(accessory)}
                              className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-zinc-100 text-zinc-400 hover:text-primary transition-all"
                              title="تعديل"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            
                            {deleteConfirmId === accessory.id ? (
                              <div className="flex items-center gap-1">
                                <button 
                                  onClick={() => confirmDelete(accessory.id)}
                                  className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg hover:bg-red-600 transition-all"
                                >
                                  تأكيد
                                </button>
                                <button 
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-3 py-1 bg-zinc-100 text-zinc-500 text-[10px] font-bold rounded-lg hover:bg-zinc-200 transition-all"
                                >
                                  إلغاء
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => setDeleteConfirmId(accessory.id)}
                                className="p-2 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 text-zinc-400 hover:text-red-500 transition-all"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    filteredBundles.map((bundle) => (
                      <motion.tr 
                        layout
                        key={bundle.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="hover:bg-zinc-50/50 transition-colors group"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4 flex-row-reverse">
                            <div className="w-12 h-16 bg-zinc-100 rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
                              {bundle.coverImage ? (
                                  <img src={bundle.coverImage} className="w-full h-full object-cover" alt="" />
                              ) : (
                                  <Ticket className="w-6 h-6 text-zinc-300" />
                              )}
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-zinc-900 group-hover:text-primary transition-colors line-clamp-1">{bundle.title}</div>
                              <div className="text-xs text-zinc-400 line-clamp-1">{bundle.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold">
                            {bundle.books.length} كتب
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-green-500 font-bold text-xs flex items-center gap-1 flex-row-reverse">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            نشط حالياً
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="text-right">
                            <div className="font-bold text-primary">{bundle.price.toFixed(2)} ج.م</div>
                            {bundle.oldPrice !== undefined && bundle.oldPrice > 0 && (
                              <div className="text-[10px] text-zinc-400 line-through">{bundle.oldPrice.toFixed(2)} ج.م</div>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex gap-2 justify-center">
                            {deleteConfirmId === bundle.id ? (
                              <div className="flex items-center gap-1">
                                <button 
                                  onClick={() => confirmDelete(bundle.id)}
                                  className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg hover:bg-red-600 transition-all"
                                >
                                  تأكيد
                                </button>
                                <button 
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-3 py-1 bg-zinc-100 text-zinc-500 text-[10px] font-bold rounded-lg hover:bg-zinc-200 transition-all"
                                >
                                  إلغاء
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => setDeleteConfirmId(bundle.id)}
                                className="p-2 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 text-zinc-400 hover:text-red-500 transition-all"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
            {((activeTab === 'books' && filteredBooks.length === 0) || 
              (activeTab === 'bundles' && filteredBundles.length === 0) || 
              (activeTab === 'accessories' && filteredAccessories.length === 0)) && (
              <div className="p-20 text-center">
                <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-300">
                  <Search className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">لا توجد نتائج</h3>
                <p className="text-zinc-500 text-sm">جرب البحث بكلمات أخرى أو تغيير الفلتر</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
  );
}

