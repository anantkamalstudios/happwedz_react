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
  // The WhatsApp Business Account campaigns are sent from. Wapzio prints it
  // under Message Templates as "CONNECTED WABA ID".
  const [wabaId, setWabaId] = useState("");
  const [savingWaba, setSavingWaba] = useState(false);
  // The signing secret Wapzio shows once, when the vendor adds the address.
  const [webhookSecret, setWebhookSecret] = useState("");
  const [savingWebhook, setSavingWebhook] = useState(false);
  const [copied, setCopied] = useState(false);
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
      setWabaId(data.whatsapp?.wabaId || "");
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
      const data = await crmApi.connectWhatsapp({
        baseUrl: baseUrl.trim(),
        apiKey: apiKey.trim(),
        wabaId: wabaId.trim(),
      });
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

  const saveWaba = async (event) => {
    event.preventDefault();
    setError("");
    setSavingWaba(true);
    try {
      const data = await crmApi.setWhatsappWaba(wabaId.trim());
      setState(data.whatsapp);
      addToast(data.message || "Saved.", "success");
    } catch (err) {
      setError(errorMessage(err, "Could not save that account id."));
    } finally {
      setSavingWaba(false);
    }
  };

  const saveWebhook = async (event) => {
    event.preventDefault();
    setError("");
    setSavingWebhook(true);
    try {
      const data = await crmApi.setWhatsappWebhookSecret(webhookSecret.trim());
      setState(data.whatsapp);
      setWebhookSecret("");
      addToast(data.message || "Saved.", "success");
    } catch (err) {
      setError(errorMessage(err, "Could not save that signing secret."));
    } finally {
      setSavingWebhook(false);
    }
  };

  const copyWebhookUrl = async () => {
    try {
      await navigator.clipboard.writeText(state.webhookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Some browsers refuse without a user gesture they recognise; the
      // address is on screen and can be selected by hand.
      setError("Could not copy it — select the address and copy it yourself.");
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
          <Form onSubmit={saveWaba} className="mb-3">
            <Form.Label className="small fw-semibold mb-1">Account broadcasts are sent from</Form.Label>
            <div className="d-flex gap-2 align-items-start">
              <Form.Control
                type="text"
                size="sm"
                value={wabaId}
                onChange={(e) => setWabaId(e.target.value)}
                placeholder="e.g. 1234567890123456"
                inputMode="numeric"
                autoComplete="off"
                style={{ maxWidth: 260 }}
              />
              <Button type="submit" variant="outline-success" size="sm" disabled={savingWaba}>
                {savingWaba ? "Saving…" : "Save"}
              </Button>
            </div>
            <Form.Text className={state.wabaId ? "text-muted" : undefined} style={state.wabaId ? undefined : { color: "#b45309" }}>
              {state.wabaId
                ? "Saved. Wapzio needs this to tell us what your templates say, so their previews work."
                : "Not set, so we cannot read what your templates say and their previews stay empty. Sending still works."}{" "}
              In Wapzio it is the number beside CONNECTED WABA ID on the Message Templates page.
            </Form.Text>
          </Form>

          {/* Replies and delivery reports. Without this, HappyWedz sees
              only its own half of every conversation, and "sent" never
              becomes "delivered". */}
          <div className="border-top pt-3 mb-3">
            <div className="fw-semibold small mb-1">Replies and delivery reports</div>

            {state.webhookReady ? (
              <div className="small mb-2" style={{ color: "#16a34a" }}>
                On.{" "}
                {state.webhookLastAt
                  ? `Last message from Wapzio ${new Date(state.webhookLastAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}.`
                  : "Nothing has arrived yet — send yourself a WhatsApp message to test it."}
              </div>
            ) : (
              <div className="small mb-2 text-muted">
                Off. Your clients&apos; replies stay in Wapzio, and a message you send never shows
                as delivered or read. Two steps below turn it on.
              </div>
            )}

            {/* What Wapzio actually sent, and what became of it.
                Both ends can report success while a message goes nowhere —
                Wapzio counts a 200 as delivered, and we answer 200 to
                anything we understand, including an event we decide not to
                act on. Twice now the only way to find out was to reason
                backwards from what was missing on a screen. */}
            {state.webhookLog?.length ? (
              <details className="small mb-2">
                <summary className="text-muted" style={{ cursor: "pointer" }}>
                  Last {state.webhookLog.length} messages from Wapzio
                </summary>
                <div className="mt-1" style={{ maxHeight: 180, overflowY: "auto" }}>
                  {state.webhookLog.map((e, i) => (
                    <div key={i} className="text-muted" style={{ fontFamily: "monospace", fontSize: 11.5 }}>
                      {new Date(e.at).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", second: "2-digit" })}
                      {" · "}
                      {e.event} → {e.kind} → {e.outcome}
                      {e.why ? ` (${e.why})` : ""}
                      {e.from ? ` · from ${e.from}` : ""}
                      {e.to ? ` · to ${e.to}` : ""}
                      {e.status ? ` · ${e.status}` : ""}
                    </div>
                  ))}
                </div>
              </details>
            ) : null}

            {state.webhookLastError ? (
              <div className="small d-flex align-items-start gap-2 mb-2" style={{ color: "#b45309" }}>
                <TriangleAlert size={14} className="flex-shrink-0 mt-1" />
                <span>The last message from Wapzio could not be handled: {state.webhookLastError}</span>
              </div>
            ) : null}

            <div className="small text-muted mb-1">
              <strong>1.</strong> In Wapzio: Setup &amp; Integration → Integrations → Connect a
              website. Paste this address, and turn on <em>Incoming message</em> and{" "}
              <em>Message status</em>.
            </div>
            <div className="d-flex gap-2 align-items-center mb-3">
              <code
                className="small flex-grow-1 text-truncate px-2 py-1 border rounded"
                style={{ background: "#fff" }}
                title={state.webhookUrl || ""}
              >
                {state.webhookUrl || "—"}
              </code>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={copyWebhookUrl}
                disabled={!state.webhookUrl}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>

            <Form onSubmit={saveWebhook}>
              <div className="small text-muted mb-1">
                <strong>2.</strong> Wapzio shows a signing secret once, on the next screen. Paste
                it here — it is what proves a message really came from Wapzio.
              </div>
              <div className="d-flex gap-2 align-items-start">
                <Form.Control
                  type="password"
                  size="sm"
                  value={webhookSecret}
                  onChange={(e) => setWebhookSecret(e.target.value)}
                  placeholder={state.webhookReady ? "Saved — paste a new one to replace it" : "whsec_…"}
                  autoComplete="new-password"
                  style={{ maxWidth: 320 }}
                />
                <Button
                  type="submit"
                  variant="outline-success"
                  size="sm"
                  disabled={savingWebhook || !webhookSecret.trim()}
                >
                  {savingWebhook ? "Saving…" : "Save"}
                </Button>
              </div>
            </Form>
          </div>

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
          <Form.Group className="mb-3">
            <Form.Label className="small fw-semibold">WhatsApp Business Account id</Form.Label>
            <Form.Control
              type="text"
              value={wabaId}
              onChange={(e) => setWabaId(e.target.value)}
              placeholder="e.g. 1234567890123456"
              inputMode="numeric"
              autoComplete="off"
            />
            <Form.Text className="text-muted">
              Wapzio needs this to tell us what your templates say. Without it messages still
              send, but template previews stay empty. You can add it later.
            </Form.Text>
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
