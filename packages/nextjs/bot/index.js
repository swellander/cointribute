const { handleNewRepo } = require("./utils");

module.exports = app => {
  app.on("push", async context => {
    const { payload } = context;

    // Check if the push is to the default branch
    app.log.info(payload.ref);
    if (payload.ref === `refs/heads/${payload.repository.default_branch}`) {
      // Check if it's a merge commit
      const commits = payload.commits;
      const isMergeCommit = commits.some(commit => commit.parents?.length > 1);

      if (isMergeCommit) {
        // Perform actions for merge to default branch
        app.log.info("Merge to default branch detected");
      }
    }
    app.log.info({ event: context.name, action: context.payload.action });
  });
  // app.on("installation", async context => {
  //   for (const repoData of context.payload.repositories) {
  //     handleNewRepo({
  //       context,
  //       repoData,
  //     });
  //   }
  // });
  // app.oRequestAllowancen("installation_repositories", async context => {
  //   for (const repoData of context.payload.repositories_added) {
  //     handleNewRepo({
  //       context,
  //       repoData,
  //     });
  //   }
  // });
};
