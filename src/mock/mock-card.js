import dayjs from 'dayjs';
import {getRandomInteger} from '../utils/utils.js';
import {getRandomArrayFromArray} from '../utils/utils.js';
import {nanoid} from 'nanoid';

const POSTERS = ['made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
];

const TITLES = ['The Great Flamarion',
  'THe Dance of Life',
  'Sagebrush Trail',
  'The Man with the Golden Arm',
  'Santa Claus Conquers the Martians',
  'Popeye the Sailor Meets Sindbad the Sailor',
];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' ,
  'Cras aliquet varius magna, non porta ligula feugiat eget. ',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

const GENRES = [
  'Action',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Thriller',
  'Western',
];

const DIRECTORS = [
  'Alfred Hitchcock',
  'Stanley Kubrick',
  'Martin Scorsese',
  'Akira Kurosawa',
  'Steven Spielberg',
  'Francis Ford Coppola',
  'Quentin Tarantino',
  'The Coen Brothers',
];

const WRITERS = [
  'Ingmar Bergman',
  'Woody Allen',
  'Billy Wilder',
  'Jean Luc-Godard',
  'Charlie Kaufman',
  'Satyajit Ray',
  'Stanley Kubrick',
  'Quentin Tarantino',
];

const ACTORS = [
  'Katharine Hepburn',
  'Jack Nicholson',
  'Laurence Olivier',
  'Meryl Streep',
  'Humphrey Bogart',
  'Audrey Hepburn',
  'Robert De Niro',
  'Bette Davis',
  'Cary Grant',
  'Marlon Brando',
];

const COUNTRIES = [
  'USA',
  'UK',
  'Germany',
  'Canada',
  'France',
  'Russia',
  'Japan',
];

const AGE = [
  '18',
  '16',
  '12',
  '6',
  '0',
];

const EMOJIS = [
  'smile', 'sleeping', 'puke', 'angry',
];

const COMMENTS_AUTORS = [
  'Tommy',
  'Stella',
  'Tessa',
  'Rob',
  'Luis',
];

const createMovieDuration = () => {
  const durationFull = getRandomInteger(1, 300);
  const hours = Math.trunc(durationFull / 60);
  const minutes = durationFull - hours * 60;
  if (hours === 0) {
    return `${minutes}m`;
  }
  else if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}m`;
};

const generateDate = () => {
  const maxYearGap = 100;
  const gap = getRandomInteger(-maxYearGap, 0);
  return dayjs().add(gap, 'year').toDate();
};
const generateGenres = () => getRandomArrayFromArray(GENRES, getRandomInteger(1, 5));
const generateActors = () => getRandomArrayFromArray(ACTORS, getRandomInteger(1, 5)).join(', ');
const generateWriters = () => getRandomArrayFromArray(WRITERS, getRandomInteger(1, 3)).join(', ');
const createMovieDescription = () => getRandomArrayFromArray(DESCRIPTIONS, getRandomInteger(1, 5)).join(' ');

export const generateMovieCard = () => {

  const title = TITLES[getRandomInteger(0, TITLES.length -1)];

  return {
    id: nanoid(),
    title,
    originalTitle: `Original: ${title}`,
    poster: POSTERS[getRandomInteger(0, POSTERS.length -1)],
    description: createMovieDescription(),
    releaseDate: generateDate(),
    duration: createMovieDuration(),
    genres: generateGenres(),
    rating: getRandomInteger(1, 10),
    comments: getRandomInteger(0, 5),
    isWatched: Boolean(getRandomInteger(0,1)),
    isFavorite: Boolean(getRandomInteger(0,1)),
    isInWatchlist: Boolean(getRandomInteger(0,1)),
    director: DIRECTORS[getRandomInteger(0,DIRECTORS.length -1)],
    writers: generateWriters(),
    actors: generateActors(),
    country: COUNTRIES[getRandomInteger(0, COUNTRIES.length -1)],
    age: AGE[getRandomInteger(0, AGE.length -1)],
  };
};

export const generateComments = () => {

  const commentDate = dayjs().add(-getRandomInteger(0,10), 'day').toDate();
  return {
    id: nanoid(),
    text: DESCRIPTIONS[getRandomInteger(0, DESCRIPTIONS.length -1)],
    emoji: EMOJIS[getRandomInteger(0, EMOJIS.length -1)],
    autor: COMMENTS_AUTORS[getRandomInteger(0, COMMENTS_AUTORS.length -1)],
    commentDate,
  };
};
