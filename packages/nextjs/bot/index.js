module.exports = app => {
  app.on("push", async context => {
    const { payload, octokit } = context;
    const owner = payload.repository.owner.login;
    const repo = payload.repository.name;

    // Check if the push is to the default branch
    if (payload.ref === `refs/heads/${payload.repository.default_branch}`) {
      // Iterate through commits

      const commitDetails = await Promise.all(
        payload.commits.map(async commit =>
          (await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${commit.id}`)).json(),
        ),
      );

      for (const commitDetail of commitDetails) {
        // console.log("DATA ===============");
        // console.log(commitDetail);
        // console.log(commitDetail);
        // Check if it's a merge commit
        if (commitDetail.parents.length > 1) {
          // Retrieve PR information associated with the merge commit
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

          console.log(associatedPRs);
          const { number } = associatedPRs[0];

          // // Extract PR number from commit details
          // const prNumber = commitDetails.data.parents[1].message.match(/Merge pull request #(\d+) from/)[1];

          // Comment on the PR
          await octokit.issues.createComment(
            context.issue({
              issue_number: number,
              body: "This PR has been merged.",
            }),
          );

          // // Perform other actions for merge to default branch
          console.log("Merge to default branch detected");
          break; // Exit loop once a merge commit is found
        }
      }
    }
  });
};
