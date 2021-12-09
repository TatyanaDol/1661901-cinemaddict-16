import {createElement} from '../render.js';

const createShowButtonTemplate = () => (
  `<button class="films-list__show-more">
  Show more
</button>`
);

export default class ShowMoreButtonView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createShowButtonTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
