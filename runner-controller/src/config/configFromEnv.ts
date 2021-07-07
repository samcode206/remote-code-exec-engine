const configFromEnv = {
   redisHost: process.env.REDIS_HOST || "127.0.0.1",
   redisPort: Number(process.env.REDIS_PORT) || 6379,
   concurrentJobs: Number(process.env.CONCURRENT_JOBS || 4),
};


export default configFromEnv;