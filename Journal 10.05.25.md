**Objectifs**
*objectifs pour la matinée du 10.05.25*

- améliorer mon ReadMe pour qu'on puisse lancer la prod depuis le ReadMe et que le code soit compréhensible
    - doit parler de la manière de mettre a jour
    - doit parler des 3 environnement (dev, staging, prod) + mettre a jour les 3
    - DOC TECHNIQUE !!!

- expliquer ce que j'ai fait dans le journal.
- faire le bilan de ce que j'ai fait.



_*travail effectué:*_

j'ai commencé par documenter la dockerization de l'application flashcards en reprennant mon application avant la dockerization 
-ps j'ai fait le tout en anglais car je trouvais que ça faisait raccord avec le code ainsi que la doc que j'ai utilisée et j'ai un meilleur vocabulaire informatique en anglais qu'en français

pour ce faire il faut download le zip du commit endCommit... du 02.04.25

pour ma documentation, j'ai commencé par regarder la documentation officielle sur le markdown ainsi qu'une video sur le markdown
- https://www.markdownguide.org/
- https://www.youtube.com/watch?v=_PPWWRV6gbA


Ensuite j'ai comparé mon app non dockerizée avec l'app dockerizée de la release
j'ai constaté les fichier en + ou modifiés ce qui m'a aidé à resituer ce que j'avais fait et dans quel ordre je l'avais fait.
puis en fournissant ces documents à l'ia je lui ai demandé quel serait l'ordre le plus logique pour ces étapes puis depuis sa réponse, 
j'ai pu redockerizer en même temps que documenter mon ReadMe.

J'ai fait comme ça pour m'assurer que ce que je notais dans mon ReadMe était purement fonctionnel.

A la fin de ma dockerization et donc de ce chapitre dans mon ReadMe, j'ai fait un commit expliquant ce que j'avais fait.



Puis j'ai fait le même procédé pour la prod, j'ai commencé par revoir la documentation officielle et une video sur fly.io
- https://fly.io/docs/
- https://www.youtube.com/watch?v=HGKO4FC_C70

Ensuite j'ai pris l'app que je venais de dockerizer et en me souvenant des commandes + en m'aidant d'un prompt de chatGPT sur fly.io que j'avais enregistré dans mon repo qui donne l'ordren des commandes a utiliser,
j'ai pu mettre la db sur fly.io puis l'app et enfin faire la connection entre les deux après quelques tests de ping car ce sont en fait des vms 

Le tout évidemment en documentant chaque étape dans le readMe en respectant le markdown
puis j'ai commit le tout 
et ensuite j'ai commit a nouveau en ajoutant la documentation que j'ai utilisé et que j'avais oublié de mettre.


*Ce que j'ai appris:*
j'ai appris divers facts sur le markdown ainsi que des bonnes habitudes à avoir lorsqu'on en fait
sinon pas grand chose car j'ai surtout refait des choses que j'avais déjà faites avant.


__Résumé__
1) j'ai consulté des videos suir le markdown pour créer un beau ReadMe
2) j'ai téléchargé le zip contenant mon app non dockerizée et dockerizée
3) j'ai comparé les deux et à l'aide de la documentation et de l'ia j'ai pu retracer les étapes dans l'ordres
4) j'ai fait ces étapes dans l'ordre en marquant au fur et a mesure ce que je faisais dans le ReadMe
5) j'ai testé puis ajusté et commit
6) j'ai regradé une video sur fly.io et la doc officielle pour bien retenir les étapes 
7) j'ai executé les étapes petit à petit en notant ce que je faisais dans le ReadMe + markdown pour la db
8) j'ai executé les étapes petit à petit en notant ce que je faisais dans le ReadMe + markdown pour l'application 
9) après avoir fait ces étapes, j'ai connecté les deux en testant avec des pings
10) j'ai deployé l'app et vérifié que je pouvais bien l'atteindre depuis le web
11) j'ai commit
12) j'ai ajouté la doc que j'avais utilisé au ReadMe 
13) j'ai rédigé ce document de journal et fait ce résumé


__Conclusion__
Je pense avoir bien travaillé car je ne suis pas très bon en markdown à la base,
mais la doc m'a bien aidé et je me suis bien appliqué pour faire des bons documents.
Je pense que ce journal est correct, le ReadMe est la pour le compléter avec les étapes pour la dockerization et la prod
Je suis plutot content de mon travail et de mon application sur le markdown

__Point a améliorer__
je pense que pour la prochaine fois il serait plus judicieux de faire le ReadMe en même temps que le projet pour ne pas faire le travail a double.
