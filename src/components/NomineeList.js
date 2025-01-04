import { useEffect, useState, useContext } from 'react';
import { NearContext } from '@/wallets/near';
import styles from '@/styles/app.module.css';

import { HelloNearContract } from '../config';

export const NomineeList = ({ electionId }) => {
  const { wallet, signedAccountId } = useContext(NearContext);
  const [nominees, setNominees] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    if (!wallet) return;

    const fetchNominees = async () => {
      const nominees = await wallet.viewMethod({
        contractId: HelloNearContract,
        method: 'get_election_candidates',
        args: { election_id: electionId },
      });
      setNominees(nominees);
    };

    fetchNominees();
  }, [wallet, electionId]);

  const voteForNominee = async (candidateId) => {
    setShowSpinner(true);
    await wallet.callMethod({
      contractId: HelloNearContract,
      method: 'vote',
      args: { election_id: electionId, vote: [candidateId, 1] },
    });
    setShowSpinner(false);
  };

  return (
    <div className={styles.nomineeListPage}>
      <h2 className={styles.nomineeListHeader}>Here are your nominees...</h2>
      <div className={styles.nomineeList}>
        {nominees.map((nominee) => (
          <div key={nominee.account_id} className={styles.nominee}>
            <p>{nominee.account_id}</p>
            <button onClick={() => voteForNominee(nominee.account_id)}>
              Vote
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};