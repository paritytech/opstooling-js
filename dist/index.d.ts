import { FastifyLoggerInstance } from 'fastify';
import * as _octokit_plugin_rest_endpoint_methods_dist_types_types from '@octokit/plugin-rest-endpoint-methods/dist-types/types';
import * as _octokit_plugin_rest_endpoint_methods_dist_types_generated_method_types from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';
import * as _octokit_plugin_paginate_rest_dist_types_types from '@octokit/plugin-paginate-rest/dist-types/types';
import * as _octokit_core from '@octokit/core';
import { Octokit } from '@octokit/rest';
import { Endpoints, RequestInterface, EndpointInterface } from '@octokit/types';
import { Mutex } from 'async-mutex';
import * as deepdash_es_someDeep from 'deepdash/es/someDeep';
import * as deepdash_es_reduceDeep from 'deepdash/es/reduceDeep';
import * as deepdash_es_pickDeep from 'deepdash/es/pickDeep';
import * as deepdash_es_pathToString from 'deepdash/es/pathToString';
import * as deepdash_es_pathMatches from 'deepdash/es/pathMatches';
import * as deepdash_es_omitDeep from 'deepdash/es/omitDeep';
import * as deepdash_es_mapValuesDeep from 'deepdash/es/mapValuesDeep';
import * as deepdash_es_mapKeysDeep from 'deepdash/es/mapKeysDeep';
import * as deepdash_es_mapDeep from 'deepdash/es/mapDeep';
import * as deepdash_es_paths from 'deepdash/es/paths';
import * as deepdash_es from 'deepdash/es';
import * as deepdash_es_findValueDeep from 'deepdash/es/findValueDeep';
import * as deepdash_es_findPathDeep from 'deepdash/es/findPathDeep';
import * as deepdash_es_findDeep from 'deepdash/es/findDeep';
import * as deepdash_es_filterDeep from 'deepdash/es/filterDeep';
import * as deepdash_es_exists from 'deepdash/es/exists';
import * as deepdash_es_eachDeep from 'deepdash/es/eachDeep';
import * as deepdash_es_condenseDeep from 'deepdash/es/condenseDeep';
import * as deepdash_es_condense from 'deepdash/es/condense';
import lodash from 'lodash';
import * as events from 'events';
import * as fs_promises from 'fs/promises';
import * as fs from 'fs';
import { ChildProcess } from 'child_process';
import { AnySchema } from 'joi';
import fetch from 'node-fetch';
export { default as fetch } from 'node-fetch';

declare const envVar: (name: string) => string;
declare const envNumberVar: (name: string) => number;

declare const intoError: (value: unknown) => Error;
declare const displayError: (value: unknown) => string;

declare const redact: (str: string, items: string[]) => string;

declare type LoggingImplementation = {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
};
declare enum LoggingLevel {
    trace = 0,
    debug = 1,
    info = 2,
    warn = 3,
    error = 4,
    fatal = 5
}
declare type LoggingLevels = keyof typeof LoggingLevel;
declare class Logger {
    options: {
        name: string;
        logFormat: "json" | null;
        minLogLevel: LoggingLevels;
        impl: LoggingImplementation;
        context?: Record<string, any>;
    };
    constructor(options: {
        name: string;
        logFormat: "json" | null;
        minLogLevel: LoggingLevels;
        impl: LoggingImplementation;
        context?: Record<string, any>;
    });
    getFastifyLogger(): FastifyLoggerInstance;
    child(context: Record<string, unknown>): Logger;
    log<T = string>(level: LoggingLevels, item: unknown, description?: T, ...extra: unknown[]): void;
    private loggerCallback;
    info: <T = string>(item: unknown, description?: T | undefined, ...extra: unknown[]) => void;
    warn: <T = string>(item: unknown, description?: T | undefined, ...extra: unknown[]) => void;
    error: <T = string>(item: unknown, description?: T | undefined, ...extra: unknown[]) => void;
    fatal: <T = string>(item: unknown, description?: T | undefined, ...extra: unknown[]) => void;
}

declare const normalizeValue: (value: unknown, previousObjects?: unknown[], showTopLevel?: boolean) => unknown;

declare const delay: (milliseconds: number) => Promise<void>;

declare class Ok<T> {
    value: T;
    constructor(value: T);
}
declare const ok: <T>(value: T) => Ok<T>;
declare class Err<T> {
    value: T;
    constructor(value: T);
}
declare const err: <T>(value: T) => Err<T>;
declare type KeysOfType<T, U> = {
    [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];
declare type RequiredKeys<T> = Exclude<KeysOfType<T, Exclude<T[keyof T], undefined>>, undefined>;
declare type OptionalKeys<T> = Exclude<keyof T, RequiredKeys<T>>;
declare type ToRequired<T> = {
    [K in OptionalKeys<T>]: T[K] extends undefined | infer U ? U : T[K];
};
declare type ToOptional<T> = {
    [K in keyof T]?: T[K];
};

declare const wasOctokitExtendedByApplication: unique symbol;
declare type ExtendedOctokit = Octokit & {
    users: Octokit["users"] & {
        permissionsByRepositoryId: {
            (params: Omit<Endpoints["GET /repos/{owner}/{repo}/collaborators/{username}/permission"], "owner" | "repo"> & {
                repository_id: number;
            }): Promise<Endpoints["GET /repos/{owner}/{repo}/collaborators/{username}/permission"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    repos: Octokit["repos"] & {
        getById: {
            (params: Omit<Endpoints["GET /repos/{owner}/{repo}"]["parameters"], "owner" | "repo"> & {
                repository_id: number;
            }): Promise<Endpoints["GET /repos/{owner}/{repo}"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getPullCommits: {
            (params: Omit<Endpoints["GET /repos/{owner}/{repo}/commits"]["parameters"], "owner" | "repo"> & {
                repository_id: number;
                pull_number: number;
            }): Promise<Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getBranchCommitsByRepositoryId: {
            (params: Omit<Endpoints["GET /repos/{owner}/{repo}/commits"]["parameters"], "owner" | "repo"> & {
                repository_id: number;
                branch: string;
            }): Promise<Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getCommitsByRepositoryId: {
            (params: Omit<Endpoints["GET /repos/{owner}/{repo}/commits"]["parameters"], "owner" | "repo"> & {
                repository_id: number;
            }): Promise<Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getOpenPullRequests: {
            (params: Omit<Endpoints["GET /repos/{owner}/{repo}/pulls"]["parameters"], "owner" | "repo"> & {
                repository_id: number;
            }): Promise<Endpoints["GET /repos/{owner}/{repo}/pulls"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    pulls: Octokit["pulls"] & {
        createCommentByRepositoryId: {
            (params: Omit<Endpoints["POST /repos/{owner}/{repo}/issues/{issue_number}/comments"]["parameters"], "owner" | "repo" | "issue_number"> & {
                repository_id: number;
                pull_number: number;
            }): Promise<Endpoints["POST /repos/{owner}/{repo}/issues/{issue_number}/comments"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getByRepositoryId: {
            (params: Omit<Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}"]["parameters"], "owner" | "repo">): Promise<Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    checks: Octokit["checks"] & {
        createCommitStatusByRepositoryId: {
            (params: Omit<Endpoints["POST /repos/{owner}/{repo}/statuses/{sha}"]["parameters"], "owner" | "repo"> & {
                repository_id: number;
            }): Promise<Endpoints["POST /repos/{owner}/{repo}/statuses/{sha}"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        getPullStatusByRepositoryId: {
            (params: Omit<Endpoints["GET /repos/{owner}/{repo}/commits/{ref}/status"]["parameters"], "owner" | "repo">): Promise<Endpoints["GET /repos/{owner}/{repo}/commits/{ref}/status"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    orgs: Octokit["orgs"] & {
        userMembershipByOrganizationId: {
            (params: Omit<Endpoints["GET /orgs/{org}/members/{username}"]["parameters"], "org"> & {
                organization_id: number;
            }): Promise<Endpoints["GET /orgs/{org}/members/{username}"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
        revokeUserMembershipByOrganizationId: {
            (params: Omit<Endpoints["DELETE /orgs/{org}/members/{username}"]["parameters"], "org"> & {
                organization_id: number;
            }): Promise<Endpoints["DELETE /orgs/{org}/members/{username}"]["response"]>;
            defaults: RequestInterface["defaults"];
            endpoint: EndpointInterface<{
                url: string;
            }>;
        };
    };
    [wasOctokitExtendedByApplication]: boolean;
};
declare const getOctokit: ({ logger, apiEndpoint, requestMutex: inputRequestMutex, getAuthHeaders, }: {
    logger: Logger;
    apiEndpoint?: string | undefined;
    requestMutex?: Mutex | undefined;
    getAuthHeaders?: (() => Promise<{
        authorization: string;
    }>) | undefined;
}, octokit?: (_octokit_core.Octokit & {
    paginate: _octokit_plugin_paginate_rest_dist_types_types.PaginateInterface;
} & _octokit_plugin_rest_endpoint_methods_dist_types_generated_method_types.RestEndpointMethods & _octokit_plugin_rest_endpoint_methods_dist_types_types.Api) | undefined) => ExtendedOctokit;

declare const isGithubOrganizationMember: ({ logger }: {
    logger: Logger;
}, octokit: ExtendedOctokit, organization: {
    id: number;
}, user: {
    login: string;
}) => Promise<boolean>;

declare const ld: lodash.LoDashStatic & {
    condense: typeof deepdash_es_condense.default;
    condenseDeep: typeof deepdash_es_condenseDeep.default;
    eachDeep: typeof deepdash_es_eachDeep.default;
    exists: typeof deepdash_es_exists.default;
    filterDeep: typeof deepdash_es_filterDeep.default;
    findDeep: typeof deepdash_es_findDeep.default;
    findPathDeep: typeof deepdash_es_findPathDeep.default;
    findValueDeep: typeof deepdash_es_findValueDeep.default;
    forEachDeep: typeof deepdash_es_eachDeep.default;
    index: typeof deepdash_es.default;
    keysDeep: typeof deepdash_es_paths.default;
    mapDeep: typeof deepdash_es_mapDeep.default;
    mapKeysDeep: typeof deepdash_es_mapKeysDeep.default;
    mapValuesDeep: typeof deepdash_es_mapValuesDeep.default;
    omitDeep: typeof deepdash_es_omitDeep.default;
    pathMatches: typeof deepdash_es_pathMatches.default;
    pathToString: typeof deepdash_es_pathToString.default;
    paths: typeof deepdash_es_paths.default;
    pickDeep: typeof deepdash_es_pickDeep.default;
    reduceDeep: typeof deepdash_es_reduceDeep.default;
    someDeep: typeof deepdash_es_someDeep.default;
};
declare const doValuesContainSameData: (v1: unknown, v2: unknown) => boolean;

declare const displayShellCommand: (execPath: string, args: string[], { itemsToRedact, }?: {
    itemsToRedact?: string[] | undefined;
}) => string;
declare const tryReadFile: (path: fs.PathLike | fs_promises.FileHandle, options?: (fs.ObjectEncodingOptions & events.Abortable & {
    flag?: fs.OpenMode | undefined;
}) | BufferEncoding | null | undefined) => Promise<string | undefined>;
declare type ShellCommandRunnerConfiguration = {
    itemsToRedact?: string[];
    shouldTrackProgress?: boolean;
    cwd?: string;
    onChild?: (child: ChildProcess) => void;
};
declare const getShellCommandRunner: (parentLogger: Logger, initialConfiguration: ShellCommandRunnerConfiguration) => (execPath: string, args: string[], configuration?: ShellCommandRunnerConfiguration & {
    allowedErrorCodes?: number[] | undefined;
    testAllowedErrorMessage?: ((stderr: string) => boolean) | undefined;
    shouldCaptureAllStreams?: boolean | undefined;
    stdinInput?: string | undefined;
    itemsToRedact?: string[] | undefined;
}) => Promise<string | Error>;

declare const getFreeId: () => {
    id: string;
    release: () => void;
};

declare const validatedFetch: <T>(response: ReturnType<typeof fetch>, schema: AnySchema, { decoding }?: {
    decoding: "json";
}) => Promise<T>;

export { Err, ExtendedOctokit, Logger, Ok, ToOptional, ToRequired, delay, displayError, displayShellCommand, doValuesContainSameData, envNumberVar, envVar, err, getFreeId, getOctokit, getShellCommandRunner, intoError, isGithubOrganizationMember, ld, normalizeValue, ok, redact, tryReadFile, validatedFetch };
