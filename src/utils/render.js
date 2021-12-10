import AbstractView from '../view/abstract-view.js';

export const SetPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

export const render = (container, element, place) => {

  const parent = container instanceof AbstractView ? container.element : container;
  const child = element instanceof AbstractView ? element.element : element;

  switch (place) {
    case SetPosition.BEFOREBEGIN:
      parent.before(child);
      break;
    case SetPosition.AFTERBEGIN:
      parent.prepend(child);
      break;
    case SetPosition.BEFOREEND:
      parent.append(child);
      break;
    case SetPosition.AFTEREND:
      parent.after(child);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof AbstractView)) {
    throw new Error('Function "remove" can remove only components');
  }

  component.element.remove();
  component.removeElement();
};
