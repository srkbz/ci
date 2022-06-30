import { Pipeline } from "../core/models.ts";

export const exampleGenerator = (): Pipeline[] => {
  return [
    {
      team: "generatorz",
      name: "super-example",
      jobs: [
        {
          name: "super-job",
          plan: [
            {
              task: "super-task",
              config: {
                platform: "linux",
                image_resource: {
                  type: "registry-image",
                  source: {
                    repository: "busybox",
                  },
                },
                run: {
                  path: "echo",
                  args: ["Hello from the generatorzzz"],
                },
              },
            },
          ],
        },
      ],
    },
  ];
};
