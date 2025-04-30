import { FeatureCollection } from "geojson";
import { convertFeatureCollectionToWGS84 } from "../utils/projectionUtils";

// Import the GeoJSON data
import doisaketDistrictPath from "./doisaket-district.geojson";

// Create a proper feature collection with converted coordinates
const processDoisaketDistrict = async (): Promise<FeatureCollection> => {
  try {
    console.log("Processing doisaket-district.geojson");
    console.log("Fetching from path:", doisaketDistrictPath);

    // Fetch the GeoJSON data
    const response = await fetch(doisaketDistrictPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch GeoJSON: ${response.statusText}`);
    }

    const districtData: FeatureCollection = await response.json();

    // Check if we have valid data
    if (
      !districtData ||
      !districtData.features ||
      !Array.isArray(districtData.features)
    ) {
      console.error("Invalid district data:", districtData);
      return { type: "FeatureCollection", features: [] } as FeatureCollection;
    }

    // Log data information
    console.log("District features count:", districtData.features.length);

    if (districtData.features.length > 0) {
      console.log(
        "First district feature type:",
        districtData.features[0].geometry.type
      );
      // Log a sample of coordinates if available
      const geometry = districtData.features[0].geometry;
      if (
        geometry.type === "MultiPolygon" &&
        geometry.coordinates?.length > 0
      ) {
        console.log(
          "Sample coordinates:",
          JSON.stringify(geometry.coordinates[0][0].slice(0, 2))
        );
      }
    }

    // Convert coordinates if needed (district data should already be in WGS84 format)
    const result = convertFeatureCollectionToWGS84(districtData);
    console.log(
      `District conversion complete. Result has ${result.features.length} features`
    );

    return result;
  } catch (error) {
    console.error("Error processing district data:", error);
    return { type: "FeatureCollection", features: [] } as FeatureCollection;
  }
};

// Create a placeholder initially
let doisaketDistrict: FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

// Start loading the data immediately
processDoisaketDistrict()
  .then((data) => {
    doisaketDistrict = data;
    // Dispatch an event so components can know when data is loaded
    window.dispatchEvent(new CustomEvent("doisaketDistrictLoaded"));
  })
  .catch((error) => {
    console.error("Failed to load district data:", error);
  });

export default doisaketDistrict;
export { processDoisaketDistrict };
