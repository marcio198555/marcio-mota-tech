# Mission BOUTIQUES (R41 à R44) — 30/10

Nouvelle cible : les BOUTIQUES EN LIGNE indépendantes (petites et moyennes) qui vendent des produits tech, maison, cuisine, café, outdoor, vélo, animaux, photo, audio, gadgets, jouets tech. Elles choisissent un produit de leur assortiment, l'envoient, et Marcio cite la boutique comme endroit où l'acheter. Un créateur suisse les intéresse surtout en Suisse, puis en Allemagne, Autriche et France.

Règles (en plus de BRIEF.md, même dossier) :
- Pas de grands retailers ni de marketplaces : exclus Galaxus, Digitec, Brack, Interdiscount, Fust, MediaMarkt, Manor, Coop, Migros, Microspot, Fnac, Darty, Boulanger, Otto, Amazon, Conrad, Cyberport, Notebooksbilliger, Alternate, Mindfactory, Zalando, Decathlon, Ikea, Jumbo, Hornbach, Bauhaus, OBI, Lidl, Aldi, Leroy Merlin, Cdiscount, ManoMano, Teufel et toute chaîne nationale.
- Pas les boutiques d'une seule marque (ce sont des marques, souvent déjà contactées) ; il faut un vrai assortiment multimarques.
- Adresse générique lue sur la page Impressum / Mentions légales / Contact (info@, shop@, kontakt@, contact@, service@, hello@). Jamais nominative, jamais devinée.
- Contrôles : grep -i le domaine dans R*.jsonl, S*.jsonl, P*.jsonl, M*.jsonl et ../envoi/sent_log.jsonl ; check_brand (python3 -I /tmp/claude-0/-home-user-marcio-mota-tech/3efa93cf-ee03-5d60-9cb0-4fa55a82b8ad/scratchpad/tools/check_brand.py --relaxed --agent TON_ID "Nom|domaine" ...) ; Gmail en direct (in:anywhere, domaine du site ET domaine de l'e-mail ET nom entre guillemets, lots de 7 avec OR). Si Marcio a écrit à la boutique ou a échangé avec elle → écarte ; une simple commande ou newsletter ne compte pas.
- mx_ok "not_checked" accepté.

Outils : Tavily (mcp__Tavily__tavily_search ; tavily_extract en lot de 5 à 10 URL /impressum /kontakt /mentions-legales /contact ; UN appel Tavily à la fois, sinon 429), Exa (mcp__Exa__web_search_exa, mcp__Exa__web_fetch_exa), WebSearch. Charge-les via ToolSearch. Pas d'agent_run ni de tavily_research, pas d'outil payant.

Format (une ligne JSON par boutique dans recherche/TON_ID.jsonl, écrite dès validation) :
{"agent","kind":"shop","name","domain","email","email_source","email_lang","country","brands_examples","line_email":"","mx_ok","gmail_check"}
- name : nom commercial court du shop.
- brands_examples : 2 à 4 marques vendues (pour vérifier que c'est multimarques).
- email_lang : "fr" (Suisse romande, France, Belgique fr, Luxembourg), "de" (Suisse alémanique, Allemagne, Autriche), sinon "en".
Cible 70 boutiques, écrites au fil de l'eau, 2 h max. N'envoie aucun e-mail. Réponse finale : 3 lignes max.
