/************************************************************
 Ascodocpsy
 Load.js
 Ajout/Modification d'une notice
 Gestion de l'aide et contr�les de saisie
 Affichage des index d'aide � la saisie (tables de lookup)
 ************************************************************/

/************************************************************
 Affichage des index d'aide � la saisie (tables de lookup)
 ************************************************************/
jQuery(document).ready(
    function()
    {
        var title="Un index d'aide � la saisie est disponible pour ce champ.";
        
        jQuery('textarea[@name=Aut]').autocomplete
        (
            'Lookup?table=auteurs&value=%s',
            {
                title: title
            }
        );

        jQuery('textarea[@name=DipSpe]').autocomplete
        (
            'Lookup?table=diplomes&value=%s',
            {
                title: title
            }
        );

        jQuery('input[@name=CongrLie]').autocomplete
        (
            'Lookup?table=villes&value=%s',
            {
                title: title
            }
        );

        jQuery('textarea[@name=Edit]').autocomplete
        (
            'Lookup?table=editeurs&value=%s',
            {
                title: title
            }
        );

        jQuery('textarea[@name=Lieu]').autocomplete
        (
            'Lookup?table=lieux&value=%s',
            {
                title: title
            }
        );

        jQuery('textarea[@name=Col]').autocomplete
        (
            'Lookup?table=collections&value=%s',
            {
                title: title
            }
        );

        jQuery('input[@name=IsbnIssn]').autocomplete
        (
            'Lookup?table=isbnissn&value=%s',
            {
                title: title
            }
        );
        jQuery('textarea[@name=Rev]').autocomplete
        (
            'Lookup?table=revues&value=%s',
            {
                title: title
            }
        );

        jQuery('textarea[@name=Theme]').autocomplete
        (
            'Lookup?table=themes&value=%s',
            {
                title: title
            }
        );

        ThesoLookupUrl='../ThesaurusModule/ThesoLookup';
        jQuery('textarea[@name=MotCle]').autocomplete
        (
            ThesoLookupUrl + '?fre=[%s] or [%s*]',
            {
                asValue: false,
                height: 300,
                onload: ThesoLookup,
                title: title
            }
        );

        jQuery('textarea[@name=Nomp]').autocomplete
        (
            'Lookup?table=nomspropres&value=%s',
            {
                title: title
            }
        );

        jQuery('textarea[@name=CanDes]').autocomplete
        (
            'Lookup?table=candes&value=%s',
            {
                title: title
            }
        );
        
        jQuery('textarea[@name=Loc]').autocomplete
        (
            'Lookup?table=localisations&value=%s',
            {
                title: title
            }
        );
        
        jQuery('input[@name=ProdFich]').autocomplete
        (
            'Lookup?table=producteurs&value=%s',
            {
                title: title
            }
        );
    }
);


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
    var tLienAnne=Value.split(" ; ");
    var tAnnexe=Annexe.split(Controls[0][2]);

    if (tLienAnne.length != tAnnexe.length)
    {
        h  = "Il doit y avoir autant de titres d'annexes que de liens vers les versions �lectroniques des annexes.\n\n"
        h += "Les diff�rents liens doivent �tre s�par�s les uns des autres par le s�parateur ' ; ' (espace, point-virgule, espace)."
        ctrlAlert(h);
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
        h  = "Votre fiche contient une ou plusieurs erreurs. "
        h += "Elle sera visible du grand public.\n"
        h += "Nous vous conseillons de corriger votre fiche avant de l'enregistrer.\n\n"
        h += "Cliquez sur OK pour enregistrer la fiche, sur Annuler pour la corriger."
        return confirm( h ) ;
	}
    else if ( ctrlGetFieldValue(Statut)=="" )
    {        
        h  = "Impossible d'enregistrer la fiche : vous devez au minimum d�finir son statut.\n"
        ctrlFormAlert( h ) ;
        return false;
    }
	else
	{
		h  = "Votre fiche contient une ou plusieurs erreurs. "
		h += "Nous vous conseillons de corriger votre fiche avant de l'enregistrer.\n\n"
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
["Aut"             , "Auteurs"                                          ,      ,       ,        ,     1 ,       , "reAuteur"     ,                ],
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
["Notes"           , "Notes"				                            ,      ,       ,        ,       ,       ,                ,                ],
["Col"             , "Collection"                                       ,      ,       ,        ,       ,       ,                ,                ],
["Edit"            , "Editeur(s)"                                       ,      ,       ,        ,     1 ,       ,                ,                ],
["Lieu"            , "Lieu d'�dition ou de soutenance"                  ,      ,       ,        ,     1 ,       ,                ,                ],
["Reed"            , "Mention d'�dition"                                ,      ,       ,        ,       ,       ,                ,                ],
["IsbnIssn"        , "ISBN, ISSN"                                       ,      ,       ,        ,       ,     1 ,                ,                ],
["Resu"            , "R�sum�"                                           ,      ,       ,        ,       ,       ,                ,                ],
["Theme"           , "Th�me"                                            ,      ,       ,        ,       ,     1 , "reUpCase"     ,                ],
["MotCle"          , "Descripteurs"                                     ,      ,       ,        ,     1 ,       , "reUpCase"     ,                ],
["Nomp"            , "Noms propres"                                     ,      ,       ,        ,     1 ,       , "reUpCase"     ,                ],
["CanDes"          , "Candidats descripteurs"                           ,      ,       ,        ,     1 ,       , "reUpCase"     ,                ],
["Lien"            , "Lien vers le document"                            ,      ,       ,        ,       ,       , "reUrlIP"      ,                ],
["Loc"             , "Localisation du document"                         ,      ,       ,        ,     1 ,       , "reNomCentre"  ,                ],
["ProdFich"        , "Producteur de la fiche"                           ,      ,       ,        ,     1 ,       , "reNomCentre"  ,                ],
["Statut"          , "Statut de la notice"                              , true ,       ,        ,       ,       ,                ,                ]
]

// Pour document Article
var ControlsArticle =
[
[0, "FRE", "/", "CheckForm"],
//        0           		1                                              2       3       4        5       6        7                  8
// Nom du champ    , Libell� du champ                                   , Obl  , MinLen, MaxLen , MinArt, MaxArt, "RegExp"       , "UserFunc"
["Type"            , "Type de document"                                 , true ,       ,        ,       ,     1 ,                ,                ],
["Aut"             , "Auteurs"                                          , true ,       ,        ,     1 ,       , "reAuteur"     ,                ],
["Tit"             , "Titre de l'article"                               , true ,       ,        ,       ,       ,                ,                ],
["Date"            , "Ann�e du document"                                , true ,       ,        ,       ,     1 , "reYear"       ,                ],
["Rev"             , "Titre du p�riodique"                              , true ,       ,        ,       ,       ,                ,                ],
["Vol"             , "Volume du p�riodique"                             ,      ,       ,        ,       ,       ,                ,                ],
["Num"             , "Num�ro du p�riodique"                             , true ,       ,        ,       ,       ,                ,                ],
["PdPf"            , "Page de d�but et page de fin"                     , true ,       ,        ,       ,       ,                ,                ],
["Notes"           , "Notes bibliographiques"                           ,      ,       ,        ,       ,       ,                ,                ],
["Resu"            , "R�sum�"                                           ,      ,       ,        ,       ,       ,                ,                ],
["Theme"           , "Th�me"                                            ,      ,       ,        ,       ,     1 , "reUpCase"     ,                ],
["MotCle"          , "Descripteurs"                                     , true ,       ,        ,     1 ,       , "reUpCase"     ,                ],
["Nomp"            , "Noms propres"                                     ,      ,       ,        ,     1 ,       , "reUpCase"     ,                ],
["CanDes"          , "Candidats descripteurs"                           ,      ,       ,        ,     1 ,       , "reUpCase"     ,                ],
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
["Aut"             , "Auteurs"                                          , true ,       ,        ,     1 ,       , "reAuteur"     ,                ],
["Tit"             , "Titre du document"                                , true ,       ,        ,       ,       ,                ,                ],
["CongrTit"        , "Intitul� du congr�s"                              ,      ,       ,        ,       ,       ,                ,                ],
["CongrNum"        , "Num�ro du congr�s"                                ,      ,       ,        ,       ,       ,                ,                ],
["CongrDat"        , "Ann�e du congr�s"                                 ,      ,       ,        ,       ,     1 , "reYear"       ,                ],
["CongrLie"        , "Ville du congr�s"                                 ,      ,       ,        ,       ,       ,                ,                ],
["Date"            , "Ann�e du document"                                , true ,       ,        ,       ,     1 , "reYearDoc"    ,                ],
["Page"            , "Nombre de pages"                                  , true ,       ,        ,       ,       ,                ,                ],
["Notes"           , "Notes bibliographiques"                           ,      ,       ,        ,       ,       ,                ,                ],
["Col"             , "Collection"                                       ,      ,       ,        ,       ,       ,                ,                ],
["Edit"            , "Editeur"                                          , true ,       ,        ,     1 ,       ,                ,                ],
["Lieu"            , "Lieu d'�dition"                                   , true ,       ,        ,     1 ,       ,                ,                ],
["Reed"            , "Mention d'�dition"                                ,      ,       ,        ,       ,       ,                ,                ],
["IsbnIssn"        , "ISBN, ISSN"                                       ,      ,       ,        ,       ,       ,                ,                ],
["Resu"            , "R�sum�"                                           ,      ,       ,        ,       ,       ,                ,                ],
["Theme"           , "Th�me"                                            ,      ,       ,        ,       ,     1 , "reUpCase"     ,                ],
["MotCle"          , "Descripteurs"                                     , true ,       ,        ,     1 ,       , "reUpCase"     ,                ],
["Nomp"            , "Noms propres"                                     ,      ,       ,        ,     1 ,       , "reUpCase"     ,                ],
["CanDes"          , "Candidats descripteurs"                           ,      ,       ,        ,     1 ,       , "reUpCase"     ,                ],
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
["Aut"             , "Auteurs"                                          , true ,       ,        ,     1 ,       , "reAuteur"     ,                ],
["Tit"             , "Titre du document"                                , true ,       ,        ,       ,       ,                ,                ],
["CongrTit"        , "Intitul� du congr�s"                              , true ,       ,        ,       ,       ,                ,                ],
["CongrNum"        , "Num�ro du congr�s"                                , true ,       ,        ,       ,       ,                ,                ],
["CongrDat"        , "Ann�e du congr�s"                                 , true ,       ,        ,       ,     1 , "reYear"       ,                ],
["CongrLie"        , "Ville du congr�s"                                 , true ,       ,        ,       ,       ,                ,                ],
["Date"            , "Ann�e du document"                                , true ,       ,        ,       ,     1 , "reYearDoc"    ,                ],
["Page"            , "Nombre de pages"                                  , true ,       ,        ,       ,       ,                ,                ],
["Notes"           , "Notes bibliographiques"                           ,      ,       ,        ,       ,       ,                ,                ],
["Col"             , "Collection"                                       ,      ,       ,        ,       ,       ,                ,                ],
["Edit"            , "Editeur(s)"                                       , true ,       ,        ,     1 ,       ,                ,                ],
["Lieu"            , "Lieu d'�dition"                                   , true ,       ,        ,     1 ,       ,                ,                ],
["Reed"            , "Mention d'�dition"                                ,      ,       ,        ,       ,       ,                ,                ],
["IsbnIssn"        , "ISBN, ISSN"                                       ,      ,       ,        ,       ,     1 ,                ,                ],
["Resu"            , "R�sum�"                                           ,      ,       ,        ,       ,       ,                ,                ],
["Theme"           , "Th�me"                                            ,      ,       ,        ,       ,     1 , "reUpCase"     ,                ],
["MotCle"          , "Descripteurs"                                     , true ,       ,        ,     1 ,       , "reUpCase"     ,                ],
["Nomp"            , "Noms propres"                                     ,      ,       ,        ,     1 ,       , "reUpCase"     ,                ],
["CanDes"          , "Candidats descripteurs"                           ,      ,       ,        ,     1 ,       , "reUpCase"     ,                ],
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
["Aut"             , "Auteurs"                                          , true ,       ,        ,     1 ,       , "reAuteur"     ,                ],
["Tit"             , "Titre"                                            , true ,       ,        ,       ,       ,                ,                ],
["Date"            , "Ann�e du document"                                , true ,       ,        ,       ,     1 , "reYearDoc"    ,                ],
["Rev"             , "Titre du p�riodique"                              ,      ,       ,        ,       ,       ,                ,                ],
["Vol"             , "Volume du p�riodique"                             ,      ,       ,        ,       ,       ,                ,                ],
["Num"             , "Num�ro du p�riodique"                             ,      ,       ,        ,       ,       ,                ,                ],
["Page"            , "Nombre de pages"                                  , true ,       ,        ,       ,       ,                ,                ],
["Notes"           , "Notes bibliographiques"                           ,      ,       ,        ,       ,       ,                ,                ],
["Col"             , "Collection"                                       ,      ,       ,        ,       ,       ,                ,                ],
["Edit"            , "Editeur"                                          ,      ,       ,        ,     1 ,       ,                ,                ],
["Lieu"            , "Lieu d'�dition"                                   ,      ,       ,        ,     1 ,       ,                ,                ],
["Reed"            , "Mention d'�dition"                                ,      ,       ,        ,       ,       ,                ,                ],
["IsbnIssn"        , "ISBN, ISSN"                                       ,      ,       ,        ,       ,     1 ,                ,                ],
["Resu"            , "R�sum�"                                           ,      ,       ,        ,       ,       ,                ,                ],
["Theme"           , "Th�me"                                            , true ,       ,        ,       ,     1 , "reUpCase"     ,                ],
["MotCle"          , "Descripteurs"                                     , true ,       ,        ,     1 ,       , "reUpCase"     ,                ],
["Nomp"            , "Noms propres"                                     ,      ,       ,        ,     1 ,       , "reUpCase"     ,                ],
["CanDes"          , "Candidats descripteurs"                           ,      ,       ,        ,     1 ,       , "reUpCase"     ,                ],
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
["Aut"             , "Auteurs"                                          , true ,       ,        ,     1 ,       , "reAuteur"     ,                ],
["Tit"             , "Titre"                                            , true ,       ,        ,       ,       ,                ,                ],
["DipSpe"          , "Sp�cialit� du dipl�me"                            , true ,       ,        ,       ,       ,                ,                ],
["Date"            , "Ann�e de soutenance"                              , true ,       ,        ,       ,     1 , "reYearDoc"    ,                ],
["Page"            , "Nombre de pages"                                  , true ,       ,        ,       ,       ,                ,                ],
["Notes"           , "Notes bibliographiques"                           ,      ,       ,        ,       ,       ,                ,                ],
["Edit"            , "Institution morale de rattachement"               , true ,       ,        ,     1 ,       ,                ,                ],
["Lieu"            , "Lieu d'�dition ou de soutenance"                  , true ,       ,        ,     1 ,       ,                ,                ],
["Resu"            , "R�sum�"                                           ,      ,       ,        ,       ,       ,                ,                ],
["Theme"           , "Th�me"                                            ,      ,       ,        ,       ,     1 , "reUpCase"     ,                ],
["MotCle"          , "Descripteurs"                                     , true ,       ,        ,     1 ,       , "reUpCase"     ,                ],
["Nomp"            , "Noms propres"                                     ,      ,       ,        ,     1 ,       , "reUpCase"     ,                ],
["CanDes"          , "Candidats descripteurs"                           ,      ,       ,        ,     1 ,       , "reUpCase"     ,                ],
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
["DateText"        , "Date du texte officiel"                           ,      ,       ,        ,       ,     1 , "reDateUsual"  ,                ],
["DatePub"         , "Date de publication du texte officiel"            ,      ,       ,        ,       ,     1 , "reDateUsual"  ,                ],
["DateVali"        , "Date de fin de validit� du texte officiel"        ,      ,       ,        ,       ,     1 , "reDateUsual"  ,                ],
["Rev"             , "Titre du p�riodique"                              , true ,       ,        ,       ,       ,                ,                ],
["Num"             , "Num�ro du p�riodique"                             , true ,       ,        ,       ,       ,                ,                ],
["NumTexOf"        , "Num�ro du texte officiel"                         ,      ,       ,        ,       ,       ,                ,                ],
["Resu"            , "R�sum�"                                           ,      ,       ,        ,       ,       ,                ,                ],
["Theme"           , "Th�me"                                            , true ,       ,        ,       ,     1 , "reUpCase"     ,                ],
["MotCle"          , "Descripteurs"                                     , true ,       ,        ,     1 ,       , "reUpCase"     ,                ],
["Nomp"            , "Noms propres"                                     ,      ,       ,        ,     1 ,       , "reUpCase"     ,                ],
["CanDes"          , "Candidats descripteurs"                           ,      ,       ,        ,     1 ,       , "reUpCase"     ,                ],
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
