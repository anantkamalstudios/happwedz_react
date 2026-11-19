import React, { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import CrmHome from "./CrmHome";
import ClientDetail from "./ClientDetail";
import BusinessProfile from "./BusinessProfile";
import "./crm.css";

// The CRM tab of the vendor dashboard. Which screen shows is kept in the URL
// (?client=12, ?view=business) so the browser back button and reloads work.
//
// WhatsApp used to be one of these views, reached from a button on the CRM's
// header. It is its own tab in the rail now: a workspace with its own
// conversations, templates and broadcasts is not a view of the client list.
const CrmPage = () => {
  const [params, setParams] = useSearchParams();
  const clientId = params.get("client");
  const view = params.get("view");

  const go = useCallback(
    (next) => {
      setParams(next, { replace: false });
      window.scrollTo({ top: 0, behavior: "instant" });
    },
    [setParams],
  );

  return (
    <div className="crm">
      <div className="crm-wrap">
        {view === "business" ? (
          <BusinessProfile onBack={() => go({})} />
        ) : clientId ? (
          <ClientDetail key={clientId} clientId={clientId} onBack={() => go({})} onOpenBusiness={() => go({ view: "business" })} />
        ) : (
          <CrmHome
            onOpenClient={(id) => go({ client: String(id) })}
            onOpenBusiness={() => go({ view: "business" })}
          />
        )}
      </div>
    </div>
  );
};

export default CrmPage;
