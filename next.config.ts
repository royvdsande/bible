import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // OPENAI_API_KEY is accessed via process.env in server-side route handlers only.
  // Never expose it via `env` (which would leak it to the client bundle).
};

export default nextConfig;
