import { logout } from './features/authSlice';
import store from './store';

export const performLogout = () => {
  store.dispatch(logout());
};