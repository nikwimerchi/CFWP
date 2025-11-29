import { toast } from 'react-hot-toast';
import { ToastMessageType } from '../types/toast';

export const handleAuthError = (error: any) => {
  if (error?.response?.status === 401) {
    localStorage.clear();
    //@ts-ignore
    window.location = '/redirect=' + window.location.pathname.replace('/', '');
  }
};

export const toastMessage = (type: ToastMessageType, message: string) => {
  if (type === 'info') {
    toast(message);
  }
  if (type === 'error') {
    toast.error(message);
  }
  if (type === 'success') {
    toast.success(message, { duration: 4000 });
  }
};

export const errorHandler = (error: any) => {
  if (error?.response?.data?.message) {
    toastMessage('error', error.response.data.message);
  } else {
    toastMessage('error', error.message);
  }
  handleAuthError(error);
};
