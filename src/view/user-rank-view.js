import {findFilter} from '../utils/utils.js';
import AbstractView from './abstract-view.js';
import {FilterType} from '../model/filter-model.js';


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
  const historyFilterCount = findFilter(FilterType.HISTORY, filters).count;
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

export default class UserRankView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createUserRankTemplate(this.#filters);
  }
}
