import React from "react";
import { Navigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import CrmPage from "../adminVendor/crm/CrmPage";
import { clearTeamSession, teamMember, teamToken } from "./teamSession";
import "../adminVendor/crm/crm.css";

// What a team member sees: the CRM, and nothing else. Not the storefront, not
// the plan, not the payouts — none of which their token can reach anyway; this
// is simply the honest shape of the screen that goes with it.

const TeamWorkspace = () => {
  const token = teamToken();
  const member = teamMember();

  if (!token || !member) return <Navigate to="/vendor-team/login" replace />;

  const signOut = () => {
    clearTeamSession();
    window.location.href = "/vendor-team/login";
  };

  const initials = (member.name || "")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      <header className="crm-team-bar">
        <div className="crm-team-bar-inner">
          <span className="crm-team-brand">HappyWedz</span>
          <span className="crm-team-studio">{member.vendor?.businessName}</span>
          <div style={{ flexGrow: 1 }} />
          <span className="crm-team-who">
            <span className="crm-team-avatar">{initials || "?"}</span>
            <span>
              <span className="crm-strong">{member.name}</span>
              <span className="crm-muted crm-small"> · {member.roleLabel}</span>
            </span>
          </span>
          <button type="button" className="crm-btn crm-btn-sm" onClick={signOut}>
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </header>
      <CrmPage />
    </>
  );
};

export default TeamWorkspace;
