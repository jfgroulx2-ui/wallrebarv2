import { OBJECT_TYPES } from "../constants/objectTypes.js";
import { getObjectCenter } from "./geometry.js";

export function generateAnnotationText(object) {
  if (!object) return "";

  if (object.type === OBJECT_TYPES.REBAR_SERIES) {
    const { diameter, spacing_mm, face } = object.properties;
    let text = `${diameter} @ ${spacing_mm} c/c`;
    if (face && face !== "single") text += ` ${face.toUpperCase()}`;
    return text;
  }

  if (object.type === OBJECT_TYPES.REBAR) {
    return object.properties.diameter;
  }

  if (object.type === OBJECT_TYPES.WALL) {
    return object.properties.label || "Mur";
  }

  return object.properties?.text || "";
}

function overlapsExisting(position, annotations) {
  return annotations.some((annotation) => {
    const dx = annotation.geometry.x_mm - position.x_mm;
    const dy = annotation.geometry.y_mm - position.y_mm;
    return Math.hypot(dx, dy) < 80;
  });
}

export function suggestAnnotationPosition(object, existingAnnotations = []) {
  const center = getObjectCenter(object);
  const candidates = [
    { x_mm: center.x_mm + 180, y_mm: center.y_mm + 40 },
    { x_mm: center.x_mm - 180, y_mm: center.y_mm + 40 },
    { x_mm: center.x_mm + 80, y_mm: center.y_mm + 120 },
  ];
  return candidates.find((candidate) => !overlapsExisting(candidate, existingAnnotations)) || candidates[0];
}

export function createLinkedAnnotation(object, suggestedPos) {
  const center = getObjectCenter(object);
  return {
    type: OBJECT_TYPES.ANNOTATION,
    category: "annotation",
    layer: "annotation",
    visible: true,
    locked: false,
    selected: false,
    geometry: {
      x_mm: suggestedPos.x_mm,
      y_mm: suggestedPos.y_mm,
      leaderPoints: [
        { x: center.x_mm + 15, y: center.y_mm },
        { x: suggestedPos.x_mm - 10, y: suggestedPos.y_mm },
      ],
    },
    properties: {
      text: generateAnnotationText(object),
      linkedId: object.id ?? null,
      autoUpdate: true,
      style: "rebar_call",
      underline: true,
    },
    linkedAnnotations: [],
    parentId: object.id ?? null,
    childIds: [],
  };
}

export function updateAnnotationForObject(annotation, object) {
  const text = generateAnnotationText(object);
  return {
    ...annotation,
    properties: {
      ...annotation.properties,
      text,
    },
  };
}
