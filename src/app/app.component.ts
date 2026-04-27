import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnalyticsService } from './core/services/analytics.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
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
