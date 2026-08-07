# Fontovi — self-hosted (Fraunces + Inter)

**Status: FAJLOVI NEDOSTAJU.** U ovom folderu trenutno nema nijednog `.woff2`.
Dok se ne ubace, sajt na desktopu renderuje rezervnim fontovima
(Times New Roman / system-ui) umesto Fraunces i Inter.

`@font-face` pravila već stoje na vrhu `css/style.css` (sekcija 0) i čekaju
tačno šest fajlova, sa imenima iz tabele niže. CSS ne treba dirati.

---

## Šta je original zaista učitavao

Pre GDPR izmene, u `<head>` svake stranice stajalo je:

```
https://fonts.googleapis.com/css2
  ?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,600
  &family=Inter:wght@400;500
  &display=swap
```

Iz toga sledi tačna specifikacija:

| Font     | Rez     | Težine  | Ose                  |
|----------|---------|---------|----------------------|
| Fraunces | uspravni| 500, 600| `opsz` 9–144, `wght` |
| Fraunces | kurziv  | 600     | `opsz` 9–144, `wght` |
| Inter    | uspravni| 400, 500| `wght`               |

### Zašto je varijabilni fajl obavezan

`opsz` (optical size) je ključan. Fraunces menja crtež slova u zavisnosti od
veličine — na `--fs-display` (do 7rem / 112px) serifi su tanji i kontrast veći
nego u tekstu od 16px. Original je učitavao **varijabilni** fajl sa `opsz` osom
9–144, pa je browser to radio automatski (`font-optical-sizing: auto` je
podrazumevano).

**Statička instanca Fraunces-a neće izgledati isto** — hero naslov će delovati
zdepasto i tamnije. Zato NE koristi google-webfonts-helper za Fraunces; on
servira statičke instance.

---

## Potrebni fajlovi

| Naziv fajla                       | Sadržaj                                   |
|-----------------------------------|-------------------------------------------|
| `fraunces-latin.woff2`            | Fraunces VF, uspravni, subset `latin`     |
| `fraunces-latin-ext.woff2`        | Fraunces VF, uspravni, subset `latin-ext` |
| `fraunces-italic-latin.woff2`     | Fraunces VF, kurziv, subset `latin`       |
| `fraunces-italic-latin-ext.woff2` | Fraunces VF, kurziv, subset `latin-ext`   |
| `inter-latin.woff2`               | Inter VF, uspravni, subset `latin`        |
| `inter-latin-ext.woff2`           | Inter VF, uspravni, subset `latin-ext`    |

`latin-ext` je obavezan — bez njega nema **č, ć, š, ž, đ**, pa srpska verzija
pada na rezervni font usred rečenice.

---

## Kako doći do tačno tih fajlova

### Način A — direktno od Googla (najvernije originalu)

Ovako dobijaš bajt-identične fajlove onima koje je sajt ranije učitavao.

1. Otvori taj `css2` URL odozgo u Chrome-u (samo zalepi u adresnu liniju).
2. Chrome dobija woff2 varijantu. U odgovoru vidiš blokove `@font-face`,
   svaki sa svojim `unicode-range` i `src: url(https://fonts.gstatic.com/...)`.
3. Nađi blokove čiji `unicode-range` počinje sa:
   - `U+0100-024F, ...` → to je **latin-ext**
   - `U+0000-00FF, ...` → to je **latin**
4. Skini te `.woff2` fajlove i preimenuj ih po tabeli.
5. Ostale subsetove (grčki, ćirilica, vijetnamski) preskoči — CSS ih ne traži.

### Način B — Fontsource (jednostavnije, isti varijabilni fajlovi)

```
npm pack @fontsource-variable/fraunces
npm pack @fontsource-variable/inter
```

Raspakuj i uzmi fajlove iz `files/` — `*-latin-wght-normal.woff2`,
`*-latin-ext-wght-normal.woff2` i italic ekvivalente za Fraunces.

Obe biblioteke su pod SIL Open Font License 1.1. Self-hosting je dozvoljen;
ostavi `OFL.txt` u ovom folderu.

---

## Posle ubacivanja

1. Podigni `?v=` u `css/style.css?v=...` na svih 16 stranica (keš).
2. DevTools → Network → filter `Font`: svi zahtevi moraju ići na `byanicic.com`.
   Ako se pojavi `fonts.gstatic.com`, negde je ostao stari `<link>`.
3. Uporedi hero naslov sa live verzijom — ako deluje teže ili uže,
   uzeta je statička umesto varijabilne instance Fraunces-a.

## Napomena o mobilnom prikazu

Na ekranima ≤768px `css/style.css` namerno prebacuje `--f-display` na Georgia i
`--f-body` na system-ui (sekcija „MOBILE PERFORMANCE — SYSTEM FONT STACK").
To je originalno ponašanje sajta i nije menjano. Pošto se Fraunces i Inter tamo
ne koriste, browser ih na telefonu i ne preuzima.
