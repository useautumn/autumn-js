import { z } from "zod/v4";

export const CreateEntityParamsSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  featureId: z.string(),
});

export type CreateEntityParams = z.infer<typeof CreateEntityParamsSchema>;

export const GetEntityParamsSchema = z.object({
  expand: z.array(z.string()).optional(),
});

export type GetEntityParams = z.infer<typeof GetEntityParamsSchema>;

export const EntityDataParamsSchema = z.object({
  name: z.string().optional(),
  featureId: z.string(),
});

export type EntityDataParams = z.infer<typeof EntityDataParamsSchema>;