import {findFilter} from '../utils/utils.js';
import AbstractView from './abstract-view.js';
import {FilterType} from '../model/filter-model.js';

const createMenuStatisticAndFilterTemplate = (filters, currentFilterType, isStatistic ) => {

  const history = findFilter(FilterType.HISTORY, filters);
  const watchlist = findFilter(FilterType.WATCHLIST, filters);
  const favorites = findFilter(FilterType.FAVORITES, filters);

  return `<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item ${currentFilterType === FilterType.ALL && !isStatistic ? 'main-navigation__item--active' : ''}" data-filter-type="${FilterType.ALL}">All movies</a>
    <a href="#watchlist" class="main-navigation__item ${currentFilterType === FilterType.WATCHLIST && !isStatistic ? 'main-navigation__item--active' : ''}" data-filter-type="${FilterType.WATCHLIST}">Watchlist <span class="main-navigation__item-count">${watchlist.count}</span></a>
    <a href="#history" class="main-navigation__item ${currentFilterType === FilterType.HISTORY && !isStatistic ? 'main-navigation__item--active' : ''}" data-filter-type="${FilterType.HISTORY}">History <span class="main-navigation__item-count">${history.count}</span></a>
    <a href="#favorites" class="main-navigation__item ${currentFilterType === FilterType.FAVORITES && !isStatistic ? 'main-navigation__item--active' : ''}" data-filter-type="${FilterType.FAVORITES}">Favorites <span class="main-navigation__item-count">${favorites.count}</span></a>
  </div>
  <a href="#stats" class="main-navigation__additional ${isStatistic ? 'main-navigation__additional--active' : ''}" data-filter-type="${FilterType.STATISTICS}">Stats</a>
</nav>`;
};

export default class MenuStatisticFilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #isStatistic = null;

  constructor(filters, currentFilterType, isStatistic) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#isStatistic = isStatistic;
  }

  get template() {
    return createMenuStatisticAndFilterTemplate(this.#filters, this.#currentFilter, this.#isStatistic);
  }

  setMoviesFilterTypeClickHandler = (callback, secondCallback) => {
    this._callback.moviesFilterTypeChange = callback;
    this._callback.StatOrFilmsMenuChange = secondCallback;
    this.element.addEventListener('click', this.#moviesFilterTypeClickHandler);
  }

  #moviesFilterTypeClickHandler = (evt) => {
    if(evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this._callback.moviesFilterTypeChange(evt.target.dataset.filterType);
    this._callback.StatOrFilmsMenuChange(evt.target.dataset.filterType);
  }

}
