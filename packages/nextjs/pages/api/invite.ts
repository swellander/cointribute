import type { NextApiRequest, NextApiResponse } from "next";
import { recoverMessageAddress } from "viem";
import { getOctokit } from "~~/services/octokit";
import { fetchConfig } from "~~/services/octokit/getConfig";
import { addressOwnsAnyAmountOfToken, fetchGithubUserWithAccessToken } from "~~/utils/scaffold-eth/probot";

const messageToSign = process.env.MESSAGE_TO_SIGN || "";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { installation_id, access_token } = req.body;

  // get user from access_token
  const user = await fetchGithubUserWithAccessToken(access_token);
  const username = user.login;

  // send invite
  const octokit = getOctokit(installation_id);
  console.log(Object.keys(octokit.meta));
  res.status(200).json(octokit.meta);
  // await octokit.rest.repos.addCollaborator({
  //   username: username,
  //   permission: "push",
  // });
  // console.log(`User ${username} invited as a collaborator to ${owner}/${repo}`);
  // res.status(201).end();
}
