import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loadingSignal = signal(false);
  private activeRequestCount = 0;

  readonly isLoading = this.loadingSignal.asReadonly();

  incrementRequestCount(): void {
    this.activeRequestCount++;
    if (this.activeRequestCount === 1) {
      this.loadingSignal.set(true);
    }
  }

  decrementRequestCount(): void {
    if (this.activeRequestCount > 0) {
      this.activeRequestCount--;
      if (this.activeRequestCount === 0) {
        this.loadingSignal.set(false);
      }
    }
  }

  show(): void {
    this.loadingSignal.set(true);
  }

  hide(): void {
    this.loadingSignal.set(false);
  }

  reset(): void {
    this.activeRequestCount = 0;
    this.loadingSignal.set(false);
  }
}