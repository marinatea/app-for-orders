import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schema } from './schemas/schema';

export default defineConfig({
  projectId: "pmpsddkp",
  dataset: "products",

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schema,
  },
});
