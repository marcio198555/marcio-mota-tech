---
name: redaction-francaise
description: Règles de rédaction française irréprochable, à charger dès qu'on produit du contenu destiné à être lu en français, copy de page, e-mail, annonce, post social, microcopy, titre, CTA, script, documentation, article. Couvre ce qu'un texte doit contenir (fait vérifiable, mécanisme, lecteur adressé), la typographie française (insécables, guillemets, apostrophes, pas de tiret cadratin, nombres), les calques de l'anglais à bannir, les tics d'IA, les structures qui trahissent une génération automatique, l'humanisation du texte et la relecture en passes, les accords et le registre tu/vous. Prime sur les exemples anglophones des skills de rédaction. Ne pas charger pour du code sans texte affiché.
user-invocable: true
allowed-tools:
  - Read
  - Grep
  - Bash
---

# Français irréprochable

S'applique **dès que tu produis du contenu destiné à être lu en français** : copy de page, e-mail,
annonce, post social, microcopy, titre, CTA, script, article, etc. Ces règles **priment sur les
exemples et règles de style anglophones** des skills (copywriting, copy-editing, emails,
ad-creative, social…), qui sont calqués sur l'anglais.

**Principe fondateur :** un bon texte français n'est *jamais* une traduction de l'anglais. Il a son
propre rythme, sa propre typographie, ses propres tournures. Vise un rendu de rédacteur français
professionnel, pas un rendu « traduit ».

Les sections 5 et 6 sont adaptées de `stop-slop` (Hardik Pandya, MIT), transposées au français.

## 1. Ce que le texte doit contenir

Les sections 2 à 5 disent quoi retirer. Celle-ci dit quoi mettre, et elle passe en premier.
Un texte qui se contente d'éviter les formules interdites devient lisse, sans faute et creux :
c'est le défaut le plus facile à produire et le plus difficile à voir, parce qu'aucune ligne
n'accroche l'œil. **Retirer une formule creuse sans la remplacer par un fait ne corrige rien.**

**Un fait vérifiable par paragraphe.** Chiffre, unité, montant, date, norme, nom propre, geste
précis, étape nommée. Un paragraphe qui n'en porte aucun décrit du vide : il occupe la place
d'une information sans en apporter. Le contrôle est mécanique (§7), le remède ne l'est pas.
Il faut aller chercher le fait, pas reformuler la phrase autour du trou.

**Le test de substitution.** Si la phrase reste vraie en remplaçant ton sujet par n'importe
quel concurrent, produit ou métier, elle ne dit rien. « Une solution pensée pour vous faire
gagner du temps » passe le test partout, donc ne signifie rien nulle part. Réécris jusqu'à ce
que la phrase ne puisse décrire que *cette* chose-là.

**Un mécanisme, pas une valeur.** Décris ce qui se passe, pas ce que le lecteur est censé en
retirer. « Bloque la commande tant que le relevé n'est pas saisi » se vérifie. « Simplifie
votre gestion » ne se vérifie pas. La valeur, le lecteur la déduit ; le mécanisme, lui seul
peut le lui apprendre.

**Le lecteur dans la pièce.** Adresse-le directement plutôt que de le décrire à distance.
« Beaucoup d'utilisateurs se retrouvent démunis face à… » le range dans une statistique.
« Vous ouvrez le devis et le montant a doublé » le met devant la chose. `vous` (ou `tu`) bat
`on`, `l'utilisateur`, `le client`, `chacun`.

**Le test de sortie.** À la dernière ligne, le lecteur doit savoir quoi faire, quoi choisir ou
quoi vérifier. S'il sait seulement que « c'est important » ou que « ça compte de plus en plus »,
le texte a échoué, quelle que soit sa tenue.

**Le mot du lecteur d'abord, le terme technique ensuite.** Employer son vocabulaire, puis lui
donner le terme exact une fois, en gras, et le réutiliser nu ensuite. Jamais l'inverse, jamais
un acronyme supposé connu.

**Ouvrir sur une scène, pas sur une catégorie.** La première phrase montre une situation
identifiable, pas le domaine dont on va parler. « Le devis arrive à 4 200 € pour une pièce de
9 m² » ouvre ; « La rénovation est un sujet complexe » n'ouvre rien.

**La réserve écrite en clair.** Ce qu'on ne sait pas, ce qui ne marche pas, la limite du
conseil : ça se dit en pleine phrase, pas en note de bas de page. Un chiffre non sourcé porte
sa réserve dans le corps du texte (« ce n'est pas une moyenne mesurée, c'est un ordre de
grandeur »). L'honnêteté est un trait de style, pas une mention légale.

### Lexique de substitution

Un verbe concret vaut mieux qu'une périphrase administrative.

| À écrire | Pas |
|---|---|
| comptez, prévoyez, visez | il faut prévoir, il convient de prévoir |
| poser, tirer, couler, régler, brancher | procéder à l'installation de, effectuer la mise en place |
| vous | l'utilisateur, le client final, chacun, on |
| ça fuit, ça se fissure | présente un défaut d'étanchéité, une altération structurelle |
| coûte 29 € par mois | à partir de tarifs attractifs |
| en trois étapes, en deux jours | rapidement, en un rien de temps |
| parce que, donc, sinon | dans le but de, afin de, dans une optique de |

## 2. Penser en français, pas traduire l'anglais

- **Bannir les calques structurels** : « Vous voulez X ? Nous avons Y. », « C'est simple. »,
  « En quelques clics. », « N'hésitez pas à… », « Et si… ? », « Imaginez un monde où… ». Ces
  structures trahissent une traduction.
- **Remplacer les formules de réclame par un fait** : *Découvrez, Boostez, Optimisez, Dopez,
  Révolutionnaire, Incontournable, Ultime, En un clin d'œil, En toute simplicité, Que vous soyez…
  ou…*, et la répétition de *grâce à / permet de / afin de / au cœur de / véritable*. Le lecteur
  les a lues mille fois et saute la phrase qui les porte.
- **Franglais** (*insights, workflow, game-changer, deal, must-have*) **uniquement** si l'audience
  l'emploie réellement dans la vraie vie. Sinon, mot français.
- Préférer le mot **concret et courant** au mot abstrait ou ronflant.

### Formules à supprimer, liste opérationnelle

Chaque suppression laisse un trou. Le combler avec un fait du §1, pas avec une autre formule.

**Ouvertures creuses.** *De nos jours · À l'heure où · Dans un monde où · Il est important de noter
que · Il convient de · Force est de constater · Comme vous le savez · Sachez que · Voici tout ce
qu'il faut savoir sur*

**Liants automatiques en tête de paragraphe.** *En effet · De plus · Par ailleurs · Ainsi ·
Néanmoins · Cependant · En outre · Toutefois*. Test : supprime le liant. Si la phrase tient debout,
il était décoratif. Un sur trois suffit.

**Superlatifs de remplissage.** *véritable · incontournable · essentiel · crucial · indispensable
(sauf obligation réelle) · un allié de taille · la clé réside dans · un jeu d'enfant · sans plus
attendre*

**Fermetures molles.** *En conclusion · Pour conclure · Vous l'aurez compris · N'hésitez pas à ·
En espérant que cet article · Il ne vous reste plus qu'à*

**Adverbes en -ment.** Traque-les et coupe-les : *particulièrement, réellement, véritablement,
notamment, simplement, facilement, rapidement*. Ils affaiblissent la phrase qu'ils prétendent
renforcer. Exception : les adverbes techniques qui portent une information
(*perpendiculairement, horizontalement, trimestriellement*).

**Cadrages d'époque et raclements de gorge.** *À l'ère de · en constante évolution · dans le
paysage actuel · au cœur de (au figuré) · il est à noter · notons que · plongeons dans · explorons
ensemble · cela étant dit · à cet égard · en d'autres termes · soyons clairs · la vérité, c'est que*

**Verbes valises.** *tirer parti de · mettre en exergue · jouer un rôle clé · naviguer dans (au
figuré) · ouvrir la voie · libérer le potentiel · favoriser l'engagement · s'impose comme · fait
office de*. Le verbe « être » ou un verbe d'action précis les remplace presque toujours.

**Calques et autorité vague.** *faire sens · adresser un problème · impacter · quand il s'agit de ·
les études montrent · les experts s'accordent*. Une étude se nomme, avec son auteur et sa date, ou
la phrase tombe.

Ces trois listes viennent d'un relevé de septembre 2026 sur les guides francophones de détection
(Wikipédia, page d'aide « Identifier l'usage d'une IA générative », Projet Voltaire, Blog du Modérateur, Journal
du Net, newsletters de rédaction) et sur la liste anglophone « Signs of AI writing ».

## 2 bis. Calques de l'anglais

Aucune liste ne couvrira tous les calques : il en naît un neuf à chaque texte. Les tableaux
ci-dessous servent d'exemples, et le contrôle qui marche est un test, appliqué dans une relecture
à part.

**Le test de rétro-traduction.** Retraduis la phrase en anglais, mot pour mot. Si elle tombe
en anglais idiomatique sans rien changer, et qu'un artisan au téléphone ne la dirait pas ainsi,
c'est un calque : réécris-la à partir du sens, jamais à partir des mots. « Votre cuisine, travail
par travail » donne *your kitchen, job by job* : calque. « Chiffrez chantier par chantier » ne
repasse pas en anglais sans perte : c'est du français.

**La relecture de fin d'exercice.** Une fois le texte écrit et les autres contrôles passés,
relis chaque phrase ajoutée avec ce seul prisme, sans rien chercher d'autre : rétro-traduction,
mot anglais resté, faux ami, tournure traduite. Une relecture qui cherche tout en même temps
laisse passer les calques, parce qu'ils sont grammaticalement corrects. Dans un projet qui l'a
outillée, un crochet de fin de séance l'impose.

### Faux amis

| Calque | Sens anglais | Mot juste | Reste juste quand |
|---|---|---|---|
| rendre un résultat | *returns* | donne, calcule, indique | rendre + attribut : « rend le joint invisible » |
| adresser un problème | *address* | traiter, régler | adresser un courrier |
| impacter | *impact* | toucher, changer, peser sur | le nom : « impact acoustique » |
| réaliser que | *realize* | se rendre compte que, comprendre | réaliser un travail |
| délivrer un résultat | *deliver* | fournir, produire, livrer | délivrer un permis, un certificat |
| faire sens | *make sense* | avoir du sens, tenir debout | jamais |
| être en charge de | *be in charge of* | être chargé de, s'occuper de | la prise en charge |
| être en capacité de | *be able to* | pouvoir | jamais |
| opportunité | *opportunity* | occasion | l'opportunité d'une décision, son caractère opportun |
| consistant | *consistent* | cohérent, constant, régulier | « un enduit consistant », épais |
| supporter un format | *support* | accepter, prendre en charge | supporter une charge, un poids |
| initier un projet | *initiate* | lancer, engager | initier quelqu'un à un geste |
| digital | *digital* | numérique | empreinte digitale |
| éventuellement | *eventually* | finalement, à terme | « le cas échéant », son sens français |
| définitivement | *definitely* | sans aucun doute | « pour toujours » : supprimer définitivement |
| dédié | *dedicated* | réservé à, propre à | vocabulaire technique établi : circuit dédié |
| basé sur | *based on* | fondé sur, calculé d'après | toléré, à éviter dans un texte soigné |
| un travail, chaque travail | *a job* | un chantier, un poste ; « les travaux » au pluriel | le travail comme activité : « du travail soigné » |
| sécuriser un budget | *secure* | obtenir, réserver | sécuriser un chantier, le rendre sûr |
| challenger | *challenge* | remettre en question, mettre à l'épreuve | jamais |
| venir avec, venir en | *to come with, to come in* | être fourni avec, se vendre en, s'accompagner de ; « Travaux liés » | venir, se déplacer : « l'artisan vient avec son échafaudage » |
| une alternative | *an alternative* | une autre solution, une possibilité | le choix entre deux voies |
| résulter en | *to result in* | entraîner, provoquer, aboutir à | résulter de |
| rencontrer une exigence | *to meet* | satisfaire à, être conforme à | rencontrer quelqu'un |
| sauver du temps | *to save* | gagner du temps, économiser ; enregistrer un fichier | sauver une vie |
| questionner un choix | *to question* | mettre en doute, s'interroger sur | questionner quelqu'un |
| drastique | *drastic* | radical, massif, draconien | jamais |
| significatif (quantité) | *significant* | important, notable | qui a un sens, ou un effet juridique |
| spécifiquement | *specifically* | précisément, plus exactement | « propre à » : primaire spécifique |
| au final | *in the end* | finalement, au bout du compte | jamais |
| juste (intensif) | *just* | vraiment, ou rien | « juste » = exact |
| versus, vs | *versus* | ou, contre, face à | une adresse de page déjà publiée |

### Mots anglais restés

Les mots du métier de celui qui écrit glissent dans le texte : *wording* (formulation),
*feature* (fonction), *home* (accueil), *template* (gabarit, modèle), *item* (élément, ligne,
article), *slot* (créneau), *flow* (parcours), *scope* (périmètre), *check* (contrôle,
vérification), *fallback* (repli), *layout* (mise en page), *dashboard* (tableau de bord),
*onboarding* (premiers pas), *feedback* (retour, avis), *tooltip* (infobulle), *snippet*
(extrait), *workflow* (enchaînement, procédure), *roadmap* (feuille de route), *preview*
(aperçu), *release* (version). Ils sont interdits dans un texte public, et à remplacer dans un
plan ou un compte rendu dès qu'un mot français existe. Restent les noms propres de produits et
le terme que l'audience emploie réellement (§ 2).

### Tournures traduites

| Calque | Anglais | En français |
|---|---|---|
| « Prêt à vous lancer ? » | *Ready to…?* | l'action directement : « Créez votre premier chantier. » |
| « Le saviez-vous ? » | *Did you know?* | le fait directement |
| « Gardez à l'esprit que » | *Keep in mind* | « Retenez que », « N'oubliez pas que », ou rien |
| « En termes de » | *In terms of* | « pour », « côté », « en matière de » |
| « Ça fait la différence » | *It makes a difference* | dire laquelle ; « faire la différence entre A et B » reste juste |
| « C'est là que X entre en jeu » | *That's where X comes in* | « Il faut alors X » |
| « À la fin de la journée » (figuré) | *At the end of the day* | « au bout du compte » |
| « N'hésitez pas à » | *Don't hesitate to* | l'impératif nu |
| « Tout ce que vous devez savoir sur » | *Everything you need to know* | le sujet nommé |
| « En d'autres mots » | *In other words* | « autrement dit » |
| « Être sur la même page » | *To be on the same page* | « être d'accord » |
| « Assurez-vous que », en série | *Make sure* | « Vérifiez que », « veillez à » |
| « X par X » forgé | *job by job, item by item* | garder ceux qu'un Français dit (pièce par pièce, poste par poste, ligne par ligne), sinon « un par un », « l'un après l'autre » |
| Noms empilés sans préposition | *noun adjuncts* | « liste courses chantier » devient « liste de courses du chantier » |
| Possessif en série | *Your kitchen, your budget, your rules* | une seule fois, là où il porte un sens |

### Anglicismes de syntaxe

Les plus durs à voir, parce que chaque mot est français. Seule la construction vient de l'anglais.

- **L'ordinal avant le nombre.** « les premiers cinq jours » devient « les cinq premiers jours ».
  « Les premières 24 heures » reste admis quand le groupe fait bloc.
- **« Comparé à » en tête de phrase.** « Comparé au placo, le Fermacell pèse plus » devient « Par
  rapport au placo » ou « Le Fermacell pèse plus que le placo ».
- **Le passif impossible.** « La question a été répondue » : « répondre » demande « à ». Écrire
  « vous avez répondu à la question ».
- **La préposition calquée.** « satisfait avec » devient « satisfait de », « m'aider avec la pose »
  devient « m'aider à poser », « sur le site » devient « dans le site » ou « sur la page » selon le
  sens, « sur un comité » devient « membre d'un comité ».
- **Le possessif devant une partie du corps.** « Lavez vos mains » devient « lavez-vous les mains ».
  « Protégez vos mains » reste juste.
- **Le nom placé avant celui qu'il précise.** « Murmur chiffrage » ou « fiche ouvrage » deviennent
  « le chiffrage de Murmur », « la fiche du travail » : en français, le nom précisé vient d'abord.

## 3. Typographie française (non négociable)

- **Espace insécable** avant `: ; ! ?` et à l'intérieur des guillemets : « comme ceci ».
- **Guillemets français** « » (jamais `" "`). **Apostrophe typographique** ’ (jamais `'`).
  **Points de suspension** … en un seul caractère (jamais `...`).
- **Pas de *title case*** : les titres et boutons sont en **casse de phrase** (seule la 1re lettre et
  les noms propres prennent la majuscule). → « Commencez votre essai gratuit », pas « Commencez Votre
  Essai Gratuit ».
- **Jamais de tiret cadratin `—`** dans le corps du texte. Le remplacer par `,` `.`, `:` ou des
  parenthèses (sauf règle projet plus stricte : certains projets excluent aussi les parenthèses,
  auquel cas suivre le tableau de remplacement propre au projet).
- **Nombres et unités à la française** : virgule décimale (`3,5`), espace insécable pour les milliers
  (`12 000`), symbole après le nombre avec espace (`29 €`, `80 %`, `24 h`, `15 min`).
- **Fourchettes en toutes lettres** : `entre 2 et 4 heures`, pas `2-4h`.
- **Majuscules accentuées** : `À`, `É`, `Ç` en début de phrase ou de titre.
- **Minuscule après le deux-points** : « Astuce : pensez à… », pas « Astuce : Pensez à… ». La
  majuscule ne reste que devant un nom propre ou une citation.
- **Listes à puces** : pas de majuscule initiale sauf si l'élément est une phrase complète.
  Ponctuation de fin homogène sur toute la liste.

## 4. Tournures, accords et rythme

- **Registre cohérent** : choisis tutoiement **ou** vouvoiement selon l'audience et le projet, puis
  tiens-t'y sur **tout** le texte. En l'absence de consigne, aligne-toi sur l'existant du projet ou
  demande. Ne tranche pas au hasard et n'alterne jamais.
- **Accords vérifiés systématiquement** : genre, nombre, participes passés (avec *avoir* / *être*),
  accord de l'adjectif, *leur/leurs*, *quel(le)(s)*, *tout/tous/toute(s)*.
- **Rythme français** : le staccato qui marche en anglais (« Fast. Simple. Done. ») tombe à plat en
  français. Varie la longueur des phrases ; laisse-les respirer.
- **CTA** = verbe d'action naturel en français (« Créer mon compte », « Demander une démo », « Voir
  les tarifs »), **pas** un calque de l'anglais ni une rafale de `!!`.
- **Ponctuation sobre** : pas de points d'exclamation en série ; l'emphase passe par le mot juste,
  pas par la typographie.
- **Liaisons naturelles** : varie les connecteurs (« mais, pourtant, du coup, en clair,
  c'est-à-dire ») au lieu de calquer « however / moreover / in order to ».

## 5. Structures à casser

Ces tournures ne sont ni des anglicismes ni des fautes. Ce sont les patrons de phrase que la
génération automatique produit par défaut, et que le lecteur reconnaît sans savoir les nommer.

- **Le contraste binaire.** « Ce n'est pas X, c'est Y. » « Non pas X, mais Y. » Écris Y directement.
- **La triade systématique.** « rapide, simple et efficace ». Garde le nombre d'éléments que le
  propos demande, et un exemple concret plutôt que deux adjectifs.
- **La question rhétorique en chaîne.** Une question en intertitre est utile. Trois questions
  d'affilée dans un paragraphe sont une posture.
- **La fragmentation dramatique.** Phrase courte. Très courte. Pour l'effet. Réserve la phrase très
  courte aux vraies ruptures, et qu'elles restent rares.
- **L'inanimé qui agit.** « Le budget explose », « la méthode s'impose », « la plainte devient un
  correctif ». Nomme qui fait l'action.
- **La voix passive.** « La résine doit être appliquée sur… » devient « Appliquez la résine sur… ».
  Sur un texte de méthode, l'impératif est la forme naturelle.
- **Le méta-commentaire.** « Dans cet article, nous allons voir », « Passons maintenant à »,
  « Comme nous l'avons vu plus haut ». Supprime, et laisse le texte avancer.
- **La déclaration vague.** « Les conséquences sont importantes. » Nomme la conséquence :
  « La cloison se gorge d'eau et le placo se délite en six mois. »
- **La phrase à encadrer.** Si un passage ressemble à une accroche LinkedIn ou à une citation
  d'affiche, réécris-le.
- **Le catalogue froid.** Un comparatif, une liste d'options ou un tableau qui se termine sans
  recommandation laisse au lecteur le travail qu'il était venu déléguer. Tranche.

- **L'addition en balancier.** « Non seulement rapide, mais aussi fiable », « Il ne s'agit pas
  seulement de peindre, mais de protéger », « Plus qu'un simple outil, un compagnon ». Même
  défaut que le contraste binaire, sans négation : dire la chose une fois.
- **La queue en participe présent.** « …, soulignant l'importance de la préparation », « …,
  ouvrant de nouvelles possibilités ». Une phrase qui finit sur un commentaire d'elle-même :
  couper à la virgule.
- **La question-réponse éclair.** « Le résultat ? Des murs secs. », « La bonne nouvelle ? Ça se
  répare. » Écrire la réponse directement.
- **Le triplet en phrase seule.** « Simple, rapide, efficace. » Garder un seul adjectif, celui
  qui se vérifie.
- **La pseudo-clivée.** « Ce qui coûte, c'est la reprise », « Ce qui décide, c'est le dormant ».
  Une fois passe ; en série, c'est une signature. Écrire Y directement : « La dépense vient de la
  reprise. »
- **L'adversaire imaginaire.** « Contrairement à une idée reçue », « On pourrait croire que ». Le
  texte réfute une opinion que personne n'a exprimée. Donner le fait sans le mettre en scène.
- **Le lien flou.** « en lien avec », « associé à », « lié à » à la place de la relation réelle.
  « La fissure est liée au retrait » devient « la fissure vient du retrait de l'enduit ».
- **L'évitement du verbe « être ».** « constitue », « s'avère », « se veut », « représente un
  véritable ». « Le primaire constitue une étape essentielle » devient « le primaire est
  indispensable », et encore mieux, la raison.
- **Les précautions empilées.** « pourrait potentiellement », « il semblerait que cela puisse ».
  Garder une seule réserve, celle qui porte une incertitude réelle.
- **Les absolus paresseux.** « toujours », « jamais », « tous les bricoleurs », sans fait derrière.
- **La réserve générique.** « Les données précises sont limitées. » Une bonne réserve nomme ce qu'on
  ignore et pourquoi (§ 1).
- **Le texte qui parle de lui-même.** « Ce guide complet vous accompagne… », « Cette section
  détaille… ». Le lecteur voit ce que le texte fait ; il n'a pas besoin qu'on le lui annonce.
- **Trois phrases de suite sur le même sujet.** « Le primaire… Il… Il… » : varier l'attaque, ou
  fondre deux phrases.
- **L'ouverture en « Concrètement, » ou « En pratique, » à chaque paragraphe.** Une fois par
  texte au plus.
- **Le tableau qui aurait dû être une phrase.** Deux lignes et deux colonnes se disent en une phrase.
- **Le plan qui se répète.** La même matière reprise sous plusieurs intertitres, ou un intertitre
  redit mot pour mot par la phrase qui le suit (« Le temps de séchage », puis « Le temps de séchage
  est une étape clé »).
- **Les sections calibrées.** Toutes les sections font deux ou trois paragraphes, tous les
  paragraphes la même longueur. Laisser une section courte quand elle a peu à dire.
- **Les intertitres en question, en série.** Une question en intertitre aide ; cinq de suite font
  un gabarit. La FAQ balisée en est exemptée.
- **La puce à libellé gras en série.** « * **Rapidité :** … » sur toute une liste, puis sur toutes
  les listes du site. Réservée aux listes de définitions ou de valeurs ; une énumération ordinaire
  s'écrit en phrase ou en puces simples.

### 5 bis. Les motifs de série

Les structures du § 5 se voient dans un texte. Celles-ci se voient surtout d'un texte à l'autre :
chacune passe sur une page, et c'est leur retour qui signe la génération automatique. Elles
naissent quand une bonne règle (ouvrir sur une scène, un fait par paragraphe, un encart par texte)
s'applique mécaniquement à toute une série. Le lecteur qui lit trois pages du même site reconnaît
le moule avant d'avoir lu le fond, et un texte sans aucun tic du § 2 peut sonner généré pour
cette seule raison.

| Motif | À ne pas reproduire | Quota par texte | Remède |
|---|---|---|---|
| Contraste binaire, y compris en chute | « n'est pas un budget, c'est un souvenir », « se décide au relevé, pas au produit. » | 1, jamais en première phrase, en intertitre ni en fin de section | Écrire Y directement |
| Superlatif d'exclusivité | « le seul poste qui », « la seule chose qui sépare », « le vrai sujet », « qui décide de tout » | 0 comme intensif | « Seul » reste quand l'exclusivité est un fait vérifiable |
| Omniscience | « que personne ne lit », « tout le monde confond », « l'erreur classique », « la plupart des pages évitent » | 0 sans source | Nommer le fait, pas ce que les autres ignorent |
| Nombre annoncé | « trois choses », « deux vérifications précèdent », « Voici les 3 chiffres » | 1, et recompté | Entrer par le premier élément ; si le nombre reste, recompter la liste |
| Maxime de chute | « l'étude coûte moins cher que le doute », « Le carrelage habille, le SPEC protège. » | 0 | Finir sur un fait, un chiffre ou une consigne |
| Balance avant, après | « deux minutes maintenant, deux jours après » | 1 | Dire le coût réel une fois, sans symétrie |
| Intertitre en apposition | « Où poser le pare-vapeur, l'étape que l'on saute » | 0 | L'intertitre nomme le sujet, rien après la virgule |
| Scène gabaritée | « La cloison est montée, les bandes sont poncées, la peinture est sèche. », « Samedi, 14 h 15. », « Trois semaines plus tard, » | selon la rotation des ouvertures du projet | Un détail vécu dans une phrase ordinaire |
| Retour à la scène pour la requalifier | « Le rouleau du début n'était pas un mauvais produit, c'était… » | 0 | La conclusion avance, elle ne rejuge pas l'ouverture |
| Verbe-juge, verbe de dramatisation | « le pot tranche », « le manomètre ment », « tient en une phrase », « se joue », « ne se rattrape pas », « ne se négocie pas » | 1 pour toute la famille | Un verbe d'action, avec un sujet humain quand c'est possible |
| Réassurance en anaphore | « Pas de spam, pas de revente. », « Tes chantiers, eux, n'ont pas bougé. » | 0 | Dire ce qui se passe réellement, en une phrase |
| Promesse répétée | la même garantie trois fois sur une page | 1 par page | La dire là où elle sert, une fois |
| Chiffre à effet | « 99 % des particuliers », « dix à cinquante fois » | 0 sans source | Sourcer, ou donner l'ordre de grandeur en mots avec sa réserve |
| Méta par la négative | « Cet article ne vous expliquera pas… », « C'est le passage le plus important de cet article » | 0 | Commencer par ce que le texte donne |
| Phrase recopiée | une phrase de plus de 12 mots identique sur deux pages | 0 | Réécrire pour la page, ou renvoyer à celle qui la porte |

**Le fait plaqué.** Appliqué mécaniquement, « un fait par paragraphe » (§ 1) produit des chiffres
collés pour tenir la règle, un prix de plaque au milieu d'un paragraphe qui n'en a pas besoin. Un
paragraphe sans fait se supprime ; il ne se rembourre pas.

**Varier d'un texte à l'autre.** Avant d'écrire un texte d'une série (articles, fiches, pages
d'outils), relis l'ouverture, les intertitres et la fin des deux ou trois textes voisins : ce qu'ils
emploient déjà se remplace. Un gabarit fixe la structure, jamais les phrases.

### 5 ter. Le dialecte des agents

Quand le même agent écrit le code d'un site et ses textes, son vocabulaire de travail passe dans
la page publique. Aucun de ces tics n'est une faute : ce sont des mots français détournés de leur
sens courant, et c'est le lecteur non développeur qui les trouve étranges. Mesuré sur un site de
225 000 mots en septembre 2026 : près de 90 phrases, alors que les tics grand public du § 2 y
étaient presque absents.

| Motif | À ne pas reproduire | Quota par texte | Remède |
|---|---|---|---|
| « Rendre » pour « produire un résultat » (*returns*) | « l'outil rend la section en mm² », « ce que chaque calculateur demande et rend » | 0 | calcule, donne, en déduit, indique, prépare. « Rendre » + attribut reste juste : « rend le joint invisible » |
| La chose qui juge | « la hauteur départage la douche et le receveur », « le chiffre qui commande tout », « la logique qui gouverne », « cette page dit lequel est lequel » | 1 | Un sujet humain et un verbe d'action : « selon la hauteur disponible, vous aurez une douche ou un receveur » |
| Mise en relief répétée | « c'est lui qui », « c'est elle qui », « c'est là que », « voilà pourquoi » | 1 | Le sujet directement : « elle engage le fabricant » |
| Tournures pronominales en série | « ce qui se fige », « se décide », « se comptent », « se cotent », sept dans un même article | 3 | L'impératif ou un sujet nommé : « cotez les évacuations », « arrêtez l'épaisseur du sol » |
| Virgule avant « et » en fin d'énumération | « le budget, les achats, l'ordre des travaux, et quoi faire » | 0 | Pas de virgule avant le dernier élément d'une liste. Elle reste avant un « et » qui ouvre une nouvelle proposition |

Deux réflexes pour l'agent qui rédige : relire chaque phrase dont le sujet est une chose et le
verbe un verbe de jugement (dire, décider, départager, commander, trancher, gouverner) ; et ne
jamais employer dans un texte public un mot qu'il a utilisé dans le code ou le commit de la même
séance sans vérifier qu'il a le même sens pour un lecteur ordinaire.

## 5 quater. Humaniser sans abîmer

Retirer les tics ne suffit pas, et les retirer mal en crée d'autres. Un texte humain se reconnaît
à ce qu'il contient : un détail vécu (« le seau de colle a croûté pendant la pause de midi »), un
avis assumé (« je déconseille le multicouche à sertir pour un premier chantier »), une imprécision
honnête (« entre deux et quatre heures selon la température »), un rythme qui suit la pensée. Il
emploie le verbe « être », le mot courant, la répétition quand le terme est technique.

Trois défauts naissent des corrections elles-mêmes :

- **Le staccato fabriqué.** Couper des phrases ordinaires pour « varier le rythme » donne un texte
  haché. On ne coupe qu'une phrase trop longue pour être lue d'une traite.
- **Le texte poncé.** À force de retirer liants, adverbes et nuances, il ne reste qu'une suite
  d'affirmations lisses. Garder « mais », « donc », « en général », « peut-être » quand ils portent
  un sens : la règle du § 2 ne vise que le liant décoratif.
- **La rotation de synonymes.** L'école apprend à éviter la répétition ; dans un texte technique,
  « ragréage », « enduit de lissage » et « autolissant » pour la même chose égarent le lecteur.
  Choisir un terme et le garder.

Enfin, ne jamais inventer un fait pour combler un trou (§ 1) : le demander, ou couper le
paragraphe.

Les guides anglais comptent aussi parmi les signes d'IA les guillemets courbes et le tiret
cadratin. Ni l'un ni l'autre ne s'importe : en français, guillemets et apostrophes courbes sont
obligatoires (§ 3), et le tiret cadratin est proscrit pour des raisons de typographie.

## 6. Ce que le texte livré tient

Le texte livré tient chacun de ces points :

1. **Aucun paragraphe sans fait vérifiable** (§ 1). C'est le premier point parce que c'est celui
   qu'on saute.
2. Aucune phrase ne survit au test de substitution : rien qui reste vrai pour n'importe quel
   concurrent.
3. Aucune phrase ne sonne traduite : la relecture de fin d’exercice du § 2 bis a été faite, phrase ajoutée par phrase ajoutée.
4. **Tous les accents et diacritiques** sont présents (jamais d'ASCII à la place : « é » pas « e »,
   « à » pas « a »).
5. Les **accords** sont justes, participes passés et adjectifs compris.
6. La **typographie** suit le § 3 : espaces insécables, guillemets « », apostrophes ’, pas de tiret
   cadratin, nombres à la française.
7. Le **registre** tu/vous est homogène d'un bout à l'autre.
8. Aucune formule des listes du § 2 ni anglicisme injustifié ne reste.
9. Aucune structure du § 5 ne reste en place.
10. Aucun motif du § 5 bis ni du § 5 ter au-delà de son quota, et aucune phrase reprise d'un texte voisin.
11. La réécriture n'a rien abîmé (§ 5 quater) : ni fait perdu, ni staccato, ni synonymes en rotation.
12. La relecture en passes du § 6 bis a été faite.

Cinq questions départagent un texte correct d'un bon texte :

| Dimension | Question |
|---|---|
| Concret | Chaque paragraphe apporte-t-il un fait, un geste ou une décision ? |
| Rythme | Les longueurs de phrase varient-elles, ou est-ce métronomique ? |
| Confiance | Le texte respecte-t-il l'intelligence du lecteur, sans surexpliquer ? |
| Authenticité | Un professionnel du sujet aurait-il pu l'écrire ainsi ? |
| Densité | Reste-t-il une phrase supprimable sans perte ? |

Une section qui échoue à l'une d'elles se réécrit plutôt que de se rapiécer.

Un texte qui passe toutes ces questions sauf Concret n'est pas un bon texte à corriger : c'est un texte
vide bien habillé. Reprends-le par le §1, pas par la typographie.

## 6 bis. La relecture en passes

Relire en passes séparées, du fond vers la forme, deux allers-retours au plus : en cherchant tout à
la fois, on laisse passer les calques et les tics, qui sont grammaticalement corrects. Sur un texte déjà écrit, ne relire que ce qui a été ajouté
ou modifié.

0. **Inventaire des faits.** Lister chiffres, normes, gestes et noms propres. Ce qui manque se
   demande, ne s'invente pas.
1. **Fond (§ 1).** Test de substitution, test de sortie. Un paragraphe sans fait se supprime.
2. **Structure.** Lire les intertitres seuls : la matière se répète-t-elle, une section est-elle
   gonflée pour ressembler aux autres, un tableau serait-il mieux en phrase ?
3. **Voix, à voix haute.** Trois phrases de même longueur, ou ouvertes par le même sujet ? Une
   maxime en chute, une pseudo-clivée, un adversaire imaginaire ? Puis la question de fond : quelle
   phrase sonne encore générée, et pourquoi ?
4. **Calques (§ 2 bis).** Rétro-traduction phrase par phrase, puis trois réflexes : la préposition,
   l'ordre des mots, le mot anglais resté.
5. **Contre-relecture de la réécriture (§ 5 quater).** Comparer à la version d'avant : aucun fait
   perdu ni ajouté, pas de staccato fabriqué, les connecteurs utiles gardés, un seul terme par chose.
6. **Mécanique en dernier.** Les contrôles du § 7, ou ceux du projet : ce qu'ils décident ne se
   relit pas à l'œil.

Au-delà de cinq signaux répartis sur trois familles dans un même passage, réécrire le passage plutôt
que le rapiécer.

## 7. Contrôles automatiques

À lancer sur le fichier avant livraison. Ils ne jugent pas, ils montrent où regarder.

```bash
F=texte.md

# Paragraphes sans aucun chiffre, à relire un par un : candidats au vide
awk 'BEGIN{RS=""} !/[0-9]/ {print NR": "substr($0,1,90)"..."}' "$F"

# Verbes vides et promesses non vérifiables
grep -nEi "permet de|vous fait gagner|simplifie|facilite|optimise|améliore|au service de|pensé pour|conçu pour" "$F"

# Tiret cadratin, doit renvoyer 0
grep -c "—" "$F"

# Formules et tics interdits
grep -nEi "de nos jours|à l'heure où|dans un monde où|il est important de noter|il convient de|force est de constater|n'hésitez pas|vous l'aurez compris|en conclusion|pour conclure|incontournable|un allié de taille|la clé réside|en un clin d'œil|en toute simplicité|que vous soyez|boostez|dopez|révolutionnaire" "$F"

# Adverbes en -ment, par fréquence
grep -oE "[a-zà-ÿ]+ment\b" "$F" | sort | uniq -c | sort -rn | head

# Apostrophes droites et guillemets anglais
grep -cE "'|\"" "$F"

# Ponctuation double sans espace insécable devant
grep -nE "[^  ][:;!?]" "$F" | grep -v http

# Points de suspension en trois points
grep -n "\.\.\." "$F"

# Motifs de série (§ 5 bis) : contraste binaire, exclusivité, omniscience, nombre annoncé,
# verbes de dramatisation. À relire un par un, le quota se juge à la main.
grep -nEi "(ce n.est pas|ce ne sont pas)[^.]{0,120}(c.est|ce sont)|, pas (un|une|des|le|la|les|du|de) [^.,;:]{1,40}\." "$F"
grep -nEi "(le|la|les) (seule?s?|vraie?s?) [a-zà-ÿ]+ (qui|que|du|de)|décide de tout" "$F"
grep -nEi "personne ne|tout le monde|l.erreur (classique|la plus)" "$F"
grep -nEi "(deux|trois|quatre|cinq) (choses|causes|cas|situations|familles|décisions|questions|chiffres|nombres|points|règles)" "$F"
grep -nEi "tient en|se joue|se rattrap|se négoci|tranche\.|décide\." "$F"

# Formules repérées en 2026 (§ 2) et structures en balancier (§ 5)
grep -nEi "à l.ère d|en constante évolution|il est à noter|notons que|plong(eons|er) dans|cela étant dit|à cet égard|tirer parti|mettre en exergue|joue un rôle|s.impose comme|fait office de|fai(re|t|s|sait|saient) (du )?sens|adress(er|e|ez|é) (un|le|ce|la|les) (problème|sujet|question|besoin)|impact(er|e|es|ent|é|ée|ant)|les études montrent" "$F"
grep -nEi "non seulement|il ne s.agit pas (seulement|simplement)|plus qu.une? simple|, (soulignant|illustrant|reflétant|témoignant|ouvrant|offrant)" "$F"

# Calques de l'anglais (§ 2 bis) : un filet, jamais une preuve. La relecture de fin d'exercice reste due.
grep -nEi "réalis(e|er|ez|é) que|en charge d|en capacité d|délivr[a-zé]* (un|une|le|la|des) (résultat|service)|en termes d|entre(nt)? en jeu|gard[a-z]* (à|en) l.esprit|prêt(e|s)? à [^.?]{1,60}\\?|le saviez-vous|en d.autres mots|travail par travail|(chaque|un) travail[ ,.]" "$F"
grep -nEiw "wording|features?|home|templates?|items?|slots?|flows?|scope|fallback|layout|dashboard|onboarding|feedbacks?|tooltips?|snippets?|workflows?|roadmap|preview|release" "$F"
grep -nEi "(peut|peuvent|qui vien(t|nent)) (venir )?avec|une alternative|résult(e|ent|er) en|rencontr[a-zé]* (les|des) (normes|exigences|besoins)|sauve[rz]? (du|de) (temps|place|argent)|drastique|au final|c.est juste (trop|super|parfait)|versus|vs\\.? |^compar(é|ée)s? (à|au)|(premiers|premières|derniers) (deux|trois|cinq|dix|[2-9]) |a été répondu|satisfaite?s? avec|fai(t|re) (toute )?la différence$|pourrai?t potentiellement" "$F"
grep -nE "(^|[.!?] )Ce (qui|que) [^.,]{3,60}, c.est" "$F"
grep -nE " : [A-ZÀÉÈ][a-zéèêà]+ [a-zéèêà]" "$F"
grep -nEi "^(concrètement|en pratique), " "$F"
grep -nEi "contrairement à une idée reçue|on pourrait croire|en lien avec|constitue (un|une|le|la)|s.avère|se veut|représente un véritable" "$F"

# Dialecte des agents (§ 5 ter)
grep -nEi "(outil|calculateur|tableur|il|elle) (vous )?rend(ent)? (le|la|les|un|une|des) [a-zà-ÿ²]+( |,|\.)(en|et|par|de)?|demande et rend" "$F"
grep -nEi "départage|gouverne|(qui|il|elle|ce) commande (la|le|les|l.|tout)" "$F"
grep -nEi "c.est (lui|elle|ce) qui|c.est (là|ici) que|voilà pourquoi" "$F"
grep -oEi "se (fige|figent|décide|décident|compte|comptent|cote|cotent|mesure|mesurent|lit|lisent|vérifie|vérifient)" "$F" | wc -l
grep -nE "[a-zà-ÿ]+, [a-zà-ÿ' ]{1,30}, et [a-zà-ÿ]" "$F"
```

Trois occurrences de *notamment* dans 1 200 mots signalent une phrase à réécrire, pas une faute.
Un paragraphe remonté par le premier contrôle n'est pas une faute non plus : c'est une question,
« qu'est-ce que ce paragraphe apprend ? ». S'il n'y a pas de réponse, il se supprime.

---

Base `stop-slop` : MIT.
