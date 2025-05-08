import "zx/globals";
const __dirname = new URL('.', import.meta.url).pathname.replace(/\/+$/, "");

$.verbose = true;

cd(__dirname);

await $`npm ci`;

const prev_pkg = JSON.parse(fs.readFileSync(`${__dirname}/node_modules/@mdi/js/package.json`, "utf-8"));

await $`npm i @mdi/js@latest --save-exact`;

const pkg = JSON.parse(fs.readFileSync(`${__dirname}/node_modules/@mdi/js/package.json`, "utf-8"));

if(prev_pkg.version === pkg.version) {
  console.log(`No version change, exiting without changes`);
  process.exit(0);
}

console.log(`version change detected from ${prev_pkg.version} to ${pkg.version}`);

console.log(`updating Cargo.toml`);
const src = fs.readFileSync(`${__dirname}/../crates/mdi/Cargo.toml`, "utf-8");
const target = src.replace(
  /\# TEMPLATE_VERSION_START\n(.+)\n\# TEMPLATE_VERSION_END/,
  `# TEMPLATE_VERSION_START\nversion = "${pkg.version}"\n# TEMPLATE_VERSION_END`
);

if(src === target) {
  console.warn(`Error changing version in Cargo.toml`);
  console.warn(`\n${src}\n`);
  throw new Error(`Error changing version in Cargo.toml`);
};

console.log(`generating new lib.rs`);
await $`npm run generate`;

console.log("committing changes");
await $`git config --local user.name "github-actions"`;
await $`git config --local user.email "github-actions@github.com"`;
await $`git add .`;
await $`git commit -m "v${pkg.version}"`;
await $`git push origin HEAD`;