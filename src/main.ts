import YAML from "yaml";
import { staticSitesGenerator } from "./generators/static_sites.ts";
import { dirname, join } from "std/path/mod.ts";
import { emptyDir, ensureDir } from "std/fs/mod.ts";

const pipelines = [
  ...staticSitesGenerator(),
];

const textEncoder = new TextEncoder();
await emptyDir(join(".", "pipelines", "generated"));
for (const pipeline of pipelines) {
  const pipelinePath = join(
    ".",
    "pipelines",
    "generated",
    pipeline.team,
    pipeline.name + ".yml",
  );

  await ensureDir(dirname(pipelinePath));
  console.log("Writing:", pipelinePath);
  await Deno.writeFile(
    pipelinePath,
    textEncoder.encode(YAML.stringify({
      resources: pipeline.resources,
      jobs: pipeline.jobs,
    })),
  );
}
