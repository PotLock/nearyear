import React from 'react';
import { TwitterTweetEmbed } from 'react-twitter-embed';
import tweetData from '../data/tweets.json';

const TweetWall = () => {
  return (
    <div style={{ 
      display: 'flex', 
      overflowX: 'auto', 
      gap: '20px', 
      padding: '20px 0', 
      whiteSpace: 'nowrap' 
    }}>
      {tweetData.tweetIds.map((tweetId, index) => (
        <div key={index} style={{ 
          display: 'inline-block', 
          minWidth: '300px', 
          maxWidth: '400px', 
          flex: '0 0 auto' 
        }}>
          <TwitterTweetEmbed
            tweetId={tweetId}
            options={{ cards: 'hidden' }}
            onClick={() => window.open(`https://x.com/${tweetId}`, '_blank')}
          />
        </div>
      ))}
    </div>
  );
};

export default TweetWall; 