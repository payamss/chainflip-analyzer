import { gql } from '@apollo/client';

export const ALL_POOL_ORDERS = gql`
query AllPoolOrders {
    allPoolOrders(
        condition: { status: OPEN, orderType: RANGE }
        orderBy: ORDER_CREATED_EVENT_ID_DESC
    ) {
        totalCount
        nodes {
            nodeId
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
            eventByOrderCreatedEventId {
                blockByBlockId {
                    timestamp
                }
            }
        }
    }
}
`;
