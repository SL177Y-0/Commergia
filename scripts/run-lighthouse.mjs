import { spawn } from "node:child_process";
import { chromium } from "playwright";

const chromePath = process.env.CHROME_PATH || chromium.executablePath();
const child = spawn("npx lhci autorun --config=.lighthouserc.json", {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    CHROME_PATH: chromePath,
  },
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});

child.on("error", (error) => {
  console.error(error);
  process.exit(1);
});
