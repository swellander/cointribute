module.exports = app => {
  app.on("push", async context => {
    const { payload, octokit } = context;
    const owner = payload.repository.owner.login;
    const repo = payload.repository.name;

    if (payload.ref === `refs/heads/${payload.repository.default_branch}`) {
      const commitDetails = await Promise.all(
        payload.commits.map(async commit =>
          (await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${commit.id}`)).json(),
        ),
      );

      for (const commitDetail of commitDetails) {
        if (commitDetail.parents.length > 1) {
          const { data: associatedPRs } = await octokit.request(
            "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls",
            {
              owner,
              repo,
              commit_sha: commitDetail.sha,
              headers: {
                "X-GitHub-Api-Version": "2022-11-28",
              },
            },
          );

          // send token to commit author

          const { number } = associatedPRs[0];
          await octokit.issues.createComment(
            context.issue({
              issue_number: number,
              body: "This PR has been merged.",
            }),
          );

          console.log("Merge to default branch detected");
          break; // Exit loop once a merge commit is found
        }
      }
    }
  });
};
