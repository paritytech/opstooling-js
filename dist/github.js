"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGithubOrganizationMember = void 0;
const isGithubOrganizationMember = async ({ logger }, octokit, organization, user) => {
    const membershipStatus = await (async () => {
        try {
            return (await octokit.orgs.userMembershipByOrganizationId({ organization_id: organization.id, username: user.login })).status;
        }
        catch (error) {
            logger.error(error, "GitHub membership request failed");
            return false;
        }
    })();
    if (typeof membershipStatus === "boolean") {
        return membershipStatus;
    }
    switch (membershipStatus) {
        case 204: {
            return true;
        }
        case 302: {
            logger.fatal(`Github organization membership API responded with status code ${membershipStatus} which means the bot is not considered an organization member. This should never happen because the bot should already be installed in that organization. It's possible that the bot's credentials were not properly used for this request.`);
            return false;
        }
        default: {
            logger.fatal(`GitHub organization membership API responded with unexpected status code ${membershipStatus}`);
            return false;
        }
    }
};
exports.isGithubOrganizationMember = isGithubOrganizationMember;
__exportStar(require("./github/octokit"), exports);
//# sourceMappingURL=github.js.map