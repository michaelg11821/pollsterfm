"use client";

import { Toast } from "@base-ui-components/react/toast";

import styles from "./toast-list.module.css";

function ToastList() {
  const { toasts } = Toast.useToastManager();

  return toasts.map((toast) => (
    <Toast.Root key={toast.id} toast={toast} className={styles.Toast}>
      <Toast.Title className={styles.Title}>{toast.title}</Toast.Title>
      <Toast.Description className={styles.Description}>
        {toast.description}
      </Toast.Description>
      <Toast.Close aria-label="Close" className={styles.Close}>
        ×
      </Toast.Close>
    </Toast.Root>
  ));
}

export default ToastList;
