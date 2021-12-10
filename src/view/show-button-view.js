import AbstractView from './abstract-view.js';

const createShowButtonTemplate = () => (
  `<button class="films-list__show-more">
  Show more
</button>`
);

export default class ShowMoreButtonView extends AbstractView {
  get template() {
    return createShowButtonTemplate();
  }
}
