import AbstractObservable from '../utils/abstract-observable.js';

export default class MoviesModel extends AbstractObservable {

    #movieCards = [];

    set movieCards(cards) {
      this.#movieCards = [...cards];
    }

    get movieCards() {
      return this.#movieCards;
    }

    updateMovieCard = (updateType, update, isPopupOpened) => {
      const index = this.#movieCards.findIndex((card) => card.id === update.id);

      if (index === -1) {
        throw new Error('Can\'t update unexisting movie card');
      }

      this.#movieCards = [
        ...this.#movieCards.slice(0, index),
        update,
        ...this.#movieCards.slice(index + 1),
      ];

      this._notify(updateType, update, isPopupOpened);
    }

}
