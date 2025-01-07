import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const LandingPage = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const categories = [
    {
      id: 1,
      title: 'Category 1',
      awards: [
        { id: 1, nominee: 'Nominee 1', justification: 'Justification 1' },
        { id: 2, nominee: 'Nominee 2', justification: 'Justification 2' },
      ],
    },
    // Add more categories and awards as needed
  ];

  const toggleCategory = (id) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  return (
    <div className="bg-black text-gold min-h-screen">
      <header className="text-center py-10">
        <h1 className="text-5xl font-bold">NEAR AWARDS</h1>
        <p className="mt-4 text-xl">
          The first annual on-chain awards show celebrating the people and projects of NEAR and predicting achievements in the upcoming years
        </p>
      </header>

      <section className="text-center py-10">
        <h2 className="text-3xl font-bold">Brought to you by</h2>
        <div className="flex justify-center space-x-8 mt-6">
          <a href="http://potlock.org" target="_blank" rel="noopener noreferrer">
            <Image src="/logos/potlock.png" alt="Potlock Logo" width={100} height={100} />
          </a>
          <a href="https://near.foundation" target="_blank" rel="noopener noreferrer">
            <Image src="/logos/near-foundation.png" alt="NEAR Foundation Logo" width={100} height={100} />
          </a>
          <a href="http://shard.dog" target="_blank" rel="noopener noreferrer">
            <Image src="/logos/sharddog.png" alt="Sharddog Logo" width={100} height={100} />
          </a>
          <a href="https://blackdragon.meme/" target="_blank" rel="noopener noreferrer">
            <Image src="/logos/blackdragon.png" alt="Blackdragon Logo" width={100} height={100} />
          </a>
          <a href="http://nearweek.com" target="_blank" rel="noopener noreferrer">
            <Image src="/logos/nearweek.png" alt="NEARWEEK Logo" width={100} height={100} />
          </a>
        </div>
      </section>

      <section className="py-10">
        {categories.map((category) => (
          <div key={category.id} className="mb-6">
            <h1 className="text-2xl font-bold cursor-pointer" onClick={() => toggleCategory(category.id)}>
              {category.title}
            </h1>
            {expandedCategory === category.id && (
              <div className="mt-4">
                {category.awards.map((award) => (
                  <div key={award.id} className="mb-4">
                    <div className="flex items-center">
                      <Image src={`/profiles/${award.nominee}.png`} alt={`${award.nominee} Profile`} width={50} height={50} />
                      <div className="ml-4">
                        <p className="font-semibold">{award.nominee}</p>
                        <p>{award.justification}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>

      <footer className="text-center py-10">
        <div className="flex justify-center space-x-4">
          <Link href="/how-to-nominate">How to Nominate</Link>
          <Link href="/how-to-vote">How to Vote</Link>
          <Link href="/view-nominees">View Nominees</Link>
          <Link href="/view-categories">View Categories</Link>
        </div>
        <div className="mt-4">
          <a href="https://x.com/potlock_" target="_blank" rel="noopener noreferrer">Twitter</a>
          <span className="mx-2">|</span>
          <a href="https://github.com/potlock/nearawards" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 