/**
 * Edit Playlist Modal Component
 */

"use client";

import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface EditPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string, image?: File) => void;
  initialName?: string;
  initialDescription?: string;
  initialImage?: string;
}

export function EditPlaylistModal({
  isOpen,
  onClose,
  onSave,
  initialName = "",
  initialDescription = "",
  initialImage,
}: EditPlaylistModalProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [previewImage, setPreviewImage] = useState<string | null>(initialImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert("Image must be less than 4MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please enter a playlist name");
      return;
    }
    
    const file = fileInputRef.current?.files?.[0];
    onSave(name.trim(), description.trim(), file);
    onClose();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 4 * 1024 * 1024) {
        alert("Image must be less than 4MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-[#282828] rounded-[8px] w-full max-w-[524px] p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Edit details</h2>

          {/* Cover Image */}
          <div className="mb-6">
            <div
              className={`
                w-[180px] h-[180px] rounded-[4px] bg-[#3E3E3E]
                flex items-center justify-center relative
                cursor-pointer overflow-hidden
                ${isDragging ? "ring-2 ring-white" : ""}
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Playlist cover"
                  fill
                  className="object-cover"
                />
              ) : (
                <svg viewBox="0 0 24 24" fill="#A7A7A7" className="w-12 h-12">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-bold">Choose photo</span>
              </div>

              {/* Edit button */}
              <button
                type="button"
                className="absolute bottom-2 right-2 w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <svg viewBox="0 0 24 24" fill="black" className="w-4 h-4">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-white mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 100))}
              className="w-full h-10 bg-[#3E3E3E] border border-transparent rounded-[4px] px-3 text-white text-base focus:outline-none focus:border-white transition-colors"
              placeholder="My Playlist"
              maxLength={100}
            />
            <div className="text-right text-xs text-[#A7A7A7] mt-1">
              {name.length}/100
            </div>
          </div>

          {/* Description Input */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-white mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 300))}
              className="w-full h-24 bg-[#3E3E3E] border border-transparent rounded-[4px] px-3 py-2 text-white text-base focus:outline-none focus:border-white transition-colors resize-none"
              placeholder="Add a description..."
              maxLength={300}
            />
            <div className="text-right text-xs text-[#A7A7A7] mt-1">
              {description.length}/300
            </div>
          </div>

          {/* Legal Text */}
          <p className="text-[11px] text-[#A7A7A7] mb-6">
            By proceeding, you agree to give Spotify access to the image you
            choose to upload. Please only upload images that you have the right
            to share.
          </p>

          {/* Footer */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="bg-[#1DB954] text-black font-bold py-3 px-8 rounded-full hover:bg-[#1ED760] hover:scale-[1.04] transition-all"
            >
              Save
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
