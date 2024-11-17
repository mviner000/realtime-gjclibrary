import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_API_URL: z.string(),
    NEXT_PUBLIC_WS_URL: z.string(),
    NEXT_PUBLIC_FRONTEND_URL: z.string(),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string(),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_KEY: z.string(),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_API_SECRET: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL!,
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL!,
    NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL!,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_KEY:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_KEY!,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_API_SECRET:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_API_SECRET!,
  },
});
