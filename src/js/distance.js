export const getDistanceFromCenter = (entity, distance) => {
  const { x, y, z } = entity.position;

  const xDistance = (1 - (x / (distance + 2)) * (x > 0 ? 1 : -1)) / 1.8;
  const zDistance = (1 - (z / (distance + 2)) * (z > 0 ? 1 : -1)) / 1.8;

  return Math.min(xDistance, zDistance);
};
