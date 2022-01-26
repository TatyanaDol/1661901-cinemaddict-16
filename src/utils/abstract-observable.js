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

    removeShakeObserver(observer) {
      this.#shakeObservers.delete(observer);
    }

    _notify(event, payload, checkPopup) {
      this.#observers.forEach((observer) => observer(event, payload, checkPopup));
    }

    _notifyShake(payload, commentId) {
      this.#shakeObservers.forEach((observer) => observer(payload, commentId));
    }
}
