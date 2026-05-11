import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-drive-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="video-container">
      <iframe
        [src]="videoUrl"
        frameborder="0"
        allow="autoplay; fullscreen"
        style="width: 100%; height: 450px;"
      ></iframe>
    </div>
  `,
  styles: [`
    .video-container {
      position: relative;
      padding-bottom: 56.25%; /* 16:9 aspect ratio */
      height: 0;
      overflow: hidden;
    }
    .video-container iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  `]
})
export class DrivePlayerComponent {
  @Input() videoId!: string;

  constructor(private sanitizer: DomSanitizer) {}

  get videoUrl(): SafeResourceUrl {
    const url = `https://drive.google.com/file/d/${this.videoId}/preview`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}