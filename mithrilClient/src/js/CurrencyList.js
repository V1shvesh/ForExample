import m from 'mithril';

import client from './client';
import { QUERY_CURRENCIES, SUBSCRIPTION_CURRENCIES } from './gqlConstants';
import Currency from './Currency';

let list = [];

export default {
  oninit() {
    // return client
    //   .query({
    //     query: QUERY_CURRENCIES,
    //   })
    //   .then(({ data: { currencies } }) => {
    //     list = currencies;
    //   })
    //   .then(() => m.redraw());
    return client
      .subscribe({
        // fetchPolicy: 'network-only',
        query: SUBSCRIPTION_CURRENCIES,
      })
      .subscribe({
        next({ data: { currencies } }) {
          list = currencies;
          m.redraw();
        },
      });
  },
  view() {
    // console.log(list);
    return m('.currency-list', list.map(({ label, value }) => m(Currency, { label, value })));
  },
};
