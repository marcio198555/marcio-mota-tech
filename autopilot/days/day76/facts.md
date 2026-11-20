# Vidéo 76 — Enceinte « 100 W » : watts crête ou watts RMS ?
Format V « chiffre de la boîte », vendredi 20.11.2026, 10 h. Sources lues le 20.11.2026.
Marques exclues : JLab, EarFun, Marshall, Majority, Samsung, Sony, Apple (r_queue.json / brief). Marque utilisée : JBL (absente de r_queue.json).

| Fait | Valeur | URL | Statut |
|---|---|---|---|
| JBL EON710 (enceinte de sono amplifiée), puissance crête | « Power Rating (W, Peak) : 1300 » | https://support.harmanaudio.com/gb/en/speakers/speakers-professional/EON710.html | vérifié, officiel JBL/Harman (support) |
| JBL EON710, puissance continue | « Power Rating (W, Continuous) : 650 » | idem | vérifié, officiel |
| JBL Boombox 3, puissance sur secteur | « 1x80W RMS-subwoofer + 2x40W RMS-midrange + 2x10W RMS-tweeter (AC mode) » ; aucune puissance crête publiée | https://support.jbl.com/ca/en/speakers/speakers-bluetooth-wireless/BOOMBOX-3-.html | vérifié, officiel JBL (support) |
| JBL Boombox 3, puissance sur batterie | « 1x60W RMS-subwoofer + 2x30W RMS-midrange + 2x8W RMS-tweeter (Battery mode) » | idem | vérifié, officiel |
| Définition RMS (fabricant audio Cerwin-Vega) | RMS : « the amount of power a speaker or amplifier can handle or produce continuously over time » | https://cerwinvega.com/blogs/news/rms-vs-peak-power (J. Rivera, 15.09.2025) | vérifié, blog officiel du fabricant |
| Définition crête (Cerwin-Vega) | peak : « the maximum amount of power a component can handle or produce for a short burst—usually just milliseconds » | idem | vérifié |
| Exemple d'ampli (Cerwin-Vega) | un ampli annoncé « 1000W peak » « might only be putting out 250W RMS » | idem | vérifié (exemple du fabricant, pas un produit précis) |
| Norme IEC 60268-5:2003 (haut-parleurs) | 4 caractéristiques de puissance : 18.1 « Rated noise power », 18.2 « Short-term maximum power », 18.3 « Long-term maximum power », 18.4 « Rated sinusoidal power » | https://webstore.ansi.org/preview-pages/IEC/preview_iec60268-5%7Bed3.0%7Den.pdf (aperçu officiel, sommaire) | vérifié (sommaire) |
| IEC 60268-5 : champ et statut | « applies to sound system loudspeakers, treated entirely as passive elements », exclut les haut-parleurs à ampli intégré ; version 2003+A1:2007 indiquée « withdrawn » au 17.04.2026 | https://webstore.iec.ch/publication/1224 | vérifié, officiel IEC → dit au passé daté : « la norme de 2003 » |

## Calculs
- EON710 : 650 / 1300 = 0,5 → « pile la moitié ».
- Au même rapport (exemple) : 100 W crête × 0,5 = 50 W continus.
- Exemple Cerwin-Vega : 250 / 1000 = 0,25 → le quart.
- Boombox 3 sur secteur : 80 + 2 × 40 + 2 × 10 = 80 + 80 + 20 = 180 W RMS.
- Boombox 3 sur batterie : 60 + 2 × 30 + 2 × 8 = 60 + 60 + 16 = 136 W RMS. 136 / 180 = 0,76 (non dit).

## Limites
- Le rapport crête/continu n'est pas fixe : 1/2 sur l'EON710, 1/4 dans l'exemple Cerwin-Vega. « 100 W crête = 50 W continus » est un exemple (au rapport de l'EON710), marqué « exemple » à l'écran.
- Les 180 et 136 W sont des sommes des voies publiées par JBL (JBL n'écrit pas le total) : à l'écran, montrer le détail.
- IEC 60268-5 vise les haut-parleurs passifs (pas les enceintes Bluetooth amplifiées) et l'édition 2003 est retirée : on dit seulement qu'elle « distingue quatre puissances », sans dire qu'elle s'applique aux enceintes Bluetooth.
- « PMPO » : aucune source officielle lue, non dit.

## Script (job tts/cb_jobs/day76.json, 14 segments, 164 mots)
s01 : Ton enceinte fait cent watts ? Regarde d'abord quels watts.
s02 : Non. Cent watts, tout seul, ne dit rien. À la fin, tu sauras lesquels croire.
s03 : Les watts crête : un pic très bref, souvent quelques millisecondes.
s04 : Les watts èr-èm-èss, ou continus : ce qui tient dans la durée.
s05 : Chez Djé-bé-èl, une enceinte de sono : mille trois cents watts crête.
s06 : Mais six cent cinquante en continu. Pile la moitié.
s07 : Au même rapport, cent watts crête feraient cinquante watts continus.
s08 : Pire : un fabricant audio cite un ampli annoncé à mille watts crête, qui ne sort peut-être que deux cent cinquante èr-èm-èss.
s09 : Autre surprise : la Boombox trois de Djé-bé-èl, c'est cent quatre-vingts watts èr-èm-èss sur secteur.
s10 : Sur batterie : cent trente-six. Même enceinte.
s11 : Même la norme des haut-parleurs de deux mille trois distingue quatre puissances différentes.
s12 : Avant d'acheter, cherche « èr-èm-èss » ou « continu » sur la fiche.
s13 : Ton enceinte affiche quels watts sur la boîte ? Écris-le en commentaire.
s14 : Et abonne-toi : ce soir, la guirlande LED de Noël allumée tout décembre, combien en francs ?
