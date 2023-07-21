'use strict'

const opened = 'open';
const closed = 'close';

export class Dispenser {
  constructor(flow_volume) {
    this.flow_volume = flow_volume;
    this.status = closed;
    this.usages = [];
  }

  open(updated_at) {
    if (this.status === opened) {
      throw new Error("wrong status")
    }
    this.status = opened;
    this.usages.push({
      opened_at: updated_at,
      closed_at: null,
      flow_volume: this.flow_volume,
    })
  }

  close(updated_at) {
    if (this.status === closed) {
      throw new Error("wrong status")
    }
    this.status = closed;
    const usage = this.usages.pop();
    usage.closed_at = updated_at;
    this.usages.push(usage);
  }

  setStatus(status, updated_at) {
    switch (status) {
      case opened: this.open(updated_at); break;
      case closed: this.close(updated_at); break;
      default: throw new Error("wrong status");
    }
  }

  info(price) {
    let amount = 0;
    this.usages.forEach(usage => {
      const startTime = new Date(usage.opened_at).getTime();
      const endTime = usage.closed_at ? new Date(usage.closed_at).getTime() : Date.now();
      const secondsDrain = (endTime - startTime) / 1000;
      usage.total_spent = Math.round(usage.flow_volume * secondsDrain / price * 1000) / 1000;
      amount += usage.total_spent;
    });
    return { amount: Math.round(amount * 100) / 100, usages: this.usages };
  }
}
