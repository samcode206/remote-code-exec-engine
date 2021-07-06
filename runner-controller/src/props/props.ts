export type OrchestratorAttrs = {
  queueName : string
  setting: QueueSettings
  concurrency: number;
};

export interface jobAttrs {
  code : string
  problem : string
  lang: string
};

export enum languages {
  javascript = "javascript",
  python = "python",
};
