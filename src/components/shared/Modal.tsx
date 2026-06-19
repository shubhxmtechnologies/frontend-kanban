import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            <div
                className="w-full shadow-level-5"
                style={{
                    maxWidth: '480px',
                    backgroundColor: 'var(--color-canvas)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-hairline)',
                    padding: '32px',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <div className="flex items-center justify-between mb-6">
                        <h2
                            style={{
                                fontSize: '18px',
                                fontWeight: 600,
                                letterSpacing: '-0.03em',
                                color: 'var(--color-ink)',
                            }}
                        >
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="flex items-center justify-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0070f3]"
                            aria-label="Close modal"
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--color-mute)',
                                padding: '4px',
                                lineHeight: 0,
                            }}
                        >
                            <X size={18} aria-hidden="true" />
                        </button>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
};

export default Modal;