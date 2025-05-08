import "zx/globals";
const __dirname = new URL('.', import.meta.url).pathname.replace(/\/+$/, "");

$.verbose = true;

const token = process.env.GH_PAT;
if(!token) {
  console.error(`No token found, please set env.GH_PAT`);
  process.exit(1);
}

cd(__dirname);

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

fs.writeFileSync(`${__dirname}/../crates/mdi/Cargo.toml`, target, "utf-8");

console.log(`generating new lib.rs`);
await $`npm run generate`;

console.log("committing changes to main");
await $`git config --local user.name "github-actions"`;
await $`git config --local user.email "ramiroaisen@noreply.users.github.com"`;
await $`git add .`;
await $`git commit -m "v${pkg.version}"`;
// await $`git push origin HEAD`;

const tag = `v${pkg.version}`.trim();
console.log(`creating new tag ${tag}`);
await $`git tag -f -a ${tag} -m ${tag}`;

// do not expose token
const log = $.log;
$.log = (entry) => {
  if(entry.kind === "cmd") {
    return;
  }

  log.call($, entry);
}

console.log(`pushing new tag ${tag}`);
console.log(`git push TOKEN@github.com/ramiroaisen/rust-material-design-icons.git ${tag}`);
const origin = `https://x-access-token:${token}@github.com/ramiroaisen/rust-material-design-icons.git`
await $`git push ${origin} ${tag}`;