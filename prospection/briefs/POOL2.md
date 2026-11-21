# Mission RÉSERVOIR rapide (RX01 à RX08) — 03/11

Tu reçois 120 domaines (recherche/pool2/sNNN.txt), surtout des boutiques repérées les jours précédents et jamais contactées. Aucune recherche web : on lit les sites par lots, avec très peu de texte par page.

## Boucle, par paquets de 6 domaines
1. UN appel mcp__Exa__web_fetch_exa, maxCharacters 1500, avec les 6 pages d'accueil (https://<d>/).
2. UN appel mcp__Exa__web_fetch_exa, maxCharacters 700, avec la page contact/légale probable de chacun des domaines restés intéressants : .de/.at/.ch → /impressum ; .fr/.be/.lu → /mentions-legales ; .it → /contatti ; .es → /contacto ; .pt → /contactos ; .nl → /contact ; .pl → /kontakt ; sinon /contact. (Beaucoup de pages d'accueil montrent déjà l'adresse dans le pied de page : alors pas besoin.)
3. Pas de deuxième essai, sauf si la page d'accueil montre clairement le lien exact de la page contact.
Abandonne sans regret : site fermé / à vendre / en cessation, chaîne, marketplace, B2B pur, mono-marque, vêtements / cosmétiques / alimentaire, adresse absente ou masquée, adresse nominative ou de commandes.

## Ce qu'on garde (kind "shop")
Boutique en ligne indépendante multimarque (tech, maison, cuisine, café, outdoor, vélo, sport, photo, audio, gaming, informatique, outillage, jardin, animaux, bébé, musique, optique, pêche, couture, plongée, modélisme, drones, mobilité, sécurité, météo, nautisme, camping-car, aquariophilie, montres, chauffage…).
- "category" : OBLIGATOIRE, une clé parmi : coffee, 3dprint, lighting, flashlights, photo, audio, bike, outdoor, kitchen, appliances, smarthome, tools, garden, pets, baby, gaming, computer, music, astronomy, optics, fishing, sewing, diving, golf, fitness, health, beauty, rc, drones, mobility, phone, electronics, security, weather, marine, caravan, aquarium, watches, heating.
- "products" : 0, 1 ou 2 produits vus sur la page d'accueil (noms courts ≤ 40 caractères commençant par la marque, ≤ 500 €, mesurable et filmable). Si aucun produit n'apparaît, laisse [] : la catégorie suffit.
- "brands_examples" : marques vues (texte, séparées par des virgules), sinon "".
- "test_metric" : seulement si un produit est donné (power, noise, light, temp, time, weight, size, battery, speed ; light = source lumineuse, temp = produit qui chauffe/refroidit/mesure, speed = réseau, battery = produit à batterie).

## Contrôles avant d'écrire (par lots)
- grep -i du domaine dans ../envoi/sent_log.jsonl et ../envoi/queue_*.jsonl ;
- python3 -I ../../tools/check_brand.py --relaxed --agent TON_ID "Nom|domaine" "Nom2|domaine2" … ;
- Gmail mcp__Gmail__search_threads in:anywhere, 7 domaines par requête avec OR (domaine du site ET domaine de l'e-mail), plus une requête avec les noms entre guillemets. Si Marcio a déjà échangé avec eux → abandon.

## Écriture
Une ligne JSON par boutique validée dans recherche/TON_ID.jsonl, tout de suite :
{"agent":"TON_ID","kind":"shop","name","domain","email","email_source","email_lang","country","category","brands_examples","products":[…],"test_metric","ships_ch":"unknown","line_email":"","mx_ok":"not_checked","gmail_check":"clean"}
email_lang : "fr" (France, Belgique fr, Suisse romande, Luxembourg, Québec), "de" (Allemagne, Autriche, Suisse alémanique), sinon "en".

Traite les 120 domaines puis arrête-toi. N'envoie aucun e-mail. Réponse finale : 3 lignes max (écrits, abandonnés, raison principale).
