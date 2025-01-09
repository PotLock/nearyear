import React, { useCallback, useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useLists } from '../hooks/useLists'; // Adjust the path if necessary
import Image from 'next/image';
import { FaHeart, FaLayerGroup, FaThumbsUp, FaUserCircle, FaCopy, FaUser } from 'react-icons/fa';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { NearContext } from '@/wallets/near';
import { ListContract, ListCreator } from '@/config'; // Import ListContract
import { toast } from 'react-hot-toast';

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

const NominationPage = () => {
  const router = useRouter();
  const accountId = 'plugrel.near'; // Hardcoded for plugrel.near
  const { data, error, isLoading } = useLists({ account: accountId });
  const { wallet } = useContext(NearContext);
  const [lists, setLists] = useState([]);

  useEffect(() => {
    if (!wallet) return;

    const fetchLists = async () => {
      console.log('Fetching lists for owner:', accountId);
      try {
        const lists = await wallet.viewMethod({
          contractId: ListContract,
          method: 'get_lists_for_owner',
          args: { owner_id: ListCreator }, // Pass the owner_id argument
        });
        console.log('Fetched lists:', lists);

        // Log the network type
        const networkType = wallet.networkId === 'testnet' ? 'Testnet' : 'Mainnet';
        console.log(`Network: ${networkType}`);

        // Log each list with its project
        lists.forEach(list => {
          console.log(`Project: ${list.project_name}, List ID: ${list.id}`);
        });

        setLists(lists);

        if (lists.length === 0) {
          toast.error('No lists owned by this project.');
        }
      } catch (error) {
        console.error('Error fetching lists:', error);
        toast.error('Error fetching lists.');
      }
    };

    fetchLists();
  }, [wallet]);

  console.log('Data:', data);
  console.log('Error:', error);
  console.log('IsLoading:', isLoading);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading lists: {error.message}</p>;

  return (
    <div className="w-full">
      {lists.length ? (
        <div className="mt-8 grid w-full grid-cols-1 gap-8 pb-10 md:grid-cols-2 lg:grid-cols-3">
          {lists.map((item) => {
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
              />
            );
          })}
        </div>
      ) : (
        toast.error('No lists owned by this project.')
      )}
    </div>
  );
};

const ListCard = ({ dataForList, background, backdrop, wallet }) => {
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
            limit: 100, // Adjust the limit as needed
          },
        });
        // Extract registrant_id from each registration
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
      className="cursor-pointer transition-all duration-300 hover:translate-y-[-1rem] overflow-hidden rounded-[12px] border border-gray-300"
    >
      <Image
        src={dataForList?.cover_image_url || backdrop}
        alt="backdrop"
        width={500}
        height={500}
        className="h-[500px] w-full object-cover"
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
                  <FaUser className="h-4 w-4" />
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