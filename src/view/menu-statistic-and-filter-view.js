import {findFilter} from '../utils.js';
import {createElement} from '../render.js';

const createMenuStatisticAndFilterTemplate = (filters) => {

  const history = findFilter('history', filters).count;
  const watchlist = findFilter('watchlist', filters).count;
  const favorites = findFilter('favorites', filters).count;

  return `<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    <a href="#watchlist" class="main-navigation__item ">Watchlist <span class="main-navigation__item-count">${watchlist}</span></a>
    <a href="#history" class="main-navigation__item ">History <span class="main-navigation__item-count">${history}</span></a>
    <a href="#favorites" class="main-navigation__item ">Favorites <span class="main-navigation__item-count">${favorites}</span></a>
  </div>
  <a href="#stats" class="main-navigation__additional main-navigation__additional--active">Stats</a>
</nav>`;
};

export default class MenuStatisticFilterView {
  #element = null;
  #filters = null;

  constructor(filters) {
    this.#filters = filters;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createMenuStatisticAndFilterTemplate(this.#filters);
  }

  removeElement() {
    this.#element = null;
  }
}
