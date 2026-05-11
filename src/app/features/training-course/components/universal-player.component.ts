import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { detectVideoSource, VideoSource } from '../utils/video-provider.util';
import { YouTubePlayerComponent } from './youtube-player.component';
import { VimeoPlayerComponent } from './vimeo-player.component';
import { DrivePlayerComponent } from './drive-player.component';

@Component({
  selector: 'app-universal-player',
  standalone: true,
  imports: [CommonModule, YouTubePlayerComponent, VimeoPlayerComponent, DrivePlayerComponent],
  template: `
    <ng-container *ngIf="videoUrl; else noVideo">
      <ng-container [ngSwitch]="source?.provider">
        <app-youtube-player *ngSwitchCase="'youtube'" [videoId]="source!.id"></app-youtube-player>
        <app-vimeo-player *ngSwitchCase="'vimeo'" [videoId]="source!.id"></app-vimeo-player>
        <app-drive-player *ngSwitchCase="'drive'" [videoId]="source!.id"></app-drive-player>
        <div *ngSwitchDefault class="unsupported-player">
          <p>El video seleccionado no es compatible con este reproductor.</p>
        </div>
      </ng-container>
    </ng-container>

    <ng-template #noVideo>
      <div class="placeholder">
        <p>Esta clase aún no está disponible.</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .unsupported-player,
    .placeholder {
      height: 450px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: #fafafa;
      color: #333;
    }
  `]
})
export class UniversalPlayerComponent {
  @Input() videoUrl: string | null = null;

  get source(): VideoSource | null {
    return this.videoUrl ? detectVideoSource(this.videoUrl) : null;
  }
}
