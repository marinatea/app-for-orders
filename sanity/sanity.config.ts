import { defineConfig } from "sanity";
import { schema } from "./schemaTypes/schema";
import { deskTool } from "sanity/desk";
import { dataset, projectId } from "./appfororders/env";

export default defineConfig({
  projectId,
  dataset,
  title: "appfororders",
  plugins: [deskTool()],
  schema,
});
