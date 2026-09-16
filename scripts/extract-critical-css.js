/**
 * Regenerates src/critical.inline.css.
 *
 * WHY THIS EXISTS
 * The entry stylesheet (bootstrap.min.css + index.css + App.critical.css) is
 * ~314KB raw / 47KB gzipped and blocks first render — Lighthouse put it at
 * 1060ms with an estimated 300ms of savings. Only 465 of its 3456 rules are
 * used by the first render of "/". Those 465 are inlined into <head> at build
 * time (see the inline-critical-css plugin in vite.config.js) and the full
 * sheet is loaded asynchronously behind them.
 *
 * WHEN TO RE-RUN
 * Any time you change styles that affect the *initial* render of the home page
 * — the header, the hero, the splash, the fonts. Adding styles further down the
 * page needs no regeneration: those rules are in the async sheet, which lands
 * long before anything below the fold is scrolled to.
 *
 * If this file goes stale the failure is soft: a rule missing from the inline
 * copy applies a few hundred ms late, which shows up as a layout shift on the
 * element it styles. It cannot break the page outright, because the full sheet
 * still loads and still wins.
 *
 * HOW TO RE-RUN
 *   1. npm run build && npm run preview
 *   2. Open the preview URL in Chrome, hard-reload, and let it settle.
 *   3. Paste EXTRACT_FN (below) into the DevTools console as:
 *        copy(JSON.stringify(<paste the function body call here>))
 *      or simply run `await (EXTRACT_FN)()` and copy `.css` off the result.
 *   4. Save the CSS somewhere, then minify it into place:
 *        node -e "const e=require('esbuild'),f=require('fs');
 *          f.writeFileSync('src/critical.inline.css',
 *            '/* GENERATED — do not edit by hand. See scripts/extract-critical-css.js *\/\n' +
 *            e.transformSync(f.readFileSync(process.argv[1],'utf8'),{loader:'css',minify:true}).code)" <file>
 *   5. Rebuild and confirm CLS is still 0 (PerformanceObserver on 'layout-shift').
 *
 * The extraction deliberately errs on the side of keeping rules: anything with
 * an unparseable selector, and every @font-face / @keyframes / :root / html /
 * body / * rule, is kept regardless of whether it matched.
 */

export const EXTRACT_FN = () => {
  const sheet = [...document.styleSheets].find(
    (s) => s.href && /\/assets\/index-.*\.css$/.test(s.href)
  );
  if (!sheet) throw new Error("entry stylesheet not found");

  const ALWAYS = /^(html|body|:root|\*|::?before|::?after)\b|^\*,|^:root/i;
  let kept = 0;
  let dropped = 0;
  const out = [];

  const matchesDom = (selectorText) => {
    const probe = selectorText
      .split(",")
      .map((s) =>
        s
          .trim()
          .replace(
            /::?(hover|focus|focus-visible|focus-within|active|visited|target|checked|disabled|before|after|placeholder|selection|first-line|first-letter|-webkit-[a-z-]+|-moz-[a-z-]+)\b(\([^)]*\))?/gi,
            ""
          )
          .replace(/\s+/g, " ")
          .trim()
      )
      .filter(Boolean);
    for (const p of probe) {
      if (!p || ALWAYS.test(p)) return true;
      try {
        if (document.querySelector(p)) return true;
      } catch {
        return true; // unparseable selector -> keep it rather than risk it
      }
    }
    return false;
  };

  const walk = (rules, sink) => {
    for (const r of rules) {
      if (r.type === CSSRule.STYLE_RULE) {
        if (matchesDom(r.selectorText)) {
          sink.push(r.cssText);
          kept++;
        } else dropped++;
      } else if (r.type === CSSRule.MEDIA_RULE) {
        const inner = [];
        walk(r.cssRules, inner);
        if (inner.length)
          sink.push("@media " + r.conditionText + "{" + inner.join("") + "}");
      } else if (r.type === CSSRule.SUPPORTS_RULE) {
        const inner = [];
        walk(r.cssRules, inner);
        if (inner.length)
          sink.push("@supports " + r.conditionText + "{" + inner.join("") + "}");
      } else {
        sink.push(r.cssText); // @font-face, @keyframes, @property, ...
      }
    }
  };
  walk(sheet.cssRules, out);

  return { kept, dropped, css: out.join("\n") };
};
