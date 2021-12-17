import SortView from '../view/sort-view.js';
import MovieListView from '../view/movie-list-view.js';
import ShowMoreButtonView from '../view/show-button-view.js';
import {SetPosition, render, remove} from '../utils/render.js';
import EmptyMovieListView from '../view/movie-list-empty-view.js';
import MovieCardPresenter from './MovieCardPresenter.js';
import {updateItem} from '../utils/utils.js';

const CARD_COUNT_PER_STEP = 5;

export default class MovieListPresenter {
    #mainContainer = null;
    #filmsList = null;
    #filmsListContainer = null;
    #activeFilterElement = null;
    #activeFilterCount = null;
    #footerContainer = null;

    #movieListComponent = new MovieListView();
    #moviesSortComponent = new SortView();
    #showMoreButtonComponent = new ShowMoreButtonView();

    #movieCards = [];
    #movieComments = [];
    #renderedCardsCount = CARD_COUNT_PER_STEP;
    #cardPresenterMap = new Map();

    constructor(mainContainer, footerContainer, activeFilterElement, activeFilterCount) {
      this.#mainContainer = mainContainer;
      this.#activeFilterElement = activeFilterElement;
      this.#activeFilterCount = activeFilterCount;
      this.#footerContainer = footerContainer;
    }

    init = (movieCards, movieComments) => {
      this.#movieCards = [...movieCards];
      this.#movieComments = [...movieComments];

      if (!this.#activeFilterCount) {
        this.#renderEmptyList();
      } else {
        this.#renderFullList();
      }
    }

    #handleCloseOldCardPopup = () => {
      const oldPopup = document.querySelector('.film-details');
      if (oldPopup) {
        oldPopup.remove();
      }
    }

    #handleCardChange = (updatedCard) => {
      this.#movieCards = updateItem(this.#movieCards, updatedCard);
      this.#cardPresenterMap.get(updatedCard.id).init(updatedCard, this.#movieComments);
    }

    #renderSort = () => {
      render(this.#mainContainer, this.#moviesSortComponent, SetPosition.BEFOREEND);
    }

    #renderCard = (card, comments) => {

      const cardPresenter = new MovieCardPresenter(this.#filmsListContainer, this.#footerContainer, this.#handleCardChange, this.#handleCloseOldCardPopup);
      cardPresenter.init(card, comments);

      this.#cardPresenterMap.set(card.id, cardPresenter);

    }

    #renderCards = (from, to) => {
      this.#movieCards
        .slice(from, to)
        .forEach((card) => this.#renderCard(card, this.#movieComments));
    }

    #renderEmptyList = () => {
      render(this.#mainContainer, new EmptyMovieListView(this.#activeFilterElement), SetPosition.BEFOREEND);

    }

    #handleShowMoreButtonClick = () => {
      this.#renderCards(this.#renderedCardsCount, this.#renderedCardsCount + CARD_COUNT_PER_STEP);

      this.#renderedCardsCount += CARD_COUNT_PER_STEP;

      if (this.#renderedCardsCount >= this.#movieCards.length) {
        remove(this.#showMoreButtonComponent);
      }
    }

    #renderShowMoreButton = () => {

      render(this.#filmsList, this.#showMoreButtonComponent, SetPosition.BEFOREEND);
      this.#showMoreButtonComponent.setShowMoreButtonClickHandler(this.#handleShowMoreButtonClick);
    }

    #clearMovieCardsList = () => {
      this.#cardPresenterMap.forEach((presenter) => presenter.destroyCardComponents());
      this.#cardPresenterMap.clear();
      this.#renderedCardsCount = CARD_COUNT_PER_STEP;
      remove(this.#showMoreButtonComponent);
    }

    #renderMovieCardsList = () => {
      this.#renderCards(0, Math.min(this.#movieCards.length, CARD_COUNT_PER_STEP));

      if (this.#movieCards.length > CARD_COUNT_PER_STEP) {
        this.#renderShowMoreButton();
      }
    }

    #renderFullList = () => {
      this.#renderSort();

      render(this.#mainContainer, this.#movieListComponent, SetPosition.BEFOREEND);

      this.#filmsList = this.#movieListComponent.element.querySelector('.films-list');
      this.#filmsListContainer = this.#movieListComponent.element.querySelector('.films-list__container');

      this.#renderMovieCardsList();
    }

}
