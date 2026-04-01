module.exports = {
  apps: [{
    name: "pievra-news",
    script: "node_modules/.bin/next",
    args: "start -p 3003",
    cwd: "/var/www/pievra-news",
    env: {
      NODE_ENV: "production",
      PORT: 3003,
    },
    instances: 1,
    autorestart: true,
    max_memory_restart: "512M",
  }],
};
