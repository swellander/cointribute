module.exports = app => {
  app.on("push", async context => {
    const { payload, octokit } = context;
    const owner = payload.repository.owner.login;
    const repo = payload.repository.name;

    // Check if the push is to the default branch
    if (payload.ref === `refs/heads/${payload.repository.default_branch}`) {
      // Iterate through commits

      console.log(payload.commits.length);
      const commitDetails = await Promise.all(
        payload.commits.map(commit =>
          octokit.repos.getCommit({
            owner,
            repo,
            commit_sha: commit.id,
          }),
        ),
      );
      console.log(commitDetails.length);

      for (const commitDetail of commitDetails) {
        // console.log("DATA ===============");
        // console.log(commitDetail);
        // console.log(commitDetail);
        // Check if it's a merge commit
        if (false) {
          // if (commit.parents && commit.parents.length > 1) {
          // Retrieve PR information associated with the merge commit
          const commitDetails = await octokit.repos.getCommit(
            context.repo({
              commit_sha: commit.id,
            }),
          );

          // Extract PR number from commit details
          const prNumber = commitDetails.data.parents[1].message.match(/Merge pull request #(\d+) from/)[1];

          // Comment on the PR
          await octokit.issues.createComment(
            context.issue({
              issue_number: prNumber,
              body: "This PR has been merged.",
            }),
          );

          // Perform other actions for merge to default branch
          console.log("Merge to default branch detected");
          break; // Exit loop once a merge commit is found
        }
      }
    }
  });
};
