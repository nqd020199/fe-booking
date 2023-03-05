import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ToastNotifyProps {
}

const ToastNotify: React.FC<ToastNotifyProps> = ({

}) => (
  <ToastContainer
    autoClose={4000}
    theme="colored"
    position="top-right"
    closeOnClick={false}
    pauseOnFocusLoss={false}
  />
);
ToastNotify.defaultProps = {
  children: undefined,
};

export default ToastNotify;
