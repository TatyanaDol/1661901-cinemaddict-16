import MenuStatisticFilterView from '../view/menu-statistic-and-filter-view.js';
import {SetPosition, render, remove, replace} from '../utils/render.js';
import {FilterType} from '../model/filter-model.js';
import {filter} from '../utils/filter.js';
import {UpdateType} from './movie-card-presenter.js';
import UserRankView from '../view/user-rank-view.js';

export default class FilterPresenter {
    #mainContainer = null;
    #headerContainer = null

    #filterModel = null;
    #moviesModel = null;

    #filterComponent = null;
    #rankComponent = null;

    #handleFiltersAndStatisticClick = null;
    #isStatisticActive = null;

    constructor(mainComtainer, filterModel, moviesModel, headerContainer, handleFiltersAndStatisticClick) {

      this.#mainContainer = mainComtainer;
      this.#filterModel = filterModel;
      this.#moviesModel = moviesModel;
      this.#headerContainer = headerContainer;
      this.#handleFiltersAndStatisticClick = handleFiltersAndStatisticClick;

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

      this.#filterComponent = new MenuStatisticFilterView(filters, this.#filterModel.moviesFilter, this.#isStatisticActive);
      this.#filterComponent.setMoviesFilterTypeClickHandler(this.#handleMovieFilterTypeChange, this.#handleFiltersAndStatisticClick);

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
      if (this.#filterModel.moviesFilter === filterType && !this.#isStatisticActive) {
        return;
      }
      if (filterType ===  FilterType.STATISTICS) {
        this.#isStatisticActive = true;
        this.#filterModel.setMoviesFilter(UpdateType.STATISTICS);
        return;
      }
      this.#isStatisticActive = false;
      this.#filterModel.setMoviesFilter(UpdateType.MAJOR, filterType);
    }

}
