import {findFilter} from '../utils.js';
import {createElement} from '../render.js';

const Rating = {
  NO_RANK: 0,
  NOVICE: {
    from: 1,
    to: 10,
  },
  FAN: {
    from: 11,
    to: 20,
  },
  MOVIE_BUFF: {
    from: 21,
    to: Infinity,
  },
};


const createUserRankTemplate = (filters) => {
  const historyFilterCount = findFilter('history', filters).count;
  let profileRating = '';

  if (historyFilterCount >= Rating.NOVICE.from && historyFilterCount <= Rating.NOVICE.to) {
    profileRating = 'Novice';
  }
  else if (historyFilterCount >= Rating.FAN.from && historyFilterCount <= Rating.FAN.to) {
    profileRating = 'Fan';
  }
  else if (historyFilterCount >= Rating.MOVIE_BUFF.from) {
    profileRating = 'Movie buff';
  }

  return `<section class="header__profile profile">
    <p class="profile__rating">${profileRating}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserRankView {
  #element = null;
  #filters = null;

  constructor(filters) {
    this.#filters = filters;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createUserRankTemplate(this.#filters);
  }

  removeElement() {
    this.#element = null;
  }
}
