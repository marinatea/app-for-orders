// schemas/product.ts
import { SchemaTypeDefinition } from "sanity";

export const product: SchemaTypeDefinition = {
  name: "product",
  type: "document",
  title: "Product",
  fields: [
    {
      name: "name",
      type: "string",
      title: "Product Name",
    },
    {
      name: "store",
      type: "string",
      title: "Store",
    },
    {
      name: "category",
      type: "string",
      title: "Category",
    },
    {
      name: "description",
      type: "text",
      title: "Description",
    },
    {
      name: "orderLink",
      type: "url",
      title: "Order Link",
    },
  ],
};
