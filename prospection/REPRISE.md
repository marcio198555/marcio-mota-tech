# Reprise de la prospection (pour une nouvelle session)

Les sessions cloud repartent d'un conteneur vide : ce dossier contient ce qu'il faut pour continuer sans doublon.
Aucune donnée personnelle ici (adresse et téléphone restent hors dépôt, dans `travail/signature_privee.txt`).

## Démarrage
1. `bash prospection/outils/preparer_travail.sh` : recrée `prospection/travail/envoi/sent_log.jsonl` à partir de tous les journaux `prospection_envoyes_*.jsonl` (un e-mail envoyé = une ligne) et la liste d'exclusion.
2. Créer `prospection/travail/signature_privee.txt` (4 lignes, `{c}` à la place du pays) en recopiant la signature d'un e-mail déjà envoyé (Gmail, `in:sent subject:"Test idea"`).
3. Construire un lot : `PROSPECTION_BASE=prospection/travail python3 -I prospection/outils/build_perso.py LEADS.jsonl prospection/travail/envoi/queue_XX.jsonl ID- 43` (écrit aussi `queue_XX_gq.txt`, les requêtes Gmail de contrôle).
4. Envoi par un agent (jamais Haiku) : contrôle Gmail de chaque requête du `_gq.txt`, `mcp__Gmail__send_message` texte tel quel, puis `python3 -I log_sent_any.py queue_XX.jsonl ID1,ID2` dans `travail/envoi`. Ajouter ensuite les lignes du jour au journal `prospection_envoyes_AAAA-MM-JJ.jsonl` du dépôt.

## Règles (voir aussi CLAUDE.md)
- Jamais plus d'environ 380 e-mails sur 24 h glissantes, en comptant les envois manuels de Marcio (Gmail compte chaque destinataire, copies comprises).
- Jamais une société déjà présente dans Gmail (envoyés ou conversations) ni dans les journaux ; `build_perso.py` bloque aussi le même nom sur une autre extension.
- Adresse générique lue en clair sur le site de la société, jamais devinée, ni nominative, ni orders@ / impressum@ / privacy@.
- Pas de chiffres d'audience non vérifiés.

## Où trouver de nouveaux contacts
- `reservoir/s0NN.txt` : domaines déjà repérés, jamais contactés (surtout des marques). Méthode : `briefs/POOL3.md` (lecture de la page d'accueil et de la page contact par lots, sans recherche web).
- Recherche par niche et par pays : `briefs/MONDE.md` (sections « Méthode rapide » et « Méthode WebSearch »), `briefs/SHOPS.md`.
- Les briefs citent l'ancien dossier `/tmp/claude-0/…/scratchpad/equipe` : le remplacer par `prospection/travail`.
- Avec Tavily connecté (connecteur claude.ai) ou un accès réseau « Full », la recherche est bien plus rapide.

## Modèle d'e-mail (build_perso.py)
Boutique : 2 produits vus sur le site + une mesure affichée à l'écran (W, dB, lux, °C, s, g, mm, h, Mbit/s), sinon les marques vendues, sinon le rayon (`category`). Marque : 1 ou 2 de ses produits. Distributeur : marques représentées. Langues : fr, de, en.
