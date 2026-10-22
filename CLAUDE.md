# Règles de travail pour Marcio (@filipe_marcio1985)

Réponses en français, courtes. Les skills de `.claude/skills/` sont à utiliser à chaque demande où ils s'appliquent, sans attendre qu'on les nomme.

## Économie de tokens (toujours)
- Appliquer `rescue-tokens`, `token-optimization` et `context-optimization` : réponses brèves, pas de tableaux ni de récapitulatifs inutiles, résultats volumineux écrits dans des fichiers plutôt que recopiés.
- Sous-agents mécaniques (export, collecte, envoi) sur Sonnet ; pas plus de 4 agents en parallèle (`multi-agent-patterns`, `dispatching-parallel-agents`).
- Avant de dire « terminé » : `verification-before-completion`.

## Quel skill pour quoi
- Trouver un skill manquant : `find-skills`.
- Nouvelles niches, marques, contacts : `prospecting`, `lead-research-assistant`, `account-research`, `influencer-marketing`, `social-evidence-research`, sous-agents `research-analyst` / `search-specialist` / `data-researcher` ; e-mails : `hunter-*` (si clé Hunter), `crm-data-cleanup` pour dédoublonner.
- E-mails aux marques : `cold-email`, `draft-outreach`, `creator-media-kit`, puis relecture `redaction-francaise` + `humanizer-fr` (FR) ou `humanizer` (EN), `transcreation` pour PT/EN.
- Réponses et relances : `reply-in-their-tone`, `tone-fixer`, `follow-up-chaser`, `late-invoice-chaser`.
- Contrats et tarifs UGC : `creator-deal-decoder`, `negotiation`.
- Reels : skills perso `strategie-contenu-reels`, `montage-reel-pro`, `equipe-agents-reels`, plus `viral-instagram-reels`, `viral-hooks`, `viral-captions-and-ctas`, `viral-short-form`, `social`.
- Vidéo : `video-editing` (dérush), `remotion-*` ou `hyperframes*` (animations, sous-titres), `media-use`.
- Comprendre un dossier ou un projet : `graphify`.

## Règles de prospection
- Ne jamais recontacter une marque déjà présente dans Gmail (envoyés ou conversation) ni un partenaire existant.
- N'utiliser que des adresses e-mail trouvées sur une source officielle, jamais devinées.
- Ne pas reprendre dans les e-mails des chiffres d'audience non vérifiés (d'après Metricool, environ 48 % des abonnés sont en Inde).
- Jamais plus de ~400 e-mails par jour depuis Gmail.
- OmniRoute (passerelle multi-modèles, compression de tokens) : `omniroute-*` ; prospection et UGC en plus : `omni-*`.
