import { gql } from '@apollo/client';

export const ALL_POOL_ORDERS = gql`
query AllPoolOrders {
    allPoolOrders(
        condition: { orderType: RANGE }
        orderBy: ORDER_CREATED_EVENT_ID_DESC
    ) {
        totalCount
        nodes {
            orderType
            status
            quoteAsset
            quoteAmount
            quoteCollectedFees
            quoteCollectedFeesUsd
            baseAsset
            baseAmount
            baseCollectedFees
            baseCollectedFeesUsd
            lowerTick
            upperTick
            liquidityProviderId
            eventByOrderCreatedEventId {
                timestamp
            }
            eventByOrderLastUpdatedEventId {
                timestamp
            }
        }
    }
}

`;

export const ALL_ACCOUNTS = gql`
  query AllAccounts {
    allAccounts {
      totalCount
      nodes {
        idSs58
        id
      }
    }
  }
`;
