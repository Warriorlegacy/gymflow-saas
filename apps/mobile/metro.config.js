const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// 3. Important for Expo 52: ensure metro-runtime and others are found
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  "mjs",
  "cjs",
  "ts",
  "tsx",
];

// 4. Add support for workspace packages
config.resolver.extraNodeModules = {
  "@gymflow/lib": path.resolve(workspaceRoot, "packages", "lib"),
  "@gymflow/services": path.resolve(workspaceRoot, "packages", "services"),
};

module.exports = config;
