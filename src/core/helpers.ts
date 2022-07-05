import { Resource, TaskStep } from "./models.ts";

export const gitResource = (
  name: string,
  uri: string,
  branch?: string,
): Resource => {
  return {
    name,
    icon: "git",
    type: "git",
    source: {
      uri,
      branch: branch || "master",
    },
  };
};

export const runBashScript = (script: string[]): TaskStep["config"]["run"] => {
  return {
    path: "bash",
    args: [
      "-c",
      [
        "set -euo pipefail",
        "",
        ...script,
      ].join("\n"),
    ],
  };
};

export const dockerImageConfig = (
  repository: string,
  tag?: string,
): Pick<TaskStep["config"], "platform" | "image_resource"> => {
  return {
    platform: "linux",
    image_resource: {
      type: "registry-image",
      source: { repository, tag },
    },
  };
};
