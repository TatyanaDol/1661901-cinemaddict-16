import MovieCountView from './view/movies-count-view.js';
import {generateMovieCard, generateComments} from './mock/mock-card.js';
import {SetPosition, render} from './utils/render.js';
import MovieListPresenter from './presenter/MovieListPresenter.js';
import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

const CARD_COUNT = 22;

const movieCards = Array.from({length: CARD_COUNT}, generateMovieCard);
const cardsComments = CARD_COUNT ? Array.from({length: movieCards[0].comments}, generateComments) : [];

const movieModel = new MoviesModel();
movieModel.movieCards = movieCards;

const commentsModel = new CommentsModel();
commentsModel.movieComments = cardsComments;

const filterModel = new FilterModel();

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const filterPresenter = new FilterPresenter(mainElement, filterModel, movieModel, headerElement);

filterPresenter.init();

const movieListPresenter = new MovieListPresenter(mainElement, footerElement, movieModel, commentsModel, filterModel);

movieListPresenter.init();

const footerStatisticsElement = footerElement.querySelector('.footer__statistics');
render(footerStatisticsElement, new MovieCountView(movieCards), SetPosition.BEFOREEND);
