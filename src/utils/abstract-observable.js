export default class AbstractObservable {
    #observers = new Set();
    #shakeObservers = new Set();

    addObserver(observer) {
      this.#observers.add(observer);
    }

    addObserverShake(observer) {
      this.#shakeObservers.add(observer);
    }

    removeObserver(observer) {
      this.#observers.delete(observer);
    }

    _notify(event, payload, checkPopup) {
      this.#observers.forEach((observer) => observer(event, payload, checkPopup));
    }

    _notifyShake(event, payload, checkPopup) {
      this.#shakeObservers.forEach((observer) => observer(event, payload, checkPopup));
    }
}
