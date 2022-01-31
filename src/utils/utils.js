export const findFilter = (name, filters) => filters.find((element) => element.name === name);

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
