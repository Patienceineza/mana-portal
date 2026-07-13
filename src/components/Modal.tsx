import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
        document.body.style.overflow = 'hidden';
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className={cn(
        "fixed inset-0 z-50 m-auto w-full max-w-lg rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-0 text-foreground dark:text-zinc-100 shadow-2xl outline-none",
        "backdrop:bg-black/40 backdrop:backdrop-blur-md",
        "open:animate-in open:fade-in-0 open:zoom-in-95 open:slide-in-from-bottom-4 open:duration-300"
      )}
    >
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900/50 px-6 py-4.5">
        <h3 className="text-base font-extrabold text-foreground dark:text-white leading-none">{title}</h3>
        <button
          onClick={onClose}
          type="button"
          className="rounded-xl p-1.5 text-muted-foreground/60 dark:text-zinc-400 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-foreground dark:hover:text-white"
        >
          <X className="h-4 w-4 stroke-[2.5]" />
        </button>
      </div>
      <div className="p-6">
        {children}
      </div>
    </dialog>
  );
}
