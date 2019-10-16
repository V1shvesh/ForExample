import { gql } from 'apollo-boost';

export const QUERY_CURRENCIES = gql`
{
currencies(order_by: {label: desc}) {
    label
    value
  }
}
`;

export const SUBSCRIPTION_CURRENCIES = gql`
subscription TrackValues {
  currencies(order_by: {label: desc}, where: {label: {_neq: "USD"}}) {
    label
    value
  }
}
`;
