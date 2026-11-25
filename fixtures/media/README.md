# Synthetic HLS clip

`clip.m3u8` and `clip-0.mpegts` are an 18-second silent test pattern generated locally with FFmpeg. The test serves them through Playwright routing at the app's configured HLS URL.

```bash
ffmpeg -f lavfi -i 'testsrc2=size=160x90:rate=12' -t 18 -an \
  -c:v libx264 -profile:v baseline -pix_fmt yuv420p -crf 32 -g 24 \
  -f hls -hls_time 18 -hls_playlist_type vod \
  -hls_segment_filename 'clip-%d.mpegts' clip.m3u8
```
