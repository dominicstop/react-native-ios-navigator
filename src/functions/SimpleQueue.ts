/** Very naive impl. of a async operation queue.
 * * For every call of `schedule`, `dequeue` must be called at the end
 *   to start the next operation in the queue.
 * * As such, the length of the queue is not enough by itself to diff. if
 *   the queue is busy, so as workaround there's a `_isBusy` property.
 * * This can be fixed by changing `schedule` so that it accepts a closure,
 *   and then automatically calling the next item in the queue.
 * * For now though, this impl. should suffice... 😔
 */
export class SimpleQueue {

  private _isBusy = false;
  private queue: Array<{queueKey: number, resolve: Function, reject: Function}> = [];

  // probably should call this a semaphore, but
  // `queueKey` sounds like cutie so 🥰
  private queueKey = 0;

  schedule = (): {queueKey: number, promise: Promise<void>, cancel: Function} => {
    const queueKey = this.queueKey++;

    const promise = new Promise<void>((resolve, reject) => {
      if((this.queue.length === 0) && !this._isBusy){
        this._isBusy = true;
        resolve();

      } else {
        this.queue.push({queueKey, resolve, reject});
      };
    });

    const cancel = () => {
      this.cancel(queueKey);
    };

    return {queueKey, promise, cancel};
  };

  cancel(queueKey: number){
    const queueItem = this.queue.find(item => 
      (item.queueKey === queueKey)
    );

    if(queueItem){
      queueItem.reject();

    } else {
      throw new Error("Invalid queueKey");
    };
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
      queueItem.reject("Queue was cleared before completion.");
    };

    this._isBusy = false;
  };

  isBusy(){
    return this._isBusy || this.queue.length > 0;
  };
};