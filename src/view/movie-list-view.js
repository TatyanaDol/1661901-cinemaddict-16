import AbstractView from './abstract-view.js';

const createMovieListTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container">
      </div>

    </section>
  </section>`
);

export default class MovieListView extends AbstractView {
  get template() {
    return createMovieListTemplate();
  }

}
