/************************************************************
 Ascodocpsy
 Load.js
 Ajout/Modification d'une notice
 Gestion de l'aide et contr�les de saisie
 ************************************************************/


/************************************************************
 Gestion de l'aide
 ************************************************************/

function Help(Ctx)
{
	var f=parent.frames["Help"] ;
	if (f && f.location) f.location.replace ("Help.asp#" + Ctx);
	window.status=Ctx;
}

function InitFields()
{
	// affiche l'intro de l'aide une fois la page charg�e
	Help("INTRO");

	// affecte un gestionnaire onfocus � tous les �l�ments du formulaire
	var i, e ;
	var c=document.forms[0].elements ;

	for (i=0; i<c.length;i++)
	{
		e=c[i];
		if (e.name != "")
			e.onfocus=new Function("Help('" + e.name.toUpperCase() +"')") ;
	}
}

/************************************************************
 Contr�les de saisie
 ************************************************************/
/*
function OpenUrl()
{
	alert("CheckUrl");
	window.open(document.forms[0].Url.value);
}


function CheckThemes(Value)
{
	var t=Value.split(Controls[0][2]);
	if (t.length <= 1) return true;

	var h="," + Value + ",";
	h=h.toUpperCase();

	var Find="Sant� publique - g�n�ralit�s"
	Find=Find.toUpperCase();

	if ( h.indexOf(Find) != -1)
	{
		ctrlAlert("Il est interdit de mentionner des th�mes lorsque la valeur '" + Find + "' est s�lectionn�e.") ;
		return false;
	}
	return true;
}

function CheckActes(Value)
{
	h = Value;
	h2 = ctrlGetFieldValue(document.forms[0].ActesInfo);   
	h3 = ctrlGetFieldValue(document.forms[0].ActesContact);

	if ( h == "1" ) 
	{
	   if ( ( h2 != "" & h3 == "") || ( h3 != "" & h2 == "") )     //si ActesInfo rempli et pas ActesContact ou inversement, OK
	   {
              return true ;
	   }
	   if ( h2 == "" & h3 == "")         //si ni ActesInfo rempli ni ActesContact, alerte
	   {
	      ctrlAlert("Vous devez remplir les champs Pr�cisions et Contact pour les actes.\nCes champs sont obligatoires lorsque la publication d'actes est pr�vue.") ;
              return false ;
	   }
	}
	return true ;                     //ds les autres cas, OK
}

function CheckDateDebut(Value)
{
	if (document.forms[0].Valid) return true;				// on est en �dition de fiche, pas de controle sur la date de d�but

	var t=Value.split("/")							// Extrait le jour, le mois et l'ann�e
	if (new Date(t[2], t[1]-1, t[0], 23,59,59) >= new Date()) return true;	// V�rifie que la date est sup�rieure � la date du jour

	ctrlAlert("La date du colloque est erron�e. Vous ne pouvez saisir un colloque dont la date est d�j� pass�e !\n");
	return false;
}

function CheckDateFin(Value)
{
	if ( ! CheckDateDebut(Value) ) return false;
	var t=ctrlGetFieldValue(document.forms[0].DateDebut).split("/");	// Date de d�but
	var t2=Value.split("/")							// Date de fin
	if (new Date(t[2], t[1]-1, t[0]) <= new Date(t2[2], t2[1]-1, t2[0])) return true;	// V�rifie que Debut <= Fin

	ctrlAlert("La date de fin du colloque est erron�e. \n Vous ne pouvez saisir un colloque dont la date de fin est ant�rieure � la date de d�but !\n");
	return false;
}

function CheckDateValide(Value)
{
	if (Value.length == 0) return true;	// champ vide, pas de contr�les puisqu'il n'est pas obligatoire
	if (document.forms[0].Valid) return true;	// on est en �dition de fiche, pas de controle sur la date de d�but

	var t=Value.split("/")							// Extrait le jour, le mois et l'ann�e
	if (new Date(t[2], t[1]-1, t[0], 23,59,59) >= new Date()) return true;	// V�rifie que la date est sup�rieure � la date du jour

	ctrlAlert("La date saisie est erron�e. Vous ne pouvez saisir une date d�j� pass�e !\n");
	return false;
}

function CheckLienAnnexe(Value)
{
	if (ctrlGetFieldValue(document.forms[0].Annexe))
	{
		if (Value.length == 0)
			ctrlAlert("Le lien vers l'annexe doit �tre obligatoirement renseign� si le titre de l'annexe a �t� indiqu�.\n");
			return false;
	}
	return true;
}
*/

function CheckForm(ControlsName)
{
	var h ;
	var Valid;

        if ( ctrlFields(ControlsName) ) return true ;
	Valid=document.forms[0].Valid;

	if ( Valid && ctrlGetFieldValue(Valid)=="" )
	{
		h  = "Impossible d'enregistrer la fiche : elle contient des erreurs et la fiche a �t� valid�e.\n"
		h += "Pour enregistrer la fiche, corrigez les erreurs qu'elle contient ou rendez la fiche invisible.\n\n"
		h += "Voici le texte de la premi�re erreur :\n\n"+ctrlError
		alert(h) ;
		return false ;
	}
	else
	{
		h  = "Votre fiche contient une ou plusieurs erreurs. Voici le texte de la premi�re :\n\n"
		h += ctrlError
		h += "\n\nNous vous conseillons de corriger votre fiche avant de l'enregistrer.\n"
		h += "N�anmoins, comme elle n'est pas visible pour le moment, vous pouvez, si vous le souhaitez, "
		h += "l'enregistrer dans son �tat actuel.\n"
		h += "Cliquez sur OK pour enregistrer la fiche, sur Annuler pour la corriger."
		return confirm( h ) ;
	}
}
// Formulaire de saisie avec tous les champs
var Controls =
[
[0, "FRE", "/", "CheckForm"],
//        0           		1                                              2       3       4        5       6        7                  8
// Nom du champ    , Libell� du champ                                   , Obl  , MinLen, MaxLen , MinArt, MaxArt, "RegExp"       , "UserFunc"
["TYPE"            , "Type de document"                                 , true ,       ,        ,       ,     1 ,                ,                ],
["NATTEXT"         , "Nature du texte officiel"                         ,      ,       ,        ,       ,     1 ,                ,                ],
["AUT"             , "Auteurs"                                          ,      ,       ,        ,       ,       ,                ,                ],
["TIT"             , "Titre du document"                                ,      ,       ,        ,       ,       ,                ,                ],
["ANNEXE"          , "Titre de l'annexe"                                ,      ,       ,        ,       ,       ,                ,                ],
["CONGRTIT"        , "Intitul� du congr�s"                              ,      ,       ,        ,       ,       ,                ,                ],
["CONGRNUM"        , "Num�ro du congr�s"                                ,      ,       ,        ,       ,       ,                ,                ],
["CONGRDAT"        , "Ann�e du congr�s"                                 ,      ,       ,        ,       ,     1 , "reYear"       ,                ],
["CONGRLIEU"        , "Ville du congr�s"                                 ,      ,       ,        ,       ,       ,                ,                ],
["DIPSPE"          , "Sp�cialit� du dipl�me"                            ,      ,       ,        ,       ,       ,                ,                ],
["DATE"            , "Ann�e du document ou de soutenance"               ,      ,       ,        ,       ,     1 , "reYearDoc"    ,                ],
["DATETEXT"        , "Date du texte officiel"                           ,      ,       ,        ,       ,     1 , "reDateUsual"  ,                ],
["DATEPUB"         , "Date de publication du texte officiel"            ,      ,       ,        ,       ,     1 , "reDateUsual"  ,                ],
["DATEVALI"        , "Date de fin de validit� du texte officiel"        ,      ,       ,        ,       ,     1 , "reDateUsual"  ,                ],
["REV"             , "Titre du p�riodique"                              ,      ,       ,        ,       ,       ,                ,                ],
["VOL"             , "Volume du p�riodique"                             ,      ,       ,        ,       ,       ,                ,                ],
["NUM"             , "Num�ro du p�riodique"                             ,      ,       ,        ,       ,       ,                ,                ],
["NUMTEXOF"        , "Num�ro du texte officiel"                         ,      ,       ,        ,       ,       ,                ,                ],
["VIEPERIO"        , "Date de vie et de mort du titre de p�riodique"	,      ,       ,        ,       ,       , "rePeriod"     ,                ],
["ETATCOL"         , "Etat de la collection"                            ,      ,       ,        ,       ,       ,                ,                ],
["PAGE"            , "Nombre de pages"                                  ,      ,       ,        ,       ,       ,                ,                ],
["PDPF"            , "Page de d�but et page de fin"                     ,      ,       ,        ,       ,       ,                ,                ],
["NOTES"           , "Notes bibliographiques"                           ,      ,       ,        ,       ,       ,                ,                ],
["COL"             , "Collection"                                       ,      ,       ,        ,       ,       ,                ,                ],
["EDIT"            , "Editeur(s)"                                       ,      ,       ,        ,       ,       ,                ,                ],
["LIEU"            , "Lieu d'�dition ou de soutenance"                  ,      ,       ,        ,       ,       ,                ,                ],
["REED"            , "Mention d'�dition"                                ,      ,       ,        ,       ,       ,                ,                ],
["ISBNISSN"        , "ISBN, ISSN"                                       ,      ,     9 ,     13 ,       ,     1 , "reIsbnIssn"   ,                ],
["RESU"            , "R�sum�"                                           ,      ,       ,        ,       ,       ,                ,                ],
["THEME"           , "Th�me"                                            ,      ,       ,        ,       ,     1 , "reUpCase"     ,                ],
["MOTCLE"          , "Descripteurs"                                     ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["NOMP"            , "Noms propres"                                     ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["CANDES"          , "Candidats descripteurs"                           ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["LIEN"            , "Lien vers le document"                            ,      ,       ,        ,       ,       , "reUrlIP"      ,                ],
["LOC"             , "Localisation du document"                         ,      ,       ,        ,       ,       , "reNomCentre"  ,                ],
["PRODFICH"        , "Producteur de la fiche"                           ,      ,       ,        ,       ,       , "reNomCentre"  ,                ]
]

// Pour document Article
var ControlsArticle =
[
[0, "FRE", "/", "CheckForm"],
//        0           		1                                              2       3       4        5       6        7                  8
// Nom du champ    , Libell� du champ                                   , Obl  , MinLen, MaxLen , MinArt, MaxArt, "RegExp"       , "UserFunc"
["TYPE"            , "Type de document"                                 , true ,       ,        ,       ,     1 ,                ,                ],
["AUT"             , "Auteurs"                                          , true ,       ,        ,       ,       ,                ,                ],
["TIT"             , "Titre de l'article"                               , true ,       ,        ,       ,       ,                ,                ],
["DATE"            , "Ann�e du document"                                , true ,       ,        ,       ,     1 , "reYear"       ,                ],
["REV"             , "Titre du p�riodique"                              , true ,       ,        ,       ,       ,                ,                ],
["VOL"             , "Volume du p�riodique"                             ,      ,       ,        ,       ,       ,                ,                ],
["NUM"             , "Num�ro du p�riodique"                             , true ,       ,        ,       ,       ,                ,                ],
["PDPF"            , "Page de d�but et page de fin"                     , true ,       ,        ,       ,       ,                ,                ],
["NOTES"           , "Notes bibliographiques"                           ,      ,       ,        ,       ,       ,                ,                ],
["RESU"            , "R�sum�"                                           ,      ,       ,        ,       ,       ,                ,                ],
["THEME"           , "Th�me"                                            , true ,       ,        ,       ,     1 , "reUpCase"     ,                ],
["MOTCLE"          , "Descripteurs"                                     , true ,       ,        ,       ,       , "reUpCase"     ,                ],
["NOMP"            , "Noms propres"                                     ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["CANDES"          , "Candidats descripteurs"                           ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["LIEN"            , "Lien vers le document"                            ,      ,       ,        ,       ,       , "reUrlIP"      ,                ],
["PRODFICH"        , "Producteur de la fiche"                           , true ,       ,        ,     1 ,       , "reNomCentre"  ,                ]
]

// Pour document Livre
var ControlsLivre =
[
[0, "FRE", "/", "CheckForm"],
//        0           		1                                              2       3       4        5       6        7                  8
// Nom du champ    , Libell� du champ                                   , Obl  , MinLen, MaxLen , MinArt, MaxArt, "RegExp"       , "UserFunc"
["TYPE"            , "Type de document"                                 , true ,       ,        ,       ,     1 ,                ,                ],
["AUT"             , "Auteurs"                                          , true ,       ,        ,       ,       ,                ,                ],
["TIT"             , "Titre du document"                                , true ,       ,        ,       ,       ,                ,                ],
["CONGRTIT"        , "Intitul� du congr�s"                              ,      ,       ,        ,       ,       ,                ,                ],
["CONGRNUM"        , "Num�ro du congr�s"                                ,      ,       ,        ,       ,       ,                ,                ],
["CONGRDAT"        , "Ann�e du congr�s"                                 ,      ,       ,        ,       ,     1 , "reYear"       ,                ],
["CONGRLIE"        , "Ville du congr�s"                                 ,      ,       ,        ,       ,       ,                ,                ],
["DATE"            , "Ann�e du document"                                , true ,       ,        ,       ,     1 , "reYearDoc"    ,                ],
["PAGE"            , "Nombre de pages"                                  , true ,       ,        ,       ,       ,                ,                ],
["NOTES"           , "Notes bibliographiques"                           ,      ,       ,        ,       ,       ,                ,                ],
["COL"             , "Collection"                                       ,      ,       ,        ,       ,       ,                ,                ],
["EDIT"            , "Editeur"                                          , true ,       ,        ,       ,       ,                ,                ],
["LIEU"            , "Lieu d'�dition"                                   , true ,       ,        ,       ,       ,                ,                ],
["REED"            , "Mention d'�dition"                                ,      ,       ,        ,       ,       ,                ,                ],
["ISBNISSN"        , "ISBN, ISSN"                                       , true ,     9 ,     13 ,       ,     1 , "reIsbnIssn"   ,                ],
["RESU"            , "R�sum�"                                           ,      ,       ,        ,       ,       ,                ,                ],
["THEME"           , "Th�me"                                            , true ,       ,        ,       ,     1 , "reUpCase"     ,                ],
["MOTCLE"          , "Descripteurs"                                     , true ,       ,        ,       ,       , "reUpCase"     ,                ],
["Nomp"            , "Noms propres"                                     ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["CANDES"          , "Candidats descripteurs"                           ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["LIEN"            , "Lien vers le document"                            ,      ,       ,        ,       ,       , "reUrlIP"      ,                ],
["LOC"             , "Localisation du document"                         , true ,       ,        ,       ,       , "reNomCentre"  ,                ],
["PRODFICH"        , "Producteur de la fiche"                           , true ,       ,        ,     1 ,       , "reNomCentre"  ,                ]
]

// Pour document Congr�s
var ControlsCongres =
[
[0, "FRE", "/", "CheckForm"],
//        0           		1                                              2       3       4        5       6        7                  8
// Nom du champ    , Libell� du champ                                   , Obl  , MinLen, MaxLen , MinArt, MaxArt, "RegExp"       , "UserFunc"
["TYPE"            , "Type de document"                                 , true ,       ,        ,       ,     1 ,                ,                ],
["AUT"             , "Auteurs"                                          , true ,       ,        ,       ,       ,                ,                ],
["TIT"             , "Titre du document"                                , true ,       ,        ,       ,       ,                ,                ],
["CONGRTIT"        , "Intitul� du congr�s"                              , true ,       ,        ,       ,       ,                ,                ],
["CONGRNUM"        , "Num�ro du congr�s"                                , true ,       ,        ,       ,       ,                ,                ],
["CONGRDAT"        , "Ann�e du congr�s"                                 , true ,       ,        ,       ,     1 , "reYear"       ,                ],
["CONGRLIEU"        , "Ville du congr�s"                                 , true ,       ,        ,       ,       ,                ,                ],
["DATE"            , "Ann�e du document"                                , true ,       ,        ,       ,     1 , "reYearDoc"    ,                ],
["PAGE"            , "Nombre de pages"                                  , true ,       ,        ,       ,       ,                ,                ],
["NOTES"           , "Notes bibliographiques"                           ,      ,       ,        ,       ,       ,                ,                ],
["COL"             , "Collection"                                       ,      ,       ,        ,       ,       ,                ,                ],
["EDIT"            , "Editeur(s)"                                       , true ,       ,        ,       ,       ,                ,                ],
["LIEU"            , "Lieu d'�dition"                                   , true ,       ,        ,       ,       ,                ,                ],
["REED"            , "Mention d'�dition"                                ,      ,       ,        ,       ,       ,                ,                ],
["ISBNISSN"        , "ISBN, ISSN"                                       , true ,     9 ,     13 ,       ,     1 , "reIsbnIssn"   ,                ],
["RESU"            , "R�sum�"                                           ,      ,       ,        ,       ,       ,                ,                ],
["THEME"           , "Th�me"                                            , true ,       ,        ,       ,     1 , "reUpCase"     ,                ],
["MOTCLE"          , "Descripteurs"                                     , true ,       ,        ,       ,       , "reUpCase"     ,                ],
["NOMP"            , "Noms propres"                                     ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["CANDES"          , "Candidats descripteurs"                           ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["LIEN"            , "Lien vers le document"                            ,      ,       ,        ,       ,       , "reUrlIP"      ,                ],
["LOC"             , "Localisation du document"                         , true ,       ,        ,       ,       , "reNomCentre"  ,                ],
["PRODFICH"        , "Producteur de la fiche"                           , true ,       ,        ,     1 ,       , "reNomCentre"  ,                ]
]

// Pour document Rapport
var ControlsRapport =
[
[0, "FRE", "/", "CheckForm"],
//        0           		1                                              2       3       4        5       6        7                  8
// Nom du champ    , Libell� du champ                                   , Obl  , MinLen, MaxLen , MinArt, MaxArt, "RegExp"       , "UserFunc"
["TYPE"            , "Type de document"                                 , true ,       ,        ,       ,     1 ,                ,                ],
["AUT"             , "Auteurs"                                          , true ,       ,        ,       ,       ,                ,                ],
["TIT"             , "Titre"                                            , true ,       ,        ,       ,       ,                ,                ],
["DATE"            , "Ann�e du document"                                , true ,       ,        ,       ,     1 , "reYearDoc"    ,                ],
["REV"             , "Titre du p�riodique"                              ,      ,       ,        ,       ,       ,                ,                ],
["VOL"             , "Volume du p�riodique"                             ,      ,       ,        ,       ,       ,                ,                ],
["NUM"             , "Num�ro du p�riodique"                             ,      ,       ,        ,       ,       ,                ,                ],
["PAGE"            , "Nombre de pages"                                  , true ,       ,        ,       ,       ,                ,                ],
["NOTES"           , "Notes bibliographiques"                           ,      ,       ,        ,       ,       ,                ,                ],
["COL"             , "Collection"                                       ,      ,       ,        ,       ,       ,                ,                ],
["EDIT"            , "Editeur"                                          ,      ,       ,        ,       ,       ,                ,                ],
["LIEU"            , "Lieu d'�dition"                                   ,      ,       ,        ,       ,       ,                ,                ],
["REED"            , "Mention d'�dition"                                ,      ,       ,        ,       ,       ,                ,                ],
["ISBNISSN"        , "ISBN, ISSN"                                       ,      ,     9 ,     13 ,       ,     1 , "reIsbnIssn"   ,                ],
["RESU"            , "R�sum�"                                           ,      ,       ,        ,       ,       ,                ,                ],
["THEME"           , "Th�me"                                            , true ,       ,        ,       ,     1 , "reUpCase"     ,                ],
["MOTCLE"          , "Descripteurs"                                     , true ,       ,        ,       ,       , "reUpCase"     ,                ],
["NOMP"            , "Noms propres"                                     ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["CANDES"          , "Candidats descripteurs"                           ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["LIEN"            , "Lien vers le document"                            , true ,       ,        ,       ,       , "reUrlIP"      ,                ],
["PRODFICH"        , "Producteur de la fiche"                           , true ,       ,        ,     1 ,       , "reNomCentre"  ,                ]
]

// Pour documents M�moire et Th�se
var ControlsMemoire =
[
[0, "FRE", "/", "CheckForm"],
//        0           		1                                              2       3       4        5       6        7                  8
// Nom du champ    , Libell� du champ                                   , Obl  , MinLen, MaxLen , MinArt, MaxArt, "RegExp"       , "UserFunc"
["TYPE"            , "Type de document"                                 , true ,       ,        ,       ,     1 ,                ,                ],
["AUT"             , "Auteurs"                                          , true ,       ,        ,       ,       ,                ,                ],
["TIT"             , "Titre"                                            , true ,       ,        ,       ,       ,                ,                ],
["DIPSPE"          , "Sp�cialit� du dipl�me"                            , true ,       ,        ,       ,       ,                ,                ],
["DATE"            , "Ann�e de soutenance"                              , true ,       ,        ,       ,     1 , "reYearDoc"    ,                ],
["PAGE"            , "Nombre de pages"                                  , true ,       ,        ,       ,       ,                ,                ],
["NOTES"           , "Notes bibliographiques"                           ,      ,       ,        ,       ,       ,                ,                ],
["EDIT"            , "Institution morale de rattachement"               , true ,       ,        ,       ,       ,                ,                ],
["LIEU"            , "Lieu d'�dition ou de soutenance"                  , true ,       ,        ,       ,       ,                ,                ],
["RESU"            , "R�sum�"                                           ,      ,       ,        ,       ,       ,                ,                ],
["THEME"           , "Th�me"                                            , true ,       ,        ,       ,     1 , "reUpCase"     ,                ],
["MOTCLE"          , "Descripteurs"                                     , true ,       ,        ,       ,       , "reUpCase"     ,                ],
["NOMP"            , "Noms propres"                                     ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["CANDES"          , "Candidats descripteurs"                           ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["LIEN"            , "Lien vers le document"                            ,      ,       ,        ,       ,       , "reUrlIP"      ,                ],
["LOC"             , "Localisation du document"                         , true ,       ,        ,       ,       , "reNomCentre"  ,                ],
["PRODFICH"        , "Producteur de la fiche"                           , true ,       ,        ,     1 ,       , "reNomCentre"  ,                ]
]

// Pour document Texte officiel
var ControlsTexteOfficiel =
[
[0, "FRE", "/", "CheckForm"],
//        0           		1                                              2       3       4        5       6        7                  8
// Nom du champ    , Libell� du champ                                   , Obl  , MinLen, MaxLen , MinArt, MaxArt, "RegExp"       , "UserFunc"
["TYPE"            , "Type de document"                                 , true ,       ,        ,       ,     1 ,                ,                ],
["NATTEXT"         , "Nature du texte officiel"                         , true ,       ,        ,       ,     1 ,                ,                ],
["TIT"             , "Titre"                                            , true ,       ,        ,       ,       ,                ,                ],
["ANNEXE"          , "Titre de l'annexe"                                ,      ,       ,        ,       ,       ,                ,                ],
["DATETEXT"        , "Date du texte officiel"                           , true ,       ,        ,       ,       , "reDateUsual"  ,                ],
["DATEPUB"         , "Date de publication du texte officiel"            , true ,       ,        ,       ,       , "reDateUsual"  ,                ],
["DATEVALI"        , "Date de fin de validit� du texte officiel"        ,      ,       ,        ,       ,       , "reDateUsual"  ,                ],
["REV"             , "Titre du p�riodique"                              , true ,       ,        ,       ,       ,                ,                ],
["NUM"             , "Num�ro du p�riodique"                             , true ,       ,        ,       ,       ,                ,                ],
["NUMTEXOF"        , "Num�ro du texte officiel"                         ,      ,       ,        ,       ,       ,                ,                ],
["RESU"            , "R�sum�"                                           ,      ,       ,        ,       ,       ,                ,                ],
["THEME"           , "Th�me"                                            , true ,       ,        ,       ,     1 , "reUpCase"     ,                ],
["MOTCLE"          , "Descripteurs"                                     , true ,       ,        ,       ,       , "reUpCase"     ,                ],
["NOMP"            , "Noms propres"                                     ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["CANDES"          , "Candidats descripteurs"                           ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["LIEN"            , "Lien vers le document"                            , true ,       ,        ,       ,       , "reUrlIP"      ,                ],
["PRODFICH"        , "Producteur de la fiche"                           , true ,       ,        ,     1 ,       , "reNomCentre"  ,                ]
]

// Pour document P�riodique
var ControlsPeriodique =
[
[0, "FRE", "/", "CheckForm"],
//        0           		1                                              2        3       4        5       6        7                 8
// Nom du champ    , Libell� du champ                                   , Obl  , MinLen, MaxLen , MinArt, MaxArt, "RegExp"       , "UserFunc"
["TYPE"            , "Type de document"                                 , true ,       ,        ,       ,     1 ,                ,                ],
["REV"             , "Titre du p�riodique"                              , true ,     2 ,        ,       ,       ,                ,                ],
["VIEPERIO"        , "Date de vie et de mort"                           , true ,       ,        ,       ,       , "rePeriod"     ,                ],
["ETATCOL"         , "Etat de la collection"                            , true ,       ,        ,       ,       ,                ,                ],
["NOTES"           , "Notes"                                            ,      ,       ,        ,       ,       ,                ,                ],
["ISBNISSN"        , "ISSN"                                             , true ,       ,        ,       ,     1 , "reIssnExt"    ,                ],
["LIEN"            , "Lien vers le document"                            ,      ,       ,        ,       ,       , "reUrlIP"      ,                ],
["PRODFICH"        , "Producteur de la fiche"                           , true ,       ,        ,     1 ,       , "reNomCentre"  ,                ]
]
