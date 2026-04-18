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

export const WATERSTOP_TYPES = {
  PVC_centerbulb: { label: "PVC bulbe central", color: "#60a5fa" },
  PVC_flat: { label: "PVC plat", color: "#60a5fa" },
  hydrophilic: { label: "Hydrophile", color: "#4ade80" },
  injection_hose: { label: "Tuyau injection", color: "#f472b6" },
};

export const CONDITION_TYPES = {
  inf: [
    { value: "continue", label: "Continue" },
    { value: "fiche_droite", label: "Fiche droite" },
    { value: "hook_90", label: "Crochet 90°" },
    { value: "hook_180", label: "Crochet 180°" },
    { value: "hook_135", label: "Crochet sismique 135°" },
    { value: "terminee", label: "Terminee" },
  ],
  sup: [
    { value: "continue", label: "Continue" },
    { value: "projection", label: "Projection" },
    { value: "hook_90", label: "Crochet 90°" },
    { value: "hook_180", label: "Crochet 180°" },
    { value: "hook_135", label: "Crochet sismique 135°" },
    { value: "recouvrement", label: "Recouvrement" },
    { value: "terminee", label: "Terminee" },
  ],
};

export const TABS = [
  { id: 1, label: "Geometrie", short: "GEO" },
  { id: 2, label: "Armature", short: "ARM" },
  { id: 3, label: "Joints", short: "JNT" },
  { id: 4, label: "Speciaux", short: "SPE" },
  { id: 5, label: "Apparence", short: "APP" },
  { id: 6, label: "Reference CSA", short: "REF" },
  { id: 7, label: "Export", short: "EXP" },
];

export const GUIDE_CONTENT = {
  1: `Origine (0,0): coin inferieur de la face exterieure du mur.
Definit les coordonnees exportees pour Dynamo/Revit.
Les niveaux Z_inf et Z_sup pilotent la hauteur de la coulee.`,
  2: `Choisir les diametres, espacements et recouvrements des nappes.
Les ratios rho_v et rho_h sont calcules automatiquement.
Le modele genere des positions absolues barre par barre.`,
  3: `Chaque joint peut avoir une condition differente par face.
Les longueurs de fiche, projection et recouvrement s'appuient sur les calculs CSA.`,
  4: `Waterstops, manchons, isolation et membrane enrichissent le modele.
Ces elements sont aussi exportes vers le JSON.`,
  5: `Cet onglet pilote uniquement le rendu graphique.
Le moteur de calcul ne depend jamais de ces reglages visuels.`,
  6: `Les tableaux synthese sont recalcules depuis f'c et fy.
Les longueurs et rayons affiches restent lies aux fonctions normatives pures.`,
  7: `Le JSON exporte contient les coordonnees absolues des barres.
L'objectif est un import Dynamo sans reinterpretation manuelle.`,
};
