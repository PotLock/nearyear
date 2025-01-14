import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ListContract } from '../config';
import { FaTwitter } from 'react-icons/fa';

const CompetitionCard = ({ competition, listLink, profiles, wallet, isAllCommentsVisible }) => {
  const [listDetails, setListDetails] = useState(null);
  const [approvedRegistrations, setApprovedRegistrations] = useState([]);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [commentVisibility, setCommentVisibility] = useState(
    Array(competition.content.length).fill(false)
  );

  useEffect(() => {
    const fetchListDetails = async () => {
      if (listLink) {
        try {
          const listId = listLink.split('/list/')[1];
          if (!listId) {
            console.error('List ID not found');
            return;
          }
          const registrations = await wallet.viewMethod({
            contractId: ListContract,
            method: 'get_registrations_for_list',
            args: {
              list_id: Number(listId),
              status: 'Approved',
              from_index: 0,
              limit: 100,
            },
          });
          setApprovedRegistrations(registrations.map(reg => reg.registrant_id));
        } catch (error) {
          console.error('Error fetching list details:', error);
        }
      }
    };

    fetchListDetails();
  }, [listLink, wallet]);

  useEffect(() => {
    setCommentVisibility(Array(competition.content.length).fill(isAllCommentsVisible));
    setIsContentVisible(isAllCommentsVisible);
  }, [isAllCommentsVisible, competition.content.length]);

  const displayName = listDetails?.name || competition.name;
  const backdrop = listDetails?.cover_image_url || '';

  const getCategoryColor = (category) => {
    const colors = {
      "Concepts": "bg-gold",
      "Projects": "bg-green",
      "Downbad": "bg-red",
      "2025": "bg-blue",
      "People": "bg-purple"
    };
    return colors[category] || "bg-gray-200";
  };

  const toggleCommentVisibility = (index) => {
    setCommentVisibility((prevVisibility) =>
      prevVisibility.map((visible, i) => (i === index ? !visible : visible))
    );
  };

  const toggleAllComments = () => {
    const allVisible = commentVisibility.every(visible => visible);
    setCommentVisibility(Array(competition.content.length).fill(!allVisible));
  };

  return (
    <div className={`flex-1 border border-gray-200 rounded-lg p-4 relative bg-white shadow-md transition-all duration-300 ${isContentVisible ? 'h-auto' : 'h-16'}`}>
      <div className="flex items-center justify-between">
        {backdrop && (
          <Image
            src={backdrop}
            alt="backdrop"
            width={50}
            height={50}
            className="rounded-full mr-2"
          />
        )}
        <div>
          <h3
            className="font-bold cursor-pointer truncate max-w-xs hover:overflow-visible hover:whitespace-normal"
            onClick={() => setIsContentVisible(!isContentVisible)}
            title={displayName}
          >
            {displayName} ({approvedRegistrations.length}/{competition.content.length})
          </h3>
          <p className="competition-description">{competition.description}</p>
        </div>
      </div>
      <div className="absolute top-2 right-2 flex items-center gap-2">
        {listLink && (
          <a href={listLink} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
            🔗
          </a>
        )}
        <div className={`${getCategoryColor(competition.category)} text-white px-2 py-1 rounded`}>
          {competition.category}
        </div>
      </div>
      {isContentVisible && (
        <div className="mt-4">
          <button onClick={toggleAllComments} className="mb-2 text-blue-500 underline">
            {commentVisibility.every(visible => visible) ? 'Collapse All' : 'Expand All'}
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {competition.content.map((item, index) => (
              <div key={index} className="border p-2 rounded hover:bg-gray-100">
                <strong
                  role="button"
                  onClick={() => item.comment && toggleCommentVisibility(index)}
                  className={`cursor-pointer ${!item.comment && 'cursor-default'}`}
                >
                  {item.name}
                </strong>
                {commentVisibility[index] && item.comment && (
                  <div className="mt-2 text-sm text-gray-600">
                    {item.comment}
                  </div>
                )}
                {item.twitterLink && (
                  <a href={item.twitterLink} target="_blank" rel="noopener noreferrer" className="ml-2">
                    <FaTwitter size={16} />
                  </a>
                )}
              </div>
            ))}
          </div>
          {listLink && (
            <div className="mt-4">
              <p className="font-semibold">On-Chain Nominees ({approvedRegistrations.length}):</p>
              <ul className="list-none pl-0">
                {approvedRegistrations.map((registrantId) => (
                  <li key={registrantId} className="flex items-center gap-2">
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompetitionCard; 