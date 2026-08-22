import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#131720",
              color: "#E8EAED",
              border: "1px solid #232A38",
              borderRadius: "12px",
              padding: "16px",
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: "#4ADE80",
                secondary: "#0B0E14",
              },
            },
            error: {
              iconTheme: {
                primary: "#FB7185",
                secondary: "#0B0E14",
              },
            },
          }}
        />
      </PersistGate>
    </Provider>
  </StrictMode>,
);
