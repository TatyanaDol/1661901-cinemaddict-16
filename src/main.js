import MovieListPresenter from './presenter/MovieListPresenter.js';
import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import ApiService from './api-service';

export const MenuItem = {
  FILTERS: 'FILTERS',
  STATISTICS: 'STATISTICS',
};

const AUTHORIZATION = 'Basic rftg78ijuytjhhnewtrwe34';
const BASE_URL = 'https://16.ecmascript.pages.academy/cinemaddict';

const API_SERVICE = new ApiService(BASE_URL, AUTHORIZATION);

const movieModel = new MoviesModel(API_SERVICE);

const commentsModel = new CommentsModel(API_SERVICE);

const filterModel = new FilterModel();

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');


const filterPresenter = new FilterPresenter(mainElement, filterModel, movieModel, headerElement);

filterPresenter.init();

const movieListPresenter = new MovieListPresenter(mainElement, footerElement, movieModel, commentsModel, filterModel);

movieListPresenter.init();
movieModel.init();
