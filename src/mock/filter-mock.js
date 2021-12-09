
const cardsToFilter = {
  all: (cards) => cards.length,
  watchlist: (cards) => cards.filter((card) => card.isInWatchlist).length,
  history: (cards) => cards.filter((card) => card.isWatched).length,
  favorites: (cards) => cards.filter((card) => card.isFavorite).length,
};

export const generateFilter = (cards) => Object.entries(cardsToFilter).map(
  ([filterName, countCards]) => (
    {
      name: filterName,
      count: countCards(cards),
    })
);
