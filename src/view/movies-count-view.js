import AbstractView from './abstract-view.js';

const createMovieCountTemplate = (cards) => {
  const movieCount = cards.length;
  return `<p>
${movieCount} movies inside
</p>`;
};

export default class MovieCountView extends AbstractView {
  #card = null;

  constructor(card) {
    super();
    this.#card = card;
  }

  get template() {
    return createMovieCountTemplate(this.#card);
  }
}
