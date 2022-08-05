import React, { useState, useMemo, useEffect } from "react";

import useSWR from "swr";

import { getTokenInfo, useChainId, useENS } from "../../Helpers";
import { useWeb3React } from "@web3-react/core";
import { getTracerServerUrl } from "../../Api/rewards";
import { useInfoTokens } from "../../Api";
import { ethers } from "ethers";
import TraderRewards from "./TraderRewards";
import Leaderboard from "./Leaderboard";
import * as Styles from "./Rewards.styles";
// import cx from "classnames";
import { LeaderboardSwitch } from "./ViewSwitch";
import Footer from "../../Footer";

const PersonalHeader = () => (
  <div className="Page-title-section mt-0">
    <div className="Page-title">Trader Rewards</div>
    <div className="Page-description">Be in the top 50 % of traders to earn weekly rewards.</div>
  </div>
);

const LeaderboardHeader = () => (
  <div className="Page-title-section mt-0">
    <div className="Page-title">Rewards Leaderboard</div>
    <div className="Page-description">Weekly user rankings by volume.</div>
  </div>
);

export default function Rewards(props) {
  const [currentView, setCurrentView] = useState("Personal");
  const { connectWallet, trackPageWithTraits } = props;

  const { chainId } = useChainId();
  const { active, account, library } = useWeb3React();
  const { ensName } = useENS(account);

  const [selectedWeek, setSelectedWeek] = useState(undefined);

  const { infoTokens } = useInfoTokens(library, chainId, active, undefined, undefined);

  // const { data: rewardProof } = useSWR([getTracerServerUrl(chainId, "/user_reward_proof"), account, selectedWeek, chainId], {
  // fetcher: (url, account, week) => fetch(`${url}&userAddress=${account}&week=${week}`).then((res) => res.json())
  // });

  const { data: rewardWeeks, error: failedFetchingRewards } = useSWR([getTracerServerUrl(chainId, "/rewards")], {
    fetcher: (...args) => fetch(...args).then((res) => res.json()),
  });

  const userData = useMemo(
    () =>
      rewardWeeks?.reduce(
        (totals, week) => {
          const trader = week.traders.find((trader) => trader.user_address === account);
          if (!trader) {
            return totals;
          }
          return {
            totalTradingVolume: totals.totalTradingVolume.add(trader.volume),
            totalRewards: totals.totalRewards.add(trader.reward),
            unclaimedRewards: totals.unclaimedRewards.add(trader?.claimed ? trader.amount : 0),
          };
        },
        {
          totalTradingVolume: ethers.BigNumber.from(0),
          totalRewards: ethers.BigNumber.from(0),
          unclaimedRewards: ethers.BigNumber.from(0),
        }
      ),
    [rewardWeeks, account]
  );

  const weekData = useMemo(() => {
    if (!rewardWeeks) {
      return undefined;
    }
    if (!!rewardWeeks?.message) {
      return undefined;
    }
    const selectedWeekActual = selectedWeek && parseFloat(selectedWeek) - 1;
    const weekData = rewardWeeks?.find((week) => week.week === selectedWeekActual?.toString());
    if (!weekData) {
      return undefined;
    }
    weekData.traders.sort((a, b) => b.volume - a.volume); // Sort traders by highest to lowest in volume
    return weekData;
  }, [rewardWeeks, selectedWeek]);

  const userWeekData = useMemo(() => {
    if (!weekData) {
      return undefined;
    }
    const traderData = weekData.traders?.find((trader) => trader.user_address === account);
    const leaderboardPosition = weekData.traders?.findIndex((trader) => trader.user_address === account);
    // trader's data found
    if (traderData) {
      traderData.position = leaderboardPosition;
      return traderData;
    } else {
      // trader not found but data exists so user has no rewards
      return {
        volume: ethers.BigNumber.from(0),
        reward: ethers.BigNumber.from(0),
      };
    }
  }, [account, weekData]);

  const eth = getTokenInfo(infoTokens, ethers.constants.AddressZero);
  const ethPrice = eth?.maxPrimaryPrice;

  let rewardAmountEth = 0;
  if (ethPrice && userWeekData) {
    rewardAmountEth = ethPrice.mul(userWeekData.reward);
  }

  let unclaimedRewardsEth, totalRewardAmountEth;
  if (ethPrice && userData) {
    unclaimedRewardsEth = ethPrice.mul(userData.unclaimedRewards);
    totalRewardAmountEth = ethPrice.mul(userData.totalRewards);
  }

  if (!rewardWeeks && selectedWeek !== undefined) {
    setSelectedWeek(undefined);
  } else if (selectedWeek === undefined && !!rewardWeeks) {
    setSelectedWeek(parseFloat(rewardWeeks[rewardWeeks.length - 1].week) + 1);
  }

  let rewardsMessage = "";
  if (!rewardWeeks) {
    rewardsMessage = "Fetching rewards";
  } else if (!!failedFetchingRewards) {
    rewardsMessage = "Failed fetching rewards";
  } else {
    if (rewardWeeks?.length === 0) {
      rewardsMessage = "No rewards for network";
    } else {
      rewardsMessage = `Week ${selectedWeek}`;
    }
  }

  const [pageTracked, setPageTracked] = useState(false);

  const switchView = () => {
    setCurrentView(currentView === "Personal" ? "Leaderboard" : "Personal");
  };

  // Segment Analytics Page tracking
  useEffect(() => {
    if (!pageTracked && rewardWeeks) {
      const traits = {
        week: rewardWeeks[rewardWeeks.length - 1].key,
      };
      trackPageWithTraits(traits);
      setPageTracked(true); // Prevent Page function being called twice
    }
  }, [rewardWeeks, pageTracked, trackPageWithTraits]);

  return (
    <Styles.StyledRewardsPage className="default-container page-layout">
      {
        {
          Personal: <PersonalHeader />,
          Leaderboard: <LeaderboardHeader />,
        }[currentView]
      }
      <LeaderboardSwitch
        switchView={switchView}
        currentView={currentView}
        rewardsMessage={rewardsMessage}
        rewardWeeks={rewardWeeks}
        setSelectedWeek={setSelectedWeek}
      />
      <TraderRewards
        active={active}
        account={account}
        ensName={ensName}
        userData={userData}
        totalRewardAmountEth={totalRewardAmountEth}
        unclaimedRewardsEth={unclaimedRewardsEth}
        rewardsMessage={rewardsMessage}
        rewardWeeks={rewardWeeks}
        setSelectedWeek={setSelectedWeek}
        connectWallet={connectWallet}
        userWeekData={userWeekData}
        rewardAmountEth={rewardAmountEth}
        currentView={currentView}
      />
      <Leaderboard
        userWeekData={userWeekData}
        userAccount={account}
        ensName={ensName}
        weekData={weekData}
        currentView={currentView}
        selectedWeek={selectedWeek}
        connectWallet={connectWallet}
      />
      <Footer />
    </Styles.StyledRewardsPage>
  );
}