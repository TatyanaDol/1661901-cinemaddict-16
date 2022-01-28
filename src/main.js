import MovieListPresenter from './presenter/movie-list-presenter.js';
import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import ApiService from './api-service';
import StatisticView from './view/statistic-view.js';
import {SetPosition, render, remove} from './utils/render.js';


export const MenuItem = {
  STATISTICS: 'STATISTICS',
};

const AUTHORIZATION = 'Basic rftg78ijuytjhhnewtrwe34';
const BASE_URL = 'https://16.ecmascript.pages.academy/cinemaddict';

const API_SERVICE = new ApiService(BASE_URL, AUTHORIZATION);

const filterModel = new FilterModel();

const movieModel = new MoviesModel(API_SERVICE, filterModel);

const commentsModel = new CommentsModel(API_SERVICE);

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');
let statisticComponent = null;

const movieListPresenter = new MovieListPresenter(mainElement, footerElement, movieModel, commentsModel, filterModel);

const handleFiltersAndStatisticClick = (menuItem) => {

  if(menuItem === MenuItem.STATISTICS) {
    if(statisticComponent) {
      remove(statisticComponent);

    }
    movieListPresenter.destroyMovieListPresenter();
    statisticComponent = new StatisticView(movieModel.movieCards);
    render(mainElement, statisticComponent, SetPosition.BEFOREEND);
    return;
  }

  movieListPresenter.destroyMovieListPresenter();
  movieListPresenter.init();
  remove(statisticComponent);

};
const filterPresenter = new FilterPresenter(mainElement, filterModel, movieModel, headerElement, handleFiltersAndStatisticClick);

filterPresenter.init();


movieListPresenter.init();
movieModel.init();
