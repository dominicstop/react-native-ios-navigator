// TODO: Add `cancel` method, create `queueKey`, cancel via `queueKey`
// * schedule will return a tuple: `queueKey` and promise object
// * this.queue: [{queueKey, resolve, reject}]
export class SimpleQueue {

  private _isBusy = false;
  private queue: Array<{resolve: Function, reject: Function}> = [];

  schedule = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if(this.queue.length == 0 && !this._isBusy){
        this._isBusy = true;
        resolve();

      } else {
        this.queue.push({resolve, reject});
      };
    });
  };

  dequeue(){
    const queueItem = this.queue.shift();

    if(queueItem){
      queueItem.resolve();

    } else {
      // reached last item
      this._isBusy = false;
    };
  };

  clear(){
    while (this.queue.length > 0) {
      const queueItem = this.queue.pop();
      queueItem.reject("Queue was cleared.");
    };

    this._isBusy = false;
  };

  isBusy(){
    return this._isBusy || this.queue.length > 0;
  };
};