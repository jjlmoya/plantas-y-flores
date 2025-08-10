import { defineCollection, z } from 'astro:content';

const plants = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.number(),
    title: z.string(),
    date: z.string(),
    excerpt: z.string(),
    featured_image: z.string().nullable(),
    categories: z.array(z.object({
      slug: z.string(),
      name: z.string()
    })),
    tags: z.array(z.object({
      slug: z.string(),
      name: z.string()
    })).default([]),
    seo_html: z.string()
  }),
});

const categories = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    description: z.string().optional(),
    posts_count: z.number()
  }),
});

export const collections = { plants, categories };