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
function CheckLienAnnexe(Value)
{
    var Annexe=ctrlGetFieldValue(document.forms[0].Annexe)

	// Si des titres d'annexes ont �t� saisis, les liens vers les annexes sont obligatoires
    //if (ctrlGetFieldValue(document.forms[0].Annexe))    
    if (Annexe)
	{
		if (Value.length == 0)
        {
			ctrlAlert("Les liens vers les annexes doivent �tre obligatoirement renseign�s si des titres d'annexes ont �t� indiqu�s.\n");
			return false;
        }
	}
    // Et inversement, si des liens sont saisis, les titres d'annexes correspondants doivent �tre indiqu�s
    else
    {
        if (Value)
        {
            ctrlAlert("Des liens vers les versions �lectroniques d'annexes ont �t� saisis mais aucun titre d'annexe n'a �t� indiqu�.\n");
            return false;
        }
    }
    
    // Il doit y avoir autant de titres d'annexes que de liens
    var tLienAnne=Value.split(";");
    var tAnnexe=Annexe.split(Controls[0][2]);

    if (tLienAnne.length != tAnnexe.length)
    {
        ctrlAlert("Il doit y avoir autant de titres d'annexes que de liens vers les versions �lectroniques des annexes.\n");
        return false;
    }
    
	return true;
}

function CheckForm(ControlsName)
{
	var h ;
	var Statut;

    if ( ctrlFields(ControlsName) ) return true ;
	Statut=document.forms[0].Statut;

	if ( ctrlGetFieldValue(Statut)=="valide" )
	{
		h  = "Impossible d'enregistrer la fiche : elle contient des erreurs et la fiche a �t� valid�e par un administrateur. "
        h += "Elle est donc visible du grand public.\n"
		h += "Pour enregistrer la fiche, corrigez les erreurs qu'elle contient.\n\n"
		h += "Voici le texte de la premi�re erreur :\n\n"+ctrlError
		alert(h) ;
		return false ;
	}
    else if ( ctrlGetFieldValue(Statut)=="" )
    {        
        h  = "Impossible d'enregistrer la fiche : elle contient des erreurs.\n"
        h += "Vous n'avez notamment pas d�fini son statut.\n"
        h += "Pour enregistrer la fiche, corrigez les erreurs qu'elle contient et d�finissez son statut.\n\n"
        h += "Voici le texte de la premi�re erreur :\n\n"+ctrlError
        alert(h) ;
        return false ;
    }
	else
	{
		h  = "Votre fiche contient une ou plusieurs erreurs. Voici le texte de la premi�re :\n\n"
		h += ctrlError
		h += "\n\nNous vous conseillons de corriger votre fiche avant de l'enregistrer.\n"
		h += "N�anmoins, comme, pour le moment, elle n'est pas visible du grand public "
        h += "(car non valid�e par un administrateur), vous pouvez, si vous le souhaitez, "
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
["Annexe"          , "Titres des annexes"                               ,      ,       ,        ,       ,       ,                ,                ],
["LienAnne"        , "Adresses Internet des annexes"                    ,      ,       ,        ,       ,       ,                ,"CheckLienAnnexe"],
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
["IsbnIssn"        , "ISBN, ISSN"                                       ,      ,       ,        ,       ,       ,                ,                ],
["Resu"            , "R�sum�"                                           ,      ,       ,        ,       ,       ,                ,                ],
["Theme"           , "Th�me"                                            ,      ,       ,        ,       ,     1 , "reUpCase"     ,                ],
["MotCle"          , "Descripteurs"                                     ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["Nomp"            , "Noms propres"                                     ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["CanDes"          , "Candidats descripteurs"                           ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["Lien"            , "Lien vers le document"                            ,      ,       ,        ,       ,       , "reUrlIP"      ,                ],
["Loc"             , "Localisation du document"                         ,      ,       ,        ,       ,       , "reNomCentre"  ,                ],
["ProdFich"        , "Producteur de la fiche"                           ,      ,       ,        ,       ,       , "reNomCentre"  ,                ],
["Statut"          , "Statut de la notice"                              , true ,       ,        ,       ,       ,                ,                ]
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
["ProdFich"        , "Producteur de la fiche"                           , true ,       ,        ,     1 ,       , "reNomCentre"  ,                ],
["Statut"          , "Statut de la notice"                              , true ,       ,        ,       ,       ,                ,                ]
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
["IsbnIssn"        , "ISBN, ISSN"                                       , true ,       ,        ,       ,       ,                ,                ],
["Resu"            , "R�sum�"                                           ,      ,       ,        ,       ,       ,                ,                ],
["Theme"           , "Th�me"                                            ,      ,       ,        ,       ,     1 , "reUpCase"     ,                ],
["MotCle"          , "Descripteurs"                                     , true ,       ,        ,       ,       , "reUpCase"     ,                ],
["Nomp"            , "Noms propres"                                     ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["CanDes"          , "Candidats descripteurs"                           ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["Lien"            , "Lien vers le document"                            ,      ,       ,        ,       ,       , "reUrlIP"      ,                ],
["Loc"             , "Localisation du document"                         , true ,       ,        ,     1 ,       , "reNomCentre"  ,                ],
["ProdFich"        , "Producteur de la fiche"                           , true ,       ,        ,     1 ,       , "reNomCentre"  ,                ],
["Statut"          , "Statut de la notice"                              , true ,       ,        ,       ,       ,                ,                ]
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
["IsbnIssn"        , "ISBN, ISSN"                                       , true ,       ,        ,       ,       ,                ,                ],
["Resu"            , "R�sum�"                                           ,      ,       ,        ,       ,       ,                ,                ],
["Theme"           , "Th�me"                                            ,      ,       ,        ,       ,     1 , "reUpCase"     ,                ],
["MotCle"          , "Descripteurs"                                     , true ,       ,        ,       ,       , "reUpCase"     ,                ],
["Nomp"            , "Noms propres"                                     ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["CanDes"          , "Candidats descripteurs"                           ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["Lien"            , "Lien vers le document"                            ,      ,       ,        ,       ,       , "reUrlIP"      ,                ],
["Loc"             , "Localisation du document"                         , true ,       ,        ,     1 ,       , "reNomCentre"  ,                ],
["ProdFich"        , "Producteur de la fiche"                           , true ,       ,        ,     1 ,       , "reNomCentre"  ,                ],
["Statut"          , "Statut de la notice"                              , true ,       ,        ,       ,       ,                ,                ]
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
["IsbnIssn"        , "ISBN, ISSN"                                       ,      ,       ,        ,       ,       ,                ,                ],
["Resu"            , "R�sum�"                                           ,      ,       ,        ,       ,       ,                ,                ],
["Theme"           , "Th�me"                                            ,      ,       ,        ,       ,     1 , "reUpCase"     ,                ],
["MotCle"          , "Descripteurs"                                     , true ,       ,        ,       ,       , "reUpCase"     ,                ],
["Nomp"            , "Noms propres"                                     ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["CanDes"          , "Candidats descripteurs"                           ,      ,       ,        ,       ,       , "reUpCase"     ,                ],
["Lien"            , "Lien vers le document"                            , true ,       ,        ,       ,       , "reUrlIP"      ,                ],
["ProdFich"        , "Producteur de la fiche"                           , true ,       ,        ,     1 ,       , "reNomCentre"  ,                ],
["Statut"          , "Statut de la notice"                              , true ,       ,        ,       ,       ,                ,                ]
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
["ProdFich"        , "Producteur de la fiche"                           , true ,       ,        ,     1 ,       , "reNomCentre"  ,                ],
["Statut"          , "Statut de la notice"                              , true ,       ,        ,       ,       ,                ,                ]
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
["Annexe"          , "Titres des annexes"                               ,      ,       ,        ,       ,       ,                ,                ],
["LienAnne"        , "Adresses Internet des annexes"                    ,      ,       ,        ,       ,       ,                ,"CheckLienAnnexe"],
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
["ProdFich"        , "Producteur de la fiche"                           , true ,       ,        ,     1 ,       , "reNomCentre"  ,                ],
["Statut"          , "Statut de la notice"                              , true ,       ,        ,       ,       ,                ,                ]
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
["IsbnIssn"        , "ISSN"                                             , true ,       ,        ,       ,       ,                ,                ],
["Lien"            , "Lien vers le document"                            ,      ,       ,        ,       ,       , "reUrlIP"      ,                ],
["ProdFich"        , "Producteur de la fiche"                           , true ,       ,        ,     1 ,       , "reNomCentre"  ,                ],
["Statut"          , "Statut de la notice"                              , true ,       ,        ,       ,       ,                ,                ]
]
