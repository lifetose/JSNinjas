import ReactDOM from "react-dom";
import { ReactNode, useEffect } from "react";

interface ModalProps {
  open: boolean;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, children }) => {
  const modalRoot = document.getElementById("modal");

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!modalRoot) {
    console.error("Modal root element not found.");
    return null;
  }

  if (!open) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className='modal'>
      <div className='modal-box'>{children}</div>
    </div>,
    modalRoot,
  );
};

export default Modal;
