import lodash from "lodash";
export declare const ld: lodash.LoDashStatic & {
    condense: typeof import("deepdash/es/condense").default;
    condenseDeep: typeof import("deepdash/es/condenseDeep").default;
    eachDeep: typeof import("deepdash/es/eachDeep").default;
    exists: typeof import("deepdash/es/exists").default;
    filterDeep: typeof import("deepdash/es/filterDeep").default;
    findDeep: typeof import("deepdash/es/findDeep").default;
    findPathDeep: typeof import("deepdash/es/findPathDeep").default;
    findValueDeep: typeof import("deepdash/es/findValueDeep").default;
    forEachDeep: typeof import("deepdash/es/eachDeep").default;
    index: typeof import("deepdash/es").default;
    keysDeep: typeof import("deepdash/es/paths").default;
    mapDeep: typeof import("deepdash/es/mapDeep").default;
    mapKeysDeep: typeof import("deepdash/es/mapKeysDeep").default;
    mapValuesDeep: typeof import("deepdash/es/mapValuesDeep").default;
    omitDeep: typeof import("deepdash/es/omitDeep").default;
    pathMatches: typeof import("deepdash/es/pathMatches").default;
    pathToString: typeof import("deepdash/es/pathToString").default;
    paths: typeof import("deepdash/es/paths").default;
    pickDeep: typeof import("deepdash/es/pickDeep").default;
    reduceDeep: typeof import("deepdash/es/reduceDeep").default;
    someDeep: typeof import("deepdash/es/someDeep").default;
};
export declare const doValuesContainSameData: (v1: unknown, v2: unknown) => boolean;
