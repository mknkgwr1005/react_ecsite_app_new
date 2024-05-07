// import React from "react";
// import ReactDOM from "react-dom";
// import App from "./App";

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root")
// );

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartListProvider } from "./components/providers/CartListProvider";
import { StatusProvider } from "./components/providers/statusContext";
import { EditProvider } from "./components/providers/EditProvider";
import { RegisterInfo } from "./components/Register/RegisterInfo";
import { UserProvider } from "./components/providers/UserInfoContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    {/* ProviderのchildrenがAPPになる */}
    <EditProvider>
      <StatusProvider>
        <CartListProvider>
          <RegisterInfo>
            <UserProvider>
              <App />
            </UserProvider>
          </RegisterInfo>
        </CartListProvider>
      </StatusProvider>
    </EditProvider>
  </React.StrictMode>
);
