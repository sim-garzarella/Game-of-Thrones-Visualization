## Game of Thrones Visualization ##

Visualizing information about relationships, groups and houses to which they belong of the Game of Thrones series' characters.

Progetto finale per l'esame di Visualizzazione delle Informazioni - Università Roma Tre

--------------------------------------------------------------------------------------------------------------------------------

La visualizzazione consiste in un grafo, in cui i nodi rappresentano i personaggi ed ogni arco una relazione tra essi.
All'interno di ogni nodo è disponibile l'immagine identificativa del personaggio.
I nodi hanno diverse forme che dipendono dal gruppo a cui i personaggi appartengono. Se essi non fanno parte di alcun gruppo allora i loro nodi avranno una forma di default (Cerchio).

Quando ci si posizione con il cursore del mouse su un nodo, tramite un'animazione vengono visualizzati il nome del personaggio, la casata di appartenenza (se c'è) e la casata acquisita tramite matrimonio (se c'è).
Inoltre il contorno del nodo acquisisce il colore verde se il personaggio è vivo, il rosso se è morto e il grigio se la sua condizione non è certa.
Infine gli archi incidenti sul nodo si colorano a seconda del tipo di relazione che il personaggio ha con i personaggi a cui è collegato.
Per consentire al meglio la visualizzazione del personaggio corrente, il suo nodo viene ingrandito, mentre tutti gli altri vengono messi in trasparenza.
Una volta che si sposta il cursore fuori dal nodo, il grafo torna alla sua forma originaria.

Sul lato sinistro è disponibile una legenda interattiva, suddivisa in 3 parti:
1) Relations: i tipi di relazione tra personaggi con i rispettivi colori. 
              È possibile scorrere con il cursore del mouse sulle relazioni, in questo modo i nodi andranno in trasparenza e verranno evidenziati e colorati tutti gli archi relativi a tali relazioni.
2) Groups: i gruppi a cui appartengono alcuni personaggi, con relativa forma adiacente.
	   È possibile scorrere con il cursore del mouse sui gruppi, in questo modo i nodi relativi ai personaggi appartenenti a tali gruppi verranno evidenziati, mentre gli altri andranno in trasparenza.
3) Status: lo stato di vita dei personaggi.
	   È possibile scorrere con il cursore del mouse sugli status, in questo modo i nodi relativi ai personaggi con quello status verranno evidenziati, mentre gli altri andranno in trasparenza.