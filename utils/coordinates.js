import { BARS } from "../constants/csaData.js";

function buildSeries(height, spacing) {
  const safeSpacing = Math.max(10, spacing);
  const count = Math.max(1, Math.floor((height - safeSpacing / 2) / safeSpacing) + 1);
  return Array.from({ length: count }, (_, index) => Math.round(safeSpacing / 2 + index * safeSpacing));
}

export function computeBarPositions(geometry, rebar) {
  const H = Math.round((geometry.Z_sup - geometry.Z_inf) * 1000);
  const dbTie = BARS[rebar.ties.size].db;
  const dbVExt = BARS[rebar.vert_ext.size].db;
  const dbVInt = BARS[rebar.vert_int.size].db;
  const dbHExt = BARS[rebar.horiz_ext.size].db;
  const dbHInt = BARS[rebar.horiz_int.size].db;

  const x_ext = rebar.vert_ext.cover + dbTie + dbVExt / 2;
  const x_int = geometry.thickness - rebar.vert_int.cover - dbTie - dbVInt / 2;
  const h_ext_x = Math.min(x_ext + Math.max(dbVExt, dbHExt) * 0.9, geometry.thickness / 2 - 8);
  const h_int_x = Math.max(x_int - Math.max(dbVInt, dbHInt) * 0.9, geometry.thickness / 2 + 8);

  const y_v = buildSeries(H, rebar.vert_ext.spacing);
  const y_h_ext = buildSeries(H, rebar.horiz_ext.spacing);
  const y_h_int = buildSeries(H, rebar.horiz_int.spacing);
  const y_ties = buildSeries(H, rebar.ties.spacing_v);

  const verticalBars = [
    ...y_v.map((y, index) => ({
      id: `VB-EXT-${String(index + 1).padStart(3, "0")}`,
      type: "vertical",
      face: "exterior",
      size: rebar.vert_ext.size,
      cover: rebar.vert_ext.cover,
      x_mm: x_ext,
      y_start_mm: 0,
      y_end_mm: H,
      y_center_mm: y,
      rebarKey: "vert_ext",
    })),
    ...y_v.map((y, index) => ({
      id: `VB-INT-${String(index + 1).padStart(3, "0")}`,
      type: "vertical",
      face: "interior",
      size: rebar.vert_int.size,
      cover: rebar.vert_int.cover,
      x_mm: x_int,
      y_start_mm: 0,
      y_end_mm: H,
      y_center_mm: y,
      rebarKey: "vert_int",
    })),
  ];

  const horizontalBars = [
    ...y_h_ext.map((y, index) => ({
      id: `HB-EXT-${String(index + 1).padStart(3, "0")}`,
      type: "horizontal",
      face: "exterior",
      size: rebar.horiz_ext.size,
      cover: rebar.vert_ext.cover,
      x_mm: h_ext_x,
      y_mm: y,
      rebarKey: "horiz_ext",
    })),
    ...y_h_int.map((y, index) => ({
      id: `HB-INT-${String(index + 1).padStart(3, "0")}`,
      type: "horizontal",
      face: "interior",
      size: rebar.horiz_int.size,
      cover: rebar.vert_int.cover,
      x_mm: h_int_x,
      y_mm: y,
      rebarKey: "horiz_int",
    })),
  ];

  const ties = y_ties.map((y, index) => ({
    id: `TIE-${String(index + 1).padStart(3, "0")}`,
    type: "tie",
    size: rebar.ties.size,
    x_start_mm: x_ext,
    x_end_mm: x_int,
    y_mm: y,
    hook: rebar.ties.hook,
  }));

  return { H, x_ext, x_int, h_ext_x, h_int_x, verticalBars, horizontalBars, ties };
}
