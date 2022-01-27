export const findFilter = (name, filters) => filters.find((element) => element.name === name);

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export function getRandomArrayFromArray (array, num) {

  if (num >= array.length) {
    return array;
  }
  const resultsArr = [];
  for (let ind = 0; ind < num; ind++ ) {
    const someElement = array[getRandomInteger(0, array.length - 1)];
    if (!resultsArr.includes(someElement)) {
      resultsArr.push(someElement);
    }
    else {
      ind--;
      if (resultsArr.length === array.length || array.length === num) {
        break;
      }
    }
  }
  return resultsArr;
}

export const sortFilmsByRating = (cardA, cardB) => cardB.rating - cardA.rating;
export const sortFilmsByDate = (cardA, cardB) => cardB.releaseDate - cardA.releaseDate;

export const sortFilmsByCommentsNumber = (cardA, cardB) => cardB.comments.length - cardA.comments.length;

export const createMovieDuration = (durationFull, isOnlyHours, isOnlyMinutes) => {
  const hours = Math.trunc(durationFull / 60);
  const minutes = durationFull - hours * 60;
  if (hours === 0 || isOnlyMinutes) {
    return `${minutes}m`;
  }
  else if (minutes === 0 || isOnlyHours) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}m`;
};
