'use client';

type AlertProps = {
  open: boolean;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
};

export default function AlertModal({
  open,
  title,
  message,
  type = 'info',
  onClose,
}: AlertProps) {
  if (!open) return null;

  const colorMap = {
    success: 'from-emerald-600 to-sky-700',
    error: 'from-red-600 to-pink-600',
    info: 'from-sky-600 to-emerald-700',
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-sm rounded-2xl bg-slate-950 shadow-2xl">
        {/* Gradient background */}
        <div
          className={`absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br ${colorMap[type]} opacity-90`}
        />

        <div className="p-6 text-white">
          {title && (
            <h3 className="mb-2 text-lg font-extrabold">
              {title}
            </h3>
          )}

          <p className="mb-6 text-sm text-white/90">
            {message}
          </p>

          <button
            onClick={onClose}
            className="w-full rounded-xl bg-white/10 py-2 font-semibold backdrop-blur transition hover:bg-white/20"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
