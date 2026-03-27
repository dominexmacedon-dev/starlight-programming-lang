define plugins = {}

func registerPlugin(name, fn) {
    plugins[name] = fn
}

func runPlugin(name, input) {
    if (!has(plugins, name)) {
        return "Plugin not found"
    }
    return plugins[name](input)
}

registerPlugin("uppercase", (text) => upper(text))
registerPlugin("reverse", (text) => reverseStr(text))
registerPlugin("exclaim", (text) => text + "!!!")

define input = "starlight"

define result1 = runPlugin("uppercase", input)
define result2 = runPlugin("reverse", input)
define result3 = runPlugin("exclaim", input)

sldeploy result1
sldeploy result2
sldeploy result3
