import { gql } from '@apollo/client';

export const ALL_POOL_ORDERS = gql`
  query AllPoolOrders {
    allPoolOrders(condition: { status: OPEN }) {
      totalCount
      nodes {
        nodeId
        id
        orderId
        orderType
        status
        filledQuoteAmount
        quoteAsset
        quoteAmount
        quoteCollectedFees
        quoteCollectedFeesUsd
        baseAsset
        filledBaseAmount
        baseAmount
        baseCollectedFees
        baseCollectedFeesUsd
        orderCreatedEventId
        orderLastUpdatedEventId
        lowerTick
        upperTick
        liquidityProviderId
      }
    }
  }
`;
