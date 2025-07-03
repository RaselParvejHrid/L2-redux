import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { Provider } from "react-redux";
import "./index.css";
import router from "./routes.tsx";
import { store } from "./redux/store.ts";
import { ConfirmDialogProvider } from "@omit/react-confirm-dialog";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfirmDialogProvider
      defaultOptions={{
        confirmText: "Yes",
        cancelText: "No",
        confirmButton: {
          className:
            "bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md mx-auto my-2",
        },
        cancelButton: {
          className:
            "bg-gray-300 text-gray-800 hover:bg-gray-400 px-4 py-2 rounded-md mx-auto my-2",
        },
        alertDialogContent: {
          className:
            "sm:max-w-[425px] bg-white p-6 rounded-md border border-gray-200",
        },
      }}
    >
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ConfirmDialogProvider>
    <ToastContainer />
  </StrictMode>
);
