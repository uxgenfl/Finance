/* Mesin terjemahan: menerjemahkan teks di halaman dan mengganti bahasa. */

const GLR = new RegExp(
  "(?<![A-Za-z])(" +
    Object.keys(GL)
      .sort((a, b) => b.length - a.length)
      .join("|") +
    ")(?![A-Za-z])",
  "gi",
);
function glo(t) {
  if (t.length > 80 || /[@<>]/.test(t)) return t;
  let n = 0;
  const r = t.replace(GLR, (w) => {
    const l = w.toLowerCase();
    if (!["untuk", "dan", "di", "ke", "dari"].includes(l)) n++;
    const e = GL[l];
    return w[0] === w[0].toUpperCase() && w[0] !== w[0].toLowerCase()
      ? e[0].toUpperCase() + e.slice(1)
      : e;
  });
  return n ? r : t;
}
const DAYS = /^(\s*)(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday) (?=\d)/;
const cos = (x) => x.replace(/\bSept\b/g, "Sep").replace(DAYS, "$1$2, ");
const SM = (t) => t.replace(/[\u2063\u2064]/g, "");
function trs(t) {
  if (t.indexOf("\u2063") < 0) return trsC(t);
  const k = [];
  const p = t.replace(/\u2063([\s\S]*?)\u2064/g, (_, x) => {
    k.push(x);
    return "\u2063" + (k.length - 1) + "\u2064";
  });
  return trsC(p).replace(/\u2063(\d+)\u2064/g, (_, i) => k[i]);
}
function trsC(t) {
  const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(t);
  if (!m[2]) return t;
  let c = EN[m[2]];
  if (c === undefined)
    for (const [r, f] of RX) {
      const x = r.exec(m[2]);
      if (x) {
        c = f(x);
        break;
      }
    }
  if (c === undefined) c = glo(m[2]);
  return cos(m[1] + c + m[3]);
}
const TN = new WeakMap(),
  AT = ["aria-label", "title", "placeholder"];
function tNode(n) {
  const pe = n.parentNode;
  if (pe && pe.closest && pe.closest("[data-notr]")) return;
  const v = n.nodeValue,
    r = TN.get(n),
    o = r && v === r.t ? r.o : v,
    res = S.lang === "en" ? trs(o) : SM(o);
  if (res !== v) {
    TN.set(n, { o, t: res });
    n.nodeValue = res;
  }
}
function tAttr(e) {
  for (const a of AT) {
    if (!e.hasAttribute(a)) continue;
    const v = e.getAttribute(a),
      k = "_o" + a,
      r = e[k],
      o = r && v === r.t ? r.o : v,
      res = S.lang === "en" ? trs(o) : SM(o);
    if (res !== v) {
      e[k] = { o, t: res };
      e.setAttribute(a, res);
    }
  }
}
function tAll(root) {
  if (!root) return;
  if (root.nodeType == 3) {
    tNode(root);
    return;
  }
  if (root.nodeType != 1) return;
  if (/^(SCRIPT|STYLE|TEXTAREA)$/.test(root.tagName)) return;
  tAttr(root);
  const w = document.createTreeWalker(root, 5);
  let n;
  while ((n = w.nextNode())) {
    if (n.nodeType == 3) {
      if (!/^(SCRIPT|STYLE|TEXTAREA)$/.test(n.parentNode.tagName)) tNode(n);
    } else tAttr(n);
  }
}
new MutationObserver((ms) => {
  for (const m of ms) {
    if (m.type == "childList") m.addedNodes.forEach(tAll);
    else if (m.type == "characterData") tNode(m.target);
    else if (m.type == "attributes") tAttr(m.target);
  }
}).observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true,
  attributes: true,
  attributeFilter: AT,
});

function setLang(v) {
  S.lang = v === "en" ? "en" : "id";
  save();
  document.documentElement.lang = S.lang;
  tAll(document.body);
  render();
  if (PPK && PP[PPK]) {
    $("#ppc").innerHTML = PP[PPK][1]();
    tAll($("#ppc"));
  }
}
