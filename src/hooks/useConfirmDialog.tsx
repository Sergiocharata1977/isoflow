import { useCallback, useRef, useState } from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  Dialog,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export type ConfirmOptions = {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
};

export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const resolverRef = useRef<(value: boolean) => void>();

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts);
    setIsOpen(true);
    return new Promise(resolve => {
      resolverRef.current = resolve;
    });
  }, []);

  const cleanup = () => {
    setIsOpen(false);
    resolverRef.current = undefined;
  };

  const handleCancel = () => {
    resolverRef.current?.(false);
    cleanup();
  };

  const handleConfirm = () => {
    resolverRef.current?.(true);
    cleanup();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && isOpen) {
      resolverRef.current?.(false);
      cleanup();
    }
  };

  const ConfirmDialog = (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{options.title || 'Confirmar acción'}</DialogTitle>
          {options.message && (
            <DialogDescription>{options.message}</DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {options.cancelText || 'Cancelar'}
          </Button>
          <Button onClick={handleConfirm}>
            {options.confirmText || 'Aceptar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return { confirm, ConfirmDialog };
}
