import {createElement} from '../utils/render.js';

const SHAKE_ANIMATION_TIMEOUT = 600;

export default class AbstractView {
  #element = null;
  _callback = {};

  constructor() {
    if (new.target === AbstractView) {
      throw new Error('Can\'t instantiate AbstractView, only concrete one.');
    }
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    throw new Error('Abstract method not implemented: get template');
  }

  removeElement() {
    this.#element = null;
  }

  shake(callback, commentId) {
    if(commentId) {
      let deleteButton = null;
      const comments = this.element.querySelectorAll('.film-details__comment-delete');
      comments.forEach((element) => {
        if(element.id === commentId) {
          deleteButton = element;
        }
      });
      const comment = deleteButton.parentElement.parentElement.parentElement;
      comment.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
      setTimeout(() => {
        comment.style.animation = '';
        callback();
      }, SHAKE_ANIMATION_TIMEOUT);
      return;
    }
    this.element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.element.style.animation = '';
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
