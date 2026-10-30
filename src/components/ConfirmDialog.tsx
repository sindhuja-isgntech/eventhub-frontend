import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  title: string;
  description: string;
  isConfirming?: boolean;
  errorMessage?: string;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  description,
  isConfirming = false,
  errorMessage,
  onCancel,
  onConfirm,
}) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4">
    <section
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-confirmation-title"
      aria-describedby="delete-confirmation-description"
      className="w-full max-w-md space-y-5 rounded-2xl bg-white p-6 shadow-2xl"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h2 id="delete-confirmation-title" className="text-lg font-bold text-slate-900">{title}</h2>
          <p id="delete-confirmation-description" className="text-sm text-slate-600">{description}</p>
        </div>
      </div>

      {errorMessage && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          disabled={isConfirming}
          onClick={onCancel}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={isConfirming}
          onClick={() => void onConfirm()}
          className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
        >
          {isConfirming ? 'Deleting...' : 'Yes, delete'}
        </button>
      </div>
    </section>
  </div>
);
