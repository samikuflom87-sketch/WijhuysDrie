# Wijnhuys Drie — nieuwe webshop

Custom WordPress/WooCommerce-thema en -plugin voor Wijnhuys Drie. Dit wordt gebouwd
**los van** de huidige, actief werkende webshop op `wijnhuysdrie.nl` — die blijft
onaangeroerd tot alles hier getest en goedgekeurd is.

## De route

```
Deze repo (thema + plugin, code)
        ↓
Lokale WordPress op jouw laptop
→ hier draai je het echt, klik je erin rond, test je
        ↓
Staging-omgeving
→ klant bekijkt en test mee
        ↓
STRATO WordPress E-Commerce-pakket (WooCommerce voorgeïnstalleerd)
→ definitieve hosting
        ↓
wijnhuysdrie.nl
→ live
```

Deze repo bevat **geen** volledige WordPress-installatie — alleen de map die je
in elke WordPress-site's `wp-content/` map plakt. WordPress-core zelf hoort niet
in git; dat levert je lokale tool of de hosting.

## Waarom niet alles hier gebouwd is

Deze ontwikkelomgeving (waar Claude Code hier draait) heeft geen toegang tot
wordpress.org, geen Docker-daemon, en geen MySQL. Er kan dus geen echte,
klikbare WordPress-installatie in deze sessie draaien. Wat hier wel kan en is
gedaan: de echte thema- en plugincode schrijven, met `php -l` gecontroleerd op
syntaxfouten. Draaien en zien doe je lokaal.

## Vandaag lokaal aan de slag

1. **Installeer [Local](https://localwp.com/)** (gratis, Mac/Windows). Geen
   losse MySQL/PHP-installatie nodig, dat zit erin.
2. Maak een nieuwe site aan, bijvoorbeeld met de naam `wijnhuysdrie`.
3. Zodra de site draait, ga je naar **Plugins → WooCommerce → installeren en activeren**
   (rechtstreeks vanuit het WordPress-beheerscherm, dat hoeft niet via git).
4. Kopieer de mappen uit deze repo naar de site:
   - `wp-content/themes/wijnhuysdrie/` → naar de `wp-content/themes/` map van je Local-site
   - `wp-content/plugins/wijnhuysdrie-custom/` → naar de `wp-content/plugins/` map van je Local-site

   Local laat je de sitemap makkelijk openen via **Site shell** of **Go to site folder**.
5. Activeer in **Weergave → Thema's** het thema "Wijnhuys Drie", en in **Plugins**
   de plugin "Wijnhuys Drie – maatwerk" (de leeftijdscheck).
6. Importeer de voorbeeldproducten: **Producten → Importeren** in wp-admin,
   en wijs `docs/producten-seed.csv` uit deze repo aan.

Daarna zie je in je browser een werkende homepage met hero, de 3 producten, en
de NIX18-leeftijdscheck bij het eerste bezoek.

## Wat er al in zit

- `wp-content/themes/wijnhuysdrie/` — het thema. Donkere, "wijnkelder"-achtige
  basisstijl (Fraunces + Public Sans), header/footer, homepage met uitgelichte
  producten. WooCommerce-support is aangezet zodat de standaard winkel-, product-
  en afrekenpagina's al gestyled binnen dit thema verschijnen.
- `wp-content/plugins/wijnhuysdrie-custom/` — maatwerkplugin, nu met een
  NIX18-leeftijdscontrole (verplicht bij alcohol online verkopen).
- `docs/producten-seed.csv` — de 3 producten die in de huidige webshop stonden,
  met prijzen **inclusief btw** (was in de oude shop exclusief — zie
  `docs/wijnhuys-drie-bevindingen.md` uit een eerdere ronde, inmiddels verwijderd
  omdat die op een verkeerde aanname over de huidige shop berustte).

## Nog te doen

- Echte merkgegevens van de klant: logo, kleuren (of akkoord op het huidige
  donkere ontwerp), echte productfoto's, echte teksten.
- Meer WooCommerce-templates verfijnen (single product, winkelmandje, afrekenen)
  zodra er iets is om op te testen.
- Verzending, betaalmethode (iDEAL via Mollie) en btw-instellingen — dit zijn
  WooCommerce-instellingen, geen code, en stel je in zodra de lokale site draait.
- Staging-omgeving kiezen voor stap 2.
