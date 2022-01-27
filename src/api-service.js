const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class ApiService {
    #baseUrl = null;
    #authorization = null;

    constructor(baseUrl, authorization) {
      this.#baseUrl = baseUrl;
      this.#authorization = authorization;
    }

    #load = async ({
      endPoint,
      method = Method.GET,
      body = null,
      headers = new Headers(),
    }) => {
      headers.append('Authorization', this.#authorization);
      const response = await fetch(
        `${this.#baseUrl}/${endPoint}`,
        {method, body, headers},
      );

      try {
        ApiService.checkStatus(response);
        return response;
      } catch (err) {
        ApiService.catchError(err);
      }
    }

    static checkStatus = (response) => {
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
    }

    static catchError = (err) => {
      throw err;
    }

    static parseResponse = (response) => response.json();


    get movies() {
      return this.#load({endPoint: 'movies'})
        .then(ApiService.parseResponse);
    }

    getMovieComments = (movieId) => (this.#load({endPoint: `/comments/${movieId}`})
      .then(ApiService.parseResponse))

    updateMovie = async (movieCard) => {
      const response = await this.#load({
        endPoint: `movies/${movieCard.id}`,
        method: Method.PUT,
        body: JSON.stringify(this.#adaptMovieDataToServer(movieCard)),
        headers: new Headers({'Content-Type': 'application/json'}),
      });

      const parsedResponse = await ApiService.parseResponse(response);

      return parsedResponse;
    }

    addComment = async (movieCard, comment) => {
      const response = await this.#load({
        endPoint: `comments/${movieCard.id}`,
        method: Method.POST,
        body: JSON.stringify(this.#adaptCommentDataToServer(comment)),
        headers: new Headers({'Content-Type': 'application/json'})
      });

      const parsedResponse = await ApiService.parseResponse(response);

      return parsedResponse;
    }

    deleteComment = async (comment) => {
      const response = await this.#load({
        endPoint:  `comments/${comment.id}`,
        method: Method.DELETE,
      });
      return response;
    }

    #adaptMovieDataToServer = (movie) => {
      const adaptedMovie = {
        ...movie,
        'film_info': {
          description: movie.description,
          actors: movie.actors,
          director: movie.director,
          poster: movie.poster,
          title: movie.title,
          writers: movie.writers,
          'age_rating': movie.age,
          'alternative_title': movie.originalTitle,
          genre: movie.genres,
          release: {
            date: movie.releaseDate.toISOString(),
            'release_country': movie.country,
          },
          runtime: movie.duration,
          'total_rating': movie.rating,
        },
        'user_details': {
          'already_watched': movie.isWatched,
          favorite: movie.isFavorite,
          watchlist: movie.isInWatchlist,
          'watching_date': movie.watchingDate.toISOString(),
        },
      };

      delete adaptedMovie.age;
      delete adaptedMovie.originalTitle;
      delete adaptedMovie.genres;
      delete adaptedMovie.releaseDate;
      delete adaptedMovie.country;
      delete adaptedMovie.duration;
      delete adaptedMovie.rating;
      delete adaptedMovie.isWatched;
      delete adaptedMovie.isFavorite;
      delete adaptedMovie.isInWatchlist;
      delete adaptedMovie.description;
      delete adaptedMovie.actors;
      delete adaptedMovie.director;
      delete adaptedMovie.poster;
      delete adaptedMovie.title;
      delete adaptedMovie.writers;
      delete adaptedMovie.watchingDate;

      return adaptedMovie;
    }

    #adaptCommentDataToServer = (comment) => {
      const adaptedComment = {...comment,
        emotion: comment.emoji,
        comment: comment.text,
        date: comment.commentDate.toISOString(),
      };

      delete adaptedComment.emoji;
      delete adaptedComment.text;
      delete adaptedComment.commentDate;

      return adaptedComment;
    }
}
