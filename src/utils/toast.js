import { toast } from 'react-toastify';

// Toast configuration
const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

// Success toast
export const showSuccess = (message) => {
  toast.success(message, {
    ...toastConfig,
    icon: "✅",
  });
};

// Error toast
export const showError = (message) => {
  toast.error(message, {
    ...toastConfig,
    icon: "❌",
  });
};

// Warning toast
export const showWarning = (message) => {
  toast.warning(message, {
    ...toastConfig,
    icon: "⚠️",
  });
};

// Info toast
export const showInfo = (message) => {
  toast.info(message, {
    ...toastConfig,
    icon: "ℹ️",
  });
};

// Custom confirm dialog using toast
export const showConfirm = (message, onConfirm, onCancel = null) => {
  const toastId = toast(
    <div className="flex flex-col gap-3">
      <div className="font-medium text-gray-800">{message}</div>
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => {
            toast.dismiss(toastId);
            onConfirm();
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
        >
          Xác nhận
        </button>
        <button
          onClick={() => {
            toast.dismiss(toastId);
            if (onCancel) onCancel();
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm font-medium"
        >
          Hủy
        </button>
      </div>
    </div>,
    {
      position: "top-center",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      theme: "light",
      style: {
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
    }
  );
};

// Custom alert dialog using toast
export const showAlert = (message, type = "info") => {
  const toastType = {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
  };
  
  toastType[type](message);
};
