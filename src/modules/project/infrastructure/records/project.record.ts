import { Prisma } from '@/generated/prisma/client';

export type ProjectWithImagesRecord = Prisma.ProjectGetPayload<{
  include: { projectImages: true };
}>;
