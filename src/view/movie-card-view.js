import dayjs from 'dayjs';

const SHORT_DESCRIPTION_NUMBER_OF_SYMBOLS = 140;

const createShortDescription = (description) => {
  const isShort = Boolean(description.length <= SHORT_DESCRIPTION_NUMBER_OF_SYMBOLS);
  return `<p class="film-card__description">${isShort ? description : `${description.slice(0, 139)  }...`}</p>`;
};

export const createMovieCardTemplate = (card) => {
  const {title, poster, description, releaseDate, rating, duration, genres, comments, isWatched, isFavorite, isInWatchlist} = card;

  const watchlistClassName = isInWatchlist ? 'film-card__controls-item--active' : '';
  const watchedClassName = isWatched ? 'film-card__controls-item--active' : '';
  const favoriteClassName = isFavorite ? 'film-card__controls-item--active' : '';
  const isComments = comments ? `${comments  } comments` : '';

  return `<article class="film-card">
<a class="film-card__link">
  <h3 class="film-card__title">${title}</h3>
  <p class="film-card__rating">${rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${dayjs(releaseDate).format('YYYY')}</span>
    <span class="film-card__duration">${duration}</span>
    <span class="film-card__genre">${genres[0]}</span>
  </p>
  <img src="./images/posters/${poster}" alt="" class="film-card__poster">
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
