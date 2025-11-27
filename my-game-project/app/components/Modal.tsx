// app/components/Modal.tsx
'use client';

import React, { ReactNode } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react'; // Using a popular icon library for the close button

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) {
    return null;
  }

  return (
    // Portal-like container that sits on top of everything
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-300 ease-in-out"
      onClick={onClose} // Close modal when clicking the overlay
    >
      {/* Modal content container */}
      <div
        className="relative w-full max-w-2xl rounded-xl bg-gray-800 border border-gray-700 shadow-2xl p-8 m-4 transform transition-transform duration-300 ease-in-out scale-95"
        // Stop propagation to prevent clicks inside the modal from closing it
        onClick={(e) => e.stopPropagation()}
        style={isOpen ? { transform: 'scale(1)', opacity: 1 } : {}}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {/* Modal Header */}
        {title && (
          <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
        )}

        {/* Modal Body */}
        <div className="text-gray-300">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
