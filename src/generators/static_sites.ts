import { Pipeline } from "../core/models.ts";

const config = [
  {
    host: "sirikon.me",
    repo: "https://github.com/sirikon/sirikon.me.git",
    node: "16.15.1",
    build: [
      "npm install",
      "npm run build",
    ],
    output: "dist",
  },
  {
    host: "astenagusia.eus",
    repo: "https://github.com/sirikon/astenagusia.git",
    node: "16.15.1",
    build: [
      "yarn",
      "yarn build",
    ],
    output: "src/web/dist",
  },
];

export const staticSitesGenerator = (): Pipeline[] => {
  return config.map((site) => ({
    team: "static-sites",
    name: site.host.replace(/\./g, "-"),
    jobs: [
      {
        name: "build",
        public: true,
        plan: [
          {
            task: "build",
            config: {
              platform: "linux",
              image_resource: {
                type: "registry-image",
                source: {
                  repository: "node",
                  tag: `${site.node}-bullseye`,
                },
              },
              run: {
                path: "bash",
                args: [
                  "-c",
                  [
                    "set -euo pipefail",
                    "",
                    "# Clone",
                    `git clone "${site.repo}" site`,
                    "cd site",
                    "",
                    "# Build steps",
                    ...site.build,
                    "",
                    `(cd "${site.output}" && find)`,
                  ].join("\n"),
                ],
              },
            },
          },
        ],
      },
    ],
  }));
};
