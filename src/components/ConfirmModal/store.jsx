import create from "zustand";

export const useConfirmModal = create((set) => ({
  visible: false,
  title: "",
  msg: "",
  onClose: null,
  onConfirm: null,
  confirmText: "",
  cancelText: "",
  confirmLoading: false,

  setConfirmLoading: (confirmLoading) =>
    set({
      confirmLoading,
    }),

  openConfirm: ({
    title,
    msg,
    onClose = () => {},
    onConfirm = () => {},
    confirmText = "Confirm",
    cancelText = "Back",
  }) =>
    set({
      visible: true,
      title,
      msg,
      onClose,
      onConfirm,
      confirmText,
      cancelText,
    }),

  closeConfirm: () =>
    set({
      visible: false,
    }),
}));
