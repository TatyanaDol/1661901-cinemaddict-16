import AbstractView from './abstract-view.js';

const createShowButtonTemplate = () => (
  `<button class="films-list__show-more">
  Show more
</button>`
);

export default class ShowMoreButtonView extends AbstractView {
  get template() {
    return createShowButtonTemplate();
  }

  setShowMoreButtonClickHandler = (callback) => {
    this._callback.showButtonClick = callback;
    this.element.addEventListener('click', this.#showMoreButtonClickHandler);
  }

  #showMoreButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.showButtonClick();
  }
}
