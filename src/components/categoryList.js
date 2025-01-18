import { useEffect, useState, useContext } from 'react';
import { NearContext } from '@/wallets/near';
import styles from '@/styles/app.module.css';
import Link from 'next/link';
import { VoteContract, ListContract } from '../config';
import { Podcast, ClockIcon, Award, Zap, Briefcase, Smile, Network, LineChart, Crown, HeartHandshake, Video, Rocket, DollarSign, Frame, Shield, Coins, Sparkles, GitBranch, Users, BookOpen, RefreshCcw, Database, Boxes, Paintbrush, ImagePlus, Image, Smartphone, Palette, Anchor, MessageCircle, GraduationCap, Flame, Building2, Scale, Wallet, Heart, Brain, Globe, Skull, CloudRain, RocketIcon, FileCode } from 'lucide-react';
import { NotFound } from './NotFound';
import toast from 'react-hot-toast';

const CONTRACT_ID = "claim.sharddog.near";
const SERIES_ID = "151";

export const CategoryList = () => {
  const { wallet, signedAccountId } = useContext(NearContext);
  const [categories, setCategories] = useState([]);
  const [contractExists, setContractExists] = useState(true);
  const [isQualifiedVoter, setIsQualifiedVoter] = useState(false);
  const [isListCreator, setIsListCreator] = useState(false);

  useEffect(() => {
    if (!wallet || !signedAccountId) {
      toast("Please sign in to see your voter status.", {
        icon: '⚠️',
        style: {
          border: '1px solid #ffcc00',
          padding: '16px',
          color: '#ffcc00',
        },
      });
    }

    const checkContractExists = async () => {
      try {
        await wallet.viewMethod({
          contractId: VoteContract,
          method: 'get_elections',
        });
      } catch (error) {
        console.error('Error checking contract existence:', error);
        if (error.message.includes("account") && error.message.includes("doesn't exist")) {
          setContractExists(false);
        }
      }
    };

    const fetchCategories = async () => {
      try {
        const categories = await wallet.viewMethod({
          contractId: VoteContract,
          method: 'get_elections',
        });
        console.log('Fetched categories:', categories);
        setCategories(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const checkListCreator = async () => {
      try {
        console.log('Signed Account ID:', signedAccountId);

        if (!signedAccountId || typeof signedAccountId !== 'string' || !signedAccountId.match(/^[a-z0-9._-]+$/)) {
          throw new Error('Invalid account ID format');
        }
        
        const lists = await wallet.viewMethod({
          contractId: ListContract,
          method: 'get_lists_for_owner',
          args: { owner_id: signedAccountId },
        });
        console.log('Lists for account:', lists);
        setIsListCreator(lists.length > 0);
        console.log('Is List Creator:', lists.length > 0);
      } catch (error) {
        console.error('Error checking list creator status:', error);
        console.error('Contract ID:', ListContract);
        console.error('Method:', 'get_lists_for_owner');
        console.error('Signed Account ID:', signedAccountId);
      }
    };

    const checkQualifiedVoter = async () => {
      try {
        const isValid = await isValidVoter(wallet, signedAccountId);
        setIsQualifiedVoter(isValid);
      } catch (error) {
        console.error('Error checking voter eligibility:', error);
      }
    };

    checkContractExists();
    fetchCategories();
    checkListCreator();
    checkQualifiedVoter();
  }, [wallet, signedAccountId]);

  const getVotingStatus = (startDate, endDate) => {
    const now = Date.now();
    if (now < parseInt(startDate)) {
      return { status: 'NOT_STARTED', color: 'yellow' };
    } else if (now > parseInt(endDate)) {
      return { status: 'ENDED', color: 'red' };
    }
    return { status: 'ACTIVE', color: 'green' };
  };

  if (!contractExists) {
    return <NotFound />;
  }

  if (categories.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader"></div>
      </div>
    );
  }
  const categoryIcons = {
    1: Podcast,    // Top NEAR Yapper
    2: Zap,            // Most Cracked NEAR Dev
    3: Briefcase,        // BEST BD at NF
    4: Smile,            // BEST VIBE ON NEAR
    5: Network,          // MOST LIKELY TO BE INVOLVED WITH PROJECTS
    6: LineChart,        // BEST DATA ANALYST
    7: Crown,            // COOLEST FOUNDER
    8: HeartHandshake,   // MOST HELPFUL NEARIAN
    9: Video,            // BEST CONTENT CREATORS
    10: Rocket,          // MOST ANTICIPATED TOKEN LAUNCH
    11: DollarSign,      // BEST DeFI Project
    12: Frame,           // BEST NFT Platform
    13: Shield,          // BEST PRIVACY PROJECT 
    14: Coins,           // Best NEAR Token
    15: Sparkles,        // Best New Token
    16: GitBranch,       // BEST Multichain Expansion
    17: Users,           // Best NEAR DAO
    18: BookOpen,        // BEST Open Source Projects
    19: RefreshCcw,      // BEST PIVOT
    20: Database,        // BEST Infrastructure
    21: Users,           // Strongest Community
    22: Boxes,           // Best New Project
    23: Paintbrush,      // Best New PFP Collection
    24: Image,           // Best Existing NFT Collection
    25: Smartphone,      // Best Consumer App
    26: Palette,         // Best NEAR Artist
    27: Anchor,          // Most Likely to Not Leave
    28: MessageCircle,   // WHO NEEDS TO START YAPPING MORE
    29: GraduationCap,   // BEST DEV REL
    30: Flame,           // Biggest Degen
    31: Building2,       // BEST AT NEAR Foundation
    32: Scale,           // BEST ECO LAWYERS
    33: Wallet,          // Best NEAR Wallet
    34: Heart,           // Baddest Baddies
    35: Brain,           // Best AI Project
    36: Globe,           // BEST REGIONAL COMMUNITY
    37: Skull,           // BEST FAILED DAO
    38: CloudRain,       // SADDEST PROJECT SHUTDOWNS
    39: RocketIcon,    // Most Anticipated Mainnet Launch
    40: FileCode,        // Best New Smart Contract
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4">NEAR YEAR Voting</h1>
        <p className="text-base md:text-lg text-gray-700">
          Real voting has not started. 
          {!isListCreator && (
            <>
              <Link href="/nomination" target="_blank" className="text-blue-600 hover:underline">
                <strong> Create a list </strong>
              </Link> 
              to nominate new projects, or 
            </>
          )}
          <Link href="https://alpha.potlock.org/register" target="_blank" className="text-blue-600 hover:underline">
            <strong> create a project </strong>
          </Link> 
          to qualify for nominations, and 
          {!isQualifiedVoter && (
            <Link href="https://shard.dog/nearyear" target="_blank" className="text-blue-600 hover:underline">
              <strong> register to vote</strong>
            </Link>
          )}
        </p>
        <div className="flex justify-center space-x-4 mt-4">
          <span className={`badge ${isQualifiedVoter ? 'bg-green-100 text-green-800' : 'unhighlighted'}`}>
            {isQualifiedVoter ? (
              <>
                <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Qualified Voter
              </>
            ) : (
              <Link href="https://shard.dog/nearyear" target="_blank">Become a Qualified Voter</Link>
            )}
          </span>
          <span className={`badge ${isListCreator ? 'bg-green-100 text-green-800' : 'unhighlighted'}`}>
            {isListCreator ? (
              <>
                <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                List Creator (2x vote)
              </>
            ) : (
              <Link href="/nomination" target="_blank">Create a List</Link>
            )}
          </span>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/category/${category.id}`} aria-label={`Go to ${category.title}`}>
            <div className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer h-[250px] hover:scale-[1.05] hover:bg-gray-50">
              <div className="absolute top-4 right-4">
                {(() => {
                  const { status, color } = getVotingStatus(category.start_date, category.end_date);
                  return (
                    <div className={`flex items-center bg-${color}-100 text-${color}-800 text-sm px-3 py-1 rounded-full`}>
                      <ClockIcon size={14} className="mr-1" />
                      <span>
                        {status === 'ACTIVE' && 'Voting Active'}
                        {status === 'NOT_STARTED' && 'Voting Not Started'}
                        {status === 'ENDED' && 'Voting Ended'}
                      </span>
                    </div>
                  );
                })()}
              </div>
              <div className="p-6 flex flex-col h-full">
                {(() => {
                  const Icon = categoryIcons[category.id] || Award;
                  return <Icon className="w-12 h-12 text-blue-600 group-hover:text-blue-700 transition-colors duration-300 mb-4 flex-shrink-0" />;
                })()}
                <h2 className="text-xl font-semibold mb-2 text-black group-hover:text-blue-700 transition-colors duration-300 flex-shrink-0">
                  {category.title || 'Loading...'}
                </h2>
                <p className="text-gray-600 line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
                  {category.description || 'No description available'}
                </p>
              </div>
            </div>
          </Link>  
        ))}
      </div>
    </div>
  );
};

// Function to check if the user is a valid voter
async function isValidVoter(wallet, accountId) {
  try {
    const result = await wallet.viewMethod({
      contractId: CONTRACT_ID,
      method: 'get_holders_by_series',
      args: {
        series_id: parseInt(SERIES_ID, 10),
      },
    });

    console.log('NFT ownership result:', result);
    return result.includes(accountId);
  } catch (error) {
    console.error("Error checking voter eligibility:", error);
    throw error;
  }
}