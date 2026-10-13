"""Encode captured browser frames, with explicit edited frame durations."""
import json
from pathlib import Path
from PIL import Image

directory = Path('docs/evidence/gifs')
manifest = json.loads((directory / 'recording-manifest.json').read_text())
for clip in manifest['clips']:
    if not clip['frames']:
        continue
    frames = [Image.open(frame['file']).convert('RGB') for frame in clip['frames']]
    # A shared palette avoids colour flicker across frames.
    contact = Image.new('RGB', (250 * min(5, len(frames)), 200))
    for i in range(min(5, len(frames))):
        contact.paste(frames[round(i*(len(frames)-1)/max(1,min(5,len(frames))-1))].resize((250,200)), (i*250,0))
    palette = contact.quantize(colors=256)
    encoded = [frame.quantize(palette=palette, dither=Image.Dither.FLOYDSTEINBERG) for frame in frames]
    dest = directory / (clip['name'] + '.gif')
    encoded[0].save(dest, save_all=True, append_images=encoded[1:], duration=[frame['duration'] for frame in clip['frames']], loop=0, disposal=2, optimize=False)
    with Image.open(dest) as check:
        assert check.n_frames > 1
        duration = 0
        for index in range(check.n_frames):
            check.seek(index)
            duration += check.info.get('duration',0)
        clip['gif'] = {'file':dest.as_posix(), 'bytes':dest.stat().st_size, 'frames':check.n_frames, 'width':check.width, 'height':check.height, 'durationMs':duration}
    print(clip['name'],clip['gif'])
(directory / 'recording-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
