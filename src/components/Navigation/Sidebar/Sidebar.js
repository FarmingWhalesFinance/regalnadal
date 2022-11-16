import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  MenuContainer,
  SideMenu,
  Logo,
  NavMenu,
  MenuItem,
  BottomMenuItem,
  PullTab,
  SocialLinksMenu,
  CopyrightYear,
  LegalMenu,
  FixedContainer,
  EventBox,
  EventHeader,
  EventContent,
  EventGraphic,
  ViewNowButton,
  EventDescription,
  EventTitle,
} from "./Sidebar.styles";

import { ReactComponent as TradeIcon } from "../../../img/nav/trade.svg";
import { ReactComponent as DashboardIcon } from "../../../img/nav/dashboard.svg";
import { ReactComponent as EarnIcon } from "../../../img/nav/earn.svg";
import { ReactComponent as BuyIcon } from "../../../img/nav/buy.svg";
import { ReactComponent as RewardsIcon } from "../../../img/nav/rewards.svg";
import { ReactComponent as ReferralsIcon } from "../../../img/nav/referrals.svg";
import { ReactComponent as MycStakingIcon } from "../../../img/nav/myc-staking.svg";
// import { ReactComponent as LeaderboardIcon } from "../../../img/nav/trading-leaderboard.svg";
import { ReactComponent as AnalyticsIcon } from "../../../img/nav/analytics.svg";
import { ReactComponent as DocsIcon } from "../../../img/nav/docs.svg";
import { ReactComponent as Medium } from "../../../img/nav/medium.svg";
import { ReactComponent as TwitterIcon } from "../../../img/nav/twitter.svg";
import { ReactComponent as DiscordIcon } from "../../../img/nav/discord.svg";
import { ReactComponent as PullTabSvg } from "../../../img/nav/pull-tab.svg";
// import { ReactComponent as TranslateIcon } from "../../../img/nav/translate.svg";
import graphic from "../../../img/nav/event-graphic.png";

import logoImg from "../../../img/logo_MYC.svg";

const navTopLinks = [
  /*{
    name: "Home",
    path: "https://www.amazon.es/?tag=admarketpl0c0-21&ref=pd_sl_2e30e27a83104081387822caeb2b70fe7f8264b8f9fa8287dff6b2bf&mfadid=adm",
    icon: DashboardIcon,
  },*/
  {
    name: "Trade",
    path: "/",
    icon: TradeIcon,
  },

  {
    name: "Earn",
    path: "/earn",
    icon: EarnIcon,
  },
  {
    name: "Buy",
    path: "/buy_mlp",
    icon: BuyIcon,
  },
  {
    name: "Rewards",
    path: "/rewards",
    icon: RewardsIcon,
  },
  {
    name: "Referrals",
    path: "/referrals",
    icon: ReferralsIcon,
  },
];

const socialLinks = [
  {
    name: "Twitter",
    path: "https://twitter.com/arbitrex_io",
    icon: TwitterIcon,
  },
  {
    name: "Medium",
    path: "https://arbitrex.gitbook.io/arbitrex/arbitrex/about-arbitrex",
    icon: Medium,
  },
  {
    name: "Discord",
    path: "https://discord.gg/XAYdmhEhxq",
    icon: DiscordIcon,
  },
];

export default function Sidebar({ sidebarVisible, setSidebarVisible }) {
  const yearRef = useRef(null);

  const setYear = () => {
    const year = new Date().getFullYear();
    yearRef.current.innerHTML = `&copy; ${year} Arbitrex`;
  };

  useEffect(() => {
    setYear();
  }, []);

  return (
    <FixedContainer>
      <PullTab visible={sidebarVisible} onClick={() => setSidebarVisible(!sidebarVisible)}>
        <PullTabSvg />
      </PullTab>
      <SideMenu visible={sidebarVisible}>
        <Logo visible={sidebarVisible}>
          <NavLink exact className="App-header-link-main" to="/">
            <img src={logoImg} alt="Perpetual Swaps Logo" />
          </NavLink>
        </Logo>
        <MenuContainer>
          <NavMenu>
            {navTopLinks.map((item) => (
              <MenuItem key={item.name}>
                <NavLink activeClassName="active" exact className="App-header-link-main" to={item.path}>
                  <item.icon /> <span>{item.name}</span>
                </NavLink>
              </MenuItem>
            ))}
          </NavMenu>
          <div>
            <NavMenu noPadding></NavMenu>

            <BottomMenuItem>
              <a
                href="https://arbitrex.gitbook.io/arbitrex/arbitrex/about-arbitrex"
                target="_blank"
                rel="noopener noreferrer"
              >
                <DocsIcon /> Docs
              </a>
            </BottomMenuItem>
            <SocialLinksMenu>
              {socialLinks.map((item) => (
                <a href={item.path} target="_blank" rel="noopener noreferrer">
                  <item.icon title={item.name} />
                </a>
              ))}
            </SocialLinksMenu>

            <CopyrightYear ref={yearRef} />
          </div>
        </MenuContainer>
      </SideMenu>
    </FixedContainer>
  );
}
