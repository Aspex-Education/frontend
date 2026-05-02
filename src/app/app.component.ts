import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnalyticsService } from './core/services/analytics.service';
import { FeedbackButtonComponent } from './shared/components/feedback-button/feedback-button.component';


@Component({
    selector: 'app-root',
    imports: [RouterOutlet, FeedbackButtonComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'aspex-frontend';

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.analyticsService.initialize();
  }
}
