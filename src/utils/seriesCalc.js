export function computeSeriesCount(lengthMm, spacingMm) {
  if (!spacingMm || spacingMm <= 0) return 1;
  return Math.floor(Math.abs(lengthMm) / spacingMm) + 1;
}

export function computeSeriesSpacing(lengthMm, count) {
  if (!count || count <= 1) return Math.abs(lengthMm);
  return Math.abs(lengthMm) / (count - 1);
}

export function normalizeSeriesProperties(lengthMm, spacingMm, count) {
  if (count && count > 1) {
    return {
      actualCount: count,
      actualSpacing_mm: Math.round(computeSeriesSpacing(lengthMm, count) * 10) / 10,
    };
  }

  const actualCount = computeSeriesCount(lengthMm, spacingMm);
  return {
    actualCount,
    actualSpacing_mm: spacingMm,
  };
}

export function computeSeriesPositions(seriesObject) {
  const { geometry, properties } = seriesObject;
  const vertical = geometry.direction === "vertical";
  const baseLength = vertical
    ? geometry.y_end_mm - geometry.y_start_mm
    : geometry.x_end_mm - geometry.x_start_mm;
  const { actualCount, actualSpacing_mm } = normalizeSeriesProperties(
    baseLength,
    properties.spacing_mm,
    properties.count || null,
  );

  return Array.from({ length: actualCount }, (_, index) => {
    if (vertical) {
      const y = geometry.y_start_mm + index * actualSpacing_mm;
      return {
        x1_mm: geometry.x_mm,
        y1_mm: y,
        x2_mm: geometry.x_mm,
        y2_mm: y + geometry.barLength_mm,
      };
    }

    const x = geometry.x_start_mm + index * actualSpacing_mm;
    return {
      x1_mm: x,
      y1_mm: geometry.y_mm,
      x2_mm: x + geometry.barLength_mm,
      y2_mm: geometry.y_mm,
    };
  });
}
