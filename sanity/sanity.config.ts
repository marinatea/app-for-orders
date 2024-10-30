import { defineConfig } from "sanity";
import { schema } from "./schemaTypes/schema";
import { deskTool } from "sanity/desk";
import { dataset, projectId } from "./env";

export default defineConfig({
  projectId,
  dataset: "products",
  title: "appfororders",
  plugins: [deskTool()],
  schema,
});
