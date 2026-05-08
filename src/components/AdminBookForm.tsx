import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { X, Save, Image as ImageIcon, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Book } from '../types';

interface AdminBookFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (book: Partial<Book>) => void;
  editBook: Book | null;
}

const BOOK_CATEGORIES = [
  'التاريخ',
  'الخيال',
  'الفنون والثقافة',
  'الفلسفة',
  'روايات',
  'تطوير الذات',
  'علوم',
  'دين',
  'أطفال',
  'أدب',
  'علم نفس',
  'تكنولوجيا',
  'اقتصاد',
  'سياسة',
  'تاريخ الفن'
];

export default function AdminBookForm({ isOpen, onClose, onSave, editBook }: AdminBookFormProps) {
  const [formData, setFormData] = useState<Partial<Book>>({
    title: '',
    author: '',
    description: '',
    price: 0,
    category: BOOK_CATEGORIES[0],
    coverImage: '',
    rating: 5,
    reviewsCount: 0,
    pages: 0,
    language: 'العربية',
    publishDate: '2024',
    isbn: '',
    coverType: 'غلاف ورقي',
    isNew: true,
    discountPercentage: 0,
    stock: 0
  });

  useEffect(() => {
    if (editBook) {
      setFormData({
        ...editBook,
        discountPercentage: editBook.discountPercentage || 0,
        stock: editBook.stock || 0
      });
    } else {
      setFormData({
        title: '',
        author: '',
        description: '',
        price: 0,
        category: BOOK_CATEGORIES[0],
        coverImage: '',
        rating: 5,
        reviewsCount: 0,
        pages: 0,
        language: 'العربية',
        publishDate: '2024',
        isbn: '',
        coverType: 'غلاف ورقي',
        isNew: true,
        discountPercentage: 0,
        stock: 0
      });
    }
  }, [editBook, isOpen]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 2MB for localStorage)
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
    onSave(formData);
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
              <h2 className="text-2xl font-bold text-primary">
                {editBook ? 'تعديل بيانات الكتاب' : 'إضافة كتاب جديد'}
              </h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-200 rounded-full transition-colors text-zinc-400"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-zinc-700">عنوان الكتاب</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full bg-zinc-100 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-right"
                    placeholder="e.g., روح المجلس" 
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-zinc-700">اسم المؤلف</label>
                  <input 
                    type="text" 
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    required
                    className="w-full bg-zinc-100 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-right"
                    placeholder="اسم المؤلف الكامل" 
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-zinc-700">الوصف التفصيلي</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-zinc-100 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium h-32 resize-none text-right"
                    placeholder="نبذة مختصرة عن محتوى الكتاب..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-700">السعر (ج.م)</label>
                    <input 
                      type="number" 
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full bg-zinc-100 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-right"
                      placeholder="0.00" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-700">الفئة</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-zinc-100 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[left:1rem_center] bg-no-repeat text-right pl-10"
                    >
                      {BOOK_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-700">عدد الصفحات</label>
                    <input 
                      type="number" 
                      value={formData.pages}
                      onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) })}
                      className="w-full bg-zinc-100 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-right"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-700">اللغة</label>
                    <input 
                      type="text" 
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="w-full bg-zinc-100 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-700">ISBN</label>
                    <input 
                      type="text" 
                      value={formData.isbn}
                      onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                      className="w-full bg-zinc-100 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-right font-mono"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-700">نوع الغلاف</label>
                    <input 
                      type="text" 
                      value={formData.coverType}
                      onChange={(e) => setFormData({ ...formData, coverType: e.target.value })}
                      className="w-full bg-zinc-100 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-700">نسبة الخصم (%)</label>
                    <input 
                      type="number" 
                      value={formData.discountPercentage}
                      onChange={(e) => setFormData({ ...formData, discountPercentage: parseInt(e.target.value) })}
                      className="w-full bg-zinc-100 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-right"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-700">الكمية في المخزن</label>
                    <input 
                      type="number" 
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                      className="w-full bg-zinc-100 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-right"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-zinc-700">صورة الغلاف</label>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <input 
                        type="url" 
                        value={formData.coverImage}
                        onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                        className="flex-1 bg-zinc-100 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        placeholder="رابط الصورة (URL)" 
                      />
                      <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-zinc-300 text-zinc-400">
                        {formData.coverImage ? (
                          <img src={formData.coverImage} className="w-full h-full object-cover rounded-2xl" alt="" />
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
                        id="book-image-upload"
                      />
                      <label 
                        htmlFor="book-image-upload"
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
                    حفظ تفاصيل الكتاب
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
