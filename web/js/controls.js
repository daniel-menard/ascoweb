/************************************************************
 Ascodocpsy
 Contr�les de saisie
 ************************************************************/

// Chiffre
var reChiffre      = "[0-9]"

// Ann�e au format AAAA, Mois, Jour
var reYear         = "(17[5-9]_Chiffre_|1[8-9]_Chiffre_{2}|20[0-2]_Chiffre_)"      // une ann�e sur 4 chiffres (1750 � 2019)
var reMonth	       = "(0[1-9]|1[0-2])"				        // un mois sur deux chiffres (01 � 12)
var reDay	       = "(0[1-9]|[12][0-9]|3[01])"			    // un jour sur deux chiffres (01 � 31)
var reYearFRE      = "La date doit �tre dans le format AAAA et sup�rieure ou �gale � 1750.\nExemple : 2005"

// Ann�e evalu�e au format [AAAA]
var reYearEval     = "\\[_Year_\\]"

// Format sans date
var reNoYear       = "\\[s.d.\\]"

// Date au format Ascodocpsy (AAAA ou [AAAA] ou [s.d.])
var reYearDoc      = "_Year_|_YearEval_|_NoYear_"
var reYearDocFRE   = "L'ann�e doit �tre dans l'un des formats suivants :\nAAAA si l'ann�e est connue (exemple : 2006), elle doit �tre sup�rieure ou �gale � 1750\n[AAAA] si l'ann�e est �valu�e (exemple : [2006])\n[s.d.] dans le cas d'un document sans date."

// Date au format AAAA-MM-JJ : format usuel
var reDateUsual    = "_Year_-_Month_-_Day_"
var reDateUsualFRE = "La date doit �tre dans le format suivant : AAAA-MM-JJ (exemple : 2006-04-15 pour le 15 avril 2006)"

// P�riode (AAAA- ou AAAA-AAAA)
var rePeriod       = "(_Year_)-(_Year_)?"
var rePeriodFRE    = "L'information doit �tre saisie sous la forme suivante :\n- AAAA- si le p�riodique n'a pas cess� de para�tre (exemple : 1995-),\n- AAAA-AAAA si le p�riodique a cess� de para�tre (exemple : 1985-2005)."

// Texte en majuscules
//var reChar         = "(.|\\n)"
//var reMaju         = "[A-Z']"
//var reMajus        = "_Maju_+"                                // Texte comportant au moins 2 majuscules
//var reUpCase       = " *[-.*]? *_Char_*_Majus_ *[0-9]*"       // Texte comprenant des espaces ou des caract�res ou des chiffres ou des majus
//var reUpCaseFRE    = "L'information doit comporter au moins 2 caract�res."


// Mots cl�s. Caract�res autoris�s : lettres majuscules, chiffres, espaces et signes suivants : ',.()[]+-
//var reUpCase       = "[A-Z0-9',. ()\\[\\]+-]{2,}"
var reUpCase       = "[A-Z0-9(\\[][A-Z0-9',. ()\\[\\]+-]+"    // Commence soit par une lettre, un chiffre, une parenth�se ouvrante, un crochet ouvrant.
var reUpCaseFRE    = "L'information doit �tre saisie enti�rement en majuscules et doit comporter au moins 2 caract�res.\nSont autoris�s : les lettres, les chiffres, les espaces et les signes suivants : ',.()[]+-"

// Nom du centre au format ascoXXX
var reNomCentre    = "asco[1-9][0-9]{0,2}"
var reNomCentreFRE = "Le num�ro attribu� � la biblioth�que ou au centre de documentation doit �tre saisi sous la forme suivante : ascoXXX\nExemples : asco1/asco52"

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
/*0*/	"Champ obligatoire.", // Nom du champ
/*1*/	"%2 caract�res minimum (%3 actuellement)", // Nom du champ, Longueur mini, longueur actuelle
/*2*/	"Taille limit�e � %2 caract�res (%3 actuellement)", // Nom du champ, Longueur maxi, longueur actuelle
/*3*/	"%2 valeur(s) attendue(s) dans ce champ minimum (%3 actuellement).", // Nom du champ, Nombre mini d'articles, nb actuel
/*4*/	"%2 valeur(s) attendue(s) dans ce champ maximum (%3 actuellement).", // Nom du champ, Nombre maxi d'articles, nb actuel
/*5*/	"Syntaxe incorrecte.", // Nom du champ
/*6*/	'"%2" : ', // Nom du champ, article
/*7*/	"Votre fiche comporte au moins une erreur. Voici le texte de la premi�re erreur :\n\n%1\n\nEtes-vous s�r de vouloir enregistrer une fiche erron�e ?", // Erreur
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

var ctrlCurrentField=null;

function ctrlFormAlert(Message)
{
    alert(Message);
}

// --------------------------------------------------------------------------------
// ctrlAlert
//
// Affiche ou stocke le message d'erreur retourn� � l'utilisateur lorsqu'un champ
// n'est pas correct. A utiliser � la place de la fonction js standard alert()
// --------------------------------------------------------------------------------
function ctrlAlert(Message)
{
    var parent=jQuery(ctrlCurrentField).eq(0).parent();
    parent.addClass('hasError');
    var div=jQuery('div.errorField', parent);
    if (div.length===0)
        parent.prepend('<div class="errorField">'+Message+'</div>');
    else
        div.html(Message);        
}

function ctrlNoAlert()
{
    var parent=jQuery(ctrlCurrentField).eq(0).parent();
    parent.removeClass('hasError');
    jQuery('div.errorField', parent).hide
    (
        'fast', 
        function()
        {
            //$(this).parent().removeClass('hasError');
            $(this).remove();
        }
    );
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
/*
    Remarque : fonctionne pour asco parce que tous les champs sont list�s dans
    le tableau d�fini dans load.js.
    Dans le cas contraire, il faudrait ajouter un gestionnaire 
    onfocus(ctrlPrevious) � tous les champs pr�sents dans la form, que ceux-ci
    aient ou non des contr�les.
    A faire quand on aura port� la librairie vers jquery. 
*/
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
            {
				for (j=0; j<e.length; j++)
                {
                    e[j].onblur=new Function("ctrlSetPrevious(" + ControlsName + "," + i + ")") ;
                    //e[j].onblur=new Function("ctrlField(" + ControlsName + "," + i + ")") ;
                    e[j].onfocus=ctrlPrevious;
                    jQuery(e[j]).focus(ctrlPrevious);
                }
			}
            else
            {
                e.onblur=new Function("ctrlSetPrevious(" + ControlsName + "," + i + ")") ;
//                e.onfocus=ctrlPrevious;
                jQuery(e).focus(ctrlPrevious);
            }
            
			// Compile les expressions r�guli�res
			if ( Controls[i][ctrlIdxRegExp] ) Controls[i][ctrlIdxCompRE]=ctrlRECompile( eval(Controls[i][ctrlIdxRegExp]) ) ;

			// Controls[i][ctrlIdxValue]=NaN ;
			//Controls[i][ctrlIdxValue] = ctrlGetFieldValue(e, Controls[0][2]);

		} else alert("Impossible de trouver le champ " + ctrlFriendlyName(Controls, i)) ;
	}
}
var ctrlPreviousControls=null;
var ctrlPreviousFieldIndex=null;

function ctrlSetPrevious(Controls, FieldIndex)
{
    ctrlPreviousControls=Controls;
    ctrlPreviousFieldIndex=FieldIndex;
}

function ctrlPrevious() // jQuery event
{
    if (! ctrlPreviousControls) return;

    // si le champ en cours est �gal � previous, exit
    // �vite que les erreurs soient affich�es si :
    // - on est dans un champ, il perd le focus, on reclique dans le champ
    // - appel d'une table de lookup (m�me effet)
    var FieldName=ctrlPreviousControls[ctrlPreviousFieldIndex][ctrlIdxName] ;
    var Field=document.forms[ Controls[0][0] ].elements[FieldName] ;
    if (this===Field) return;

    var ret=ctrlField(ctrlPreviousControls, ctrlPreviousFieldIndex);
    if (ret)
    {
        //console.info('OK');
    }
    else
    {
        return false;
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
	ctrlCurrentField=document.forms[ Controls[0][0] ].elements[FieldName] ;

	Value=ctrlGetFieldValue(ctrlCurrentField, Controls[0][2]) ;
/*
	if ( Value == Controls[FieldIndex][ctrlIdxValue]) return true ;
	Controls[FieldIndex][ctrlIdxValue] = Value ;
*/
	if ( ! ctrlLength  (Controls, FieldIndex, Value) ) return false;
	if ( ! ctrlArticles(Controls, FieldIndex, Value) ) return false;
	if ( ! ctrlRegExp  (Controls, FieldIndex, Value) ) return false;
	if ( ! ctrlUserFn  (Controls, FieldIndex, Value) ) return false;
    ctrlNoAlert();
	return true;
}

// --------------------------------------------------------------------------------
// ctrlFields
//
// V�rifie tous les champs du formulaire
// Si tout est OK, retourne true.
// Sinon, retourne false
// --------------------------------------------------------------------------------
function ctrlFields(ControlsName)
{
    try
    {
    	var i, ok=true;
    	Controls=eval(ControlsName); // var volontairement omis au cas ou l'utilisateur ait appell� son tableau Controls
    
    	for (i=1; i<Controls.length; i++)
    	{
    		Controls[i][ctrlIdxValue]=NaN ;
    		if ( ! ctrlField(Controls, i) )
    		{
    			ok=false;
    		}
    	}
    	return ok;
    }
    catch(e)
    {
        alert('exception !'); // � revoir. ex�cuter tout le code en gestion d'erreurs, afficher le message de l'exception
        return false;
    }
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
	return confirm( ctrlMessage(Controls, 7) ) ;
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
		ctrlAlert( ctrlMessage(Controls, 1, ctrlFriendlyName(Controls, FieldIndex), Min, Value.length) ) ;
		return false ;
	}

	if ( Max && Value.length != 0 && Value.length > Max)
	{
		ctrlAlert( ctrlMessage(Controls, 2, ctrlFriendlyName(Controls, FieldIndex), Max, Value.length) ) ;
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