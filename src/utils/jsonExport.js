import { BARS, WATERSTOP_TYPES } from "../constants/csaData.js";
import { getExtension, getRayon } from "./hookGeometry.js";

function lengthsEntry(key, rebar, derived) {
  return {
    bar_size: rebar[key].size,
    db_mm: BARS[rebar[key].size].db,
    ld_mm: derived[key].ld,
    ldc_mm: derived[key].ldc,
    ldh_mm: derived[key].ldh,
    ls_A_mm: derived[key].ls_A,
    ls_B_mm: derived[key].ls_B,
    ls_C_mm: derived[key].ls_C,
    k4: derived[key].k4,
    k1k2_capped: derived[key].k1k2_capped,
    clauses: ["12.2.2", "12.3.2", "12.5.2", "12.15.1", "12.16.1"],
  };
}

function conditionToJSON(side, conditions, derived, rebar) {
  return {
    exterior: {
      ...conditions[side].ext,
      length_mm: conditions[side].ext.l_override ?? derived.vert_ext.ld,
      bar_size: rebar.vert_ext.size,
    },
    interior: {
      ...conditions[side].int,
      length_mm: conditions[side].int.l_override ?? derived.vert_int.ld,
      bar_size: rebar.vert_int.size,
    },
  };
}

export function generateJSON(geometry, rebar, conditions, special, derived, barPositions, barOverrides, pdf) {
  return {
    revit_wall_section: {
      metadata: {
        generated_by: "GBI Wall Section Tool v4.0",
        standard: "CSA A23.3-19",
        date: new Date().toISOString(),
        units: "mm",
        pdf_reference: pdf.fileName || null,
      },
      coordinate_system: {
        origin: {
          x_m: geometry.origin_x_m,
          y_m: geometry.origin_y_m,
          z_m: geometry.origin_z_m,
          description: "Coin inferieur face exterieure du mur",
        },
        x_axis: "epaisseur du mur",
        y_axis: "vertical entre Z_inf et Z_sup",
        z_axis: "longueur du mur",
      },
      geometry: {
        wall_mark: geometry.wallMark,
        plan_ref: geometry.planRef,
        engineer: geometry.engineer,
        thickness_mm: geometry.thickness,
        Z_inf_m: geometry.Z_inf,
        Z_sup_m: geometry.Z_sup,
        height_mm: barPositions.H,
        fc_MPa: geometry.fc,
        fy_MPa: geometry.fy,
        lambda: geometry.lambda,
        exposure_class: geometry.exposureClass,
      },
      factors: {
        k1: geometry.k1,
        k2: geometry.k2,
        k1_x_k2: Math.min(geometry.k1 * geometry.k2, 1.7),
        k1_x_k2_capped: geometry.k1 * geometry.k2 > 1.7,
      },
      reinforcement: {
        vertical_bars: barPositions.verticalBars.map((bar) => ({
          id: bar.id,
          face: bar.face,
          size: bar.size,
          db_mm: BARS[bar.size].db,
          x_mm: barOverrides[bar.id]?.x_mm_override ?? bar.x_mm,
          y_start_mm: bar.y_start_mm,
          y_end_mm: bar.y_end_mm,
          y_center_mm: barOverrides[bar.id]?.y_center_override ?? bar.y_center_mm,
          spacing_mm: rebar[bar.rebarKey].spacing,
          override: barOverrides[bar.id] ?? null,
        })),
        horizontal_bars: barPositions.horizontalBars.map((bar) => ({
          id: bar.id,
          face: bar.face,
          size: bar.size,
          db_mm: BARS[bar.size].db,
          x_mm: barOverrides[bar.id]?.x_mm_override ?? bar.x_mm,
          y_mm: barOverrides[bar.id]?.y_mm_override ?? bar.y_mm,
          spacing_mm: rebar[bar.rebarKey].spacing,
          override: barOverrides[bar.id] ?? null,
        })),
        ties: barPositions.ties.map((tie) => ({
          id: tie.id,
          size: tie.size,
          x_start_mm: tie.x_start_mm,
          x_end_mm: tie.x_end_mm,
          y_mm: tie.y_mm,
          hook_deg: tie.hook,
          hook_r_int_mm: getRayon(tie.size),
          hook_ext_mm: getExtension(tie.size, tie.hook).ext,
        })),
      },
      development_lengths: {
        vert_ext: lengthsEntry("vert_ext", rebar, derived),
        vert_int: lengthsEntry("vert_int", rebar, derived),
        horiz_ext: lengthsEntry("horiz_ext", rebar, derived),
        horiz_int: lengthsEntry("horiz_int", rebar, derived),
      },
      end_conditions: {
        inferior_joint: conditionToJSON("inf", conditions, derived, rebar),
        superior_joint: conditionToJSON("sup", conditions, derived, rebar),
      },
      special_elements: {
        waterstop_inf: special.waterstop_inf.enabled ? { ...special.waterstop_inf, label: WATERSTOP_TYPES[special.waterstop_inf.type].label } : null,
        waterstop_sup: special.waterstop_sup.enabled ? { ...special.waterstop_sup, label: WATERSTOP_TYPES[special.waterstop_sup.type].label } : null,
        sleeves: special.sleeves,
        hydrostatic: special.hydrostatic,
        insulation: special.insulation,
        membrane: special.membrane,
      },
    },
  };
}

export function getFilename(geometry) {
  return `armature_${geometry.wallMark}_${geometry.thickness}mm_+${geometry.Z_inf.toFixed(3)}-+${geometry.Z_sup.toFixed(3)}.json`;
}
