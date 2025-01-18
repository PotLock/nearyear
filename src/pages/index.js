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

// Use the imported data
const importedCompetitionsData = competitionsData.competitionsData;

const categoryColors = {
  "Overall Concepts": "#FFD700",
  "Projects": "#ADFF2F",
  "Downbad": "#FF6347",
  "Future Look in 2025": "#87CEEB",
  "People": "#FF69B4"
};

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
        <link href="https://fonts.googleapis.com/css2?family=Lodrina+Solid&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        color: '#333', 
        minHeight: '100vh', 
        padding: '60px 20px', 
        fontFamily: 'Arial, sans-serif', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '4em', fontWeight: 'bold', margin: '0', color: '#333' }}>NEAR YEAR</h1>
          <p style={{ fontSize: '1.5em', margin: '10px 0 20px', color: '#666' }}>
            The first annual on-chain awards show celebrating the people and projects of NEAR and predicting achievements in the upcoming year
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button style={{ 
              backgroundColor: '#333', 
              color: '#fff', 
              padding: '15px 30px', 
              fontSize: '1em', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              transition: 'background-color 0.3s' 
            }} 
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#555'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#333'}
            onClick={() => window.location.href = '/nomination'}>
              Nominate
            </button>
            <button style={{ 
              backgroundColor: '#666', 
              color: '#fff', 
              padding: '15px 30px', 
              fontSize: '1em', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              transition: 'background-color 0.3s' 
            }} 
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#888'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#666'}
            onClick={() => window.location.href = 'https://alpha.potlock.org/register'}>
              Create Profile
            </button>
          </div>
        </header>

        <section style={{ maxWidth: '800px', textAlign: 'left', marginTop: '40px' }}>
          <h2 className="heading" style={{ fontSize: '2em', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>How It Works</h2>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '20px',
            '@media (min-width: 768px)': { flexDirection: 'row' }
          }}>
            <div style={{ 
              backgroundColor: '#fff', 
              borderRadius: '8px', 
              padding: '20px', 
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
              display: 'flex', 
              alignItems: 'center',
              flex: '1'
            }}>
              <span style={{ fontSize: '2em', marginRight: '15px' }}>📜</span>
              <p style={{ fontSize: '1.2em', color: '#666', margin: '0' }}>
                On-chain lists are created for different categories, with projects and profiles that have existing on-chain accounts automatically added.
              </p>
            </div>
            <div style={{ 
              backgroundColor: '#fff', 
              borderRadius: '8px', 
              padding: '20px', 
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
              display: 'flex', 
              alignItems: 'center',
              flex: '1'
            }}>
              <span style={{ fontSize: '2em', marginRight: '15px' }}>🗳️</span>
              <p style={{ fontSize: '1.2em', color: '#666', margin: '0' }}>
                During the nomination period, nominated projects are onboarded to the chain, and curators can create their own lists to boost new nominees. This is also the time to debate and advocate for 2024 achievements.
              </p>
            </div>
            <div style={{ 
              backgroundColor: '#fff', 
              borderRadius: '8px', 
              padding: '20px', 
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
              display: 'flex', 
              alignItems: 'center',
              flex: '1'
            }}>
              <span style={{ fontSize: '2em', marginRight: '15px' }}>🏆</span>
              <p style={{ fontSize: '1.2em', color: '#666', margin: '0' }}>
                During the voting period, verified humans with ShardDog NFTs choose the top winners, followed by an awards show.
              </p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '60px' }}>
          <h2 className="heading" style={{ fontSize: '2em', fontWeight: 'bold', textAlign: 'center' }}>Brought to you by</h2>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
            <a href="http://potlock.org" target="_blank" rel="noopener noreferrer" style={{ transition: 'transform 0.3s' }}>
              <Image src="/potlock.png" alt="Potlock Logo" width={100} height={100} />
            </a>
            <a href="https://near.foundation" target="_blank" rel="noopener noreferrer" style={{ transition: 'transform 0.3s' }}>
              <Image src="/near-logo.svg" alt="NEAR Foundation Logo" width={100} height={100} />
            </a>
            <a href="http://shard.dog" target="_blank" rel="noopener noreferrer" style={{ transition: 'transform 0.3s' }}>
              <Image src="/sharddog.png" alt="Sharddog Logo" width={100} height={100} />
            </a>
            <a href="https://blackdragon.meme/" target="_blank" rel="noopener noreferrer" style={{ transition: 'transform 0.3s' }}>
              <Image src="/blackdragon.png" alt="Blackdragon Logo" width={100} height={100} />
            </a>
            <a href="https://nearcatalog.xyz/" target="_blank" rel="noopener noreferrer" style={{ transition: 'transform 0.3s' }}>
              <Image src="/nearcatalog.png" alt="NEAR Catalog Logo" width={100} height={100} />
            </a>
            <a href="http://nearweek.com" target="_blank" rel="noopener noreferrer" style={{ transition: 'transform 0.3s' }}>
              <Image src="/nearweek.png" alt="NEARWEEK Logo" width={100} height={100} />
            </a>
          </div>
        </section>
        <section style={{ marginBottom: '60px' }}>
          <h2 className="heading" style={{ fontSize: '2em', fontWeight: 'bold', textAlign: 'center', color: '#333' }}>All Categories</h2>
          <p>All of the shortlisted nominations. If a project isnt an on-chain nominee they need to <a href="https://alpha.potlock.org/register" target="_blank" rel="noopener noreferrer">create a project</a></p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
            <button style={{ backgroundColor: '#e0e0e0', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }} onClick={() => setSelectedCategory('All')}>All</button>
            {categories.map((category, index) => (
              <button key={index} style={{ backgroundColor: '#e0e0e0', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }} onClick={() => setSelectedCategory(category)}>{category}</button>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '60px', width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="text" 
            placeholder={`Showing ${filteredCompetitions.length} out of ${totalCompetitions} competitions...`} 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            style={{ width: '100%', padding: '10px', fontSize: '1em', backgroundColor: '#e0e0e0', border: 'none', borderRadius: '5px' }}
          />
          <Select
            isMulti
            options={competitors.map(competitor => ({ value: competitor, label: competitor }))}
            value={selectedCompetitors.map(competitor => ({ value: competitor, label: competitor }))}
            onChange={handleCompetitorChange}
            className="mb-4"
            styles={{
              container: (provided) => ({
                ...provided,
                width: '100%',
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
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <p>Loading...</p>
          </div>
        ) : (
          filteredCompetitions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCompetitions.map((competition, idx) => (
                <CompetitionCard
                  key={idx}
                  competition={competition}
                  listLink={competition.listLink}
                  profiles={profiles}
                  wallet={wallet}
                  isAllCommentsVisible={isAllCommentsVisible}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              <p>No competitions found.</p>
            </div>
          )
        )}

        <section style={{ marginBottom: '60px' }}>
          <h2 className="heading" style={{ fontSize: '2em', fontWeight: 'bold', textAlign: 'center', color: '#333' }}>Timeline</h2>
          <div style={{ 
            marginTop: '20px', 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            gap: '20px' 
          }}>
            {timelineEvents.map((event, index) => {
              const isActive = currentDate >= event.start && currentDate <= event.end;
              return (
                <div key={index} style={{
                  flex: '1 1 calc(33% - 20px)', 
                  border: '1px solid #ccc', 
                  borderRadius: '8px', 
                  padding: '20px', 
                  backgroundColor: isActive ? '#e0f7fa' : '#fff',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className="heading" style={{ fontWeight: 'bold', color: '#333', margin: '0' }}>{event.title}</h3>
                    <span style={{ fontSize: '0.9em', color: '#666' }}>
                      📅 {event.start.toLocaleDateString()} to {event.end.toLocaleDateString()}
                    </span>
                  </div>
                  <hr style={{ margin: '10px 0', borderColor: '#ccc' }} />
                  <ul style={{ paddingLeft: '0', color: '#666', margin: '0' }}>
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
        `}</style>

        <section style={{ marginBottom: '60px' }}>
          <h2 className="heading" style={{ fontSize: '2em', fontWeight: 'bold', textAlign: 'center' }}>🚀 How to Participate</h2>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            
            <div style={{ flex: '1 1 calc(33% - 20px)', border: '1px solid #ccc', borderRadius: '8px', padding: '20px', backgroundColor: '#fff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <h3 style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>👥 For Voters</h3>
              <ol style={{ paddingLeft: '20px', listStyleType: 'decimal' }}>
                <li style={{ marginBottom: '10px' }}>
                  <strong>Get Verified:</strong> Obtain a Sharddog I Voted NFT for verification.
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <strong>Vote:</strong> Participate in the voting process during the designated period.
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <strong>Earn Rewards:</strong> Receive an exclusive NEAR YEAR Sharddog NFT for participating.
                </li>
              </ol>
            </div>

            <div style={{ flex: '1 1 calc(33% - 20px)', border: '1px solid #ccc', borderRadius: '8px', padding: '20px', backgroundColor: '#fff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <h3 style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>🏆 For Curators</h3>
              <ol style={{ paddingLeft: '20px', listStyleType: 'decimal' }}>
                <li style={{ marginBottom: '10px' }}>
                  <strong>Nominate:</strong> Duplicate the <a href="https://potlock.org/list-docs" target="_blank" rel="noopener noreferrer">list</a> on Potlock and keep the same name.
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <strong>Include Details:</strong> Add project account names from <a href="http://near.social" target="_blank" rel="noopener noreferrer">near.social</a>.
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <strong>Share:</strong> Post your list on Twitter tagging @potlock_ @nearweek @nearprotocol @nearcatalog.
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <strong>Self-Nominate:</strong> Create a list entry and notify <a href="https://x.com/plugrel" target="_blank" rel="noopener noreferrer">plugrel</a> on Twitter.
                </li>
              </ol>
            </div>

            <div style={{ flex: '1 1 calc(33% - 20px)', border: '1px solid #ccc', borderRadius: '8px', padding: '20px', backgroundColor: '#fff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <h3 style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>🏗️ For Projects</h3>
              <ol style={{ paddingLeft: '20px', listStyleType: 'decimal' }}>
                <li style={{ marginBottom: '10px' }}>
                  <strong>Create Project:</strong> <a href="https://alpha.potlock.org/register" target="_blank" rel="noopener noreferrer">Register</a> on Potlock with a named account that represents your project.
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <strong>Apply to List:</strong> Tweet at <a href="https://x.com/plugrel" target="_blank" rel="noopener noreferrer">@plugrel</a> with your Potlock profile and the category name you are applying for.
                </li>
              </ol>
            </div>

          </div>
        </section>

        <section style={{ marginBottom: '60px', width: "100%" }}>
          <h2 className="heading" style={{ fontSize: '2em', fontWeight: 'bold', textAlign: 'center' }}>FAQ</h2>
          <div style={{ marginTop: '20px' }}>
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
              <div key={faq.id} style={{ marginBottom: '10px', border: '1px solid #ccc', borderRadius: '8px', padding: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <h3 className="heading" style={{ fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => toggleCompetition(faq.id)}>
                  {faq.question}
                  <span>{expandedCompetition === faq.id ? '-' : '+'}</span>
                </h3>
                {expandedCompetition === faq.id && (
                  <p style={{ marginTop: '5px', transition: 'max-height 0.3s ease-in-out', overflow: 'hidden' }}>{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '60px', width: '100%' }}>
          <h2 className="heading" style={{ fontSize: '2em', fontWeight: 'bold', textAlign: 'center' }}>What People Are Saying</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
            {tweetData.tweetIds.map((tweetId, index) => (
              <div key={index} style={{ flex: '1 1 calc(33% - 20px)', maxWidth: '400px' }}>
                <TwitterTweetEmbed
                  tweetId={tweetId}
                  options={{ cards: 'hidden' }}
                  onClick={() => window.open(`https://x.com/${tweetId}`, '_blank')}
                />
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p>Share your opinions on Twitter with #NEARYearAwards and tag us!</p>
            <button style={{ 
              backgroundColor: '#333', 
              color: '#fff', 
              padding: '10px 20px', 
              fontSize: '1em', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              transition: 'background-color 0.3s' 
            }} 
            onClick={() => window.open('https://x.com/intent/tweet?hashtags=NEARYearAwards', '_blank')}>
              Share Your Opinion
            </button>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default LandingPage; 