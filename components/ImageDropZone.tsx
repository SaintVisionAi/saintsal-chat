'use client';
import React, { useState, useRef, DragEvent } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageDropZoneProps {
  onImageUpload: (file: File, preview: string) => void;
  maxSizeMB?: number;
}

export default function ImageDropZone({ onImageUpload, maxSizeMB = 10 }: ImageDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError(null);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith('image/'));

    if (!imageFile) {
      setError('Please drop an image file (PNG, JPG, etc.)');
      return;
    }

    handleFile(imageFile);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    // Check file size
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`File too large. Max size is ${maxSizeMB}MB`);
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('File must be an image (PNG, JPG, GIF, etc.)');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onImageUpload(file, result);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-drop-zone-wrapper">
      {!preview ? (
        <div
          className={`image-drop-zone ${isDragging ? 'dragging' : ''} ${error ? 'error' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="image-drop-zone-input"
          />

          <div className="image-drop-zone-content">
            {isDragging ? (
              <>
                <Upload className="text-gold" size={48} />
                <p className="drop-zone-text-primary">Drop image here</p>
              </>
            ) : (
              <>
                <ImageIcon className="text-gold" size={48} />
                <p className="drop-zone-text-primary">Drag & drop an image</p>
                <p className="drop-zone-text-secondary">or click to browse</p>
                <p className="drop-zone-text-hint">Max {maxSizeMB}MB • PNG, JPG, GIF, WebP</p>
              </>
            )}
          </div>

          {error && (
            <div className="drop-zone-error">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="image-preview-container">
          <img src={preview} alt="Preview" className="image-preview" />
          <button className="image-preview-clear-btn" onClick={handleClear} title="Remove image">
            <X size={18} />
          </button>
          <div className="image-preview-overlay">
            <ImageIcon className="text-gold" size={24} />
            <span className="preview-label">Image attached</span>
          </div>
        </div>
      )}
    </div>
  );
}
