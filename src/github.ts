import { ExtendedOctokit } from "./github/octokit"
import { Logger } from "./logger"

export const isGithubOrganizationMember = async (
  { logger }: { logger: Logger },
  octokit: ExtendedOctokit,
  organization: { id: number },
  user: { login: string },
): Promise<boolean> => {
  const membershipStatus = await (async () => {
    try {
      return (
        await octokit.orgs.userMembershipByOrganizationId({ organization_id: organization.id, username: user.login })
      ).status as number
    } catch (error) {
      logger.error(error, "GitHub membership request failed")
      return false
    }
  })()
  if (typeof membershipStatus === "boolean") {
    return membershipStatus
  }

  switch (membershipStatus) {
    case 204: {
      return true
    }
    case 302: {
      logger.fatal(
        `Github organization membership API responded with status code ${membershipStatus} which means the bot is not considered an organization member. This should never happen because the bot should already be installed in that organization. It's possible that the bot's credentials were not properly used for this request.`,
      )
      return false
    }
    default: {
      logger.fatal(`GitHub organization membership API responded with unexpected status code ${membershipStatus}`)
      return false
    }
  }
}

export * from "./github/octokit"
