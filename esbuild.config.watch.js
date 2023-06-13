// argv[0] is the node executable, argv[1] is the script file.
const entryPoint = process.argv[2];
require("esbuild").build({
    // the entry point file described above
    entryPoints: ["ts-port/" + entryPoint + ".ts"],
    // the build folder location described above
    outfile: "ts-port/dest/" + entryPoint + ".js",
    bundle: true,
    minify: false,
    watch: {
        onRebuild(error, result) {
            if (error) {
                console.clear();
                console.error(new Date(Date.now())+": watch build failed:", error);
            } else {
                console.clear();
                console.log(new Date(Date.now())+": watch build succeeded:", result);
            }
        },
    },
    // Replace with the browser versions you need to target
    target: ["chrome60", "firefox60", "safari11", "edge20"],
    // In dev mode, include sources in the source mapping; otherwise, do not.
    sourcesContent: true,
    sourcemap: "inline",
    external: ["fs"],
}).then(() => {
    console.clear();
    console.log("watching for changes in "+entryPoint+"...");
}).catch(() => {
    process.exit(1);
});
