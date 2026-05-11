import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-youtube-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="video-container">
      <iframe
        [src]="videoUrl"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  `,
  styles: [`
    .video-container {
      position: relative;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;
    }
    .video-container iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
  `]
})
export class YouTubePlayerComponent {
  @Input() videoId!: string;

  constructor(private sanitizer: DomSanitizer) {}

  get videoUrl(): SafeResourceUrl {
    const url = `https://www.youtube.com/embed/${this.videoId}?modestbranding=1&rel=0&showinfo=0`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
