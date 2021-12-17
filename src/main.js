import UserRankView from './view/user-rank-view.js';
import MovieCountView from './view/movies-count-view.js';
import {generateMovieCard, generateComments} from './mock/mock-card.js';
import {generateFilter} from './mock/filter-mock.js';
import {SetPosition, render} from './utils/render.js';
import MenuStatisticFilterView from './view/menu-statistic-and-filter-view.js';
import {findActiveFilterName} from './view/movie-list-empty-view.js';
import {findFilter} from './utils/utils.js';
import MovieListPresenter from './presenter/MovieListPresenter.js';

const CARD_COUNT = 22;

const movieCards = Array.from({length: CARD_COUNT}, generateMovieCard);
const cardsComments = CARD_COUNT ? Array.from({length: movieCards[0].comments}, generateComments) : [];
const filters = generateFilter(movieCards);

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');


render(headerElement, new UserRankView(filters), SetPosition.BEFOREEND);

const statAndFiltersComponent = new MenuStatisticFilterView(filters);

render(mainElement, statAndFiltersComponent, SetPosition.BEFOREEND);

const  activeFilterElement = statAndFiltersComponent.element.querySelector('.main-navigation__item--active');
const activeFilterCount = findFilter(findActiveFilterName(activeFilterElement).toLowerCase(), filters).count;

const movieListPresenter = new MovieListPresenter(mainElement, footerElement, activeFilterElement, activeFilterCount);

movieListPresenter.init(movieCards, cardsComments);

const footerStatisticsElement = footerElement.querySelector('.footer__statistics');
render(footerStatisticsElement, new MovieCountView(movieCards), SetPosition.BEFOREEND);
