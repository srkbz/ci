export type Pipeline = {
  name: string;
  team: string;
  jobs: Job[];
  resources?: Resource[];
};

export type Resource = {
  name: string;
  icon?: string;
  type: "git";
  source: {
    uri: string;
    branch?: string;
    private_key?: string;
  };
};

export type Job = {
  name: string;
  public?: boolean;
  plan: (TaskStep | GetStep)[];
};

export type GetStep = {
  get: string;
  trigger: boolean;
};

export type TaskStep = {
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
    inputs?: {
      name: string;
    }[];
    run: {
      path: string;
      args: string[];
    };
  };
};
