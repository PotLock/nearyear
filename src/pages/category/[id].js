import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import { NearContext } from '@/wallets/near';
import styles from '@/styles/app.module.css';
import Link from 'next/link';

import { HelloNearContract } from '../../config';

import { ChevronLeft, Clock, Award } from 'lucide-react';

const NomineePage = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log("routing...", router.query, id)
  const { wallet, signedAccountId } = useContext(NearContext);
  const [nominees, setNominees] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    if (!wallet || !id) return;

    const fetchNominees = async () => {
      const nominees = await wallet.viewMethod({
        contractId: HelloNearContract,
        method: 'get_election_candidates',
        args: { election_id: Number(id) },
      });
      setNominees(nominees);
    };

    fetchNominees();
  }, [wallet, id]);

  const voteForNominee = async (candidateId) => {
    console.log("just fyi..")
    setShowSpinner(true);
    console.log("candidateId", candidateId)
    await wallet.callMethod({
      contractId: HelloNearContract,
      method: 'vote',
      args: { election_id: id, vote: [candidateId, 1] },
    });
    setShowSpinner(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="flex items-center mb-8">
        <Link href="/" passHref>
          <button className="flex items-center text-gray-600 hover:text-gray-900">
            <ChevronLeft className="w-6 h-6 mr-2" />
            Back to Categories
          </button>
        </Link>
      </div>

      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Category Nominees</h1>
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          <Clock className="w-5 h-5" />
          <span>Voting Active</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nominees.map((nominee) => (
          <div key={nominee.account_id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <img
                  src={`https://robohash.org/${nominee.account_id}.png`}
                  alt={nominee.account_id}
                  className="w-24 h-24 rounded-full border-4 border-blue-100"
                />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">{nominee.account_id}</h3>
              <div className="flex justify-center items-center mb-4">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {nominee.votes_received} votes
                </div>
              </div>
              <button
                onClick={() => voteForNominee(nominee.account_id)}
                disabled={showSpinner}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
              >
                {showSpinner ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2" />
                ) : (
                  <Award className="w-4 h-4 mr-2" />
                )}
                {showSpinner ? 'Voting...' : `Vote for ${nominee.account_id}`}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NomineePage;