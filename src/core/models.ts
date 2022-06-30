export type Pipeline = {
  name: string;
  team: string;
  jobs: Job[];
};

export type Job = {
  name: string;
  public?: boolean;
  plan: Task[];
};

export type Task = {
  task: string;
  config: {
    platform: "linux";
    image_resource: {
      type: "registry-image";
      source: {
        repository: string;
        tag?: string;
      };
    };
    run: {
      path: string;
      args: string[];
    };
  };
};
