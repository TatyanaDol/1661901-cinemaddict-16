import {findFilter} from '../utils.js';


export const createMenuStatisticAndFilterTemplate = (filters) => {

  const history = findFilter('history', filters).count;
  const watchlist = findFilter('watchlist', filters).count;
  const favorites = findFilter('favorites', filters).count;

  return `<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item">All movies</a>
    <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlist}</span></a>
    <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${history}</span></a>
    <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorites}</span></a>
  </div>
  <a href="#stats" class="main-navigation__additional main-navigation__additional--active">Stats</a>
</nav>`;
};
