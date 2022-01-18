import SortView from '../view/sort-view.js';
import MovieListView from '../view/movie-list-view.js';
import ShowMoreButtonView from '../view/show-button-view.js';
import {SetPosition, render, remove} from '../utils/render.js';
import EmptyMovieListView from '../view/movie-list-empty-view.js';
import MovieCardPresenter from './MovieCardPresenter.js';
import {sortFilmsByRating, sortFilmsByDate} from '../utils/utils.js';
import {SortType} from '../view/sort-view.js';
import {UpdateType, UserAction} from './MovieCardPresenter.js';
import {filter} from '../utils/filter.js';
import {FilterType} from '../model/filter-model.js';
import LoadingFilmsView from '../view/loading-view.js';
import MovieCountView from '../view/movies-count-view.js';


const CARD_COUNT_PER_STEP = 5;


export default class MovieListPresenter {
    #mainContainer = null;
    #filmsList = null;
    #filmsListContainer = null;
    #footerContainer = null;

    #movieModel = null;

    #commentsModel = null;

    #filterModel = null;

    #movieListComponent = null;
    #moviesSortComponent = null;
    #showMoreButtonComponent = null;
    #emptyMovieListComponent = null;
    #loadingFilmsComponent = new LoadingFilmsView();
    #movieCountComponent = null;

    #renderedCardsCount = CARD_COUNT_PER_STEP;
    #cardPresenterMap = new Map();
    #currentMovieSortType = SortType.DEFAULT;
    #activeMoviesFilterType = FilterType.ALL;
    #isFilmsLoading = true;

    #elementScroll = null;
    #scrollPosition = null;
    #newElementScroll = null;

    constructor(mainContainer, footerContainer, movieModel, commentsModel, filterModel) {
      this.#mainContainer = mainContainer;
      this.#footerContainer = footerContainer;
      this.#movieModel = movieModel;
      this.#commentsModel = commentsModel;
      this.#filterModel = filterModel;

      this.#movieModel.addObserver(this.#handleModelEvent);
      this.#commentsModel.addObserver(this.#handleModelEvent);
      this.#filterModel.addObserver(this.#handleModelEvent);

    }

    get movieCards() {
      this.#activeMoviesFilterType = this.#filterModel.moviesFilter;
      const movieCards = this.#movieModel.movieCards;
      const filteredMovieCards = filter[this.#activeMoviesFilterType](movieCards);

      switch (this.#currentMovieSortType) {
        case SortType.RATING:
          return [...filteredMovieCards].sort(sortFilmsByRating);
        case SortType.DATE:
          return [...filteredMovieCards].sort(sortFilmsByDate);
      }

      return filteredMovieCards;
    }

    get movieComments() {
      return this.#commentsModel.movieComments;
    }

    init = () => {

      this.#renderFullBoard();

    }

    #handleMovieSortChange = (sortType) => {
      if (this.#currentMovieSortType === sortType) {
        return;
      }
      this.#currentMovieSortType = sortType;
      this.#clearFullBoard({resetRenderedCardsCount: true});
      this.#renderFullBoard();
    }

    #handleCloseOldCardPopup = () => {
      const oldPopup = document.querySelector('.film-details');
      if (oldPopup) {
        oldPopup.remove();
      }
    }

    #handleViewAction = (actionType, updateType, updatedCard, updatedComments, isPopupOpened) => {
      if(isPopupOpened) {
        this.#elementScroll = document.querySelector('.film-details');
        this.#scrollPosition = this.#elementScroll.scrollTop;
      }
      switch (actionType) {
        case UserAction.UPDATE_CARD:
          this.#movieModel.updateMovieCard(updateType, updatedCard, isPopupOpened);
          break;
        case UserAction.ADD_COMMENT:
          this.#commentsModel.addMovieComment(updateType, updatedComments, updatedCard);
          this.#movieModel.updateMovieCard(updateType, updatedCard);
          break;
        case UserAction.DELETE_COMMENT:
          this.#commentsModel.deleteMovieComment(updateType, updatedComments, updatedCard);
          this.#movieModel.updateMovieCard(updateType, updatedCard);
          break;
      }
    }


    #handleModelEvent = (updateType, data, isPopupOpened) => {

      switch (updateType) {
        case UpdateType.PATCH:
          this.#cardPresenterMap.get(data.id).init(data);
          break;
        case UpdateType.MINOR:
          this.#clearFullBoard();
          this.#renderFullBoard();
          if(this.movieCards.find((card) => card.id === data.id)) {
            if(isPopupOpened) {
              this.#cardPresenterMap.get(data.id).showPopup();
            }
          } else {
            if(isPopupOpened) {
              document.querySelector('body').classList.remove('hide-overflow');
            }
          }
          break;
        case UpdateType.MAJOR:
          this.#clearFullBoard({resetRenderedCardsCount: true, resetSortType: true});
          this.#renderFullBoard();
          break;
        case UpdateType.INIT:
          this.#isFilmsLoading = false;
          remove(this.#loadingFilmsComponent);
          this.#renderFullBoard();
          break;
        case UpdateType.COMMENTS:
          this.#cardPresenterMap.get(data.id).init(data, this.#commentsModel.movieComments);
          break;
      }

      this.#newElementScroll = document.querySelector('.film-details');
      if(this.#newElementScroll) {
        this.#newElementScroll.scrollTop = this.#scrollPosition;
      }

    }

    #renderSort = () => {
      this.#moviesSortComponent = new SortView(this.#currentMovieSortType);
      this.#moviesSortComponent.setMovieSortChangeHandler(this.#handleMovieSortChange);
      render(this.#mainContainer, this.#moviesSortComponent, SetPosition.BEFOREEND);
    }

    #renderCard = (card) => {

      const cardPresenter = new MovieCardPresenter(this.#filmsListContainer, this.#footerContainer, this.#handleViewAction, this.#handleCloseOldCardPopup, this.#commentsModel);
      cardPresenter.init(card);

      this.#cardPresenterMap.set(card.id, cardPresenter);

    }

    #renderCards = (cards) => {
      cards.forEach((card) => this.#renderCard(card));

    }

    #renderEmptyList = () => {
      this.#emptyMovieListComponent = new EmptyMovieListView(this.#filterModel.moviesFilter);
      render(this.#mainContainer, this.#emptyMovieListComponent, SetPosition.BEFOREEND);

    }

    #renderFilmsLoading = () => {
      render(this.#mainContainer, this.#loadingFilmsComponent, SetPosition.BEFOREEND);
    }

    #handleShowMoreButtonClick = () => {
      const movieCardsCount = this.movieCards.length;
      const newRenderedMovieCardsCount = Math.min(movieCardsCount, this.#renderedCardsCount + CARD_COUNT_PER_STEP);
      const filmCards = this.movieCards.slice(this.#renderedCardsCount, newRenderedMovieCardsCount);

      this.#renderCards(filmCards);
      this.#renderedCardsCount = newRenderedMovieCardsCount;

      if (this.#renderedCardsCount >= movieCardsCount) {
        remove(this.#showMoreButtonComponent);
      }
    }

    #renderShowMoreButton = () => {
      this.#showMoreButtonComponent = new ShowMoreButtonView();
      this.#showMoreButtonComponent.setShowMoreButtonClickHandler(this.#handleShowMoreButtonClick);
      render(this.#filmsList, this.#showMoreButtonComponent, SetPosition.BEFOREEND);
    }

    #clearFullBoard = ({resetRenderedCardsCount = false, resetSortType = false} = {}) => {
      const movieCardsCount = this.movieCards.length;

      this.#cardPresenterMap.forEach((presenter) => presenter.destroyCardComponents());
      this.#cardPresenterMap.clear();

      remove(this.#moviesSortComponent);
      remove(this.#showMoreButtonComponent);
      remove(this.#movieListComponent);
      remove(this.#loadingFilmsComponent);
      remove(this.#movieCountComponent);

      if (this.#emptyMovieListComponent) {
        remove(this.#emptyMovieListComponent);
      }

      if (resetRenderedCardsCount) {
        this.#renderedCardsCount = CARD_COUNT_PER_STEP;
      } else {
        this.#renderedCardsCount = Math.min(movieCardsCount, this.#renderedCardsCount);
      }

      if (resetSortType) {
        this.#currentMovieSortType = SortType.DEFAULT;
      }

    }

    #renderMoviesList = () => {
      this.#movieListComponent = new MovieListView();
      render(this.#mainContainer, this.#movieListComponent, SetPosition.BEFOREEND);

      this.#filmsList = this.#movieListComponent.element.querySelector('.films-list');
      this.#filmsListContainer = this.#movieListComponent.element.querySelector('.films-list__container');

    }

    #renderMovieCount = () => {
      this.#movieCountComponent = new MovieCountView(this.movieCards);
      const footerStatisticsElement = this.#footerContainer.querySelector('.footer__statistics');
      render(footerStatisticsElement, this.#movieCountComponent, SetPosition.BEFOREEND);
    }

    #renderFullBoard = () => {
      if (this.#isFilmsLoading) {
        this.#renderFilmsLoading();
        return;
      }

      const cards = this.movieCards;
      const movieCardsCount = cards.length;

      if (movieCardsCount === 0) {
        this.#renderEmptyList();
        return;
      }
      this.#renderSort();

      this.#renderMoviesList();

      this.#renderCards(cards.slice(0, Math.min(movieCardsCount, this.#renderedCardsCount)));

      if (movieCardsCount > this.#renderedCardsCount) {
        this.#renderShowMoreButton();
      }
      this.#renderMovieCount();


    }

}
