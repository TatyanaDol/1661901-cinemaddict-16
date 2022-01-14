import AbstractView from './abstract-view.js';
import {FilterType} from '../model/filter-model.js';

const TitleContent = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createEmptyMovieListTemplate = (activeFilter) => {
  const emptyMovieListTitleText = TitleContent[activeFilter];

  return `<section class="films">
  <section class="films-list">
    <h2 class="films-list__title">${emptyMovieListTitleText}</h2>

    
  </section>
</section>`;
};

export default class EmptyMovieListView extends AbstractView {
  #activeFilter = null;

  constructor(activeFilter) {
    super();
    this.#activeFilter = activeFilter;
  }

  get template() {
    return createEmptyMovieListTemplate(this.#activeFilter);
  }
}
