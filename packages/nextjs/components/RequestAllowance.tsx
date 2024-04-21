import { useEffect } from "react";
import { parseUnits } from "viem";
import { erc20ABI, useContractWrite, usePrepareContractWrite } from "wagmi";

const RequestAllowance = () => {
  const spender = "0x9129f5D7DFdDBbD2dca57Ad5Fd109b666De2E27c";
  const amount = parseUnits("10", 6);
  const { config } = usePrepareContractWrite({
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    abi: erc20ABI,
    functionName: "approve",
    args: [spender, amount],
  });

  const { isLoading, isSuccess, isError, write } = useContractWrite(config);

  useEffect(() => {
    if (!isLoading && !isSuccess && !isError) write?.();
  }, [write, isLoading, isSuccess, isError]);

  return <div />;
};

export default RequestAllowance;
