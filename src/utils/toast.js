import toast from 'react-hot-toast';

// ✅ Success Toast
export const showSuccess = (message) => {
  toast.success(message, {
    icon: '✅',
    duration: 4000,
  });
};

// ✅ Error Toast
export const showError = (message) => {
  toast.error(message, {
    icon: '❌',
    duration: 5000,
  });
};

// ✅ Info Toast
export const showInfo = (message) => {
  toast(message, {
    icon: 'ℹ️',
    duration: 3000,
  });
};

// ✅ Warning Toast
export const showWarning = (message) => {
  toast(message, {
    icon: '⚠️',
    duration: 4000,
    style: {
      background: '#FBBF24/10',
      border: '1px solid #FBBF24/30',
    },
  });
};

// ✅ Loading Toast (with promise)
export const showPromise = (promise, messages) => {
  return toast.promise(promise, {
    loading: messages.loading || 'Loading...',
    success: messages.success || 'Success!',
    error: messages.error || 'Something went wrong!',
  });
};

// ✅ Custom Toast
export const showCustom = (message, options = {}) => {
  toast(message, {
    duration: 4000,
    ...options,
  });
};