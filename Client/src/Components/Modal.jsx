import { IoClose } from "react-icons/io5";
import { useEffect, useRef } from "react";

// eslint-disable-next-line react/prop-types
const Modal = ({ open, onClose, children }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    let handler = (e) => {
      if (!modalRef.current.contains(e.target)) onClose(false);
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center z-20
      transition-colors
      ${open ? "visible bg-black/20" : "invisible"}`}
    >
      <div
        className={`bg-white rounded-xl shadow p-6 m-5 transition-all
        ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
      `}
        ref={modalRef}
      >
        <button
          className="absolute top-2 right-2 p-2 rounded-lg
        text-gray-600 bg-white hover:bg-gray-50 hover:text-gray-700"
          onClick={() => onClose(false)}
        >
          <IoClose size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
