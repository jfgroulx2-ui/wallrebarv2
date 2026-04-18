export const BARS = {
  "10M": { db: 11.3, Ab: 100, w_kgm: 0.785 },
  "15M": { db: 16.0, Ab: 200, w_kgm: 1.57 },
  "20M": { db: 19.5, Ab: 300, w_kgm: 2.355 },
  "25M": { db: 25.2, Ab: 500, w_kgm: 3.925 },
  "30M": { db: 29.9, Ab: 700, w_kgm: 5.495 },
  "35M": { db: 35.7, Ab: 1000, w_kgm: 7.85 },
};

export const EXPOSURE_CLASSES = {
  N: { label: "N - Interieur non expose", c_min: 20 },
  "C-1": { label: "C-1 - Gel-degel, pas de sel", c_min: 30 },
  "C-2": { label: "C-2 - Gel-degel avec sel", c_min: 40 },
  "F-1": { label: "F-1 - Eau douce", c_min: 35 },
  "F-2": { label: "F-2 - Eau de mer", c_min: 50 },
  "A-1": { label: "A-1 - Exposition chimique moderee", c_min: 40 },
  "A-2": { label: "A-2 - Exposition chimique severe", c_min: 50 },
};

export const BAR_OPTIONS = Object.keys(BARS);
