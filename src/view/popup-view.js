import dayjs from 'dayjs';
import SmartView from './smart-view.js';

const createGenresTemplate = (genres) => {
  const isShort = Boolean(genres.length < 2);
  return `<tr class="film-details__row">
                <td class="film-details__term"> ${isShort ? 'Genre' : 'Genres'}</td>
                <td class="film-details__cell">
                ${genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('')}
                </td>
              </tr>`;
};

const createCommentsTemplate = (array, newCommentEmoji, newCommentText, emojiChecked) => `<section class="film-details__comments-wrap">
  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${array.length}</span></h3>

  <ul class="film-details__comments-list"> ${array.map((comment) => {
    const {text, emoji, autor, commentDate} = comment;
    return `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
  </span>
  <div>
    <p class="film-details__comment-text">${text}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${autor}</span>
      <span class="film-details__comment-day">${dayjs(commentDate).format('YYYY/MM/DD HH:mm')}</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
</li>
`;}
  ).join('')}
  </ul>

  <div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">
    ${newCommentEmoji ? `<img src="images/emoji/${newCommentEmoji}.png" width="55" height="55" alt="emoji-${newCommentEmoji}">` : ''}
    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${newCommentEmoji}" value="${newCommentEmoji}"></input> 
    </div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${newCommentText}</textarea>
    </label>

    <div class="film-details__emoji-list">

    ${Object.entries(emojiChecked).map(([emoji, isChecked]) => `
    
    <input class="film-details__emoji-item visually-hidden" name="comment-${emoji}" 
    type="radio" id="emoji-${emoji}" value="${emoji}" ${isChecked ? 'checked' : ''}>
      <label class="film-details__emoji-label" for="emoji-${emoji}">
        <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
      </label>`).join('')}

      
    </div>
  </div>
</section>`;

const createPopupTemplate = (data, comments) => {
  const {title,
    originalTitle,
    poster,
    age,
    description,
    releaseDate,
    rating,
    duration,
    genres,
    isWatched,
    isFavorite,
    isInWatchlist,
    director,
    writers,
    actors,
    country, newCommentEmoji, newCommentText, emojiChecked} = data;

  const watchlistClassName = isInWatchlist ? 'film-details__control-button--active' : '';
  const watchedClassName = isWatched ? 'film-details__control-button--active' : '';
  const favoriteClassName = isFavorite ? 'film-details__control-button--active' : '';

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">
  
            <p class="film-details__age">${age}+</p>
          </div>
  
          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">${originalTitle}</p>
              </div>
  
              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>
  
            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${dayjs(releaseDate).format('DD MMMM YYYY')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${duration}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              ${createGenresTemplate(genres)}
            </table>
  
            <p class="film-details__film-description">
               ${description}
            </p>
          </div>
        </div>
  
        <section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist ${watchlistClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button film-details__control-button--watched ${watchedClassName}" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite ${favoriteClassName}" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>
  
      <div class="film-details__bottom-container">
      ${createCommentsTemplate(comments, newCommentEmoji, newCommentText, emojiChecked)}
      </div>
    </form>
  </section>`;
};

export default class PopupView extends SmartView {
  #card = null;
  #comments = null;
  _scrollPosition = 0;
  #elementScroll;
  #newElementScroll;

  constructor(card, comments) {
    super();
    this.#card = card;
    this.#comments = comments;

    this._data = PopupView.parseMovieToData(card);
    this._commentsData = PopupView.parseMovieCommentsToData(comments);

    this.#setInnerHandlers();

  }

  get template() {
    return createPopupTemplate(this._data, this._commentsData);
  }

  restoreHandlers() {
    this.#setInnerHandlers();
    this.setCloseButtonClickHandler(this._callback.closeButtonClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setNewCommentsSubmit(this._callback.commentsSubmit);
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list')
      .addEventListener('click', this.#handleEmojiClick);

    this.element.querySelector('.film-details__comment-input')
      .addEventListener('keydown', this.#onEnterKeyDown);

    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#commentInputHandler);
  }

  static parseMovieToData = (card) => ({...card,
    newCommentEmoji: '',
    newCommentText: '',
    emojiChecked: {
      smile: false,
      puke: false,
      angry: false,
      sleeping: false,
    }
  });

  static parseMovieCommentsToData = (comments) => ([...comments
  ]);

  static parseDataToMovie = (data) => {
    const card = {...data};

    delete card.newCommentEmoji;
    delete card.newCommentText;
    delete card.emojiChecked;

    return card;
  }

  static parseDataToMovieComments = (commentsData, data) => {
    const comments = [...commentsData, {text: data.newCommentText, emoji: data.newCommentEmoji, autor: 'unknown', commentDate: new Date()}];

    return comments;
  }


  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      newCommentText: evt.target.value,
    }, true);
  }

  #handleEmojiClick = (evt) => {
    if (evt.target.value) {

      this.saveScrollPosition();
      this.updateData({ newCommentEmoji: evt.target.value, emojiChecked: {smile: false,
        puke: false,
        angry: false,
        sleeping: false, [evt.target.value]: evt.target.checked} });
      this.setScrollPosition();
    }
  }

  setNewCommentsSubmit = (callback) => {
    this._callback.commentsSubmit = callback;
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('keydown', this.#onEnterKeyDown);
  }

  #onEnterKeyDown = (evt) => {
    if(evt.keyCode === 13) {
      evt.preventDefault();
      this.saveScrollPosition();
      this._callback.commentsSubmit(PopupView.parseDataToMovie(this._data), PopupView.parseDataToMovieComments(this._commentsData, this._data));
      this.setScrollPosition();

    }
  }

  saveScrollPosition = () => {
    this.#elementScroll = document.querySelector('.film-details');
    this._scrollPosition = this.#elementScroll.scrollTop;
  }

  setScrollPosition = () => {
    this.#newElementScroll = document.querySelector('.film-details');
    this.#newElementScroll.scrollTop = this._scrollPosition;
  }

  setCloseButtonClickHandler = (callback) => {
    this._callback.closeButtonClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeButtonClickHandler);
  }

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeButtonClick();
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  }

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  }

}
