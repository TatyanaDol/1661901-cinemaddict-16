import AbstractView from './abstract-view.js';

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const createSortTemplate = () => (
  `<ul class="sort">
<li><a href="#" class="sort__button sort__button--active" data-sort-type:"${SortType.DEFAULT}">Sort by default</a></li>
<li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
<li><a href="#" class="sort__button" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
</ul>`
);

export default class SortView extends AbstractView {
  get template() {
    return createSortTemplate();
  }

  setMovieSortChangeHandler = (callback) => {
    this._callback.sortChange = callback;
    this.element.addEventListener('click', this.#sortChangeHandler);
  }

  #sortChangeHandler = (evt) => {

    if(evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this.#handleActiveClassChange(evt);
    this._callback.sortChange(evt.target.dataset.sortType);
  }

  #handleActiveClassChange = (evt) => {
    const allSortButtons = document.querySelectorAll('.sort__button');
    allSortButtons.forEach((element) => {
      element.classList.remove('sort__button--active');
    });
    evt.target.classList.add('sort__button--active');
  }
}
