module.exports = {
  apps: [
    {
      name: 'ArenaticketsWidget',
      port: '3003',
      exec_mode: 'cluster',
      instances: '4',
      script: './.output/server/index.mjs'
    }
  ]
}
