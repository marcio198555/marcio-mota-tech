"""Personalised outbox for shops, distributors and agencies: products seen on their site + a measured test idea.

Usage: python3 -I build_perso.py LEADS.jsonl OUTBOX.jsonl PREFIX [MAX]
Also writes OUTBOX_gq.txt (Gmail in:anywhere queries, 7 domains per line).
"""
import glob
import json
import os
import re
import sys

BASE = os.environ.get("PROSPECTION_BASE", os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "travail"))
KIT = "https://headless-joysobcpmnx-monthey1985-140b.wix-site-host.com/"
SIG_FILE = os.path.join(BASE, "signature_privee.txt")  # non versionné : nom, Instagram, adresse, téléphone ; {c} = pays
SIG = (open(SIG_FILE).read().strip() if os.path.exists(SIG_FILE)
       else "Marcio Mota\nInstagram : https://www.instagram.com/filipe_marcio1985/\n[ADRESSE ET TÉLÉPHONE MANQUANTS], {c}")

HELLO = {"en": "Hello {name} team,", "fr": "Bonjour l'équipe de {name},", "de": "Guten Tag"}
INTRO = {
    "en": ("I'm Marcio Mota, and I test tech and home products on Instagram from Switzerland (@filipe_marcio1985, 34,000 followers). "
           "I shoot overhead and macro, hands only, with a French voice-over, and every test shows a measured value on screen. "
           "My FRITZ!Box and PAJ GPS tests each passed 10,000 views."),
    "fr": ("Je m'appelle Marcio Mota et je teste des produits tech et maison sur Instagram depuis la Suisse (@filipe_marcio1985, 34 000 abonnés). "
           "Je filme en vue de dessus et en macro, mains seules, avec une voix off en français, et chaque test affiche une valeur mesurée à l'écran. "
           "Mes tests de la FRITZ!Box et du PAJ GPS ont chacun dépassé 10 000 vues."),
    "de": ("Ich heisse Marcio Mota und teste auf Instagram Tech- und Haushaltsprodukte aus der Schweiz (@filipe_marcio1985, 34'000 Follower). "
           "Ich filme von oben und in Makro, nur mit den Händen, mit französischem Voice-over, und jeder Test zeigt einen gemessenen Wert im Bild. "
           "Meine Tests der FRITZ!Box und des PAJ GPS haben je über 10'000 Aufrufe erreicht."),
}
AND = {"en": "and", "fr": "et", "de": "und"}
SEEN = {  # what Marcio noticed, by kind
    "shop": {"en": "Browsing your shop, I noticed {x}.", "fr": "En parcourant votre boutique, j'ai vu {x}.",
             "de": "Beim Stöbern in Ihrem Shop habe ich {x} gesehen."},
    "shop_brands": {"en": "Browsing your shop, I saw you carry {x}.", "fr": "En parcourant votre boutique, j'ai vu que vous proposez notamment {x}.",
                    "de": "Beim Stöbern in Ihrem Shop habe ich gesehen, dass Sie unter anderem {x} führen."},
    "brand": {"en": "Browsing your site, I noticed {x}.", "fr": "En parcourant votre site, j'ai vu {x}.",
              "de": "Auf Ihrer Website habe ich {x} gesehen."},
    "distributor": {"en": "You distribute brands such as {x}.", "fr": "Vous distribuez notamment {x}.",
                    "de": "Sie vertreiben unter anderem {x}."},
    "agency": {"en": "You work with brands such as {x}.", "fr": "Vous travaillez notamment avec {x}.",
               "de": "Sie arbeiten unter anderem mit {x}."},
}
CATEGORY = {
    "coffee": ("café", "Kaffee", "coffee"), "3dprint": ("impression 3D", "3D-Druck", "3D printing"),
    "lighting": ("éclairage", "Beleuchtung", "lighting"), "flashlights": ("lampes torches", "Taschenlampen", "flashlight"),
    "photo": ("photo et vidéo", "Foto und Video", "photo and video"), "audio": ("audio et hi-fi", "Audio und HiFi", "audio and hi-fi"),
    "bike": ("vélo", "Fahrrad", "cycling"), "outdoor": ("outdoor et camping", "Outdoor und Camping", "outdoor and camping"),
    "kitchen": ("cuisine", "Küche", "kitchen"), "appliances": ("électroménager", "Haushaltsgeräte", "home appliance"),
    "smarthome": ("maison connectée", "Smart Home", "smart home"), "tools": ("outillage", "Werkzeug", "tools"),
    "garden": ("jardin", "Garten", "garden"), "pets": ("animaux", "Tierbedarf", "pet"),
    "baby": ("puériculture", "Baby", "baby"), "gaming": ("gaming", "Gaming", "gaming"),
    "computer": ("informatique", "Computer", "computer"), "music": ("instruments de musique", "Musikinstrumente", "music gear"),
    "astronomy": ("astronomie", "Astronomie", "astronomy"), "optics": ("jumelles et optique", "Ferngläser und Optik", "binoculars and optics"),
    "fishing": ("pêche", "Angeln", "fishing"), "sewing": ("machines à coudre", "Nähmaschinen", "sewing machine"),
    "diving": ("plongée", "Tauchen", "diving"), "golf": ("golf", "Golf", "golf"), "fitness": ("fitness", "Fitness", "fitness"),
    "health": ("santé et bien-être", "Gesundheit und Wellness", "health and wellness"), "beauty": ("soin et beauté", "Pflege und Beauty", "personal care"),
    "rc": ("modélisme", "Modellbau", "RC model"), "drones": ("drones", "Drohnen", "drone"), "mobility": ("mobilité électrique", "E-Mobilität", "e-mobility"),
    "phone": ("accessoires smartphone", "Smartphone-Zubehör", "phone accessory"), "electronics": ("électronique", "Elektronik", "electronics"),
    "security": ("sécurité et surveillance", "Sicherheitstechnik", "security camera"), "weather": ("stations météo", "Wetterstationen", "weather station"),
    "marine": ("nautisme", "Bootszubehör", "marine electronics"), "caravan": ("camping-car", "Wohnmobil-Zubehör", "camper"),
    "aquarium": ("aquariophilie", "Aquaristik", "aquarium"), "watches": ("montres", "Uhren", "watch"),
    "heating": ("chauffage et climatisation", "Heizung und Klima", "heating and cooling"),
}
CAT_SEEN = {"en": "Browsing your shop, I came across your {x} range.", "fr": "En parcourant votre boutique, j'ai vu votre rayon {x}.",
            "de": "Beim Stöbern in Ihrem Shop habe ich Ihr Sortiment rund um {x} gesehen."}
IDEA = {"en": "I'd love to test the {p} and show its {m} on screen.",
        "fr": "Je verrais bien un test {de}{p}, en affichant à l'écran {m}.",
        "de": "Ich könnte mir gut einen Test von {p} vorstellen, bei dem ich {m} im Bild zeige."}
GENERIC = {"en": "I'd love to test the {p} and show a measured value on screen.",
           "fr": "Je verrais bien un test {de}{p}, avec une valeur mesurée à l'écran.",
           "de": "Ich könnte mir gut einen Test von {p} vorstellen, mit einem gemessenen Wert im Bild."}
NET = re.compile(r"router|mesh|wi-?fi|wlan|repeater|modem|switch|nas\b|powerline|access point|fritz", re.I)
NOMETRIC = re.compile(r"\b(pla|asa|petg|abs|tpu)\b|filament|refill|petcube cam|power mount|ams 2|variateur|dimmer|dimmschalter|\buv\b|laser", re.I)
FORCE = {"ender-5 max": "noise", "creality k2": "noise", "comandante": "time", "1zpresso": "time", "timemore chestnut": "time"}
METRIC = {
    "power": {"en": "power draw in watts", "fr": "sa consommation en watts", "de": "den Stromverbrauch in Watt"},
    "noise": {"en": "sound level in decibels", "fr": "son niveau sonore en décibels", "de": "den Schallpegel in Dezibel"},
    "light": {"en": "brightness in lux", "fr": "sa luminosité en lux", "de": "die Helligkeit in Lux"},
    "temp": {"en": "temperature in °C", "fr": "sa température en °C", "de": "die Temperatur in °C"},
    "time": {"en": "timings in seconds", "fr": "les temps en secondes", "de": "die Zeiten in Sekunden"},
    "weight": {"en": "weight in grams", "fr": "son poids en grammes", "de": "das Gewicht in Gramm"},
    "size": {"en": "dimensions in millimetres", "fr": "ses dimensions en millimètres", "de": "die Abmessungen in Millimetern"},
    "battery": {"en": "battery life in hours", "fr": "son autonomie en heures", "de": "die Akkulaufzeit in Stunden"},
    "speed": {"en": "speed in Mbit/s", "fr": "son débit en Mbit/s", "de": "die Datenrate in Mbit/s"},
}
OFFER = {
    "shop": {
        "en": ("Here's the idea: you pick this product, or any other from your range, and send it over. I publish one honest Reel "
               "and one Story, marked as gifted, within three weeks, with your shop tagged and linked as the place to buy it. "
               "If you'd also like to use the footage on your site or in your ads (UGC), we can discuss that separately."),
        "fr": ("Le principe : vous choisissez ce produit, ou un autre de votre assortiment, et vous me l'envoyez. Je publie un Reel "
               "et une Story honnêtes, avec la mention « produit offert », dans les trois semaines, en citant votre boutique et son lien "
               "comme endroit où l'acheter. Si vous souhaitez aussi utiliser les vidéos sur votre site ou dans vos publicités (UGC), "
               "on peut en parler à part."),
        "de": ("Das Prinzip: Sie wählen dieses Produkt oder ein anderes aus Ihrem Sortiment und senden es mir. Ich veröffentliche "
               "innerhalb von drei Wochen ein ehrliches Reel und eine Story, gekennzeichnet als Geschenk, mit Ihrem Shop verlinkt als "
               "Bezugsquelle. Wenn Sie das Material auch auf Ihrer Website oder für Werbung nutzen möchten (UGC), können wir das separat besprechen."),
    },
    "brand": {
        "en": ("Here's the idea: once it arrives, I publish one honest Reel and one Story, marked as gifted, within three weeks. "
               "If you'd also like to use the footage in your ads (UGC), we can discuss that separately."),
        "fr": ("Le principe : dès réception, je publie un Reel et une Story honnêtes, avec la mention « produit offert », "
               "dans les trois semaines. Si vous souhaitez aussi utiliser les vidéos dans vos publicités (UGC), on peut en parler à part."),
        "de": ("Das Prinzip: Nach Erhalt veröffentliche ich innerhalb von drei Wochen ein ehrliches Reel und eine "
               "Story, gekennzeichnet als Geschenk. Wenn Sie das Material auch für Werbung nutzen möchten (UGC), können wir das separat besprechen."),
    },
    "relay": {
        "en": ("Here's the idea: you send a product, and I publish one honest Reel and one Story, marked as gifted, within three weeks. "
               "If a brand also wants the footage for its ads (UGC), we can discuss that separately. I'm based in French-speaking "
               "Switzerland, which is useful for launches in Switzerland and France."),
        "fr": ("Le principe : vous m'envoyez un produit, et je publie un Reel et une Story honnêtes, avec la mention « produit offert », "
               "dans les trois semaines. Si une marque veut aussi utiliser les vidéos dans ses publicités (UGC), on peut en parler à part. "
               "Je suis en Suisse romande, ce qui est utile pour les lancements en Suisse et en France."),
        "de": ("Das Prinzip: Sie senden mir ein Produkt, und ich veröffentliche innerhalb von drei Wochen ein ehrliches Reel und eine "
               "Story, gekennzeichnet als Geschenk. Wenn eine Marke das Material auch für Werbung nutzen möchte (UGC), können wir das "
               "separat besprechen."),
    },
}
NOPICK = {"en": ("you pick this product, or any other from your range,", "you pick a product from your range"),
          "fr": ("vous choisissez ce produit, ou un autre de votre assortiment,", "vous choisissez un produit de votre assortiment"),
          "de": ("Sie wählen dieses Produkt oder ein anderes aus Ihrem Sortiment", "Sie wählen ein Produkt aus Ihrem Sortiment")}
ASK_BRAND = {"en": "Would you be open to sending me one to test?",
             "fr": "Seriez-vous d'accord de m'en envoyer un pour le tester ?",
             "de": "Wären Sie bereit, mir ein Exemplar zum Testen zu senden?"}
ASK = {
    "shop": {"en": "Would that interest you? If so, tell me which product you'd like me to test.",
             "fr": "Est-ce que cela vous intéresserait ? Si oui, dites-moi quel produit vous aimeriez que je teste.",
             "de": "Wäre das für Sie interessant? Wenn ja, sagen Sie mir gerne, welches Produkt ich testen soll."},
    "relay": {"en": "Could you tell me which brands or campaigns could fit, or forward this to the right person?",
              "fr": "Pourriez-vous me dire quelles marques ou campagnes pourraient convenir, ou transmettre ce message à la bonne personne ?",
              "de": "Könnten Sie mir sagen, welche Marken oder Kampagnen passen könnten, oder diese Nachricht an die richtige Person weiterleiten?"},
}
KITLINE = {"en": "My media kit, with my verified stats and past brand tests: ",
           "fr": "Mon media kit, avec mes statistiques vérifiées et mes tests précédents : ",
           "de": "Mein Media Kit mit verifizierten Statistiken und bisherigen Markentests: "}
BYE = {"en": "Best regards,\n\n" + SIG.format(c="Switzerland"),
       "fr": "Avec mes meilleures salutations,\n\n" + SIG.format(c="Suisse"),
       "de": "Freundliche Grüsse\n\n" + SIG.format(c="Schweiz")}
SUBJ = {
    "idea": {"en": "Test idea for {name}: {p}", "fr": "Idée de test pour {name} : {p}", "de": "Testidee für {name}: {p}"},
    "shop": {"en": "Video test for {name}: one Reel + one Story", "fr": "Test vidéo pour {name} : un Reel + une Story",
             "de": "Videotest für {name}: ein Reel + eine Story"},
    "relay": {"en": "Measured video tests for {x}", "fr": "Tests vidéo mesurés pour {x}", "de": "Gemessene Videotests für {x}"},
}


def clean(s, n=45):
    s = re.sub(r"\s+", " ", str(s or "")).strip(" .,;")
    return s if 2 <= len(s) <= n else ""


def pair(items, lang):
    items = [i for i in items if i][:2]
    return f" {AND[lang]} ".join(items)


def build(r, lang, kind):
    name = r["name"].strip()
    prods = [clean(p) for p in (r.get("products") or [])]
    prods = [p for p in prods if p]
    brands = [clean(b, 30) for b in re.split(r"[,;/]| & ", ", ".join(r["brands_examples"]) if isinstance(r.get("brands_examples"), list) else (r.get("brands_examples") or ""))]
    brands = [b for b in brands if b]
    p1 = prods[0] if prods else ""
    key = next((v for k, v in FORCE.items() if k in p1.lower()), r.get("test_metric"))
    m = METRIC.get(key)
    generic = bool(p1) and (NOMETRIC.search(p1) or (key == "speed" and not NET.search(p1))
                              or (key == "battery" and re.search(r"akku|lipo|batter", p1, re.I)))
    if kind == "brand":
        if not (p1 and m) or len(prods) < 1:
            return None
        seen = SEEN["brand"][lang].format(x=pair(prods, lang))
    elif kind == "shop":
        cat = CATEGORY.get(str(r.get("category") or "").strip().lower())
        seen = SEEN["shop"][lang].format(x=pair(prods, lang)) if len(prods) >= 2 else (
            SEEN["shop_brands"][lang].format(x=pair(brands, lang)) if brands else (
                CAT_SEEN[lang].format(x=cat[{"fr": 0, "de": 1, "en": 2}[lang]]) if cat else ""))
    else:
        seen = SEEN[kind][lang].format(x=pair(brands, lang)) if brands else ""
    idea = ""
    de = "d'" if lang == "fr" and p1[:1].lower() in "aeiouéèêâîôû" else "de "
    if p1 and generic:
        idea = GENERIC[lang].format(p=p1, de=de).replace("test the The ", "test The ")
    elif p1 and m:
        idea = IDEA[lang].format(p=p1, m=m[lang], de=de).replace("test the The ", "test The ")
    perso = " ".join(x for x in (seen, idea) if x)
    if not perso:
        return None
    grp = kind if kind in ("shop", "brand") else "relay"
    offer = OFFER[grp][lang]
    if kind == "shop" and not idea:
        offer = offer.replace(*NOPICK[lang])
    paras = [HELLO[lang].format(name=name), INTRO[lang], perso, offer, (ASK_BRAND[lang] if kind == "brand" else ASK[grp][lang]),
             KITLINE[lang] + KIT, BYE[lang]]
    if kind in ("shop", "brand"):
        subj = SUBJ["idea" if idea else "shop"][lang].format(name=name, p=p1)
    else:
        subj = SUBJ["relay"][lang].format(x=pair(brands, lang) or name)
    return subj, "\n\n".join(paras)


GENERIC_MAIL = {"gmail", "googlemail", "outlook", "hotmail", "yahoo", "icloud", "proton", "protonmail", "bluewin", "gmx", "orange", "wanadoo", "t-online", "web", "aol", "live"}


def label(d):
    """Nom de domaine sans extension (xtremgear.pl et xtremgear.de -> xtremgear)."""
    parts = d.lower().split("@")[-1].removeprefix("www.").split(".")
    if len(parts) >= 3 and parts[-2] in ("co", "com", "org", "net", "ac", "gov"):
        return parts[-3]
    return parts[-2] if len(parts) >= 2 else parts[0]


def main():
    src, out_path, prefix = sys.argv[1:4]
    cap = int(sys.argv[4]) if len(sys.argv) > 4 else 10 ** 6
    taken, labels = set(), set()
    for f in [os.path.join(BASE, "envoi/sent_log.jsonl")] + glob.glob(os.path.join(BASE, "envoi/queue_*.jsonl")):
        for line in open(f):
            if line.strip():
                r = json.loads(line)
                taken.add(r["to"].lower())
                taken.add(r["to"].split("@")[1].lower())
                if r.get("domain"):
                    taken.add(r["domain"].lower())
                    labels.add(label(r["domain"]))
                labels.add(label(r["to"]))
    out, rejects = [], []
    for line in open(src):
        if not line.strip() or len(out) >= cap:
            continue
        r = json.loads(line)
        a, d = r["email"].lower().strip(), r["domain"].lower().strip().removeprefix("www.")
        lang = r.get("email_lang") if r.get("email_lang") in INTRO else "en"
        kind = r.get("kind") if r.get("kind") in SEEN else "agency"
        probs = []
        if not re.fullmatch(r"[\w.+'-]+@[\w-]+(\.[\w-]+)+", a):
            probs.append("bad address")
        if a in taken or a.split("@")[1] in taken or d in taken:
            probs.append("already sent/queued")
        elif any(len(x) >= 5 and x not in GENERIC_MAIL and x in labels for x in (label(d), label(a))):
            probs.append("same name already contacted (other domain)")
        msg = None if probs else build(r, lang, kind)
        if not probs and not msg:
            probs.append("no personalisation")
        if probs:
            rejects.append((r.get("name"), d, probs))
            continue
        taken.update({a, a.split("@")[1], d})
        labels.update({label(d), label(a)})
        out.append({"id": f"{prefix}{len(out) + 1:03d}", "brand": r["name"], "domain": d, "to": a,
                    "subject": msg[0], "body": msg[1], "lang": lang, "kind": kind})
    with open(out_path, "w") as f:
        f.write("".join(json.dumps(x, ensure_ascii=False) + "\n" for x in out))
    doms = sorted({x["domain"] for x in out} | {x["to"].split("@")[1] for x in out})
    with open(out_path.replace(".jsonl", "_gq.txt"), "w") as f:
        for i in range(0, len(doms), 7):
            f.write("in:anywhere (" + " OR ".join(f"from:@{d} OR to:@{d}" for d in doms[i:i + 7]) + ")\n")
    print(f"outbox={len(out)} rejects={len(rejects)}")
    for x in rejects:
        print("REJECT", x)


if __name__ == "__main__":
    main()
