import React, { useEffect } from "react";
import * as Styled from "./EventModal.styles";
import ethMergeHeader from "../../img/event-modal-header.png";
import ethMergeHeadermesh from "../../img/event-modal-header-mesh.png";
import twitterIcon from "../../img/twitter-icon.svg";
import { Link } from "react-router-dom";
import { shareToTwitter } from "../../utils/common";

const EVENTS = {
  "new-earn-page": {
    title: (
      <>
        <small>Earn Page Update</small>
        {/* Optional large heading */}
        {/* <h2>Fee-Free Spree</h2> */}
      </>
    ),
    description: (
      <span>
        Users can now auto deposit esARBX into the vesting contract and claim Market Making Rewards via selling a
        portion of their ARBXLP position
      </span>
    ),
    continueLink: "/earn",
  },
  "add-limit-orders": {
    title: (
      <>
        <small>Limit Orders Enabled</small>
        {/* Optional large heading */}
        {/* <h2>Fee-Free Spree</h2> */}
      </>
    ),
    description: <span>Arbitrex now supports limit orders for opening and closing leveraged positions!</span>,
  },
  "disable-limit-orders": {
    title: (
      <>
        <h2>Limit Orders Disabled</h2>
      </>
    ),
    description: (
      <span>
        Limit orders are currently disabled. Limits will be live again soon. Your previously set limit orders will need
        to be updated.
      </span>
    ),
  },
};

export default function EventModal({
  isModalVisible,
  setEventModalVisible,
  twitterButtonText,
  twitterText,
  eventKey,
  hideHeader,
}) {
  const event = EVENTS[eventKey];

  useEffect(() => {
    const hasSeenEventModal = window.localStorage.getItem(eventKey);
    if (!hasSeenEventModal) {
      setEventModalVisible(true);
      window.localStorage.setItem(eventKey, "true");
    }
  }, [eventKey, setEventModalVisible]);

  const onClose = () => {
    setEventModalVisible(false);
  };

  return (
    <Styled.EventModal isVisible={isModalVisible} setIsVisible={setEventModalVisible} hideHeader={hideHeader}>
      {!hideHeader && <Styled.EventModalHeader></Styled.EventModalHeader>}
      <Styled.EventModalContent></Styled.EventModalContent>
    </Styled.EventModal>
  );
}
