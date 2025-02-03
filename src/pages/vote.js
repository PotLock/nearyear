import { useEffect, useState, useContext } from "react";
import { NearContext } from "@/wallets/near";
import Link from "next/link";
import { useRouter } from "next/router";
import { VoteContract } from "../config";
import { Footer } from "@/components/footer";
import dynamic from "next/dynamic";
import {
  Podcast,
  Award,
  Zap,
  Briefcase,
  Smile,
  Network,
  LineChart,
  Crown,
  HeartHandshake,
  Video,
  Rocket,
  DollarSign,
  Frame,
  Shield,
  Coins,
  Sparkles,
  GitBranch,
  Users,
  BookOpen,
  RefreshCcw,
  Database,
} from "lucide-react";
import { useVotingQueue } from "@/context/VotingQueueContext";
import toast from "react-hot-toast";
import { isListCreator, isValidVoter } from "@/utils/voterUtils";

// Dynamically import the NomineePage component
const NomineePage = dynamic(() => import("./category/[id]"), {
  ssr: false,
});

export default function VotePage() {
  const router = useRouter();
  const { id } = router.query;
  const { wallet } = useContext(NearContext);
  const { queue } = useVotingQueue();
  const { signedAccountId } = useContext(NearContext);
  const [categories, setCategories] = useState([]);
  const [showCategoriesOnMobile, setShowCategoriesOnMobile] = useState(true);
  const [votedCategories, setVotedCategories] = useState(new Set());
  const [isQualifiedVoter, setIsQualifiedVoter] = useState(false);
  const [hasCreatedList, setHasCreatedList] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (!wallet) return;

    const fetchCategories = async () => {
      try {
        const data = await wallet.viewMethod({
          contractId: VoteContract,
          method: "get_elections",
        });
        setCategories(data);

        // Always default to first category if no id is selected
        if (!router.query.id) {
          router.push("/vote?id=1");
        }
      } catch (error) {
        console.log("Error fetching categories", error);
        toast.error("Failed to fetch categories. Please try again later.");
      }
    };

    fetchCategories();
  }, [wallet]);

  // Initial fetch of voted categories
  useEffect(() => {
    if (!wallet || !signedAccountId || !categories.length) return;

    const fetchInitialVoteStatus = async () => {
      const promises = categories.map((category) =>
        wallet.viewMethod({
          contractId: VoteContract,
          method: "has_voter_participated",
          args: {
            election_id: Number(category.id),
            voter: signedAccountId,
          },
        })
      );

      try {
        const results = await Promise.all(promises);
        const voted = new Set(
          categories
            .filter((_, index) => results[index])
            .map((c) => c.id.toString())
        );
        setVotedCategories(voted);
      } catch (error) {
        console.error("Error fetching vote status:", error);
      }
    };

    fetchInitialVoteStatus();
  }, [wallet, signedAccountId, categories]); // Add categories as dependency

  // Add effect to listen for both vote and queue updates
  useEffect(() => {
    const handleVoteUpdate = () => {
      if (wallet && signedAccountId) {
        fetchVotedCategories();
      }
    };

    const handleQueueUpdate = () => {
      // Force re-render when queue changes
      setCategories((prev) => [...prev]);
    };

    window.addEventListener("voteUpdate", handleVoteUpdate);
    window.addEventListener("queueUpdate", handleQueueUpdate);

    return () => {
      window.removeEventListener("voteUpdate", handleVoteUpdate);
      window.removeEventListener("queueUpdate", handleQueueUpdate);
    };
  }, [wallet, signedAccountId]);

  // Move fetchVotedCategories outside useEffect for reusability
  const fetchVotedCategories = async () => {
    if (!wallet || !signedAccountId || !categories.length) return;

    const promises = categories.map((category) =>
      wallet.viewMethod({
        contractId: VoteContract,
        method: "has_voter_participated",
        args: {
          election_id: Number(category.id),
          voter: signedAccountId,
        },
      })
    );

    const results = await Promise.all(promises);
    const voted = new Set(
      categories
        .filter((_, index) => results[index])
        .map((c) => c.id.toString())
    );
    setVotedCategories(voted);
  };

  // Update the existing categories effect
  useEffect(() => {
    if (!wallet || !signedAccountId) return;
    fetchVotedCategories();
  }, [wallet, categories, signedAccountId]);

  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
    if (id && isMobile) {
      setShowCategoriesOnMobile(false);
    }
  }, [id]);

  // Add new useEffect for voter status checks
  useEffect(() => {
    if (!wallet || !signedAccountId) {
      setShowNotification(true);
    } else {
      setShowNotification(false);
    }

    const checkListCreator = async (accountId) => {
      if (!accountId) return;
      const isCreator = await isListCreator(wallet, accountId);
      setHasCreatedList(isCreator);
    };

    const checkQualifiedVoter = async () => {
      const isValid = await isValidVoter(signedAccountId);
      setIsQualifiedVoter(isValid);
    };

    checkListCreator(signedAccountId);
    checkQualifiedVoter();
  }, [wallet, signedAccountId]);

  const getCategoryIcon = (categoryId) => {
    const icons = {
      1: Podcast, // Top NEAR Yapper
      2: Zap, // Most Cracked NEAR Dev
      3: Briefcase, // BEST BD at NF
      4: Smile, // BEST VIBE ON NEAR
      5: Network, // MOST LIKELY TO BE INVOLVED WITH PROJECTS
      6: LineChart, // BEST DATA ANALYST
      7: Crown, // COOLEST FOUNDER
      8: HeartHandshake, // MOST HELPFUL NEARIAN
      9: Video, // BEST CONTENT CREATORS
      10: Rocket, // MOST ANTICIPATED TOKEN LAUNCH
      11: DollarSign, // BEST DeFI Project
      12: Frame, // BEST NFT Platform
      13: Shield, // BEST PRIVACY PROJECT
      14: Coins, // Best NEAR Token
      15: Sparkles, // Best New Token
      16: GitBranch, // BEST Multichain Expansion
      17: Users, // Best NEAR DAO
      18: BookOpen, // BEST Open Source Projects
      19: RefreshCcw, // BEST PIVOT
      20: Database, // BEST Infrastructure
    };
    const IconComponent = icons[categoryId] || Award;
    return <IconComponent className="w-6 h-6" />;
  };

  const truncateTitle = (title, maxLength = 30) => {
    if (title.length <= maxLength) return title;
    return `${title.substring(0, maxLength)}...`;
  };

  const getVotingStatus = (startDate, endDate) => {
    const now = Date.now();
    if (now < parseInt(startDate)) {
      return {
        status: "NOT_STARTED",
        color: "yellow",
        text: "Coming Soon",
      };
    } else if (now > parseInt(endDate)) {
      return {
        status: "ENDED",
        color: "red",
        text: "Voting Closed",
      };
    }
    return {
      status: "ACTIVE",
      color: "green",
      text: "Vote Now",
    };
  };

  const getCategoryStatus = (categoryId) => {
    const hasVoted = votedCategories.has(categoryId.toString());
    const queueData =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("votingQueue") || "[]")
        : [];
    const isQueued = queueData.some(
      (item) => Number(item.categoryId) === Number(categoryId)
    );

    if (hasVoted) {
      return {
        icon: "✓",
        text: "Vote Cast",
        className: "bg-emerald-100 border border-emerald-200 text-emerald-700",
      };
    }
    if (isQueued) {
      return {
        icon: "●",
        text: "In Queue",
        className: "bg-blue-100 border border-blue-200 text-blue-700",
      };
    }
    return null;
  };

  return (
    <div className="flex flex-col bg-gray-50">
      <header className="py-4 bg-white border-b border-gray-200">
        {/* Show message for non-qualified voters */}
        {!isQualifiedVoter && (
          <div className="text-center text-gray-600 mb-4 bg-blue-50 py-2 px-4 rounded-lg mx-auto max-w-2xl border border-blue-100">
            <div className="flex items-center justify-center gap-2 text-blue-800">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                To participate in voting, you need to
                <Link
                  href="https://shard.dog/nearyear"
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800 font-medium hover:underline mx-1 transition-colors duration-200"
                >
                  register as a qualified voter
                </Link>
                first. List creators get 2x voting power!
              </span>
            </div>
          </div>
        )}

        {/* Show message for qualified voters who aren't list creators */}
        {isQualifiedVoter && !hasCreatedList && (
          <div className="text-center text-gray-600 mb-4 bg-blue-50 py-2 px-4 rounded-lg mx-auto max-w-2xl border border-blue-100">
            <div className="flex items-center justify-center gap-2 text-blue-800">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Want to double your voting power?
                <Link
                  href="/nomination"
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800 font-medium hover:underline mx-1 transition-colors duration-200"
                >
                  Create a list
                </Link>
                to get 2x voting power!
              </span>
            </div>
          </div>
        )}

        {/* Show message for list creators who aren't qualified voters */}
        {!isQualifiedVoter && hasCreatedList && (
          <div className="text-center text-gray-600 mb-4 bg-blue-50 py-2 px-4 rounded-lg mx-auto max-w-2xl border border-blue-100">
            <div className="flex items-center justify-center gap-2 text-blue-800">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                You&apos;re a list creator!
                <Link
                  href="https://shard.dog/nearyear"
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800 font-medium hover:underline mx-1 transition-colors duration-200"
                >
                  Register as a qualified voter
                </Link>
                to start using your 2x voting power.
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 px-4">
          <span
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 w-full sm:w-auto justify-center ${
              isQualifiedVoter
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 hover:shadow-sm cursor-pointer group"
            }`}
          >
            {isQualifiedVoter ? (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Qualified Voter</span>
              </>
            ) : (
              <Link
                href="https://shard.dog/nearyear"
                target="_blank"
                className="flex items-center justify-center w-full"
              >
                <svg
                  className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span>Become a Qualified Voter</span>
              </Link>
            )}
          </span>
          <span
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 w-full sm:w-auto justify-center ${
              hasCreatedList
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 hover:shadow-sm cursor-pointer group"
            }`}
          >
            {hasCreatedList ? (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>List Creator (2x voting power)</span>
              </>
            ) : (
              <Link
                href="/nomination"
                target="_blank"
                className="flex items-center justify-center w-full"
              >
                <svg
                  className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span>Create a List</span>
              </Link>
            )}
          </span>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1">
        {/* Left Sidebar - Now toggleable on mobile */}
        <div
          className={`lg:w-[400px] bg-white border-b lg:border-r border-gray-200 relative lg:h-[calc(100vh-214px)] overflow-y-auto
            ${showCategoriesOnMobile ? "block" : "hidden lg:block"}`}
        >
          <div className="p-4 lg:p-6">
            <h2 className="text-xl font-semibold mb-4 lg:mb-6">
              Award Categories
            </h2>
            <nav className="space-y-2 max-w-lg mx-auto pb-[72px] lg:pb-0">
              {categories.map((category) => {
                const { status, color, text } = getVotingStatus(
                  category.start_date,
                  category.end_date
                );
                const categoryStatus = getCategoryStatus(category.id);

                return (
                  <Link
                    key={category.id}
                    href={`/vote?id=${category.id}`}
                    className={`flex flex-col p-3 lg:p-4 rounded-lg transition-colors ${
                      id === category.id.toString()
                        ? "bg-blue-50 text-blue-600 ring-1 ring-blue-200"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3 lg:space-x-4 mb-2">
                      <div className="flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gray-900 text-white flex items-center justify-center">
                        {getCategoryIcon(category.id)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium truncate text-sm lg:text-base">
                            {truncateTitle(category.title)}
                          </span>
                          {categoryStatus && (
                            <span
                              className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full whitespace-nowrap font-medium ${categoryStatus.className}`}
                            >
                              <span className="mr-1">
                                {categoryStatus.icon}
                              </span>
                              {categoryStatus.text}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description - Now visible on all screens */}
                    <p className="text-sm text-gray-600 line-clamp-2 ml-11 lg:ml-14">
                      {category.description || "No description available"}
                    </p>

                    {/* Voting Status */}
                    <div
                      className={`ml-11 lg:ml-14 mt-2 inline-flex items-center ${
                        color === "yellow"
                          ? "text-yellow-600"
                          : color === "red"
                          ? "text-red-600"
                          : "text-green-600"
                      } text-xs lg:text-sm`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          color === "yellow"
                            ? "bg-yellow-500"
                            : color === "red"
                            ? "bg-red-500"
                            : "bg-green-500"
                        } mr-2`}
                      />
                      <span className="whitespace-nowrap">{text}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div
          className={`w-full lg:ml-4 ${
            !showCategoriesOnMobile ? "block" : "hidden lg:block"
          }`}
        >
          <div className="lg:fixed lg:w-[calc(100%-24rem)] lg:h-[calc(100vh-214px)] overflow-y-auto bg-gray-50">
            <div className="p-4 lg:p-8 pb-16">
              <NomineePage
                key={id}
                onBackClick={() => setShowCategoriesOnMobile(true)}
                isMobileView={!showCategoriesOnMobile}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
