import AbstractObservable from '../utils/abstract-observable.js';

export const FilterType = {
  ALL: 'All movies',
  WATCHLIST: 'Watchlist',
  FAVORITES: 'Favorites',
  HISTORY: 'History',
};

export default class FilterModel extends AbstractObservable {
#filter = FilterType.ALL;

get moviesFilter() {
  return this.#filter;
}

setMoviesFilter = (updateType, filter) => {
  this.#filter = filter;
  this._notify(updateType, filter);
}

}
