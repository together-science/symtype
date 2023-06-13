const entryPoint = process.argv[2];
const isDev = (process.argv.indexOf("--dev") > -1);
const date = new Date().toString();
require("esbuild").build({
    entryPoints: ["ts-port/" + entryPoint + ".ts"],
    outfile: "ts-port/dest/" + entryPoint + ".js",
    bundle: true,
    minify: !isDev,
    watch: false,
    define: { "BUILD_DATE": JSON.stringify(date) },
    target: ["chrome60", "firefox60", "safari11", "edge20"],
    sourcesContent: isDev,
    sourcemap: (isDev) ? "inline" : true,
}).then(() => {
    console.log("completed building " + entryPoint + ".");
}).catch(() => {
    process.exit(1);
});
//# sourceMappingURL=esbuild.config.js.map