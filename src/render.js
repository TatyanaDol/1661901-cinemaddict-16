export const SetPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

export const render = (container, element, place) => {
  switch (place) {
    case SetPosition.BEFOREBEGIN:
      container.before(element);
      break;
    case SetPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case SetPosition.BEFOREEND:
      container.append(element);
      break;
    case SetPosition.AFTEREND:
      container.after(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};
