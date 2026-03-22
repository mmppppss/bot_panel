import { createContext } from "preact";
import { useState, useContext, useEffect, useCallback } from "preact/hooks";

const NotifyContext = createContext();

const notifyStore = {
  notifications: [],
  listeners: [],
  
  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  },
  
  getState() {
    return this.notifications;
  },
  
  add(message, type) {
    const id = Date.now();
    this.notifications = [...this.notifications, { id, message, type }];
    this.listeners.forEach(fn => fn(this.notifications));
    
    setTimeout(() => {
      this.remove(id);
    }, 3000);
  },
  
  remove(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.listeners.forEach(fn => fn(this.notifications));
  }
};

export function NotifyProvider({ children }) {
  const [notifications, setNotifications] = useState(notifyStore.getState());

  useEffect(() => {
    return notifyStore.subscribe(setNotifications);
  }, []);

  const notify = useCallback((message, type = "info") => {
    notifyStore.add(message, type);
  }, []);

  return (
    <NotifyContext.Provider value={{ notify, notifications }}>
      {children}
    </NotifyContext.Provider>
  );
}

export const useNotify = () => useContext(NotifyContext);

export function NotifyContainer() {
  const { notifications } = useContext(NotifyContext);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all duration-300 ${
            n.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}