import {
  Hand,
  MousePointer2,
  MoveVertical,
  PenLine,
  PencilRuler,
  RectangleHorizontal,
  Rows3,
  Spline,
  SquareStack,
  TextCursorInput,
  Waypoints,
} from "lucide-react";
import { TOOLS } from "../constants/toolModes.js";
import { useToolStore } from "../store/useToolStore.js";

const GROUPS = [
  {
    label: "Navigation",
    items: [
      { tool: TOOLS.SELECT, icon: MousePointer2, label: "Select", hint: "Echap" },
      { tool: TOOLS.PAN, icon: Hand, label: "Pan", hint: "Espace" },
    ],
  },
  {
    label: "Structure",
    items: [{ tool: TOOLS.WALL, icon: SquareStack, label: "Mur", hint: "W" }],
  },
  {
    label: "Geometrie",
    items: [
      { tool: TOOLS.LINE, icon: PenLine, label: "Ligne", hint: "L" },
      { tool: TOOLS.RECTANGLE, icon: RectangleHorizontal, label: "Rect", hint: "R" },
      { tool: TOOLS.POLYLINE, icon: Spline, label: "Poly", hint: "P" },
    ],
  },
  {
    label: "Armature",
    items: [
      { tool: TOOLS.REBAR, icon: PencilRuler, label: "Barre", hint: "B" },
      { tool: TOOLS.REBAR_SERIES, icon: Rows3, label: "Serie", hint: "S" },
      { tool: TOOLS.REBAR_LAYER, icon: Waypoints, label: "Nappe", hint: "N" },
      { tool: TOOLS.DOWEL, icon: MoveVertical, label: "Goujon", hint: "D" },
    ],
  },
  {
    label: "Annotation",
    items: [{ tool: TOOLS.ANNOTATE, icon: TextCursorInput, label: "Note", hint: "A", disabled: true }],
  },
];

export default function Toolbar() {
  const { activeTool, setTool } = useToolStore();

  return (
    <aside className="toolbar">
      {GROUPS.map((group) => (
        <div key={group.label} className="toolbar-group">
          <p>{group.label}</p>
          {group.items.map(({ tool, icon: Icon, label, hint, disabled }) => (
            <button
              key={tool}
              type="button"
              className={`tool-icon-button ${activeTool === tool ? "active" : ""}`}
              onClick={() => !disabled && setTool(tool)}
              disabled={disabled}
              title={`${label} ${hint}`}
            >
              <Icon size={18} />
              <span>{label}</span>
              <small>{hint}</small>
            </button>
          ))}
        </div>
      ))}
    </aside>
  );
}
