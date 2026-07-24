import { GoogleOAuthProvider } from "@react-oauth/google";

// Wraps only the components that actually use Google login (CustomerLogin and the
// design-studio LoginPopup). Previously GoogleOAuthProvider sat at the app root
// in main.jsx, which loaded Google's GSI script (accounts.google.com/gsi/client)
// on EVERY page — setting 13 Google third-party cookies that fail the Lighthouse
// "third-party cookies" Best Practices audit — even though only these two lazy
// components need it. Now the script (and its cookies) load only on login pages.
const GOOGLE_CLIENT_ID =
  "5404414440-02ttfd1mvhk62e5bubrkcipdjhdrrabv.apps.googleusercontent.com";

export default function GoogleAuthProvider({ children }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}
