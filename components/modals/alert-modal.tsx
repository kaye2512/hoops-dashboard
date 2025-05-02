"use client";
import { useEffect, useState } from "react";
import Modal from "../ui/modal";
import { Button } from "../ui/button";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export default function AlertModal(props: AlertModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <Modal
      title={"are you sure?"}
      description={"This action cannot be undone."}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <div className={"pt-6 space-x-2 flex items-center justify-end w-full"}>
        <Button
          disabled={props.loading}
          variant={"outline"}
          onClick={props.onClose}
        >
          Cancel
        </Button>
        <Button
          disabled={props.loading}
          variant={"destructive"}
          onClick={props.onConfirm}
        >
          Continue
        </Button>
      </div>
    </Modal>
  );
}
