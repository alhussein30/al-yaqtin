import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { X, Save, Image as ImageIcon, Check, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Bundle } from '../types';

interface AdminBundleFormProps {
  isOpen: boolean;
  books: Book[];
  onClose: () => void;
  onSave: (bundle: Partial<Bundle>) => void;
}

export default function AdminBundleForm({ isOpen, books, onClose, onSave }: AdminBundleFormProps) {
  const [formData, setFormData] = useState<Partial<Bundle>>({
    title: '',
    description: '',
    price: 0,
    oldPrice: 0,
    books: [],
    coverImage: '',
    isBundle: true
  });

  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        price: 0,
        oldPrice: 0,
        books: [],
        coverImage: '',
        isBundle: true
      });
      setSelectedBooks([]);
    }
  }, [isOpen]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('حجم الصورة كبير جداً. يرجى اختيار صورة أقل من 2 ميجابايت.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, coverImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedBooks.length === 0) {
      alert('الرجاء اختيار كتاب واحد على الأقل');
      return;
    }
    onSave({ ...formData, books: selectedBooks });
  };

  const toggleBook = (bookId: string) => {
    setSelectedBooks(prev => 
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-[110] flex flex-col"
          >
            <div className="flex items-center justify-between p-8 border-b border-zinc-100 bg-zinc-50/50">
              <h2 className="text-2xl font-bold text-primary">إضافة عرض جديد</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-200 rounded-full transition-colors text-zinc-400"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3 text-right">
                  <label className="text-sm font-bold text-zinc-700">عنوان العرض</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full bg-zinc-100 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-right"
                    placeholder="مثال: باقة المعرفة الشاملة" 
                  />
                </div>

                <div className="space-y-3 text-right">
                  <label className="text-sm font-bold text-zinc-700">وصف العرض</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-zinc-100 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium h-32 resize-none text-right"
                    placeholder="اشرح ميزات هذا العرض..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-6 text-right">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-700">السعر الجديد (ج.م)</label>
                    <input 
                      type="number" 
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full bg-zinc-100 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-right"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-700">السعر الأصلي (ج.م)</label>
                    <input 
                      type="number" 
                      value={formData.oldPrice}
                      onChange={(e) => setFormData({ ...formData, oldPrice: parseFloat(e.target.value) })}
                      className="w-full bg-zinc-100 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-right"
                    />
                  </div>
                </div>

                <div className="space-y-3 text-right">
                  <label className="text-sm font-bold text-zinc-700">اختر الكتب المشمولة في العرض</label>
                  <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {books.map(book => (
                      <button
                        key={book.id}
                        type="button"
                        onClick={() => toggleBook(book.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-right flex-row-reverse ${
                          selectedBooks.includes(book.id) 
                            ? 'border-primary bg-primary/5' 
                            : 'border-zinc-100 hover:bg-zinc-50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          selectedBooks.includes(book.id) 
                            ? 'bg-primary border-primary text-white' 
                            : 'border-zinc-300'
                        }`}>
                          {selectedBooks.includes(book.id) && <Check className="w-3 h-3" />}
                        </div>
                        <img src={book.coverImage} className="w-8 h-10 object-cover rounded-md" alt="" />
                        <div className="flex-1">
                          <div className="text-xs font-bold text-zinc-900 line-clamp-1">{book.title}</div>
                          <div className="text-[10px] text-zinc-400">{book.author}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 text-right">
                  <label className="text-sm font-bold text-zinc-700">صورة العرض</label>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <input 
                        type="url" 
                        value={formData.coverImage}
                        onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                        className="flex-1 bg-zinc-100 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        placeholder="رابط الصورة (URL)" 
                      />
                      <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-zinc-300 text-zinc-400 overflow-hidden">
                        {formData.coverImage ? (
                          <img src={formData.coverImage} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <ImageIcon className="w-6 h-6" />
                        )}
                      </div>
                    </div>

                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="bundle-image-upload"
                      />
                      <label 
                        htmlFor="bundle-image-upload"
                        className="w-full bg-zinc-50 border-2 border-dashed border-zinc-200 hover:border-primary/50 hover:bg-primary/5 transition-all rounded-2xl p-4 flex items-center justify-center gap-3 cursor-pointer group text-zinc-500 hover:text-primary"
                      >
                        <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold">رفع صورة من الجهاز</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-10 flex gap-4">
                  <button 
                    type="submit"
                    className="flex-1 bg-primary text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl hover:bg-primary-light transition-all active:scale-95"
                  >
                    <Save className="w-6 h-6" />
                    حفظ العرض
                  </button>
                  <button 
                    type="button"
                    onClick={onClose}
                    className="px-8 border-2 border-zinc-100 text-zinc-400 rounded-2xl font-bold hover:bg-zinc-100 transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
