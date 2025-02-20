export function PluginManager() {
  const plugins = []

  return {
    register(plugin) {
      if (plugins.indexOf(plugin) > -1) {
        return
      }

      plugins.push(plugin)
    },
    ready(seele) {
      for (let i = 0; i < plugins.length; i++) {
        const plugin = plugins[i]

        plugin(seele)
      }
    },
    release() {
      plugins.length = 0
    },
  }
}
