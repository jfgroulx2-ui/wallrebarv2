import { OBJECT_TYPES } from "../constants/objectTypes.js";
import { TOOLS } from "../constants/toolModes.js";
import { useDrawingStore } from "../store/useDrawingStore.js";
import { useToolStore } from "../store/useToolStore.js";
import { TEMPLATES, buildTemplateObjects } from "../utils/templateLibrary.js";

export default function TemplatePanel() {
  const addObject = useDrawingStore((state) => state.addObject);
  const addObjectWithAnnotation = useDrawingStore((state) => state.addObjectWithAnnotation);
  const selectObject = useDrawingStore((state) => state.selectObject);
  const objectCount = useDrawingStore((state) => state.objectOrder.length);
  const setTool = useToolStore((state) => state.setTool);

  const handleInsert = (template) => {
    const originX = objectCount * 120;
    const objects = buildTemplateObjects(template, originX, 0);
    let firstId = null;

    objects.forEach((object) => {
      const createdId =
        object.type === OBJECT_TYPES.REBAR || object.type === OBJECT_TYPES.REBAR_SERIES || object.type === OBJECT_TYPES.DOWEL
          ? addObjectWithAnnotation(object)
          : addObject(object);

      if (!firstId) firstId = createdId;
    });

    if (firstId) selectObject(firstId);
    setTool(TOOLS.SELECT);
  };

  return (
    <div className="panel-card">
      <div className="panel-title">
        <strong>Gabarits</strong>
        <span>Peupler vite une coupe</span>
      </div>

      <p className="muted">
        Inserer une base de mur preetablie, puis ajuster les objets et leurs annotations directement dans la vue.
      </p>

      <div className="stack">
        {TEMPLATES.map((template) => (
          <button key={template.id} type="button" className="tool-lite-button template-button" onClick={() => handleInsert(template)}>
            <span className="template-thumb">{template.thumb}</span>
            <span className="template-copy">
              <strong>{template.label}</strong>
              <small>{template.description}</small>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
