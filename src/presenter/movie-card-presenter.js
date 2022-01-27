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
  INIT: 'INIT',
  STATISTICS: 'STATISTICS',
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
    #commentsModel = null;

    constructor(filmsListContainer, footerContainer, changeCardData, handleCloseOldCardPopup, commentsModel) {
      this.#filmsListContainer = filmsListContainer;
      this.#footerContainer = footerContainer;
      this.#changeCardData = changeCardData;
      this.#closeOldCardPopup = handleCloseOldCardPopup;
      this.#commentsModel = commentsModel;
    }

    init = (card, comments) => {
      this.#card = card;
      if(!comments) {
        this.#comments = [];
      }
      else {
        this.#comments = [...comments];
      }

      const prevCardComponent = this.#movieCardComponent;
      const prevCardPopupComponent = this.#movieCardPopupComponent;

      this.#movieCardComponent = new MovieCardView(card);
      this.#movieCardPopupComponent = new PopupView(card, this.#comments);
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
      this.#commentsModel.init(this.#card, this.#card.id);

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

    #handleNewCommentsSubmit = (card, comment) => {
      const isPopup = true;
      this.#changeCardData(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        card, comment, isPopup);
    }

    #handleCommentDelete = (card, comments, commentId) => {
      const isPopup = true;
      this.#changeCardData(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH,
        card, comments, isPopup, commentId);
    }

    setSaving = () => {
      this.#movieCardPopupComponent.updateData({
        isSaving: true,
      });
    }

    setDeleting = () => {
      this.#movieCardPopupComponent.updateData({
        isDeleting: true,
      });
    }

    setAborting = (scrollPosition, commentId) => {
      const resetForm = () => {
        this.#movieCardPopupComponent.updateData({
          isSaving: false,
          isDeleting: false,
        });
        this.#movieCardPopupComponent.resetIdForDeletedComment();
        const newElementScroll = document.querySelector('.film-details');
        newElementScroll.scrollTop = scrollPosition;
      };
      this.#movieCardPopupComponent.shake(resetForm, commentId);
    }

}

