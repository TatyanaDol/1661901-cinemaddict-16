import UserRankView from './view/user-rank-view.js';
import SortView from './view/sort-view.js';
import MovieListView from './view/movie-list-view.js';
import MovieCardView from './view/movie-card-view.js';
import ShowMoreButtonView from './view/show-button-view.js';
import MovieCountView from './view/movies-count-view.js';
import PopupView from './view/popup-view';
import {generateMovieCard, generateComments} from './mock/mock-card.js';
import {generateFilter} from './mock/filter-mock.js';
import {SetPosition, render, remove} from './utils/render.js';
import MenuStatisticFilterView from './view/menu-statistic-and-filter-view.js';
import EmptyMovieListView from './view/movie-list-empty-view.js';
import {findActiveFilterName} from './view/movie-list-empty-view.js';
import {findFilter} from './utils/utils.js';

const CARD_COUNT = 22;
const CARD_COUNT_PER_STEP = 5;

const movieCards = Array.from({length: CARD_COUNT}, generateMovieCard);
const cardsComments = CARD_COUNT ? Array.from({length: movieCards[0].comments}, generateComments) : [];
const filters = generateFilter(movieCards);

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');


render(headerElement, new UserRankView(filters), SetPosition.BEFOREEND);

const statAndFiltersComponent = new MenuStatisticFilterView(filters);

render(mainElement, statAndFiltersComponent, SetPosition.BEFOREEND);

const renderCard = (filmsListElement, card, comments) => {
  const movieCardComponent = new MovieCardView(card);
  const movieCardPopupComponent = new PopupView(card, comments);
  const bodyElement = document.querySelector('body');

  const showCardPopup = () => {
    bodyElement.classList.add('hide-overflow');
    render(footerElement, movieCardPopupComponent, SetPosition.AFTEREND);
  };

  const closeCardPopup = () => {
    bodyElement.classList.remove('hide-overflow');
    movieCardPopupComponent.element.remove();
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      closeCardPopup();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  movieCardComponent.setCardClickHandler(() => {
    showCardPopup();
    document.addEventListener('keydown', onEscKeyDown);
  });

  movieCardPopupComponent.setCloseButtonClickHandler(() => {
    closeCardPopup();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(filmsListElement, movieCardComponent, SetPosition.BEFOREEND);

};

const renderList = (container, cards, comments, cardsFilters) => {

  const  activeFilterElement = statAndFiltersComponent.element.querySelector('.main-navigation__item--active');
  const activeFilterCount = findFilter(findActiveFilterName(activeFilterElement).toLowerCase(), cardsFilters).count;

  if (!activeFilterCount) {
    render(container, new EmptyMovieListView(activeFilterElement), SetPosition.BEFOREEND);
  } else {

    render(container, new SortView(), SetPosition.BEFOREEND);

    const movieListComponent = new MovieListView();
    render(container, movieListComponent, SetPosition.BEFOREEND);

    const filmsList = movieListComponent.element.querySelector('.films-list');
    const filmsListContainer = movieListComponent.element.querySelector('.films-list__container');

    for (let i = 0; i < Math.min(movieCards.length, CARD_COUNT_PER_STEP); i++) {
      renderCard(filmsListContainer, cards[i], comments);
    }

    if (cards.length > CARD_COUNT_PER_STEP) {
      let renderedCardsCount = CARD_COUNT_PER_STEP;

      const showMoreButtonComponent = new ShowMoreButtonView();

      render(filmsList, showMoreButtonComponent, SetPosition.BEFOREEND);

      showMoreButtonComponent.element.addEventListener('click', (evt) => {
        evt.preventDefault();
        cards
          .slice(renderedCardsCount, renderedCardsCount + CARD_COUNT_PER_STEP)
          .forEach((card) => renderCard(filmsListContainer, card, comments));

        renderedCardsCount += CARD_COUNT_PER_STEP;

        if (renderedCardsCount >= cards.length) {
          remove(showMoreButtonComponent);
        }
      });
    }
  }
};

renderList(mainElement, movieCards, cardsComments, filters);

const footerStatisticsElement = footerElement.querySelector('.footer__statistics');
render(footerStatisticsElement, new MovieCountView(movieCards), SetPosition.BEFOREEND);
