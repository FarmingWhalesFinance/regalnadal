import React, { useEffect, useState } from "react";
import "./ConsentModal.css";
import close from "../../img/close.svg";

function ConsentModal({ hasConsented, setConsented }) {
  const [visible, setVisible] = useState(false);

  const handleAccept = () => {
    localStorage.setItem("consentAcknowledged", "true");
    setConsented("true");
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("consentAcknowledged", "false");
    setConsented("false");
    setVisible(false);
  };

  useEffect(() => {
    const isBraveBrowser = navigator?.brave;
    const timer = setTimeout(() => {
      if (hasConsented === false && !isBraveBrowser) setVisible(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [hasConsented]);

  return <div className={`ConsentModal ${visible ? "invisible" : ""}`}></div>;
}

export default ConsentModal;
