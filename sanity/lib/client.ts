import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../appfororders/env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});
