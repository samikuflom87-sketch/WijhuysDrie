# Stappenplan: website verkopen en bouwen voor de klant

Praktisch draaiboek van eerste analyse tot oplevering en nazorg.
Werk het van boven naar beneden af. Sla geen fase over — vooral fase 0 en 2 niet,
daar gaat het bij beginners meestal mis.

---

## Fase 0 — Uitzoeken (voordat je iets belooft)

Doe dit **voordat** je met de klant praat. Je wilt binnenlopen met feiten, niet met meningen.

- [ ] **Link van de huidige site opvragen.**
- [ ] **Uitzoeken op welk platform de site draait.** Zie het blok hieronder.
- [ ] **Snelheid meten** — [PageSpeed Insights](https://pagespeed.web.dev). Noteer de mobiele score.
- [ ] **Mobiel bekijken op je telefoon.** Niet in de desktopbrowser verkleind. Écht op je telefoon.
- [ ] **Google-check** — zoek op `site:zijndomein.nl` (staat hij wel in Google?) en op zijn bedrijfsnaam + plaats (staat hij bovenaan of staat de concurrent er?).
- [ ] **Google Bedrijfsprofiel** opzoeken. Bestaat het? Foto's? Reviews? Vaak makkelijke winst.
- [ ] **3 concurrenten** bekijken uit dezelfde plaats/branche. Wat doen zij beter?
- [ ] **Screenshots maken** van de huidige site (desktop + mobiel). Dit is je "vóór"-plaatje voor de pitch én later voor je portfolio.

### Welk platform gebruikt hij? (Strato? Strikingly? Wix?)

Snelle manieren om erachter te komen:

| Methode | Wat je doet | Wat je ziet |
|---|---|---|
| Footer | Scroll naar beneden op de site | Vaak "Powered by …" |
| Broncode | Rechtermuisknop → *Paginabron weergeven*, zoek op `wix`, `wordpress`, `strato`, `squarespace`, `strikingly` | Naam van het platform |
| Terminal | `dig +short NS zijndomein.nl` en `curl -sI https://zijndomein.nl \| grep -i server` | Nameservers verraden de hoster |
| Whois | [whois.domaintools.com](https://whois.domaintools.com) of `whois zijndomein.nl` | Registrar + soms de eigenaar |

**Waarom dit belangrijk is voor je aanbod:**

- **Strato / TransIP / Vimexx / Antagonist / Hostnet** = gewone webhosting. Je kunt vrij bouwen wat je wilt en gewoon uploaden. Beste scenario.
- **Wix / Strikingly / Jimdo / Squarespace** = gesloten bouwer. Je kunt daar niet je eigen site in kwijt. Dan is de boodschap: *we verhuizen naar echte hosting, dan ben je eigenaar van je eigen site.* Dat is meteen een sterk verkoopargument.
- **WordPress** = je kunt kiezen: opknappen (goedkoper voor hem) of opnieuw bouwen (beter voor jou en voor het resultaat).

---

## Fase 1 — Het verkoopgesprek

### 1.1 Eerst luisteren, dan pas praten

Stel deze vragen en schrijf de antwoorden op:

- [ ] Wat moet de website voor je doen? (bellen, mailen, offerte, afspraak, bestellen?)
- [ ] Wie is je klant? Particulier of zakelijk? Uit welke regio?
- [ ] Wat vind je zelf niet goed aan de huidige site?
- [ ] Hoeveel aanvragen krijg je nu via de site per maand?
- [ ] Wie heeft de site gemaakt en wie beheert hem nu?
- [ ] **Staat het domein op jouw naam?** (belangrijk — zie fase 2)
- [ ] Wanneer wil je het live hebben?
- [ ] Wat had je qua budget in gedachten?

> Die laatste vraag durf je gewoon te stellen. Zonder budget schiet je in het donker.

### 1.2 Zo breng je het (probleem → gevolg → oplossing)

Zeg **nooit** "je site is lelijk". Dan val je hem persoonlijk aan en gaat de deur dicht.
Zeg wat het hem **kost**:

> "Je site laadt op mobiel in 6 seconden. 7 van de 10 bezoekers komen via hun telefoon en de meesten haken na 3 seconden af. Dat betekent dat je een groot deel van je bezoekers kwijt bent voordat ze überhaupt zien wat je doet. Ik kan dat naar onder de 2 seconden brengen."

Dezelfde truc voor de rest:

| Probleem | Wat je zegt dat het kost |
|---|---|
| Traag | "Bezoekers haken af voordat je site geladen is." |
| Niet mobiel | "Op de telefoon moet je uitzoomen om je nummer te lezen." |
| Geen duidelijke knop | "Mensen willen contact maar weten niet waar ze moeten klikken." |
| Niet vindbaar | "Als iemand zoekt op [dienst + plaats] staat je concurrent bovenaan, jij niet." |
| Verouderd design | "Bezoekers denken onbewust: is dit bedrijf nog actief?" |

### 1.3 Offerte: geef altijd 3 opties

Mensen kiezen bijna nooit de goedkoopste als er drie staan — ze kiezen de middelste.
Zorg dus dat de middelste is wat je wilt verkopen.

| | **Basis** | **Compleet** ⭐ | **Compleet + Onderhoud** |
|---|---|---|---|
| Pagina's | 3–4 | 5–8 | 5–8 |
| Design | Modern template | Op maat voor zijn merk | Op maat voor zijn merk |
| Teksten | Hij levert aan | Ik herschrijf ze | Ik herschrijf ze |
| SEO | Basis | Volledig + Google Bedrijfsprofiel | Volledig + Google Bedrijfsprofiel |
| Formulier / WhatsApp | ✅ | ✅ | ✅ |
| Richtprijs (eenmalig) | € 750 – 1.250 | € 1.500 – 2.500 | € 1.500 – 2.500 |
| Per maand | — | — | € 40 – 75 (hosting, updates, back-ups, kleine wijzigingen) |

*Richtprijzen voor de Nederlandse markt. Pas ze aan naar jouw ervaring en de branche — bij een aannemer of tandarts kun je meer vragen dan bij een kapper.*

**Regels die je jezelf oplegt:**

- [ ] Vaste prijs, geen uurtarief. De klant wil weten waar hij aan toe is.
- [ ] **50% vooraf**, 50% bij oplevering. Altijd. Geen uitzonderingen.
- [ ] Maximaal **2 rondes feedback** inbegrepen, daarna € x per uur. Zet dit erin, anders blijf je gratis aanpassen.
- [ ] Zet er expliciet in wat er **niet** bij zit (logo ontwerpen, fotoshoot, teksten schrijven, webshop).
- [ ] Zet er een **geldigheidsduur** op: "deze offerte is 14 dagen geldig".
- [ ] Akkoord per **mail** ("bij deze akkoord") is genoeg als bewijs. Bel niet alleen.

### 1.4 Twijfelt hij?

Bied een **betaalde proefopdracht** aan: "Ik bouw je nieuwe homepage voor € 250. Bevalt het, dan gaat dat bedrag van de totaalprijs af. Bevalt het niet, dan stoppen we." Bijna niemand zegt daar nee tegen, en je bent al betaald.

---

## Fase 2 — Toegang en materiaal verzamelen

**Begin niet met bouwen voordat je dit compleet hebt.** Anders lig je halverwege stil.

- [ ] Inloggegevens **domeinnaam** (waar is het domein geregistreerd?)
- [ ] Inloggegevens **hosting**
- [ ] Toegang huidige site (CMS-login)
- [ ] **Logo** in hoge resolutie (liefst `.svg`, anders grote `.png`)
- [ ] Huisstijlkleuren en lettertype (of vrijheid om te kiezen)
- [ ] **Foto's** — eigen foto's van zijn werk/pand/team. Vraag hier extra naar, dit is wat een site echt beter maakt.
- [ ] Bedrijfsgegevens: KvK-nummer, btw-nummer, adres, telefoon, e-mail, openingstijden
- [ ] Sociale media-links
- [ ] Reviews / klantcitaten (of toestemming om Google-reviews over te nemen)
- [ ] Toegang tot Google Bedrijfsprofiel en eventueel Google Analytics

> ⚠️ **Domeinnaam-valkuil.** Staat het domein op naam van de vorige bouwer, dan kan die het gijzelen. Zoek dat vóór het bouwen uit en laat het overzetten naar de klant. Zet dit ook zo in je offerte: *"het domein blijft eigendom van de klant"* — dat schept vertrouwen én dekt jou.

**Veiligheidsregels:**

- [ ] Maak eerst een **volledige back-up** van de oude site (bestanden + database + screenshots van alle pagina's).
- [ ] **Raak de live site niet aan.** Bouw op een aparte omgeving of subdomein (`nieuw.zijndomein.nl`).
- [ ] Zet die testomgeving op `noindex`, anders komt hij in Google terecht en concurreert hij met de echte site.
- [ ] Zet alle wachtwoorden in een wachtwoordmanager, niet in WhatsApp.

---

## Fase 3 — Bouwen

### 3.1 Eerst akkoord op de structuur (niet op het design)

Maak een simpel lijstje met de pagina's en wat er op elke pagina komt. Mail dat.
**Wacht op akkoord.** Dit kost je 20 minuten en bespaart je later dagen.

Standaard opzet voor een dienstverlener:

```
Home          → wie je bent, wat je doet, waarom jij, duidelijke knop
Diensten      → per dienst een blok (of aparte pagina per dienst = beter voor Google)
Over ons      → foto van het team/de eigenaar, verhaal, vertrouwen
Projecten     → foto's van eerder werk / reviews
Contact       → formulier, telefoon, mail, adres, kaart, openingstijden
```

### 3.2 Eerst één pagina, dan de rest

- [ ] Bouw **alleen de homepage** af.
- [ ] Laat die zien en vraag akkoord.
- [ ] Pas daarna de rest bouwen in dezelfde stijl.

Bouw je alles in één keer en vindt hij de stijl niks, dan kun je alles opnieuw doen.

### 3.3 Waar je op bouwt

| Situatie | Advies |
|---|---|
| Klant wil zelf teksten kunnen aanpassen | WordPress met een goed thema |
| Klant komt er toch nooit aan | Statische site (HTML/CSS/JS of Astro) — sneller, veiliger, geen updates nodig |
| Webshop nodig | WooCommerce of Shopify |

Voor de meeste kleine bedrijven is een statische site het beste: bloedsnel, niet te hacken, en jij houdt het onderhoud (= abonnement).

### 3.4 Technische checklist tijdens het bouwen

- [ ] **Mobiel eerst** ontwerpen. De meeste bezoekers komen via de telefoon.
- [ ] Telefoonnummer als **klikbare link** (`tel:`) — op mobiel belt hij dan direct.
- [ ] **WhatsApp-knop** (`https://wa.me/31612345678`) — voor veel branches de belangrijkste knop op de site.
- [ ] Contactformulier dat écht aankomt — **test het zelf** vanaf een ander mailadres.
- [ ] Duidelijke actieknop op **elke** pagina ("Bel ons", "Vraag offerte aan").
- [ ] **Foto's comprimeren** (WebP, onder 200 kB per foto). Dit is verreweg de grootste snelheidswinst.
- [ ] Per pagina een unieke **titel** en **meta-omschrijving** met dienst + plaatsnaam.
- [ ] Eén duidelijke `<h1>` per pagina.
- [ ] `alt`-teksten bij alle afbeeldingen.
- [ ] `sitemap.xml` en `robots.txt`.
- [ ] **Favicon** met zijn logo.
- [ ] **SSL** aan (`https`), en `http` doorsturen naar `https`.
- [ ] **Cookiemelding** als je Analytics gebruikt, plus **privacyverklaring** (AVG-plicht).
- [ ] Google Maps of route-link bij het adres.
- [ ] 404-pagina die terugverwijst naar de homepage.

---

## Fase 4 — Testen (vóór livegang)

- [ ] Op **echte telefoon** getest (iPhone én Android als het kan).
- [ ] In Chrome, Safari en Firefox bekeken.
- [ ] Alle links aangeklikt — geen enkele dode link.
- [ ] Contactformulier getest: komt de mail aan? Ook in de spambox gekeken?
- [ ] Telefoonnummer en WhatsApp-knop getest op mobiel.
- [ ] Alle teksten nagelezen op spelfouten. Laat iemand anders meelezen.
- [ ] PageSpeed opnieuw gemeten — mobiel **80+** moet lukken.
- [ ] Alle bedrijfsgegevens gecontroleerd (KvK, adres, telefoonnummer klopt echt?).
- [ ] Klant heeft alles zelf bekeken en **schriftelijk akkoord** gegeven.

---

## Fase 5 — Live zetten

- [ ] Doe dit **niet op vrijdagmiddag**. Kies een rustig moment, bij voorkeur dinsdag- of woensdagochtend.
- [ ] Back-up van de oude site nog een keer gecontroleerd.
- [ ] Domein/DNS omzetten naar de nieuwe hosting.
- [ ] **Oude URL's doorsturen** naar de nieuwe pagina's (301-redirects). Sla je dit over, dan verlies je zijn Google-posities — dit is de fout die het meeste schade doet.
- [ ] `noindex` van de testomgeving **weggehaald**. (Controleer dit twee keer.)
- [ ] SSL-certificaat actief op het echte domein.
- [ ] Site aangemeld bij **Google Search Console** + sitemap ingediend.
- [ ] Analytics geplaatst (of een privacyvriendelijk alternatief).
- [ ] E-mail werkt nog! Als de mail bij dezelfde hoster stond, controleer of hij nog mail kan ontvangen. **Dit is de klassieke ramp bij verhuizen.**
- [ ] Link op Google Bedrijfsprofiel en sociale media geüpdatet.
- [ ] 24 uur later nog een keer alles nalopen.

---

## Fase 6 — Oplevering en nazorg

- [ ] Restant factureren en **betaling ontvangen** vóór je alle inloggegevens overdraagt.
- [ ] Korte uitleg geven: neem een schermopname van 5–10 minuten op waarin je laat zien hoe hij een tekst of foto aanpast. Dat scheelt je maanden aan telefoontjes.
- [ ] Alle inloggegevens netjes overdragen in één document.
- [ ] **Vraag om een review** (Google + LinkedIn) — nu is hij het meest enthousiast.
- [ ] **Vraag om doorverwijzing:** "Ken je nog iemand met een verouderde website?" Zo krijg je klant nummer twee.
- [ ] Voor/na-screenshots opslaan voor je portfolio.
- [ ] Onderhoudsabonnement aanbieden als je dat nog niet verkocht hebt.
- [ ] Zet een herinnering over **3 maanden** om te vragen hoe het loopt. Vaak levert dat vervolgwerk op.

> 💡 **Het abonnement is het belangrijkste.** Eén site bouwen is € 2.000 eenmalig.
> Tien klanten op € 50 per maand is € 6.000 per jaar dat gewoon doorloopt.
> Verkoop het abonnement dus meteen mee, niet achteraf.

---

## De 6 fouten die je moet vermijden

1. **Zonder aanbetaling beginnen.** Doe het niet.
2. **Ongelimiteerd aanpassingen doen.** Leg het aantal feedbackrondes vast.
3. **De oude site slopen voordat de nieuwe live is.** Altijd back-up en parallel bouwen.
4. **Redirects vergeten.** Dan verdwijnt hij uit Google en krijg jij de schuld.
5. **Mail kapot maken bij een verhuizing.** Check de MX-records vóór je DNS aanpast.
6. **Alles overdragen vóór de laatste betaling.** Eerst geld, dan sleutels.

---

## Wat ik nu van jou nodig heb

1. **De link naar de huidige website.**
2. In welke **branche** de klant zit en in welke **plaats**.
3. Wat hij ongeveer wil uitgeven (als je dat al weet).

Zodra ik de link heb, doe ik meteen:

- uitzoeken op welk platform en welke hoster hij zit (en of migreren kan);
- een snelheids- en mobielcheck;
- een lijstje concrete verbeterpunten dat je letterlijk in je offerte kunt plakken;
- een eerste opzet voor de nieuwe structuur.
