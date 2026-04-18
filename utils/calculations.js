import { BARS } from "../constants/csaData.js";

export function calculerLd({ barSize, fc, fy, k1, k2, k3 = 1.0, lambda = 1.0 }) {
  const { db } = BARS[barSize];
  const k4 = ["10M", "15M"].includes(barSize) ? 0.8 : 1.0;
  const k1k2 = Math.min(k1 * k2, 1.7);
  const rawLd = (0.45 * k1k2 * k3 * k4 * fy * db) / (lambda * Math.sqrt(fc));

  return {
    ld: Math.max(300, Math.round(rawLd)),
    k4,
    k1k2,
    k1k2_capped: k1 * k2 > 1.7,
    min_applied: rawLd < 300,
    clause: "12.2.2",
  };
}

export function calculerLdc({ barSize, fc, fy }) {
  const { db } = BARS[barSize];
  const rawLdc = Math.max((0.24 * fy * db) / Math.sqrt(fc), 0.044 * fy * db);

  return {
    ldc: Math.max(200, Math.round(rawLdc)),
    min_applied: rawLdc < 200,
    clause: "12.3.2",
  };
}

export function calculerLdh({ barSize, fc, fy, k1h = 1.0, k2h = 1.0, k3h = 1.0 }) {
  const { db } = BARS[barSize];
  const rawLdh = (((100 * fy) / Math.sqrt(fc)) * db * k1h * k2h * k3h) / 1000;
  const minimum = Math.max(8 * db, 150);

  return {
    ldh: Math.max(minimum, Math.round(rawLdh)),
    min_8db: 8 * db,
    min_applied: rawLdh < minimum,
    clause: "12.5.2",
  };
}

export function calculerLs({
  barSize,
  fc,
  fy,
  k1,
  k2,
  k3 = 1.0,
  lambda = 1.0,
  As_fourni = null,
  As_requis = null,
  pct_recouvert = 100,
}) {
  const { ld } = calculerLd({ barSize, fc, fy, k1, k2, k3, lambda });
  const classAEligible =
    As_fourni !== null &&
    As_requis !== null &&
    As_fourni >= 2 * As_requis &&
    pct_recouvert <= 50;
  const classe = classAEligible ? "A" : "B";
  const facteur = classe === "A" ? 1.0 : 1.3;
  const rawLs = facteur * ld;

  return {
    ls: Math.max(300, Math.round(rawLs)),
    ld,
    classe,
    facteur,
    justification: classAEligible
      ? "As_fourni >= 2xAs_requis et <= 50% recouvert"
      : "Cas general",
    clause: "12.15.1",
  };
}

export function computeBarLengths(barSize, geometry) {
  const { fc, fy, k1, k2, lambda } = geometry;
  const args = { barSize, fc, fy, k1, k2, lambda };

  return {
    ...calculerLd(args),
    ...calculerLdc({ barSize, fc, fy }),
    ...calculerLdh({ barSize, fc, fy }),
    ls_A: calculerLs({ ...args, As_fourni: 999999, As_requis: 1, pct_recouvert: 50 }).ls,
    ls_B: calculerLs({ ...args, As_fourni: 100, As_requis: 100, pct_recouvert: 100 }).ls,
  };
}

export function computeAllDerivedLengths(geometry, rebar) {
  return {
    vert_ext: computeBarLengths(rebar.vert_ext.size, geometry),
    vert_int: computeBarLengths(rebar.vert_int.size, geometry),
    horiz_ext: computeBarLengths(rebar.horiz_ext.size, geometry),
    horiz_int: computeBarLengths(rebar.horiz_int.size, geometry),
    ties: computeBarLengths(rebar.ties.size, geometry),
  };
}
