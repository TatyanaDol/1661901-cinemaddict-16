import dayjs from 'dayjs';
import AbstractView from './abstract-view.js';
import {createMovieDuration} from '../utils/utils.js';

const SHORT_DESCRIPTION_NUMBER_OF_SYMBOLS = 140;

const createShortDescription = (description) => {
  const isShort = Boolean(description.length <= SHORT_DESCRIPTION_NUMBER_OF_SYMBOLS);
  return `<p class="film-card__description">${isShort ? description : `${description.slice(0, 139)  }...`}</p>`;
};

const createMovieCardTemplate = (card) => {
  const {title, poster, description, releaseDate, rating, duration, genres, comments, isWatched, isFavorite, isInWatchlist} = card;

  const watchlistClassName = isInWatchlist ? 'film-card__controls-item--active' : '';
  const watchedClassName = isWatched ? 'film-card__controls-item--active' : '';
  const favoriteClassName = isFavorite ? 'film-card__controls-item--active' : '';
  const isComments = comments ? `${comments.length  } comments` : '';

  return `<article class="film-card">
<a class="film-card__link">
  <h3 class="film-card__title">${title}</h3>
  <p class="film-card__rating">${rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${dayjs(releaseDate).format('YYYY')}</span>
    <span class="film-card__duration">${createMovieDuration(duration)}</span>
    <span class="film-card__genre">${genres[0]}</span>
  </p>
  <img src="${poster}" alt="" class="film-card__poster">
  ${createShortDescription(description)}
  <span class="film-card__comments">${isComments}</span>
</a>
<div class="film-card__controls">
  <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlistClassName}" type="button">Add to watchlist</button>
  <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
  <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
</div>
</article>`;
};

export default class MovieCardView extends AbstractView {
  #card = null;

  constructor(card) {
    super();
    this.#card = card;
  }

  get template() {
    return createMovieCardTemplate(this.#card);
  }

  setCardClickHandler = (callback) => {
    this._callback.cardClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#cardClickHandler);
  }

  #cardClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.cardClick();
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  setWatchedClickHandler = (callback) => {
    this._callback.WatchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  }

  setWatchlistClickHandler = (callback) => {
    this._callback.WatchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.WatchlistClick();
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.WatchedClick();
  }

}
