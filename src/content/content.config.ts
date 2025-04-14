import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  schema: z.object({
    author: z.string(),
    date: z.string(),
    image: z.string().optional(),
    title: z.string(),
  }),
});

export const collections = {
  posts,
};