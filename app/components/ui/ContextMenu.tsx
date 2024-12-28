import { createContext, useContext, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ContextMenuProps {
  children: React.ReactNode;
  items: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    divider?: boolean;
    disabled?: boolean;
  }[];
}

const ContextMenuContext = createContext<{
  show: (e: React.MouseEvent) => void;
  hide: () => void;
}>({
  show: () => {},
  hide: () => {},
});

export function ContextMenuProvider({
  children,
}: { children: React.ReactNode }) {
  const [menu, setMenu] = useState<{
    x: number;
    y: number;
    items: ContextMenuProps["items"];
  } | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenu(null);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <ContextMenuContext.Provider
      value={{
        show: (e: React.MouseEvent) => {
          e.preventDefault();
          const items = (e.currentTarget as HTMLElement).dataset
            .contextmenu as string;
          setMenu({
            x: e.clientX,
            y: e.clientY,
            items: JSON.parse(items),
          });
        },
        hide: () => setMenu(null),
      }}
    >
      {children}
      <AnimatePresence>
        {menu && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{
              position: "fixed",
              left: menu.x,
              top: menu.y,
            }}
            className="w-48 py-1 bg-ctp-mantle rounded-lg shadow-xl border border-ctp-surface0 z-50"
          >
            {menu.items.map((item, i) => (
              <div key={i}>
                {item.divider && (
                  <div className="my-1 border-t border-ctp-surface0" />
                )}
                <button
                  onClick={() => {
                    item.onClick();
                    setMenu(null);
                  }}
                  disabled={item.disabled}
                  className={`
                    flex items-center gap-2 w-full px-3 py-1.5
                    ${
                      item.disabled
                        ? "text-ctp-subtext0"
                        : "hover:bg-ctp-surface0"
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </ContextMenuContext.Provider>
  );
}

export function useContextMenu() {
  return useContext(ContextMenuContext);
}
