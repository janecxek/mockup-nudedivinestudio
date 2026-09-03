# Nude Divine Studio — co podmienić przed livem

Strona jest kompletna i można ją pokazać klientce w obecnej formie. Poniżej lista danych do potwierdzenia — nigdzie na stronie nie ma widocznych oznaczeń „placeholder", więc podmiany trzeba zrobić z tej listy.

## Dane demonstracyjne użyte w pliku (do potwierdzenia)
| Co | Wartość w pliku | Gdzie |
|---|---|---|
| Adres | Schwetzinger Straße 12, 68775 Ketsch | sekcja Kontakt, stopka modala |
| Godziny | Di–Fr 09:00–18:00, Sa 09:00–14:00, So+Mo zamknięte | sekcja Kontakt |
| WhatsApp | `wa.me/4900000000000` | modal, sekcja Kontakt (2 linki) |
| Telefon | `tel:+4900000000000` | modal (opcja „Anrufen") |
| E-mail | hallo@nudedivine.de | modal, Kontakt, przyciski |
| Anfahrt | „10 Min. ze Schwetzingen, 20 z Mannheim, parkowanie na ulicy" | Kontakt |
| Instagram | @nudedivinestudio, `ig.me/m/nudedivinestudio` | wszędzie — to jest prawdziwe |
| 1.888 obserwujących | sekcja Ergebnisse + Studio | odświeżyć liczbę przed publikacją |

Wszystkie numery telefonu to zera — nie da się na nie zadzwonić, ale też nie wyglądają jak placeholder w tekście (cyfry są tylko w `href`, nie w treści widocznej dla użytkownika).

## Sekcja „Über mich" — do uzupełnienia z klientką
Napisana w pierwszej osobie, bez wymyślonego imienia i bez wymyślonej biografii — opisuje **jak** pracuje, nie kim jest. Do dopisania po rozmowie:
- imię (podpis pod sekcją: obecnie „Nude Divine · Inhaberin"; wstawić imię przed „Inhaberin")
- ewentualne wykształcenie / certyfikaty (mocny sygnał autorytetu w DE — np. Kosmetikerin-Ausbildung, szkolenia z lymfodrenażu, certyfikat urządzenia Aquafacial)
- 1–2 zdania osobistego „dlaczego" — to jest najmocniejszy element w tej sekcji, ale musi być prawdziwe
- **zdjęcie portretowe** — najważniejsza fotografia na całej stronie

## Zdjęcia (13 miejsc)
Wszystkie sloty to `<div class="ph ...">`. Podmiana:
```html
<img src="fotos/aquafacial.webp" alt="Aquafacial-Behandlung im Studio" loading="lazy" width="1200" height="1600">
```
Potrzebne: portret właścicielki (pion), gabinet, 6 zabiegów, kącik z ubraniami, 2–3 przed/po, mapa lub zdjęcie wejścia.

## Opinie — świadomie na razie usunięte
Sekcji z cytatami nie ma, bo nie wolno wstawiać wymyślonych recenzji. Jej miejsce jest **między „Über mich" a „Boutique"**. Gdy klientka przyśle 3 prawdziwe opinie (Google lub screeny z IG), wstawiamy blok trzech cytatów z imieniem i nazwą zabiegu — kod jest gotowy do wklejenia.

Zanim to nastąpi, warto założyć/uzupełnić **Google Business Profile** dla 68775 Ketsch i zbierać tam opinie — bez tego lokalne SEO w Rhein-Neckar praktycznie nie ruszy.

## Licznik obserwujących na Instagramie
Liczba w sekcji „Ergebnisse" nie jest już wpisana na sztywno — strona czyta ją z `followers.json` leżącego obok pliku HTML (raz dziennie, dzięki parametrowi z datą w URL-u; jeśli plik jest niedostępny albo strona otwarta z dysku, zostaje wartość zapasowa 1888). Formatowanie idzie za językiem: `1.888` w DE, `1,888` w EN.

Codzienną aktualizację robi `update-followers.mjs`. Wymaga:
1. konta IG przełączonego na **Business** lub **Creator** i połączonego ze stroną na Facebooku,
2. aplikacji w developers.facebook.com z produktem Instagram Graph API,
3. long-lived page access tokena (60 dni, odnawialny),
4. `IG_USER_ID` — do wyciągnięcia przez `/me/accounts` → `/<PAGE_ID>?fields=instagram_business_account`.

Uruchamianie: `IG_USER_ID=... IG_TOKEN=... node update-followers.mjs`, albo gotowy `.github/workflows/followers.yml` (codziennie 04:17 UTC, commituje zmieniony JSON). Skrypt odrzuca odpowiedź, jeśli liczba skoczyła o więcej niż 40% — to zwykle błąd API, nie wzrost.

Bez konta Business nie ma legalnej drogi do tej liczby. Wtedy albo pilnujemy jej ręcznie raz na kwartał, albo wyrzucamy liczbę i zostawiamy sam przycisk „Auf Instagram ansehen".

## Do dorobienia technicznie
- Impressum + Datenschutz (obowiązkowe w DE, §5 DDG — bez tego realne ryzyko Abmahnung)
- Schema.org `BeautySalon` + `openingHoursSpecification` + `geo`
- Mapa Google w slocie w sekcji Kontakt (wtedy też cookie banner)
- OG image + favicon
- Cennik lub widełki — obecnie wszędzie „Preis auf Anfrage"; niemieccy klienci częściej pytają o cenę niż rezerwują na ślepo, warto dodać choćby „ab X €"
