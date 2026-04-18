import { BARS, EXPOSURE_CLASSES } from "../constants/csaData.js";
import { computeReinforcementRatios } from "./calculations.js";

export function runValidations(geometry, rebar, conditions, special, derived) {
  const H = Math.round((geometry.Z_sup - geometry.Z_inf) * 1000);
  const c_min = EXPOSURE_CLASSES[geometry.exposureClass].c_min;
  const s_max = Math.min(3 * geometry.thickness, 500);
  const { rho_v, rho_h } = computeReinforcementRatios(geometry, rebar);

  const checks = [
    { id: "v01", level: "error", tabId: 1, test: geometry.thickness < 150, msg: "Epaisseur minimale 150 mm" },
    { id: "v02", level: "error", tabId: 1, test: geometry.Z_sup <= geometry.Z_inf, msg: "Z_sup doit etre superieur a Z_inf" },
    { id: "v03", level: "warning", tabId: 1, test: H < 500, msg: "Hauteur de coulee inferieure a 500 mm" },
    { id: "v04", level: "warning", tabId: 1, test: geometry.k1 * geometry.k2 > 1.7, msg: `k1 x k2 = ${(geometry.k1 * geometry.k2).toFixed(2)} > 1.7, valeur plafonnee` },
    { id: "v05", level: "error", tabId: 2, test: rebar.vert_ext.cover < c_min, msg: `Recouvrement exterieur ${rebar.vert_ext.cover} mm < min ${c_min} mm` },
    { id: "v06", level: "error", tabId: 2, test: rebar.vert_int.cover < c_min, msg: `Recouvrement interieur ${rebar.vert_int.cover} mm < min ${c_min} mm` },
    {
      id: "v07",
      level: "error",
      tabId: 2,
      test:
        geometry.thickness <
        2 *
          (Math.max(rebar.vert_ext.cover, rebar.vert_int.cover) +
            BARS[rebar.ties.size].db +
            Math.max(BARS[rebar.vert_ext.size].db, BARS[rebar.vert_int.size].db)),
      msg: "Epaisseur insuffisante pour les deux nappes et les epingles",
    },
    { id: "v08", level: "error", tabId: 2, test: rho_v < 0.0015, msg: `rho_v = ${(rho_v * 100).toFixed(3)}% < 0.15%` },
    { id: "v09", level: "error", tabId: 2, test: rho_h < 0.002, msg: `rho_h = ${(rho_h * 100).toFixed(3)}% < 0.20%` },
    { id: "v10", level: "warning", tabId: 2, test: rebar.vert_ext.spacing > s_max, msg: `Espacement vertical ext. > s_max = ${s_max} mm` },
    { id: "v11", level: "warning", tabId: 2, test: rebar.horiz_ext.spacing > s_max, msg: `Espacement horizontal ext. > s_max = ${s_max} mm` },
    { id: "v12", level: "warning", tabId: 3, test: conditions.inf.ext.l_override !== null && conditions.inf.ext.l_override < derived.vert_ext.ld, msg: `Fiche inf. ext. override < ld calcule (${derived.vert_ext.ld} mm)` },
    { id: "v13", level: "warning", tabId: 4, test: special.hydrostatic.enabled && !special.waterstop_inf.enabled, msg: "Waterstop recommande au joint inferieur en pression hydrostatique" },
  ];

  return checks.filter((item) => item.test);
}
