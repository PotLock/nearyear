import { useEffect, useState, useContext } from "react";
import { NearContext } from "@/wallets/near";
import { Footer } from "@/components/footer";
import styles from "@/styles/app.module.css";
import Image from "next/image";
import { isListCreator } from "@/utils/voterUtils";
import { FaCheckCircle, FaShare } from "react-icons/fa";
import createSummaryData from "@/data/summary"; // Import the summary data function
import { fetchWhitelistedVoters } from "@/utils/fetchWhitelistedVoters"; // Import the new function

const WhitelistedVoters = () => {
  const { wallet, signedAccountId } = useContext(NearContext);
  const [whitelistedVoters, setWhitelistedVoters] = useState([]);
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [listCreators, setListCreators] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("mostRecent"); // 'mostRecent' or 'leastRecent'
  const [visibleVoters, setVisibleVoters] = useState(10);
  const [filterType, setFilterType] = useState("all"); // 'all', 'listCreator', 'nonListCreator'

  // Function to handle loading more voters on scroll
  const loadMoreVoters = () => {
    setVisibleVoters((prevVisibleVoters) => prevVisibleVoters + 10);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      )
        return;
      loadMoreVoters();
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const { owners, isWhitelisted } = await fetchWhitelistedVoters(
          wallet,
          signedAccountId
        );
        setWhitelistedVoters(owners);
        setIsWhitelisted(isWhitelisted);

        // Calculate dynamic values
        const totalCategories = 20; // Replace with actual logic if needed
        const totalNominees = owners.length; // Assuming each owner is a nominee
        const totalVoters = owners.length; // Assuming each owner is a voter

        // Create summary data
        const summaryData = createSummaryData(
          totalCategories,
          totalNominees,
          totalVoters
        );
        console.log(summaryData); // You can use this data as needed

        // Check if each owner is a list creator
        const listCreatorStatus = await Promise.all(
          owners.map(async (owner) => {
            const isCreator = await isListCreator(wallet, owner);
            return { owner, isListCreator: isCreator };
          })
        );

        const listCreatorsMap = listCreatorStatus.reduce(
          (acc, { owner, isListCreator }) => {
            acc[owner] = isListCreator;
            return acc;
          },
          {}
        );

        setListCreators(listCreatorsMap);
      } catch (error) {
        console.error("Error fetching whitelisted voters:", error);
      }
    };

    fetchVoters();
  }, [signedAccountId, wallet]);

  const ProfileCard = ({ accountId }) => {
    const [isError, setIsError] = useState(false);

    const handleImageError = () => {
      if (!isError) {
        setIsError(true);
      }
    };

    const clippedAccountId =
      accountId.length > 15
        ? `${accountId.slice(0, 6)}...${accountId.slice(-6)}`
        : accountId;

    const isListCreator = listCreators[accountId];

    return (
      <div
        className={`p-4 border rounded-lg shadow-md hover:shadow-lg transition cursor-pointer ${
          isListCreator ? "bg-green-100" : ""
        }`}
        onClick={() =>
          window.open(
            `https://near.social/mob.near/widget/MyPage?accountId=${accountId}`,
            "_blank"
          )
        }
      >
        <div className="flex items-center">
          <Image
            src={
              isError
                ? `https://robohash.org/${accountId}.png`
                : `https://i.near.social/magic/thumbnail/https://near.social/magic/img/account/${accountId}`
            }
            alt={accountId}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full border-4 border-blue-100"
            onError={handleImageError}
          />
          <p className="ml-4 flex items-center">
            {clippedAccountId}
            {isListCreator && <FaCheckCircle className="ml-2 text-green-500" />}
          </p>
        </div>
      </div>
    );
  };

  const filteredVoters = whitelistedVoters
    .filter((owner) => {
      if (filterType === "listCreator") {
        return listCreators[owner];
      } else if (filterType === "nonListCreator") {
        return !listCreators[owner];
      }
      return true; // 'all'
    })
    .filter((owner) => owner.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === "mostRecent") {
        return whitelistedVoters.indexOf(a) - whitelistedVoters.indexOf(b);
      } else {
        return whitelistedVoters.indexOf(b) - whitelistedVoters.indexOf(a);
      }
    });

  const generateTweetText = () => {
    let tweetText = "";
    if (isWhitelisted) {
      tweetText = "I am a registered voter";
      if (listCreators[signedAccountId]) {
        tweetText += " (with 2x voter power as a list creator)";
      }
      tweetText += ". ";
    }
    tweetText +=
      "Sign up to vote for the first on-chain NEAR awards, NEAR YEAR at shard.dog/nearyear @sharddog @Nearweek @potlock_ @nearcatalog @dragonisnear @nearprotocol.";

    return tweetText;
  };

  const shareOnTwitter = () => {
    const tweetText = generateTweetText();
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}`;
    window.open(twitterUrl, "_blank");
  };

  return (
    <div className={styles.main}>
      <header className="text-center m-0 p-0">
        <h1 className="text-3xl font-bold mb-4">Whitelisted Voters</h1>
        <p className="text-lg">
          Total Unique Whitelisted Voters: {whitelistedVoters.length} | List
          Creators: {Object.values(listCreators).filter(Boolean).length}
        </p>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded mb-4 w-full text-gray-700"
        />
        <div className="flex justify-center items-center mb-4">
          <button
            onClick={() =>
              setSortOrder(
                sortOrder === "mostRecent" ? "leastRecent" : "mostRecent"
              )
            }
            className="ml-4 p-2 bg-blue-500 text-white rounded transition duration-300 ease-in-out transform hover:scale-105 flex items-center font-londrina"
          >
            Sort: {sortOrder === "mostRecent" ? "Most Recent" : "Least Recent"}
            <svg
              className={`w-4 h-4 ml-2 ${
                sortOrder === "mostRecent" ? "transform rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 15l7-7 7 7"
              ></path>
            </svg>
          </button>
          <div className="flex justify-center ml-4">
            <button
              onClick={() => setFilterType("all")}
              className={`p-2 mx-2 ${
                filterType === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
              } font-londrina`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("listCreator")}
              className={`p-2 mx-2 ${
                filterType === "listCreator"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              } font-londrina`}
            >
              List Creators
            </button>
            <button
              onClick={() => setFilterType("nonListCreator")}
              className={`p-2 mx-2 ${
                filterType === "nonListCreator"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              } font-londrina`}
            >
              Non-List Creators
            </button>
          </div>
        </div>
        <div className="text-left mb-4">
          <div className="text-sm flex items-center">
            <span className="inline-block w-4 h-4 bg-green-100 mr-2"></span> +
            <FaCheckCircle className="inline-block text-green-500 mx-2" /> =
            list creator
          </div>
        </div>
        {!signedAccountId && (
          <div className="mt-4">
            <p className="text-red-600">Please log in to see your status.</p>
            <button
              onClick={() =>
                window.open("https://shard.dog/nearyear", "_blank")
              }
              className="mt-2 p-2 bg-blue-500 text-white rounded transition duration-300 ease-in-out transform hover:scale-105"
            >
              Get your Sharddog NFT
            </button>
            <button
              onClick={() =>
                window.open("https://example.com/create-list", "_blank")
              }
              className="mt-2 p-2 bg-blue-500 text-white rounded transition duration-300 ease-in-out transform hover:scale-105"
            >
              Create a List
            </button>
          </div>
        )}
        {signedAccountId && !isWhitelisted && (
          <p className="text-red-600">
            You are not whitelisted. Please get your NFT at{" "}
            <a
              href="https://shard.dog/nearyear"
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              shard.dog/nearyear
            </a>
            .
          </p>
        )}
        {signedAccountId && !listCreators[signedAccountId] && (
          <div className="mt-4">
            <p className="text-red-600">
              You are not a list creator. Please{" "}
              <a
                href="/nomination"
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                create a list
              </a>
              .
            </p>
          </div>
        )}
        {signedAccountId && (
          <button
            onClick={shareOnTwitter}
            className="mt-2 p-2 bg-blue-500 text-white rounded transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
          >
            <FaShare className="mr-2" /> Share as Tweet
          </button>
        )}
      </header>
      <div className="w-full max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredVoters.slice(0, visibleVoters).length > 0 ? (
          filteredVoters
            .slice(0, visibleVoters)
            .map((owner, index) => (
              <ProfileCard key={index} accountId={owner} />
            ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No voters found.
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default WhitelistedVoters;
