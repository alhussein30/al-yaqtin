import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, RotateCcw, Coffee, BookOpen, Bell, 
  Settings, ChevronRight, Clock, Info
} from 'lucide-react';

type TimerMode = 'work' | 'shortBreak' | 'longBreak' | 'custom';

const MODES: Record<TimerMode, { label: string; minutes: number; color: string; icon: React.ReactNode }> = {
  work: { 
    label: 'وقت التركيز', 
    minutes: 25, 
    color: 'bg-primary', 
    icon: <BookOpen className="w-4 h-4" /> 
  },
  shortBreak: { 
    label: 'استراحة قصيرة', 
    minutes: 5, 
    color: 'bg-emerald-600', 
    icon: <Coffee className="w-4 h-4" /> 
  },
  longBreak: { 
    label: 'استراحة طويلة', 
    minutes: 15, 
    color: 'bg-gold', 
    icon: <Bell className="w-4 h-4" /> 
  },
  custom: {
    label: 'تخصيص',
    minutes: 45,
    color: 'bg-zinc-800',
    icon: <Settings className="w-4 h-4" />
  }
};

export default function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(MODES.work.minutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(25);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.warn('Audio play failed', e));
    }

    if (mode === 'work') {
      const nextSessions = sessionsCompleted + 1;
      setSessionsCompleted(nextSessions);
      if (nextSessions % 4 === 0) switchMode('longBreak');
      else switchMode('shortBreak');
    } else {
      switchMode('work');
    }
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    const mins = newMode === 'custom' ? customMinutes : MODES[newMode].minutes;
    setTimeLeft(mins * 60);
    setIsActive(false);
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    const mins = mode === 'custom' ? customMinutes : MODES[mode].minutes;
    setTimeLeft(mins * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentMaxSeconds = (mode === 'custom' ? customMinutes : MODES[mode].minutes) * 60;
  const progress = (timeLeft / currentMaxSeconds) * 100;

  const handleCustomTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMode('custom');
    setTimeLeft(customMinutes * 60);
    setIsActive(false);
    setShowSettings(false);
  };

  return (
    <div className="min-h-screen bg-background text-zinc-900 font-sans pb-24 px-4 md:px-8">
      <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" preload="auto" />
      
      <div className="max-w-4xl mx-auto pt-16">
        <header className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 text-gold rounded-full mb-6"
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">مؤقت التركيز الذكي</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-primary mb-4 tracking-tight">نظّم وقت قراءتك</h1>
          <p className="text-zinc-500 max-w-lg mx-auto leading-relaxed">استخدم تقنية البرومودورو لزيادة تركيزك. جلسات قراءة مركزة تتخللها استراحات قصيرة.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Timer Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-8 bg-white rounded-[3.5rem] p-8 md:p-16 shadow-xl shadow-zinc-200/50 border border-zinc-100 flex flex-col items-center relative overflow-hidden"
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 blur-[80px] rounded-full translate-y-32 -translate-x-32" />

            <div className="relative z-10 w-full flex flex-col items-center">
              {/* Mode Switcher */}
              <div className="flex bg-zinc-50 p-1.5 rounded-3xl mb-16 w-full max-w-sm border border-zinc-100">
                {(Object.keys(MODES) as TimerMode[]).filter(m => m !== 'custom').map((m) => (
                  <button
                    key={m}
                    onClick={() => switchMode(m)}
                    className={`flex-1 py-3 rounded-2xl text-[11px] font-black transition-all ${
                      mode === m 
                        ? 'bg-white text-primary shadow-sm border border-zinc-100' 
                        : 'text-zinc-400 hover:text-zinc-600'
                    }`}
                  >
                    {MODES[m].label}
                  </button>
                ))}
              </div>

              {/* Circular Progress */}
              <div className="relative mb-16 group">
                <svg className="w-64 h-64 md:w-80 md:h-80 transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="46%"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 8"
                    fill="transparent"
                    className="text-zinc-100"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="42%"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    className="text-zinc-50"
                  />
                  <motion.circle
                    cx="50%"
                    cy="50%"
                    r="42%"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray="1000"
                    strokeLinecap="round"
                    animate={{ strokeDashoffset: 1000 * (progress / 100) }}
                    className={`${MODES[mode].color === 'bg-primary' ? 'text-primary' : MODES[mode].color === 'bg-gold' ? 'text-gold' : 'text-emerald-600'} transition-all duration-1000`}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-7xl md:text-8xl font-black font-mono tracking-tighter text-zinc-900 leading-none">
                    {formatTime(timeLeft)}
                  </span>
                  <div className="mt-4 flex items-center gap-2 text-zinc-400">
                    <div className={`${MODES[mode].color} w-2 h-2 rounded-full animate-pulse`} />
                    <span className="text-xs font-black uppercase tracking-widest">{MODES[mode].label}</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-8 w-full max-w-md">
                <button
                  onClick={resetTimer}
                  className="w-14 h-14 rounded-2xl bg-zinc-50 text-zinc-400 flex items-center justify-center hover:bg-zinc-100 transition-all active:scale-95 border border-zinc-100"
                >
                  <RotateCcw className="w-6 h-6" />
                </button>
                
                <button
                  onClick={toggleTimer}
                  className={`flex-1 h-16 rounded-[2rem] flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 font-black text-sm ${
                    isActive ? 'bg-zinc-900 text-white shadow-zinc-900/20' : 'bg-primary text-white shadow-primary/20'
                  }`}
                >
                  {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                  {isActive ? 'إيقاف مؤقت' : 'ابدأ الجلسة'}
                </button>

                <div className="w-14 text-center">
                  <span className="text-[10px] font-black text-zinc-300 block mb-1">جلسات</span>
                  <span className="text-2xl font-black text-primary leading-none">{sessionsCompleted}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Settings Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 shadow-lg shadow-zinc-200/30"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400">
                  <Settings className="w-5 h-5" />
                </div>
                <h3 className="font-black text-zinc-800">تخصيص الوقت</h3>
              </div>

              <form onSubmit={handleCustomTimeSubmit} className="space-y-6">
                <div>
                  <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest block mb-3 px-2">مدة الجلسة بالدقائق</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      min="1" 
                      max="180"
                      value={customMinutes}
                      onChange={(e) => setCustomMinutes(Number(e.target.value))}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-sm font-black outline-none focus:border-primary/30 transition-all text-right"
                      placeholder="مثال: 45"
                    />
                    <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 w-4 h-4" />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-gold text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-gold/20 transition-all hover:brightness-110 active:scale-95"
                >
                  تطبيق الوقت المخصص
                </button>
              </form>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-primary text-white rounded-[2.5rem] p-8 relative overflow-hidden group"
            >
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                  <Info className="w-5 h-5" />
                </div>
                <h4 className="font-black mb-2">كيف تعمل التقنية؟</h4>
                <p className="text-xs text-white/70 leading-relaxed mb-6">تعتمد تقنية البرومودورو على فترات من العمل المركز (25 دقيقة) تليها استراحة قصيرة لتجديد النشاط الذهني.</p>
                <div className="flex items-center gap-2 text-[10px] font-black text-gold">
                  <span className="w-1 h-1 bg-gold rounded-full" />
                  تحسين التركيز
                  <span className="w-1 h-1 bg-gold rounded-full ml-2" />
                  تجنب الإرهاق
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
