"use client";

import { useSearchParams } from "next/navigation";
import RequestAllowance from "./RequestAllowance";
import GetSignature from "~~/components/GetSignature";

export const App = () => {
  const searchParams = useSearchParams();
  const installationId = searchParams?.get("installation_id");

  if (!installationId) {
    return (
      <div
        className="Home"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h1>Setup Callback</h1>
      </div>
    );
  } else {
    return <RequestAllowance />;
  }
};
