import { type Page, type Locator } from '@playwright/test';

export class PlayerPage {
  readonly video: Locator;
  constructor(private readonly page: Page) {
    this.video = page.locator('video');
  }
  async goto(titleId = 't1') {
    await this.page.goto('/watch/' + titleId);
  }
  async revealControls() {
    await this.page.mouse.move(150, 120);
  }
  muted() {
    return this.video.evaluate((video: HTMLVideoElement) => video.muted);
  }
  playbackRate() {
    return this.video.evaluate((video: HTMLVideoElement) => video.playbackRate);
  }
  currentTime() {
    return this.video.evaluate((video: HTMLVideoElement) => video.currentTime);
  }
  ready() {
    return this.video.evaluate((video: HTMLVideoElement) =>
      video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && Number.isFinite(video.duration) && video.duration > 0
    );
  }
}
