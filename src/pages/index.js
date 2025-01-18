import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import CompetitionCard from '../components/CompetitionCard';
import { NearContext } from '@/wallets/near';
import { getProfile } from './nomination';
import competitionsData from '../data/competitions.json';
import { Footer } from '@/components/footer';
import Select from 'react-select';
import { TwitterTweetEmbed } from 'react-twitter-embed';
import tweetData from '../data/tweets.json';
import TweetWall from '../components/TweetWall';

// Use the imported data
const importedCompetitionsData = competitionsData.competitionsData;

const categoryColors = {
  "Overall Concepts": "#FFD700",
  "Projects": "#ADFF2F",
  "Downbad": "#FF6347",
  "Future Look in 2025": "#87CEEB",
  "People": "#FF69B4"
};

// Define a default background and backdrop image
const DEFAULT_BACKGROUND = '/images/default-background.jpg';
const DEFAULT_BACKDROP = '/images/default-backdrop.jpg';

const LandingPage = () => {
  const { wallet } = useContext(NearContext);
  const [profiles, setProfiles] = useState({});
  const [expandedCompetition, setExpandedCompetition] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompetitors, setSelectedCompetitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAllCommentsVisible, setIsAllCommentsVisible] = useState(false);

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

  const categories = ['All', ...new Set(importedCompetitionsData.flatMap(group => group.competitions.map(comp => comp.category)))];
  const competitors = ['All', ...new Set(importedCompetitionsData.flatMap(group => group.competitions.flatMap(comp => comp.content.map(item => item.name))))];

  const filteredCompetitions = importedCompetitionsData.flatMap(group => group.competitions)
    .filter(competition => 
      (selectedCategory === 'All' || competition.category === selectedCategory) &&
      (selectedCompetitors.length === 0 || selectedCompetitors.some(competitor => competition.content.some(item => item.name === competitor))) &&
      competition.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalCompetitions = importedCompetitionsData.flatMap(group => group.competitions).length;

  const currentDate = new Date();
  const timelineEvents = [
    { title: "ANNOUNCEMENT", start: new Date('2025-01-11'), end: new Date('2025-01-11') },
    { title: "SUBMISSIONS", start: new Date('2025-01-11'), end: new Date('2025-01-25') },
    { title: "VOTING", start: new Date('2025-01-25'), end: new Date('2025-02-02') }
  ];

  const isActive = (start, end) => currentDate >= start && currentDate <= end;

  const handleCompetitorChange = (selectedOptions) => {
    setSelectedCompetitors(selectedOptions.map(option => option.value));
  };

  return (
    <>
      <Head>
        <title>NEAR YEAR Awards - Celebrate the NEAR Ecosystem</title>
        <meta name="description" content="Join the NEAR YEAR Awards, the premier on-chain event celebrating the NEAR blockchain's top projects and people. Discover future achievements and participate in the ecosystem's growth." />
        <meta name="keywords" content="NEAR, blockchain, awards, ecosystem, projects, people, POTLOCK, NEAR YEAR, on-chain, nominations, voting" />
        <meta property="og:title" content="NEAR YEAR Awards - Celebrate the NEAR Ecosystem" />
        <meta property="og:description" content="Join the NEAR YEAR Awards, the premier on-chain event celebrating the NEAR blockchain's top projects and people. Discover future achievements and participate in the ecosystem's growth." />
        <meta property="og:image" content="/NEARYEARMeta.png" />
        <meta property="og:url" content="https://nearyear.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NEAR YEAR Awards - Celebrate the NEAR Ecosystem" />
        <meta name="twitter:description" content="Join the NEAR YEAR Awards, the premier on-chain event celebrating the NEAR blockchain's top projects and people. Discover future achievements and participate in the ecosystem's growth." />
        <meta name="twitter:image" content="/NEARYEARMeta.png" />
        <link rel="canonical" href="https://nearyear.com" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="NEAR YEAR Awards" />
      </Head>
      <div className="bg-gray-100 text-gray-800 min-h-screen py-16 px-5 font-sans flex flex-col items-center justify-center">
        <header id="hero"className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 font-lodrina">NEAR YEAR</h1>
          <p className="text-xl text-gray-600 mt-2 mb-5">
            The first annual on-chain awards show celebrating the people and projects of NEAR and predicting achievements in the upcoming year
          </p>
          <div className="flex gap-5 justify-center">
            <button className="bg-gray-800 text-white py-3 px-6 text-lg rounded transition hover:bg-gray-700" onClick={() => window.location.href = '/nomination'}>
              Nominate
            </button>
            <button className="bg-gray-600 text-white py-3 px-6 text-lg rounded transition hover:bg-gray-700" onClick={() => window.location.href = 'https://alpha.potlock.org/register'}>
              Create Profile
            </button>
          </div>
        </header>

        <section className="max-w-full text-left mt-10 px-4">
          <h1 className="text-2xl font-bold mb-5 text-center font-lodrina">How It Works</h1>
          <div className="flex flex-col gap-5 md:flex-row">
            <div className="bg-white rounded-lg p-5 shadow-md flex items-center flex-1">
              <span className="text-2xl mr-4">📜</span>
              <p className="text-lg text-gray-600">
                On-chain lists are created for different categories, with projects and profiles that have existing on-chain accounts automatically added.
              </p>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-md flex items-center flex-1">
              <span className="text-2xl mr-4">🗳️</span>
              <p className="text-lg text-gray-600">
                During the nomination period, nominated projects are onboarded to the chain, and curators can create their own lists to boost new nominees. This is also the time to debate and advocate for 2024 achievements.
              </p>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-md flex items-center flex-1">
              <span className="text-2xl mr-4">🏆</span>
              <p className="text-lg text-gray-600">
                During the voting period, verified humans with ShardDog NFTs choose the top winners, followed by an awards show.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-15 w-full px-4">
          <h1 className="text-2xl font-bold text-center text-gray-800 font-lodrina">Brought to you by</h1>
          <div className="flex justify-center items-center gap-5 mt-5 flex-wrap">
            <a href="http://potlock.org" target="_blank" rel="noopener noreferrer" className="transition-transform transform hover:scale-105">
              <Image src="/potlock.png" alt="Potlock Logo" width={100} height={100} />
            </a>
            <a href="https://near.foundation" target="_blank" rel="noopener noreferrer" className="transition-transform transform hover:scale-105">
              <Image src="/near-logo.svg" alt="NEAR Foundation Logo" width={100} height={100} />
            </a>
            <a href="http://shard.dog" target="_blank" rel="noopener noreferrer" className="transition-transform transform hover:scale-105">
              <Image src="/sharddog.png" alt="Sharddog Logo" width={100} height={100} />
            </a>
            <a href="https://blackdragon.meme/" target="_blank" rel="noopener noreferrer" className="transition-transform transform hover:scale-105">
              <Image src="/blackdragon.png" alt="Blackdragon Logo" width={100} height={100} />
            </a>
            <a href="https://nearcatalog.xyz/" target="_blank" rel="noopener noreferrer" className="transition-transform transform hover:scale-105">
              <Image src="/nearcatalog.png" alt="NEAR Catalog Logo" width={100} height={100} />
            </a>
            <a href="http://nearweek.com" target="_blank" rel="noopener noreferrer" className="transition-transform transform hover:scale-105">
              <Image src="/nearweek.png" alt="NEARWEEK Logo" width={100} height={100} />
            </a>
          </div>
        </section>
        <section className="mb-15">
          <h1 className="text-2xl font-bold text-center text-gray-800">All Categories</h1>
          <p>All of the shortlisted nominations. If a project isnt an on-chain nominee they need to <a href="https://alpha.potlock.org/register" target="_blank" rel="noopener noreferrer">create a project</a></p>
          <div className="flex justify-center gap-5 mt-5">
            <button className="bg-gray-200 text-gray-800 py-2 px-4 rounded cursor-pointer" onClick={() => setSelectedCategory('All')}>All</button>
            {categories.map((category, index) => (
              <button key={index} className="bg-gray-200 text-gray-800 py-2 px-4 rounded cursor-pointer" onClick={() => setSelectedCategory(category)}>{category}</button>
            ))}
          </div>
        </section>

        <section className="mb-15">
          <div className="mb-4">
            <input 
              type="text" 
              placeholder={`Showing ${filteredCompetitions.length} out of ${totalCompetitions} competitions...`} 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full p-2 bg-gray-200 text-gray-800 border border-gray-300 rounded"
            />
          </div>
          <Select
            isMulti
            options={competitors.map(competitor => ({ value: competitor, label: competitor }))}
            value={selectedCompetitors.map(competitor => ({ value: competitor, label: competitor }))}
            onChange={handleCompetitorChange}
            className="mb-4 w-full"
            styles={{
              container: (provided) => ({
                ...provided,
                width: '100vw',
              }),
              control: (provided) => ({
                ...provided,
                padding: '10px',
                fontSize: '1em',
                backgroundColor: '#e0e0e0',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }),
            }}
          />
        </section>

        <button onClick={toggleAllComments} className="mb-4 text-blue-500 underline">
          {isAllCommentsVisible ? 'Collapse All Details' : 'Expand All Details'}
        </button>
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <p>Loading...</p>
          </div>
        ) : (
          filteredCompetitions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCompetitions.map((competition, idx) => {
                const coverImageUrl = competition.cover_img_url || 'https://i.near.social/magic/large/https://near.social/magic/img/account/null.near';
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
            <div className="text-c enter text-gray-600 py-5">
              <p>No competitions found.</p>
            </div>
          )
        )}

        <section className="mb-15 w-full px-4">
          <h1 className="text-2xl font-bold text-center text-gray-800 font-lodrina">Timeline</h1>
          <div className="mt-5 flex flex-wrap justify-center gap-5">
            {timelineEvents.map((event, index) => {
              const isActive = currentDate >= event.start && currentDate <= event.end;
              return (
                <div key={index} className={`flex-1 flex flex-col border border-gray-300 rounded-lg p-5 bg-white shadow-md ${isActive ? 'bg-yellow-100' : ''}`}>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">
                      {event.title}
                    </h3>
                    <span className="text-sm text-gray-600">
                      📅 {event.start.toLocaleDateString()} to {event.end.toLocaleDateString()}
                    </span>
                  </div>
                  <hr className="my-2 border-gray-300" />
                  <ul className="list-disc text-gray-600 pl-6">
                    {event.title === "ANNOUNCEMENT" && (
                      <>
                        <li>Official nominations, announcement article and call for nominations</li>
                        <li>Whole article put out with justification</li>
                        <li>Initial Content</li>
                      </>
                    )}
                    {event.title === "SUBMISSIONS" && (
                      <>
                        <li>People begin to submit their own lists</li>
                        <li>Debates: founder debate - detail TBA</li>
                      </>
                    )}
                    {event.title === "VOTING" && (
                      <>
                        <li>People vote (anyone but need Sharddog NFT)</li>
                        <li>End of Jan - award show</li>
                      </>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        <style jsx>{`
          @keyframes glow {
            0%, 100% {
              box-shadow: 0 0 5px #FFD700, 0 0 10px #FFD700, 0 0 15px #FFD700;
            }
            50% {
              box-shadow: 0 0 5px #FFD700, 0 0 10px #FFD700, 0 0 15px #FFD700, 0 0 20px #FFD700;
            }
          }
          section {
            margin-bottom: 30px;
          }
          header {
            position: sticky;
            top: 0;
            z-index: 1000;
            background-color: white;
          }
        `}</style>

        <section className="mb-15">
          <h1 className="text-2xl font-bold text-center text-gray-800">🚀 How to Participate</h1>
          <div className="mt-5 flex flex-wrap justify-center gap-5">
            
            <div className="flex-1 flex flex-col border border-gray-300 rounded-lg p-5 bg-white shadow-md transition transform hover:scale-105">
              <h3 className="text-lg font-bold text-center mb-4">👥 For Voters</h3>
              <ol className="list-decimal pl-6">
                <li className="mb-2">
                  <strong>Get Verified:</strong> Obtain a Sharddog I Voted NFT for verification.
                </li>
                <li className="mb-2">
                  <strong>Vote:</strong> Participate in the voting process during the designated period.
                </li>
                <li className="mb-2">
                  <strong>Earn Rewards:</strong> Receive an exclusive NEAR YEAR Sharddog NFT for participating.
                </li>
              </ol>
            </div>

            <div className="flex-1 flex flex-col border border-gray-300 rounded-lg p-5 bg-white shadow-md transition transform hover:scale-105">
              <h3 className="text-lg font-bold text-center mb-4">🏆 For Curators</h3>
              <ol className="list-decimal pl-6">
                <li className="mb-2">
                  <strong>Nominate:</strong> Duplicate the <a href="https://potlock.org/list-docs" target="_blank" rel="noopener noreferrer">list</a> on Potlock and keep the same name.
                </li>
                <li className="mb-2">
                  <strong>Include Details:</strong> Add project account names from <a href="http://near.social" target="_blank" rel="noopener noreferrer">near.social</a>.
                </li>
                <li className="mb-2">
                  <strong>Share:</strong> Post your list on Twitter tagging @potlock_ @nearweek @nearprotocol @nearcatalog.
                </li>
                <li className="mb-2">
                  <strong>Self-Nominate:</strong> Create a list entry and notify <a href="https://x.com/plugrel" target="_blank" rel="noopener noreferrer">plugrel</a> on Twitter.
                </li>
              </ol>
            </div>

            <div className="flex-1 flex flex-col border border-gray-300 rounded-lg p-5 bg-white shadow-md transition transform hover:scale-105">
              <h3 className="text-lg font-bold text-center mb-4">🏗️ For Projects</h3>
              <ol className="list-decimal pl-6">
                <li className="mb-2">
                  <strong>Create Project:</strong> <a href="https://alpha.potlock.org/register" target="_blank" rel="noopener noreferrer">Register</a> on Potlock with a named account that represents your project.
                </li>
                <li className="mb-2">
                  <strong>Apply to List:</strong> Tweet at <a href="https://x.com/plugrel" target="_blank" rel="noopener noreferrer">@plugrel</a> with your Potlock profile and the category name you are applying for.
                </li>
              </ol>
            </div>

          </div>
        </section>

        <section className="mb-15 w-full px-4">
          <h1 className="text-2xl font-bold text-center text-gray-800">FAQ</h1>
          <div className="mt-5 w-full">
            {[
              {
                id: 1,
                question: "Who can participate in the NEAR YEAR Awards?",
                answer: "Anyone can participate by nominating projects and voting. However, for the vote to count you need a Sharddog 'I NEAR YEAR' NFT for verification."
              },
              {
                id: 2,
                question: "How do I nominate a project or person?",
                answer: "Create a list on Potlock, include project account names, and share your list on Twitter with #NEARYearAwards tagging @NEARProtocol @potlock_ @nearweek. You can also self-nominate by creating a list entry and notifying @plugrel on Twitter."
              },
              {
                id: 3,
                question: "What are the voting requirements?",
                answer: "You need a Sharddog 'NEAR YEAR' NFT that represents a unique, verified human identity. List creators receive 2x voting power if verified."
              },
              {
                id: 4,
                question: "What do winners receive?",
                answer: "Winners receive immutable bragging rights through on-chain recognition. All participants can earn exclusive NEAR YEAR Sharddog NFTs by voting or nominating."
              },
              {
                id: 5,
                question: "My project is listed on the doc but not on listing page.",
                answer: "This means you need to create a profile on Potlock and then apply to list and tag @plugrel on Twitter. All the existing people on onchain list already had profiles (see who doesn’t with the indicated 🟡 emoji)."
              }
            ].map((faq) => (
              <div key={faq.id} className="mb-4 border border-gray-300 rounded-lg p-4 w-full">
                <h3 className="text-lg font-bold cursor-pointer flex justify-between items-center" onClick={() => toggleCompetition(faq.id)}>
                  {faq.question}
                  <span>{expandedCompetition === faq.id ? '-' : '+'}</span>
                </h3>
                {expandedCompetition === faq.id && (
                  <p className="mt-2 transition max-height-0.3s ease-in-out overflow-hidden">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-15 w-full px-4">
          <h1 className="text-2xl font-bold text-center text-gray-800 font-lodrina">What People Are Saying</h1>
          <div className="text-center mt-5">
            <p>Share your opinions on who you think should win the NEAR YEAR Awards</p>
            <button className="bg-gray-800 text-white py-2 px-4 text-sm rounded transition hover:bg-gray-700" onClick={() => window.open('https://x.com/intent/tweet?text=Here%20are%20my%20picks%20for%20the%20NEAR%20Year%20Awards&url=https://x.com/potlock_/status/1877665379318632900', '_blank')}>
              Tweet About NEAR YEAR
            </button>
          </div>
          <TweetWall />

        </section>

        <Footer />
      </div>
    </>
  );
};

export default LandingPage; 