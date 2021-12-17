import MovieCardView from '../view/movie-card-view.js';
import PopupView from '../view/popup-view';
import {SetPosition, render, remove, replace} from '../utils/render.js';

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

      this.#movieCardPopupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
      this.#movieCardPopupComponent.setWatchedClickHandler(this.#handleWatchedClick);
      this.#movieCardPopupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);

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

    #closePreviousPopup = () => {
      this.#closeOldCardPopup();
    }

    #showCardPopup = () => {
      this.#closePreviousPopup();
      this.#bodyElement.classList.add('hide-overflow');
      render(this.#footerContainer, this.#movieCardPopupComponent, SetPosition.AFTEREND);
    }

    #closeCardPopup = () => {
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
      this.#changeCardData({...this.#card, isFavorite: !this.#card.isFavorite});
    }

    #handleWatchedClick = () => {
      this.#changeCardData({...this.#card, isWatched: !this.#card.isWatched});
    }

    #handleWatchlistClick = () => {
      this.#changeCardData({...this.#card, isInWatchlist: !this.#card.isInWatchlist});
    }

}

