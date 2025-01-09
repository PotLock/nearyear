import React, { useCallback, useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useLists } from '../hooks/useLists'; // Adjust the path if necessary
import Image from 'next/image';
import { FaHeart, FaLayerGroup, FaThumbsUp, FaUserCircle } from 'react-icons/fa';
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
  const { push } = useRouter();

  useEffect(() => {
    setIsUpvoted(dataForList.upvotes?.some((data) => data?.account === wallet.accountId));
  }, [dataForList, wallet]);

  const handleRoute = useCallback(
    () => {
      const baseUrl = wallet.networkId === 'mainnet' 
        ? 'https://alpha.potlock.org/list/' 
        : 'https://testnet.potlock.org/list/';
      window.open(`${baseUrl}${dataForList?.id}`, '_blank');
    },
    [dataForList?.on_chain_id, wallet.networkId]
  );

  const handleUpvote = (e) => {
    e.stopPropagation();

    const UPVOTE = 'UPVOTE';
    const DOWNVOTE = 'DOWNVOTE';

    if (isUpvoted) {
      console.log('Removing upvote for list:', dataForList?.on_chain_id);
      listsContractClient.remove_upvote({ list_id: dataForList?.on_chain_id });

      handleListToast({
        name: (dataForList?.name || '').slice(0, 15),
        type: DOWNVOTE,
      });
    } else {
      console.log('Adding upvote for list:', dataForList?.on_chain_id);
      listsContractClient.upvote({ list_id: dataForList?.on_chain_id });

      handleListToast({
        name: (dataForList?.name || '').slice(0, 15),
        type: UPVOTE,
      });
    }
  };

  const handleRouteUser = useCallback(
    (e) => {
      e.stopPropagation();
      push(`/profile/${dataForList?.owner?.id}`);
    },
    [dataForList?.owner]
  );

  const NO_IMAGE =
    'https://i.near.social/magic/large/https://near.social/magic/img/account/null.near';

  return (
    <div
      onClick={handleRoute}
      className="cursor-pointer transition-all duration-300 hover:translate-y-[-1rem]"
    >
      <Image
        src={dataForList?.cover_image_url ? '/assets/images/default-backdrop.png' : backdrop}
        alt="backdrop"
        width={500}
        height={5}
        className={`h-max w-full ${backdrop.endsWith('list_bg_image.png') ? 'px-4' : ''} object-cover`}
      />
      <div
        className="bg-background overflow-hidden rounded-[12px] border border-gray-300"
        data-testid="list-card"
      >
        <div className="relative">
          <LazyLoadImage
            alt="listImage"
            className="h-[221px] w-full object-cover"
            src={dataForList?.cover_image_url ?? background}
            width={500}
            height={150}
          />
          <div
            style={{ boxShadow: '0px 3px 5px 0px rgba(5, 5, 5, 0.08)' }}
            className="bg-background absolute bottom-4 right-4 flex items-center gap-1 rounded-[4px] px-4 py-2"
          >
            <FaLayerGroup />
            <p className="text-[12px] font-[600]">{dataForList?.registrations_count} Accounts</p>
          </div>
        </div>
        <div className="flex h-[112px] flex-col justify-between p-3">
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
                <FaUserCircle accountId={dataForList?.owner?.id} className="h-4 w-4" />
                <p className="">{(dataForList.owner?.id || '').slice(0, 25)}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <button onClick={handleUpvote} className="focus:outline-none">
                {isUpvoted ? (
                  <FaHeart className="text-[18px] text-red-500" />
                ) : (
                  <FaThumbsUp className="m-0 fill-red-500 p-0" />
                )}
              </button>
              <p className="m-0 p-0 pt-1 text-[16px] font-semibold text-black">
                {dataForList.upvotes?.length}
              </p>
            </div>
          </div>
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