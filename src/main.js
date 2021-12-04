import UserRankView from './view/user-rank-view.js';
import SortView from './view/sort-view.js';
import MovieListView from './view/movie-list-view.js';
import MovieCardView from './view/movie-card-view.js';
import ShowMoreButtonView from './view/show-button-view.js';
import MovieCountView from './view/movies-count-view.js';
import PopupView from './view/popup-view';
import {generateMovieCard, generateComments} from './mock/mock-card.js';
import {generateFilter} from './mock/filter-mock.js';
import {SetPosition, render} from './render.js';
import MenuStatisticFilterView from './view/menu-statistic-and-filter-view.js';

const CARD_COUNT = 22;
const CARD_COUNT_PER_STEP = 5;

const movieCards = Array.from({length: CARD_COUNT}, generateMovieCard);
const cardsComments = Array.from({length: movieCards[0].comments}, generateComments);
const filters = generateFilter(movieCards);

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');

render(headerElement, new UserRankView(filters).element, SetPosition.BEFOREEND);
render(mainElement, new MenuStatisticFilterView(filters).element, SetPosition.BEFOREEND);
render(mainElement, new SortView().element, SetPosition.BEFOREEND);

const movieListComponent = new MovieListView();

render(mainElement, movieListComponent.element, SetPosition.BEFOREEND);

const filmsList = movieListComponent.element.querySelector('.films-list');
const filmsListContainer = movieListComponent.element.querySelector('.films-list__container');
const footerElement = document.querySelector('.footer');

const renderCard = (filmsListElement, card, comments) => {
  const movieCardComponent = new MovieCardView(card);
  const movieCardPopupComponent = new PopupView(card, comments);
  const bodyElement = document.querySelector('body');

  const showCardPopup = () => {
    bodyElement.classList.add('hide-overflow');
    render(footerElement, movieCardPopupComponent.element, SetPosition.AFTEREND);
  };

  const closeCardPopup = () => {
    bodyElement.classList.remove('hide-overflow');
    movieCardPopupComponent.element.remove();
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      closeCardPopup();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  movieCardComponent.element.querySelector('.film-card__link').addEventListener('click', () => {
    showCardPopup();
    document.addEventListener('keydown', onEscKeyDown);
  });

  movieCardPopupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
    closeCardPopup();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(filmsListElement, movieCardComponent.element, SetPosition.BEFOREEND);

};

for (let i = 0; i < Math.min(movieCards.length, CARD_COUNT_PER_STEP); i++) {
  renderCard(filmsListContainer, movieCards[i], cardsComments);
}

if (movieCards.length > CARD_COUNT_PER_STEP) {
  let renderedCardsCount = CARD_COUNT_PER_STEP;

  const showMoreButtonComponent = new ShowMoreButtonView();

  render(filmsList, showMoreButtonComponent.element, SetPosition.BEFOREEND);

  showMoreButtonComponent.element.addEventListener('click', (evt) => {
    evt.preventDefault();
    movieCards
      .slice(renderedCardsCount, renderedCardsCount + CARD_COUNT_PER_STEP)
      .forEach((card) => renderCard(filmsListContainer, card, cardsComments));

    renderedCardsCount += CARD_COUNT_PER_STEP;

    if (renderedCardsCount >= movieCards.length) {

      showMoreButtonComponent.element.remove();
      showMoreButtonComponent.removeElement();
    }
  });
}


const footerStatisticsElement = footerElement.querySelector('.footer__statistics');

render(footerStatisticsElement, new MovieCountView(movieCards).element, SetPosition.BEFOREEND);
