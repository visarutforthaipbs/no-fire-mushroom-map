import {
  FeatureCollection,
  Feature,
  GeoJsonProperties,
  Geometry,
} from "geojson";
import { convertFeatureCollectionToWGS84 } from "../utils/projectionUtils";

// Import the file path
import hedTobZonesPath from "./hed_tob_potential_zone.geojson";

// Create a proper feature collection with converted coordinates
const processHedTobZones = async (): Promise<FeatureCollection> => {
  try {
    console.log("Processing hed_tob_potential_zone.geojson");
    console.log("Fetching from path:", hedTobZonesPath);

    // Fetch the GeoJSON data
    const response = await fetch(hedTobZonesPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch GeoJSON: ${response.statusText}`);
    }

    const hedTobZonesData: FeatureCollection = await response.json();

    // Check if we have valid data
    if (
      !hedTobZonesData ||
      !hedTobZonesData.features ||
      !Array.isArray(hedTobZonesData.features)
    ) {
      console.error("Invalid hedTobZonesData:", hedTobZonesData);
      return { type: "FeatureCollection", features: [] } as FeatureCollection;
    }

    console.log(
      "hedTobZonesData:",
      JSON.stringify(hedTobZonesData).substring(0, 200) + "..."
    );
    console.log(
      "hedTobZonesData.features.length:",
      hedTobZonesData.features.length
    );
    console.log("First feature:", hedTobZonesData.features[0]);

    // First add the potential property based on DN value
    const rawHedTobZones = {
      ...hedTobZonesData,
      features: hedTobZonesData.features.map(
        (feature: Feature<Geometry, GeoJsonProperties>) => {
          // If the feature already has a potential property, use it
          if (feature.properties?.potential) {
            return feature;
          }

          // Otherwise, set potential based on DN value
          if (feature.properties && feature.properties.DN !== undefined) {
            const potential =
              feature.properties.DN === 1
                ? "high"
                : feature.properties.DN === 2
                ? "medium"
                : "low";

            return {
              ...feature,
              properties: {
                ...(feature.properties || {}),
                potential,
              },
            };
          }

          // Default to low if no DN property
          return {
            ...feature,
            properties: {
              ...(feature.properties || {}),
              potential: "low",
            },
          };
        }
      ),
    } as FeatureCollection;

    // Convert coordinates from UTM to WGS84
    console.log(
      `Converting ${rawHedTobZones.features.length} features to WGS84`
    );
    const result = convertFeatureCollectionToWGS84(rawHedTobZones);
    console.log(
      `Conversion complete. Result has ${result.features.length} features`
    );

    if (result.features.length > 0) {
      const firstFeature = result.features[0];
      console.log("First converted feature:", firstFeature);
      if (firstFeature.geometry?.type === "MultiPolygon") {
        console.log(
          "Sample coordinates:",
          JSON.stringify(firstFeature.geometry.coordinates[0][0].slice(0, 2))
        );
      }
    }

    return result;
  } catch (error) {
    console.error("Error processing hed_tob_zones:", error);
    return { type: "FeatureCollection", features: [] } as FeatureCollection;
  }
};

// We'll need to handle this differently since we're using async
// Create a placeholder initially
let hedTobZones: FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

// Start loading the data immediately
processHedTobZones()
  .then((data) => {
    hedTobZones = data;
    // Dispatch an event so components can know when data is loaded
    window.dispatchEvent(new CustomEvent("hedTobZonesLoaded"));
  })
  .catch((error) => {
    console.error("Failed to load mushroom zones data:", error);
  });

export default hedTobZones;
export { processHedTobZones };
