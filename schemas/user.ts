// schemas/user.ts
import { SchemaTypeDefinition } from "sanity";

export const user: SchemaTypeDefinition = {
  name: "user",
  type: "document",
  title: "User",
  fields: [
    {
      name: "userId",
      title: "User ID",
      type: "string",
    },
    {
      name: "userName",
      title: "User Name",
      type: "string",
    },
    {
      name: "role",
      title: "Role",
      type: "string",
      options: {
        list: [
          { title: "User", value: "user" },
          { title: "Admin", value: "admin" },
        ],
      },
    },
  ],
};
