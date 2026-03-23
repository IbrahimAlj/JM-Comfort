module.exports = {
  apps: [
    {
      name: 'jm-comfort',
      script: 'server/index.js',
      env_production: {
        NODE_ENV: 'production',
      },
      instances: 1,
      watch: false,
      max_memory_restart: '200M',
    },
  ],
};
