# Mission MONDE + SUISSE (R48 à R51) — 31/10

But : un maximum de colis chez Marcio. Cibles, par ordre de rendement :
1. kind "shop" : boutiques en ligne indépendantes multimarques (règles de SHOPS.md).
2. kind "distributor" : importateurs / distributeurs officiels multimarques (règles de RELAIS.md).
3. kind "agency" : agences de relations presse ou d'influence produits tech/maison (RELAIS.md).
Secteurs : tech, gadgets, maison, cuisine, café, électroménager, outdoor, camping, vélo, animaux, photo, audio, bricolage léger, éclairage, maison connectée, sport, bébé, jouets tech.
Priorité aux boutiques qui livrent en Suisse ou à l'international (indiqué dans leurs conditions de livraison).

Lis aussi BRIEF.md, SHOPS.md et RELAIS.md (même dossier). Leurs règles restent : adresse générique officielle (jamais nominative ni devinée), pas de grande chaîne ni marketplace, pas de boutique mono-marque, contrôles grep + check_brand --relaxed --agent TON_ID + Gmail in:anywhere (lots de 7). Écarte toute boutique ou société avec laquelle Marcio a déjà échangé.

Outils (Tavily est hors service aujourd'hui) : Exa (mcp__Exa__web_search_exa, mcp__Exa__web_fetch_exa), WebSearch, Parallel (mcp__Parallel_Search__web_search / web_fetch), Apollo gratuit (mcp__Apollo_io__apollo_organizations_lookup uniquement), Firecrawl en dernier recours. Charge-les via ToolSearch. Rien de payant, pas d'agent_run.
Astuce de rendement : cherche des listes (annuaires « Händler », « points de vente », « stockists », « where to buy », listes de revendeurs d'une marque connue, salons professionnels, classements « best independent ... shops »), puis lis les pages contact / Impressum par lots.

Format : une ligne JSON par contact dans recherche/TON_ID.jsonl, écrite dès validation (même format que SHOPS.md ; pour distributor/agency, brands_examples = marques représentées ou clients).
email_lang : "fr" (Suisse romande, France, Belgique fr, Luxembourg), "de" (Suisse alémanique, Allemagne, Autriche), sinon "en".
Cible : 90 contacts valides, écrits au fil de l'eau, 100 minutes au maximum. N'envoie aucun e-mail. Réponse finale : 3 lignes max.

## Méthode rapide (03/11) — à utiliser en priorité
Le contexte sature vite avec Exa. Méthode testée qui donne l'adresse dès la recherche :
- Chercher directement les pages légales : mcp__Exa__web_search_exa, numResults 3 à 5, requête du type « Impressum Onlineshop <niche> E-Mail info@ » (DE/AT/CH), « mentions légales boutique en ligne <niche> contact@ » (FR/BE/CH), « colofon webshop <niche> KvK e-mail » (NL), « aviso legal tienda online <niche> email » (ES), « note legali negozio online <niche> P.IVA email » (IT), « contact us online store <niche> email » (EN). Les résultats montrent l'adresse et le nom de la société.
- Puis UN seul mcp__Exa__web_fetch_exa (maxCharacters 1500) sur la page d'accueil ou une page catégorie pour relever 2 produits.
- Écrire le contact dès qu'il est validé ; ne jamais charger de longues pages.

## Méthode WebSearch (03/11 après-midi) — la plus économe
WebSearch répond de nouveau et ne renvoie que des titres + URL (peu de contexte). Pour chaque niche :
1. WebSearch (mode "standard") : « Onlineshop <niche> Impressum » / « boutique en ligne <niche> mentions légales » / « webshop <niche> contact » / « negozio online <niche> contatti » / « tienda online <niche> contacto », etc. Garde les domaines de boutiques indépendantes (pas de chaîne, marketplace, comparateur, blog).
2. mcp__Exa__web_fetch_exa (maxCharacters 1200) sur la page Impressum / contact de 3 à 5 boutiques à la fois pour lire l'adresse en clair.
3. mcp__Exa__web_fetch_exa (maxCharacters 2000) sur une page catégorie pour 2 produits.
Pas de mcp__Exa__web_search_exa (trop volumineux).
