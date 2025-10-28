import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  totalExams = 7;
  completedExams = 4;
  pendingExams = 3;
  averageScore = 85;

  // Animated signals
  totalExamsCount = signal(0);
  completedExamsCount = signal(0);
  pendingExamsCount = signal(0);
  averageScoreCount = signal(0);

  ngOnInit(): void {
    // Animate counts smoothly when dashboard loads
    this.animateCount(this.totalExamsCount, this.totalExams, 1000);
    this.animateCount(this.completedExamsCount, this.completedExams, 1000);
    this.animateCount(this.pendingExamsCount, this.pendingExams, 1000);
    this.animateCount(this.averageScoreCount, this.averageScore, 1200);
  }

  private animateCount(signalVar: any, endValue: number, duration: number) {
    const startTime = performance.now();
    const startValue = 0;

    const update = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = Math.floor(startValue + (endValue - startValue) * progress);

      signalVar.set(currentValue);

      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }
}
