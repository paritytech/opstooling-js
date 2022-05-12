const path = require("path")

const conf = {
  rootDir: __dirname,
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: { "^(src)/(.*)": `${__dirname}/$1/$2` },
  testRegex: `^${__dirname}/src/.*\\.spec\\.ts$`.split("/").join("\\/"),
  globals: { "ts-jest": { tsconfig: path.join(__dirname, "tsconfig.json") } },
}

module.exports = conf
