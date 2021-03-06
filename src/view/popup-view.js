import dayjs from 'dayjs';
import SmartView from './smart-view.js';
import {nanoid} from 'nanoid';
import he from 'he';
import {createMovieDuration} from '../utils/utils.js';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const COMMENT_AUTHOR = 'Emma Li';

const createGenresTemplate = (genres) => {
  const isShort = Boolean(genres.length < 2);
  return `<tr class="film-details__row">
                <td class="film-details__term"> ${isShort ? 'Genre' : 'Genres'}</td>
                <td class="film-details__cell">
                ${genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('')}
                </td>
              </tr>`;
};

const createCommentsTemplate = (array, newCommentEmoji, newCommentText, emojiChecked, isSaving, isDeleting, idOfDeletedCommment) => `<section class="film-details__comments-wrap">
  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${array.length}</span></h3>

  <ul class="film-details__comments-list"> ${array.map((comment) => {
    const {id, text, emoji, author, commentDate} = comment;
    const isDeletedComment = Boolean(comment.id === idOfDeletedCommment);
    return `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
  </span>
  <div>
    <p class="film-details__comment-text">${he.encode(text)}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${dayjs().to(dayjs(commentDate))}</span>
      <button id="${id}" class="film-details__comment-delete" ${isDeleting ? 'disabled' : ''}>${isDeletedComment ? 'Deleting...' : 'Delete'}</button>
    </p>
  </div>
</li>
`;}
  ).join('')}
  </ul>

  <div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">
    ${newCommentEmoji ? `<img src="images/emoji/${newCommentEmoji}.png" width="55" height="55" alt="emoji-${newCommentEmoji}">` : ''}
    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${newCommentEmoji}" value="${newCommentEmoji}"  ${isSaving ? 'disabled' : ''}></input> 
    </div>

    <label class="film-details__comment-label" ${isSaving ? 'disabled' : ''}>
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isSaving ? 'disabled' : ''}>${newCommentText}</textarea>
    </label>

    <div class="film-details__emoji-list">

    ${Object.entries(emojiChecked).map(([emoji, isChecked]) => `
    
    <input class="film-details__emoji-item visually-hidden" name="comment-${emoji}" 
    type="radio" id="emoji-${emoji}" value="${emoji}" ${isChecked ? 'checked' : ''} ${isSaving ? 'disabled' : ''}>
      <label class="film-details__emoji-label" for="emoji-${emoji}">
        <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
      </label>`).join('')}

      
    </div>
  </div>
</section>`;

const createPopupTemplate = (data, comments, idOfDeletedCommment) => {
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
    country,
    newCommentEmoji,
    newCommentText,
    emojiChecked,
    isSaving, isDeleting} = data;

  const watchlistClassName = isInWatchlist ? 'film-details__control-button--active' : '';
  const watchedClassName = isWatched ? 'film-details__control-button--active' : '';
  const favoriteClassName = isFavorite ? 'film-details__control-button--active' : '';

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get" ${isSaving ? 'disabled' : ''}>
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">
  
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
                <td class="film-details__cell">${writers.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${dayjs(releaseDate).format('DD MMMM YYYY')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${createMovieDuration(duration)}</td>
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
      ${createCommentsTemplate(comments, newCommentEmoji, newCommentText, emojiChecked, isSaving, isDeleting, idOfDeletedCommment)}
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
  #idOfDeletedCommment = null;

  constructor(card, comments) {
    super();
    this.#card = card;
    this.#comments = comments;

    this._data = PopupView.parseMovieToData(card);
    this._commentsData = PopupView.parseMovieCommentsToData(comments);

    this.#setInnerHandlers();

  }

  get template() {
    return createPopupTemplate(this._data, this._commentsData, this.#idOfDeletedCommment);
  }


  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list')
      .addEventListener('click', this.#emojiClickHandler);

    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#commentInputHandler);

  }

  restoreHandlers() {
    this.#setInnerHandlers();
    this.setCloseButtonClickHandler(this._callback.closeButtonClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setNewCommentsSubmit(this._callback.commentsSubmit);
    this.setCommentDeleteButtonClickHandler(this._callback.deleteComment);
  }

  saveScrollPosition = () => {
    this.#elementScroll = document.querySelector('.film-details');
    this._scrollPosition = this.#elementScroll.scrollTop;
  }

  setScrollPosition = () => {
    this.#newElementScroll = document.querySelector('.film-details');
    if(this.#newElementScroll) {
      this.#newElementScroll.scrollTop = this._scrollPosition;
    }
  }

  resetPopup = () => {
    this.updateData(
      PopupView.parseMovieToData(this._data), true
    );
  }

  resetIdForDeletedComment = () => {
    this.#idOfDeletedCommment = null;
  }

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      newCommentText: evt.target.value,
    }, true);
  }

  #emojiClickHandler = (evt) => {
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
      .addEventListener('keydown', this.#commentFormSubmitHandler);
  }

  #commentFormSubmitHandler = (evt) => {
    if(evt.metaKey && evt.keyCode === 13 || evt.ctrlKey && evt.keyCode === 13) {
      evt.preventDefault();
      this.saveScrollPosition();
      const newComments = PopupView.parseDataToMovieComments(this._commentsData, this._data);
      const brandNewComment = newComments[newComments.length - 1];
      this._callback.commentsSubmit(PopupView.parseDataToMovie(this._data), brandNewComment);
      this.setScrollPosition();
    }
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

  setCommentDeleteButtonClickHandler = (callback) => {
    this._callback.deleteComment = callback;
    this.element.querySelector('.film-details__comments-list').addEventListener('click', this.#commentDeleteClickHandler);
  }

  #commentDeleteClickHandler = (evt) => {
    if(evt.target.tagName !== 'BUTTON') {
      return;
    }
    evt.preventDefault();
    const index = this._commentsData.findIndex((comment) => comment.id === evt.target.id);
    this.saveScrollPosition();
    this.#idOfDeletedCommment = evt.target.id;

    this._callback.deleteComment(PopupView.parseDataToMovie(this._data), this._commentsData[index], evt.target.id);

    this.setScrollPosition();
  }


  static parseMovieToData = (card) => ({...card,
    isSaving: false,
    isDeleting: false,
    newCommentEmoji: '',
    newCommentText: '',
    emojiChecked: {
      smile: false,
      puke: false,
      angry: false,
      sleeping: false,
    },
  });

  static parseMovieCommentsToData = (comments) => ([...comments
  ]);

  static parseDataToMovie = (data) => {
    const card = {...data};

    delete card.newCommentEmoji;
    delete card.newCommentText;
    delete card.emojiChecked;
    delete card.isSaving;
    delete card.isDeleting;

    return card;
  }

  static parseDataToMovieComments = (commentsData, data) => {
    const comments = [...commentsData, {id: nanoid(), text: data.newCommentText, emoji: data.newCommentEmoji, author: COMMENT_AUTHOR, commentDate: new Date()}];

    return comments;
  }

}
