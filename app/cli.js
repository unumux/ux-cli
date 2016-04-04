#!/usr/bin/env node
console.time("start");
import meow from "meow";

import * as debug from "@unumux/ux-debug";

import main from "./main";

const cli = meow(`
    Usage
    $ ux
`, {
    alias: {
        d: ["debug", "verbose"],
        reconfigure: ["reconfig", "configure", "config"],
        v: ["version"],
        h: ["help"]
    }
});

// enabled debug mode if debug or verbose arg set
if(cli.flags.debug) {
    debug.enable();
}

main(cli.input[0], cli.flags);
