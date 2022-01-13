import MovieCardView from '../view/movie-card-view.js';
import PopupView from '../view/popup-view';
import {SetPosition, render, remove, replace} from '../utils/render.js';

export const UserAction = {
  UPDATE_CARD: 'UPDATE_CARD',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export default class MovieCardPresenter {

    #movieCardComponent = null;
    #movieCardPopupComponent = null;
    #filmsListContainer = null;
    #bodyElement = null;
    #footerContainer = null;
    #changeCardData = null;
    #closeOldCardPopup = null;

    #card = null;
    #comments = null;

    constructor(filmsListContainer, footerContainer, changeCardData, handleCloseOldCardPopup) {
      this.#filmsListContainer = filmsListContainer;
      this.#footerContainer = footerContainer;
      this.#changeCardData = changeCardData;
      this.#closeOldCardPopup = handleCloseOldCardPopup;
    }

    init = (card, comments) => {
      this.#card = card;
      this.#comments = [...comments];

      const prevCardComponent = this.#movieCardComponent;
      const prevCardPopupComponent = this.#movieCardPopupComponent;

      this.#movieCardComponent = new MovieCardView(card);
      this.#movieCardPopupComponent = new PopupView(card, comments);
      this.#bodyElement = document.querySelector('body');

      this.#movieCardComponent.setCardClickHandler(this.#handleMovieCardClick);
      this.#movieCardPopupComponent.setCloseButtonClickHandler(this.#handleCloseButtonClick);

      this.#movieCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
      this.#movieCardComponent.setWatchedClickHandler(this.#handleWatchedClick);
      this.#movieCardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);

      this.#movieCardPopupComponent.setFavoriteClickHandler(this.#handleFavoriteClickOnPopup);
      this.#movieCardPopupComponent.setWatchedClickHandler(this.#handleWatchedClickOnPopup);
      this.#movieCardPopupComponent.setWatchlistClickHandler(this.#handleWatchlistClickOnPopup);

      this.#movieCardPopupComponent.setNewCommentsSubmit(this.#handleNewCommentsSubmit);
      this.#movieCardPopupComponent.setCommentDeleteButtonClickHandler(this.#handleCommentDelete);

      if(prevCardComponent === null || prevCardPopupComponent === null) {
        render(this.#filmsListContainer, this.#movieCardComponent, SetPosition.BEFOREEND);
        return;
      }

      if (this.#filmsListContainer.contains(prevCardComponent.element)) {
        replace(this.#movieCardComponent, prevCardComponent);
      }

      if (this.#bodyElement.contains(prevCardPopupComponent.element)) {
        replace(this.#movieCardPopupComponent, prevCardPopupComponent);
      }

      remove(prevCardComponent);
      remove(prevCardPopupComponent);
    }

    destroyCardComponents = () => {
      remove(this.#movieCardComponent);
      remove(this.#movieCardPopupComponent);
    }

    #showCardPopup = () => {
      this.#closeOldCardPopup();
      this.#bodyElement.classList.add('hide-overflow');
      render(this.#footerContainer, this.#movieCardPopupComponent, SetPosition.AFTEREND);
    }

    showPopup = () => {
      this.#showCardPopup();
      document.addEventListener('keydown', this.#onEscKeyDown);
    }

    #closeCardPopup = () => {
      this.#movieCardPopupComponent.resetPopup();
      this.#bodyElement.classList.remove('hide-overflow');
      this.#movieCardPopupComponent.element.remove();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }

    #onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        this.#closeCardPopup();
      }
    }

    #handleMovieCardClick = () => {
      this.#showCardPopup();
      document.addEventListener('keydown', this.#onEscKeyDown);
    }

    #handleCloseButtonClick = () => {
      this.#closeCardPopup();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }

    #handleFavoriteClick = () => {
      this.#changeCardData(
        UserAction.UPDATE_CARD,
        UpdateType.MINOR,
        {...this.#card, isFavorite: !this.#card.isFavorite}, this.#comments);
    }

    #handleFavoriteClickOnPopup = () => {
      const isPopup = true;
      this.#changeCardData(
        UserAction.UPDATE_CARD,
        UpdateType.MINOR,
        {...this.#card, isFavorite: !this.#card.isFavorite}, this.#comments, isPopup);
    }

    #handleWatchedClick = () => {
      this.#changeCardData(
        UserAction.UPDATE_CARD,
        UpdateType.MINOR,
        {...this.#card, isWatched: !this.#card.isWatched}, this.#comments);
    }

    #handleWatchedClickOnPopup = () => {
      const isPopup = true;
      this.#changeCardData(
        UserAction.UPDATE_CARD,
        UpdateType.MINOR,
        {...this.#card, isWatched: !this.#card.isWatched}, this.#comments, isPopup);
    }

    #handleWatchlistClick = () => {
      this.#changeCardData(
        UserAction.UPDATE_CARD,
        UpdateType.MINOR,
        {...this.#card, isInWatchlist: !this.#card.isInWatchlist}, this.#comments);
    }

    #handleWatchlistClickOnPopup = () => {
      const isPopup = true;
      this.#changeCardData(
        UserAction.UPDATE_CARD,
        UpdateType.MINOR,
        {...this.#card, isInWatchlist: !this.#card.isInWatchlist}, this.#comments, isPopup);
    }

    #handleNewCommentsSubmit = (card, comments) => {
      this.#changeCardData(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        card, comments);
    }

    #handleCommentDelete = (card, comments) => {
      this.#changeCardData(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH,
        card, comments);
    }

}

