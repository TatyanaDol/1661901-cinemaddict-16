import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../presenter/movie-card-presenter.js';

export default class MoviesModel extends AbstractObservable {
    #apiService = null;
    #movieCards = [];

    constructor(apiService) {
      super();
      this.#apiService = apiService;

    }

    get movieCards() {
      return this.#movieCards;
    }

    init = async () => {

      try {
        const movies = await this.#apiService.movies;
        this.#movieCards = movies.map(this.#adaptMovieDataToClient);
      } catch(err) {
        this.#movieCards = [];
      }

      this._notify(UpdateType.INIT);

    }

    updateMovieCard = async (updateType, update, isPopupOpened) => {
      const index = this.#movieCards.findIndex((card) => card.id === update.id);
      if (index === -1) {
        throw new Error('Can\'t update unexisting movie card');
      }
      try {
        const response = await this.#apiService.updateMovie(update);

        const updatedMovieCard = this.#adaptMovieDataToClient(response);
        this.#movieCards = [
          ...this.#movieCards.slice(0, index),
          updatedMovieCard,
          ...this.#movieCards.slice(index + 1),
        ];

        this._notify(updateType, this.#movieCards[index], isPopupOpened);

      } catch(err) {
        throw new Error('Can\'t update movie card');
      }
    }

    #adaptMovieDataToClient = (movie) => {
      const adaptedMovie = {...movie, ...movie.film_info,
        age: movie.film_info.age_rating,
        originalTitle: movie.film_info.alternative_title,
        genres: movie.film_info.genre,
        releaseDate: new Date(movie.film_info.release.date),
        country: movie.film_info.release.release_country,
        duration: movie.film_info.runtime,
        rating: movie.film_info.total_rating,
        isWatched: movie.user_details.already_watched,
        isFavorite: movie.user_details.favorite,
        isInWatchlist: movie.user_details.watchlist,
        watchingDate: new Date(movie.user_details.watching_date),
      };

      delete adaptedMovie.film_info;
      delete adaptedMovie.age_rating;
      delete adaptedMovie.alternative_title;
      delete adaptedMovie.genre;
      delete adaptedMovie.release.date;
      delete adaptedMovie.release.release_country;
      delete adaptedMovie.runtime;
      delete adaptedMovie.total_rating;
      delete adaptedMovie.user_details.already_watched;
      delete adaptedMovie.user_details.favorite;
      delete adaptedMovie.user_details.watchlist;
      delete adaptedMovie.user_details.watching_date;
      delete adaptedMovie.user_details;
      delete adaptedMovie.release;

      return adaptedMovie;
    }

}
