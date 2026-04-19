import { OBJECT_TYPES } from "../constants/objectTypes.js";
import { BARS } from "../constants/csaData.js";
import { computeSeriesPositions } from "./seriesCalc.js";

export function distance(a, b) {
  return Math.hypot((b.x_mm ?? b.x) - (a.x_mm ?? a.x), (b.y_mm ?? b.y) - (a.y_mm ?? a.y));
}

export function projectPointOnSegment(point, segment) {
  const { x1_mm, y1_mm, x2_mm, y2_mm } = segment;
  const dx = x2_mm - x1_mm;
  const dy = y2_mm - y1_mm;
  const lengthSq = dx * dx + dy * dy;
  if (!lengthSq) return { x_mm: x1_mm, y_mm: y1_mm };
  const t = Math.max(
    0,
    Math.min(1, ((point.x_mm - x1_mm) * dx + (point.y_mm - y1_mm) * dy) / lengthSq),
  );
  return {
    x_mm: x1_mm + dx * t,
    y_mm: y1_mm + dy * t,
  };
}

export function bboxFromPoints(points) {
  const xs = points.map((point) => point.x_mm);
  const ys = points.map((point) => point.y_mm);
  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys),
  };
}

export function getObjectSegments(object) {
  if (!object) return [];
  const { geometry, type } = object;

  if (type === OBJECT_TYPES.LINE || type === OBJECT_TYPES.REBAR || type === OBJECT_TYPES.DOWEL) {
    return [geometry];
  }

  if (type === OBJECT_TYPES.REBAR_SERIES) {
    return computeSeriesPositions(object);
  }

  if (type === OBJECT_TYPES.POLYLINE) {
    return geometry.points.slice(1).map((point, index) => ({
      x1_mm: geometry.points[index].x_mm,
      y1_mm: geometry.points[index].y_mm,
      x2_mm: point.x_mm,
      y2_mm: point.y_mm,
    }));
  }

  if (type === OBJECT_TYPES.RECTANGLE || type === OBJECT_TYPES.WALL || type === OBJECT_TYPES.FOOTING || type === OBJECT_TYPES.SLAB || type === OBJECT_TYPES.SOIL) {
    const x = geometry.x_mm;
    const y = geometry.y_mm;
    const width = geometry.width_mm;
    const height = geometry.height_mm;
    return [
      { x1_mm: x, y1_mm: y, x2_mm: x + width, y2_mm: y },
      { x1_mm: x + width, y1_mm: y, x2_mm: x + width, y2_mm: y + height },
      { x1_mm: x + width, y1_mm: y + height, x2_mm: x, y2_mm: y + height },
      { x1_mm: x, y1_mm: y + height, x2_mm: x, y2_mm: y },
    ];
  }

  if (type === OBJECT_TYPES.REF_LEVEL) {
    return [
      {
        x1_mm: geometry.x_start_mm,
        y1_mm: geometry.y_mm,
        x2_mm: geometry.x_end_mm,
        y2_mm: geometry.y_mm,
      },
    ];
  }

  if (type === OBJECT_TYPES.ANNOTATION) {
    const leaderPoints = geometry.leaderPoints || [];
    const segments = leaderPoints.slice(1).map((point, index) => ({
      x1_mm: leaderPoints[index].x,
      y1_mm: leaderPoints[index].y,
      x2_mm: point.x,
      y2_mm: point.y,
    }));
    if (leaderPoints.length) {
      segments.push({
        x1_mm: leaderPoints.at(-1).x,
        y1_mm: leaderPoints.at(-1).y,
        x2_mm: geometry.x_mm,
        y2_mm: geometry.y_mm,
      });
    }
    return segments;
  }

  return [];
}

export function getObjectEndpoints(object) {
  return getObjectSegments(object).flatMap((segment) => [
    { x_mm: segment.x1_mm, y_mm: segment.y1_mm },
    { x_mm: segment.x2_mm, y_mm: segment.y2_mm },
  ]);
}

export function getObjectMidpoints(object) {
  return getObjectSegments(object).map((segment) => ({
    x_mm: (segment.x1_mm + segment.x2_mm) / 2,
    y_mm: (segment.y1_mm + segment.y2_mm) / 2,
  }));
}

export function getWallFaces(object) {
  return object?.type === OBJECT_TYPES.WALL ? getObjectSegments(object) : [];
}

export function getObjectCenter(object) {
  if (!object) return { x_mm: 0, y_mm: 0 };

  if (object.type === OBJECT_TYPES.REBAR || object.type === OBJECT_TYPES.LINE || object.type === OBJECT_TYPES.DOWEL) {
    return {
      x_mm: (object.geometry.x1_mm + object.geometry.x2_mm) / 2,
      y_mm: (object.geometry.y1_mm + object.geometry.y2_mm) / 2,
    };
  }

  if (object.type === OBJECT_TYPES.REBAR_SERIES) {
    if (object.geometry.direction === "vertical") {
      return {
        x_mm: object.geometry.x_mm,
        y_mm: object.geometry.y_start_mm + (object.properties.actualSpacing_mm * Math.max(0, object.properties.actualCount - 1)) / 2,
      };
    }

    return {
      x_mm: object.geometry.x_start_mm + (object.properties.actualSpacing_mm * Math.max(0, object.properties.actualCount - 1)) / 2,
      y_mm: object.geometry.y_mm,
    };
  }

  if (object.geometry?.width_mm != null && object.geometry?.height_mm != null) {
    return {
      x_mm: object.geometry.x_mm + object.geometry.width_mm / 2,
      y_mm: object.geometry.y_mm + object.geometry.height_mm / 2,
    };
  }

  if (object.type === OBJECT_TYPES.ANNOTATION) {
    return {
      x_mm: object.geometry.x_mm,
      y_mm: object.geometry.y_mm,
    };
  }

  if (object.type === OBJECT_TYPES.REF_LEVEL) {
    return {
      x_mm: (object.geometry.x_start_mm + object.geometry.x_end_mm) / 2,
      y_mm: object.geometry.y_mm,
    };
  }

  return { x_mm: 0, y_mm: 0 };
}

export function hitTestObject(object, point, toleranceMm = 20) {
  if (!object?.visible) return false;

  if (object.type === OBJECT_TYPES.ANNOTATION) {
    const { x_mm, y_mm, leaderPoints = [] } = object.geometry;
    const lines = String(object.properties?.text || "").split("\n").filter(Boolean);
    const longest = lines.reduce((max, line) => Math.max(max, line.length), 0);
    const textWidthMm = longest * Math.max(toleranceMm * 0.8, 6);
    const textHeightMm = Math.max(lines.length, 1) * Math.max(toleranceMm * 0.9, 10);
    const inTextBox =
      point.x_mm >= x_mm - toleranceMm &&
      point.x_mm <= x_mm + textWidthMm &&
      point.y_mm <= y_mm + toleranceMm &&
      point.y_mm >= y_mm - textHeightMm;

    if (inTextBox || distance(point, { x_mm, y_mm }) <= toleranceMm * 1.6) {
      return true;
    }

    const leaderHit = leaderPoints.some((leaderPoint) => distance(point, { x_mm: leaderPoint.x, y_mm: leaderPoint.y }) <= toleranceMm);
    if (leaderHit) return true;

    return getObjectSegments(object).some((segment) => {
      const projected = projectPointOnSegment(point, segment);
      return distance(point, projected) <= toleranceMm;
    });
  }

  if (object.geometry?.width_mm != null && object.geometry?.height_mm != null) {
    const x = object.geometry.x_mm;
    const y = object.geometry.y_mm;
    const { width_mm, height_mm } = object.geometry;
    return (
      point.x_mm >= x - toleranceMm &&
      point.x_mm <= x + width_mm + toleranceMm &&
      point.y_mm >= y - toleranceMm &&
      point.y_mm <= y + height_mm + toleranceMm
    );
  }

  return getObjectSegments(object).some((segment) => {
    const projected = projectPointOnSegment(point, segment);
    return distance(point, projected) <= toleranceMm;
  });
}

export function getWorldBounds(objects) {
  const allPoints = Object.values(objects)
    .flatMap((object) => getObjectEndpoints(object))
    .filter(Boolean);

  if (!allPoints.length) {
    return { minX: -500, minY: -500, maxX: 2500, maxY: 3500 };
  }

  return bboxFromPoints(allPoints);
}

export function translateSegmentGeometry(geometry, dx, dy) {
  return {
    ...geometry,
    x1_mm: geometry.x1_mm + dx,
    y1_mm: geometry.y1_mm + dy,
    x2_mm: geometry.x2_mm + dx,
    y2_mm: geometry.y2_mm + dy,
  };
}

export function translateObjectGeometry(object, dx, dy) {
  if (!object) return object;

  if (object.type === OBJECT_TYPES.LINE || object.type === OBJECT_TYPES.REBAR || object.type === OBJECT_TYPES.DOWEL) {
    return { ...object, geometry: translateSegmentGeometry(object.geometry, dx, dy) };
  }

  if (object.type === OBJECT_TYPES.REBAR_SERIES) {
    if (object.geometry.direction === "vertical") {
      return {
        ...object,
        geometry: {
          ...object.geometry,
          x_mm: object.geometry.x_mm + dx,
          y_start_mm: object.geometry.y_start_mm + dy,
          y_end_mm: object.geometry.y_end_mm + dy,
        },
      };
    }

    return {
      ...object,
      geometry: {
        ...object.geometry,
        x_start_mm: object.geometry.x_start_mm + dx,
        x_end_mm: object.geometry.x_end_mm + dx,
        y_mm: object.geometry.y_mm + dy,
      },
    };
  }

  if (object.type === OBJECT_TYPES.POLYLINE) {
    return {
      ...object,
      geometry: {
        ...object.geometry,
        points: object.geometry.points.map((point) => ({
          x_mm: point.x_mm + dx,
          y_mm: point.y_mm + dy,
        })),
      },
    };
  }

  if (object.type === OBJECT_TYPES.ANNOTATION) {
    return {
      ...object,
      geometry: {
        ...object.geometry,
        x_mm: object.geometry.x_mm + dx,
        y_mm: object.geometry.y_mm + dy,
        leaderPoints: (object.geometry.leaderPoints || []).map((point) => ({
          x: point.x + dx,
          y: point.y + dy,
        })),
      },
    };
  }

  if (object.type === OBJECT_TYPES.REF_LEVEL) {
    return {
      ...object,
      geometry: {
        ...object.geometry,
        x_start_mm: object.geometry.x_start_mm + dx,
        x_end_mm: object.geometry.x_end_mm + dx,
        y_mm: object.geometry.y_mm + dy,
      },
    };
  }

  if (object.geometry?.x_mm != null && object.geometry?.y_mm != null) {
    return {
      ...object,
      geometry: {
        ...object.geometry,
        x_mm: object.geometry.x_mm + dx,
        y_mm: object.geometry.y_mm + dy,
      },
    };
  }

  return object;
}

export function inferRebarRole(geometry) {
  return Math.abs(geometry.x2_mm - geometry.x1_mm) < Math.abs(geometry.y2_mm - geometry.y1_mm)
    ? "vertical"
    : "horizontal";
}

export function getBarDbMm(diameter) {
  return BARS[diameter]?.db ?? 16;
}
