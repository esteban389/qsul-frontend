module.exports = {
  apps: [
    {
      name: "nextjs",
      script: "npm run",
      args: "start -p 3000",
      instances: "max",
      exec_mode: "cluster",
    },
  ],
};
