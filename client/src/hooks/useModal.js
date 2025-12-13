import { useCallback, useState } from "react";
import Modal from "../components/CustomModal";

export default function useModal({ title, description, body, actionButtons }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  const modal = (
    <Modal
      title={title}
      description={description}
      body={body}
      actionButtons={actionButtons}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );

  return {
    openModal,
    closeModal,
    isOpen,
    modal,
  };
}
