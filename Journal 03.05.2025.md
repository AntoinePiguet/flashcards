**Objectifs**
*objectifs pour la matinée du 03.05.2025*

- ajouter postgres a ma db, donc passer de mysql a postgres
- lancer le site + la db sur render 
- que le tout soit fonctionnel.
- améliorer mon ReadMe pour qu'on puisse lancer la prod depuis le ReadMe et que le code soit compréhensible
- 2) expliquer ce que j'ai fait dans le journal.
- 3) faire le bilan de ce que j'ai fait.


travail efféctué:

j'ai essayé par plusieurs moyens de contrer une erreur qui faisait qu'il perdait mon package.json pendant le build et donc ne pouvait pas installer correctement les dépendencies

ensuite j'ai fait beaucoup de recherches sur comment déployer son application web avec render et apparement le fait de ne pas utiliser docker serait plus simple, j'ai donc
créé un nouveau service web sans docker pour essayer, ça a marché au bout de quelques essais, mais j'avais mis trop d'investissement dans mon docker pour ne pas l'utiliser,
je suis donc retourné a un autre service web avec docker, tout en essayant de comprendre comment je devais faire la suite et ce qui ne marchait pas.

après de longues recherches et plusieurs tests, j'ai choisi de me tourner vers l'ia, d'abord claude qui m'a un peu aidé mais sans grand succès ni changement majeu,
puis deepseek qui m'a aussi aidé un peu mais pas des masses.

En bref j'ai testé beaucoup de choses différentes pour essayer de faire fonctioner le nuiuld et la db postgres, mais les résultats ne sont pas suffisants.
je vais donc continuer a chercher de la documentation et peut etre un tuto ou quelque chose qui me donne une petite idée de ce que  je suis en train de faire et qui me permette de comprendre ce qui ne vas pas dans ma prod.

les tutos que j'ai regardé:
https://www.youtube.com/watch?v=8bHi_VTmGVs
https://www.youtube.com/watch?v=hNRxn5sKOdE
https://www.youtube.com/watch?v=hGYNW8-_c3U

Ce que j'ai appris:
1) que dans l'environnement de la db Render, il y avait non pas 1 nais 2 db:url.
2) que c'est visiblement possible de créer des webapp avec tout et n'importe quoi
3) que ça a l'air complexe, j'hésite a passer sur un autre hebergeur qui accepte mysql car je connais déja beaucoup plus


en regardant sur internet et internet m'a dit que l'hebergeur _*fly.io*_ est plus simple, plus performent et prends en charge mysql comparé a render ça fait rêver.
j'ai donc choisi de changer d'hebergeur et donc de revenir a la version dockerisée simple avant les modif pour la prod car je pense que j'ai fait des choses incohérentes 
et complexe pour rien et je préfére repartir de quelque chose de stable pour aller vers l'avant.

Je repars donc d'une version dockerisée avant la mise en prod pour faire une mise en prod travaillée et bien avec Fly.io