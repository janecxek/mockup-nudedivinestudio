# Wideo do hero — prompty dla Gemini / Veo

Hero jest teraz **pełnoekranowym tłem**, tekst leży na wideo. Dlatego potrzebne są **dwa rendery**:

| Plik | Format | Gdzie leci | Kompozycja |
|---|---|---|---|
| `fotos/hero-16x9.mp4` | **16:9**, 8 s | ekrany ≥960 px | akcja w **prawej połowie**, lewe 40% kadru puste |
| `fotos/hero-9x16.mp4` | **9:16**, 8 s | telefony | akcja w **dolnych 2/3**, górna 1/3 pusta |

Strona sama wybiera plik przez `matchMedia` przy załadowaniu. Welon (gradient w kolorze piasku) jest na desktopie poziomy — gęsty po lewej pod tekstem, przejaśniony po prawej — a na mobile pionowy. Stąd te wymagania kompozycyjne: tam, gdzie siedzi typografia, w kadrze ma być pustka.

---

## 16:9 — desktop

### Wariant C — puste studio (rekomendowany do publikacji)

```
A slow, static, locked-off cinematic wide shot of an empty beauty treatment room in
soft late-afternoon daylight. The composition is deliberately asymmetric: the left
40 percent of the frame is an empty, evenly lit plaster wall with nothing in it, while
all the subject matter sits in the right half — a linen-covered treatment bed seen at
an angle, a single dried branch in a pale ceramic vase, two folded cream towels, a
small stack of amber glass bottles. Warm sand, beige, oat and clay palette; absolutely
no cool blue, no grey, no clinical white. Light enters from a large window out of frame
on the right, diffused, and a soft shadow drifts almost imperceptibly across the wall
while fine dust motes float through the beam. Shallow depth of field, 35mm look, gentle
film grain. One single continuous take, no cuts, no camera movement beyond a barely
perceptible drift. Quiet, calm, unhurried, expensive-looking. The scene ends where it
began so the clip loops seamlessly.
```

### Wariant A — dłonie przy masażu limfatycznym

Najbardziej „na markę", ale modele psują palce — obejrzyj każdą klatkę.

```
A cinematic wide macro shot, static locked-off camera, of a woman's hands with short
bare natural nails performing a very slow facial lymphatic drainage massage: fingertips
gliding upward along a cheekbone toward the temple. The hands and a sliver of cheek
occupy the right half of the frame; the left 40 percent is empty, softly lit, out-of-focus
warm background. The face is turned away and cropped out of shot — no eyes, no
recognisable features. Warm sand, beige and soft clay tones throughout; no cool blue,
no grey, no clinical white. Soft diffused north-window daylight from the right, gentle
falloff, no hard shadows, no glare. Extremely slow continuous movement, one single take,
no cuts, no zoom. Shallow depth of field, 85mm look, barely visible film grain. Calm,
quiet, spa-like. The hands return to their starting position at the end so the clip
loops seamlessly.
```

### Wariant B — woda (pod Aquafacial)

```
A cinematic macro shot, static camera, of clear water running in a thin slow stream
over a smooth curved surface, backlit so the droplets glow warm amber and honey. The
water and highlights sit in the right half of the frame; the left 40 percent is empty
warm bokeh with nothing in focus. Out-of-focus warm sand and beige background; no cool
blue, no grey, no clinical white. Light refracts gently through the water; droplets
form, hold, and slide away in slow motion. One single continuous take, no cuts, no
camera movement. Shallow depth of field, macro lens look, subtle film grain.
Meditative, clean, luxurious. Loops seamlessly.
```

---

## 9:16 — telefon

Ten sam motyw co wybrany wyżej, przekomponowany w pion. Wersja dla wariantu C:

```
A slow, static, locked-off cinematic vertical shot of an empty beauty treatment room in
soft late-afternoon daylight. The upper third of the frame is an empty, evenly lit
plaster wall with nothing in it; all the subject matter sits in the lower two thirds —
a linen-covered treatment bed, a single dried branch in a pale ceramic vase, two folded
cream towels, a small stack of amber glass bottles. Warm sand, beige, oat and clay
palette; absolutely no cool blue, no grey, no clinical white. Diffused light from a
window out of frame on the left, with a soft shadow drifting almost imperceptibly and
fine dust motes floating through the beam. Shallow depth of field, 50mm look, gentle
film grain. One single continuous take, no cuts, no camera movement beyond a barely
perceptible drift. Quiet, calm, unhurried, expensive-looking. Loops seamlessly.
```

---

## Negative prompt (do wszystkich)

```
text, captions, subtitles, watermark, logo, brand names, human face, eyes, teeth,
extra fingers, deformed hands, rings, bracelets, nail polish, gloves, medical
equipment, syringes, fast motion, cuts, transitions, zoom, whip pan, flicker,
strobing, oversaturation, neon colours, blue tint, grey tint, cold clinical lighting,
stock-footage look, people talking, crowd
```

## Ustawienia

- Długość **8 s**, bez dźwięku — strona odtwarza `muted`, ścieżka audio to same megabajty
- Renderuj oba formaty osobno. Nie przycinaj 16:9 do pionu: zostaje z tego 32% kadru i kompozycja, której model nie planował

---

## Obróbka

Cel: **każdy plik poniżej 2 MB**. Wideo w hero ładuje się przed pierwszym kliknięciem, więc waga idzie prosto w LCP.

```bash
# desktop
ffmpeg -i veo-16x9.mp4 -an -vf "scale=1280:-2,fps=24" \
  -c:v libx264 -profile:v main -crf 30 -preset slow -movflags +faststart \
  fotos/hero-16x9.mp4

# telefon
ffmpeg -i veo-9x16.mp4 -an -vf "scale=720:-2,fps=24" \
  -c:v libx264 -profile:v main -crf 30 -preset slow -movflags +faststart \
  fotos/hero-9x16.mp4

# poster — pierwsza klatka wersji desktopowej
ffmpeg -i fotos/hero-16x9.mp4 -vf "select=eq(n\,0)" -q:v 3 fotos/hero.jpg
```

## Wstawienie

Nic nie trzeba edytować. W `A-haut.html` czeka gotowy element:

```html
<video class="media" data-hero muted loop playsinline autoplay preload="none"
       poster="fotos/hero.jpg"
       data-src-desktop="fotos/hero-16x9.mp4"
       data-src-mobile="fotos/hero-9x16.mp4"></video>
```

Wystarczy wrzucić trzy pliki do `fotos/`. Skrypt sam wybiera źródło po szerokości okna, a jeśli plik nie istnieje albo autoplay jest zablokowany, element znika i zostaje gradientowe tło — strona nigdy nie pokazuje czarnej dziury.

---

## Jedna uwaga

Wariant A pokazuje zabieg, którego w tym studiu nikt nie wykonał. Na makietę bez znaczenia,
ale przed publikacją albo prawdziwe nagranie od klientki, albo zostajemy przy pustym
gabinecie — ten niczego nie twierdzi. Osiem sekund z telefonu w dobrym świetle bije
każdy render.
