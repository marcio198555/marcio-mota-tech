Tu travailles pour Marcio Mota, créateur UGC tech et maison en Suisse romande (Instagram @filipe_marcio1985). Mission : trouver de NOUVELLES entreprises SUISSES ou FRANÇAISES (uniquement ces deux pays) — artisans, ateliers et petites marques — qui vendent leurs PROPRES produits physiques en ligne et affichent une adresse e-mail générique sur leur site. Marcio leur proposera un Reel payant dans son guide de cadeaux de Noël. Ne lance aucun sous-agent. Ne crée aucun rappel ni tâche programmée. N'envoie aucun e-mail.

__TRANCHE__

OUTILS : charge-les avec ToolSearch « select:mcp__Parallel_Search__web_search,mcp__Parallel_Search__web_fetch,mcp__Gmail__search_threads ». N'utilise ni Apollo ni WebFetch/WebSearch (réseau fermé).
- web_search : objectif court, 3 requêtes max par appel, TOUJOURS session_id "mmf7c2dea243b0a1d6d3e74e932ae8a0e1". Les résultats sont gros : note tout de suite les domaines utiles dans /home/user/marcio-mota-tech/prospection/travail/paid/new___TAG__.txt (un par ligne avec le nom) et passe à la suite.
- web_fetch : 15 à 20 URL par appel, mode extraits, objectif court « contact email; product names and prices; company legal name », TOUJOURS le même session_id. Pages à lire : /contact, /mentions-legales, /impressum, /pages/contact, /policies/contact-information, une page produit. Abandonne une marque après 2 essais sans e-mail.
- Rate limit Parallel : avance sur check_cands et Gmail 1 à 2 minutes, puis réessaie avec moins d'URL. Ne t'arrête jamais à cause du rate limit.

MÉTHODE :
1. Dès que tu as 20 à 60 domaines, passe-les en une fois : cd /home/user/marcio-mota-tech/prospection && python3 -I outils/check_cands.py dom1 dom2 ... ; garde seulement les « new ». Beaucoup seront « known » : normal, continue.
2. Contrôle Gmail des « new » par paquets de 10 : mcp__Gmail__search_threads, view THREAD_VIEW_IDS_ONLY, pageSize 50, query « in:anywhere -category:promotions -category:social (dom1 OR dom2 OR …) » ; si un résultat apparaît, refais la requête par moitiés pour trouver la marque et écarte-la.
3. Lis le site des « new » restants et garde ceux qui respectent les critères.

CRITÈRES :
1. Société suisse ("CH") ou française ("FR") qui fabrique ou vend sous sa propre marque des objets physiques ; identité visible (mentions légales, impressum ou raison sociale).
2. Un produit précis en vente, entre 10 et 600 €/CHF : product = nom exact lu sur le site (45 caractères max, sans guillemets ni parenthèses, en français si lang "fr", en allemand si lang "de"), product_url, price (ou "?").
3. E-mail GÉNÉRIQUE lu en clair sur le site officiel (contact@, hello@, bonjour@, info@, atelier@, shop@…), sur le domaine de la marque. Jamais deviné, jamais au prénom ou nom d'une personne (camille@, jean@), jamais gratuit (gmail, outlook, hotmail, yahoo, orange, wanadoo, free, laposte, bluewin, gmx…), jamais sav@/orders@/privacy@.
4. Écarte : vêtements et textile de mode, bijoux et montres, cosmétiques, savons, parfums, huiles essentielles, alimentation et boissons, meubles et objets très volumineux, armes, CBD, produits médicaux, revendeurs multi-marques, marketplaces, Etsy seul, cours/ateliers sans boutique, grandes marques connues.
5. Accepté (large) : céramique, porcelaine, verre, bois, bougies, luminaires, déco utilitaire, cuisine et table, rangement, jardin, animaux, jouets et jeux, papeterie, bureau, tech et accessoires, sport et outdoor, vélo, bébé (équipement), cadeaux personnalisés, impression 3D, métal, vannerie.

LANGUE : "fr" pour la France et la Suisse romande ; "de" pour la Suisse alémanique ; "en" pour le Tessin.

FORMAT : une ligne JSON par marque : {"brand","domain","country","lang","category","email","email_url","product","product_url","price"}
Enregistre par paquets de 5 à 10 dans /home/user/marcio-mota-tech/prospection/travail/paid/tmp___TAG___N.jsonl puis : cd /home/user/marcio-mota-tech/prospection && python3 -I outils/add_cand.py __TAG__ < ce_fichier
Objectif : 40 marques acceptées. Parcours toute la tranche avant de t'arrêter (sauf si 40 atteint).
Réponse finale : les ids acceptés en une ligne, puis 2 lignes max (sources faites, rendement).
