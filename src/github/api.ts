const commitsByRepositoryIdEndpoint = "/repositories/:repository_id/commits"

export const githubApiEndpoints = {
  commitsByRepositoryId: commitsByRepositoryIdEndpoint,
  repositoryById: "/repositories/:repository_id",
  repositoryByName: "/repos/:owner/:name",
  pullRequestsByRepositoryId: "/repositories/:repository_id/pulls",
  pullRequestByRepositoryId: "/repositories/:repository_id/pulls/:pull_number",
  commitStatusByRepositoryId: "/repositories/:repository_id/statuses/:sha",
  pullRequestCommentsByRepositoryId:
    "/repositories/:repository_id/issues/:pull_number/comments",
  pullRequestStatusByRepositoryId:
    "/repositories/:repository_id/commits/pull/:pull_number/head/status",
  pullRequestCommitsByRepositoryId: `${commitsByRepositoryIdEndpoint}?sha=pull/:pull_number/head`,
  branchCommitsByRepositoryId: `${commitsByRepositoryIdEndpoint}?sha=:branch`,
  userPermissionsByRepositoryId:
    "/repositories/:repository_id/collaborators/:username/permission",
  userMembershipByOrganizationId:
    "/organizations/:organization_id/members/:username",
}
