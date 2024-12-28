import { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  onClose: () => void;
}

const ModalContext = createContext<{
  showModal: (props: Omit<ModalProps, "onClose">) => void;
  hideModal: () => void;
}>({
  showModal: () => {},
  hideModal: () => {},
});

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalProps | null>(null);

  return (
    <ModalContext.Provider
      value={{
        showModal: props =>
          setModal({ ...props, onClose: () => setModal(null) }),
        hideModal: () => setModal(null),
      }}
    >
      {children}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50"
              onClick={modal.onClose}
            />

            <div className="fixed inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className={`
                  relative bg-ctp-mantle rounded-lg shadow-xl
                  ${
                    modal.size === "sm"
                      ? "w-[400px]"
                      : modal.size === "lg"
                        ? "w-[800px]"
                        : modal.size === "xl"
                          ? "w-[1000px]"
                          : "w-[600px]"
                  }
                `}
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-ctp-surface0">
                  <h2 className="text-lg font-bold">{modal.title}</h2>
                  <button
                    onClick={modal.onClose}
                    className="p-1 hover:bg-ctp-surface0 rounded"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="px-6 py-4">{modal.children}</div>

                {modal.actions && (
                  <div className="flex justify-end gap-2 px-6 py-4 border-t border-ctp-surface0">
                    {modal.actions}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
