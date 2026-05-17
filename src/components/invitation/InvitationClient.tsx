"use client";

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Music, Pause, Play, MapPin, Calendar, Heart, Share2, X } from 'lucide-react';

interface Gallery {
  id: string;
  image_url: string;
}

interface InvitationData {
  id: string;
  template: string;
  groom_name: string;
  bride_name: string;
  groom_image: string | null;
  bride_image: string | null;
  bg_image: string | null;
  bg_music: string | null;
  wedding_date: string;
  venue: string;
  message: string;
  galleries: Gallery[];
}

export default function InvitationClient({ data }: { data: InvitationData }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const API_URL = 'http://localhost:5000';

  // Handle countdown
  useEffect(() => {
    const targetDate = new Date(data.wedding_date).getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      
      if (difference > 0) {
        setTimeLeft({
          d: Math.floor(difference / (1000 * 60 * 60 * 24)),
          h: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data.wedding_date]);

  // Handle Audio
  useEffect(() => {
    if (data.bg_music) {
      audioRef.current = new Audio(`${API_URL}${data.bg_music}`);
      audioRef.current.loop = true;
      // Autoplay might be blocked by browsers until user interaction
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [data.bg_music]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${data.groom_name} & ${data.bride_name}'s Wedding`,
        text: 'You are invited to our wedding!',
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const { scrollYProgress } = useScroll();
  const yPos = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Template colors
  const getThemeClass = () => {
    switch(data.template) {
      case 'floral': return 'bg-pink-50 text-pink-900';
      case 'minimal': return 'bg-white text-stone-900';
      case 'luxury': return 'bg-stone-900 text-amber-50';
      case 'indian': return 'bg-red-50 text-red-900';
      default: return 'bg-stone-50 text-stone-800'; // classic
    }
  };

  return (
    <div className={`min-h-screen font-serif ${getThemeClass()} overflow-x-hidden relative`}>
      {/* Floating Audio Control */}
      {data.bg_music && (
        <button 
          onClick={toggleAudio}
          className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-xl hover:bg-white/30 transition-all mix-blend-difference"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
      )}

      {/* Floating Share Button */}
      <button 
        onClick={handleShare}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-stone-800 text-white shadow-2xl hover:bg-stone-900 transition-all hover:scale-110 active:scale-95"
      >
        <Share2 className="w-5 h-5" />
      </button>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        {data.bg_image && (
          <motion.div 
            style={{ y: yPos }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <img 
              src={`${API_URL}${data.bg_image}`} 
              alt="Background" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        <motion.div 
          style={{ opacity }}
          className={`relative z-20 text-center px-4 ${data.bg_image ? 'text-white' : ''}`}
        >
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-lg md:text-2xl tracking-widest uppercase mb-6 font-sans"
          >
            We are getting married
          </motion.h3>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 drop-shadow-lg"
          >
            {data.groom_name}
            <span className="block text-4xl md:text-6xl my-4 italic text-amber-300 font-serif">&</span>
            {data.bride_name}
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex items-center justify-center gap-2 text-xl md:text-2xl"
          >
            <Calendar className="w-6 h-6" />
            {new Date(data.wedding_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        >
          <div className={`w-6 h-10 border-2 rounded-full flex justify-center p-1 ${data.bg_image ? 'border-white' : 'border-stone-800'}`}>
            <div className={`w-1 h-2 rounded-full ${data.bg_image ? 'bg-white' : 'bg-stone-800'}`}></div>
          </div>
        </motion.div>
      </section>

      {/* Countdown Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="w-12 h-12 mx-auto mb-8 text-rose-400" />
          <h2 className="text-3xl md:text-5xl mb-12">Counting down the days</h2>
          
          <div className="grid grid-cols-4 gap-4 md:gap-8 max-w-2xl mx-auto">
            {Object.entries(timeLeft).map(([unit, value], idx) => (
              <motion.div 
                key={unit}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center justify-center p-4 bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm border border-stone-200/50"
              >
                <span className="text-3xl md:text-5xl font-bold font-sans">{value}</span>
                <span className="text-xs md:text-sm uppercase tracking-widest mt-2">{unit === 'd' ? 'Days' : unit === 'h' ? 'Hours' : unit === 'm' ? 'Mins' : 'Secs'}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Couple Images & Message */}
      <section className="py-20 px-4 bg-white/30 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            {(data.groom_image || data.bride_image) && (
              <div className="flex-1 flex gap-4 justify-center md:justify-end">
                {data.groom_image && (
                  <motion.div 
                    initial={{ opacity: 0, rotate: -5, x: -20 }}
                    whileInView={{ opacity: 1, rotate: 0, x: 0 }}
                    viewport={{ once: true }}
                    className="w-48 h-64 md:w-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl border-8 border-white transform -rotate-3"
                  >
                    <img src={`${API_URL}${data.groom_image}`} alt={data.groom_name} className="w-full h-full object-cover" />
                  </motion.div>
                )}
                {data.bride_image && (
                  <motion.div 
                    initial={{ opacity: 0, rotate: 5, x: 20 }}
                    whileInView={{ opacity: 1, rotate: 0, x: 0 }}
                    viewport={{ once: true }}
                    className="w-48 h-64 md:w-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl border-8 border-white transform rotate-3 translate-y-8"
                  >
                    <img src={`${API_URL}${data.bride_image}`} alt={data.bride_name} className="w-full h-full object-cover" />
                  </motion.div>
                )}
              </div>
            )}
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex-1 text-center md:text-left space-y-6"
            >
              <h2 className="text-4xl md:text-5xl">Our Story</h2>
              <p className="text-lg md:text-xl leading-relaxed text-stone-600 font-sans">
                {data.message || "We invite you to share our joy and celebrate our love as we exchange vows and begin our new life together."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Venue Section */}
      <section className="py-24 px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto bg-white p-12 rounded-3xl shadow-xl border border-stone-100 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-stone-800"></div>
          <MapPin className="w-12 h-12 mx-auto mb-6 text-stone-400" />
          <h2 className="text-3xl md:text-4xl mb-6">The Venue</h2>
          <p className="text-xl leading-relaxed whitespace-pre-line text-stone-600 font-sans">
            {data.venue}
          </p>
          <div className="mt-8 pt-8 border-t border-stone-100">
            <p className="font-bold text-2xl">
              {new Date(data.wedding_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
            </p>
          </div>
        </motion.div>
      </section>

      {/* Gallery Section */}
      {data.galleries && data.galleries.length > 0 && (
        <section className="py-20 px-4 bg-stone-900 text-stone-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl text-center mb-16">Moments</h2>
            
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {data.galleries.map((item, idx) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (idx % 4) * 0.1 }}
                  className="break-inside-avoid relative group overflow-hidden rounded-xl cursor-pointer"
                  onClick={() => openLightbox(idx)}
                >
                  <img 
                    src={`${API_URL}${item.image_url}`} 
                    alt="Gallery" 
                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white border border-white/50 px-4 py-2 rounded-full backdrop-blur-sm text-sm uppercase tracking-widest font-sans">View</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-xl"
            onClick={() => setLightboxOpen(false)}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img 
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={`${API_URL}${data.galleries[currentImageIndex].image_url}`}
              alt="Lightbox"
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            {/* Simple Prev/Next overlay controls could be added here */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
