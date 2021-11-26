import {createUserRankTemplate} from './view/user-rank-view.js';
import {createMenuStatisticAndFilterTemplate} from './view/menu-statistic-and-filter-view.js';
import {createSortTemplate} from './view/sort-view.js';
import {createMovieListTemplate} from './view/movie-list-view.js';
import {createMovieCardTemplate} from './view/movie-card-view.js';
import {createShowButtonTemplate} from './view/show-button-view.js';
import {createMovieCountTemplate} from './view/movies-count-view.js';
import {createPopupTemplate} from './view/popup-view';

const CARD_COUNT = 5;

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

renderTemplate(headerElement, createUserRankTemplate(), SetPosition.BEFOREEND);
renderTemplate(mainElement, createMenuStatisticAndFilterTemplate(), SetPosition.BEFOREEND);
renderTemplate(mainElement, createSortTemplate(), SetPosition.BEFOREEND);

renderTemplate(mainElement, createMovieListTemplate(), SetPosition.BEFOREEND);

const filmsElement = document.querySelector('.films');
const cardContainerElement = filmsElement.querySelector('.films-list__container');
const filmsListElement = filmsElement.querySelector('.films-list');


for (let i = 0; i < CARD_COUNT; i++) {
  renderTemplate(cardContainerElement, createMovieCardTemplate(), SetPosition.BEFOREEND);
}

renderTemplate(filmsListElement, createShowButtonTemplate(), SetPosition.BEFOREEND);
const footerElement = document.querySelector('.footer');
const footerStatisticsElement = footerElement.querySelector('.footer__statistics');

renderTemplate(footerStatisticsElement, createMovieCountTemplate(), SetPosition.BEFOREEND);

renderTemplate(footerElement, createPopupTemplate(), SetPosition.AFTEREND);
