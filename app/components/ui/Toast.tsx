import { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

const ToastContext = createContext<{
  showToast: (toast: Omit<Toast, "id">) => void;
  hideToast: (id: string) => void;
}>({
  showToast: () => {},
  hideToast: () => {},
});

const toastIcons = {
  success: <CheckCircle className="text-ctp-green" size={20} />,
  error: <XCircle className="text-ctp-red" size={20} />,
  warning: <AlertCircle className="text-ctp-peach" size={20} />,
  info: <Info className="text-ctp-blue" size={20} />,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (toast: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    setToasts(toasts => [...toasts, { ...toast, id }]);

    if (toast.duration !== 0) {
      setTimeout(() => {
        hideToast(id);
      }, toast.duration || 5000);
    }
  };

  const hideToast = (id: string) => {
    setToasts(toasts => toasts.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-3 w-[400px] p-4 mb-2 bg-ctp-mantle rounded-lg shadow-lg border border-ctp-surface0"
            >
              {toastIcons[toast.type]}
              <div className="flex-1">
                <div className="font-medium">{toast.title}</div>
                {toast.message && (
                  <div className="text-sm text-ctp-subtext0">
                    {toast.message}
                  </div>
                )}
              </div>
              <button
                onClick={() => hideToast(toast.id)}
                className="p-1 hover:bg-ctp-surface0 rounded"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
