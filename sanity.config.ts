import "./components/stl-render-react/latest/register";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { stlTableBlock } from "sanity-plugin-stl-table";
import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "sparklinelabs",
  title: "Sparkline Labs",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  basePath: "/studio",

  plugins: [structureTool(), visionTool()],

  schema: {
    types: [...schemaTypes, stlTableBlock],
  },
});
