# 09-01-2014 Feedback duo review template

| Duo                         | Namen                                                |
| --------------------------- | ---------------------------------------------------- |
| Duo dat de review doet:     | <mark>Fauzan en Rocco</mark>                |
| Duo dat de review ontvangt: | <mark>Sofyan en Safouane</mark> |

## Introductie

Tijdens dit duo peer review gaan jullie de volgende onderdelen van het werk van een ander duo bekijken en voorzien van feedback.<br>
Feedback is meer dan een regeltje 'Goed gedaan!'. Beschrijf vooral het 'waarom' jullie iets 'goed' of 'voor verbetering vatbaar' vinden.

Onder het ‘review' valt bijvoorbeeld:

-   Doornemen van het class diagram
-   Doornemen van het entity relationship diagram
-   Doornemen van het database ontwerp
-   Zijn de OOP principes toegepast? Zo ja, hoe dan?
-   Documentatie (gebruikersonderzoek, prototype)

Mochten jullie iets missen of niet kunnen vinden in het aangeleverde werk: neem contact op met het andere duo.
Het is de bedoeling dat jullie <mark>de gemarkeerde delen</mark> in dit document zelf gaan invullen.<br>
Als het document ingevuld is, kun je dit gebruiken tijdens de feedback presentatie naar het andere duo. Eventueel kun je bepaalde feedback aanpassen.<br>

## Feedbackpunten overzicht

Gebruik het onderstaande schema voor eventuele extra informatie.

| Feedbackpunt                      | Achtergrond informatie                                                                                                                                                           |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Class diagram                     | [Knowledge base](https://knowledgebase.hbo-ict-hva.nl/1_beroepstaken/software/ontwerpen/uml/uml_class_diagram/)                                                                  |
| Entity Relationship Diagram (ERD) | [Knowledge base](https://knowledgebase.hbo-ict-hva.nl/1_beroepstaken/software/ontwerpen/relationele_databases/erd/)                                                              |
| Inheritance (OOP principe)        | [README.MD 4 OOP principes](https://icthva.sharepoint.com/:u:/r/sites/FDMCI_EDU_HBOICT_Prop_B_Rood/Gedeelde%20documenten/B102/four-oop-principles-main.zip?csf=1&web=1&e=gXBLIL) |
| Encapsulation (OOP principe)      | [README.MD 4 OOP principes](https://icthva.sharepoint.com/:u:/r/sites/FDMCI_EDU_HBOICT_Prop_B_Rood/Gedeelde%20documenten/B102/four-oop-principles-main.zip?csf=1&web=1&e=gXBLIL) |
| Polymorphism (OOP principe)       | [README.MD 4 OOP principes](https://icthva.sharepoint.com/:u:/r/sites/FDMCI_EDU_HBOICT_Prop_B_Rood/Gedeelde%20documenten/B102/four-oop-principles-main.zip?csf=1&web=1&e=gXBLIL) |
| Abstraction (OOP principe)        | [README.MD 4 OOP principes](https://icthva.sharepoint.com/:u:/r/sites/FDMCI_EDU_HBOICT_Prop_B_Rood/Gedeelde%20documenten/B102/four-oop-principles-main.zip?csf=1&web=1&e=gXBLIL) |
|                                   |                                                                                                                                                                                  |

### FEEDBACK class diagram

Het zal handig zijn om een class diagram maken, zodat je voor jezelf inzicht hebt op de classes die je hebt en of die classes relaties hebben met elkaar of niet (via [mermaid](https://mermaid.live) heb je dat zo gedaan).

### FEEDBACK Entity Relationship Diagram (ERD)

Het zal handing zijn om een Entity Relationship Diagram te maken van bijvoorbeeld je database, je kan dan hiermee een overzicht hebben op alle tabellen die je hebt gemaakt met daarin de relaties tussen de tabellen (Bijvoorbeeld als ik een user tabel hebt en een question tabel, kan je een optional many to one relatie hebben. Dit houdt in dat het mogelijk is dat een user meerdere vragen heeft, maar een vraag heeft altijd een user).

### FEEDBACK Database ontwerp

Misschien de SQL code die jullie hadden gebruikt in jullie repository zetten? Hiermee kan je bijvoorbeeld snel aanpassingen maken aan je database en hoef je niet elke keer opnieuw de code in MySQL te schrijven.

### FEEDBACK Inheritance (OOP principe)

Ik zie dat bij jullie geen sprake is van de Inheritance principe (en ik denk niet echt dat het van toepassing is bij deze project). Inheritance is dat er een sub class is die de eigenschappen van een class overnemen en dat zie ik niet in de user.ts model.

### FEEDBACK Encapsulation (OOP principe)

Er wordt bij jullie user.ts model goed gebruik gemaakt van de encapsulation principe. Je kunt zien dat alle eigenschappen (zoals id, username, etc.) alleen binnen de class user gebruikt kunnen worden (omdat het op private staat) en dat alleen het ophalen en neerzetten van de data buiten de class kan worden gebruik.

### FEEDBACK Polymorphism (OOP principe)

Er is bij jullie sprake van parameter gebaseerde polymorphisme, want de waarden die uit de methodes komen kunnen verschillen (omdat iedere user andere data heeft in de database). De principe van het polymorphisme, wordt door jullie goed toegepast.

### FEEDBACK Abstraction (OOP principe)

Er wordt bij jullie goed gebruik gemaakt van de Abstraction principe, omdat er alleen relevante informatie (zoals id, username, etc) wordt gebruikt om de user vorm te geven.

### FEEDBACK Documentatie

Ik zie dat er al wat documentatie in jullie docs staan. Ik zou wel adviserene om sub mappen te maken in je docs folder (bijvoorbeeld retrospective, peer to peer, etc.), waardoor er wat overzicht ontstaat.

### FEEDBACK Overig

Voor de rest netjes gewerkt, ik zie ook dat er hard wordt gewerkt aan het project. Probeer als jullie tijd hebben (en zin hebben natuurlijk) om de feedback die ik jullie heb gegeven toe te passen in jullie laatste sprint.
