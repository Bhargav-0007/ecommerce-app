import { useUiStore } from '../../store/uiStore';

const icons: Record<string, string> = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
  warning: '⚠',
};

const styles: Record<string, string> = {
  success: 'bg-green-50 border-green-400 text-green-800',
  error:   'bg-red-50 border-red-400 text-red-800',
  info:    'bg-blue-50 border-blue-400 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useUiStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 w-80">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-slide-in ${styles[toast.type]}`}
        >
          <span className="text-lg font-bold">{icons[toast.type]}</span>
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-current opacity-50 hover:opacity-100 transition-opacity text-lg leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
