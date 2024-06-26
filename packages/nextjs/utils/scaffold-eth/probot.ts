import { Address } from "viem";
import { getClient } from "~~/services/web3/client";
import erc20ABI from "~~/services/web3/erc20ABI.json";

export const requestToken = async (code: string) => {
  const tokenUrl = `/api/github-token?code=${code}`;
  const res = await fetch(tokenUrl);
  const data = await res.json();
  return data.access_token;
};

export const requestUser = async (token: string) => {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    method: "GET",
  });
  return res.json();
};

export const requestRepoInvite = async ({
  githubAccessToken,
  installationId,
}: {
  githubAccessToken: string;
  installationId: string;
}) => {
  const inviteUrl = `/api/invite`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      access_token: githubAccessToken,
      installation_id: installationId,
    }),
  };
  const res = await fetch(inviteUrl, options);
  return res;
};

export const fetchGithubUserWithAccessToken = async (token: string) => {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    method: "GET",
  });
  return res.json();
};

export const addressOwnsAnyAmountOfToken = async ({
  owner,
  tokenAddress,
  chainId,
}: {
  owner: Address;
  tokenAddress: Address;
  chainId: number;
}) => {
  const client = getClient(chainId);
  const balance = await client.readContract({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [owner],
  });
  return (balance as bigint) > 0n;
};
