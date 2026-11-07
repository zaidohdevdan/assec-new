"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  subtitle?: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  subtitle = "Esta ação não pode ser desfeita.",
  description,
  confirmLabel = "Excluir Permanentemente",
  cancelLabel = "Cancelar",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={() => {
        if (!loading) onCancel();
      }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full relative border border-border animate-in fade-in zoom-in-95 duration-200 text-left"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        <div className="p-6">
          <div className="flex gap-3 items-start mb-4 text-red-600">
            <AlertCircle className="h-6 w-6 shrink-0 text-red-600 mt-0.5" />
            <div>
              <h3
                id="confirm-dialog-title"
                className="font-serif font-bold text-lg text-primary"
              >
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-text-secondary mt-1">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="text-xs text-text-primary mb-6 leading-relaxed">
            {description}
          </div>

          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              disabled={loading}
              onClick={onCancel}
              className="px-4 py-2 border border-border hover:bg-gray-50 rounded-lg text-xs font-semibold text-text-secondary transition-colors disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <Button
              type="button"
              onClick={onConfirm}
              loading={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-widest px-4 py-2 shadow border-none"
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ConfirmOptions {
  title: string;
  subtitle?: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function useConfirmDialog() {
  const [options, setOptions] = React.useState<ConfirmOptions | null>(null);
  const resolverRef = React.useRef<((value: boolean) => void) | null>(null);

  const confirm = React.useCallback((opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleClose = React.useCallback((result: boolean) => {
    setOptions(null);
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
  }, []);

  const ConfirmDialogModal = React.useMemo(
    () => (
      <ConfirmDialog
        open={Boolean(options)}
        title={options?.title ?? ""}
        subtitle={options?.subtitle}
        description={options?.description ?? ""}
        confirmLabel={options?.confirmLabel}
        cancelLabel={options?.cancelLabel}
        onConfirm={() => handleClose(true)}
        onCancel={() => handleClose(false)}
      />
    ),
    [options, handleClose]
  );

  return { confirm, ConfirmDialogModal };
}

