import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import CompetitionCard from "../components/CompetitionCard";
import { NearContext } from "@/wallets/near";
import { getProfile } from "./nomination";
import competitionsData from "../data/competitions.json";
import Select from "react-select";
import { TwitterTweetEmbed } from "react-twitter-embed";
import tweetData from "../data/tweets.json";
import TweetWall from "../components/TweetWall";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/router";

// Use the imported data
const importedCompetitionsData = competitionsData.competitionsData;

const categoryColors = {
  "Overall Concepts": "#FFD700",
  Projects: "#ADFF2F",
  Downbad: "#FF6347",
  "Future Look in 2025": "#87CEEB",
  People: "#FF69B4",
};

// Define a default background and backdrop image
const DEFAULT_BACKGROUND = "/images/default-background.jpg";
const DEFAULT_BACKDROP = "/images/default-backdrop.jpg";

const LandingPage = () => {
  const { wallet } = useContext(NearContext);
  const [profiles, setProfiles] = useState({});
  const [expandedCompetition, setExpandedCompetition] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompetitors, setSelectedCompetitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAllCommentsVisible, setIsAllCommentsVisible] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!wallet) return;

      const uniqueRegistrations = []; // Collect unique registration IDs from your data
      const profilesData = await Promise.all(
        uniqueRegistrations.map(async (id) => {
          try {
            const profile = await getProfile(id);
            return { id, profile };
          } catch {
            return { id, profile: null };
          }
        })
      );

      const profilesMap = profilesData.reduce((acc, { id, profile }) => {
        acc[id] = profile;
        return acc;
      }, {});

      setProfiles(profilesMap);
      setLoading(false);
    };

    fetchProfiles();
  }, [wallet]);

  const toggleCompetition = (id) => {
    setExpandedCompetition(expandedCompetition === id ? null : id);
  };

  const toggleAllComments = () => {
    setIsAllCommentsVisible(!isAllCommentsVisible);
  };

  const categories = [
    "All",
    ...new Set(
      importedCompetitionsData.flatMap((group) =>
        group.competitions.map((comp) => comp.category)
      )
    ),
  ];
  const competitors = [
    "All",
    ...new Set(
      importedCompetitionsData.flatMap((group) =>
        group.competitions.flatMap((comp) =>
          comp.content.map((item) => item.name)
        )
      )
    ),
  ];

  const filteredCompetitions = importedCompetitionsData
    .flatMap((group) => group.competitions)
    .filter(
      (competition) =>
        (selectedCategory === "All" ||
          competition.category === selectedCategory) &&
        (selectedCompetitors.length === 0 ||
          selectedCompetitors.some((competitor) =>
            competition.content.some((item) => item.name === competitor)
          )) &&
        competition.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalCompetitions = importedCompetitionsData.flatMap(
    (group) => group.competitions
  ).length;

  const currentDate = new Date();
  const timelineEvents = [
    {
      title: "NOMINATIONS OPEN",
      start: new Date("2025-01-11"),
      end: new Date("2025-01-25"),
      icon: "🎯",
      description:
        "Submit and support nominations for outstanding projects and individuals",
      steps: [
        "Official nominations and announcement article released",
        "Community members submit nominations and create lists",
        "Projects can register and apply for categories",
      ],
    },
    {
      title: "VOTING ACTIVE",
      start: new Date("2025-01-25"),
      end: new Date("2025-02-04"),
      icon: "🗳️",
      description:
        "Cast your votes for each category with your verified ShardDog NFT",
      steps: [
        "Verified voters can cast votes across categories",
        "Queue multiple votes for efficient participation",
        "Track voting progress in real-time",
      ],
    },
    {
      title: "AWARDS CEREMONY",
      start: new Date("2025-02-02"),
      end: new Date("2025-02-02"),
      icon: "🏆",
      description: "Join the celebration as we announce and honor the winners",
      steps: [
        "Live virtual awards ceremony",
        "Winners receive on-chain recognition",
        "Community celebration and networking",
      ],
    },
  ];

  const isActive = (start, end) => currentDate >= start && currentDate <= end;

  const handleCompetitorChange = (selectedOptions) => {
    setSelectedCompetitors(selectedOptions.map((option) => option.value));
  };

  return (
    <>
      <Head>
        <title>NEAR YEAR Awards - Celebrate the NEAR Ecosystem</title>
        <meta
          name="description"
          content="Join the NEAR YEAR Awards, the premier on-chain event celebrating the NEAR blockchain's top projects and people. Discover future achievements and participate in the ecosystem's growth."
        />
        <meta
          name="keywords"
          content="NEAR, blockchain, awards, ecosystem, projects, people, POTLOCK, NEAR YEAR, on-chain, nominations, voting"
        />
        <meta
          property="og:title"
          content="NEAR YEAR Awards - Celebrate the NEAR Ecosystem"
        />
        <meta
          property="og:description"
          content="Join the NEAR YEAR Awards, the premier on-chain event celebrating the NEAR blockchain's top projects and people. Discover future achievements and participate in the ecosystem's growth."
        />
        <meta property="og:image" content="/NEARYEARMeta.png" />
        <meta property="og:url" content="https://nearyear.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="NEAR YEAR Awards - Celebrate the NEAR Ecosystem"
        />
        <meta
          name="twitter:description"
          content="Join the NEAR YEAR Awards, the premier on-chain event celebrating the NEAR blockchain's top projects and people. Discover future achievements and participate in the ecosystem's growth."
        />
        <meta name="twitter:image" content="/NEARYEARMeta.png" />
        <link rel="canonical" href="https://nearyear.com" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="NEAR YEAR Awards" />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="relative min-h-[75vh] flex items-center justify-center bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-full h-full bg-grid-pattern opacity-[0.03]" />
            {/* Enhanced Spotlight Effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-spotlight-1" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl animate-spotlight-2" />
          </div>

          {/* Award-themed Floating Elements - Enhanced Mobile Responsiveness */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Main Trophy - Centered and Responsive */}
            <div className="trophy-container">
              <span className="trophy text-5xl sm:text-6xl md:text-7xl">
                🏆
              </span>
            </div>

            {/* Medals - Responsive Positioning */}
            <div className="medals-container hidden sm:block">
              <span className="medal text-3xl sm:text-4xl md:text-5xl">🥇</span>
              <span className="medal text-3xl sm:text-4xl md:text-5xl">🥈</span>
              <span className="medal text-3xl sm:text-4xl md:text-5xl">🥉</span>
            </div>

            {/* Stars - Responsive Positioning */}
            <div className="stars-container hidden sm:block">
              <span className="star text-2xl sm:text-3xl md:text-4xl">⭐</span>
              <span className="star text-2xl sm:text-3xl md:text-4xl">✨</span>
              <span className="star text-2xl sm:text-3xl md:text-4xl">💫</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-12 sm:py-16 md:py-24">
            <div className="text-center">
              {/* Award Badge - Responsive */}
              <div className="mb-6 sm:mb-8 flex justify-center">
                <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-100">
                  <span className="text-blue-600 text-xs sm:text-sm font-medium">
                    2024 Edition
                  </span>
                </div>
              </div>

              {/* Title - Responsive */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 font-lodrina">
                <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-teal-500 animate-shimmer">
                  NEAR YEAR AWARDS
                </span>
              </h1>

              {/* Description - Responsive */}
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mt-4 sm:mt-6 mb-8 sm:mb-10 max-w-3xl mx-auto px-4">
                The first annual on-chain awards show celebrating the people and
                projects of NEAR and predicting achievements in the upcoming
                year
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push("/vote")}
                  className="group inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span>Vote Now</span>
                  <span className="ml-2 group-hover:rotate-12 transition-transform duration-200">
                    🗳️
                  </span>
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="group inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-xl shadow-md hover:border-blue-300 hover:text-blue-600 transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span>Create Profile</span>
                  <span className="ml-2 group-hover:scale-110 transition-transform duration-200">
                    👤
                  </span>
                </button>
              </div>

              {/* Enhanced Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16">
                {[
                  { number: "20+", label: "Categories", icon: "🏆" },
                  { number: "100+", label: "Nominees", icon: "⭐" },
                  { number: "1000+", label: "Voters", icon: "👥" },
                  { number: "∞", label: "Possibilities", icon: "✨" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="group bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-200"
                  >
                    <div className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-200">
                      {stat.icon}
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
                      {stat.number}
                    </div>
                    <div className="text-sm sm:text-base text-gray-600">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="max-w-6xl mx-auto px-4 py-16 bg-white rounded-2xl shadow-sm">
          <h2 className="text-3xl font-bold text-center mb-12 font-lodrina">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
              How It Works
            </span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-4">📜</span>
                <h3 className="text-xl font-semibold text-gray-800">
                  On-Chain Lists
                </h3>
              </div>
              <p className="text-gray-600">
                On-chain lists are created for different categories, with
                projects and profiles that have existing on-chain accounts
                automatically added.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-4">🗳️</span>
                <h3 className="text-xl font-semibold text-gray-800">
                  Nominations
                </h3>
              </div>
              <p className="text-gray-600">
                During the nomination period, nominated projects are onboarded
                to the chain, and curators can create their own lists to boost
                new nominees.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-4">🏆</span>
                <h3 className="text-xl font-semibold text-gray-800">
                  Voting & Awards
                </h3>
              </div>
              <p className="text-gray-600">
                During the voting period, verified humans with ShardDog NFTs
                choose the top winners, followed by an awards show.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 font-lodrina">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
                Powered By
              </span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
              {[
                {
                  name: "Potlock",
                  logo: "/potlock.png",
                  url: "http://potlock.org",
                },
                {
                  name: "NEAR Foundation",
                  logo: "/near-logo.svg",
                  url: "https://near.foundation",
                },
                {
                  name: "ShardDog",
                  logo: "/sharddog.png",
                  url: "http://shard.dog",
                },
                {
                  name: "Black Dragon",
                  logo: "/blackdragon.png",
                  url: "https://blackdragon.meme/",
                },
                {
                  name: "NEAR Catalog",
                  logo: "/nearcatalog.png",
                  url: "https://nearcatalog.xyz/",
                },
                {
                  name: "NEARWEEK",
                  logo: "/nearweek.png",
                  url: "http://nearweek.com",
                },
              ].map((partner) => (
                <a
                  key={partner.name}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                >
                  <div className="relative transform transition-all duration-300 group-hover:scale-110">
                    <Image
                      src={partner.logo}
                      alt={`${partner.name} Logo`}
                      width={100}
                      height={100}
                      className="object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-600">
                      {partner.name}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-6 font-lodrina">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
                Award Categories
              </span>
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Browse and discover the categories celebrating excellence across
              the NEAR ecosystem. Projects need to{" "}
              <Link
                href="/register"
                className="text-blue-600
                hover:text-blue-700 underline"
              >
                create a profile
              </Link>{" "}
              to be eligible.
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
              {/* Controls Section */}
              <div className="space-y-6 mb-8">
                {/* Category Filter Pills */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === "All"
                        ? "bg-blue-100 text-blue-700 ring-2 ring-blue-200"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories
                    .filter((cat) => cat !== "All")
                    .map((category, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          selectedCategory === category
                            ? "bg-blue-100 text-blue-700 ring-2 ring-blue-200"
                            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                </div>

                {/* Search and Filter Controls */}
                <div className="grid gap-4 md:grid-cols-[1fr,auto]">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search nominations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 pl-10 rounded-lg bg-white border border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  <button
                    onClick={toggleAllComments}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    {isAllCommentsVisible ? "Collapse All" : "Expand All"}
                  </button>
                </div>

                <Select
                  isMulti
                  placeholder="Filter by nominees..."
                  options={competitors.map((competitor) => ({
                    value: competitor,
                    label: competitor,
                  }))}
                  value={selectedCompetitors.map((competitor) => ({
                    value: competitor,
                    label: competitor,
                  }))}
                  onChange={handleCompetitorChange}
                  className="text-sm"
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "white",
                      borderColor: "#e5e7eb",
                      "&:hover": {
                        borderColor: "#93c5fd",
                      },
                      padding: "2px",
                      boxShadow: "none",
                      "&:focus-within": {
                        borderColor: "#93c5fd",
                        boxShadow: "0 0 0 1px #93c5fd",
                      },
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "#dbeafe",
                      borderRadius: "9999px",
                      padding: "0 4px",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: "#1d4ed8",
                      fontWeight: 500,
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: "#1d4ed8",
                      "&:hover": {
                        backgroundColor: "#bfdbfe",
                        color: "#1e40af",
                      },
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "#6b7280",
                    }),
                  }}
                />
              </div>

              {/* Category Cards Grid */}
              {loading ? (
                <div className="flex justify-center items-center min-h-[200px]">
                  <p>Loading...</p>
                </div>
              ) : filteredCompetitions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCompetitions.map((competition, idx) => {
                    const coverImageUrl =
                      competition.cover_img_url ||
                      "https://i.near.social/magic/large/https://near.social/magic/img/account/null.near";
                    return (
                      <CompetitionCard
                        key={idx}
                        competition={competition}
                        listLink={competition.listLink}
                        profiles={profiles}
                        wallet={wallet}
                        isAllCommentsVisible={isAllCommentsVisible}
                        backdrop={coverImageUrl}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-600 py-12">
                  <p>No categories found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 font-lodrina">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
                Event Timeline
              </span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {timelineEvents.map((event, index) => {
                const isActive =
                  currentDate >= event.start && currentDate <= event.end;
                return (
                  <div
                    key={index}
                    className={`relative bg-white rounded-xl p-6 shadow-md transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg
                      ${
                        isActive
                          ? "ring-2 ring-blue-400"
                          : "border border-gray-100"
                      }`}
                  >
                    {isActive && (
                      <div className="absolute -top-3 right-4 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                        Active Now
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{event.icon}</span>
                      <h3 className="text-xl font-bold text-gray-800">
                        {event.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">
                      {event.start.toLocaleDateString()} -{" "}
                      {event.end.toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 mb-4">{event.description}</p>
                    <ul className="space-y-2">
                      {event.steps.map((step, i) => (
                        <li key={i} className="flex items-start text-gray-600">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 font-lodrina">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
                How to Participate
              </span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-center mb-6">
                  <span className="w-16 h-16 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-2xl">
                    👥
                  </span>
                </div>
                <h3 className="text-xl font-bold text-center mb-6">
                  For Voters
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm mr-3 mt-0.5">
                      1
                    </span>
                    <div>
                      <span className="font-medium">Get Verified</span>
                      <p className="text-gray-600 text-sm mt-1">
                        Obtain a Sharddog I Voted NFT for verification
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm mr-3 mt-0.5">
                      2
                    </span>
                    <div>
                      <span className="font-medium">Vote</span>
                      <p className="text-gray-600 text-sm mt-1">
                        Participate in the voting process during the designated
                        period
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm mr-3 mt-0.5">
                      3
                    </span>
                    <div>
                      <span className="font-medium">Earn Rewards</span>
                      <p className="text-gray-600 text-sm mt-1">
                        Receive an exclusive NEAR YEAR Sharddog NFT for
                        participating
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-center mb-6">
                  <span className="w-16 h-16 flex items-center justify-center bg-teal-100 text-teal-600 rounded-full text-2xl">
                    🏆
                  </span>
                </div>
                <h3 className="text-xl font-bold text-center mb-6">
                  For Curators
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-teal-100 text-teal-600 rounded-full text-sm mr-3 mt-0.5">
                      1
                    </span>
                    <div>
                      <span className="font-medium">Nominate</span>
                      <p className="text-gray-600 text-sm mt-1">
                        Duplicate the list on Potlock and keep the same name
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-teal-100 text-teal-600 rounded-full text-sm mr-3 mt-0.5">
                      2
                    </span>
                    <div>
                      <span className="font-medium">Include Details</span>
                      <p className="text-gray-600 text-sm mt-1">
                        Add project account names from near.social
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-teal-100 text-teal-600 rounded-full text-sm mr-3 mt-0.5">
                      3
                    </span>
                    <div>
                      <span className="font-medium">Share</span>
                      <p className="text-gray-600 text-sm mt-1">
                        Post your list on Twitter tagging{" "}
                        <em>
                          <strong>@potlock_ </strong>
                        </em>
                        <em>
                          <strong>@nearweek </strong>
                        </em>
                        <em>
                          <strong>@nearprotocol </strong>
                        </em>
                        <em>
                          <strong>@nearcatalog </strong>
                        </em>
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-teal-100 text-teal-600 rounded-full text-sm mr-3 mt-0.5">
                      4
                    </span>
                    <div>
                      <span className="font-medium">Self-Nominate</span>
                      <p className="text-gray-600 text-sm mt-1">
                        Create a list entry and notify{" "}
                        <strong>
                          <em>@plugrel</em>
                        </strong>{" "}
                        on Twitter
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-center mb-6">
                  <span className="w-16 h-16 flex items-center justify-center bg-green-100 text-green-600 rounded-full text-2xl">
                    🏗️
                  </span>
                </div>
                <h3 className="text-xl font-bold text-center mb-6">
                  For Projects
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-green-100 text-green-600 rounded-full text-sm mr-3 mt-0.5">
                      1
                    </span>
                    <div>
                      <span className="font-medium">Create Project</span>
                      <p className="text-gray-600 text-sm mt-1">
                        Register on Potlock with a named account that represents
                        your project
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-green-100 text-green-600 rounded-full text-sm mr-3 mt-0.5">
                      2
                    </span>
                    <div>
                      <span className="font-medium">Apply to List</span>
                      <p className="text-gray-600 text-sm mt-1">
                        Tweet at{" "}
                        <em>
                          <strong>@plugrel</strong>
                        </em>{" "}
                        with your Potlock profile and the category name you are
                        applying for
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 font-lodrina">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
                Frequently Asked Questions
              </span>
            </h2>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  question: "Who can participate in the NEAR YEAR Awards?",
                  answer:
                    "Anyone can participate by nominating projects and voting. However, for the vote to count you need a Sharddog 'I NEAR YEAR' NFT for verification.",
                },
                {
                  id: 2,
                  question: "How do I nominate a project or person?",
                  answer:
                    "Create a list on Potlock, include project account names, and share your list on Twitter with #NEARYearAwards tagging @NEARProtocol @potlock_ @nearweek. You can also self-nominate by creating a list entry and notifying @plugrel on Twitter.",
                },
                {
                  id: 3,
                  question: "What are the voting requirements?",
                  answer:
                    "You need a Sharddog 'NEAR YEAR' NFT that represents a unique, verified human identity. List creators receive 2x voting power if verified.",
                },
                {
                  id: 4,
                  question: "What do winners receive?",
                  answer:
                    "Winners receive immutable bragging rights through on-chain recognition. All participants can earn exclusive NEAR YEAR Sharddog NFTs by voting or nominating.",
                },
                {
                  id: 5,
                  question:
                    "My project is listed on the doc but not on listing page.",
                  answer:
                    "This means you need to create a profile on Potlock and then apply to list and tag @plugrel on Twitter. All the existing people on onchain list already had profiles (see who doesn't with the indicated 🟡 emoji).",
                },
              ].map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <button
                    className="w-full px-6 py-4 text-left flex items-center justify-between"
                    onClick={() => toggleCompetition(faq.id)}
                  >
                    <h3 className="text-lg font-medium text-gray-800">
                      {faq.question}
                    </h3>
                    <span
                      className={`transform transition-transform duration-200 ${
                        expandedCompetition === faq.id ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    </span>
                  </button>
                  {expandedCompetition === faq.id && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-6 font-lodrina">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
                What People Are Saying
              </span>
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Join the conversation and share your thoughts on who deserves
              recognition in the NEAR ecosystem
            </p>

            <div className="flex flex-col items-center mb-12">
              <button
                onClick={() =>
                  window.open(
                    "https://x.com/intent/tweet?text=Here%20are%20my%20picks%20for%20the%20NEAR%20Year%20Awards&url=https://x.com/potlock_/status/1877665379318632900",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
                className="inline-flex items-center px-6 py-3 bg-[#1DA1F2] text-white font-medium rounded-xl hover:bg-[#1a8cd8] transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share Your Picks
              </button>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
              <div className="relative">
                <div className="pt-4">
                  <TweetWall />
                </div>
              </div>

              <div className="mt-8 text-center">
                <a
                  href="https://twitter.com/search?q=%23NEARYearAwards"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  View More Discussions
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Updated styles */}
      <style jsx>{`
        .trophy-container {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .trophy {
          position: absolute;
          top: 10%;
          left: 50%;
          transform: translateX(-50%);
          animation: floatTrophy 6s ease-in-out infinite;
          filter: drop-shadow(0 0 15px rgba(234, 179, 8, 0.3));
        }

        .medals-container {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .medal {
          position: absolute;
          animation: floatMedal 8s ease-in-out infinite;
          opacity: 0.7;
        }

        /* Responsive medal positions */
        .medal:nth-child(1) {
          top: 25%;
          left: 10%;
          @media (min-width: 640px) {
            left: 20%;
          }
          animation-delay: 0s;
        }

        .medal:nth-child(2) {
          top: 35%;
          right: 10%;
          @media (min-width: 640px) {
            right: 20%;
          }
          animation-delay: 2s;
        }

        .medal:nth-child(3) {
          bottom: 30%;
          left: 15%;
          @media (min-width: 640px) {
            left: 30%;
          }
          animation-delay: 4s;
        }

        .stars-container {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .star {
          position: absolute;
          animation: rotateStar 10s linear infinite;
          opacity: 0.8;
        }

        /* Responsive star positions */
        .star:nth-child(1) {
          top: 20%;
          right: 15%;
          @media (min-width: 640px) {
            right: 30%;
          }
          animation-delay: 1s;
        }

        .star:nth-child(2) {
          top: 40%;
          left: 10%;
          @media (min-width: 640px) {
            left: 15%;
          }
          animation-delay: 3s;
        }

        .star:nth-child(3) {
          bottom: 25%;
          right: 15%;
          @media (min-width: 640px) {
            right: 25%;
          }
          animation-delay: 5s;
        }

        /* Responsive animations */
        @keyframes floatTrophy {
          0%,
          100% {
            transform: translateX(-50%) translateY(0) rotate(-5deg);
          }
          50% {
            transform: translateX(-50%) translateY(-20px) rotate(5deg);
            @media (min-width: 640px) {
              transform: translateX(-50%) translateY(-30px) rotate(5deg);
            }
          }
        }

        @keyframes floatMedal {
          0%,
          100% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
          50% {
            transform: translateY(-15px) rotate(5deg) scale(1.1);
            @media (min-width: 640px) {
              transform: translateY(-25px) rotate(5deg) scale(1.1);
            }
          }
        }

        @keyframes rotateStar {
          0% {
            transform: rotate(0deg) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: rotate(180deg) scale(1.1);
            opacity: 1;
            @media (min-width: 640px) {
              transform: rotate(180deg) scale(1.2);
            }
          }
          100% {
            transform: rotate(360deg) scale(1);
            opacity: 0.8;
          }
        }
      `}</style>
    </>
  );
};

export default LandingPage;
