import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { NearContext } from "@/wallets/near";
import styles from "@/styles/app.module.css";
import Link from "next/link";
import confetti from "canvas-confetti";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { FaShare } from "react-icons/fa";

import { VoteContract } from "../../config";

import { ChevronLeft, Clock, Award } from "lucide-react";
import { voteForNominees } from "@/utils/voting";
import { useVotingQueue } from "@/context/VotingQueueContext";

const ProfileImage = ({ accountId }) => {
  const [isError, setIsError] = useState(false);

  const handleImageError = () => {
    if (!isError) {
      setIsError(true);
    }
  };

  return (
    <Image
      src={
        isError
          ? `https://robohash.org/${accountId}.png`
          : `https://i.near.social/magic/thumbnail/https://near.social/magic/img/account/${accountId}`
      }
      alt={accountId}
      width={96}
      height={96}
      className="w-24 h-24 rounded-full border-4 border-blue-100"
      onError={handleImageError}
    />
  );
};

const truncateAccountId = (accountId, maxLength = 20) => {
  if (accountId.length <= maxLength) return accountId;
  const start = accountId.slice(0, maxLength - 3);
  return `${start}...`;
};

const formatAccountId = (accountId) => {
  const suffixes = [".candidate.nearawards.near", ".nearawards.near"];
  const matchedSuffix = suffixes.find((suffix) => accountId.endsWith(suffix));

  if (matchedSuffix) {
    const baseId = accountId.slice(0, -matchedSuffix.length);
    return baseId
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
  return accountId;
};

const NomineePage = () => {
  const router = useRouter();
  const { id, transactionHashes, errorCode, errorMessage } = router.query;
  const { wallet, signedAccountId } = useContext(NearContext);
  const [nominees, setNominees] = useState([]);
  const [votingFor, setVotingFor] = useState(null);
  const [electionData, setElectionData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [winners, setWinners] = useState([]);
  const { addToQueue, removeFromQueue, queue } = useVotingQueue();
  const [queuedNominee, setQueuedNominee] = useState(null);

  const checkVoteStatus = async () => {
    if (!wallet || !id || !signedAccountId) return;

    const hasParticipated = await wallet.viewMethod({
      contractId: VoteContract,
      method: "has_voter_participated",
      args: {
        election_id: Number(id),
        voter: signedAccountId,
      },
    });
    setHasVoted(hasParticipated);
  };

  useEffect(() => {
    if (!wallet || !id || !signedAccountId) return;
    checkVoteStatus();
  }, [wallet, id, signedAccountId]);

  useEffect(() => {
    if (transactionHashes && !errorCode) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      toast.success("Vote submitted successfully!", {
        duration: 4000,
        position: "top-center",
      });

      checkVoteStatus();
    }
  }, [transactionHashes, errorCode]);

  useEffect(() => {
    if (errorCode && errorMessage) {
      toast.error(decodeURIComponent(errorMessage), {
        duration: 4000,
        position: "bottom-center",
      });
    }
  }, [errorCode, errorMessage]);

  useEffect(() => {
    if (!wallet || !id) return;

    const fetchElectionData = async () => {
      const data = await wallet.viewMethod({
        contractId: VoteContract,
        method: "get_election",
        args: { election_id: Number(id) },
      });
      setElectionData(data);
    };

    const fetchNominees = async () => {
      const nominees = await wallet.viewMethod({
        contractId: VoteContract,
        method: "get_election_candidates",
        args: { election_id: Number(id) },
      });
      setNominees(nominees);
      setWinners(getWinners(nominees));
    };

    fetchElectionData();
    fetchNominees();
  }, [wallet, id]);

  useEffect(() => {
    if (!electionData) return;

    const calculateTimeLeft = () => {
      const now = Date.now();
      const endDate = parseInt(electionData.end_date);
      const startDate = parseInt(electionData.start_date);

      if (now < startDate) {
        return { status: "NOT_STARTED", timeLeft: startDate - now };
      } else if (now > endDate) {
        return { status: "ENDED", timeLeft: 0 };
      }
      return { status: "ACTIVE", timeLeft: endDate - now };
    };

    const timer = setInterval(() => {
      const { status, timeLeft } = calculateTimeLeft();
      setTimeLeft({ status, timeLeft });
    }, 1000);

    return () => clearInterval(timer);
  }, [electionData]);

  useEffect(() => {
    if (timeLeft?.status === "ENDED" && nominees.length > 0) {
      const maxVotes = Math.max(...nominees.map((n) => n.votes_received));
      // Only set winners if there were actual votes
      if (maxVotes > 0) {
        const winningNominees = nominees.filter(
          (n) => n.votes_received === maxVotes
        );
        setWinners(winningNominees);
      }
    }
  }, [timeLeft, nominees]);

  useEffect(() => {
    const handleQueueUpdate = () => {
      if (!queue || queue.length === 0) {
        // Explicitly handle empty queue case
        setQueuedNominee(null);
        return;
      }

      const alreadyQueued = queue.find((item) => item.categoryId === id);
      if (alreadyQueued) {
        setQueuedNominee(alreadyQueued.candidateId);
      } else {
        setQueuedNominee(null);
      }
    };

    // Initial check
    handleQueueUpdate();

    // Subscribe to queue updates
    window.addEventListener("queueUpdate", handleQueueUpdate);

    return () => {
      window.removeEventListener("queueUpdate", handleQueueUpdate);
    };
  }, [queue, id]);

  const formatTimeLeft = (ms) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const handleVoting = async (candidates) => {
    setVotingFor("multiple");
    try {
      await voteForNominees({
        wallet,
        VoteContract,
        candidateData: candidates,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setVotingFor(null);
    }
  };

  const handleAddToQueue = (nominee) => {
    addToQueue({
      candidateId: nominee.account_id,
      categoryId: id,
      categoryTitle: electionData?.title,
    });
    setQueuedNominee(nominee.account_id);
  };

  const handleUnqueue = (categoryId) => {
    removeFromQueue(categoryId);
  };

  const renderWinnerAnnouncement = () => {
    if (winners.length === 0) {
      return (
        <div className="mb-8 p-6 bg-gray-50 rounded-xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              No Votes Cast
            </h2>
            <p className="text-gray-600">
              This category ended without any votes being cast.
            </p>
          </div>
        </div>
      );
    }

    if (!winners.length) return null;

    return (
      <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Award className="w-12 h-12 text-yellow-600" />
          <h2 className="text-2xl font-bold text-yellow-800">
            {winners.length === 1 ? "Winner Announced!" : "Tied Winners!"}
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {winners.map((winner) => (
              <div
                key={winner.account_id}
                className="flex items-center space-x-4 bg-white p-4 rounded-lg"
              >
                <Image
                  src={`https://robohash.org/${winner.account_id}.png`}
                  alt={winner.account_id}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full border-4 border-yellow-200"
                />
                <div className="text-center">
                  <p className="text-lg font-semibold text-yellow-900">
                    {winner.account_id}
                  </p>
                  <p className="text-yellow-700">
                    {winner.votes_received} votes
                  </p>
                </div>
              </div>
            ))}
          </div>
          {winners.length > 1 && (
            <p className="text-yellow-700 text-center">
              These nominees tied for first place with{" "}
              {winners[0].votes_received} votes each!
            </p>
          )}
        </div>
      </div>
    );
  };

  const getWinners = (nominees) => {
    if (!nominees.length) return [];

    // Get the highest vote count
    const maxVotes = Math.max(...nominees.map((n) => n.votes_received));
    if (maxVotes === 0) return [];

    // Get all nominees with the highest vote count (could be multiple in case of tie)
    const winners = nominees.filter((n) => n.votes_received === maxVotes);

    return winners;

    // return {
    //   winners,
    //   isTie: winners.length > 1,
    //   voteCount: maxVotes
    // };
  };

  const getTweetText = () => {
    const categoryName = electionData?.title || "this category";
    const votingStatus =
      timeLeft?.status === "ACTIVE"
        ? "Voting is Live Now!"
        : `Voting starts on Friday Jan 24`;

    return `Check out the NEAR YEAR awards, the inaugural annual on-chain competition.   "${categoryName}": ${votingStatus}`;
  };

  const handleShareClick = () => {
    const tweetText = encodeURIComponent(getTweetText());
    const url = encodeURIComponent(`https://nearyear.com${router.asPath}`);
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${url}`;
    window.open(tweetUrl, "_blank");
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 mb-16">
      <div className="flex items-center mb-8">
        <Link href="/vote" passHref>
          <button className="flex items-center text-gray-600 hover:text-gray-900">
            <ChevronLeft className="w-6 h-6 mr-2" />
            Back to Categories
          </button>
        </Link>
      </div>

      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">
          {electionData?.title || "Loading..."}
        </h1>
        <div className="flex flex-col items-center justify-center space-y-2">
          <div
            className={`flex items-center justify-center space-x-2 ${
              timeLeft?.status === "ACTIVE"
                ? "text-green-600"
                : timeLeft?.status === "NOT_STARTED"
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            <Clock className="w-5 h-5" />
            <span>
              {timeLeft?.status === "ACTIVE" && "Voting Active"}
              {timeLeft?.status === "NOT_STARTED" && (
                <>
                  Voting Not Started.
                  <a
                    href="https://shard.dog/nearyear"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get On the Voter Whitelist Here
                  </a>
                </>
              )}
              {timeLeft?.status === "ENDED" && "Voting Ended"}
            </span>
          </div>
          {timeLeft?.timeLeft > 0 && (
            <div className="text-gray-600 font-mono">
              {timeLeft?.status === "NOT_STARTED" ? "Starts in: " : "Ends in: "}
              {formatTimeLeft(timeLeft.timeLeft)}
            </div>
          )}
        </div>
        <button
          onClick={handleShareClick}
          className="mt-4 flex items-center text-blue-500 hover:text-blue-700"
        >
          <FaShare className="w-5 h-5 mr-2" />
          Share on Twitter
        </button>
      </header>

      {timeLeft?.status === "ENDED" && renderWinnerAnnouncement()}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {nominees.map((nominee) => (
          <div
            key={nominee.account_id}
            className={`bg-white rounded-xl shadow-lg overflow-hidden ${
              timeLeft?.status === "ENDED" &&
              winners.some((w) => w.account_id === nominee.account_id)
                ? "ring-2 ring-yellow-400"
                : ""
            }`}
          >
            {timeLeft?.status === "ENDED" &&
              winners.some((w) => w.account_id === nominee.account_id) && (
                <div className="bg-yellow-100 py-2 px-4 text-center">
                  <span className="text-yellow-800 font-semibold flex items-center justify-center">
                    <Award className="w-4 h-4 mr-2" />
                    {winners.length === 1 ? "Winner" : "Tied Winner"}
                  </span>
                </div>
              )}
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <ProfileImage accountId={nominee.account_id} />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2 break-words overflow-wrap-anywhere px-2">
                {formatAccountId(nominee.account_id)}
              </h3>
              <div className="flex justify-center items-center mb-4">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {nominee.votes_received} votes
                </div>
              </div>
              <div className="flex gap-2 items-center justify-between w-full mt-6">
                <button
                  onClick={() =>
                    queuedNominee === nominee.account_id
                      ? handleUnqueue(id)
                      : handleAddToQueue(nominee)
                  }
                  disabled={
                    timeLeft?.status !== "ACTIVE" ||
                    hasVoted ||
                    (queuedNominee !== null &&
                      queuedNominee !== nominee.account_id)
                  }
                  className={`w-fit inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    queuedNominee === nominee.account_id
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : timeLeft?.status !== "ACTIVE" ||
                        hasVoted ||
                        queuedNominee !== null
                      ? "bg-gray-500 text-white opacity-75 cursor-not-allowed"
                      : "bg-white border-2 border-black hover:text-gray-400 hover:scale-105 transform"
                  }`}
                >
                  {queuedNominee === nominee.account_id ? (
                    <>
                      <span className="mr-2">×</span>
                      Unqueue
                    </>
                  ) : (
                    "+ Queue"
                  )}
                </button>
                <button
                  onClick={() =>
                    handleVoting({
                      candidateId: nominee.account_id,
                      categoryId: id,
                    })
                  }
                  disabled={
                    votingFor === nominee.account_id ||
                    timeLeft?.status !== "ACTIVE" ||
                    hasVoted ||
                    queuedNominee !== null
                  }
                  className={`w-fit inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    timeLeft?.status !== "ACTIVE" ||
                    hasVoted ||
                    queuedNominee !== null
                      ? "bg-gray-500 text-white opacity-75 cursor-not-allowed"
                      : "bg-white border-2 border-black hover:text-gray-400 hover:scale-105 transform"
                  }`}
                >
                  {votingFor === nominee.account_id ? (
                    <div
                      className="animate-spin rounded-full h-4 w-4 border-2
                      border-white mr-2"
                    />
                  ) : (
                    <Award className="w-4 h-4 mr-2" />
                  )}
                  {votingFor === nominee.account_id ? "Voting..." : "Vote"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NomineePage;
