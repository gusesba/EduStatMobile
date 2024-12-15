module.exports = function (api) {
  api.cache(true);
  api.cache(true);
  return {
    presets: [["babel-preset-expo", {
      jsxImportSource: "nativewind"
    }], "nativewind/babel"],

    env: {
      production: {
        plugins: ['react-native-paper/babel', 'react-native-reanimated/plugin'],
      },
    },

    plugins: [["module-resolver", {
      root: ["./"],

      alias: {
        "@": "./",
        "tailwind.config": "./tailwind.config.js"
      }
    }]]
  };
};
