import {gql} from '@apollo/client/core';

export const statisticDetails = gql`
    fragment StatisticDetails on Statistic {
        id
        date
        anonymousPageCount
        defaultPageCount
        aaiPageCount
        anonymousDetailCount
        defaultDetailCount
        aaiDetailCount
        anonymousSearchCount
        defaultSearchCount
        aaiSearchCount
        defaultLoginCount
        aaiLoginCount
        defaultUniqueLoginCount
        aaiUniqueLoginCount
    }
`;

export const statisticsQuery = gql`
    query StatisticsQuery($filter: StatisticFilter, $pagination: PaginationInput, $sorting: [StatisticSorting!]) {
        statistics(filter: $filter, pagination: $pagination, sorting: $sorting) {
            items {
                ...StatisticDetails
            }
            pageSize
            pageIndex
            length
        }
    }
    ${statisticDetails}
`;

export const statisticQuery = gql`
    query StatisticQuery($id: StatisticID!) {
        statistic(id: $id) {
            ...StatisticDetails
        }
    }
    ${statisticDetails}
`;

export const recordPage = gql`
    mutation RecordPage {
        recordPage
    }
`;

export const recordDetail = gql`
    mutation RecordDetail {
        recordDetail
    }
`;

export const recordSearch = gql`
    mutation RecordSearch {
        recordSearch
    }
`;

export const extraStatisticsQuery = gql`
    query ExtraStatisticsQuery($period: String!, $user: UserID) {
        extraStatistics(period: $period, user: $user)
    }
`;
