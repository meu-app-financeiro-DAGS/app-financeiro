import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }: ModalProps) {
  const { isDark } = useTheme();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Content */}
      <div className={`
        relative w-full ${maxWidth} rounded-2xl shadow-2xl modal-content
        max-h-[90vh] overflow-y-auto
        ${isDark
          ? 'bg-dark-surface border border-dark-border'
          : 'bg-white'
        }
      `}>
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between px-6 py-4
          border-b backdrop-blur-xl
          ${isDark
            ? 'bg-dark-surface/90 border-dark-border'
            : 'bg-white/90 border-gray-100'
          }
        `}>
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors
              ${isDark
                ? 'hover:bg-dark-card text-dark-muted hover:text-white'
                : 'hover:bg-gray-100 text-gray-400 hover:text-gray-700'
              }
            `}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
