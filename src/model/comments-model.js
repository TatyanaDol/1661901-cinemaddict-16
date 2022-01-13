import AbstractObservable from '../utils/abstract-observable.js';

export default class CommentsModel extends AbstractObservable {

    #movieComments = [];

    set movieComments(comments) {
      this.#movieComments = [...comments];
    }

    get movieComments() {
      return this.#movieComments;
    }

    addMovieComment = (updateType, update, card) => {
      this.#movieComments = [...update
      ];
      this._notify(updateType, card);
    }

    deleteMovieComment = (updateType, update, card) => {
      const index = this.#movieComments.findIndex((comment) => comment.id === update.id);

      if (index === -1) {
        throw new Error('Can\'t delete unexisting comment');
      }

      this.#movieComments = [
        ...this.#movieComments.slice(0, index),
        ...this.#movieComments.slice(index + 1),
      ];

      this._notify(updateType, card);
    }

}
