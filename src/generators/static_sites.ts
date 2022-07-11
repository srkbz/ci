import {
  dockerImageConfig,
  gitResource,
  runBashScript,
} from "../core/helpers.ts";
import { Pipeline, TaskStep } from "../core/models.ts";

type Site = {
  host: string;
  repo: string;
  node?: string;
  build?: string[];
  output: string;
};

const config: Site[] = [
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
      "cd web",
      "yarn",
      "yarn build",
    ],
    output: "web/dist",
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
      gitResource("repo", site.repo),
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
          buildTask(site),
          deployTask(site),
        ],
      },
    ],
  }));
};

const buildTask = (site: Site): TaskStep => {
  return {
    task: "build",
    config: {
      ...(site.node
        ? dockerImageConfig("node", `${site.node}-bullseye`)
        : dockerImageConfig("debian", "bullseye")),
      inputs: [{ name: "repo" }],
      outputs: [{ name: "payload" }],
      run: runBashScript([
        ...(site.build
          ? [
            "# Enter repo",
            "ROOT=$(pwd)",
            "cd repo",
            "",
            "# Build steps",
            ...site.build,
            "",
            'cd "${ROOT}"',
            "",
          ]
          : []),
        "# Copy payload",
        `cp -r repo/${site.output}/* ./payload`,
        "",
      ]),
    },
  };
};

const deployTask = (site: Site): TaskStep => {
  return {
    task: "deploy",
    config: {
      ...dockerImageConfig("debian", "bullseye"),
      inputs: [{ name: "payload" }],
      params: {
        DEPLOY_KEY: `((${
          site.host.replace(/\./g, "_").toUpperCase()
        }_DEPLOY_KEY))`,
      },
      run: runBashScript([
        "apt-get update && apt-get upgrade -y && apt-get install -y curl",
        "",
        `(cd "payload" && tar -czvf ../payload.tar.gz ./*)`,
        `curl --fail -LF payload=@payload.tar.gz "https://staticsites.srk.bz/${site.host}/$DEPLOY_KEY"`,
        "",
      ]),
    },
  };
};
