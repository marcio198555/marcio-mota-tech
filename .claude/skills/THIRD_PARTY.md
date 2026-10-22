# Skills tiers installés

Copiés tels quels depuis des dépôts open source, après relecture (aucun script distant, aucune collecte de données). Chaque dossier garde sa licence d'origine.

| Skills | Source | Licence |
|---|---|---|
| influencer-marketing, cold-email, prospecting, copywriting, copy-editing, public-relations, customer-research, marketing-ideas, social | github.com/coreyhaines31/marketingskills | MIT |
| humanizer | github.com/blader/humanizer | MIT |
| lead-research-assistant, content-research-writer | github.com/ComposioHQ/awesome-claude-skills | Apache-2.0 |
| draft-outreach, account-research, email-sequence, brand-review | github.com/anthropics/knowledge-work-plugins | Apache-2.0 |
| context-optimization, context-compression, context-fundamentals, context-degradation, multi-agent-patterns | github.com/muratcankoylan/Agent-Skills-for-Context-Engineering | MIT |
| token-optimization, rescue-tokens | github.com/valorisa/Claude-Skills | MIT |
| dispatching-parallel-agents, verification-before-completion | github.com/obra/superpowers | MIT |
| social-evidence-research | github.com/wshobson/agents | MIT |
| crm-data-cleanup | github.com/OneWave-AI/claude-skills | MIT |
| creator-media-kit, creator-brand-kit, creator-deal-decoder, reply-in-their-tone, tone-fixer, follow-up-chaser, late-invoice-chaser, transcreation | github.com/mohitagw15856/pm-claude-skills | MIT |
| apify-influencer-brand-collabs (nécessite un compte Apify) | github.com/apify/awesome-skills | Apache-2.0 |
| hunter-domain-search, hunter-email-finder, hunter-email-verifier (nécessitent Hunter.io, quota gratuit) | github.com/hunter-io/claude-plugin | MIT |
| redaction-francaise | github.com/florianferry/claude-skills-fr | MIT |
| humanizer-fr | github.com/ferr079/humanizer-fr | MIT |
| personal-voice-capture | github.com/eranshir/personal-voice-capture | MIT |
| negotiation | github.com/wondelai/skills | MIT |
| hyperframes, hyperframes-cli, hyperframes-registry, media-use | github.com/heygen-com/hyperframes | Apache-2.0 |
| video-editing | github.com/vincentventalon/my-claude-skills | MIT |
| viral-instagram-reels, viral-captions-and-ctas, viral-hooks, viral-short-form | github.com/vyralcontent/content-skills | MIT |

Sous-agents (`.claude/agents/`) : research-analyst, search-specialist, data-researcher — github.com/VoltAgent/awesome-claude-code-subagents (MIT).

## Modifications locales
- hunter-* : champ `name` préfixé par `hunter-` pour éviter les conflits.
- hyperframes-cli : plus d'envoi automatique de feedback/télémétrie à HeyGen après un rendu.
- viral-* : section promotionnelle « Mentioning Vyral » et image d'en-tête retirées.
- Sous-agents VoltAgent : section « Communication Protocol » (protocole fictif) retirée.

## Non installé volontairement
- remotion-dev/skills : pas de fichier LICENSE dans le dépôt (à installer soi-même avec `npx skills add remotion-dev/skills` si besoin).
- last30days : scripts réseau bloqués dans ce conteneur et risque de transmission de jetons Apify.
| graphify | github.com/Graphify-Labs/graphify (CLI : `pip install graphifyy`) | Apache-2.0 |
| find-skills | github.com/vercel-labs/skills | MIT |
| remotion-best-practices, remotion-captions, remotion-create, remotion-render, remotion-multimedia | github.com/remotion-dev/skills (installé à la demande de Marcio ; pas de fichier LICENSE dans le dépôt, Remotion gratuit pour les particuliers) | voir remotion.dev/license |
