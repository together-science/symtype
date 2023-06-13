// argv[0] is the node executable, argv[1] is the script file.
const entryPoint = process.argv[2];
const isDev = (process.argv.indexOf("--dev") > -1);

const date = new Date().toString();
// const user = require("os").userInfo().username;

require("esbuild").build({
    // the entry point file described above
    entryPoints: ["ts-port/" + entryPoint + ".ts"],
    // the build folder location described above
    outfile: "ts-port/dest/" + entryPoint + ".js",
    bundle: true,
    minify: !isDev,
    watch: false,
    define: {"BUILD_DATE": JSON.stringify(date /* + ", "+user*/)},
    // Replace with the browser versions you need to target
    target: ["chrome60", "firefox60", "safari11", "edge20"],
    // In dev mode, include sources in the source mapping; otherwise, do not.
    sourcesContent: isDev,
    sourcemap: (isDev) ? "inline" : true,
    // logLevel: "verbose",
}).then(() => {
    console.log("completed building "+entryPoint+".");
}).catch(() => {
    process.exit(1);
});
