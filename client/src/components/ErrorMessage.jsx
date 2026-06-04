import { toast } from "react-toastify";

export const handleSuccess = (msg) => {
  toast.success(msg, {
    position: "top-center",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    style: {
      background: "linear-gradient(135deg, #6C3BFF, #FF4D8D)",
      color: "#FFFFFF",
      fontWeight: "600",
      borderRadius: "14px",
      padding: "14px 18px",
      border: "1px solid rgba(255,255,255,.08)",
      boxShadow: "0 10px 25px rgba(108,59,255,.35)",
      fontSize: "15px",
    }
  });
};

export const handleError = (msg) => {
  toast.error(msg, {
    position: "top-center",
    autoClose: 2800,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    style: {
      background: "#1E293B",
      color: "#FF4D8D",
      fontWeight: "600",
      borderRadius: "14px",
      padding: "14px 18px",
      border: "1px solid rgba(255,77,141,.4)",
      boxShadow: "0 10px 25px rgba(255,77,141,.25)",
      fontSize: "15px",
    }
  });
};

export const handleInfo = (msg) => {
  toast.info(msg, {
    position: "top-center",
    autoClose: 2500,
    theme: "dark",
    style: {
      background: "#1E293B",
      color: "#4DA6FF",
      fontWeight: "600",
      borderRadius: "14px",
      padding: "14px 18px",
      border: "1px solid rgba(77,166,255,.4)",
      boxShadow: "0 10px 25px rgba(77,166,255,.25)",
      fontSize: "15px",
    }
  });
};