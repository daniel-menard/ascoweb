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
["Type"            , "Type de document"                                 , true ,       ,        ,       ,     1 ,                ,                ],
["NatText"         , "Nature du texte officiel"                         ,      ,       ,        ,       ,     1 ,                ,                ],
["Aut"             , "Auteurs"                                          ,      ,       ,        ,       ,       ,                ,                ],
["Tit"             , "Titre du document"                                ,      ,       ,        ,       ,       ,                ,                ],
["Annexe"          , "Titre de l'annexe"                                ,      ,       ,        ,       ,       ,                ,                ],
["CongrTit"        , "Intitul� du congr�s"                              ,      ,       ,        ,       ,       ,                ,                ],
["CongrNum"        , "Num�ro du congr�s"                                ,      ,       ,        ,       ,       ,                ,                ],
["CongrDat"        , "Ann�e du congr�s"                                 ,      ,       ,        ,       ,     1 , "reYear"       ,                ],
["CongrLie"        , "Ville du congr�s"                                 ,      ,       ,        ,       ,       ,                ,                ],
["DipSpe"          , "Sp�cialit� du dipl�me"                            ,      ,       ,        ,       ,       ,                ,                ],
["Date"            , "Ann�e du document ou de soutenance"               ,      ,       ,        ,       ,     1 , "reYearDoc"    ,                ],
["DateText"        , "Date du texte officiel"                           ,      ,       ,        ,       ,     1 , "reDateUsual"  ,                ],
["DatePub"         , "Date de publication du texte officiel"            ,      ,       ,        ,       ,     1 , "reDateUsual"  ,                ],
["DateVali"        , "Date de fin de validit� du texte officiel"        ,      ,       ,        ,       ,     1 , "reDateUsual"  ,                ],
["Rev"             , "Titre du p�riodique"                              ,      ,       ,        ,       ,       ,                ,                ],
["Vol"             , "Volume du p�riodique"                             ,      ,       ,        ,       ,       ,                ,                ],
["Num"             , "Num�ro du p�riodique"                             ,      ,       ,        ,       ,       ,                ,                ],
["NumTexOf"        , "Num�ro du texte officiel"                         ,      ,       ,        ,       ,       ,                ,                ],
["ViePerio"        , "Date de vie et de mort du titre de p�riodique"	,      ,       ,        ,       ,       , "rePeriod"     ,                ],
["EtatCol"         , "Etat de la collection"                            ,      ,       ,        ,       ,       ,                ,                ],
["Page"            , "Nombre de pages"                                  ,      ,       ,        ,       ,       ,                ,                ],
["PdPf"            , "Page de d�but et page de fin"                     ,      ,       ,        ,       ,       ,                ,                ],
["Notes"           , "Notes bibliographiques"                           ,      ,       ,        ,       ,       ,                ,                ],
["Col"             , "Collection"                                       ,      ,       ,        ,       ,       ,                ,                ],
["Edit"            , "Editeur(s)"                                       ,      ,       ,        ,       ,       ,                ,                ],
["Lieu"            , "Lieu d'�dition ou de soutenance"                  ,      ,       ,        ,       ,       ,                ,                ],
["Reed"            , "Mention d'�dition"                                ,      ,       ,        ,       ,       ,                ,                ],
["IsbnIssn"        , "ISBN, ISSN"                                       ,      ,     9 ,     13 ,       ,     1 , "reIsbnIssn"   ,                ],
["Resu"            , "R�sum�"                                           ,      ,       ,        ,       ,       ,                ,                ],
["Theme"           , "Th�me"                                            ,      ,       ,        ,       ,     1 , "reUpCase"     ,                ],
["MotCle"          , "Descripteurs"                                     ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["Nomp"            , "Noms propres"                                     ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["CanDes"          , "Candidats descripteurs"                           ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["Lien"            , "Lien vers le document"                            ,      ,       ,        ,       ,       , "reUrlIP"      ,                ],
["Loc"             , "Localisation du document"                         ,      ,       ,        ,       ,       , "reNomCentre"  ,                ],
["ProdFich"        , "Producteur de la fiche"                           ,      ,       ,        ,       ,       , "reNomCentre"  ,                ]
]

// Pour document Article
var ControlsArticle =
[
[0, "FRE", "/", "CheckForm"],
//        0           		1                                              2       3       4        5       6        7                  8
// Nom du champ    , Libell� du champ                                   , Obl  , MinLen, MaxLen , MinArt, MaxArt, "RegExp"       , "UserFunc"
["Type"            , "Type de document"                                 , true ,       ,        ,       ,     1 ,                ,                ],
["Aut"             , "Auteurs"                                          , true ,       ,        ,       ,       ,                ,                ],
["Tit"             , "Titre de l'article"                               , true ,       ,        ,       ,       ,                ,                ],
["Date"            , "Ann�e du document"                                , true ,       ,        ,       ,     1 , "reYear"       ,                ],
["Rev"             , "Titre du p�riodique"                              , true ,       ,        ,       ,       ,                ,                ],
["Vol"             , "Volume du p�riodique"                             ,      ,       ,        ,       ,       ,                ,                ],
["Num"             , "Num�ro du p�riodique"                             , true ,       ,        ,       ,       ,                ,                ],
["PdPf"            , "Page de d�but et page de fin"                     , true ,       ,        ,       ,       ,                ,                ],
["Notes"           , "Notes bibliographiques"                           ,      ,       ,        ,       ,       ,                ,                ],
["Resu"            , "R�sum�"                                           ,      ,       ,        ,       ,       ,                ,                ],
["Theme"           , "Th�me"                                            ,      ,       ,        ,       ,     1 , "reUpCase"     ,                ],
["MotCle"          , "Descripteurs"                                     , true ,       ,        ,       ,       , "reUpCase"     ,                ],
["Nomp"            , "Noms propres"                                     ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["CanDes"          , "Candidats descripteurs"                           ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["Lien"            , "Lien vers le document"                            ,      ,       ,        ,       ,       , "reUrlIP"      ,                ],
["ProdFich"        , "Producteur de la fiche"                           , true ,       ,        ,     1 ,       , "reNomCentre"  ,                ]
]

// Pour document Livre
var ControlsLivre =
[
[0, "FRE", "/", "CheckForm"],
//        0           		1                                              2       3       4        5       6        7                  8
// Nom du champ    , Libell� du champ                                   , Obl  , MinLen, MaxLen , MinArt, MaxArt, "RegExp"       , "UserFunc"
["Type"            , "Type de document"                                 , true ,       ,        ,       ,     1 ,                ,                ],
["Aut"             , "Auteurs"                                          , true ,       ,        ,       ,       ,                ,                ],
["Tit"             , "Titre du document"                                , true ,       ,        ,       ,       ,                ,                ],
["CongrTit"        , "Intitul� du congr�s"                              ,      ,       ,        ,       ,       ,                ,                ],
["CongrNum"        , "Num�ro du congr�s"                                ,      ,       ,        ,       ,       ,                ,                ],
["CongrDat"        , "Ann�e du congr�s"                                 ,      ,       ,        ,       ,     1 , "reYear"       ,                ],
["CongrLie"        , "Ville du congr�s"                                 ,      ,       ,        ,       ,       ,                ,                ],
["Date"            , "Ann�e du document"                                , true ,       ,        ,       ,     1 , "reYearDoc"    ,                ],
["Page"            , "Nombre de pages"                                  , true ,       ,        ,       ,       ,                ,                ],
["Notes"           , "Notes bibliographiques"                           ,      ,       ,        ,       ,       ,                ,                ],
["Col"             , "Collection"                                       ,      ,       ,        ,       ,       ,                ,                ],
["Edit"            , "Editeur"                                          , true ,       ,        ,       ,       ,                ,                ],
["Lieu"            , "Lieu d'�dition"                                   , true ,       ,        ,       ,       ,                ,                ],
["Reed"            , "Mention d'�dition"                                ,      ,       ,        ,       ,       ,                ,                ],
["IsbnIssn"        , "ISBN, ISSN"                                       , true ,     9 ,     13 ,       ,     1 , "reIsbnIssn"   ,                ],
["Resu"            , "R�sum�"                                           ,      ,       ,        ,       ,       ,                ,                ],
["Theme"           , "Th�me"                                            ,      ,       ,        ,       ,     1 , "reUpCase"     ,                ],
["MotCle"          , "Descripteurs"                                     , true ,       ,        ,       ,       , "reUpCase"     ,                ],
["Nomp"            , "Noms propres"                                     ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["CanDes"          , "Candidats descripteurs"                           ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["Lien"            , "Lien vers le document"                            ,      ,       ,        ,       ,       , "reUrlIP"      ,                ],
["Loc"             , "Localisation du document"                         , true ,       ,        ,     1 ,       , "reNomCentre"  ,                ],
["ProdFich"        , "Producteur de la fiche"                           , true ,       ,        ,     1 ,       , "reNomCentre"  ,                ]
]

// Pour document Congr�s
var ControlsCongres =
[
[0, "FRE", "/", "CheckForm"],
//        0           		1                                              2       3       4        5       6        7                  8
// Nom du champ    , Libell� du champ                                   , Obl  , MinLen, MaxLen , MinArt, MaxArt, "RegExp"       , "UserFunc"
["Type"            , "Type de document"                                 , true ,       ,        ,       ,     1 ,                ,                ],
["Aut"             , "Auteurs"                                          , true ,       ,        ,       ,       ,                ,                ],
["Tit"             , "Titre du document"                                , true ,       ,        ,       ,       ,                ,                ],
["CongrTit"        , "Intitul� du congr�s"                              , true ,       ,        ,       ,       ,                ,                ],
["CongrNum"        , "Num�ro du congr�s"                                , true ,       ,        ,       ,       ,                ,                ],
["CongrDat"        , "Ann�e du congr�s"                                 , true ,       ,        ,       ,     1 , "reYear"       ,                ],
["CongrLie"        , "Ville du congr�s"                                 , true ,       ,        ,       ,       ,                ,                ],
["Date"            , "Ann�e du document"                                , true ,       ,        ,       ,     1 , "reYearDoc"    ,                ],
["Page"            , "Nombre de pages"                                  , true ,       ,        ,       ,       ,                ,                ],
["Notes"           , "Notes bibliographiques"                           ,      ,       ,        ,       ,       ,                ,                ],
["Col"             , "Collection"                                       ,      ,       ,        ,       ,       ,                ,                ],
["Edit"            , "Editeur(s)"                                       , true ,       ,        ,       ,       ,                ,                ],
["Lieu"            , "Lieu d'�dition"                                   , true ,       ,        ,       ,       ,                ,                ],
["Reed"            , "Mention d'�dition"                                ,      ,       ,        ,       ,       ,                ,                ],
["IsbnIssn"        , "ISBN, ISSN"                                       , true ,     9 ,     13 ,       ,     1 , "reIsbnIssn"   ,                ],
["Resu"            , "R�sum�"                                           ,      ,       ,        ,       ,       ,                ,                ],
["Theme"           , "Th�me"                                            ,      ,       ,        ,       ,     1 , "reUpCase"     ,                ],
["MotCle"          , "Descripteurs"                                     , true ,       ,        ,       ,       , "reUpCase"     ,                ],
["Nomp"            , "Noms propres"                                     ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["CanDes"          , "Candidats descripteurs"                           ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["Lien"            , "Lien vers le document"                            ,      ,       ,        ,       ,       , "reUrlIP"      ,                ],
["Loc"             , "Localisation du document"                         , true ,       ,        ,     1 ,       , "reNomCentre"  ,                ],
["ProdFich"        , "Producteur de la fiche"                           , true ,       ,        ,     1 ,       , "reNomCentre"  ,                ]
]

// Pour document Rapport
var ControlsRapport =
[
[0, "FRE", "/", "CheckForm"],
//        0           		1                                              2       3       4        5       6        7                  8
// Nom du champ    , Libell� du champ                                   , Obl  , MinLen, MaxLen , MinArt, MaxArt, "RegExp"       , "UserFunc"
["Type"            , "Type de document"                                 , true ,       ,        ,       ,     1 ,                ,                ],
["Aut"             , "Auteurs"                                          , true ,       ,        ,       ,       ,                ,                ],
["Tit"             , "Titre"                                            , true ,       ,        ,       ,       ,                ,                ],
["Date"            , "Ann�e du document"                                , true ,       ,        ,       ,     1 , "reYearDoc"    ,                ],
["Rev"             , "Titre du p�riodique"                              ,      ,       ,        ,       ,       ,                ,                ],
["Vol"             , "Volume du p�riodique"                             ,      ,       ,        ,       ,       ,                ,                ],
["Num"             , "Num�ro du p�riodique"                             ,      ,       ,        ,       ,       ,                ,                ],
["Page"            , "Nombre de pages"                                  , true ,       ,        ,       ,       ,                ,                ],
["Notes"           , "Notes bibliographiques"                           ,      ,       ,        ,       ,       ,                ,                ],
["Col"             , "Collection"                                       ,      ,       ,        ,       ,       ,                ,                ],
["Edit"            , "Editeur"                                          ,      ,       ,        ,       ,       ,                ,                ],
["Lieu"            , "Lieu d'�dition"                                   ,      ,       ,        ,       ,       ,                ,                ],
["Reed"            , "Mention d'�dition"                                ,      ,       ,        ,       ,       ,                ,                ],
["IsbnIssn"        , "ISBN, ISSN"                                       ,      ,     9 ,     13 ,       ,     1 , "reIsbnIssn"   ,                ],
["Resu"            , "R�sum�"                                           ,      ,       ,        ,       ,       ,                ,                ],
["Theme"           , "Th�me"                                            ,      ,       ,        ,       ,     1 , "reUpCase"     ,                ],
["MotCle"          , "Descripteurs"                                     , true ,       ,        ,       ,       , "reUpCase"     ,                ],
["Nomp"            , "Noms propres"                                     ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["CanDes"          , "Candidats descripteurs"                           ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["Lien"            , "Lien vers le document"                            , true ,       ,        ,       ,       , "reUrlIP"      ,                ],
["ProdFich"        , "Producteur de la fiche"                           , true ,       ,        ,     1 ,       , "reNomCentre"  ,                ]
]

// Pour documents M�moire et Th�se
var ControlsMemoire =
[
[0, "FRE", "/", "CheckForm"],
//        0           		1                                              2       3       4        5       6        7                  8
// Nom du champ    , Libell� du champ                                   , Obl  , MinLen, MaxLen , MinArt, MaxArt, "RegExp"       , "UserFunc"
["Type"            , "Type de document"                                 , true ,       ,        ,       ,     1 ,                ,                ],
["Aut"             , "Auteurs"                                          , true ,       ,        ,       ,       ,                ,                ],
["Tit"             , "Titre"                                            , true ,       ,        ,       ,       ,                ,                ],
["DipSpe"          , "Sp�cialit� du dipl�me"                            , true ,       ,        ,       ,       ,                ,                ],
["Date"            , "Ann�e de soutenance"                              , true ,       ,        ,       ,     1 , "reYearDoc"    ,                ],
["Page"            , "Nombre de pages"                                  , true ,       ,        ,       ,       ,                ,                ],
["Notes"           , "Notes bibliographiques"                           ,      ,       ,        ,       ,       ,                ,                ],
["Edit"            , "Institution morale de rattachement"               , true ,       ,        ,       ,       ,                ,                ],
["Lieu"            , "Lieu d'�dition ou de soutenance"                  , true ,       ,        ,       ,       ,                ,                ],
["Resu"            , "R�sum�"                                           ,      ,       ,        ,       ,       ,                ,                ],
["Theme"           , "Th�me"                                            ,      ,       ,        ,       ,     1 , "reUpCase"     ,                ],
["MotCle"          , "Descripteurs"                                     , true ,       ,        ,       ,       , "reUpCase"     ,                ],
["Nomp"            , "Noms propres"                                     ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["CanDes"          , "Candidats descripteurs"                           ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["Lien"            , "Lien vers le document"                            ,      ,       ,        ,       ,       , "reUrlIP"      ,                ],
["Loc"             , "Localisation du document"                         , true ,       ,        ,     1 ,       , "reNomCentre"  ,                ],
["ProdFich"        , "Producteur de la fiche"                           , true ,       ,        ,     1 ,       , "reNomCentre"  ,                ]
]

// Pour document Texte officiel
var ControlsTexteOfficiel =
[
[0, "FRE", "/", "CheckForm"],
//        0           		1                                              2       3       4        5       6        7                  8
// Nom du champ    , Libell� du champ                                   , Obl  , MinLen, MaxLen , MinArt, MaxArt, "RegExp"       , "UserFunc"
["Type"            , "Type de document"                                 , true ,       ,        ,       ,     1 ,                ,                ],
["NatText"         , "Nature du texte officiel"                         , true ,       ,        ,       ,     1 ,                ,                ],
["Tit"             , "Titre"                                            , true ,       ,        ,       ,       ,                ,                ],
["Annexe"          , "Titre de l'annexe"                                ,      ,       ,        ,       ,       ,                ,                ],
["DateText"        , "Date du texte officiel"                           , true ,       ,        ,       ,       , "reDateUsual"  ,                ],
["DatePub"         , "Date de publication du texte officiel"            , true ,       ,        ,       ,       , "reDateUsual"  ,                ],
["DateVali"        , "Date de fin de validit� du texte officiel"        ,      ,       ,        ,       ,       , "reDateUsual"  ,                ],
["Rev"             , "Titre du p�riodique"                              , true ,       ,        ,       ,       ,                ,                ],
["Num"             , "Num�ro du p�riodique"                             , true ,       ,        ,       ,       ,                ,                ],
["NumTexOf"        , "Num�ro du texte officiel"                         ,      ,       ,        ,       ,       ,                ,                ],
["Resu"            , "R�sum�"                                           ,      ,       ,        ,       ,       ,                ,                ],
["Theme"           , "Th�me"                                            ,      ,       ,        ,       ,     1 , "reUpCase"     ,                ],
["MotCle"          , "Descripteurs"                                     , true ,       ,        ,       ,       , "reUpCase"     ,                ],
["Nomp"            , "Noms propres"                                     ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["CanDes"          , "Candidats descripteurs"                           ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["Lien"            , "Lien vers le document"                            , true ,       ,        ,       ,       , "reUrlIP"      ,                ],
["ProdFich"        , "Producteur de la fiche"                           , true ,       ,        ,     1 ,       , "reNomCentre"  ,                ]
]

// Pour document P�riodique
var ControlsPeriodique =
[
[0, "FRE", "/", "CheckForm"],
//        0           		1                                              2        3       4        5       6        7                 8
// Nom du champ    , Libell� du champ                                   , Obl  , MinLen, MaxLen , MinArt, MaxArt, "RegExp"       , "UserFunc"
["Type"            , "Type de document"                                 , true ,       ,        ,       ,     1 ,                ,                ],
["Rev"             , "Titre du p�riodique"                              , true ,     2 ,        ,       ,       ,                ,                ],
["ViePerio"        , "Date de vie et de mort"                           , true ,       ,        ,       ,       , "rePeriod"     ,                ],
["EtatCol"         , "Etat de la collection"                            , true ,       ,        ,       ,       ,                ,                ],
["Notes"           , "Notes"                                            ,      ,       ,        ,       ,       ,                ,                ],
["IsbnIssn"        , "ISSN"                                             , true ,       ,        ,       ,     1 , "reIssnExt"    ,                ],
["Lien"            , "Lien vers le document"                            ,      ,       ,        ,       ,       , "reUrlIP"      ,                ],
["ProdFich"        , "Producteur de la fiche"                           , true ,       ,        ,     1 ,       , "reNomCentre"  ,                ]
]
