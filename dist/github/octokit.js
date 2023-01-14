"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOctokit = void 0;
const endpoint_1 = require("@octokit/endpoint");
const request_error_1 = require("@octokit/request-error");
const rest_1 = require("@octokit/rest");
const async_mutex_1 = require("async-mutex");
const api_1 = require("./api");
const time_1 = require("../time");
const types_1 = require("../types");
const wasOctokitExtendedByApplication = Symbol();
// Funnel all GitHub requests through a Mutex in order to avoid rate limits
const defaultRequestMutex = new async_mutex_1.Mutex();
let requestDelay = Promise.resolve();
const rateLimitRemainingHeader = "x-ratelimit-remaining";
const rateLimitResetHeader = "x-ratelimit-reset";
const retryAfterHeader = "retry-after";
const getOctokit = ({ logger, apiEndpoint, requestMutex: inputRequestMutex, getAuthHeaders, }, octokit) => {
    octokit ??= new rest_1.Octokit({ ...endpoint_1.endpoint.DEFAULTS, ...(apiEndpoint ? { baseUrl: apiEndpoint } : {}) });
    /*
      Check that this Octokit instance has not been augmented before because
      side-effects of this function should not be stacked; e.g. registering
      request wrappers more than once will break the application
    */
    if (octokit[wasOctokitExtendedByApplication]) {
        return octokit;
    }
    Object.assign(octokit.repos, {
        getPullCommits: octokit.request.defaults({
            method: "GET",
            url: api_1.githubApiEndpoints.pullRequestCommitsByRepositoryId,
        }),
        getBranchCommitsByRepositoryId: octokit.request.defaults({
            method: "GET",
            url: api_1.githubApiEndpoints.branchCommitsByRepositoryId,
        }),
        getCommitsByRepositoryId: octokit.request.defaults({
            method: "GET",
            url: api_1.githubApiEndpoints.commitsByRepositoryId,
        }),
        getCommits: octokit.request.defaults({ method: "GET", url: api_1.githubApiEndpoints.commitsByRepositoryId }),
        getOpenPullRequests: octokit.request.defaults({
            method: "GET",
            url: api_1.githubApiEndpoints.pullRequestsByRepositoryId,
        }),
        getById: octokit.request.defaults({ method: "GET", url: api_1.githubApiEndpoints.repositoryById }),
    });
    Object.assign(octokit.pulls, {
        createCommentByRepositoryId: octokit.request.defaults({
            method: "POST",
            url: api_1.githubApiEndpoints.pullRequestCommentsByRepositoryId,
        }),
        getByRepositoryId: octokit.request.defaults({ method: "GET", url: api_1.githubApiEndpoints.pullRequestByRepositoryId }),
    });
    Object.assign(octokit.checks, {
        createCommitStatusByRepositoryId: octokit.request.defaults({
            method: "POST",
            url: api_1.githubApiEndpoints.commitStatusByRepositoryId,
        }),
        getPullStatusByRepositoryId: octokit.request.defaults({
            method: "GET",
            url: api_1.githubApiEndpoints.pullRequestStatusByRepositoryId,
        }),
    });
    Object.assign(octokit.users, {
        permissionsByRepositoryId: octokit.request.defaults({
            method: "GET",
            url: api_1.githubApiEndpoints.userPermissionsByRepositoryId,
        }),
    });
    Object.assign(octokit.orgs, {
        userMembershipByOrganizationId: octokit.request.defaults({
            method: "GET",
            url: api_1.githubApiEndpoints.userMembershipByOrganizationId,
        }),
        revokeUserMembershipByOrganizationId: octokit.request.defaults({
            method: "DELETE",
            url: api_1.githubApiEndpoints.userMembershipByOrganizationId,
        }),
    });
    const requestMutex = inputRequestMutex ?? defaultRequestMutex;
    octokit.hook.wrap("request", async (request, options) => {
        logger.info({ request, options }, "Preparing to send a request to the GitHub API");
        let triesCount = 0;
        //  this code doesn't have long, trying to fix `any` here isn't worth it
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await requestMutex.runExclusive(async () => {
            try {
                await requestDelay;
                if (getAuthHeaders) {
                    const authHeaders = await getAuthHeaders();
                    options.headers = { ...options.headers, ...authHeaders };
                }
                for (; triesCount < 3; triesCount++) {
                    if (triesCount) {
                        logger.info(`Retrying Octokit request (tries so far: ${triesCount})`);
                    }
                    try {
                        return new types_1.Ok(await request(options));
                    }
                    catch (error) {
                        if (!(error instanceof request_error_1.RequestError)) {
                            return new types_1.Err(error);
                        }
                        const { status, message } = error;
                        const isApiRateLimitResponse = message.startsWith("You have exceeded a secondary rate limit.");
                        /*
                          4XX status codes indicates a "client error", thus we assume the
                          request is invalid and therefore there's no point in retrying it
                          */
                        if (!isApiRateLimitResponse && status >= 400 && status < 500) {
                            return new types_1.Err(error);
                        }
                        const { response } = error;
                        const fallbackWaitDuration = 1000;
                        const waitDuration = response === undefined
                            ? /*
                                We don't know what to make of this error since its response is
                                empty, so just use a fallback wait duration
                              */
                                fallbackWaitDuration
                            : (() => {
                                const { headers } = response;
                                if (parseInt(headers[rateLimitRemainingHeader] ?? "") === 0) {
                                    // https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limit-http-headers
                                    logger.warn(`GitHub API limits were hit! The "${rateLimitResetHeader}" response header will be read to figure out until when we're supposed to wait...`);
                                    const rateLimitResetHeaderValue = headers[rateLimitResetHeader];
                                    const resetEpoch = parseInt(rateLimitResetHeaderValue ?? "") * 1000;
                                    if (Number.isNaN(resetEpoch)) {
                                        logger.error({ rateLimitResetHeaderValue, rateLimitResetHeader, headers }, `GitHub response header "${rateLimitResetHeader}" could not be parsed as epoch`);
                                    }
                                    else {
                                        const currentEpoch = Date.now();
                                        const duration = resetEpoch - currentEpoch;
                                        if (duration < 0) {
                                            logger.error({ rateLimitResetHeaderValue, resetEpoch, currentEpoch, headers }, `Parsed epoch value for GitHub response header "${rateLimitResetHeader}" is smaller than the current date`);
                                        }
                                        else {
                                            return duration;
                                        }
                                    }
                                }
                                else if (headers[retryAfterHeader] !== undefined) {
                                    // https://docs.github.com/en/rest/guides/best-practices-for-integrators#dealing-with-secondary-rate-limits
                                    const retryAfterHeaderValue = headers[retryAfterHeader];
                                    const duration = parseInt(String(retryAfterHeaderValue)) * 1000;
                                    if (Number.isNaN(duration)) {
                                        logger.error({ retryAfterHeader, retryAfterHeaderValue, headers }, `GitHub response header "${retryAfterHeader}" could not be parsed as seconds`);
                                    }
                                    else {
                                        return duration;
                                    }
                                }
                                else if (
                                /*
                              If this is an API Rate Limit response error and we
                              haven't been able to parse the precise required wait
                              duration, it's not sane to try to recover from this
                              error by using a fallback wait duration because it might
                              be imprecise
                            */
                                !isApiRateLimitResponse) {
                                    logger.info({ headers, fallbackWaitDuration, message }, "Falling back to default wait duration since other heuristics were not fulfilled");
                                    return fallbackWaitDuration;
                                }
                            })();
                        if (waitDuration === undefined) {
                            return new types_1.Err(error);
                        }
                        logger.info(`Waiting for ${waitDuration}ms until requests can be made again...`);
                        await (0, time_1.delay)(waitDuration);
                    }
                }
            }
            catch (error) {
                return new types_1.Err(error);
            }
        });
        /*
          3600 (seconds in an hour) / 5000 (requests limit) = 0.72, or 720
          milliseconds, which is the minimum value we can use for this delay
        */
        requestDelay = (0, time_1.delay)(768);
        if (result instanceof types_1.Err) {
            throw result.value;
        }
        else if (result === undefined) {
            throw new Error(`Unable to fetch GitHub response within ${triesCount} tries`);
        }
        return result.value;
    });
    const extendedOctokit = octokit;
    extendedOctokit[wasOctokitExtendedByApplication] = true;
    return extendedOctokit;
};
exports.getOctokit = getOctokit;
//# sourceMappingURL=octokit.js.map