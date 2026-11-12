<img src="icons/favicon.svg" alt="ChemTrain logo" height="110" align="right">

# ChemTrain

**Learn chemistry, one card at a time.** This is the home page of the ChemTrain study apps, served at **https://chemtrain.github.io/**.

The page lists every app as a stop on one rail line and shows today's ChemTrain Daily quiz. It also shows your progress in each app, read from what the apps save in your browser. It turns ChemTrain into a web app you can install on a phone or computer, which then works without internet.

| Stop | App | What it trains |
|---|---|---|
| 1 | [ChemTrain Daily](https://chemtrain.github.io/chemtrain-daily/chemtrain_daily.html) | A daily quiz with questions from every app, and problem sets |
| 2 | [Beast mode](https://chemtrain.github.io/chemtrain-daily/chemtrain_daily.html#beast) | Questions from every app until your first mistake |
| 3 | [Reaction Learn](https://chemtrain.github.io/reaction-learn/reaction_learn.html) | Named reactions and reagents |
| 4 | [pKa Learn](https://chemtrain.github.io/pka-learn/pka_learn.html) | pKa values and the most acidic proton |
| 5 | [PG Learn](https://chemtrain.github.io/pg-learn/pg_learn.html) | Protecting groups and how to remove them |
| 6 | [TMC Learn](https://chemtrain.github.io/tmc-learn/tmc_learn.html) | Electron counting and transition-metal complexes |
| 7 | [Radical Learn](https://chemtrain.github.io/radical-learn/radical_learn.html) | Radical philicity, polarity matching, regioselectivity |
| 8 | [Photoredox Learn](https://chemtrain.github.io/photoredox-learn/photoredox_learn.html) | Redox potentials and photoredox cycles |
| 9 | [Reactivity Learn](https://chemtrain.github.io/reactivity-learn/reactivity_learn.html) | Mayr nucleophilicity and electrophilicity (Nu/E) |

## Installing ChemTrain

- **iPhone and iPad:** open https://chemtrain.github.io/ in Safari, tap Share, then **Add to Home Screen**.
- **Android:** open it in Chrome and tap **Install**, or open the menu ⋮ and choose **Install app**.
- **Computer:** in Chrome or Edge, click the install icon in the address bar. In Safari on a Mac, choose **File → Add to Dock**.

The installed app saves every app on the device (about 22 MB) and works offline. It updates itself when online. Progress stays on the device; on iPhone the installed app keeps its own progress, apart from Safari's. Pick a pseudo under **Ranking** and your Daily scores join the boards (today, this week, this month, all time; everyone or a group of friends) and your progress in every app follows you to your other devices through a 16-character code. No email, no password: the server (a Cloudflare Worker, source in `chemtrain-src/net`) keeps the pseudo, the scores and the synced progress, nothing else.

## What is in this repo

- `index.html`: the page.
- `sw.js`: the service worker. It keeps the home page and every app on the device. Pages come from the network first and from the saved copy when offline; fonts come from the saved copy first.
- `manifest.webmanifest` and `icons/`: what makes the page installable (name, icons, and shortcuts to today's quiz, Beast mode, Reaction Learn and pKa Learn).
- `loader.svg`: the moving train of the loading screen, which every app shares.

All of these are built by `home/build.py` in the ChemTrain sources, so don't edit them by hand.

## License

- Code (the HTML, CSS and JavaScript): [MIT](LICENSE).
- Each app's content is under CC BY 4.0, and each app's repo says how to cite it.
- Logo and loading screen: the locomotive is adapted from [Twemoji](https://github.com/jdecked/twemoji), © Twitter, Inc and other contributors, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The benzene-ring smoke was added for ChemTrain.

By Quentin P. Bindschaedler and Francesco Sala.
