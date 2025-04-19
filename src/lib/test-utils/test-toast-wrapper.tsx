import { Toast } from "@base-ui-components/react/toast";

import { toastManager } from "../toast";

import ToastList from "../../app/components/toast-list/toast-list";

import type { ReactNode } from "react";

function TestToastWrapper({ children }: { children: ReactNode }) {
  return (
    <Toast.Provider toastManager={toastManager}>
      {children}
      <Toast.Viewport className="toast-viewport">
        <ToastList />
      </Toast.Viewport>
    </Toast.Provider>
  );
}

export default TestToastWrapper;
