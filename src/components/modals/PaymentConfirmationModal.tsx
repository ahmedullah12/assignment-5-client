import React from "react";
import { MdClose } from "react-icons/md";


interface TModalProps {
    children: React.ReactNode;
    onClose: () => void;
    open: boolean;
  }

const PaymentConfirmationModal = ({ open, onClose, children }: TModalProps) => {

  return (
    <div
      onClick={onClose}
      className={`
        fixed inset-0 flex justify-center items-center transition-colors
        ${open ? "visible bg-black/20" : "invisible"} z-50 
      `}
    >
      {/* modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          bg-white rounded-xl shadow p-6 transition-all
          ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
        `}
        style={{maxHeight: "80vh", overflow: "auto"}}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600"
        >
         <MdClose size={20}/>
        </button>
        {children}
      </div>
    </div>
  );
};

export default PaymentConfirmationModal;
