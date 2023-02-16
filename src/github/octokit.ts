import { endpoint } from "@octokit/endpoint";
import { OctokitResponse } from "@octokit/plugin-paginate-rest/dist-types/types";
import { RequestError } from "@octokit/request-error";
import { Octokit } from "@octokit/rest";
import { EndpointInterface, Endpoints, RequestInterface } from "@octokit/types";
import { Mutex } from "async-mutex";

import { githubApiEndpoints } from "src/github/api";
import { Logger } from "src/logger";
import { delay } from "src/time";
import { Err, Ok, err, ok } from "src/types";

const wasOctokitExtendedByApplication = Symbol();

/*
  Those extensions are undocumented endpoints or endpoints which are not yet
  available on Octokit
*/
export type ExtendedOctokit = Octokit & {
  users: Octokit["users"] & {
    permissionsByRepositoryId: {
      (
        params: Omit<Endpoints["GET /repos/{owner}/{repo}/collaborators/{username}/permission"], "owner" | "repo"> & {
          repository_id: number;
        },
      ): Promise<Endpoints["GET /repos/{owner}/{repo}/collaborators/{username}/permission"]["response"]>;
      defaults: RequestInterface["defaults"];
      endpoint: EndpointInterface<{
        url: string;
      }>;
    };
  };
  repos: Octokit["repos"] & {
    getById: {
      (
        params: Omit<Endpoints["GET /repos/{owner}/{repo}"]["parameters"], "owner" | "repo"> & {
          repository_id: number;
        },
      ): Promise<Endpoints["GET /repos/{owner}/{repo}"]["response"]>;
      defaults: RequestInterface["defaults"];
      endpoint: EndpointInterface<{
        url: string;
      }>;
    };
    getPullCommits: {
      (
        params: Omit<Endpoints["GET /repos/{owner}/{repo}/commits"]["parameters"], "owner" | "repo"> & {
          repository_id: number;
          pull_number: number;
        },
      ): Promise<Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]>;
      defaults: RequestInterface["defaults"];
      endpoint: EndpointInterface<{
        url: string;
      }>;
    };
    getBranchCommitsByRepositoryId: {
      (
        params: Omit<Endpoints["GET /repos/{owner}/{repo}/commits"]["parameters"], "owner" | "repo"> & {
          repository_id: number;
          branch: string;
        },
      ): Promise<Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]>;
      defaults: RequestInterface["defaults"];
      endpoint: EndpointInterface<{
        url: string;
      }>;
    };
    getCommitsByRepositoryId: {
      (
        params: Omit<Endpoints["GET /repos/{owner}/{repo}/commits"]["parameters"], "owner" | "repo"> & {
          repository_id: number;
        },
      ): Promise<Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]>;
      defaults: RequestInterface["defaults"];
      endpoint: EndpointInterface<{
        url: string;
      }>;
    };
    getOpenPullRequests: {
      (
        params: Omit<Endpoints["GET /repos/{owner}/{repo}/pulls"]["parameters"], "owner" | "repo"> & {
          repository_id: number;
        },
      ): Promise<Endpoints["GET /repos/{owner}/{repo}/pulls"]["response"]>;
      defaults: RequestInterface["defaults"];
      endpoint: EndpointInterface<{
        url: string;
      }>;
    };
  };
  pulls: Octokit["pulls"] & {
    createCommentByRepositoryId: {
      (
        params: Omit<
          Endpoints["POST /repos/{owner}/{repo}/issues/{issue_number}/comments"]["parameters"],
          "owner" | "repo" | "issue_number"
        > & { repository_id: number; pull_number: number },
      ): Promise<Endpoints["POST /repos/{owner}/{repo}/issues/{issue_number}/comments"]["response"]>;
      defaults: RequestInterface["defaults"];
      endpoint: EndpointInterface<{
        url: string;
      }>;
    };
    getByRepositoryId: {
      (
        params: Omit<Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}"]["parameters"], "owner" | "repo">,
      ): Promise<Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}"]["response"]>;
      defaults: RequestInterface["defaults"];
      endpoint: EndpointInterface<{
        url: string;
      }>;
    };
  };
  checks: Octokit["checks"] & {
    createCommitStatusByRepositoryId: {
      (
        params: Omit<Endpoints["POST /repos/{owner}/{repo}/statuses/{sha}"]["parameters"], "owner" | "repo"> & {
          repository_id: number;
        },
      ): Promise<Endpoints["POST /repos/{owner}/{repo}/statuses/{sha}"]["response"]>;
      defaults: RequestInterface["defaults"];
      endpoint: EndpointInterface<{
        url: string;
      }>;
    };
    getPullStatusByRepositoryId: {
      (
        params: Omit<Endpoints["GET /repos/{owner}/{repo}/commits/{ref}/status"]["parameters"], "owner" | "repo">,
      ): Promise<Endpoints["GET /repos/{owner}/{repo}/commits/{ref}/status"]["response"]>;
      defaults: RequestInterface["defaults"];
      endpoint: EndpointInterface<{
        url: string;
      }>;
    };
  };
  orgs: Octokit["orgs"] & {
    userMembershipByOrganizationId: {
      (
        params: Omit<Endpoints["GET /orgs/{org}/members/{username}"]["parameters"], "org"> & {
          organization_id: number;
        },
      ): Promise<Endpoints["GET /orgs/{org}/members/{username}"]["response"]>;
      defaults: RequestInterface["defaults"];
      endpoint: EndpointInterface<{
        url: string;
      }>;
    };
    revokeUserMembershipByOrganizationId: {
      (
        params: Omit<Endpoints["DELETE /orgs/{org}/members/{username}"]["parameters"], "org"> & {
          organization_id: number;
        },
      ): Promise<Endpoints["DELETE /orgs/{org}/members/{username}"]["response"]>;
      defaults: RequestInterface["defaults"];
      endpoint: EndpointInterface<{
        url: string;
      }>;
    };
  };
  [wasOctokitExtendedByApplication]: boolean;
};

// Funnel all GitHub requests through a Mutex in order to avoid rate limits
const defaultRequestMutex = new Mutex();
let requestDelay = Promise.resolve();

const rateLimitRemainingHeader = "x-ratelimit-remaining";
const rateLimitResetHeader = "x-ratelimit-reset";
const retryAfterHeader = "retry-after";
export const getOctokit = (
  {
    logger,
    apiEndpoint,
    requestMutex: inputRequestMutex,
    getAuthHeaders,
  }: {
    logger: Logger;
    apiEndpoint?: string;
    requestMutex?: Mutex;
    getAuthHeaders?: () => Promise<{ authorization: string }>;
  },
  octokit?: Octokit,
): ExtendedOctokit => {
  octokit ??= new Octokit({ ...endpoint.DEFAULTS, ...(apiEndpoint ? { baseUrl: apiEndpoint } : {}) });

  /*
    Check that this Octokit instance has not been augmented before because
    side-effects of this function should not be stacked; e.g. registering
    request wrappers more than once will break the application
  */
  if ((octokit as ExtendedOctokit)[wasOctokitExtendedByApplication]) {
    return octokit as ExtendedOctokit;
  }

  Object.assign(octokit.repos, {
    getPullCommits: octokit.request.defaults({
      method: "GET",
      url: githubApiEndpoints.pullRequestCommitsByRepositoryId,
    }),
    getBranchCommitsByRepositoryId: octokit.request.defaults({
      method: "GET",
      url: githubApiEndpoints.branchCommitsByRepositoryId,
    }),
    getCommitsByRepositoryId: octokit.request.defaults({
      method: "GET",
      url: githubApiEndpoints.commitsByRepositoryId,
    }),
    getCommits: octokit.request.defaults({ method: "GET", url: githubApiEndpoints.commitsByRepositoryId }),
    getOpenPullRequests: octokit.request.defaults({
      method: "GET",
      url: githubApiEndpoints.pullRequestsByRepositoryId,
    }),
    getById: octokit.request.defaults({ method: "GET", url: githubApiEndpoints.repositoryById }),
  });

  Object.assign(octokit.pulls, {
    createCommentByRepositoryId: octokit.request.defaults({
      method: "POST",
      url: githubApiEndpoints.pullRequestCommentsByRepositoryId,
    }),
    getByRepositoryId: octokit.request.defaults({ method: "GET", url: githubApiEndpoints.pullRequestByRepositoryId }),
  });

  Object.assign(octokit.checks, {
    createCommitStatusByRepositoryId: octokit.request.defaults({
      method: "POST",
      url: githubApiEndpoints.commitStatusByRepositoryId,
    }),
    getPullStatusByRepositoryId: octokit.request.defaults({
      method: "GET",
      url: githubApiEndpoints.pullRequestStatusByRepositoryId,
    }),
  });

  Object.assign(octokit.users, {
    permissionsByRepositoryId: octokit.request.defaults({
      method: "GET",
      url: githubApiEndpoints.userPermissionsByRepositoryId,
    }),
  });

  Object.assign(octokit.orgs, {
    userMembershipByOrganizationId: octokit.request.defaults({
      method: "GET",
      url: githubApiEndpoints.userMembershipByOrganizationId,
    }),
    revokeUserMembershipByOrganizationId: octokit.request.defaults({
      method: "DELETE",
      url: githubApiEndpoints.userMembershipByOrganizationId,
    }),
  });

  const requestMutex = inputRequestMutex ?? defaultRequestMutex;
  octokit.hook.wrap("request", async (request, options) => {
    logger.info({ request, options }, "Preparing to send a request to the GitHub API");

    let triesCount = 0;
    //  this code doesn't have long, trying to fix `any` here isn't worth it
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: Ok<OctokitResponse<any>> | Err<any> | undefined = await requestMutex.runExclusive(async () => {
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
            return ok(await request(options));
          } catch (error) {
            if (!(error instanceof RequestError)) {
              return err(error);
            }

            const { status, message } = error;
            const isApiRateLimitResponse = message.startsWith("You have exceeded a secondary rate limit.");
            /*
              4XX status codes indicates a "client error", thus we assume the
              request is invalid and therefore there's no point in retrying it
              */
            if (!isApiRateLimitResponse && status >= 400 && status < 500) {
              return err(error);
            }

            const { response } = error;
            const fallbackWaitDuration = 1000;
            const waitDuration =
              response === undefined
                ? /*
                    We don't know what to make of this error since its response is
                    empty, so just use a fallback wait duration
                  */ fallbackWaitDuration
                : (() => {
                    const { headers } = response;
                    if (parseInt(headers[rateLimitRemainingHeader] ?? "") === 0) {
                      // https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limit-http-headers
                      logger.warn(
                        `GitHub API limits were hit! The "${rateLimitResetHeader}" response header will be read to figure out until when we're supposed to wait...`,
                      );
                      const rateLimitResetHeaderValue = headers[rateLimitResetHeader];
                      const resetEpoch = parseInt(rateLimitResetHeaderValue ?? "") * 1000;
                      if (Number.isNaN(resetEpoch)) {
                        logger.error(
                          { rateLimitResetHeaderValue, rateLimitResetHeader, headers },
                          `GitHub response header "${rateLimitResetHeader}" could not be parsed as epoch`,
                        );
                      } else {
                        const currentEpoch = Date.now();
                        const duration = resetEpoch - currentEpoch;
                        if (duration < 0) {
                          logger.error(
                            { rateLimitResetHeaderValue, resetEpoch, currentEpoch, headers },
                            `Parsed epoch value for GitHub response header "${rateLimitResetHeader}" is smaller than the current date`,
                          );
                        } else {
                          return duration;
                        }
                      }
                    } else if (headers[retryAfterHeader] !== undefined) {
                      // https://docs.github.com/en/rest/guides/best-practices-for-integrators#dealing-with-secondary-rate-limits
                      const retryAfterHeaderValue = headers[retryAfterHeader];
                      const duration = parseInt(String(retryAfterHeaderValue)) * 1000;
                      if (Number.isNaN(duration)) {
                        logger.error(
                          { retryAfterHeader, retryAfterHeaderValue, headers },
                          `GitHub response header "${retryAfterHeader}" could not be parsed as seconds`,
                        );
                      } else {
                        return duration;
                      }
                    } else if (
                      /*
                    If this is an API Rate Limit response error and we
                    haven't been able to parse the precise required wait
                    duration, it's not sane to try to recover from this
                    error by using a fallback wait duration because it might
                    be imprecise
                  */
                      !isApiRateLimitResponse
                    ) {
                      logger.info(
                        { headers, fallbackWaitDuration, message },
                        "Falling back to default wait duration since other heuristics were not fulfilled",
                      );
                      return fallbackWaitDuration;
                    }
                  })();

            if (waitDuration === undefined) {
              return err(error);
            }

            logger.info(`Waiting for ${waitDuration}ms until requests can be made again...`);
            await delay(waitDuration);
          }
        }
      } catch (error) {
        return err(error);
      }
    });

    /*
      3600 (seconds in an hour) / 5000 (requests limit) = 0.72, or 720
      milliseconds, which is the minimum value we can use for this delay
    */
    requestDelay = delay(768);

    if (result?.kind === "Err") {
      throw result.value;
    } else if (result === undefined) {
      throw new Error(`Unable to fetch GitHub response within ${triesCount} tries`);
    }

    return result.value;
  });

  const extendedOctokit = octokit as ExtendedOctokit;
  extendedOctokit[wasOctokitExtendedByApplication] = true;
  return extendedOctokit;
};
