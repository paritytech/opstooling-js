import { Octokit } from "@octokit/rest";
import { EndpointInterface, Endpoints, RequestInterface } from "@octokit/types";
import { Mutex } from "async-mutex";
import { Logger } from "src/logger";
declare const wasOctokitExtendedByApplication: unique symbol;
export declare type ExtendedOctokit = Octokit & {
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
export declare const getOctokit: ({ logger, apiEndpoint, requestMutex: inputRequestMutex, getAuthHeaders, }: {
    logger: Logger;
    apiEndpoint?: string | undefined;
    requestMutex?: Mutex | undefined;
    getAuthHeaders?: (() => Promise<{
        authorization: string;
    }>) | undefined;
}, octokit?: Octokit) => ExtendedOctokit;
export {};
