const entryPoint = process.argv[2];
require("esbuild").build({
    entryPoints: ["ts-port/" + entryPoint + ".ts"],
    outfile: "ts-port/dest/" + entryPoint + ".js",
    bundle: true,
    minify: false,
    watch: {
        onRebuild(error, result) {
            if (error) {
                console.clear();
                console.error(new Date(Date.now()) + ": watch build failed:", error);
            }
            else {
                console.clear();
                console.log(new Date(Date.now()) + ": watch build succeeded:", result);
            }
        },
    },
    target: ["chrome60", "firefox60", "safari11", "edge20"],
    sourcesContent: true,
    sourcemap: "inline",
    external: ["fs"],
}).then(() => {
    console.clear();
    console.log("watching for changes in " + entryPoint + "...");
}).catch(() => {
    process.exit(1);
});
//# sourceMappingURL=esbuild.config.watch.js.map