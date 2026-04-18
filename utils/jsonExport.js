import { BARS, EXPOSURE_CLASSES } from "../constants/csaData.js";

export function generateJSON({ project, geometry, rebar, notes, derived, pdf }) {
  const heightMm = Math.round((geometry.Z_sup - geometry.Z_inf) * 1000);

  return {
    gbi_wall_section: {
      metadata: {
        generated_by: "GBI Wall Section Tool",
        phrase: "Design once. Export. Execute.",
        date: new Date().toISOString(),
        pdf_reference: pdf.fileName || null,
      },
      project,
      geometry: {
        ...geometry,
        height_mm: heightMm,
        exposure_label: EXPOSURE_CLASSES[geometry.exposureClass]?.label ?? geometry.exposureClass,
      },
      reinforcement: {
        ...rebar,
        bars: {
          vert_ext: BARS[rebar.vert_ext.size],
          vert_int: BARS[rebar.vert_int.size],
          horiz_ext: BARS[rebar.horiz_ext.size],
          horiz_int: BARS[rebar.horiz_int.size],
          ties: BARS[rebar.ties.size],
        },
      },
      development_lengths: derived,
      notes,
    },
  };
}

export function getFilename(project, geometry) {
  const mark = (project.wallMark || "mur").replace(/\s+/g, "_");
  return `armature_${mark}_${geometry.thickness}mm.json`;
}
