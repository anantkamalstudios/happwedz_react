import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CARD_HEIGHT, CARD_WIDTH, fontStack, loadFonts, pageFonts } from "./einviteDesign";

export const fieldTextStyle = (field, scale) => ({
  position: "absolute",
  left: `${field.x * 100}%`,
  top: `${field.y * 100}%`,
  width: field.width ? `${field.width * 100}%` : "auto",
  whiteSpace: field.width ? "pre-wrap" : "pre",
  overflowWrap: "break-word",
  textAlign: field.align,
  fontFamily: fontStack(field.fontFamily),
  fontSize: `${field.fontSize * scale}px`,
  fontWeight: field.fontWeight,
  fontStyle: field.fontStyle,
  letterSpacing: `${field.letterSpacing * scale}px`,
  lineHeight: field.lineHeight,
  color: field.color,
  textTransform: field.uppercase ? "uppercase" : "none",
  margin: 0,
});

// Draws one card page at whatever width its container gives it. Every size in
// the design is scaled from the CARD_WIDTH-wide design space, so a thumbnail
// and the full editor show exactly the same layout.
const EinvitePage = ({
  page,
  className = "",
  style,
  selectedFieldId,
  onFieldPointerDown,
  onBackgroundPointerDown,
  showOutlines = false,
  fieldCursor = "move",
  children,
}) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0);
  // A missing background shows the plain card colour instead of a broken-image icon.
  const [failedBackground, setFailedBackground] = useState(null);

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;
    const update = () => setScale(element.clientWidth / CARD_WIDTH);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const fontsKey = pageFonts(page).join("|");
  useEffect(() => {
    loadFonts(fontsKey.split("|"));
  }, [fontsKey]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: `${CARD_WIDTH} / ${CARD_HEIGHT}`,
        overflow: "hidden",
        background: "#f3efea",
        userSelect: "none",
        ...style,
      }}
      onPointerDown={onBackgroundPointerDown}
    >
      {page?.backgroundUrl && failedBackground !== page.backgroundUrl && (
        <img
          src={page.backgroundUrl}
          alt=""
          draggable={false}
          loading="lazy"
          onError={() => setFailedBackground(page.backgroundUrl)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "fill",
            pointerEvents: "none",
          }}
        />
      )}

      {scale > 0 &&
        (page?.fields || []).map((field) => {
          const isSelected = field.id === selectedFieldId;
          const interactive = Boolean(onFieldPointerDown);
          const dragging = interactive && fieldCursor === "move";
          return (
            <div
              key={field.id}
              data-field-id={field.id}
              style={{
                ...fieldTextStyle(field, scale),
                cursor: interactive ? fieldCursor : "default",
                pointerEvents: interactive ? "auto" : "none",
                outline: isSelected
                  ? "2px solid #ed1173"
                  : showOutlines
                  ? "1px dashed rgba(237, 17, 115, 0.55)"
                  : "none",
                outlineOffset: 2,
                // Dragging needs the pointer; tapping to edit must still let the page scroll.
                touchAction: dragging ? "none" : "auto",
              }}
              onPointerDown={
                interactive
                  ? (event) => {
                      event.stopPropagation();
                      onFieldPointerDown(field.id, event);
                    }
                  : undefined
              }
            >
              {field.defaultText || (interactive ? " " : "")}
            </div>
          );
        })}

      {children}
    </div>
  );
};

export default EinvitePage;
