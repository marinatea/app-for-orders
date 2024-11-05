import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { product } from "./schemas/product";
import { user } from "./schemas/user";

export default defineConfig({
  projectId: "pmpsddkp",
  dataset: "products",

  plugins: [deskTool(), visionTool()],

  schema: {
    types: [product, user],
  },
});
