// A team member's session.
//
// Kept apart from the vendor session on purpose: a member is not the vendor,
// and must never end up holding a token the rest of the dashboard would accept.
// The token only opens the CRM, which is all this workspace shows.

const TOKEN_KEY = "teamToken";
const MEMBER_KEY = "teamMember";

const read = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const teamToken = () => read(TOKEN_KEY);

export const teamMember = () => {
  try {
    const raw = read(MEMBER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveTeamSession = ({ token, member, vendor }) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(MEMBER_KEY, JSON.stringify({ ...member, vendor: vendor || null }));
  } catch {
    // Private mode: the session lasts until the tab is closed, which is a
    // worse experience but not a broken one.
  }
};

export const clearTeamSession = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(MEMBER_KEY);
  } catch {
    // Nothing to clear.
  }
};
