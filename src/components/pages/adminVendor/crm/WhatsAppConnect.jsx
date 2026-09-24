import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { crmApi, errorMessage } from "./crmApi";
import { WhatsAppIcon } from "./ClientExtras";
import { useToast } from "../../../layouts/toasts/Toast";

// Connecting a vendor's WhatsApp provider.
//
// Two fields, pasted from the provider's dashboard. Pressing Connect does not
// just save them: the server calls the provider with them first, so a key that
// is wrong fails here, while the vendor is still looking at the box they
// pasted it into - rather than silently, weeks later, on a quotation a client
// never received.
//
// The key is encrypted on the server and never comes back. Once connected the
// vendor sees the last four characters, which is enough to tell which key they
// used and no use to anybody else.

export default function WhatsAppConnect() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [state, setState] = useState(null);
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  // Templates the account cannot send yet. A working key is not enough: Meta
  // has to have approved each message before it can go out.
  const [missing, setMissing] = useState([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await crmApi.whatsapp();
      setState(data.whatsapp);
      if (data.whatsapp?.baseUrl) setBaseUrl(data.whatsapp.baseUrl);
    } catch (err) {
      setError(errorMessage(err, "Could not check your WhatsApp connection."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const connect = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const data = await crmApi.connectWhatsapp({ baseUrl: baseUrl.trim(), apiKey: apiKey.trim() });
      setState(data.whatsapp);
      setMissing(data.whatsapp?.missingTemplates || []);
      setApiKey("");
      addToast(data.message || "WhatsApp is connected.", "success");
    } catch (err) {
      setError(errorMessage(err, "Could not connect WhatsApp."));
    } finally {
      setSaving(false);
    }
  };

  const disconnect = async () => {
    if (!window.confirm("Disconnect WhatsApp? Your quotation and invoice buttons will go back to opening WhatsApp on your phone.")) return;
    setSaving(true);
    try {
      const data = await crmApi.disconnectWhatsapp();
      setState(data.whatsapp);
      setApiKey("");
      addToast("WhatsApp is disconnected.", "success");
    } catch (err) {
      setError(errorMessage(err, "Could not disconnect WhatsApp."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center gap-2 text-muted small py-2">
        <Spinner animation="border" size="sm" /> Checking your WhatsApp connection…
      </div>
    );
  }

  const connected = state?.connected;
  const broken = state && state.connected === false && state.baseUrl;

  return (
    <div>
      <p className="text-muted small mb-3">
        Send quotations, invoices and receipts to your clients on WhatsApp, straight from a client&apos;s page. Paste the base URL and API key
        from your WhatsApp provider below. Until you connect, those buttons open WhatsApp on your phone as they do now.
      </p>

      {error && (
        <Alert variant="danger" className="py-2 px-3 small" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}

      {connected ? (
        <div className="border rounded p-3 mb-3" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
          <div className="d-flex align-items-start gap-2 mb-2">
            <CheckCircle2 size={18} className="flex-shrink-0 mt-1" style={{ color: "#16a34a" }} />
            <div className="flex-grow-1">
              <div className="fw-semibold">WhatsApp is connected</div>
              {state.phoneNumber && (
                <div className="small text-muted">
                  Your clients will see messages from <strong>{state.phoneNumber}</strong>.
                </div>
              )}
              <div className="small text-muted">
                Key {state.apiKeyMasked} · {state.baseUrl}
              </div>
            </div>
          </div>
          {missing.length > 0 && (
            <div className="small d-flex align-items-start gap-2 mb-2" style={{ color: "#b45309" }}>
              <TriangleAlert size={14} className="flex-shrink-0 mt-1" />
              <span>
                Still to create on Wapzio, as approved templates: <strong>{missing.join(", ")}</strong>. Until Meta approves each one, that
                kind of message cannot be sent.
              </span>
            </div>
          )}
          {state.lastError && (
            <div className="small d-flex align-items-start gap-2 mb-2" style={{ color: "#b45309" }}>
              <TriangleAlert size={14} className="flex-shrink-0 mt-1" />
              <span>The last message did not go through: {state.lastError}</span>
            </div>
          )}
          <Button variant="outline-danger" size="sm" onClick={disconnect} disabled={saving}>
            Disconnect
          </Button>
        </div>
      ) : (
        <Form onSubmit={connect}>
          {broken && (
            <Alert variant="warning" className="py-2 px-3 small">
              Your WhatsApp connection stopped working{state.lastError ? `: ${state.lastError}` : "."} Paste your API key again to reconnect.
            </Alert>
          )}
          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold">Base URL</Form.Label>
            <Form.Control
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://api.wapzio.com"
              autoComplete="off"
              required
            />
            <Form.Text className="text-muted">
              From your provider&apos;s API Credentials page — usually https://api.wapzio.com
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold">API key</Form.Label>
            <Form.Control
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your API key"
              autoComplete="new-password"
              required
            />
            <Form.Text className="text-muted">Stored encrypted. It is never shown again after you connect.</Form.Text>
          </Form.Group>
          <Button type="submit" variant="success" disabled={saving || !baseUrl.trim() || !apiKey.trim()}>
            {saving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" /> Checking your details…
              </>
            ) : (
              <>
                <WhatsAppIcon size={16} /> <span className="ms-2">Connect WhatsApp</span>
              </>
            )}
          </Button>
        </Form>
      )}
    </div>
  );
}
