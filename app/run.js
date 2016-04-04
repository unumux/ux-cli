import Liftoff from "liftoff";


function run(moduleName) {
    const ux = new Liftoff({
        name: "ux",
        moduleName: moduleName,
        configName: "ux",
        extensions: {
            ".json": null
        }
    });

    ux.launch({}, function(env) {
        if(!env.configPath) {
            process.send({ msg: "NO_PROJECT" });
            return;
        }

        if(!env.modulePath) {
            if(moduleName !== "@unumux/ui-framework") {
                // couldn't find ux-build-tools, try ui-framework
                return run("@unumux/ui-framework");
            }
        }

        if(env.modulePackage && env.modulePackage.keywords && env.modulePackage.keywords.indexOf("ux-cli-adapter") >= 0) {
            const adapter = require(env.modulePath);
            process.send({ msg: "ADAPTER_STARTED" });
            process.once("message", function(msg) {
                switch(msg.cmd) {
                case "START":
                    adapter.start(msg.task || "default");
                    break;
                }
            });
        } else if(env.modulePath) {
            const adapter = require("./lib/legacy-adapter.js");
            process.send({ msg: "ADAPTER_STARTED" });
            process.once("message", function(msg) {
                switch(msg.cmd) {
                case "START":
                    adapter.start(env.modulePath, msg.task || "default");
                    break;
                }
            });
        } else {
            process.send({ msg: "NO_PROJECT" });
            return;
        }
    });
}

run("@unumux/ux-build-tools");
