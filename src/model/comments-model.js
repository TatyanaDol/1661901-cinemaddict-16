import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../presenter/MovieCardPresenter.js';

export default class CommentsModel extends AbstractObservable {

    #movieComments = [];
    #apiService = null;
    #card = null;

    constructor(apiService) {
      super();
      this.#apiService = apiService;
    }

    init = async (card, cardId) => {
      this.#card = card;
      try {
        const comments = await this.#apiService.getMovieComments(cardId);
        this.#movieComments = comments.map(this.#adaptCommentDataToClient);

      } catch(err) {
        this.#movieComments = [];
      }
      this._notify(UpdateType.COMMENTS, card);

    }

    #adaptCommentDataToClient = (comment) => {
      const adaptedComment = {...comment,
        emoji: comment.emotion,
        text: comment.comment,
        commentDate: new Date(comment.date),
      };

      delete adaptedComment.emotion;
      delete adaptedComment.comment;
      delete adaptedComment.date;

      return adaptedComment;
    }

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
