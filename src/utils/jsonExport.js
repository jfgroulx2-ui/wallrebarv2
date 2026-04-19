export function buildExportJSON(pdf, calibration) {
  return {
    gbi_rebar_annotations: {
      metadata: {
        tool: "GBI Rebar Annotator",
        version: "1.0",
        date: new Date().toISOString(),
        units: "mm",
        source_pdf: pdf.sourceName || null,
      },
      calibration: {
        validated: calibration.validated,
        scale_px_mm: calibration.scalePxMm,
        mm_per_px: calibration.scalePxMm ? 1 / calibration.scalePxMm : null,
        point1_pdf: calibration.point1,
        point2_pdf: calibration.point2,
        distance_px: calibration.distancePx ?? null,
        distance_mm: calibration.distanceMm === "" ? null : Number(calibration.distanceMm),
      },
      pages: Array.from({ length: pdf.pageCount || 0 }, (_, index) => {
        const page = index + 1;
        const annotations = pdf.annotations[page] || [];
        return {
          page,
          annotation_count: annotations.length,
          annotations: annotations.map((annotation) => ({
            id: annotation.id,
            type: annotation.type,
            barSize: annotation.barSize,
            spacing_mm: annotation.spacing_mm,
            cover_mm: annotation.cover_mm,
            face: annotation.face,
            note: annotation.note,
            locked: annotation.locked,
            position: {
              x_pdf: annotation.x_pdf,
              y_pdf: annotation.y_pdf,
              x_mm: annotation.x_mm,
              y_mm: annotation.y_mm,
            },
            geometry: {
              length_pdf: annotation.length_pdf,
              length_mm: annotation.length_mm,
            },
          })),
        };
      }),
    },
  };
}

export function getFilename(sourceName) {
  const base = sourceName?.replace(/\.pdf$/i, "") ?? "annotations";
  return `${base}_armature.json`;
}
