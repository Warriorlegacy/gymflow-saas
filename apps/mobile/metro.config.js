const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// Node modules resolution paths
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// Force Metro to resolve from node_modules first
config.resolver.disableHierarchicalLookup = true;

// Ensure metro-runtime and others are found
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  "mjs",
  "cjs",
  "ts",
  "tsx",
];

// Fix for monorepo packages - ensure they resolve correctly
config.resolver.extraNodeModules = {
  "@gymflow/lib": path.resolve(workspaceRoot, "packages", "lib"),
  "@gymflow/services": path.resolve(workspaceRoot, "packages", "services"),
};

// Add custom resolver for workspace packages
const { resolveRequest } = config.resolver;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Handle workspace packages
  if (moduleName.startsWith("@gymflow/")) {
    const packageName = moduleName.replace("@gymflow/", "");
    const pkgPath = path.resolve(workspaceRoot, "packages", packageName);

    // Return the path to the package's src directory for Metro to resolve
    return {
      filePath: path.join(pkgPath, "src/index.ts"),
    };
  }

  // Default behavior for other modules
  if (resolveRequest) {
    return resolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
