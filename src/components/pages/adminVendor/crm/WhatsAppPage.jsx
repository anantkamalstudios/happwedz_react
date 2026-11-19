import React from "react";
import WhatsAppWorkspace from "./WhatsAppWorkspace";
import "./crm.css";

// WhatsApp as a tab of its own.
//
// It used to be a button on the CRM's header, which put conversations,
// templates and broadcasts one click inside another tool — and gave them a
// Back button to a screen the vendor had not necessarily come from. There
// is nothing to go back to now.
//
// The CRM's stylesheet comes with it: the workspace is built from the same
// crm- components as the rest of that folder.
const WhatsAppPage = () => (
  <div className="crm">
    <div className="crm-wrap">
      <WhatsAppWorkspace />
    </div>
  </div>
);

export default WhatsAppPage;
