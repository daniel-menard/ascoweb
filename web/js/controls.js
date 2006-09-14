/************************************************************
 Validation
 ************************************************************/

// Ascodocpsy
/*
Page = 220 ou VIII-220 ou pagination multiple
PdPf = 5-8 ou I-Xv ou "1 ; 3-11"
Edit = [s.n.]
Lieu = [s.l.] ou Paris
*/

// Chiffre
var reChiffre      = "[0-9]"

// Ann�e au format AAAA, Mois, Jour
var reYear         = "19_Chiffre_{2}|20[0-1]_Chiffre_"		// une ann�e sur 4 chiffres (1900 � 2019)
var reMonth	       = "(0[1-9]|1[0-2])"				        // un mois sur deux chiffres (01 � 12)
var reDay	       = "(0[1-9]|[12][0-9]|3[01])"			    // un jour sur deux chiffres (01 � 31)
var reYearFRE      = "La date doit �tre dans le format suivant : AAAA.\nExemple : 2005"

// Ann�e evalu�e au format [AAAA]
var reYearEval     = "\\[_Year_\\]"

// Format sans date
var reNoYear       = "\\[s.d.\\]"

// Date au format Ascodocpsy (AAAA ou [AAAA] ou [s.d.])
var reYearDoc      = "_Year_|_YearEval_|_NoYear_"
var reYearDocFRE   = "L'ann�e doit �tre dans l'un des formats suivants :\nAAAA si l'ann�e est connue (exemple : 2006), elle doit �tre sup�rieure  � 1900\n[AAAA] si l'ann�e est �valu�e (exemple : [2006])\n[s.d.] dans le cas d'un document sans date."

// Date au format AAAA-MM-JJ : format usuel
var reDateUsual    = "_Year_-_Month_-_Day_"
var reDateUsualFRE = "La date doit �tre dans le format suivant : AAAA-MM-JJ (exemple : 2006-04-15 pour le 15 avril 2006)"

// P�riode (AAAA- ou AAAA-AAAA)
var rePeriod       = "(_Year_)-(_Year_)?"
var rePeriodFRE    = "L'information doit �tre saisie sous la forme suivante :\n- AAAA- si le p�riodique n'a pas cess� de para�tre (exemple : 1995-),\n- AAAA-AAAA si le p�riodique a cess� de para�tre (exemple : 1985-2005)."

// Texte en majuscules
var reMaju         = "[A-Z']"
var reMajus        = "_Maju_+"                                // Texte comportant au moins 2 majuscules
var reUpCase       = " *[-.*]? *_Char_*_Majus_ *[0-9]*"       // Texte comprenant des espaces ou des caract�res ou des chiffres ou des majus
var reUpCaseFRE    = "L'information doit �tre saisie enti�rement en majuscules et doit comporter au moins 2 caract�res."

// Auteurs physiques
// DELAISI DE PARSEVAL JL de R�le
// NOM P1P2[ particule][ R�le][ �p.|n�|n�e][ NOM] | COLLECTIF | [s.n.]
/*
- Collaborateur : Collab.
- Directeur ou coordonnateur : Dir.
- Editeur scientifique : Ed.
- Illustrateur : Ill. 
- Pr�facier : Pr�f.
- Traducteur : Trad.
*/


// Auteurs collectifs
// MINISTERE DE LA SANTE


// Lieu d'�dition inconnu : s.l.
var reSansLieu     = "\\[s.l.\\]"

// Lieu d'�dition au format Ascodocpsy
//var reLieu         = 

// Auteur ou �diteur inconnu : s.n.
var reNoName       = "\\[s.n.\\]"

// ISSN
var reIssn         = "_Chiffre_{4}-_Chiffre_{3}[0-9X]"
var reIssnExt      = "_Issn_|0000-0000"     // XXXX-XXXX, ou 0000-0000 si la revue ne poss�de pas d'ISSN
var reIssnExtFRE   = "L'ISSN doit �tre saisi sous la forme XXXX-XXXX (exemple : 0339-7775).\n Si la revue ne poss�de pas d'ISSN, saisir 0000-0000."

// ISBN (saisie sans les tirets entre les chiffres)
var reIsbn10       = "_Chiffre_{10}"          // ISBN sur 10 chiffres pour les ouvrages parus avant le 31/12/2006
var reIsbn13       = "_Chiffre_{13}"          // ISBN sur 13 chiffres pour les ouvrages parus apr�s le 31/12/2006
var reIsbn         = "_Isbn10_|_Isbn13_"
var reIsbnFRE      = "L'ISBN doit �tre saisi sans tiret entre les chiffres.\nExemples :\nISBN � 10 chiffres : 2738494382 (ouvrages parus avant le 31/12/2006)\nISBN � 13 chiffres : 9782765409120 (ouvrages parus apr�s le 31/12/2006)"

// ISBN, ISSN
var reIsbnIssn     = "_Isbn_|_Issn_"
var reIsbnIssnFRE  = "L'ISBN doit �tre saisi sans tiret entre les chiffres.\nExemples :\nISBN � 10 chiffres : 2738494382 (ouvrages parus avant le 31/12/2006)\nISBN � 13 chiffres : 9782765409120 (ouvrages parus apr�s le 31/12/2006)\n\nL'ISSN doit �tre saisi sous la forme XXXX-XXXX (exemple : 0339-7775)."

// Nom du centre au format ascoXXX
var reNomCentre    = "asco[1-9][0-9]{0,2}"
var reNomCentreFRE = "Le num�ro attribu� � la biblioth�que ou au centre de documentation doit �tre saisi sous la forme suivante : ascoXXX\nExemples : asco1, asco52"

// Adresse IP
var reIPByte	   = "[1-9]([0-9][0-9]?)?"
var reIP	       = "_IPByte_\\._IPByte_\\._IPByte_\\._IPByte_"	// adresse IP

// URL
var reProtocol	   = "(http|https|ftp)://"				        // protocole internet
var reTopDomain	   = "\\.[A-Za-z][A-Za-z][A-Za-z]?[A-Za-z]?"	// un point suivi d'un code pays de 2 ou 3 ou 4 lettres
var reIdent	       = "[A-Za-z0-9][A-Za-z0-9-_-]*"		        // un "mot" du nom de domaine
var reDomain	   = "_Ident_(\\._Ident_)*_TopDomain_"		    // nom de domaine
var rePort	       = "\:[0-9]+"					                // port TCP
var reUrlPath	   = "(\/[^# \/]+)*"				            // path d'un document 
var reBookmark     = "#[A-Za-z0-9-_ ]+"
var reUrl	       = "_Protocol__Domain_(_Port_)?(_UrlPath_)?(_Bookmark_)?"	// url compl�te

// URL avec possibilit� d'indiquer une adresse IP
var reDomainIP	= "_Domain_|_IP_"
var reUrlIP	= "_Protocol_(_DomainIP_)(_Port_)?(_UrlPath_)?(_Bookmark_)?"	// url compl�te
var reUrlIPFRE     = "Indiquez l'url compl�te en incluant le pr�fixe http://, le nom de domaine du site et le chemin relatif de la page.\nExemple : http://www.ascodocpsy.org/article.php3?id_article=691"

// Etat des collections de p�riodiques
var reEtatCol      = ".*"

// *************************


// Texte en minuscules accentu�es
var reChar	= "(.|\\n)"
var reMinu	= "[a-z����������������������������']"
var reMinus	= "_Minu_+"
var reLoCase	= " *[-.*]? *[A-Z0-9]_Char_*_Minus__Char_*_Minus__Char_*"		// un texte avec au moins 2 minuscules (= pas tout en maju)
var reLoCaseFRE	= "L'information doit �tre saisie en minuscules accentu�es (et non pas en tout majuscules), avec une majuscule au d�but."
var reProperCase= "_LoCase_|[A-Z][A-Z]?[A-Z]?[A-Z]?[A-Z]?[A-Z]?[A-Z]?"	// Texte en minu avec une majuscule au d�but ou sigle
var reProperCaseFRE="L'information doit �tre saisie en minuscules accentu�es, avec une majuscule au d�but de chaque article."

// Auteurs physiques, syntaxe Bdsp
var rePrenom	= "(\\.|[A-Z]\\.(-?[A-Z]\\.)*|[A-Z]_Minus_(-[A-Z]_Minus_)*)"	// pr�nom en syntaxe bdsp
var reAutPhys	= "[A-Z]+([- '][A-Z]+)* \\(_Prenom_\\)"		// un auteur physique

// Auteurs moraux, syntaxe Bdsp
var reMinus2	= "[0-9a-z����������������������������']+"
var reSigle	= "\\(([A-Z]\\.)+\\)"
var reAC	= "[A-Z]_Minus_([- '][A-Z]?_Minus2_)*"
var reACS	= "_AC_\\. (_Sigle_\\. )?"
var reAutColl	= "(_ACS_)+(_AC_\\. )?([A-Z][A-Z]\\. )?_CodeISO_"

// --------------------------------------------------------------------------------
// Exemple de contr�les
//
// Cette variable est un tableau de tableaux. Elle d�finit l'ensemble des contr�les
// � ex�cuter pour un formulaire particulier.
// Le premier �l�ment de ce tableau (ie le premier tableau) contient des param�tres 
// g�n�raux :
// - identifiant du formulaire (nom ou index)
// - code ISO de la langue des messages
// - s�parateur d'articles
// - fonction contr�le (optionnel) : fonction de validation du formulaire
// �l�ment : l'index ou le nom du formulaire sur lequel portent les contr�les.
// Les autres �l�ments (ie les tableaux suivants) donnent la liste des champs
// � contr�ler.
// Pour chaque champ, on trouve :
// - le nom du champ, �crit exactement comme dans le formulaire (sensible � la casse)
// - champ obligatoire (true, false)
// - nom de l'expression r�guli�re que la syntaxe du champ doit respecter.
// --------------------------------------------------------------------------------

/* Exemple : 
var Controls =
[
[0, "ENG", ","],

//        0           1        2       3        4       5        6            7
// Nom du champ    , Obl  , MinLen, MaxLen , MinArt, MaxArt, "RegExp "   , "UserFunc"  
["Nom"             , true ,      3,        ,       ,       ,             ,             ],
["Url"             , true ,       ,        ,       ,       , "reUrl"     ,             ],
["DateCreationSite", false,      4,      8 ,       ,       , "reDate"    , "CheckDate" ],
["Statut"          ,      ,       ,        ,      2,      5,             , "chkStatut" ],
["Contact"         ,      ,       ,        ,       ,      5, "reContact" ,             ],
["Synthese"        , true ,      4,   1500 ,       ,       ,             , "CheckDate" ]
]

*/

var ctrlIdxName=0, ctrlIdxLabel=1, ctrlIdxObl=2, ctrlIdxMinLen=3, ctrlIdxMaxLen=4 ; 
var ctrlIdxMinArt=5, ctrlIdxMaxArt=6, ctrlIdxRegExp=7, ctrlIdxUserFunc=8;
var ctrlIdxValue=9, ctrlIdxCompRE=10;

// --------------------------------------------------------------------------------
// Exemple de fonction utilisateur
//
// La fonction prend en argument la valeur du champ. Si cette valeur est correcte,
// la fonction doit retourner la valeur true. Dans le cas contraire, elle doit
// afficher un message d'erreur � l'utilisateur et retourner false.
// --------------------------------------------------------------------------------
/* Exemple
function CheckDate(Value)
{
	if ( Value == "2000" ) return true ;
	alert("C'est pas la bonne valeur !!!");
	return false ;
}
*/

// --------------------------------------------------------------------------------
// ctrlXXX
//
// Permet de personnaliser les messages retourn�s par la librairie. XXX correspond
// au code iso 3 lettres de la langue des messages (FRE, ENG, etc). Le code des
// messages � utiliser est indiqu� dans le tableau de contr�les.
// --------------------------------------------------------------------------------
var ctrlFRE=
[
/*0*/	"Le champ '%1' est obligatoire.", // Nom du champ
/*1*/	"Le champ '%1' doit contenir au moins %2 caract�res.", // Nom du champ, Longueur mini
/*2*/	"La taille du champ '%1' est limit�e � %2 caract�res.", // Nom du champ, Longueur maxi
/*3*/	"Vous devez indiquer au moins %2 articles dans le champ '%1' (%3 actuellement).", // Nom du champ, Nombre mini d'articles, nb actuel
/*4*/	"Le champ '%1' est limit� � %2 article(s) (%3 actuellement).", // Nom du champ, Nombre maxi d'articles, nb actuel
/*5*/	"Valeur incorrecte pour le champ '%1'\nLes donn�es ne respectent pas la syntaxe d�finie pour ce champ.", // Nom du champ
/*6*/	"L'article '%2' du champ '%1' ne respecte pas la syntaxe d�finie pour ce champ.", // Nom du champ, article
/*7*/	"Votre fiche comporte au moins une erreur. Voici le texte de la premi�re erreur :\n\n%1\n\nEtes-vous s�r de vouloir enregistrer une fiche erron�e ?", // Erreur
""
]

var ctrlENG=
[
/*0*/	"A value is required for field '%1'", // Nom du champ
/*1*/	"Field '%1' must contain at least %2 chars", // Nom du champ, Longueur mini
/*2*/	"Field '%1' should not exceed %2 chars", // Nom du champ, Longueur maxi
/*3*/	"Field '%1' must contain at least %2 articles  (%3 at the moment)", // Nom du champ, Nombre mini d'articles, nb actuel
/*4*/	"Field '%1' should not exceed %2 articles (%3 at the moment)", // Nom du champ, Nombre maxi d'articles, nb actuel
/*5*/	"Invalid value for field '%1'\nData does not match defined syntax", // Nom du champ
/*6*/	"Field '%1': invalid syntax for '%2'", // Nom du champ, article
/*7*/	"This record contains at least one error. Here is the first one:\n\n%1\n\nDo you want to save this bad record anyway?", // Erreur
""
]

// --------------------------------------------------------------------------------
// ctrlMessage
//
// Formatte le message dont le num�ro est donn� en fonction de la langue indiqu�e
// dans le tableau de contr�les et des param�tres pass�s � la fonction. Retourne
// le r�sultat.
// --------------------------------------------------------------------------------
function ctrlMessage(Controls,NumMessage)
{
	var Msg=eval( "ctrl" + Controls[0][1] + "["+NumMessage+"]" ) ;
	var args=ctrlMessage.arguments ;
	var i ;

	for (i=2; i < args.length; i++) Msg = Msg.replace("\%" + (i-1), args[i]) ;
	return Msg
}

// --------------------------------------------------------------------------------
// ctrlAlert
//
// Affiche ou stocke le message d'erreur retourn� � l'utilisateur lorsqu'un champ
// n'est pas correct. A utiliser � la place de la fonction js standard alert()
// --------------------------------------------------------------------------------
var ctrlAlertMode=1
var ctrlError=""

function ctrlAlert(Message)
{
	if (ctrlAlertMode == 1)
	{
		alert(Message) ;
	}
	else
		ctrlError=Message ;
}

// --------------------------------------------------------------------------------
// ctrlRECompile
//
// Compile une expression r�guli�re en rempla�ant les noms d'expression qu'elle 
// contient par leur valeur.
// Exemple : si A="[a-z]" et B="X_A_*X", ctrlRECompile(B) retourne "X([a-z])*X"
// --------------------------------------------------------------------------------
function ctrlRECompile(RE)
{
	var RegName=/[A-Za-z0-9]+/ ;
	var Pt1, Pt2 ;
	var h ;
	var IsDefined ;

	Pt1=0;
	for (;;)
	{
		Pt1=RE.indexOf("_", Pt1) ;
		if (Pt1 == -1) break ;
		Pt1++ ;

		Pt2=RE.indexOf("_", Pt1) ;
		if (Pt2 == -1) break ;

		h=RE.substring(Pt1, Pt2) ;
		if ( h.match(RegName) )
		{
			eval("IsDefined=typeof(re" + h + ") != 'undefined'") ;
			if ( IsDefined )
			{
				RE=RE.substring(0,Pt1-1) + "" + eval("re"+h) + "" + RE.substring(Pt2+1, RE.length) ;
				Pt1-- ;
			}
			else
			{
				Pt1=Pt2+1 ;
			}
		}
		else
		{
			Pt1=Pt2 ;
		} ;
	}
	RE = "^" + RE + "$" ;
	RE=new RegExp(RE)
	return RE ;
}

// --------------------------------------------------------------------------------
// ctrlInitialize
//
// Initialise les contr�les de saisie pour un formulaire.
// Controls : nom du tableau qui d�finit les contr�les � ex�cuter sur chaque champ
// --------------------------------------------------------------------------------
function ctrlInitialize(ControlsName)
{
	Controls=eval(ControlsName); // var volontairement omis au cas ou l'utilisateur ait appell� son tableau Controls
	var Form=document.forms[ Controls[0][0] ] ;
	var c=Form.elements ;
	var i, e, j ;

	if ( Controls[0][3] )
		Form.onsubmit=new Function(" return " + Controls[0][3] + "('" + ControlsName + "');" );
	else
		Form.onsubmit=new Function(" return ctrlForm('" + ControlsName + "');" );

	// Initialise le s�parateur par d�faut
	Controls[0][2] = Controls[0][2] ? Controls[0][2] : "," ;

	for (i=1; i<Controls.length; i++)
	{
		// R�cup�re le champ ou la collection de champ
		e=c[Controls[i][ctrlIdxName]];
		if (e)
		{
			// Installe les gestionnaires d'�v�nement
			if ( e.length )
				for (j=0; j<e.length; j++)
					e[j].onblur=new Function("ctrlField(" + ControlsName + "," + i + ")") ;
			else
				e.onblur=new Function("ctrlField(" + ControlsName + "," + i + ")") ;

			// Compile les expressions r�guli�res
			if ( Controls[i][ctrlIdxRegExp] ) Controls[i][ctrlIdxCompRE]=ctrlRECompile( eval(Controls[i][ctrlIdxRegExp]) ) ;

			// Controls[i][ctrlIdxValue]=NaN ;
			//Controls[i][ctrlIdxValue] = ctrlGetFieldValue(e, Controls[0][2]);

		} else alert("Impossible de trouver le champ " + ctrlFriendlyName(Controls, i)) ;
	}
}

// --------------------------------------------------------------------------------
// ctrlFriendlyName
//
// Retourne le libell� du champ s'il en a un, son nom sinon.
// --------------------------------------------------------------------------------
function ctrlFriendlyName(Controls, FieldIndex)
{
	var h=Controls[FieldIndex][ctrlIdxLabel];
	if (h && h.length)
		return h;
	else
		return Controls[FieldIndex][ctrlIdxName];
}

// --------------------------------------------------------------------------------
// ctrlGetFieldValue
//
// Retourne la valeur d'un champ
// Controls : nom du tableau qui d�finit les contr�les � ex�cuter sur chaque champ
// --------------------------------------------------------------------------------
function ctrlGetFieldValue(FieldObject, Sep)
{
	var Field, i, j, h, Value, o ;

	if ( FieldObject.length )
	{
		Value="" ;
		for (i=0; i<FieldObject.length; i++)
		{
			Field=FieldObject[i] ;
			h="" ;
			switch(Field.type)
			{
				case "checkbox":
				case "radio":
					if ( Field.checked ) h=Field.value ;
					break ;
				case "text":
				case "textarea":
					h=Field.value ;
					break ;
				case "select-one":
					if ( Field.selectedIndex != -1 )
					{
						var o=Field.options[ Field.selectedIndex ] ;
						h=o.value ? o.value : o.text;
					}
					break ;
				case "select-multiple":
					o=Field.options ;
					j=Field.selectedIndex ;
					if ( j != -1)
						for (; j<o.length; j++)
							if ( o[j].selected ) 
								h += (h.length == 0 ? "" : Sep) + (o[j].value ? o[j].value : o[j].text) ;
				break ;
			}

			if ( h.length != 0 ) Value += (Value.length == 0 ? "" : Sep) + h;
		}
		return Value ;
	}
	else
		return FieldObject.value ;
}

// --------------------------------------------------------------------------------
// ctrlField
//
// V�rifie que le champ respecte l'ensemble des contr�les qui lui sont associ�s
// --------------------------------------------------------------------------------
function ctrlField(Controls, FieldIndex)
{
	var FieldName=Controls[FieldIndex][ctrlIdxName] ;
	var Field=document.forms[ Controls[0][0] ].elements[FieldName] ;

	Value=ctrlGetFieldValue(Field, Controls[0][2]) ;

	if ( Value == Controls[FieldIndex][ctrlIdxValue]) return true ;
	Controls[FieldIndex][ctrlIdxValue] = Value ;

	if ( ! ctrlLength  (Controls, FieldIndex, Value) ) return false;
	if ( ! ctrlArticles(Controls, FieldIndex, Value) ) return false;
	if ( ! ctrlRegExp  (Controls, FieldIndex, Value) ) return false;
	if ( ! ctrlUserFn  (Controls, FieldIndex, Value) ) return false;
	return true;
}

// --------------------------------------------------------------------------------
// ctrlFields
//
// V�rifie tous les champs du formulaire
// Si tout est OK, retourne true.
// Sinon, retourne false et initialise ctrlError avec le premier message d'erreur
// --------------------------------------------------------------------------------
function ctrlFields(ControlsName)
{
	var i ;
	Controls=eval(ControlsName); // var volontairement omis au cas ou l'utilisateur ait appell� son tableau Controls

	ctrlAlertMode=2 ;
	for (i=1; i<Controls.length; i++)
	{
		Controls[i][ctrlIdxValue]=NaN ;
		if ( ! ctrlField(Controls, i) )
		{
			ctrlAlertMode=1 ;
			return false
		}
	}
	ctrlAlertMode=1 ;
	return true ;
}

// --------------------------------------------------------------------------------
// ctrlForm
//
// Fonction de validation par d�faut des formulaires.
// Demande confirmation avant d'enregistrer en cas d'erreur.
// --------------------------------------------------------------------------------
function ctrlForm(ControlsName)
{
	if ( ctrlFields(ControlsName) ) return true ;
	return confirm( ctrlMessage(Controls, 7, ctrlError) ) ;
}

// --------------------------------------------------------------------------------
// ctrlLength
//
// V�rifie la longueur du champ. G�n�re une erreur si :
// - le champ est vide, alors qu'il est obligatoire
// - le champ est rempli mais contient moins de caract�res que le minimum autoris�
// - le champ est rempli mais contient plus de caract�res que le maximum autoris�
// --------------------------------------------------------------------------------
function ctrlLength(Controls, FieldIndex, Value)
{
	var Req=Controls[FieldIndex][ctrlIdxObl] ;
	var Min=Controls[FieldIndex][ctrlIdxMinLen] ;
	var Max=Controls[FieldIndex][ctrlIdxMaxLen] ;

	if ( Req && Value.length == 0 )
	{
		ctrlAlert( ctrlMessage(Controls, 0, ctrlFriendlyName(Controls, FieldIndex), Min) ) ;
		return false ;
	}

	if ( Min && Value.length != 0 && Value.length < Min )
	{
		ctrlAlert( ctrlMessage(Controls, 1, ctrlFriendlyName(Controls, FieldIndex), Min) ) ;
		return false ;
	}

	if ( Max && Value.length != 0 && Value.length > Max)
	{
		ctrlAlert( ctrlMessage(Controls, 2, ctrlFriendlyName(Controls, FieldIndex), Max) ) ;
		return false ;
	}
	return true ;
}

// --------------------------------------------------------------------------------
// ctrlSplit
//
// Eclate une chaine en articles, en faisant un "trim" sur chaque article.
// Retourne le tableau obtenu
// --------------------------------------------------------------------------------
function ctrlSplit(Controls, Value)
{
	var t=Value.split(Controls[0][2]) ;
	var i ;

	for (i=0; i< t.length; i++) t[i] = t[i].replace( /(^\s*)|(\s*$)/g , "");
	return t ;
}

// --------------------------------------------------------------------------------
// ctrlArticles
//
// V�rifie le nombre d'articles du champ. G�n�re une erreur si :
// - le champ est rempli mais contient moins d'articles que le minimum autoris�
// - le champ est rempli mais contient plus d'articles que le maximum autoris�
// --------------------------------------------------------------------------------
function ctrlArticles(Controls, FieldIndex, Value)
{
	var Min=Controls[FieldIndex][ctrlIdxMinArt] ;
	var Max=Controls[FieldIndex][ctrlIdxMaxArt] ;

	if (Value.length == 0) return true ;

	var t=Value.split(Controls[0][2]) ; // inutile d'appeller ctrlSplit ici, on ne fait que compter

	if ( Min && t.length < Min )
	{
		ctrlAlert( ctrlMessage(Controls, 3, ctrlFriendlyName(Controls, FieldIndex), Min, t.length) ) ;
		return false ;
	}

	if ( Max && t.length > Max )
	{
		ctrlAlert( ctrlMessage(Controls, 4, ctrlFriendlyName(Controls, FieldIndex), Max, t.length) ) ;
		return false ;
	}

	return true ;
}

// --------------------------------------------------------------------------------
// ctrlRegExp
//
// V�rifie que le champ respecte la syntaxe d�finie par l'expression r�guli�re 
// associ�e au champ
// --------------------------------------------------------------------------------
function ctrlRegExp(Controls, FieldIndex, Value)
{
	var Art=Controls[FieldIndex][ctrlIdxMinArt] ? true : (Controls[FieldIndex][ctrlIdxMaxArt] ? true : false) ;
	var RE =Controls[FieldIndex][ctrlIdxCompRE] ;
	var t, i ;

	// Si on n'a pas de RegExp, termin�
	if ( typeof(RE) == "undefined") return true ;

	// Si le champ est vide, termin�
	if ( Value.length == 0 ) return true ;

	// d�boggage : affiche la regexp quand le champ contient la valeur "debug"
	if ( Value == "debug") 
	{
	   prompt("Voici le pattern de l'expression r�guli�re utilis�e pour contr�ler ce champ :", RE);
//		alert(RE) ;
		return true ;
	}

	// Teste la RegExp
	if ( Art )	// Champs articles
	{
		t=ctrlSplit(Controls, Value) ; //Value.split(Controls[0][2]) ;
		for (i=0; i<t.length; i++)
			if ( ! RE.test(t[i]) )
			{
				ctrlRegExpAlert(Controls, FieldIndex, 6, t[i]) ;
				return false;
			}
	}
	else			// Champs texte
	{
		if ( ! RE.test(Value) )
		{
			ctrlRegExpAlert(Controls, FieldIndex, 5, "") ;
			return false;
		}
	}
	return true ;
}

function ctrlRegExpAlert(Controls, FieldIndex, MsgNumber, Art)
{
	var IsDefined ;
	var h=ctrlMessage(Controls, MsgNumber, ctrlFriendlyName(Controls, FieldIndex), Art) ;

	eval("IsDefined=typeof(" + Controls[FieldIndex][ctrlIdxRegExp] + Controls[0][1] + ") != 'undefined'") ;
	if (IsDefined) h+="\n\n" + eval( Controls[FieldIndex][ctrlIdxRegExp] + Controls[0][1] ) ;
	ctrlAlert(h) ;
}

// --------------------------------------------------------------------------------
// ctrlUserFn
//
// V�rifie que le champ respecte les contr�les d�finis dans la fonction utilisateur
// associ�e au champ.
// Remarque : la fonction n'est appel�e que si le champ est renseign�.
// --------------------------------------------------------------------------------
function ctrlUserFn(Controls, FieldIndex, Value)
{
	var Fn=Controls[FieldIndex][ctrlIdxUserFunc] ;

	if ( Fn ) return eval( Fn + "(Value)" ) ;
	return true ;
}