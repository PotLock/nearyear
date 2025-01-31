import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

import "@/styles/globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";

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
        <Navbar />
        <Component {...pageProps} />
        <VotingQueueDrawer wallet={wallet} VoteContract={VoteContract} />
        <Footer />
      </NearContext.Provider>
    </VotingQueueProvider>
  );
}
