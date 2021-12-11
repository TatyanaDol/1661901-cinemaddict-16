import AbstractView from './abstract-view.js';

const TitleContent = {
  ALL: 'There are no movies in our database',
  WATCHLIST: 'There are no movies to watch now',
  HISTORY: 'There are no watched movies now',
  FAVORITES: 'There are no favorite movies now',
};

export const findActiveFilterName = (activeFilterElement) => {
  const spaceIndex = activeFilterElement.textContent.indexOf(' ');
  const activeFilterName = activeFilterElement.textContent.slice(0, spaceIndex);
  return activeFilterName;
};

const createEmptyFilmsListTitle = (activeFilterElement) => TitleContent[findActiveFilterName(activeFilterElement).toUpperCase()];

const createEmptyMovieListTemplate = (activeFilterElement) => (
  `<section class="films">
  <section class="films-list">
    <h2 class="films-list__title">${createEmptyFilmsListTitle(activeFilterElement)}</h2>

    
  </section>
</section>`
);

export default class EmptyMovieListView extends AbstractView {
  #activeFilterElement = null;

  constructor(activeFilterElement) {
    super();
    this.#activeFilterElement = activeFilterElement;
  }

  get template() {
    return createEmptyMovieListTemplate(this.#activeFilterElement);
  }
}
