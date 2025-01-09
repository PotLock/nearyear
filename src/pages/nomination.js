import React, { useCallback, useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useLists } from '../hooks/useLists';
import Image from 'next/image';
import { FaHeart, FaLayerGroup, FaThumbsUp, FaUserCircle, FaCopy, FaUser } from 'react-icons/fa';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { NearContext } from '@/wallets/near';
import { ListContract, ListCreator, SOCIAL_CONTRACT } from '@/config';
import { toast } from 'react-hot-toast';
import { wallet } from '@/wallets/near';
import { socialContract } from '@/config';
import Select from 'react-select';

// Define the getRandomBackgroundImage function
const getRandomBackgroundImage = () => {
  const backgrounds = [
    { background: '/images/background1.jpg', backdrop: '/images/backdrop1.jpg' },
    { background: '/images/background2.jpg', backdrop: '/images/backdrop2.jpg' },
    { background: '/images/background3.jpg', backdrop: '/images/backdrop3.jpg' },
    // Add more background-backdrop pairs as needed
  ];

  const randomIndex = Math.floor(Math.random() * backgrounds.length);
  return backgrounds[randomIndex];
};

export async function getProfile(accountId) {
  try {
    const response = await wallet.viewMethod({
      contractId: SOCIAL_CONTRACT,
      method: 'get',
      args: { keys: [`${accountId}/profile/**`] },
    });
    if (!response) {
      throw new Error("Failed to fetch profile");
    }

    const { profile } = response[accountId];
    return profile;
  } catch (error) {
    console.error(`Error fetching profile for ${accountId}:`, error);
    return null;
  }
}

const NominationPage = () => {
  const router = useRouter();
  const accountId = 'plugrel.near';
  const { data, error, isLoading } = useLists({ account: accountId });
  const { wallet } = useContext(NearContext);
  const [lists, setLists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [approvedRegistrations, setApprovedRegistrations] = useState([]);
  const [profiles, setProfiles] = useState({});

  useEffect(() => {
    if (!wallet) return;

    const fetchLists = async () => {
      try {
        const lists = await wallet.viewMethod({
          contractId: ListContract,
          method: 'get_lists_for_owner',
          args: { owner_id: ListCreator },
        });

        const allRegistrations = await Promise.all(
          lists.map(async (list) => {
            const registrations = await wallet.viewMethod({
              contractId: ListContract,
              method: 'get_registrations_for_list',
              args: {
                list_id: list.id,
                status: 'Approved',
                from_index: 0,
                limit: 100,
              },
            });
            list.registrants = registrations.map(registration => registration.registrant_id);
            return list.registrants;
          })
        );

        const uniqueRegistrations = [...new Set(allRegistrations.flat())];
        setApprovedRegistrations(uniqueRegistrations);
        setLists(lists);

        // Fetch profiles for each unique registrant
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
      } catch (error) {
        console.error('Error fetching lists:', error);
        toast.error('Error fetching lists.');
      }
    };

    fetchLists();
  }, [wallet]);

  const filteredLists = lists.filter(list => 
    list.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedAccounts.length === 0 || (list.registrants && selectedAccounts.some(account => list.registrants.includes(account))))
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading lists: {error.message}</p>;

  return (
    <div className="w-full p-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">NEAR YEAR Prize Categories</h1>
        <p className="mt-2 text-lg">
          View all ({filteredLists.length} of {lists.length}) NEAR YEAR Prize Categories and customize your own list to nominate your own favorites.
        </p>
      </div>

      <input
        type="text"
        placeholder={`Search lists... (${filteredLists.length} of ${lists.length})`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded"
      />

      <Select
        isMulti
        options={approvedRegistrations.map(id => ({ value: id, label: id }))}
        onChange={(selectedOptions) => setSelectedAccounts(selectedOptions.map(option => option.value))}
        className="mb-4"
      />

      {filteredLists.length ? (
        <div className="mt-8 grid w-full grid-cols-1 gap-8 pb-10 md:grid-cols-2 lg:grid-cols-3">
          {filteredLists.map((item) => {
            let background = '';
            let backdrop = '';

            if (!item.cover_img_url) {
              ({ background, backdrop } = getRandomBackgroundImage());
            }

            return (
              <ListCard
                background={background}
                backdrop={backdrop}
                dataForList={item}
                key={item.id}
                wallet={wallet}
                profiles={profiles}
              />
            );
          })}
        </div>
      ) : (
        <p>No lists match the selected criteria.</p>
      )}
    </div>
  );
};

const ListCard = ({ dataForList, background, backdrop, wallet, profiles }) => {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState([]);
  const [approvedRegistrations, setApprovedRegistrations] = useState([]);
  const { push } = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    const fetchUpvotes = async () => {
      try {
        const upvotes = await wallet.viewMethod({
          contractId: ListContract,
          method: 'get_upvotes_for_list',
          args: { list_id: dataForList.id },
        });
        setUpvotes(upvotes);
        setIsUpvoted(upvotes.includes(wallet.accountId));
      } catch (error) {
        console.error('Error fetching upvotes:', error);
      }
    };

    const fetchApprovedRegistrations = async () => {
      try {
        const registrations = await wallet.viewMethod({
          contractId: ListContract,
          method: 'get_registrations_for_list',
          args: {
            list_id: dataForList.id,
            status: 'Approved',
            from_index: 0,
            limit: 100,
          },
        });
        const registrantIds = registrations.map(registration => registration.registrant_id);
        setApprovedRegistrations(registrantIds);
      } catch (error) {
        console.error('Error fetching approved registrations:', error);
      }
    };

    if (wallet) {
      fetchUpvotes();
      fetchApprovedRegistrations();
    }
  }, [dataForList, wallet]);

  const handleRoute = useCallback(
    () => {
      const baseUrl = wallet.networkId === 'mainnet' 
        ? 'https://alpha.potlock.org/list/' 
        : 'https://testnet.potlock.org/list/';
      window.open(`${baseUrl}${dataForList?.id}`, '_blank');
    },
    [dataForList?.id, wallet.networkId]
  );

  const handleUpvote = async (e) => {
    e.stopPropagation();

    const UPVOTE = 'UPVOTE';
    const DOWNVOTE = 'DOWNVOTE';

    try {
      if (isUpvoted) {
        console.log('Removing upvote for list:', dataForList.id);
        await wallet.callMethod({
          contractId: ListContract,
          method: 'remove_upvote',
          args: { list_id: dataForList.id },
        });
        setUpvotes(upvotes.filter((id) => id !== wallet.accountId));
        setIsUpvoted(false);
        handleListToast({ name: dataForList.name.slice(0, 15), type: DOWNVOTE });
      } else {
        console.log('Adding upvote for list:', dataForList.id);
        await wallet.callMethod({
          contractId: ListContract,
          method: 'upvote',
          args: { list_id: dataForList.id },
        });
        setUpvotes([...upvotes, wallet.accountId]);
        setIsUpvoted(true);
        handleListToast({ name: dataForList.name.slice(0, 15), type: UPVOTE });
      }
    } catch (error) {
      console.error('Upvote action failed:', error);
    }
  };

  const handleRouteUser = useCallback(
    (e) => {
      e.stopPropagation();
      const baseUrl = wallet.networkId === 'mainnet' 
        ? 'https://alpha.potlock.org/profile/' 
        : 'https://testnet.potlock.org/profile/';
      window.open(`${baseUrl}${dataForList.owner}/lists`, '_blank');
    },
    [dataForList.owner, wallet.networkId]
  );

  const handleDuplicate = useCallback(
    (e) => {
      e.stopPropagation();
      const baseUrl = wallet.networkId === 'mainnet' 
        ? 'https://alpha.potlock.org/list/duplicate/' 
        : 'https://testnet.potlock.org/list/duplicate/';
      window.open(`${baseUrl}${dataForList.id}`, '_blank');
    },
    [dataForList.id, wallet.networkId]
  );

  const NO_IMAGE =
    'https://i.near.social/magic/large/https://near.social/magic/img/account/null.near';

  return (
    <div
      onClick={handleRoute}
      className="cursor-pointer transition-all duration-300 hover:translate-y-[-1rem] overflow-hidden rounded-[12px] border border-gray-200"
      style={{ maxWidth: '500px' }}
    >
      <Image
        src={dataForList?.cover_image_url || backdrop}
        alt="backdrop"
        width={500}
        height={500}
        className="h-[500px] w-full object-cover"
        style={{ width: 'auto', height: 'auto' }}
      />
      <div className="bg-background p-3">
        <p className="text-lg font-[600] leading-tight">
          {(dataForList?.name || '').slice(0, 150)}
        </p>
        <div className="mt-2 flex items-center justify-between space-x-2">
          <div className="flex items-center gap-2 text-[14px]">
            <p className="">BY</p>
            <div
              role="button"
              className="flex items-center gap-1 hover:opacity-50"
              onClick={handleRouteUser}
            >
              <FaUserCircle accountId={dataForList?.owner} className="h-4 w-4" />
              <p className="">{(dataForList.owner || '').slice(0, 25)}</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <button onClick={handleDuplicate} className="focus:outline-none" title="Duplicate">
              <FaCopy className="text-[18px]" />
            </button>
            <button onClick={handleUpvote} className="focus:outline-none">
              {isUpvoted ? (
                <FaHeart className="text-[18px] text-red-500" />
              ) : (
                <FaThumbsUp className="m-0 fill-red-500 p-0" />
              )}
            </button>
            <p className="m-0 p-0 pt-1 text-[16px] font-semibold text-black">
              {upvotes.length}
            </p>
          </div>
        </div>
        <div className="mt-2">
          <p
            className="text-sm font-semibold cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setIsCollapsed(!isCollapsed);
            }}
          >
            Approved Nominees ({approvedRegistrations.length}):
          </p>
          {!isCollapsed && (
            <ul className="list-none pl-0">
              {approvedRegistrations.map((registrantId) => (
                <li key={registrantId} className="flex items-center gap-2">
                  <Image
                    src={profiles[registrantId]?.image || NO_IMAGE}
                    alt={registrantId}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span
                    role="button"
                    className="hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      const baseUrl = wallet.networkId === 'mainnet'
                        ? 'https://alpha.potlock.org/profile/'
                        : 'https://testnet.potlock.org/profile/';
                      window.open(`${baseUrl}${registrantId}`, '_blank');
                    }}
                  >
                    {registrantId}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const handleListToast = ({ name, type }) => {
  console.log(`Handling list toast for ${name} with type ${type}`);
  // Implement the logic that was previously handled by dispatch.listEditor.handleListToast
};

export default NominationPage; 