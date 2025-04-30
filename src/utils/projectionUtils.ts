import proj4 from "proj4";
import { FeatureCollection, Feature, Geometry, Position } from "geojson";

// Define the projections
// EPSG:32647 is UTM zone 47N (used in hed_tob_potential_zone.geojson)
proj4.defs("EPSG:32647", "+proj=utm +zone=47 +datum=WGS84 +units=m +no_defs");
// EPSG:4326 is standard WGS84 (lat/lon) - this is what Leaflet uses
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");

/**
 * Convert coordinates from UTM (EPSG:32647) to WGS84 (EPSG:4326)
 * @param coordinates UTM coordinates [easting, northing]
 * @returns WGS84 coordinates [longitude, latitude]
 */
export const convertUTMToWGS84 = (coordinates: Position): Position => {
  if (!coordinates || coordinates.length < 2) return coordinates;

  try {
    // proj4 expects [x, y] where x is easting (longitude) and y is northing (latitude)
    const result = proj4("EPSG:32647", "EPSG:4326", [
      coordinates[0],
      coordinates[1],
    ]);
    // Return result as [longitude, latitude]
    return result as Position;
  } catch (error) {
    console.error("Error converting coordinates:", coordinates, error);
    return coordinates;
  }
};

/**
 * Process nested coordinate arrays recursively
 */
const processCoordinates = (coords: any[]): any[] => {
  if (!coords || coords.length === 0) return coords;

  // Check if this is a position (a simple coordinate pair)
  if (typeof coords[0] === "number") {
    return convertUTMToWGS84(coords as Position);
  }

  // Otherwise, it's a nested array of coordinates
  return coords.map((c) => processCoordinates(c));
};

// Extended FeatureCollection type with CRS property
interface FeatureCollectionWithCRS extends FeatureCollection {
  crs?: {
    type: string;
    properties: {
      name: string;
    };
  };
}

/**
 * Convert a GeoJSON FeatureCollection from UTM (EPSG:32647) to WGS84 (EPSG:4326)
 */
export const convertFeatureCollectionToWGS84 = (
  geojson: FeatureCollection
): FeatureCollection => {
  // Return empty feature collection if input is invalid
  if (!geojson || !geojson.features || !Array.isArray(geojson.features)) {
    console.warn(
      "Invalid GeoJSON data provided to convertFeatureCollectionToWGS84"
    );
    return { type: "FeatureCollection", features: [] };
  }

  try {
    // Check if the data is already in WGS84 (CRS84) based on crs property
    const geojsonWithCRS = geojson as FeatureCollectionWithCRS;
    const crs = geojsonWithCRS.crs?.properties?.name;
    const isAlreadyWGS84 =
      crs &&
      (crs.includes("CRS84") || crs.includes("4326") || crs.includes("WGS84"));

    if (isAlreadyWGS84) {
      console.log("GeoJSON already in WGS84 format, skipping conversion");
      return geojson;
    }

    const convertedFeatures = geojson.features.map((feature: Feature) => {
      if (!feature.geometry) return feature;

      try {
        // Convert the coordinates based on geometry type
        return {
          ...feature,
          geometry: {
            ...feature.geometry,
            coordinates: processCoordinates(
              (feature.geometry as any).coordinates
            ),
          },
        };
      } catch (error) {
        console.error("Error converting feature:", error);
        return feature;
      }
    });

    return {
      ...geojson,
      features: convertedFeatures,
    };
  } catch (error) {
    console.error("Error in convertFeatureCollectionToWGS84:", error);
    return { type: "FeatureCollection", features: [] };
  }
};
