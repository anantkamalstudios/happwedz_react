function mergeDeep(base, patch) {
  const out = { ...base };
  Object.keys(patch).forEach((k) => {
    const pv = patch[k];
    const bv = base[k];
    if (
      pv &&
      typeof pv === "object" &&
      !Array.isArray(pv) &&
      bv &&
      typeof bv === "object" &&
      !Array.isArray(bv)
    ) {
      out[k] = mergeDeep(bv, pv);
    } else {
      out[k] = pv;
    }
  });
  return out;
}
console.log(JSON.stringify(mergeDeep({}, { identity: { company_name: "A" } })));
