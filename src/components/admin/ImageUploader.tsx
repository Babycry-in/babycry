'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { compressImageClient } from '@/lib/cloudinary/client-compress';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';

interface ImageUploaderProps {
  currentImageUrl?: string;
  onUploadComplete: (url: string, publicId?: string) => void;
  label?: string;
  className?: string;
}

export function ImageUploader({
  currentImageUrl,
  onUploadComplete,
  label = 'Upload Image',
  className = '',
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string>(currentImageUrl || '');
  const [status, setStatus] = useState<'idle' | 'compressing' | 'uploading' | 'processing' | 'done' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setStatus('error');
      setErrorMessage('Please select a valid image (JPG, PNG, or WebP).');
      return;
    }

    try {
      setErrorMessage('');
      setStatus('compressing');

      // 1. Client-side compression
      const compressedFile = await compressImageClient(file, {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.85,
      });

      // Show local preview immediately
      const objectUrl = URL.createObjectURL(compressedFile);
      setPreview(objectUrl);

      // 2. Upload to /api/upload
      setStatus('uploading');
      const formData = new FormData();
      formData.append('file', compressedFile);

      setStatus('processing');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Upload failed');
      }

      setPreview(data.url);
      setStatus('done');
      onUploadComplete(data.url, data.public_id);
    } catch (err: any) {
      console.error('Image upload error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Image upload failed. Please try again.');
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview('');
    setStatus('idle');
    onUploadComplete('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          {label}
        </label>
      )}

      <div
        onClick={() => fileInputRef.current?.click()}
        className="relative border-2 border-dashed border-emerald-200 hover:border-emerald-400 bg-[#FAF7F2] hover:bg-[#F2FAF6] rounded-2xl p-4 text-center cursor-pointer transition-colors overflow-hidden group min-h-[140px] flex flex-col items-center justify-center"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />

        {preview ? (
          <div className="relative w-full h-36 rounded-xl overflow-hidden shadow-xs">
            <Image
              src={preview}
              alt="Uploaded preview"
              fill
              className="object-contain"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white text-slate-600 hover:text-rose-600 rounded-full shadow-md transition-colors z-10"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/60 backdrop-blur-xs text-white text-[11px] rounded-full">
              Click to replace
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-xs font-medium text-slate-700">
              <span className="text-emerald-700 font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-[11px] text-slate-400">
              WebP, PNG, JPG (Auto-compressed for optimal speed)
            </p>
          </div>
        )}

        {/* Upload Progress Status Overlay */}
        {status !== 'idle' && status !== 'error' && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center p-4 z-20">
            {status === 'compressing' && (
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-medium">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Compressing image...</span>
              </div>
            )}
            {status === 'uploading' && (
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-medium">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Uploading to Cloudinary...</span>
              </div>
            )}
            {status === 'processing' && (
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-medium">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Processing media...</span>
              </div>
            )}
            {status === 'done' && (
              <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold animate-scale-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Uploaded successfully!</span>
              </div>
            )}
          </div>
        )}
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
