import { ExtendedOctokit } from "./github/octokit";
import { Logger } from "./logger";
export declare const isGithubOrganizationMember: ({ logger }: {
    logger: Logger;
}, octokit: ExtendedOctokit, organization: {
    id: number;
}, user: {
    login: string;
}) => Promise<boolean>;
export * from "./github/octokit";
