# Hulk Roofing & Restoration

Na prezeranie bez inštalácie otvor `public/index.html`. Formulár v náhľade overí povinné polia a zobrazí skúšobný výsledok.

Texty a kontakty sú v `public/index.html`, farby a rozloženie v `public/style.css`. Ilustrácia `public/roof.svg` je súčasť návrhu. Kategórie služieb a oblasť pôsobenia čakajú na potvrdenie. Názov, sídlo v Rockforde, telefón a e-mail vychádzajú z [registra obce Streamwood](https://www.streamwood.org/home/showpublisheddocument/2245/639135042325100000).

## Po schválení náhľadu

1. Potvrďte texty, služby, oblasť pôsobenia, cieľovú schránku a doménu. Firma už má [verejný web](https://hulkroofingcompany.com/), preto pred prepojením domény potvrďte, či pilot slúži ako jeho náhrada.
2. Prepojte GitHub s Cloudflare Pages. Koreň projektu je tento priečinok, bez príkazu na zostavenie, výstupný priečinok je `public`. Priečinok `functions` zostáva v koreni projektu.
3. V Resend overte odosielaciu doménu. V produkčnom prostredí Cloudflare Pages nastavte `FROM_EMAIL` z tejto domény, `BUSINESS_EMAIL` a šifrované tajomstvo `RESEND_API_KEY`. Aktivujte `CONTACT_MODE=live` iba pre prostredie určené na odosielanie.
4. V príslušnej verzii stránky nastavte `data-preview="false"`. Pred verejným spustením schváľte informácie o spracovaní údajov z formulára a odstráňte `noindex`. Pri verejnom formulári nastavte obmedzenie frekvencie požiadaviek na `/api/contact`. Otestujte prijatie správy aj odpoveď na adresu odosielateľa.

[Cloudflare Pages bindings](https://developers.cloudflare.com/pages/functions/bindings/) · [Resend Send Email](https://resend.com/docs/api-reference/emails/send-email)
