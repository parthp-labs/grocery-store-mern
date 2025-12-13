import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useState } from "react";

function CustomModal({
  title,
  description,
  body,
  actionButtons,
  cancelButtonText = "Cancel",
}) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  return {
    openModal,
    closeModal,
    isOpen,
    modal: (
      <div className={`custom-modal ${isOpen && "active"}`}>
        <div className="custom-modal__inner">
          <div className="custom-modal__header">
            <h2 className="custom-modal__title">{title}</h2>
            <button
              className="custom-modal__modal__closeBtn"
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={faClose} />
            </button>
          </div>
          <div className="custom-modal__body">
            <p>{description}</p>
            {body}
          </div>
          <div className="custom-modal__footer">
            {actionButtons}
            <button
              className="custom-modal__btn custom-modal__cancelBtn"
              onClick={closeModal}
            >
              {cancelButtonText}
            </button>
          </div>
        </div>
      </div>
    ),
  };
}

export default CustomModal;
