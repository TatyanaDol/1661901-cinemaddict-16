import MenuStatisticFilterView from '../view/menu-statistic-and-filter-view.js';
import {SetPosition, render, remove, replace} from '../utils/render.js';
import {FilterType} from '../model/filter-model.js';
import {filter} from '../utils/filter.js';
import {UpdateType} from '../presenter/MovieCardPresenter.js';
import UserRankView from '../view/user-rank-view.js';

export default class FilterPresenter {
    #mainContainer = null;
    #headerContainer = null

    #filterModel = null;
    #moviesModel = null;

    #filterComponent = null;
    #rankComponent = null;

    constructor(mainComtainer, filterModel, moviesModel, headerContainer) {

      this.#mainContainer = mainComtainer;
      this.#filterModel = filterModel;
      this.#moviesModel = moviesModel;
      this.#headerContainer = headerContainer;

      this.#moviesModel.addObserver(this.#handleModelEvent);
      this.#filterModel.addObserver(this.#handleModelEvent);

    }

    get filters() {
      const movieCards = this.#moviesModel.movieCards;

      return [
        {
          type: FilterType.ALL,
          name: 'All movies',
          count: filter[FilterType.ALL](movieCards).length,
        },
        {
          type: FilterType.WATCHLIST,
          name: 'Watchlist',
          count: filter[FilterType.WATCHLIST](movieCards).length,
        },
        {
          type: FilterType.HISTORY,
          name: 'History',
          count: filter[FilterType.HISTORY](movieCards).length,
        },
        {
          type: FilterType.FAVORITES,
          name: 'Favorites',
          count: filter[FilterType.FAVORITES](movieCards).length,
        },
      ];

    }

    init = () => {
      const filters = this.filters;
      const prevFilterComponent = this.#filterComponent;
      const prevRankComponent = this.#rankComponent;

      this.#rankComponent = new UserRankView(filters);
      if(prevRankComponent === null) {
        render(this.#headerContainer, this.#rankComponent, SetPosition.BEFOREEND);
      } else {
        replace(this.#rankComponent, prevRankComponent);
        remove(prevRankComponent);
      }

      this.#filterComponent = new MenuStatisticFilterView(filters, this.#filterModel.moviesFilter);
      this.#filterComponent.setMoviesFilterTypeClickHandler(this.#handleMovieFilterTypeChange);

      if (prevFilterComponent === null) {
        render(this.#mainContainer, this.#filterComponent, SetPosition.BEFOREEND);
        return;
      }

      replace(this.#filterComponent, prevFilterComponent);
      remove(prevFilterComponent);

    }

    #handleModelEvent = () => {
      this.init();
    }

    #handleMovieFilterTypeChange = (filterType) => {
      if (this.#filterModel.moviesFilter === filterType) {
        return;
      }

      this.#filterModel.setMoviesFilter(UpdateType.MAJOR, filterType);
    }

}
