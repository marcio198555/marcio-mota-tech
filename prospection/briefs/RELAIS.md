# Mission RELAIS (R1, R2) — 28/10

Changement de méthode : les marques en direct sont épuisées (90 % déjà dans le Gmail de Marcio). On cible maintenant les RELAIS qui gèrent des dizaines de marques : un contact = plusieurs campagnes d'échantillons.

Lis BRIEF.md (même dossier) pour les règles communes : adresse officielle seulement, jamais devinée, pas nominative (sauf si c'est la seule adresse publique du service presse/influence, et seulement si elle est affichée sur le site officiel), MX vérifié, aucun e-mail envoyé.

## Contrôle obligatoire avant d'écrire un lead
1. check_brand : python3 -I /tmp/claude-0/-home-user-marcio-mota-tech/3efa93cf-ee03-5d60-9cb0-4fa55a82b8ad/scratchpad/tools/check_brand.py --relaxed --agent TON_ID "Nom|domaine" ... (lots de 60).
2. Gmail en direct (in:anywhere) : domaine du site ET domaine de l'e-mail ET nom entre guillemets, lots de 7 avec OR. Toute trace d'échange avec Marcio (monthey1985@gmail.com) → écarte.

## Format (une ligne JSON par lead dans recherche/TON_ID.jsonl, écrite dès validation)
{"agent","kind","name","domain","email","email_source","email_lang","country","brands_examples","line_email","mx_ok","gmail_check"}
- kind : "distributor" ou "agency".
- brands_examples : 2 à 4 marques grand public tech/maison réellement représentées (vues sur leur site), séparées par des virgules, SANS reprendre une marque partenaire de Marcio.
- line_email : 1 phrase à la 1re personne, qui cite 2 de ces marques et dit quel produit Marcio filmerait (vue de dessus, macro, mains seules, une mesure à l'écran : W, dB, lux, °C, secondes ou mm). Pas de tiret cadratin ni demi-cadratin, pas de point d'exclamation, pas de chiffres d'audience.
- email_lang : "fr" pour un site en français, "de" pour un site seulement en allemand, sinon "en".
Outils : Parallel web_search/web_fetch en lot ; si limite, WebSearch et Firecrawl (mcp__Firecrawl__firecrawl_search / firecrawl_scrape). Cible 60 leads, 90 min max. Réponse finale : 3 lignes max.

## Ajout du 28/10 après-midi
- Ne refais aucun nom déjà présent dans R1.jsonl, R2.jsonl, R3.jsonl, R4.jsonl ou les autres R*.jsonl (même dossier) : grep le domaine avant de travailler dessus.
- Si Parallel est à sa limite : WebSearch, puis Firecrawl (mcp__Firecrawl__firecrawl_search / firecrawl_scrape). Le MX peut être vérifié via Firecrawl scrape de https://dns.google/resolve?name=<domaine>&type=MX.

## Ajout du 28/10 soir (campagne 350, qualité maximale)
- Écris chaque lead dans ton fichier DÈS qu'il est validé (les envois partent par lots de 30 pendant que tu travailles).
- Langue : "de" pour toute entreprise d'Allemagne, d'Autriche ou de Suisse alémanique (même si le site a une version anglaise), "fr" pour la France, la Belgique francophone, le Luxembourg et la Suisse romande, "en" sinon.
- "name" = le nom commercial court tel qu'écrit sur le site (ex. « Kundert Vario », pas « Kundert Vario AG Handelsgesellschaft »), sans guillemets ni forme juridique si possible.
- Qualité avant volume : entreprise active (site à jour), qui gère vraiment des marques grand public filmables ; adresse générique visible sur le site officiel ; jamais d'adresse de commande seule (order@, bestellung@) si une adresse info@/marketing@ existe.
- Ne refais aucun domaine déjà présent dans R*.jsonl, ni dans ../envoi/sent_log.jsonl (grep -i le domaine).
- Outils : WebSearch d'abord (Parallel et Firecrawl sont presque à leur limite), puis Parallel, puis Firecrawl.

## Ajout du 29/10 : découverte gratuite par Apollo
- Pour trouver des CANDIDATS en masse, utilise mcp__Apollo_io__apollo_organizations_lookup (GRATUIT, 0 crédit ; charge-le via ToolSearch « select:mcp__Apollo_io__apollo_organizations_lookup »). Filtres utiles : q_organization_keyword_tags (ex. ["distributor","consumer electronics"], ["importer","housewares"], ["public relations","consumer"], ["influencer marketing"]), organization_locations (pays), organization_num_employees_ranges (["11,50","51,200","201,500"]), per_page 100, page 1..N. Mets toujours _conversation_ref "mmrelais29".
- N'utilise JAMAIS les outils Apollo payants (apollo_mixed_companies_search, enrich, people, emails) : seulement apollo_organizations_lookup.
- Apollo donne nom + domaine : filtre ensuite (vrai distributeur/agence grand public), check_brand, Gmail, puis trouve l'adresse générique sur le site officiel (WebSearch « site:domaine contact email », Parallel web_fetch de /contact, /impressum, /kontakt, /contacto). Jamais d'adresse devinée.

## Ajout du 29/10 après-midi : Tavily et Exa connectés (PRIORITAIRES)
- Recherche : mcp__Tavily__tavily_search (max_results 10, search_depth "advanced" si besoin, country pour cibler un pays) et mcp__Exa__web_search_exa (requête décrivant la page idéale ; « category:company » pour des entreprises).
- Lecture des pages de contact : mcp__Tavily__tavily_extract (plusieurs URL par appel, query "email contact info marketing" pour ne garder que les passages utiles) ; si 404, mcp__Tavily__tavily_map sur le domaine pour trouver la vraie page contact/impressum, ou mcp__Exa__web_fetch_exa.
- Charge-les via ToolSearch (« select:mcp__Tavily__tavily_search,mcp__Tavily__tavily_extract,mcp__Tavily__tavily_map,mcp__Exa__web_search_exa,mcp__Exa__web_fetch_exa »).
- N'utilise PAS mcp__Exa__agent_run ni mcp__Tavily__tavily_research (coûteux).
- (29/10) Si le contrôle MX est impossible (dns.google bloqué, Firecrawl à sec), n'essaie pas de le contourner : écris le lead avec "mx_ok": "not_checked" si l'adresse est lue sur le site officiel.

## Ajout du 30/10 (campagne 350 du jour)
- Ne refais aucun domaine présent dans R*.jsonl ni dans ../envoi/sent_log.jsonl (grep -i le domaine AVANT d'y passer du temps).
- Méthode la plus rentable : Tavily/Exa par SECTEUR + PAYS (« [secteur] distributor [pays] our brands », « Importeur [Branche] Marken », « grossiste importateur [secteur] marques »), puis tavily_extract en lot (5 à 10 URL) sur /contact, /kontakt, /impressum, /about.
- mx_ok "not_checked" accepté si l'adresse est lue sur le site officiel.
