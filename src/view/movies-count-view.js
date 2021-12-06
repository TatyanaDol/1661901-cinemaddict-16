import {createElement} from '../render.js';

const createMovieCountTemplate = (cards) => {
  const movieCount = cards.length;
  return `<p>
${movieCount} movies inside
</p>`;
};

export default class MovieCountView {
  #element = null;
  #card = null;

  constructor(card) {
    this.#card = card;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createMovieCountTemplate(this.#card);
  }

  removeElement() {
    this.#element = null;
  }
}
