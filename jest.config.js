module.exports = {
  roots: ["./src"],
  preset: "ts-jest",
  testEnvironment: "node",
  transform: { "\\.(ts|js)x?$": ["ts-jest", { useESM: true }] },
  moduleNameMapper: { "^src/(.*)$": `${process.cwd()}/src/$1` },
};
