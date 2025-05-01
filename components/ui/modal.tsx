import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Modal(props: {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}) {
  const onChange = (open: boolean) => {
    if (!open) {
      props.onClose();
    }
  };
  return (
    <Dialog open={props.isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription>{props.description}</DialogDescription>
        </DialogHeader>
        <div>{props.children}</div>
      </DialogContent>
    </Dialog>
  );
}
