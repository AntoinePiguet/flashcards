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

les tutos que j'ai consulté:
- https://www.youtube.com/watch?v=8bHi_VTmGVs
- https://www.youtube.com/watch?v=hNRxn5sKOdE
- https://www.youtube.com/watch?v=hGYNW8-_c3U
- https://www.youtube.com/watch?v=4OJ5lZMZgpg

Ce que j'ai appris:
1) que dans l'environnement de la db Render, il y avait non pas 1 nais 2 db:url.
2) que c'est visiblement possible de créer des webapp avec tout et n'importe quoi
3) que ça a l'air complexe, j'hésite a passer sur un autre hebergeur qui accepte mysql car je connais déja beaucoup plus


en regardant sur internet et internet m'a dit que l'hebergeur _*fly.io*_ est plus simple, plus performent et prends en charge mysql comparé a render ça fait rêver.


j'ai donc choisi de changer d'hebergeur et donc de revenir a la version dockerisée simple avant les modif pour la prod car je pense que j'ai fait des choses incohérentes 
et complexe pour rien et je préfére repartir de quelque chose de stable pour aller vers l'avant.

Je repars donc d'une version dockerisée avant la mise en prod pour faire une mise en prod travaillée et bien avec Fly.io

Après avoir regardé une courte video d'introduction de l'hebergeur et des commandes de base, j'ai deployé mon application avec Fly.io

le déployement a fonctionné (mais c'était toujours un build de dev et pas de prod) mais lorsque je vais a l'adresse de mon site, j'ai une 502 bad gateway -_-
j'essaie donc avec la documentation et les videos d'introduction du site de comprendre la source de l'erreur



__Résumé__
1) j'ai essayé de remedier à une erreur (ou il ne trouvait pas le package.json quand Render faisait le npm i)
2) après avoir demandé a chatgpt, Claude et DeepSeek comment je devrais faire pour que la suite fonctionne, il m'ont tous proposé 2 solutions: 
    - faire avec docker (plus complexe)
    - faire sans docker avec uniquement ce que propose l'hebergeur (plus simple et mieux pour les petites apps)
3) j'ai donc essayé en regardant une video de quelqu'un qui lançait son app en prod avec Render de créer un nouveau service web sans docker et voir ce que je pouvais en faire,
ça a marché au bout de qq essais mais connecter a la db et faire que tout fonctionne allait aussi être complexe et j'étais encore plus perdu avec ce nouvel outil qu'avec mes bon vieux dockerfile etc...
4) j'ai regardé un tuto sur comment déployer une app web non-statique avec une db mysql facilement et ils ont parlé de l'hebergeur Fly.io
5) je décide de revenir a mon build de docker normal (avant la mise en prod) (je fais quand même une release avant de mon travail sur render au cas ou)
6) une fois que le mon repo ne contient plus que mon application dockerisée, je commence le déployement sur Fly.io
7) une petite modification après le 1 er build qui était un échec car tout mes fichiers ne sont pas a la racine de flashcards, mais dans /AdonisCode
8) Launch du 2 eme build et c'est un succès, tous les tests passent et mon application est déployée.
9) problème, quand je vais sur l'adresse de l'app déployée, je tombe sur une *502 bad gateway*... 
10) je finis par remplir ce résumé dans le Journal et faire un constat de ce que j'ai fait par rapport a ce que je voulais faire

__Constat__ 
Je n'ai clairement pas rempli mes objectifs pour aujourd'hui car je me suis heurté à des problèmes tenaces et j'ai du revenir en arrière pour changer de méthode de mise en prod.
Je reste satisfait de mon travail car au vu de la docummentation que j'ai vu sur fly.io et des résultats que j'ai déja obtenu, je suis confiant pour la suite de la mis en production de mon application.
Je suis aussi content car j'ai été très constant dans mes commits et que j'ai bien rédigé le journal petit a petit.

J'estime avoir bien travaillé et j'en suis content.

Fin du journal pour le 03.05.2025