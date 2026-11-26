Tu travailles pour Marcio Mota, créateur UGC tech et maison en Suisse romande (Instagram @filipe_marcio1985). Mission : dans une liste de domaines déjà repérés et JAMAIS contactés, garder les marques qui vendent leurs PROPRES produits physiques en ligne et affichent une adresse e-mail générique sur leur site. Marcio leur proposera un Reel payant dans son guide de cadeaux de Noël. Ne lance aucun sous-agent. Ne crée aucun rappel ni tâche programmée. N'envoie aucun e-mail.

TRANCHE : /home/user/marcio-mota-tech/prospection/travail/paid/res___TAG__.txt (un domaine par ligne). Traite-les dans l'ordre, par paquets de 10. Aucune recherche web : on lit seulement les sites.

OUTILS : charge-les avec ToolSearch « select:mcp__Parallel_Search__web_fetch,mcp__Gmail__search_threads ». Exa et Tavily n'ont plus de crédits ; n'utilise ni Apollo, ni Firecrawl, ni WebFetch/WebSearch (réseau fermé).
- web_fetch : 15 à 20 URL par appel, mode extraits (jamais full_content), objectif court « contact email address; product names and prices; company legal name and country », TOUJOURS session_id "mmf7c2dea243b0a1d6d3e74e932ae8a0e1".
- Rate limit Parallel : avance sur les contrôles Gmail du paquet suivant pendant 1 à 2 minutes, puis réessaie avec moins d'URL. Ne t'arrête jamais à cause du rate limit.

BOUCLE (paquets de 10 domaines) :
1. Gmail : mcp__Gmail__search_threads, view THREAD_VIEW_IDS_ONLY, pageSize 50, query « in:anywhere -category:promotions -category:social (dom1 OR dom2 OR … dom10) ». Si un résultat apparaît, refais la requête par moitiés pour trouver le ou les domaines concernés et écarte-les (Marcio a déjà eu affaire à eux).
2. Premier web_fetch : la page contact probable de chaque domaine restant (.de/.at/.ch → /impressum ; .fr/.be/.lu → /mentions-legales ; .it → /contatti ; .es → /contacto ; .nl → /contact ; .pl → /kontakt ; sinon /contact ; boutiques Shopify : /pages/contact). Si l'e-mail n'y est pas : UN seul second essai (page d'accueil https://<domaine>/ ou /policies/contact-information), puis abandon.
3. Pour les domaines qui ont un e-mail valable mais pas encore de produit précis : page d'accueil ou une page produit (dans un même appel groupé).
Abandonne sans regret : site fermé, parqué ou à vendre, pas de boutique ni de produits, adresse e-mail absente ou seulement un formulaire.

CRITÈRES :
1. Marque qui fabrique ou vend sous son propre nom des objets physiques ; identité visible (raison sociale, mentions légales, impressum ou « © Nom Inc. ») ; country = code ISO à 2 lettres du siège (adresse, impressum, page About). Pays inconnu → écarte.
2. Un produit précis en vente, entre 10 et 600 € (ou équivalent) : product = nom exact lu sur le site (45 caractères max, sans guillemets ni parenthèses ; en français si lang "fr", en allemand si lang "de", sinon en anglais), product_url, price (ou "?").
3. E-mail GÉNÉRIQUE lu en clair sur le site officiel, sur le domaine de la marque (« info [at] marque.com » écrit ainsi compte aussi). Ordre de préférence : press@, pr@, marketing@, partnerships@, collab@, influencer@ > hello@, info@, contact@, team@, office@ > sales@, shop@ > support@, service@ (seulement s'il n'y a rien d'autre). Jamais deviné, jamais au prénom ou nom d'une personne, jamais gratuit (gmail, outlook, hotmail, yahoo, gmx, web.de, orange, wanadoo, free, bluewin…), jamais orders@, privacy@, legal@, dpo@, gdpr@, returns@, sav@, jobs@, careers@, invoice@, accounting@, noreply@.
4. Écarte : vêtements et textile de mode, sacs de mode, bijoux et montres, cosmétiques, savons, parfums, huiles essentielles, alimentation, boissons et compléments, meubles et objets très volumineux, armes, couteaux de combat, CBD et tabac, produits médicaux, revendeurs multimarques, marketplaces, logiciels et services, B2B pur (vente aux pros seulement), multinationales connues de tous (Samsung, Philips, Bosch, Logitech, Garmin, IKEA…).
5. Accepté (large) : tech et accessoires, audio, photo, éclairage, maison connectée, cuisine et petit électroménager, café, outillage, jardin, outdoor, camping, vélo, sport, animaux, bébé (équipement), jouets et jeux, puzzles, papeterie, bureau, rangement, céramique, verre, bois, bougies, impression 3D, auto et moto (accessoires), voyage.

LANGUE : "fr" pour la France, la Belgique francophone, le Luxembourg et le Québec ; "de" pour l'Allemagne et l'Autriche ; "en" pour tous les autres pays (et la Flandre, les Pays-Bas, l'Italie, la Suisse, etc.).

FORMAT : une ligne JSON par marque acceptée : {"brand","domain","country","lang","category","email","email_url","email_evidence","product","product_url","price"} — email_evidence = le court passage EXACT de la page (60 caractères max) qui contient l'adresse.
Enregistre par paquets de 5 à 10 dans /home/user/marcio-mota-tech/prospection/travail/paid/tmp___TAG___N.jsonl (N = 1, 2, 3…) puis : cd /home/user/marcio-mota-tech/prospection && python3 -I outils/add_cand.py __TAG__ < ce_fichier
Objectif : __GOAL__ marques acceptées. Parcours toute la tranche avant de t'arrêter (sauf si l'objectif est atteint).
Réponse finale : le nombre d'ids acceptés et le dernier id, puis 2 lignes max (domaines traités, rendement, problèmes).
