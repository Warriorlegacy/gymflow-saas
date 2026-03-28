const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// Find the project and workspace roots
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

// 3. Force Metro to resolve from node_modules first, and then workspaces
config.resolver.disableHierarchicalLookup = true;

// 4. Important for Expo 52: ensure metro-runtime and others are found
config.resolver.sourceExts = [...config.resolver.sourceExts, "mjs", "cjs"];

// 5. Resolve monorepo packages properly
config.resolver.unstable_enablePackageExports = false;

// 6. Ensure proper resolution for expo-modules and workspace packages
config.resolver.unstable_conditionNames = ["require", "node", "import"];

// 7. Explicitly include workspace packages in the bundle
config.resolver.extraNodeModules = {
  "@gymflow/lib": path.resolve(workspaceRoot, "packages/lib"),
  "@gymflow/services": path.resolve(workspaceRoot, "packages/services"),
};

// 8. Add explicit paths to workspace packages for bundler
config.resolver.blockList = [];

// 9. Ensure workspace packages are discovered
config.resolver.assetExts = [...config.resolver.assetExts, "db", "sqlite"];

module.exports = config;
