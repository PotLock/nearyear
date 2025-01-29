import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

import "@/styles/globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Navigation } from "@/components/navigation";

import { Wallet, NearContext } from "@/wallets/near";
import { NetworkId, VoteContract } from "@/config";
import { VotingQueueProvider } from "@/context/VotingQueueContext";
import { VotingQueueDrawer } from "@/components/VotingQueueDrawer";

const wallet = new Wallet({ networkId: NetworkId });

export default function MyApp({ Component, pageProps }) {
  const [signedAccountId, setSignedAccountId] = useState("");

  useEffect(() => {
    wallet.startUp(setSignedAccountId);
  }, []);

  return (
    <VotingQueueProvider>
      <Toaster />
      <NearContext.Provider value={{ wallet, signedAccountId }}>
        <Navigation />
        <Component {...pageProps} />
        <VotingQueueDrawer wallet={wallet} VoteContract={VoteContract} />
      </NearContext.Provider>
    </VotingQueueProvider>
  );
}
