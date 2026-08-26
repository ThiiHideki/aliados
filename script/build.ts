import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm } from "fs/promises";

const externals = ["bufferutil", "utf-8-validate"];

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  console.log("building server...");
  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });

  console.log("building vercel auth handlers...");
  await esbuild({
    entryPoints: [
      "server/auth/steam.ts",
      "server/auth/callback.ts",
      "server/auth/user.ts",
      "server/auth/logout.ts",
    ],
    platform: "node",
    bundle: true,
    format: "esm",
    outdir: "api/auth",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: false,
    external: externals,
    logLevel: "info",
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
