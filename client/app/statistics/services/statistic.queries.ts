import gql from 'graphql-tag';
import { userMetaFragment } from '../../shared/queries/fragments';

export const statisticDetails = gql`
    fragment statisticDetails on Statistic {
        id
        date
        anonymousPageCount
        defaultPageCount
        unilPageCount
        anonymousDetailCount
        defaultDetailCount
        unilDetailCount
        anonymousSearchCount
        defaultSearchCount
        unilSearchCount
        defaultLoginCount
        unilLoginCount
        defaultUniqueLoginCount
        unilUniqueLoginCount
    }`;

export const statisticsQuery = gql`
    query Statistics($filter: StatisticFilter, $pagination: PaginationInput, $sorting: [StatisticSorting!]) {
        statistics(filter: $filter, pagination: $pagination, sorting: $sorting) {
            items {
                ...statisticDetails
            }
            pageSize
            pageIndex
            length
        }
    }
${statisticDetails}`;

export const statisticQuery = gql`
    query Statistic($id: StatisticID!) {
        statistic(id: $id) {
            ...statisticDetails
        }
    }
${statisticDetails}`;

export const recordPage = gql`
    mutation RecordPage {
        recordPage
    }`;

export const recordDetail = gql`
    mutation RecordDetail {
        recordDetail
    }`;

export const recordSearch = gql`
    mutation RecordSearch {
        recordSearch
    }`;

export const extraStatisticsQuery = gql`
    query ExtraStatistics($period: String!, $user: UserID) {
        extraStatistics(period: $period, user: $user)
    }
`;