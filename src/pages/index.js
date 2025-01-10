import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import CompetitionCard from '../components/CompetitionCard';
import { NearContext } from '@/wallets/near';
import { getProfile } from './nomination';
import competitionsData from '../data/competitions.json';

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
    };

    fetchProfiles();
  }, [wallet]);

  const [expandedCompetition, setExpandedCompetition] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompetitor, setSelectedCompetitor] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleCompetition = (id) => {
    setExpandedCompetition(expandedCompetition === id ? null : id);
  };

  const categories = ['All', ...new Set(importedCompetitionsData.flatMap(group => group.competitions.map(comp => comp.category)))];
  const competitors = ['All', ...new Set(importedCompetitionsData.flatMap(group => group.competitions.flatMap(comp => comp.content.map(item => item.name))))];

  const filteredCompetitions = importedCompetitionsData.flatMap(group => group.competitions)
    .filter(competition => 
      (selectedCategory === 'All' || competition.category === selectedCategory) &&
      (selectedCompetitor === 'All' || competition.content.some(item => item.name === selectedCompetitor)) &&
      competition.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalCompetitions = importedCompetitionsData.flatMap(group => group.competitions).length;

  const currentDate = new Date();
  const timelineEvents = [
    { title: "ANNOUNCEMENT", start: new Date('2025-01-08'), end: new Date('2025-01-08') },
    { title: "SUBMISSIONS", start: new Date('2025-01-08'), end: new Date('2025-01-14') },
    { title: "VOTING", start: new Date('2025-01-14'), end: new Date('2025-01-21') }
  ];

  const isActive = (start, end) => currentDate >= start && currentDate <= end;

  return (
    <>
      <Head>
        <title>NEAR YEAR - Celebrating NEAR Ecosystem</title>
        <meta name="description" content="The first annual on-chain awards show celebrating the people and projects of NEAR and predicting achievements in the upcoming years." />
        <meta name="keywords" content="NEAR, blockchain, awards, ecosystem, projects, people" />
        <meta property="og:title" content="NEAR YEAR - Celebrating NEAR Ecosystem" />
        <meta property="og:description" content="The first annual on-chain awards show celebrating the people and projects of NEAR and predicting achievements in the upcoming years." />
        <meta property="og:image" content="/path/to/image.jpg" />
        <meta property="og:url" content="https://nearyear.com" />
        <meta name="twitter:card" content="summary_large_image" />
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
          <h2 style={{ fontSize: '2em', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>How It Works</h2>
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

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2em', fontWeight: 'bold', textAlign: 'center' }}>Brought to you by</h2>
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
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2em', fontWeight: 'bold', textAlign: 'center', color: '#333' }}>All Categories</h2>
          <p>All of the shortlisted nominations. If a project isn't an on-chain nominee they need to <a href="https://alpha.potlock.org/register" target="_blank" rel="noopener noreferrer">create a project</a></p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
            <button style={{ backgroundColor: '#e0e0e0', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }} onClick={() => setSelectedCategory('All')}>All</button>
            {categories.map((category, index) => (
              <button key={index} style={{ backgroundColor: '#e0e0e0', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }} onClick={() => setSelectedCategory(category)}>{category}</button>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '40px', display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder={`Showing ${filteredCompetitions.length} out of ${totalCompetitions} competitions...`} 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            style={{ flex: '1 1 80%', padding: '10px', fontSize: '1em', backgroundColor: '#e0e0e0', border: 'none', borderRadius: '5px' }}
          />
          <select 
            value={selectedCompetitor} 
            onChange={(e) => setSelectedCompetitor(e.target.value)} 
            style={{ flex: '1 1 20%', padding: '10px', fontSize: '1em', backgroundColor: '#e0e0e0', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            {competitors.map((competitor, index) => (
              <option key={index} value={competitor}>{competitor}</option>
            ))}
          </select>
        </section>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <p>Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompetitions.map((competition, idx) => (
              <CompetitionCard
                key={idx}
                competition={competition}
                listLink={competition.listLink}
                profiles={profiles}
                wallet={wallet}
              />
            ))}
          </div>
        )}

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2em', fontWeight: 'bold', textAlign: 'center', color: '#333' }}>Timeline</h2>
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
                    <h3 style={{ fontWeight: 'bold', color: '#333', margin: '0' }}>{event.title}</h3>
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
          <h2 style={{ fontSize: '2em', fontWeight: 'bold', textAlign: 'center' }}>🚀 How to Participate</h2>
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

        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2em', fontWeight: 'bold', textAlign: 'center' }}>FAQ</h2>
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
              <div key={faq.id} style={{ marginBottom: '10px' }}>
                <h3 style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => toggleCompetition(faq.id)}>
                  {faq.question}
                </h3>
                {expandedCompetition === faq.id && (
                  <p style={{ marginTop: '5px' }}>{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </section>


        <footer style={{ textAlign: 'center', marginTop: '40px' }}>
          <div style={{ marginBottom: '10px' }}>
            <Link href="https://alpha.potlock.org/register" target="_blank" >Create Project</Link>
            <span> | </span>
            <Link href="/vote">How to Vote</Link>
            <span> | </span>
            <Link href="/nomination">View Nominees</Link>
            <span> | </span>
            <Link href="/">View Categories</Link>
          </div>
          <div>
            <a href="https://x.com/potlock_" target="_blank" rel="noopener noreferrer">Twitter</a>
            <span> | </span>
            <a href="https://github.com/potlock/nearyear" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage; 