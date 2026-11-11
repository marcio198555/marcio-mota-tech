# Fletch — jeu de flèches (Android)

Jeu de réflexion : chaque flèche doit sortir du plateau, à condition que rien
ne lui barre la route. Niveaux générés automatiquement et toujours résolubles,
défi du jour, thème clair ou sombre, 6 langues.

Revenus : publicités Google AdMob (une pause pub entre deux niveaux, au plus
un niveau sur deux, et des vidéos que le joueur choisit de regarder pour
obtenir des indices ou recharger ses cœurs).

Tous droits réservés — © Marcio Mota.

## Ce que contient cette branche

| Dossier | Rôle |
|---|---|
| `game/` | Le jeu lui-même : une page web (TypeScript + Canvas) assemblée en **un seul fichier** `dist/index.html`. |
| `android/` | L'application Android : une coquille Java qui affiche cette page en plein écran et lui apporte les publicités, les vibrations, la touche Retour et la sauvegarde. |
| `ci/` + `.github/workflows/fletch-android.yml` | La fabrication automatique de l'application à chaque modification. |
| `tools/` | Tests de bout en bout (un navigateur joue au jeu), captures d'écran, génération de l'icône. |
| `store/` | Icône et éléments de la fiche Google Play. |

## Fabriquer l'application

À chaque envoi sur la branche `fletch`, GitHub Actions :

1. vérifie le générateur de niveaux (400 niveaux + 365 défis du jour, tous résolubles) ;
2. assemble le jeu et le place dans l'application ;
3. compile l'application (version de test + version Play Store) ;
4. lance la version de test sur un émulateur Android : le jeu joue tout seul, les publicités de test s'affichent, des captures d'écran sont prises ;
5. dépose le tout sur la branche **`fletch-builds`** (un seul commit, remplacé à chaque fois) :
   `fletch-test.apk`, `fletch-release-unsigned.apk`, `fletch-release-unsigned.aab`, `STATUS.txt`, journaux, captures.

En local :

```bash
cd game && npm ci && npm test && npm run build
cp dist/index.html ../android/app/src/main/assets/index.html
cd ../android && ./gradlew assembleDebug        # demande le SDK Android
```

## Signature

Les fichiers de publication sortent d'ici **non signés**. La clé d'envoi
(« upload key ») n'est jamais dans ce dépôt ni dans GitHub : la signature se
fait à part, puis le fichier `.aab` signé est envoyé dans la Google Play Console.

## Réglages

Tout est dans `android/app.properties` (rien de secret) :

- `admobAppId`, `interstitialId`, `rewardedId` : les identifiants AdMob.
  Ceux fournis sont les **identifiants de test de Google** (publicités factices,
  aucun revenu). À remplacer par ceux du compte AdMob avant la publication.
- `maxAdRating` : classification maximale des publicités (`G`, `PG`, `T`, `MA`).
- `privacyUrl` : adresse publique de la politique de confidentialité.

Numéro de version : `versionCode` et `versionName` dans `android/app/build.gradle`
(augmenter `versionCode` de 1 à chaque envoi sur Google Play).

## Règles du jeu, en bref

- Toucher une flèche : elle part si toutes les cases devant sa pointe sont libres jusqu'au bord.
- Flèche bloquée : un cœur en moins (3 par niveau). Étoiles : 3 moins le nombre d'erreurs, 1 au minimum.
- Un indice gratuit par niveau, plus une réserve ; une vidéo en donne 2.
- Pause pub : jamais avant 3 niveaux gagnés, jamais pendant un niveau, au plus tous les 2 niveaux et à 70 secondes d'écart.

## Tests

```bash
cd game && npm test            # générateur de niveaux
python3 tools/e2e.py           # 52 contrôles : un navigateur joue avec de vrais touchers
```
