import { useEffect, useState, useContext } from 'react';
import { NearContext } from '@/wallets/near';
import { Footer } from '@/components/footer';
import styles from '@/styles/app.module.css';
import Image from 'next/image';

const WhitelistedVoters = () => {
  const { wallet, signedAccountId } = useContext(NearContext);
  const [whitelistedVoters, setWhitelistedVoters] = useState([]);
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [listCreators, setListCreators] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('mostRecent'); // 'mostRecent' or 'leastRecent'

  useEffect(() => {
    const fetchWhitelistedVoters = async () => {
      const query = `
        query MyQuery {
          mb_views_nft_owned_tokens(
            where: {
              nft_contract_id: { _eq: "claim.sharddog.near" },
              token_id: { _regex: "^151:" }
            }
          ) {
            owner
          }
        }
      `;

      try {
        const response = await fetch("https://graph.mintbase.xyz/mainnet", {
          method: "POST",
          headers: {
            "mb-api-key": "omni-site",
            "Content-Type": "application/json",
            "x-hasura-role": "anonymous",
          },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const owners = [...new Set(data.data.mb_views_nft_owned_tokens.map(token => token.owner))];
        setWhitelistedVoters(owners);
        setIsWhitelisted(owners.includes(signedAccountId));

        // Check if each owner is a list creator
        const listCreatorStatus = await Promise.all(
          owners.map(async (owner) => {
            const lists = await wallet.viewMethod({
              contractId: ListContract,
              method: 'get_lists_for_owner',
              args: { owner_id: owner },
            });
            return { owner, isListCreator: lists.length > 0 };
          })
        );

        const listCreatorsMap = listCreatorStatus.reduce((acc, { owner, isListCreator }) => {
          acc[owner] = isListCreator;
          return acc;
        }, {});

        setListCreators(listCreatorsMap);
      } catch (error) {
        console.error("Error fetching whitelisted voters:", error);
      }
    };

    fetchWhitelistedVoters();
  }, [signedAccountId, wallet]);

  const ProfileCard = ({ accountId, isListCreator }) => {
    const [isError, setIsError] = useState(false);

    const handleImageError = () => {
      if (!isError) {
        setIsError(true);
      }
    };

    const clippedAccountId = accountId.length > 15 
      ? `${accountId.slice(0, 6)}...${accountId.slice(-6)}`
      : accountId;

    return (
      <div
        className="p-4 border rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
        onClick={() => window.open(`https://near.social/mob.near/widget/MyPage?accountId=${accountId}`, '_blank')}
      >
        <div className="flex items-center">
          <Image
            src={isError 
              ? `https://robohash.org/${accountId}.png`
              : `https://i.near.social/magic/thumbnail/https://near.social/magic/img/account/${accountId}`
            }
            alt={accountId}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full border-4 border-blue-100"
            onError={handleImageError}
          />
          <p className="ml-4">{clippedAccountId}</p>
        </div>
        <div className="flex justify-between items-center mt-2">
          {isListCreator && (
            <span className="badge bg-blue-100 text-blue-800 ml-2">
              List Creator
            </span>
          )}
        </div>
      </div>
    );
  };

  const filteredVoters = whitelistedVoters
    .filter(owner => owner.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'mostRecent') {
        return whitelistedVoters.indexOf(a) - whitelistedVoters.indexOf(b);
      } else {
        return whitelistedVoters.indexOf(b) - whitelistedVoters.indexOf(a);
      }
    });

  return (
    <div className={styles.main}>
      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Whitelisted Voters</h1>
        <p className="text-lg">Total Unique Whitelisted Voters: {whitelistedVoters.length}</p>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded mb-4 w-full"
        />
        <button
          onClick={() => setSortOrder(sortOrder === 'mostRecent' ? 'leastRecent' : 'mostRecent')}
          className="ml-4 p-2 bg-blue-500 text-white rounded transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
        >
          Sort: {sortOrder === 'mostRecent' ? 'Most Recent' : 'Least Recent'}
          <svg
            className={`w-4 h-4 ml-2 ${sortOrder === 'mostRecent' ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
          </svg>
        </button>
        {signedAccountId && isWhitelisted && (
          <div className="badge bg-green-100 text-green-800 mt-2">
            <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            You have a Voter NFT
          </div>
        )}
        {signedAccountId && !isWhitelisted && (
          <p className="text-red-600">
            You are not whitelisted. Please get your NFT at <a href="https://shard.dog/nearyear" target="_blank" className="text-blue-600 hover:underline">shard.dog/nearyear</a>.
          </p>
        )}
      </header>
      <div className="w-full max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredVoters.length > 0 ? (
          filteredVoters.map((owner, index) => (
            <ProfileCard
              key={index}
              accountId={owner}
              isListCreator={listCreators[owner]}
            />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No voters found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default WhitelistedVoters; 