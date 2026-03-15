import type { PropsWithChildren } from 'react';

interface ModalProps extends PropsWithChildren {
  isOpen: boolean;
  title: string;
  onClose: () => void;
}

export function Modal({ isOpen, title, onClose, children }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-6" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800 dark:shadow-none"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="page-header" style={{ marginBottom: 12 }}>
          <div className="page-title">
            <h3 className="text-slate-900 dark:text-slate-50">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-md border border-slate-200 px-2 py-1 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
