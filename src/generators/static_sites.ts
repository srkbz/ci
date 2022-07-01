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
  {
    host: "osoondo.com",
    repo: "https://github.com/sirikon/osoondo.com.git",
    output: "dist",
  },
];

export const staticSitesGenerator = (): Pipeline[] => {
  return config.map((site) => ({
    team: "static-sites",
    name: site.host.replace(/\./g, "-"),
    resources: [
      {
        name: "repo",
        icon: "git",
        type: "git",
        source: {
          uri: site.repo,
          branch: "master",
        },
      },
    ],
    jobs: [
      {
        name: "build",
        public: true,
        plan: [
          {
            get: "repo",
            trigger: true,
          },
          {
            task: "build",
            config: {
              platform: "linux",
              image_resource: {
                type: "registry-image",
                source: site.node
                  ? {
                    repository: "node",
                    tag: `${site.node}-bullseye`,
                  }
                  : {
                    repository: "debian",
                    tag: "bullseye",
                  },
              },
              inputs: [
                {
                  name: "repo",
                },
              ],
              run: {
                path: "bash",
                args: [
                  "-c",
                  [
                    "set -euo pipefail",
                    "",
                    "# Enter repo",
                    "cd repo",
                    "",
                    ...(site.build
                      ? [
                        "# Build steps",
                        ...site.build,
                        "",
                      ]
                      : []),
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
