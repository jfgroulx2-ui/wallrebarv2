import { create } from "zustand";
import { DEFAULT_GRID, DEFAULT_VIEW } from "../constants/defaults.js";
import { OBJECT_TYPES } from "../constants/objectTypes.js";
import { createLinkedAnnotation, suggestAnnotationPosition, updateAnnotationForObject } from "../utils/annotations.js";
import { hitTestObject, translateObjectGeometry } from "../utils/geometry.js";

function cloneLinkedAnnotation(annotation, objectId) {
  return {
    ...annotation,
    properties: {
      ...annotation.properties,
      linkedId: objectId,
    },
    linkedAnnotations: [],
    parentId: objectId,
    childIds: [],
  };
}

export const useDrawingStore = create((set, get) => ({
  objects: {},
  objectOrder: [],
  _nextId: 1,
  selectedIds: [],
  view: DEFAULT_VIEW,
  grid: DEFAULT_GRID,
  origin: { x_mm: 0, y_mm: 0, label: "Origine projet" },
  layers: {
    structure: { label: "Structure", visible: true, locked: false, color: "#cbd5e1" },
    reinforcement: { label: "Armature", visible: true, locked: false, color: "#f97316" },
    annotation: { label: "Annotations", visible: true, locked: false, color: "#f1f5f9" },
    geometry: { label: "Geometrie", visible: true, locked: false, color: "#94a3b8" },
    reference: { label: "References", visible: true, locked: false, color: "#60a5fa" },
  },

  nextId(prefix = "OBJ") {
    const id = `${prefix}-${String(get()._nextId).padStart(3, "0")}`;
    set((state) => ({ _nextId: state._nextId + 1 }));
    return id;
  },

  addObject(object) {
    const id = object.id || get().nextId(object.category === "annotation" ? "ANN" : "OBJ");
    const finalObject = {
      visible: true,
      locked: false,
      selected: false,
      layer: object.layer || object.category || "geometry",
      linkedAnnotations: [],
      childIds: [],
      parentId: null,
      ...object,
      id,
    };
    set((state) => ({
      objects: { ...state.objects, [id]: finalObject },
      objectOrder: [...state.objectOrder, id],
    }));
    return id;
  },

  addObjects(objects) {
    return objects.map((object) => get().addObject(object));
  },

  addObjectWithAnnotation(object) {
    const baseId = get().addObject(object);
    const created = get().objects[baseId] || { ...object, id: baseId };
    const existingAnnotations = Object.values(get().objects).filter((candidate) => candidate.type === OBJECT_TYPES.ANNOTATION);
    const suggestedPosition = suggestAnnotationPosition(created, existingAnnotations);
    const annotation = cloneLinkedAnnotation(createLinkedAnnotation(created, suggestedPosition), baseId);
    const annotationId = get().addObject(annotation);

    set((state) => ({
      objects: {
        ...state.objects,
        [baseId]: {
          ...state.objects[baseId],
          linkedAnnotations: [...(state.objects[baseId].linkedAnnotations || []), annotationId],
        },
      },
    }));
    return baseId;
  },

  updateObject(id, changes) {
    const current = get().objects[id];
    if (!current) return;
    const nextObject = {
      ...current,
      ...changes,
      geometry: changes.geometry ? { ...current.geometry, ...changes.geometry } : current.geometry,
      properties: changes.properties ? { ...current.properties, ...changes.properties } : current.properties,
    };

    set((state) => ({
      objects: {
        ...state.objects,
        [id]: nextObject,
      },
    }));
    get().refreshLinkedAnnotations(id);
  },

  refreshLinkedAnnotations(objectId) {
    const object = get().objects[objectId];
    if (!object) return;
    (object.linkedAnnotations || []).forEach((annotationId) => {
      const annotation = get().objects[annotationId];
      if (annotation?.properties?.autoUpdate) {
        set((state) => ({
          objects: {
            ...state.objects,
            [annotationId]: updateAnnotationForObject(state.objects[annotationId], object),
          },
        }));
      }
    });
  },

  translateObject(id, dx, dy) {
    const object = get().objects[id];
    if (!object) return;
    const moved = translateObjectGeometry(object, dx, dy);

    set((state) => ({
      objects: {
        ...state.objects,
        [id]: moved,
      },
    }));

    (object.linkedAnnotations || []).forEach((annotationId) => {
      const annotation = get().objects[annotationId];
      if (!annotation) return;
      set((state) => ({
        objects: {
          ...state.objects,
          [annotationId]: translateObjectGeometry(annotation, dx, dy),
        },
      }));
    });
  },

  deleteObject(id) {
    const object = get().objects[id];
    if (!object) return;
    const cascadeIds = new Set([id, ...(object.linkedAnnotations || []), ...(object.childIds || [])]);

    set((state) => {
      const objects = { ...state.objects };
      cascadeIds.forEach((objectId) => {
        delete objects[objectId];
      });
      return {
        objects,
        objectOrder: state.objectOrder.filter((objectId) => !cascadeIds.has(objectId)),
        selectedIds: state.selectedIds.filter((objectId) => !cascadeIds.has(objectId)),
      };
    });
  },

  selectObject(id) {
    set({ selectedIds: id ? [id] : [] });
  },

  selectMultiple(ids) {
    set({ selectedIds: ids });
  },

  clearSelection() {
    set({ selectedIds: [] });
  },

  findTopObjectAt(point, toleranceMm = 20) {
    const { objects, objectOrder, layers } = get();
    const ordered = [...objectOrder]
      .map((id) => objects[id])
      .filter((object) => object && object.visible !== false && layers[object.category]?.visible !== false)
      .reverse();

    return ordered.find((object) => hitTestObject(object, point, toleranceMm)) || null;
  },

  setView(view) {
    set({ view });
  },

  toggleLayerVisibility(layerName) {
    set((state) => ({
      layers: {
        ...state.layers,
        [layerName]: {
          ...state.layers[layerName],
          visible: !state.layers[layerName].visible,
        },
      },
    }));
  },
}));
