export const defaultGeometry = {
  wallMark: "M-01",
  planRef: "S-101",
  engineer: "",
  origin_x_m: 0,
  origin_y_m: 0,
  origin_z_m: 0,
  thickness: 250,
  Z_inf: 0,
  Z_sup: 3.65,
  fc: 30,
  fy: 400,
  lambda: 1,
  exposureClass: "C-2",
  k1: 1,
  k2: 1,
};

export const defaultRebar = {
  vert_ext: { size: "15M", spacing: 200, cover: 40 },
  vert_int: { size: "15M", spacing: 200, cover: 25 },
  horiz_ext: { size: "10M", spacing: 300 },
  horiz_int: { size: "10M", spacing: 300 },
  ties: {
    size: "10M",
    spacing_v: 400,
    spacing_h: 600,
    hook: 135,
    pattern: "rectangular",
  },
};

export const defaultConditions = {
  sameConditionBothFaces: true,
  inf: {
    ext: { type: "fiche_droite", l_override: null, showDim: true },
    int: { type: "fiche_droite", l_override: null, showDim: true },
  },
  sup: {
    ext: { type: "projection", l_override: null, showDim: true, overlapClass: "B", As_requis: null, pct_recouvert: 100 },
    int: { type: "projection", l_override: null, showDim: true, overlapClass: "B", As_requis: null, pct_recouvert: 100 },
  },
  contextHeightInf: 400,
  contextHeightSup: 400,
};

export const defaultSpecial = {
  waterstop_inf: { enabled: false, type: "PVC_centerbulb", width: 230, position: "center" },
  waterstop_sup: { enabled: false, type: "PVC_centerbulb", width: 230, position: "center" },
  sleeves: [],
  hydrostatic: { enabled: false, waterLevel: null },
  insulation: { enabled: false, position: "ext", thickness: 75, type: "XPS" },
  membrane: { enabled: false, face: "ext", type: "torchee", thickness: 4 },
};

export const defaultDraw = {
  wallLineWidth: 2,
  wallLineColor: "#dbe4f7",
  hatchEnabled: true,
  hatchPattern: "diagonal_45",
  hatchSpacing: 10,
  hatchLineWidth: 0.5,
  hatchColor: "#516277",
  hatchOpacity: 0.4,
  barStrokeWidth: 1,
  barSizeMultiplier: 1,
  tieLineWidth: 1,
  dimLineWidth: 0.85,
  jointLineWidth: 1.5,
  jointStyle: "dashed",
  jointColor: "#f59e0b",
  leaderEnabled: true,
  leaderSide: "right",
  leaderLineWidth: 0.85,
  leaderFontSize: 11,
  leaderMargin: 72,
  gridEnabled: false,
  showOrigin: true,
  scale: "auto",
};

export const defaultBarOverrides = {};
export const defaultInteraction = { dragging: false, selectedBar: null, snapPos: null, showDialog: false, dialogPos: null };
export const defaultPdf = { loaded: false, fileName: "", url: "", calibrated: false };
