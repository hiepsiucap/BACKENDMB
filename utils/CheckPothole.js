/** @format */

function isPointOnLineWithTolerance({
  latitude1,
  longitude1,
  latitude2,
  longitude2,
  latitude3,
  longitude3,
  tolerance = 0.00001,
}) {
  const numerator = Math.abs(
    (longitude2 - longitude1) * latitude3 -
      (latitude2 - latitude1) * longitude3 +
      latitude2 * longitude1 -
      longitude2 * latitude1
  );
  const denominator = Math.sqrt(
    (longitude2 - longitude1) ** 2 + (latitude2 - latitude1) ** 2
  );
  const distance = numerator / (denominator || 1);
  return distance <= tolerance;
}

module.exports = isPointOnLineWithTolerance;
