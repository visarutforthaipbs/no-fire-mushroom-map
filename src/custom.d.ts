declare module "*.geojson" {
  const value: string; // This will be the path to the file after webpack processes it
  export default value;
}
