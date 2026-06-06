import { toast } from 'react-toastify';

export const Notify = {
  succes: (msg: string) => toast.success(msg),
  error: (msg: string) => toast.error(msg),
  info: (msg: string) => toast.error(msg),
}