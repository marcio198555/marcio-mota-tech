# Instagram seulement : 2 Reels d'essai par jour (depuis le 21.11.2026)

**Décision de Marcio (21.11.2026, 8 h 30)** : « je veux tout annuler et avoir juste Instagram, je veux me consacrer
qu'à Instagram avec les Reels d'essai ; tu peux créer du contenu pour ça, mais tout le reste tu annules et tu effaces ».

Ce fichier prime sur tout le reste du dépôt (RUNBOOK, strategy.json, anciennes consignes) en cas de désaccord.

## Ce qui est arrêté
- **TikTok : plus rien.** Plus de vidéos, plus de carrousels, plus de programmation Buffer. Toutes les publications
  TikTok programmées de l'autopilote (et les 3 vidéos Fletch) ont été supprimées de Buffer le 21.11.
- **Stories Instagram de l'autopilote : arrêtées.** (Les 5 Stories Fletch du 21 au 24.11 et les 2 rappels du concours
  des 3 et 6.12 restent dans Buffer : Marcio a choisi de les garder. On n'y touche pas.)
- Toutes les tâches programmées ont été supprimées, sauf « Tirage concours GoXtreme » (7.12, gardée par Marcio).
  La tâche de 7 h 13 « Autopilot : programmation Buffer » est seulement désactivée (elle ne pouvait pas être effacée
  depuis sa propre session).
- `plan.json`, `strategy.json` et la page de suivi ne sont plus tenus à jour.

## Ce qui continue : une seule tâche, « Instagram : 2 Reels d'essai par jour »
Chaque jour, une seule tâche programmée :
1. **Publie 2 Reels d'essai** (jamais plus de 2 neufs par jour ; jamais un Reel normal) : les 2 plus anciennes
   entrées « en attente » de `reels_queue.json` (ordre du champ `prevu`), avec vidIQ, compte 28790973810544181,
   `trialParams: {graduationStrategy: "SS_PERFORMANCE"}`, `isAiGenerated` de l'entrée (procédure : RUNBOOK, bloc du
   03.11, point 2). Avant chaque publication : `git pull --rebase` et relire la file (jamais deux fois la même entrée).
   On ne compte que les Reels de l'autopilote publiés le jour même (champ `publie_le`).
2. **Garde une réserve** : s'il reste moins de 6 entrées « en attente » après la publication, produit 2 nouvelles
   vidéos et les ajoute à la file (le jour libre suivant, `prevu` à 11:00 et à 19:00).
3. **Le lundi** : regarde les chiffres des Reels d'essai de la semaine (vidiq_instagram_owner_insights, mode reels)
   et note dans `learnings.md` ce qui marche et ce qui ne marche pas ; les sujets suivants en tiennent compte.

## Recette des vidéos (Instagram)
- Bloc « Changements du 20.11.2026 (Instagram seulement) » du RUNBOOK : format V seulement (voix + écran animé),
  59 à 65 s ; accroche en duel « Toi… Ton collègue… » sur s01 à s03 avec un nombre ou un produit nommé dès s01 ;
  rotation des 4 familles (Suisse contre France, téléphone/batterie, électricité d'un appareil, télé/écran) ; aucun
  sujet d'eau ; tenir jusqu'à la fin (s02 annonce la fin, le chiffre final jamais avant).
- Sujets : d'abord la liste du 20.11 dans `learnings.md`, puis les idées de `plan.json` pas encore faites. Jamais un
  sujet déjà fait (voir `plan.json` et `reels_queue.json`), jamais un produit reçu d'une marque.
- Faits (§ 4), script (§ 5), voix Chatterbox par le pont GitHub (§ 11.7), montage (§ 6, modèles `days/day55` et
  `days/day59`), contrôle par un agent neuf et Whisper (§ 7, § 11.5).
- **Fin propre à Instagram** : dernier segment « Abonne-toi : chaque jour, un chiffre vérifié sur les objets de ta
  maison. », sans @marcio.mota8, sans « ce soir » ni « demain », sans carte TikTok. Si une vidéo garde quand même une
  fin TikTok, la couper avec `tools/reel_cut.sh NN` et vérifier l'image de contrôle.
- Cloudinary : public_id `tiktok-autopilot/reels/dayNN_reel` (depuis raw.githubusercontent, comme § 8).
- Légende Instagram (§ 8.5b) : ligne 1 < 125 caractères, mot-clé dans les 55 premiers ; 1 ou 2 paragraphes avec
  seulement les faits vérifiés et leurs sources ; « Voix de synthèse. » ; un seul appel à l'action ; exactement
  5 hashtags (sujet, catégorie, audience, #suisseromande, #jemesuretout). Appel à l'action : jusqu'au bilan du lundi
  30.11, jour `prevu` impair → « Abonne-toi : chaque jour, un chiffre vérifié sur les objets de ta maison. »
  (`cta: "abonnement"`), jour pair → « Envoie-la à … » (`cta: "envoi"`) ; ensuite, celui que le bilan a retenu.
- Numéros : à partir de 94 (le prochain numéro libre de `days/`).

## Messages à Marcio
Seulement : une publication en erreur ; vidIQ déconnecté ; un Reel d'essai qui dépasse 1 500 comptes touchés (lui
seul peut le partager à ses abonnés : « Afficher les insights d'essai », puis « Partager avec tout le monde ») ;
le résumé du lundi en deux phrases. Toujours en français simple, sans jargon.
