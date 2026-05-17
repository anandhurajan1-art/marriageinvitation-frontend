"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { CheckCircle2, ChevronRight, ChevronLeft, Upload, Music, Image as ImageIcon, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

// Types for Form Data
interface FormData {
  template: string;
  groom_name: string;
  bride_name: string;
  wedding_date: string;
  venue: string;
  message: string;
  is_public: boolean;
}

const templates = [
  { id: 'classic', name: 'Classic Wedding', color: 'bg-stone-200' },
  { id: 'floral', name: 'Floral Theme', color: 'bg-pink-100' },
  { id: 'minimal', name: 'Modern Minimal', color: 'bg-gray-100' },
  { id: 'luxury', name: 'Luxury Gold', color: 'bg-amber-100' },
  { id: 'indian', name: 'Traditional Indian', color: 'bg-red-100' },
];

// File Upload Component Helper
const FileUploadDropzone = ({ label, accept, onDrop, file, icon: Icon }: any) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxFiles: 1,
    onDrop: (acceptedFiles) => onDrop(acceptedFiles[0])
  });

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-stone-500 bg-stone-50' : 'border-stone-200 hover:border-stone-300'}`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex items-center justify-center gap-2 text-stone-800 font-medium">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            {file.name}
          </div>
        ) : (
          <div className="flex flex-col items-center text-stone-500 gap-2">
            <Icon className="w-8 h-8 text-stone-400" />
            <p className="text-sm">Drag & drop or click to upload</p>
          </div>
        )}
      </div>
    </div>
  );
};

const GalleryUploadDropzone = ({ gallery, setGallery }: any) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {"image/*": [".png", ".jpg", ".jpeg", ".webp"]},
    onDrop: (acceptedFiles) => setGallery([...gallery, ...acceptedFiles])
  });

  return (
    <div 
      {...getRootProps()} 
      className="border-2 border-dashed border-stone-300 rounded-xl p-8 text-center cursor-pointer hover:border-stone-400 hover:bg-stone-50 transition-colors"
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center text-stone-500 gap-2">
        <Upload className="w-10 h-10 text-stone-400" />
        <p className="font-medium text-stone-700">Select multiple images</p>
        <p className="text-xs">Supports JPG, PNG, WEBP (Max 10MB each)</p>
      </div>
    </div>
  );
};

export default function CreateInvitationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState<FormData>({
    template: 'classic',
    groom_name: '',
    bride_name: '',
    wedding_date: '',
    venue: '',
    message: '',
    is_public: true,
  });

  // Files State
  const [groomImage, setGroomImage] = useState<File | null>(null);
  const [brideImage, setBrideImage] = useState<File | null>(null);
  const [bgImage, setBgImage] = useState<File | null>(null);
  const [bgMusic, setBgMusic] = useState<File | null>(null);
  const [gallery, setGallery] = useState<File[]>([]);

  const handleNext = () => {
    if (step === 1 && !formData.template) return setError('Please select a template');
    if (step === 2) {
      if (!formData.groom_name || !formData.bride_name || !formData.wedding_date || !formData.venue) {
        return setError('Please fill in all required fields');
      }
    }
    setError('');
    setStep(s => Math.min(s + 1, 4));
  };

  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value.toString());
      });

      if (groomImage) data.append('groom_image', groomImage);
      if (brideImage) data.append('bride_image', brideImage);
      if (bgImage) data.append('bg_image', bgImage);
      if (bgMusic) data.append('bg_music', bgMusic);
      
      gallery.forEach((file) => {
        data.append('gallery', file);
      });

      await api.post('/invitations', data);
      
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create invitation');
      setLoading(false);
    }
  };


  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Stepper Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-stone-200 rounded-full z-0"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-stone-800 rounded-full z-0 transition-all duration-300"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>
          
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                s <= step ? 'bg-stone-800 text-white' : 'bg-white border-2 border-stone-200 text-stone-400'
              }`}
            >
              {s}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm font-medium text-stone-500 mt-2">
          <span>Template</span>
          <span>Details</span>
          <span>Media</span>
          <span>Gallery</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 min-h-[500px] flex flex-col">
        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Step 1: Template */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif text-stone-800">Select a Template</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {templates.map(t => (
                      <div 
                        key={t.id}
                        onClick={() => setFormData({ ...formData, template: t.id })}
                        className={`cursor-pointer rounded-xl border-2 transition-all overflow-hidden ${
                          formData.template === t.id ? 'border-stone-800 ring-4 ring-stone-800/10' : 'border-transparent hover:border-stone-200'
                        }`}
                      >
                        <div className={`h-32 ${t.color}`}></div>
                        <div className="p-3 bg-white text-center font-medium text-sm text-stone-700">
                          {t.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif text-stone-800">Event Details</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Groom's Name *</label>
                      <input 
                        type="text" required
                        value={formData.groom_name}
                        onChange={(e) => setFormData({...formData, groom_name: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-stone-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Bride's Name *</label>
                      <input 
                        type="text" required
                        value={formData.bride_name}
                        onChange={(e) => setFormData({...formData, bride_name: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-stone-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Wedding Date & Time *</label>
                    <input 
                      type="datetime-local" required
                      value={formData.wedding_date}
                      onChange={(e) => setFormData({...formData, wedding_date: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-stone-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Venue Address *</label>
                    <textarea 
                      required rows={3}
                      value={formData.venue}
                      onChange={(e) => setFormData({...formData, venue: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-stone-500"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Welcome Message (Optional)</label>
                    <textarea 
                      rows={2}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-stone-500"
                      placeholder="e.g. Join us in celebrating our special day..."
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Step 3: Media */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif text-stone-800">Media Uploads (Optional)</h2>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <FileUploadDropzone 
                      label="Groom's Image" 
                      accept={{"image/*": [".png", ".jpg", ".jpeg", ".webp"]}} 
                      onDrop={setGroomImage} 
                      file={groomImage} 
                      icon={ImageIcon} 
                    />
                    <FileUploadDropzone 
                      label="Bride's Image" 
                      accept={{"image/*": [".png", ".jpg", ".jpeg", ".webp"]}} 
                      onDrop={setBrideImage} 
                      file={brideImage} 
                      icon={ImageIcon} 
                    />
                  </div>

                  <FileUploadDropzone 
                    label="Background Cover Image" 
                    accept={{"image/*": [".png", ".jpg", ".jpeg", ".webp"]}} 
                    onDrop={setBgImage} 
                    file={bgImage} 
                    icon={ImageIcon} 
                  />

                  <FileUploadDropzone 
                    label="Background Music (Auto-play)" 
                    accept={{"audio/*": [".mp3", ".wav"]}} 
                    onDrop={setBgMusic} 
                    file={bgMusic} 
                    icon={Music} 
                  />
                </div>
              )}

              {/* Step 4: Gallery */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif text-stone-800">Wedding Gallery (Optional)</h2>
                  <p className="text-sm text-stone-500 mb-4">Upload multiple images to display in a beautiful masonry grid.</p>
                  
                  <div className="mb-4">
                    <GalleryUploadDropzone gallery={gallery} setGallery={setGallery} />
                  </div>

                  {gallery.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mt-6">
                      {gallery.map((file, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden border border-stone-200 aspect-square">
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt="Gallery preview" 
                            className="w-full h-full object-cover"
                          />
                          <button 
                            onClick={() => setGallery(gallery.filter((_, i) => i !== idx))}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mt-8 p-4 bg-stone-50 rounded-lg border border-stone-200">
                    <input 
                      type="checkbox" 
                      id="is_public" 
                      checked={formData.is_public}
                      onChange={(e) => setFormData({...formData, is_public: e.target.checked})}
                      className="w-5 h-5 text-stone-800 rounded border-gray-300 focus:ring-stone-800"
                    />
                    <label htmlFor="is_public" className="text-stone-700 font-medium">Make Invitation Public</label>
                  </div>

                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-stone-100">
          <button 
            onClick={handlePrev} 
            disabled={step === 1 || loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-stone-600 hover:bg-stone-100 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          
          {step < 4 ? (
            <button 
              onClick={handleNext} 
              className="flex items-center gap-2 px-6 py-2.5 bg-stone-800 text-white rounded-lg font-medium hover:bg-stone-900 transition-colors"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={handleSubmit} 
              disabled={loading}
              className="flex items-center gap-2 px-8 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Publish Invitation'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
