import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Head from 'next/head';

// Define the competitions data
const competitionsData = [
  {
    competitions: [
      {
        name: "MOST EXCITING THING ON NEAR for 2025",
        description: "Discover the most groundbreaking developments on NEAR for 2025.",
        category: "Overall Concepts",
        listLink: "",
        points: 10,
        content: [
          { name: "Chain Abstraction", comment: "Innovative approach to blockchain interoperability" },
          { name: "AI", comment: "Artificial Intelligence integration in NEAR" },
          { name: "Apps", comment: "New applications built on NEAR" }
        ]
      },
      {
        name: "BEST EVENT for NEAR in 2024",
        description: "Highlighting the top events that shaped NEAR in 2024.",
        category: "Overall Concepts",
        listLink: "",
        points: 8,
        content: [
          { name: "Eth Denver", comment: "" },
          { name: "Consensys", comment: "" },
          { name: "Redacted + Devcon", comment: "" },
          { name: "Token2049", comment: "" },
          { name: "Eth CC", comment: "" }
        ]
      },
      {
        name: "Best Tech Innovation",
        description: "Recognizing the most innovative technological advancements on NEAR.",
        category: "Overall Concepts",
        listLink: "",
        points: 12,
        content: [
          { name: "Chain Signatures", comment: "" },
          { name: "NEAR DA", comment: "" },
          { name: "NEAR Intents", comment: "" },
          { name: "Nightshade 2.0", comment: "" }
        ]
      },
      {
        name: "BEST JOKE in NEAR",
        description: "Celebrating the humor and light-hearted moments within the NEAR community.",
        category: "Overall Concepts",
        listLink: "",
        points: 5,
        content: [
          { name: "Jensen touching Illia", comment: "" },
          { name: "HiJack Twitter Account", comment: "" },
          { name: "NEAR is a Doge L2", comment: "" },
          { name: "Baby Blackdragon", comment: "" }
        ]
      },
      {
        name: "BEST NEW PROJECT",
        description: "Projects that launched major products on mainnet or started from scratch in 2024.",
        category: "Projects",
        listLink: "",
        points: 15,
        content: [
          { name: "BlackDragon", comment: "" },
          { name: "NEAR AI 🟡", comment: "" },
          { name: "Intear", comment: "" },
          { name: "NEAR Intents 🟡", comment: "" },
          { name: "Omnilane 🟡", comment: "" },
          { name: "FastNEAR", comment: "" },
          { name: "Meme.cooking", comment: "" },
          { name: "$Purge 🟡", comment: "" },
          { name: "Potlock", comment: "" },
          { name: "Mitte 🟡", comment: "" },
          { name: "Race of Sloths 🟡", comment: "" },
          { name: "DeFi Shardz 🟡", comment: "" },
          { name: "NEAR Catalog", comment: "" },
          { name: "Deltabot", comment: "" },
          { name: "Fast NEAR", comment: "" }
        ]
      },
      {
        name: "BEST DeFI Project",
        description: "Live projects based on activity, unlock, and handling funds or leveraging wallets.",
        category: "Projects",
        listLink: "https://alpha.potlock.org/list/28",
        points: 15,
        content: [
          { name: "Ref", comment: "" },
          { name: "Burrow 🟡", comment: "" },
          { name: "NEAR Intents 🟡", comment: "" },
          { name: "Linear", comment: "" },
          { name: "Meta Pool", comment: "" },
          { name: "Meme.cooking", comment: "" },
          { name: "Mitte 🟡", comment: "" },
          { name: "Veax 🟡", comment: "" },
          { name: "Delta Bot", comment: "" },
          { name: "Intear - 🔵", comment: "" }
        ]
      },
      {
        name: "BEST NEW TOKEN",
        description: "Best new ecosystem token that launched this year.",
        category: "Projects",
        listLink: "https://alpha.potlock.org/list/32",
        points: 15,
        content: [
          { name: "Asian Girl Boss", comment: "" },
          { name: "Purge", comment: "" },
          { name: "Intear", comment: "" },
          { name: "Lonk", comment: "" },
          { name: "BLACKDRAGON", comment: "" },
          { name: "ASI", comment: "" },
          { name: "TOUCH", comment: "" },
          { name: "FAST", comment: "" }
        ]
      },
      {
        name: "Best NEAR Token 2024",
        description: "Best ecosystem token natively deployed on NEAR.",
        category: "Projects",
        listLink: "https://alpha.potlock.org/list/31",
        points: 15,
        content: [
          { name: "Aurora ($AURORA)", comment: "" },
          { name: "Burrow ($BRRR)", comment: "" },
          { name: "Sweat ($SWEAT)", comment: "" },
          { name: "ASI ($ASI)", comment: "" },
          { name: "Black Dragon ($BLACKDRAGON)", comment: "" },
          { name: "NEKO ($NEKO)", comment: "" },
          { name: "Asian Girl Boss ($AGB)", comment: "" },
          { name: "Forgive me Father ($PURGE)", comment: "" },
          { name: "USDC Native ($USDC)", comment: "" },
          { name: "USDT Native ($USDT)", comment: "" },
          { name: "Linear ($LINA)", comment: "" },
          { name: "Uwon $UWON", comment: "" },
          { name: "stNEAR ($stNEAR)", comment: "" },
          { name: "Shitzu", comment: "" },
          { name: "Intear $INTEAR", comment: "" },
          { name: "Ref ($REF)", comment: "" },
          { name: "$KAT", comment: "" },
          { name: "$TOUCHED", comment: "" },
          { name: "NEAT", comment: "" },
          { name: "Edge Video AI ($FAST)", comment: "" },
          { name: "USMeme", comment: "" },
          { name: "Gear ($GEAR)", comment: "" }
        ]
      },
      {
        name: "Best New PFP Collection",
        description: "Generative PFP collection that launched in 2024.",
        category: "Projects",
        listLink: "https://alpha.potlock.org/list/40",
        points: 15,
        content: [
          { name: "Shitzu Reveal", comment: "" },
          { name: "Blackdragon NFT", comment: "" },
          { name: "Mitterian NFTs by Mitte", comment: "" },
          { name: "NDC Baddies", comment: "" },
          { name: "YEAR OF CHEF", comment: "" },
          { name: "UseMen", comment: "" }
        ]
      },
      {
        name: "BEST New Non-PFP NFT (INCLUDING NON PFPs)",
        description: "Best NFT Collection based on utility and traction.",
        category: "Projects",
        listLink: "",
        points: 15,
        content: [
          { name: "Deltadisk", comment: "" },
          { name: "Harvest Moon + Harvest Moon Relics", comment: "" },
          { name: "Pikespeak Transaction NFTs", comment: "" }
        ]
      },
      {
        name: "Best Existing NFT Collection",
        description: "NFT Projects already on NEAR before 2024 that are considered the best 2024 legacy project.",
        category: "Projects",
        listLink: "https://alpha.potlock.org/list/41",
        points: 15,
        content: [
          { name: "Friendly Felines", comment: "" },
          { name: "NEAR TInker Union", comment: "" },
          { name: "Pumpopoly", comment: "" },
          { name: "HERE Early User NFTs", comment: "" },
          { name: "Dragon verse eggs 🔵", comment: "" }
        ]
      },
      {
        name: "Most Anticipated NEAR Mainnet Launches",
        description: "Projects in the NEAR Ecosystem that are preparing to launch on mainnet.",
        category: "Projects",
        listLink: "",
        points: 15,
        content: [
          { name: "Templar Protocol", comment: "" },
          { name: "Nillion 🟡", comment: "" },
          { name: "Phala 🟡", comment: "" },
          { name: "Nuffle AVS 🟡", comment: "" },
          { name: "Thunderhood 🟡", comment: "" },
          { name: "BetVex 🟡", comment: "" },
          { name: "Infinex 🟡", comment: "" },
          { name: "Atlas Protocol 🟡", comment: "" },
          { name: "Satoshi Protocl 🟡", comment: "" },
          { name: "Bithive", comment: "" },
          { name: "QStar Labs 🟡", comment: "" },
          { name: "House of Stake 🟡", comment: "" },
          { name: "Ducant - Bitcoin stable coin 🟡", comment: "" },
          { name: "01 Labs? 🟡", comment: "" },
          { name: "D3 Network 🟡", comment: "" }
        ]
      },
      {
        name: "Best New Smart Contract",
        description: "Best contract deployed in 2024. Most impactful contract.",
        category: "Projects",
        listLink: "",
        points: 15,
        content: [
          { name: "MPC Contract by Signet", comment: "" },
          { name: "NEAR Intents intents.near", comment: "" },
          { name: "Potlock Factory v1 v1.potfactory.potlock.near", comment: "" },
          { name: "MpDAO Vote Contract mpdao-vote.near", comment: "" },
          { name: "Mitte token contract token0.near", comment: "" },
          { name: "NEAR DA", comment: "" },
          { name: "meme-cooking.near", comment: "" },
          { name: "omft.near", comment: "" }
        ]
      },
      {
        name: "Strongest Community",
        description: "Strongest community of builders on NEAR.",
        category: "Projects",
        listLink: "https://alpha.potlock.org/list/38",
        points: 15,
        content: [
          { name: "Learn NEAR Club", comment: "" },
          { name: "Build DAO", comment: "" },
          { name: "Blackdragon", comment: "" },
          { name: "Neko", comment: "" },
          { name: "Shitzu", comment: "" }
        ]
      },
      {
        name: "MOST ANTICIPATED NEAR TOKEN LAUNCH",
        description: "Expected token launch of a NEAR origin project with a NEAR token.",
        category: "Projects",
        listLink: "https://alpha.potlock.org/list/27",
        points: 15,
        content: [
          { name: "NUFFLE 🟡", comment: "" },
          { name: "BITTE (only have Mintbase profile)", comment: "" },
          { name: "METEOR", comment: "" },
          { name: "HOT 🟡", comment: "" },
          { name: "DapDap 🟡", comment: "" },
          { name: "POTLOCK", comment: "" }
        ]
      },
      {
        name: "Best NFT PLATFORM",
        description: "Live NFT platform that put in the most work for the NEAR ecosystem.",
        category: "Projects",
        listLink: "https://alpha.potlock.org/list/29",
        points: 15,
        content: [
          { name: "DefiShardz 🟡", comment: "" },
          { name: "Mitte:NFT 🟡", comment: "" },
          { name: "BODEGA", comment: "" },
          { name: "Sharddog", comment: "" },
          { name: "PARAS 🟡", comment: "" },
          { name: "MINTBASE", comment: "" },
          { name: "NAMESKY", comment: "" }
        ]
      },
      {
        name: "BEST Multichain Expansion",
        description: "Project that had the best expansions in terms of capturing mindshare, partnerships, liquidity, and users on other chains.",
        category: "Projects",
        listLink: "https://alpha.potlock.org/list/33",
        points: 15,
        content: [
          { name: "NEAR DA / Nuffle - Eigen Layer AVS Expansion 🟡", comment: "" },
          { name: "Bitte - through chain abstraction", comment: "" },
          { name: "Aurora - Virtuals Chians & NEAR Intents 🟡", comment: "" },
          { name: "Hot - shipping Chain signatures early 🟡", comment: "" },
          { name: "DapDap - first l2s with BOS narrative in 2023, continuing 🟡", comment: "" },
          { name: "Eliza Framework - NEAR integration but chain abstractiond evelopment frmaeowkr 🟡", comment: "" },
          { name: "PlayEmber: 🟡", comment: "" },
          { name: "Meta Pool - liquidi staking onS oalna, EVM ICP, and Multichain governance settled on DAO on NEAR. Support public goods funding throuhg Gitcoin and Potlock and funded project across those ecosystems.", comment: "" }
        ]
      },
      {
        name: "BEST DAO on NEAR",
        description: "Must have a DAO address on NEAR active in past year.",
        category: "Projects",
        listLink: "https://alpha.potlock.org/list/34",
        points: 15,
        content: [
          { name: "Blackdragon DAO", comment: "" },
          { name: "Ref DAO", comment: "" },
          { name: "mpDAO", comment: "" },
          { name: "Build DAO", comment: "" },
          { name: "Blunt DAO", comment: "" },
          { name: "NEARWEEK NewsDAO", comment: "" },
          { name: "Shitzu DAO", comment: "" },
          { name: "Hijack DAO", comment: "" }
        ]
      },
      {
        name: "BEST OPEN SOURCE PROJECT",
        description: "Project must be completely open source with publicly visible contributor commits.",
        category: "Projects",
        listLink: "https://alpha.potlock.org/list/35",
        points: 15,
        content: [
          { name: "Keypom", comment: "" },
          { name: "Potlock", comment: "" },
          { name: "Calimero", comment: "" },
          { name: "Aurora 🟡", comment: "" },
          { name: "MyNEAR Wallet", comment: "" },
          { name: "NEAR Blocks", comment: "" },
          { name: "NEAR Social", comment: "" },
          { name: "NEAR Catalog", comment: "" },
          { name: "Devhub Platform", comment: "" },
          { name: "Metapool", comment: "" },
          { name: "FastNEAR", comment: "" },
          { name: "Reclaim Protocol 🟡", comment: "" }
        ]
      },
      {
        name: "Best Wallet",
        description: "Best wallet in terms of onboarding, NEAR nativeness, and ecosystem traction.",
        category: "Projects",
        listLink: "https://alpha.potlock.org/list/51",
        points: 15,
        content: [
          { name: "BitGet Wallet 🟡", comment: "" },
          { name: "Nightly Wallet 🟡", comment: "" },
          { name: "Meteor Wallet", comment: "" },
          { name: "Hot Wallet / HERE Wallet", comment: "" },
          { name: "My NEAR Mobile Wallet", comment: "" },
          { name: "Welldone Wallet 🟡", comment: "" },
          { name: "OKX Wallet 🟡", comment: "" },
          { name: "Coin98 Wallet 🟡", comment: "" }
        ]
      },
      {
        name: "BEST Pivot",
        description: "A project on NEAR that had a major pivot in 2024 that has the most potential upside or already materialized.",
        category: "Projects",
        listLink: "https://alpha.potlock.org/list/36",
        points: 15,
        content: [
          { name: "Bitte - nft infra to chain abstracted agents", comment: "" },
          { name: "NEAR AI - ??? 💛", comment: "" },
          { name: "Nuffle - From DA - Eigen DeFi 🟡", comment: "" },
          { name: "Keypom - from Onboarding to Infinx infrastructure via acquisition", comment: "" },
          { name: "Mitte - NFT orderbook → launchpad 🟡", comment: "" },
          { name: "DapDap? — enterprise front ends 🟡", comment: "" },
          { name: "Sender - from Wallet to AGI and ASI token 🟡", comment: "" },
          { name: "NDC→ Blackdragon", comment: "" },
          { name: "NEAT - Inscriptions to AI 🟡", comment: "" },
          { name: "HERE - Pivot to Hot Chain Signatures, double downing on hot", comment: "" },
          { name: "Shitzu - NEAR migration then launchpad", comment: "" }
        ]
      },
      {
        name: "BEST INFRASTRCTURE",
        description: "Projects are evaluated based on their ecosystem impact, technical performance, and proven ability to deliver infrastructure solutions.",
        category: "Projects",
        listLink: "https://alpha.potlock.org/list/37",
        points: 15,
        content: [
          { name: "Lava Network 🟡", comment: "" },
          { name: "Fast NEAR", comment: "" },
          { name: "NEAR Blocks", comment: "" },
          { name: "Aurora (Virtual Chains, Intents) 🟡", comment: "" },
          { name: "Keypom", comment: "" },
          { name: "Signet 🟡", comment: "" },
          { name: "Calimero", comment: "" },
          { name: "Intear", comment: "" },
          { name: "Pikespeak 🟡", comment: "" },
          { name: "LNC Watch Bot", comment: "" }
        ]
      },
      {
        name: "Best Privacy Project",
        description: "Best. This includes tools that provide anoynmity, privacy or utilize ZK, TEE, or MPC technology.",
        category: "Projects",
        listLink: "https://alpha.potlock.org/list/30",
        points: 15,
        content: [
          { name: "Calimero", comment: "" },
          { name: "Holynom", comment: "" },
          { name: "Reclaim Protocol 🟡", comment: "" },
          { name: "Opact", comment: "" },
          { name: "Nillion 🟡", comment: "" },
          { name: "Phala 🟡", comment: "" }
        ]
      },
      {
        name: "Best Consumer App",
        description: "Provides most values to the consumer, consistently has DAUs, and has potential to get crypto mass adoption.",
        category: "Projects",
        listLink: "https://alpha.potlock.org/list/42",
        points: 15,
        content: [
          { name: "Hot Wallet 🟡", comment: "" },
          { name: "Sweat 🟡", comment: "" },
          { name: "Kaichin 🟡", comment: "" }
        ]
      },
      {
        name: "Best AI Project Live on NEAR",
        description: "Project must make significant use of AI and be live on mainnet with direct interactions with NEAR L1.",
        category: "Projects",
        listLink: "https://alpha.potlock.org/list/53",
        points: 15,
        content: [
          { name: "Bitte", comment: "" },
          { name: "NEAR AI 🟡", comment: "" },
          { name: "Cosmose AI 🟡", comment: "" },
          { name: "Intear", comment: "" },
          { name: "Eliza 🟡", comment: "" },
          { name: "PURGE 🟡", comment: "" },
          { name: "Dune Alytics 🟡", comment: "" },
          { name: "NEAR Tasks 🟡", comment: "" },
          { name: "ShillGPT", comment: "" },
          { name: "Strawberry AI 🟡", comment: "" },
          { name: "Deltatrade", comment: "" },
          { name: "Ringfenc 🟡", comment: "" }
        ]
      },
      {
        name: "BEST DRAMA",
        description: "Highlighting the most dramatic events in the NEAR ecosystem.",
        category: "Downbad",
        listLink: "",
        points: 5,
        content: [
          { name: "NDC Shutting down", comment: "" },
          { name: "King Lonk taking over", comment: "" },
          { name: "Inscriptions & Infra", comment: "" },
          { name: "Pagoda Windown", comment: "" },
          { name: "Octopus disappears", comment: "" },
          { name: "Alex Skidanov spawns", comment: "" },
          { name: "NEAR Accounts get hacked", comment: "" },
          { name: "Whats happening to BOS", comment: "" }
        ]
      },
      {
        name: "Biggest Grift",
        description: "Identifying the biggest grifts within the NEAR ecosystem.",
        category: "Downbad",
        listLink: "",
        points: 5,
        content: [
          { name: "BOS", comment: "" },
          { name: "Octopus Network", comment: "" },
          { name: "NFT Ecosystem", comment: "" },
          { name: "Grassroots DAOs", comment: "" },
          { name: "Aurora DAOs", comment: "" },
          { name: "Regional Hubs", comment: "" },
          { name: "Pagoda", comment: "" }
        ]
      },
      {
        name: "Projects that we want to see back on NEAR",
        description: "Projects that the community wishes to see return to NEAR.",
        category: "Downbad",
        listLink: "",
        points: 5,
        content: [
          { name: "Keypom", comment: "" },
          { name: "AstroDAO 🟡", comment: "" },
          { name: "Cron Cat 🟡", comment: "" },
          { name: "Tonic / Spin / Orderbook", comment: "" },
          { name: "Opact Tickets", comment: "" },
          { name: "Mr Brown", comment: "" }
        ]
      },
      {
        name: "BEST FAILED DAO",
        description: "DAOs that were operating in 2024 that no longer have funding or are operational.",
        category: "Downbad",
        listLink: "",
        points: 5,
        content: [
          { name: "Onboard DAO", comment: "" },
          { name: "Creatives DAO", comment: "" },
          { name: "Marketing DAO", comment: "" },
          { name: "NEAR Digital Collecteive", comment: "" }
        ]
      },
      {
        name: "Saddest Project Shutdowns",
        description: "NEAR Projects that shutdown this year that we are sad about.",
        category: "Downbad",
        listLink: "",
        points: 5,
        content: [
          { name: "Creatives DAOs", comment: "" },
          { name: "Marketing DAOs", comment: "" },
          { name: "Opact Tickets", comment: "" },
          { name: "BOS 🟡", comment: "" },
          { name: "NEAR DC", comment: "" },
          { name: "Astra++", comment: "" },
          { name: "Octopus Network", comment: "" },
          { name: "Keypom - acquisition", comment: "" },
          { name: "I Am Human", comment: "" }
        ]
      },
      {
        name: "BEST NEAR REGIONAL COMMUNITY WHILE IT LASTED",
        description: "Best regional hub, community etc that existed in 2024 before wind-downs.",
        category: "Downbad",
        listLink: "https://alpha.potlock.org/list/54",
        points: 5,
        content: [
          { name: "NEAR Vietnam Hub", comment: "" },
          { name: "NEAR Vietnam DAO", comment: "" },
          { name: "NEAR Balkans", comment: "" },
          { name: "NEAR Africa", comment: "" },
          { name: "Banyan", comment: "" },
          { name: "NEAR Ukraine Guild", comment: "" },
          { name: "NEAR Protocol China 🟡", comment: "" },
          { name: "NEAR Toronto", comment: "" },
          { name: "NEAR Korea DAO", comment: "" },
          { name: "NEAR Korea Hub 🟡", comment: "" }
        ]
      },
      {
        name: "MOST Likely to generate the most DeFI Revenue",
        description: "Projects most likely to generate significant DeFi revenue.",
        category: "Future Look in 2025",
        listLink: "",
        points: 10,
        content: [
          { name: "NEAR Intents", comment: "" },
          { name: "ReF", comment: "" },
          { name: "Templar Protocol", comment: "" },
          { name: "Burrow", comment: "" },
          { name: "OMNILANE 🟡", comment: "" },
          { name: "Nuffle 🟡", comment: "" },
          { name: "Meme cooking", comment: "" },
          { name: "Mitte", comment: "" }
        ]
      },
      {
        name: "Most LIkely App to Get A Billion Users First",
        description: "Apps most likely to reach a billion users first.",
        category: "Future Look in 2025",
        listLink: "",
        points: 10,
        content: [
          { name: "Hot", comment: "" },
          { name: "USDC on NEAR 🟡", comment: "" },
          { name: "USDT on NEAR 🟡", comment: "" },
          { name: "KACHING 🟡", comment: "" },
          { name: "SWEAT 🟡", comment: "" },
          { name: "Ref", comment: "" },
          { name: "NEAR AI 🟡", comment: "" },
          { name: "BITTE", comment: "" },
          { name: "METEOR", comment: "" },
          { name: "AURORA VIRTUAL CHAINS 🟡", comment: "" }
        ]
      },
      {
        name: "COOLEST FOUNDER ON NEAR",
        description: "Recognizing the coolest founders in the NEAR ecosystem.",
        category: "People",
        listLink: "https://alpha.potlock.org/list/24",
        points: 10,
        content: [
          { name: "WEB3HEDGE", comment: "" },
          { name: "Edward from Meteor Wallet", comment: "" },
          { name: "OLEG from Sweat", comment: "" },
          { name: "Myron from Kaichinge 🟡", comment: "" },
          { name: "Socrates from DapDap 🟡", comment: "" },
          { name: "Kendall from Proximity 🟡", comment: "" },
          { name: "Vlad from Web4", comment: "" },
          { name: "Evgeny from Fast NEAR / NEAR Social", comment: "" },
          { name: "CLaudio from Meta Pool", comment: "" },
          { name: "Lucio from Meta Pool", comment: "" },
          { name: "BENJI", comment: "" },
          { name: "Ilblackdragon from NEAR Protocol", comment: "" },
          { name: "Petr at Here Wallet", comment: "" },
          { name: "Nate from Bitte", comment: "" },
          { name: "Plug from Potlock", comment: "" },
          { name: "DIDIER FROM Pikespeak", comment: "" },
          { name: "Sandi from Calimero", comment: "" },
          { name: "Sasha from Lean NEAR Club", comment: "" }
        ]
      },
      {
        name: "BEST YAPPER",
        description: "Recognizing the best communicators in the NEAR ecosystem.",
        category: "People",
        listLink: "https://alpha.potlock.org/list/18",
        points: 10,
        content: [
          { name: "Altan, CEO at Nuffle Labs", comment: "" },
          { name: "Cameron, Core Contributor at NEAR Protocol", comment: "" },
          { name: "IlblackDragon, Co-Founder at NEAR Protocol", comment: "" },
          { name: "Evgeny, Founder of Fast NEAR", comment: "" },
          { name: "Wax", comment: "" },
          { name: "Aescobar", comment: "" },
          { name: "AVB - Host of Wild User Interview", comment: "" },
          { name: "Joe Co-Founder of Shard Dog", comment: "" },
          { name: "Cade", comment: "" },
          { name: "Jarrod Barnes, Ecosystem at NEAR Foundation", comment: "" },
          { name: "Jared Thompson", comment: "" },
          { name: "Kendall Director of Proximity Labs", comment: "" },
          { name: "David Morro - Head of Creative Campaigns at NEAR Foundation", comment: "" }
        ]
      },
      {
        name: "Best Content Creator",
        description: "People who consistently create multimedia content around NEAR.",
        category: "People",
        listLink: "https://alpha.potlock.org/list/26",
        points: 10,
        content: [
          { name: "Cade, NEARWeek Content", comment: "" },
          { name: "AVB from Wild User Interviews", comment: "" },
          { name: "Jared Thompson from Sharddog and NEAR Foundation", comment: "" },
          { name: "Joe from Devhub", comment: "" },
          { name: "Altan from Chain Abstraction", comment: "" },
          { name: "Nono from Neko", comment: "" },
          { name: "Soos from Neko", comment: "" },
          { name: "David Morrison from NEAR Foundation", comment: "" },
          { name: "Peter from NEARWeek", comment: "" }
        ]
      },
      {
        name: "Most Likely to Never Leave NEAR Eco",
        description: "People who would remain committed to NEAR even without financial compensation.",
        category: "People",
        listLink: "https://alpha.potlock.org/list/44",
        points: 10,
        content: [
          { name: "Nate Founder of Bitte", comment: "" },
          { name: "Vlad G - Founder of Web4", comment: "" },
          { name: "Frol - Core Contributor at DevHub", comment: "" },
          { name: "Alex - Founder of Aurora 🟡", comment: "" },
          { name: "Bowen - Head of Protocol", comment: "" },
          { name: "Evgeny K - Founder of NEAR", comment: "" },
          { name: "Kendall - Director of Proximity 🟡", comment: "" },
          { name: "Cameron Dennis", comment: "" },
          { name: "Oleg - Founder of Sweat", comment: "" },
          { name: "Mally from NEAR Foundation", comment: "" },
          { name: "Maggy from NEA", comment: "" },
          { name: "Harshit from NEAR Foundation", comment: "" },
          { name: "David MOrrison.- Contnt at NEAR Foundation", comment: "" },
          { name: "Sasha from Learn NEAR Club", comment: "" },
          { name: "Jonathan from meteor Wallet", comment: "" },
          { name: "Rekt Degen from Meteor Wallet", comment: "" },
          { name: "Amos from Meta Web", comment: "" }
        ]
      },
      {
        name: "WHO FROM NEAR NEEDS TO START YAPPING MORE",
        description: "NEAR OGs that just aren't yapping enough this year.",
        category: "People",
        listLink: "https://alpha.potlock.org/list/45",
        points: 10,
        content: [
          { name: "Matt from Proximity", comment: "" },
          { name: "Rekt Degen", comment: "" },
          { name: "Abhishek 🟡", comment: "" },
          { name: "ALex Skidanov 🟡", comment: "" },
          { name: "Vlad from Web4", comment: "" },
          { name: "Sandi from Calimero", comment: "" },
          { name: "Didier from Pikespeak", comment: "" },
          { name: "Eric from Pagoda", comment: "" }
        ]
      },
      {
        name: "BEST AT NEAR Foundation 2024",
        description: "Best NEAR Foundation Contributor.",
        category: "People",
        listLink: "https://alpha.potlock.org/list/48",
        points: 10,
        content: [
          { name: "HARSHIT", comment: "" },
          { name: "JARROD BARNES", comment: "" },
          { name: "VIKASH 🟡", comment: "" },
          { name: "DAVID Norris 🟡", comment: "" },
          { name: "Jared thompson", comment: "" },
          { name: "Abhishek 🟡", comment: "" },
          { name: "Konrad 🟨", comment: "" },
          { name: "Anyone from NEAR can apply", comment: "" }
        ]
      },
      {
        name: "BADDEST BADDIES ON NEAR",
        description: "Recognizing the baddest baddies in the NEAR ecosystem.",
        category: "People",
        listLink: "https://alpha.potlock.org/list/52",
        points: 10,
        content: [
          { name: "Ester", comment: "" },
          { name: "Paula from Race of Sloths", comment: "" },
          { name: "Kiana from NEAR Foudnation", comment: "" },
          { name: "Luana from Flying Rhino Marketing", comment: "" }
        ]
      },
      {
        name: "Best Data Analyst",
        description: "Recognizing the best data analysts in the NEAR ecosystem.",
        category: "People",
        listLink: "https://alpha.potlock.org/list/23",
        points: 10,
        content: [
          { name: "Lord King", comment: "" },
          { name: "Masi 🟡", comment: "" },
          { name: "Abshi A - NF", comment: "" },
          { name: "Francois - Pikespeak", comment: "" },
          { name: "Flispide team 🟡", comment: "" }
        ]
      },
      {
        name: "BEST ARTISTS",
        description: "Best artists on NEAR in 2024 that are still active.",
        category: "People",
        listLink: "https://alpha.potlock.org/list/43",
        points: 10,
        content: [
          { name: "Zeitwarp", comment: "" },
          { name: "Paloma", comment: "" },
          { name: "Rhyme Taylor", comment: "" },
          { name: "Vandal", comment: "" },
          { name: "Shitzu Artist 🟡", comment: "" },
          { name: "Blackdragon Artist (need name) 🟡", comment: "" }
        ]
      },
      {
        name: "Most Helpful NEARIAN",
        description: "Person in community who is the most helpful.",
        category: "People",
        listLink: "https://alpha.potlock.org/list/25",
        points: 10,
        content: [
          { name: "Marcus", comment: "" },
          { name: "Cameron", comment: "" },
          { name: "Yuen", comment: "" },
          { name: "Aesocbar", comment: "" },
          { name: "AGT 🟡", comment: "" },
          { name: "Odin", comment: "" },
          { name: "Efiz", comment: "" },
          { name: "Joe from Sharddog", comment: "" },
          { name: "Chloe from Marma J", comment: "" },
          { name: "Alan from Open Web Academy / Metapool", comment: "" },
          { name: "Slimedragon from Intear", comment: "" },
          { name: "Jarrod Barnes from NEAR Foundation", comment: "" },
          { name: "Kent | need to add", comment: "" }
        ]
      },
      {
        name: "Most Likely to Be involved with the most projects on NEAR",
        description: "Recognizing those involved with the most projects on NEAR.",
        category: "People",
        listLink: "https://alpha.potlock.org/list/22",
        points: 10,
        content: [
          { name: "Aeoscbar", comment: "" },
          { name: "Yuen", comment: "" }
        ]
      },
      {
        name: "BEST BD at NEAR",
        description: "Best business development at NEAR.",
        category: "People",
        listLink: "https://alpha.potlock.org/list/20",
        points: 10,
        content: [
          { name: "Cameron Dennis", comment: "" },
          { name: "Harshit", comment: "" },
          { name: "Jarrod Barnes", comment: "" },
          { name: "Claudio from Metapool", comment: "" }
        ]
      },
      {
        name: "BIGGEST VIBE ON NEAR",
        description: "Recognizing the biggest vibe in the NEAR ecosystem.",
        category: "People",
        listLink: "https://alpha.potlock.org/list/21",
        points: 10,
        content: [
          { name: "David Morrison", comment: "" },
          { name: "Web3Hedge", comment: "" },
          { name: "Oleg", comment: "" },
          { name: "Russ", comment: "" },
          { name: "Cameron", comment: "" },
          { name: "Efiz 💙", comment: "" }
        ]
      },
      {
        name: "Most Cracked NEAR Dev",
        description: "Recognizing the most skilled developers in the NEAR ecosystem.",
        category: "People",
        listLink: "https://alpha.potlock.org/list/19",
        points: 10,
        content: [
          { name: "Iliblackdragon", comment: "" },
          { name: "Microchipgnu CTO of Mintbase", comment: "" },
          { name: "Benji from Keypom", comment: "" },
          { name: "Evgen from Fast NEAR", comment: "" },
          { name: "Mike Purvis", comment: "" },
          { name: "Petr from Here Wallet", comment: "" },
          { name: "Vadim from NEAR AI", comment: "" },
          { name: "Bowen from NEAR One", comment: "" },
          { name: "Firat from Nuffle Labs", comment: "" },
          { name: "Vlad from DevHub", comment: "" },
          { name: "Alex from Aurora", comment: "" },
          { name: "Mario from Meme Cooking", comment: "" },
          { name: "Slime from Intear", comment: "" },
          { name: "Rekt Degen from Meteor Wallet", comment: "" },
          { name: "Robert Yan from ???", comment: "" },
          { name: "Elliot from Build DAO", comment: "" },
          { name: "Vlad from Web4", comment: "" },
          { name: "Peter from NEAR DevHub", comment: "" },
          { name: "Olga from NEAR One 🟡", comment: "" },
          { name: "DMD from Signet 🟡", comment: "" }
        ]
      },
      {
        name: "Biggest Degen on NEAR",
        description: "Biggest degenerate in the trenches at NEAR.",
        category: "People",
        listLink: "https://alpha.potlock.org/list/47",
        points: 10,
        content: [
          { name: "Harshit from NEAE foundation", comment: "" },
          { name: "AVB from Wild User Interviews", comment: "" },
          { name: "Dleer from Neko", comment: "" },
          { name: "Wax From Chill", comment: "" },
          { name: "Marcus from Frontier growth", comment: "" },
          { name: "Groggs from Hijack", comment: "" },
          { name: "Mario from meme cooking", comment: "" },
          { name: "Cade from Wolf", comment: "" }
        ]
      },
      {
        name: "BEST DEV REL",
        description: "Best at communicating with developers for NEAR, doing dev work, supporting hackathons, writing documentation, and bringing new developers into the ecosystem.",
        category: "People",
        listLink: "https://alpha.potlock.org/list/46",
        points: 10,
        content: [
          { name: "Guillermo - writes all docs and leads dev rel", comment: "" },
          { name: "Elliot - build dao and ecosystem savan", comment: "" },
          { name: "Min - keypom cto and og dev rel", comment: "" },
          { name: "Vlad - devhub and super near og", comment: "" },
          { name: "Joe - OG dev rel, shard dog shipper, livestreamer", comment: "" },
          { name: "Owen - devrel, community caller, leaving to pursue on-chaindegeneracy at BetVex", comment: "" },
          { name: "Luis from Bitte", comment: "" }
        ]
      },
      {
        name: "BEST NEAR ECO LAWYER",
        description: "Practicing lawyers that represent NEAR Ecosystem projects.",
        category: "People",
        listLink: "https://alpha.potlock.org/list/50",
        points: 10,
        content: [
          { name: "Chris Donavan 🟡", comment: "" },
          { name: "Abhishek, General Counsel at NEAR FOUNDATION 🟡", comment: "" },
          { name: "Marc Goldfinch, Counsel at Proximity 🟡", comment: "" },
          { name: "Atrox, NDC & Blackdragon", comment: "" },
          { name: "Bianca, NEAR Foundation 🌕", comment: "" },
          { name: "Davin, NEAR Foundation 🌕", comment: "" }
        ]
      }
    ]
  }
];

const categoryColors = {
  "Overall Concepts": "#FFD700",
  "Projects": "#ADFF2F",
  "Downbad": "#FF6347",
  "Future Look in 2025": "#87CEEB",
  "People": "#FF69B4"
};

const LandingPage = () => {
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

  const categories = ['All', ...new Set(competitionsData.flatMap(group => group.competitions.map(comp => comp.category)))];
  const competitors = ['All', ...new Set(competitionsData.flatMap(group => group.competitions.flatMap(comp => comp.content.map(item => item.name))))];

  const filteredCompetitions = competitionsData.flatMap(group => group.competitions)
    .filter(competition => 
      (selectedCategory === 'All' || competition.category === selectedCategory) &&
      (selectedCompetitor === 'All' || competition.content.some(item => item.name === selectedCompetitor)) &&
      competition.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalCompetitions = competitionsData.flatMap(group => group.competitions).length;

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
        <header style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '4em', fontWeight: 'bold', margin: '0', color: '#333' }}>NEAR YEAR</h1>
          <p style={{ fontSize: '1.5em', margin: '10px 0 20px', color: '#666' }}>
            Celebrating the NEAR Eco Achievements and Future Innovations
          </p>

        </header>

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
          <h2 style={{ fontSize: '2em', fontWeight: 'bold', textAlign: 'center', color: '#333' }}>Filter by Category</h2>
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
            {filteredCompetitions.map((competition, idx) => (
              <div key={idx} style={{ flex: '1 1 calc(33% - 20px)', border: '1px solid #ccc', borderRadius: '8px', padding: '20px', position: 'relative', backgroundColor: '#fff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: categoryColors[competition.category], padding: '5px 10px', borderRadius: '5px', color: '#fff', fontSize: '0.8em' }}>
                  {competition.category}
                </div>
                <h3 style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => toggleCompetition(idx)}>
                  {competition.name}
                </h3>
                {expandedCompetition === idx && (
                  <div style={{ marginTop: '10px' }}>
                    <p>{competition.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {competition.content.map((item, itemIdx) => (
                        <div 
                          key={itemIdx} 
                          style={{ flex: '1 1 calc(33% - 10px)', border: '1px solid #eee', borderRadius: '8px', padding: '10px', position: 'relative', backgroundColor: '#f9f9f9' }}
                          title={item.comment}
                        >
                          <strong>{item.name}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {competition.listLink.includes('potlock.org') && (
                  <a 
                    href={competition.listLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ position: 'absolute', bottom: '10px', right: '10px', cursor: 'pointer', transition: 'transform 0.3s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    🔗
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2em', fontWeight: 'bold', textAlign: 'center', color: '#333' }}>Timeline</h2>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            {timelineEvents.map((event, index) => (
              <div key={index} style={{
                width: '80%',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#fff',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                position: 'relative',
                animation: isActive(event.start, event.end) ? 'glow 1.5s infinite' : 'none'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  height: '5px',
                  width: isActive(event.start, event.end) ? '100%' : '0',
                  backgroundColor: '#FFD700',
                  transition: 'width 0.3s'
                }}></div>
                <h3 style={{ fontWeight: 'bold', color: '#333' }}>{event.title}</h3>
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  fontSize: '0.9em',
                  color: '#666'
                }}>
                  📅 {event.start.toLocaleDateString()} to {event.end.toLocaleDateString()}
                </div>
                <ul style={{ paddingLeft: '20px', color: '#666' }}>
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
            ))}
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

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2em', fontWeight: 'bold', textAlign: 'center' }}>🚀 How to Participate</h2>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            
            <div style={{ flex: '1 1 calc(33% - 20px)', border: '1px solid #ccc', borderRadius: '8px', padding: '20px', backgroundColor: '#fff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <h3 style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>👥 For Voters</h3>
              <ol style={{ paddingLeft: '20px', listStyleType: 'decimal' }}>
                <li style={{ marginBottom: '10px' }}>
                  <strong>Get Verified:</strong> Obtain a Sharddog &quot;I Voted&quot; NFT for verification.
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <strong>Vote:</strong> Participate in the voting process during the designated period.
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <strong>Earn Rewards:</strong> Receive an exclusive &quot;NEAR YEAR&quot; Sharddog NFT for participating.
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

        <section style={{ marginBottom: '40px' }}>
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