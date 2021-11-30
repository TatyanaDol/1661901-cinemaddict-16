import {createUserRankTemplate} from './view/user-rank-view.js';
import {createMenuStatisticAndFilterTemplate} from './view/menu-statistic-and-filter-view.js';
import {createSortTemplate} from './view/sort-view.js';
import {createMovieListTemplate} from './view/movie-list-view.js';
import {createMovieCardTemplate} from './view/movie-card-view.js';
import {createShowButtonTemplate} from './view/show-button-view.js';
import {createMovieCountTemplate} from './view/movies-count-view.js';
import {createPopupTemplate} from './view/popup-view';
import {generateMovieCard, generateComments} from './mock/mock-card.js';
import {generateFilter} from './mock/filter-mock.js';

const CARD_COUNT = 22;
const CARD_COUNT_PER_STEP = 5;

const movieCards = Array.from({length: CARD_COUNT}, generateMovieCard);
const cardsComments = Array.from({length: movieCards[0].comments}, generateComments);
const filters = generateFilter(movieCards);


const SetPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');

renderTemplate(headerElement, createUserRankTemplate(filters), SetPosition.BEFOREEND);
renderTemplate(mainElement, createMenuStatisticAndFilterTemplate(filters), SetPosition.BEFOREEND);
renderTemplate(mainElement, createSortTemplate(), SetPosition.BEFOREEND);

renderTemplate(mainElement, createMovieListTemplate(), SetPosition.BEFOREEND);

const filmsElement = document.querySelector('.films');
const cardContainerElement = filmsElement.querySelector('.films-list__container');
const filmsListElement = filmsElement.querySelector('.films-list');

for (let i = 0; i < Math.min(movieCards.length, CARD_COUNT_PER_STEP); i++) {
  renderTemplate(cardContainerElement, createMovieCardTemplate(movieCards[i]), SetPosition.BEFOREEND);
}

if (movieCards.length > CARD_COUNT_PER_STEP) {
  let renderedCardsCount = CARD_COUNT_PER_STEP;
  renderTemplate(filmsListElement, createShowButtonTemplate(), SetPosition.BEFOREEND);

  const showMoreButton = filmsListElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    movieCards
      .slice(renderedCardsCount, renderedCardsCount + CARD_COUNT_PER_STEP)
      .forEach((card) => renderTemplate(cardContainerElement, createMovieCardTemplate(card), SetPosition.BEFOREEND));

    renderedCardsCount += CARD_COUNT_PER_STEP;

    if (renderedCardsCount >= movieCards.length) {
      showMoreButton.remove();
    }
  });
}

const footerElement = document.querySelector('.footer');
const footerStatisticsElement = footerElement.querySelector('.footer__statistics');

renderTemplate(footerStatisticsElement, createMovieCountTemplate(movieCards), SetPosition.BEFOREEND);

renderTemplate(footerElement, createPopupTemplate(movieCards[0], cardsComments), SetPosition.AFTEREND);
