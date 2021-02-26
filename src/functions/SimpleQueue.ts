export class SimpleQueue {

  private _isBusy = false;
  private queue: Array<{queueKey: number, resolve: Function, reject: Function}> = [];

  private queueKey = 0;

  schedule = (): {queueKey: number, promise: Promise<void>, cancel: Function} => {
    const queueKey = this.queueKey++;

    const promise = new Promise<void>((resolve, reject) => {
      if(this.queue.length == 0 && !this._isBusy){
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
      item.queueKey == queueKey
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
      queueItem.reject("Queue was cleared.");
    };

    this._isBusy = false;
  };

  isBusy(){
    return this._isBusy || this.queue.length > 0;
  };
};