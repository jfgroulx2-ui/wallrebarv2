import { BARS } from "../constants/csaData.js";

export function getRayon(barSize) {
  const { db } = BARS[barSize];
  const factor = { "10M": 2, "15M": 2, "20M": 3, "25M": 3, "30M": 4, "35M": 4 }[barSize];
  return factor * db;
}

export function getExtension(barSize, angle) {
  const { db } = BARS[barSize];
  if (angle === 90) return { ext: Math.max(150, 12 * db), label: `12db = ${Math.round(12 * db)} mm`, clause: "7.1.2b" };
  if (angle === 180) return { ext: Math.max(65, 4 * db), label: `4db = ${Math.round(4 * db)} mm`, clause: "7.1.2a" };
  if (angle === 135) return { ext: Math.max(75, 8 * db), label: `8db = ${Math.round(8 * db)} mm`, clause: "7.1.3" };
  return { ext: 0, label: "", clause: "" };
}

export function getSurcroit(barSize, angle) {
  const r = getRayon(barSize);
  const ext = getExtension(barSize, angle).ext;
  return angle === 180 ? Math.round((Math.PI * r) / 2 + ext) : Math.round(r + ext);
}
