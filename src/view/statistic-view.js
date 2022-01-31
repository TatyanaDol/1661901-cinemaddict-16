import SmartView from './smart-view.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { filter } from '../utils/filter.js';
import { FilterType } from '../model/filter-model.js';
import { calculateUserRank } from './user-rank-view.js';
import { createMovieDuration } from '../utils/utils.js';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const Colors = {
  WHITE: '#ffffff',
  YELLOW: '#ffe800',
};

const DATES = {
  All: 'all-time',

  YEAR: {
    FROM: dayjs().subtract(365, 'day').toDate(),
    TO: dayjs().toDate(),
  },
  TODAY: {
    FROM: dayjs().subtract(1, 'day').toDate(),
    TO: dayjs().toDate(),
  },
  WEEK: {
    FROM: dayjs().subtract(6, 'day').toDate(),
    TO: dayjs().toDate(),
  },
  MONTH: {
    FROM: dayjs().subtract(30, 'day').toDate(),
    TO: dayjs().toDate(),
  }
};

const countWatchedMoviesInDateRange = (watchedMovies, dateFrom, dateTo) => {

  const result = watchedMovies.filter((movie) => dayjs(movie.watchingDate).isBetween(dateFrom, dateTo) ||
  dayjs(movie.watchingDate).isSame(dateFrom)
  || dayjs(movie.watchingDate).isSame(dateTo));

  return result;

};

const countByGenres = (movies) => {
  const genres = {};
  movies.forEach((film) => {
    for ( let i = 0; i < film.genres.length; i++) {
      if(genres[film.genres[i]]) {
        genres[film.genres[i]] ++;
      } else {
        genres[film.genres[i]] = 1;
      }
    }
  });
  return genres;
};

const sortGenres = (moviesData) => Object.fromEntries(Object.entries(countByGenres(moviesData)).sort((a, b) => b[1] - a[1]));

const createStatisticTemplate = (watchedMovies, moviesNotFilteredByDate) => {

  const userRank = calculateUserRank(moviesNotFilteredByDate.length);

  const watchedTime = filter[FilterType.HISTORY](watchedMovies).reduce((acc, curr) => {
    acc += curr.duration;
    return acc;
  }, 0);

  const watchedHours = createMovieDuration(watchedTime, true).replaceAll('h', '').replaceAll('m', '');
  const watchedMinutes = createMovieDuration(watchedTime, false, true).replaceAll('m', '');

  const sortedGenres = Object.keys(sortGenres(watchedMovies));

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${userRank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedMovies.length}<span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${watchedHours} <span class="statistic__item-description">h</span> ${watchedMinutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${sortedGenres.length ? sortedGenres[0] : ''}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;};

const renderDiagram = (statisticCtx, sortedGenres) => {

  const BAR_HEIGHT = 50;
  statisticCtx.height = BAR_HEIGHT * Object.keys(sortedGenres).length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: Object.keys(sortedGenres),
      datasets: [{
        data: Object.values(sortedGenres),
        backgroundColor: Colors.YELLOW,
        hoverBackgroundColor: Colors.YELLOW,
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: Colors.WHITE,
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: Colors.WHITE,
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

export default class StatisticView extends SmartView {
  #chart = null;
  #dateFrom = 0;
  #dateTo = 0;
  #moviesNotFilteredByDate = null;

  constructor(movieCards) {
    super();

    this.#moviesNotFilteredByDate = filter[FilterType.HISTORY](movieCards);

    if(this.#dateFrom === 0) {
      this._data = [
        ...this.#moviesNotFilteredByDate
      ];
    } else {
      this._data = countWatchedMoviesInDateRange(this.#moviesNotFilteredByDate, this.#dateFrom, this.#dateTo);
    }

    this.#setInnerHandler();
    this.#setCharts();
  }

  get template() {
    return createStatisticTemplate(this._data, this.#moviesNotFilteredByDate);
  }

  removeElement = () => {
    super.removeElement();

    if(this.#chart) {
      this.#chart.destroy();
      this.#chart = null;
    }
  }

  restoreHandlers = () => {
    this.#setCharts();
    this.#setInnerHandler();
  }

  #setInnerHandler = () => {
    this.element.querySelector('.statistic__filters')
      .addEventListener('change', this.#dateChangeHandler);

  }

  #dateChangeHandler = async (evt) => {

    if(!evt.tagName === 'INPUT') {
      return;
    }

    if(evt.target.value === DATES.All) {
      this.#dateFrom = 0;
      this.#dateTo = 0;
      this._data = [...this.#moviesNotFilteredByDate];
    } else {
      this.#dateFrom = DATES[evt.target.value.toUpperCase()].FROM;
      this.#dateTo = DATES[evt.target.value.toUpperCase()].TO;

      this._data = countWatchedMoviesInDateRange(this.#moviesNotFilteredByDate, this.#dateFrom, this.#dateTo);
    }

    this.updateElement();

    const statisticFilter = this.element.querySelector(`[value=${evt.target.value}]`);

    statisticFilter.checked = true;

  }

  #setCharts = () => {
    const statisticCtx = this.element.querySelector('.statistic__chart');
    const watchedMovies = filter[FilterType.HISTORY](this._data);
    const sortedGenres = sortGenres(watchedMovies);

    this.#chart = renderDiagram(statisticCtx, sortedGenres);
  }

}
