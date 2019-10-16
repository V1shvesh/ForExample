import m from 'mithril';

export default {
  view({ attrs: { label, value } }) {
    return m(
      '.currency',
      m('.currency__label', label),
      m('.currency__value', `$${value.toFixed(4)}`),
    );
  },
};
