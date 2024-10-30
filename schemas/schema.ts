// schemas/schema.ts
import { SchemaTypeDefinition } from "sanity";

export const schema: SchemaTypeDefinition[] = [
  {
    name: "product",
    type: "document",
    title: "Product",
    fields: [
      {
        name: "name",
        type: "string",
        title: "Product Name",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "store",
        type: "string",
        title: "Store",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "category",
        type: "string",
        title: "Category",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "description",
        type: "text",
        title: "Description",
        validation: (Rule) => Rule.max(500),
      },
      {
        name: "orderLink",
        type: "url",
        title: "Order Link",
        validation: (Rule) =>
          Rule.uri({ scheme: ["http", "https"] }).required(),
      },
    ],
  },
];
