function exportObject(object) {
  return {
    id: object.id,
    type: object.type,
    category: object.category,
    layer: object.layer,
    geometry: object.geometry,
    properties: object.properties,
    linkedAnnotations: object.linkedAnnotations || [],
    parentId: object.parentId ?? null,
    childIds: object.childIds || [],
  };
}

export function buildExportJSON(store) {
  const allObjects = Object.values(store.objects);
  const structural = allObjects.filter((object) => object.category !== "annotation");
  const annotations = allObjects.filter((object) => object.category === "annotation");

  const relations = [];
  structural.forEach((object) => {
    (object.linkedAnnotations || []).forEach((annotationId) => {
      const annotation = store.objects[annotationId];
      if (annotation) {
        relations.push({
          type: "annotation_link",
          sourceId: object.id,
          targetId: annotationId,
          autoUpdate: annotation.properties.autoUpdate,
        });
      }
    });
  });

  return {
    gbi_wall_detail: {
      metadata: {
        tool: "GBI Wall Detail Studio",
        version: "1.0",
        date: new Date().toISOString(),
        units: "mm",
        author: "",
        project: "",
      },
      origin: store.origin,
      objects: structural.map(exportObject),
      annotations: annotations.map(exportObject),
      relations,
    },
  };
}

export function getFilename(projectName) {
  const base = projectName?.trim() || "detail";
  return `${base}_armature.json`;
}
