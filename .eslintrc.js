const { getConfiguration } = require("@eng-automation/js-style/src/eslint/configuration");

module.exports = getConfiguration({ typescript: { rootDir: __dirname } });
