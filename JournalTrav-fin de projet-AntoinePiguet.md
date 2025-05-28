# Journal de Travail - Antoine Piguet

_Application Flashcards_

## 📅 28 mai 2025

| Tâche                       | Description                                            | Durée     | Status  |
| --------------------------- | ------------------------------------------------------ | --------- | ------- |
| update(ReadMe): add staging | J'ai ajouté les infos concernant le serveur de staging | 0h30m     | ✅ DONE |
| **Total**                   |                                                        | **0h30m** |         |

---

## 📅 21 mai 2025

| Tâche                             | Description                                                                                                                                                                                                                                                   | Durée     | Status  |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------- |
| big Update(chrono mode) ⚠️        | J'ai essayé d'ajouter le mode chronométré mais j'ai des erreurs super longues à résoudre même pour une IA car il n'y a pas d'erreur, ni de logs, juste les fonctionnalités d'exercices qui ne fonctionnent pas. **IF U WANT TO TRY APP, TRY PREVIOUS COMMIT** | 2h30m     | 🔄 WIP  |
| Update(ReadMe) add dev directives | J'ai ajouté des directives et du markdown pour lancer le site en mode dev, pour que ce soit le plus précis possible comme mode d'emploi                                                                                                                       | 0h10m     | ✅ DONE |
| update(train mode)                | Ajout d'un mode pour s'exercer en proposant les questions une par une. Donne les stats de l'entraînement à la fin                                                                                                                                             | 0h30m     | ✅ DONE |
| update(error messages)            | Ajout de messages d'erreurs personnalisés                                                                                                                                                                                                                     | 0h10m     | ✅ DONE |
| update(Message Flash)             | J'ai ajouté des messages flash pour chaque action du CRUD lié aux decks ou aux cartes                                                                                                                                                                         | 0h30m     | ✅ DONE |
| **Total**                         |                                                                                                                                                                                                                                                               | **3h50m** |         |

---

## 📅 10 mai 2025

| Tâche                                                    | Description                                                                                                                                                                                                                                                                                                                                                                                      | Durée     | Status  |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ------- |
| Update(journal) complétion du journal                    | J'ai fait mon journal en retraçant les étapes que j'ai faites ce matin puis j'ai résumé le tout                                                                                                                                                                                                                                                                                                  | 1h00m     | ✅ DONE |
| Update(ReadMe) add documentation                         | I added a documentation chapter where I listed the documentation I used and powerful AI's to help build the project if the person is having trouble with something                                                                                                                                                                                                                               | 0h10m     | ✅ DONE |
| Feat(ReadMe) step-by-step guide - production with fly.io | I downloaded my release with the dockerized flashcards version and then I made the steps I did when I deployed it the first time but while writing everything I did. I didn't say it in my last commit but I also watched a video about markdown and the markdown documentation. At the end, I successfully deployed the dockerized flashcards version on fly.io and documented every step I did | 2h00m     | ✅ DONE |
| Feat(ReadMe.md) step-by-step guide for dockerizing       | I did a step-by-step guide that permits someone that downloads the old version of my flashcards application to dockerize it completely and start it with only one command (that executes the launching script)                                                                                                                                                                                   | 1h00m     | ✅ DONE |
| initial commit(objectifs de la matinée)                  | J'ai écrit les objectifs pour ma matinée dans un nouveau fichier                                                                                                                                                                                                                                                                                                                                 | 0h10m     | ✅ DONE |
| **Total**                                                |                                                                                                                                                                                                                                                                                                                                                                                                  | **4h20m** |         |

---

## 📅 7 mai 2025

| Tâche                                            | Description                                                                                                                                                                                                                                                                                                        | Durée     | Status  |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ------- |
| TimeLapse(project + fly.io)                      | J'ai via ChatGPT et la doc officielle de fly.io créé des volumes pour mon app et ma DB et j'ai lié le tout puis déployé (évidemment en passant par des tests, des échecs, du débogage etc...). Mon app Adonis Flashcards est maintenant déployée sur le web et ma DB aussi. Le tout est fonctionnel en production. | 1h30m     | ✅ DONE |
| create(fichiers de notes+gitignore)              | J'ai créé un fichier commandes avec des commandes utiles pour le déploiement de l'app et un fichier discussion-gpt qui est juste un copié-collé de ma discussion avec ChatGPT pour que j'aie une bonne référence lorsque je compléterai le ReadMe                                                                  | 0h10m     | ✅ DONE |
| create(package.json)                             | Création des packages.json lors de la migration des tables une fois que la DB et l'app étaient connectées                                                                                                                                                                                                          | 0h10m     | ✅ DONE |
| Meeting(notes.md) point sur le projet avec le PO |                                                                                                                                                                                                                                                                                                                    | 0h40m     | ✅ DONE |
| Create(fly.toml) création fichier DB             | Avec fly.io, j'ai suivi la doc pour installer le ps1 de fly puis utiliser les commandes dans un invite de commande en suivant la doc pour créer une DB et la lancer. J'ai dû exécuter diverses commandes et modifier avec la doc ce fichier.                                                                       | 1h30m     | ✅ DONE |
| **Total**                                        |                                                                                                                                                                                                                                                                                                                    | **4h00m** |         |

---

## 📅 3 mai 2025

| Tâche                                             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Durée     | Status  |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ------- |
| Update finale du journal                          | J'ai rédigé les derniers points de ce que j'ai fait aujourd'hui dans mon journal puis j'ai fait un résumé du travail effectué dans la matinée                                                                                                                                                                                                                                                                                                                                                                            | 0h20m     | ✅ DONE |
| Update(journal)                                   | J'ai update mon journal en expliquant le changement d'hébergeur                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 5h00m     | 🔄 WIP  |
| Refactor(repo)                                    | J'ai regardé sur internet et internet m'a dit que l'hébergeur fly.io est plus simple, plus performant et prend en charge MySQL comparé à render ça fait rêver. J'ai donc choisi de changer d'hébergeur et donc de revenir à la version dockerisée simple avant les modifs pour la prod car je pense que j'ai fait des choses incohérentes et complexes pour rien et je préfère repartir de quelque chose de stable pour aller vers l'avant. Donc ce commit représente la version dockerisée fonctionnelle et c'est tout. | 0h30m     | ✅ DONE |
| update(journal et visionnage tutos)               | J'ai regardé deux tutos et expliqué brièvement ce que j'y avais vu, entendu et compris et les choix que je comptais prendre                                                                                                                                                                                                                                                                                                                                                                                              | 0h30m     | 🔄 WIP  |
| update(journal)                                   | J'ai ajouté tout ce que j'ai fait jusque-là en ajoutant le maximum de détails                                                                                                                                                                                                                                                                                                                                                                                                                                            | 0h20m     | 🔄 WIP  |
| update(package.json)                              | J'essaie des trucs que DeepSeek me conseille et je consulte de la doc sur internet, mais c'est dur et ça marche pas                                                                                                                                                                                                                                                                                                                                                                                                      | 0h10m     | 🔄 WIP  |
| update(docker & render)                           | J'ai créé une copie de certains fichiers en .txt pour pouvoir les donner à DeepSeek, j'ai modifié mon dockerfile et j'ai ajouté un healthcheck à mon render                                                                                                                                                                                                                                                                                                                                                              | 0h25m     | 🔄 WIP  |
| update(test de changements pour régler problèmes) | J'ai fait des modifications à package.json pour essayer d'enlever les bêtes erreurs de build que j'ai                                                                                                                                                                                                                                                                                                                                                                                                                    | 0h30m     | 🔄 WIP  |
| test(passage à postgres)                          | J'essaie de passer à postgres et de modifier un peu la manière dont mon code se compile pour rendre le render plus important                                                                                                                                                                                                                                                                                                                                                                                             | 0h10m     | 🔄 WIP  |
| update(Dockerfile & render)                       | J'ai encore modifié mon dockerfile et j'ai optimisé mon fichier render                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 0h05m     | 🔄 WIP  |
| test                                              | Test de redéfinir le workdir après avoir copié package.json                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 0h05m     | 🔄 WIP  |
| update(Dockerfile & render)                       | J'ai ajouté du contenu à mon render pour qu'il prenne bien postgres. J'ai aussi modifié mon Dockerfile pour résoudre un problème que j'ai (il n'arrive pas à trouver le package.json)                                                                                                                                                                                                                                                                                                                                    | 0h20m     | 🔄 WIP  |
| **Total**                                         |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | **8h25m** |         |

---

## 📅 9 avril 2025

| Tâche                                | Description                                                                                                                                                                                                                                                                                                                                                                                                                                 | Durée     | Status |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------ |
| update(ReadMe & work on test server) | J'ai aussi travaillé pendant un bon moment en partie avec Alban sur le serveur de test Linux sur lequel j'essaie de déployer mon application mais c'est pas gagné                                                                                                                                                                                                                                                                           | 2h00m     | 🔄 WIP |
| create(dockerfile & docker-start.sh) | Création d'un dockerfile et d'un script permettant de drop les containers existants (un peu à la manière d'un prune) et ensuite de créer de nouveaux containers, faire des migrations et enfin lancer le serveur et avoir l'adresse du site. Des changements ont été apportés à mon .env, mon .yml et les deux fichiers cités plus haut dans le but de faire ceci. J'ai aussi dû modifier mon deck_controller.ts car il y avait une erreur. | 2h00m     | 🔄 WIP |
| **Total**                            |                                                                                                                                                                                                                                                                                                                                                                                                                                             | **4h00m** |        |

---

## 📅 5 février 2025

| Tâche                                         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Durée     | Status  |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------- |
| update(login) ajout d'options pour le login   | Ajout d'options pour le login → voir journalTrav.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 1h10m     | 🔄 WIP  |
| update(Navigation): bouton accueil et log out | J'ai commencé par envoyer un mail à des 3èmes pour avoir accès à leurs repos git et donc leurs commits pour savoir dans quel ordre ils avaient fait les choses. L'un d'eux m'a répondu mais leur projet était totalement différent je n'ai donc pas tenu compte du repo git. **Fonctionnalités** : avec l'aide de ChatGPT, j'ai pu créer des routes fonctionnelles entre mon template de header et ma page home ainsi que ma page login. ➜ Le bouton log out redirige sur la page de login ➜ Le bouton (logo.png) redirige sur la page d'accueil. | 1h20m     | ✅ DONE |
| **Total**                                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | **2h30m** |         |

---

## 📊 Statistiques Globales

### Temps total par statut :

- ✅ **DONE** : ~13h40m
- 🔄 **WIP** : ~17h35m
- **Total enregistré** : ~31h15m

### Principales réalisations :

- ✅ Déploiement réussi sur fly.io avec base de données
- ✅ Dockerisation complète de l'application
- ✅ Documentation détaillée (ReadMe)
- ✅ Mode d'entraînement avec statistiques
- ✅ Messages flash et gestion d'erreurs
- ⚠️ Mode chronométré en cours de développement

---

## 🗂️ Commits ignorés

_Les commits suivants ont été ignorés, probablement parce qu'ils ne respectent pas la convention :_

- Revert "big Update(chrono mode) IF U WANT TO TRY APP, TRY PREVIOUS COMMIT"
- Merge pull request #4 from AntoinePiguet/flyio-new-files
- rearrange(struct)
- update(Dockerfile)
- initial commit
- BIG UPDATE (prod, postgres)
- endCommit(commit de fin de journée)
- Add(ReadMe)
- update(refactor repo)
- final commit(error correction)
- update(gestion des decks)
- Update(cards)
- update(decks)
- Update(authentication)
- update(authentification)
- update(journalTrav)
- Create(docker-compose)
- Update(routes) ajout de la route Post /inscription pour s'inscrire
- Create(seeder), Update(migration)
- Create(validator)
- Update(user-model) update du usermodel pour qu'il corresponde au CdC
- Create: UserController, création du UserControler pour pouvoir créer un user plus tard
- update(inscription) ajout de la fonctionnalité pour que le bouton n'apparaisse que si les conditions sont remplies
- update(project)
- Create(JournalTrav)
- Create(repo)flashcards
