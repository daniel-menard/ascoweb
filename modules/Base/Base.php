<?php

/**
 * Module Base - Consultation de la base documentaire
 */

class Base extends DatabaseModule
{
    // TODO : A la place du template 'templates/error/error.html' mettre en place un syst�me de message d'erreur.
    
    /**
     * S�parateur d'articles
     * 
     * todo: r�cup�rer le s�parateur d'articles � partir de la config, ...
     */
    const SEPARATOR=' / ';
    
    /**
     * Identifiant de la personne connect�e
     * 
     * @var string
     */
    private $ident;
    
    /**
     * Table de correspondances entre le num�ro d'un centre (ascoX)
     * et son num�ro de l'article sur le site Ascodocpsy
     *
     * @var array
     */
    private $tblAsco=array();
    
    public function preExecute()
    {
        // R�cup�re l'identifiant
        $this->ident=strtolower(User::get('login'));

        // Filtre pour les membres du GIP
        // Ils peuvent voir les notices valid�es et leurs propres notices si elles ne sont pas valid�es
        Config::set('filter.EditBase', 'ProdFich:'.$this->ident.' OR Statut:valide');
        
        // On d�finit le filtre de l'acc�s professionnel avant d'ex�cuter le parent::preExecute,
        // pour que celui-ci soit pris en compte lors de la g�n�ration des fichiers d'export.
        // En effet, lors de la g�n�ration des fichiers d'export, parent::preExecute() renvoie
        // true et le code qui se trouve apr�s n'est pas ex�cut�
        // (cf issue 105 : http://code.google.com/p/ascoweb/issues/detail?id=105)
        if (parent::preExecute()===true) return true;
     //   if ($this->action=='exportCart')
     //       $this->actionExportCart(true);
        if (Utils::isAjax() && $this->method==='actionSearch')
        {
            Config::set('template','templates/answers.html');
        }
        
        if ($this->method=='actionExportCartByType')
            $this->actionExportCartByType(true);

        // Charge la table de correspondances entre le num�ro d'un centre (ascoX)
        // et son num�ro de l'article sur le site Ascodocpsy
        $this->tblAsco=$this->loadTable('annuairegip');
    }

    /**
     * Callback utilis� pour l'affichage des notices.
     *
     * @param string $name nom de la balise mentionn�e dans le template associ�.
     * @return string la valeur � injecter � la place de la balise $name, dans 
     * le template associ�.
     */
    public function getField($name)
    {
        switch ($name)
        {
            case 'Annexe':
                // Ce champ contient le ou les titres des annexes sous la forme :
                // Titre annexe 1/Titre annexe 2/Titre annexe 3
                // Il est coupl� avec le champ LienAnne :
                // http://url.annexe1.fr ; http://url.annexe2.fr ; http://url.annexe3.fr
                // Si LienAnne renseign� alors, il y a toujours :
                //  - un lien et un seul par annexe
                //  - autant de titres d'annexe que de liens
                 
                if ($this->selection[$name]=='' ) return '';
                if (!$annexe=(array)$this->selection[$name]) return '';   // Cas o� $this->selection[$name] est null
                
                // Si pas de lien, on affiche uniquement les titres des annexes
                if ($this->selection['LienAnne']=='') return implode(self::SEPARATOR, $annexe);
                if (!$lien=(array)$this->selection['LienAnne']) return implode(self::SEPARATOR, $annexe);
                
                $value='';
                for ($i=0;$i<=count($annexe)-1;$i++)
                {
                    if ($value) $value.=self::SEPARATOR;
                    $value.=$this->link($annexe[$i], $lien[$i], 'Acc�der au texte int�gral (ouverture dans une nouvelle fen�tre)', true);
                }
                return $value;

            case 'Aut':
            	if ($this->selection[$name]=='' ) return '';
                if (!$t=(array)$this->selection[$name]) return '';  // Cas o� $this->selection[$name] est null

                foreach ($t as $key=>$h)
                {
                    $h=trim($h);
                    if ($aut=$this->author($h))
                    {
                        // Lien sur l'auteur : lance une nouvelle recherche
                        $lien='Search?Aut='. urlencode('"'.$aut.'"');
                        $h=$this->link($h, $lien, 'Bibliographie de '.$h);
                    }
                    $t[$key]=$h;
                }
                return implode(self::SEPARATOR, $t);
            
            case 'Edit':
            case 'Lieu':
            	if ($this->selection[$name]=='' ) return '';
                if (!$t=(array)$this->selection[$name]) return '';
            	return implode(self::SEPARATOR, $t);
            
            case 'Page':
                if (! $h=$this->selection[$name]) return '';
                
                if (stripos($h, 'p.') === false && stripos($h, 'pagination') === false)
                    return trim($h).' p.';
                return $h;
            
            case 'PageEdit':
                if (! $page=$this->selection['Page']) return '';
                
                if ($this->selection['Type'] == 'Rapport')
                {
                    if ($h=$this->selection['Lieu'].$this->selection['Edit'].$this->selection['Reed'])
                        return (stripos($page, 'p.') === false && stripos($page, 'pagination') === false) ? trim($page).' p.' : $page;
                }
                return '';    
            
            case 'PageRev':
                if (! $page=$this->selection['Page']) return '';
                
                if ($this->selection['Type'] == 'Rapport')
                {
                    if ($h=$this->selection['Rev'].$this->selection['Vol'].$this->selection['Num'])
                        return (stripos($page, 'p.') === false && stripos($page, 'pagination') === false) ? trim($page).' p.' : $page;
                }
                return '';    
                
            case 'MotCle':
            case 'Nomp':
            case 'CanDes':
            case 'Theme':
                if ($this->selection[$name]=='' ) return '';
                if (! $t=(array)$this->selection[$name]) return '';
                
                foreach ($t as $key=>$h)
                {
                    $h=trim($h);
                    $lien='Search?MotsCles='. urlencode('['.$h.']');
                    $h=$this->link($h, $lien, 'Notices index�es au descripteur '.$h);
                    $t[$key]=$h;
                }
                return implode(self::SEPARATOR, $t);
                
            case 'Rev':
                // Lien vers une nouvelle recherche "notices de ce p�riodique"
                if (! $h=trim($this->selection[$name])) return '';
                $lien='Search?Rev='. urlencode('['.Utils::convertString($h).']');
                return $this->link($h, $lien, 'Notices du p�riodique '.$h);
                      
            case 'DateText':
            case 'DatePub':
            case 'DateVali':
            case 'Creation':
            case 'LastUpdate':
                if (! isset($this->selection)) return '';
                // Affiche les dates AAAA-MM-JJ et AAAAMMJJ sous la forme JJ/MM/AAAA
                if (! $h=$this->selection[$name]) return '';
                return preg_replace('~(\d{4})[-]?(\d{2})[-]?(\d{2})~', '${3}/${2}/${1}', $h);

            case 'Loc':
            case 'ProdFich':
            	if ($this->selection[$name]=='' ) return '';
                if (! $t=(array)$this->selection[$name]) return '';

                foreach ($t as $key=>$h)
                {
                    if ($h=trim($h))
                    {
                        // 1. Lien sur le nom du centre : lance une nouvelle recherche
                        $lien1=$this->link
                        (
                            $h,
                            'Search?'.$name.'='. urlencode($h),
                            ($name=='Loc') ? 'Documents localis�s au centre '.$h : 'Notices produites par le centre '.$h
                        );
                        $t[$key]=$lien1;
                        
                        // 2. Lien vers la pr�sentation du centre                    
                        // Recherche le num�ro de l'article correspondant � l'URL de la fiche de pr�sentation du centre
                        // et construit le lien
                        if (isset ($this->tblAsco[$h]))
                        {
                            $img=Routing::linkFor('/css/ascodocpsy/inform.png');
                            $lien2=$this->link
                            (
                                '<img src="'.$img.'" align="top" alt="Pr�sentation" />',
                                Config::get('urlarticle').$this->tblAsco[$h], 
                                'Pr�sentation du centre '.$h.' (ouverture dans une nouvelle fen�tre)',
                                true
                             );
                             $t[$key].='&nbsp;'.$lien2;
                        }                        
                    }
                }
                return implode(self::SEPARATOR, $t);
                
            case 'Presentation':
                if (! $h=$this->selection['Rev']) return '';
                
                // Path de l'image utilis�e pour le lien
                $img=Routing::linkFor('/css/ascodocpsy/inform.png');
                
                // Notice d'un document type P�riodique
                if (Utils::convertString($this->selection['Type'])=='periodique')
                {
                    if (! $lien=$this->selection['Lien']) return '';
                    
                    if (strpos(strtolower($lien), 'ascodocpsy') !== false)
                    {
                        $title='Pr�sentation du p�riodique (ouverture dans une nouvelle fen�tre)';
                        $alt='Pr�sentation';
                    }
                    else
                    {
                        $title='Acc�der au texte int�gral (ouverture dans une nouvelle fen�tre)';
                        $alt='Texte int�gral';
                    }

                    // Lien vers la page de pr�sentation de la revue ou vers le texte int�gral
                    // avec ouverture dans une nouvelle fen�tre
                    return $this->link('<img src="'.$img.'" align="top" alt="'.$alt.'" />', $lien, $title, true);
                }
                else
                {
                    // Lien vers la page de pr�sentation de la revue sur le site d'Ascodocpsy
                    $lien='Inform?Rev='. urlencode(Utils::convertString($h,'lower'));
                    return $this->link('<img src="'.$img.'" align="top" alt="Pr�sentation" />', $lien, 'Pr�sentation du p�riodique (ouverture dans une nouvelle fen�tre)', true);
                }

            case 'EtatCol':
            	if ($this->selection[$name]=='' ) return '';
                if (! $t=(array)$this->selection[$name]) return '';
                
                foreach ($t as $key=>$h)
                {
                    $h=trim($h);
                    
                    // Extrait le num�ro du centre asco (ex : "08 : 1996-2002(lac.)")
                    $length= (strpos($h, ':') === false) ? strlen($h) : strpos($h, ':');
                    $savCentre=trim(substr($h, 0, $length));    // 08
                    
                    // Construit le nom du centre
                    $centre= (substr($savCentre, 0, 1) == '0') ? 'asco'.substr($savCentre, 1) : 'asco'.$savCentre;  // asco8
                    
                    // Recherche l'URL de la fiche de pr�sentation du centre correspondant au num�ro asco
                    if (isset ($this->tblAsco[$centre]))
                    {
                        $lien=Config::get('urlarticle').$this->tblAsco[$centre];
                        $savCentre=$this->link($savCentre, $lien, 'Pr�sentation du centre '.$centre.' (ouverture dans une nouvelle fen�tre)', true);
                        $t[$key]=$savCentre.' '.substr($h, $length);
                    }
                }
                return implode('<br />', $t);
                
            // utilis� pour afficher une erreur dans les templates d'erreurs �ventuellement
            // indiqu�s dans la configuration
            case 'error':
            case 'message':
                return;
            
//            default:
//                if ($this->selection[$name])
//                    return $this->selection[$name];
//                else
//                    return '';

        }
    }

    /**
     * Callback utilis� lors de la cr�ation d'une notice.
     * 
     * Retourne une cha�ne vide pour chaque champ de la nouvelle notice � cr�er, 
     * except� :
     * - pour le champ Type : retourne le type du document 
     * - pour le champ ProdFich : retourne l'identifiant de la personne connect�e 
     *
     * @param string $name nom du champ de la base.
     * @return string retourne une cha�ne vide pour tous les champs de la base, 
     * except� pour les champs Type et ProdFich.
     */
    public function emptyString($name)
     {
        switch ($name)
        {
            case 'Type':
                return $this->request->Type;
            
            case 'ProdFich':
                return $this->ident;
            
            default:
                return '';
        }
     }

    /**
     * Callback utilis� lors de la cr�ation/modification d'une fiche. 
     *
     * Il affiche, dans le formulaire de modification, les dates de cr�ation et 
     * de derni�re modification.
     * 
     * @param string $name nom de la balise mentionn�e dans le template associ�.
     * @return string la valeur � injecter � la place de la balise $name, dans 
     * le template associ�.
     */
    public function getDates($name)
    {        
        switch ($name)
        {
            case 'Creation':
            case 'LastUpdate':
                if (! isset($this->selection) || ! $h=$this->selection[$name]) return;
                // Affiche les dates AAAAMMJJ sous la forme JJ/MM/AAAA
                return preg_replace('~(\d{4})(\d{2})(\d{2})~', '${3}/${2}/${1}', $h);
            
            default:
                return;                 
        }
    }

    /**
     * Filtre de validation des champs avant enregistrement dans la base.
     * 
     * @param string $name nom du champ de la base.
     * @param string $value contenu du champ $name.
     * @return bool retourne true pour les champs dont on accepte la modification,
     * false sinon.
     */
    public function validData($name, &$value)
    {                    
        switch ($name)
        {
			// Champs articles : on transforme le contenu en tableau
        	case 'Aut':
        	case 'MotCle':
        	case 'Nomp':
        	case 'CanDes':
        	case 'Edit':
        	case 'Lieu':
        	case 'EtatCol':
        	case 'Loc':
        	case 'ProdFich':
            case 'Annexe':
            case 'LienAnne':
            case 'IsbnIssn':
                // Si le champ n'est pas renseign�, alors l'action Save renvoie la valeur NULL 
                if (is_null($value)) break;
                if ( $value==='' || (is_array($value) && count($value)===0) )
                { 
                    $value=null;
                    break;
                };              
                
                // Transforme en tableau
                if (! is_array($value))
                {
                    // Le s�parateur pour le champ LienAnne est ' ; ' et non pas le slash car LienAnne contient des URL
                    $sep=($name=='LienAnne') ? ';' : trim(self::SEPARATOR);
                    $value=explode($sep,$value);
                }
                
                // Supprime les cha�nes vides
                $t=array_map('trim',$value);
                $value=array();
                foreach($t as $v)
                    if ($v!=='') $value[]=$v;

                break;
        	    
        	case 'Statut':
        	    // On garde le statut actuel de la notice s'il n'est pas transmis lors de l'enregistrement de la notice
        	    if (is_null($value) && $this->selection[$name]) return false;
        	    break;
        	    
            case 'Creation':
                if ($this->selection[$name]) return false;
                $value=date('Ymd');
                break;

            case 'LastUpdate':
                $value=date('Ymd');
                break;

            case 'LastAuthor':
                $value=$this->ident;
                break;

            default:
            	if ($value==='' || (is_array($value) && count($value)===0))
            		$value=null;
        }
        return true;
    }

    /**
     * Transforme un fichier texte tabul� en tableau.
     * 
     * Le fichier texte est de la forme suivante :
     * 1�re ligne : Ent�te1[tab]Ent�te2
     * lignes suivantes : Valeur1[tab]Valeur2
     * 
     * Le fichier doit se trouver dans le r�pertoire <code>tables</code> du module.
     * 
     * Le tableau retourn� a :
     *  - pour cl� : les valeurs de la premi�re colonne,
     *  - pour valeur : les valeurs de la deuxi�me colonne. 
     *
     * @param string $source nom du fichier en pr�cisant �ventuellement l'extension.
     * Si l'extension n'est pas mentionn�e, l'extension .txt est ajout�e.
     * @return array tableau correspondant au fichier tabul�.
     */
    private function loadTable($source)
    {
        $t=array();
        
        // Ajoute l'extension par d�faut s'il y a lieu
        $source=Utils::defaultExtension($source, '.txt');

        // Recherche la table dans le r�pertoire tables du module
        $h=Utils::searchFile($source, $this->path.'tables');        
        if (! $h)
            throw new Exception("Table non trouv�e : '$source'");
        
        // Ouvre la table
        $file=@fopen($h, 'r');
        if ($file === false)
            throw new Exception('Impossible d\'ouvrir le fichier '. $source);

        // Lit la ligne d'ent�te
        $fields=fgetcsv($file, 4096, "\t", '"');

        // Lit les enregistrements
        while (($data=fgetcsv($file, 4096, "\t", '"')) !== false)
            $t[$data[0]]=$data[1];

        // Ferme la table
        fclose($file);
    
        return $t;
    }
    
 	/**
 	 * D�termine les utilisateurs qui ont le droit de modifier une notice.
 	 * 
 	 * Les administrateurs peuvent modifier toutes les notices quelque soit leur
 	 * statut (en cours, avalider, valide).
 	 * 
 	 * Les membres du GIP peuvent modifier les notices valid�es. Si la notice
 	 * est en cours de saisie ou � valider, seuls les membres sp�cifi�s dans le 
 	 * champ ProdFich peuvent modifier la notice.
 	 * 
 	 * Le grand public n'a aucun droit de modification des notices.
 	 *
 	 * @return bool retourne true si la modification est autoris�e.
 	 */
    public function hasEditRight()
 	{
 		// Administrateurs : peuvent modifier les notices quel que soit leur statut
 		if (User::hasAccess('AdminBase')) return true;
 		
		// Membres du GIP
 		if (User::hasAccess('EditBase'))
 		{
			// Si la notice n'a pas �t� valid�e par un administrateur, seul les
			// membres sp�cifi�s dans le champ ProdFich peuvent modifier la notice
	        if ($this->selection['Statut'] != 'valide')
	            return (in_array($this->ident, (array)$this->selection['ProdFich'])) ? true : false;
 
			// Si la notice a �t� valid�e, tous les membres peuvent modifier la notice
			return true;
 		}

 		// Grand public : ne peuvent pas modifier les notices
 		return false;
 	}

    /**
     * Supprime, dans un auteur, les �tiquettes de r�le, les mentions telles que 
     * [s.n.], collectif et les indications de nom de naissance ou d'�pouse.
     * 
     * Ces suppressions sont faites afin de cr�er, � partir de la notice, un lien 
     * vers la bibliographie de l'auteur.
     *
     * @param string $value l'auteur tel que saisi dans la notice.
     * @return string l'auteur apr�s suppression des mentions non d�sir�es.
     */
    private function author($value)
    {
        $value=(str_ireplace(
            array
            (
                '[s.n.]',
                'collectif',
                'collab.',
                'coord.',
                'dir.',
                'ed.',
                'ill.',
                'pr�f.',
                'trad.'
            ),
            null,
            $value));
        
        $value=preg_replace('~(.+)(?:(n�|n�e|�p.)[ ].+)~','$1', $value);
        
        return trim($value);        
    }
    
    /**
     * G�n�re le code html pour un lien.
     *
     * @param string $value libell� du lien.
     * @param string $lien url du lien.
     * @param string $title titre du lien.
     * @param bool $newwin ouverture ou non du lien dans une nouvelle fen�tre 
     * (optionnel, valeur par d�faut false).
     * @param string $class nom de la class CSS associ�e au lien ((optionnel, 
     * valeur par d�faut cha�ne vide).
     * @return string code html du lien.
     */
    private function link($value, $lien, $title, $newwin=false, $class='')
    {
        $win=($newwin) ? ' onclick="window.open(this.href); return false;"' : '';
        $c=($class) ? ' class="'.$class.'"' : '';
//        $lien.='&' . substr(Routing::buildQueryString($this->request->getParameters()),1);
        return '<a'. $c. ' href="' . Routing::linkFor($lien) . '"' . $win . ' title="'.$title.'">'.$value.'</a>';        
    }

    /**
     * Affiche la localisation d'une revue.
     * 
     * Recherche, dans la base, la fiche P�riodique de <code>$Rev</code>.
     * Si la fiche existe, elle est affich�e en utilisant le template retourn� 
     * par la fonction {@link getTemplate()} et le callback indiqu� par la 
     * fonction {@link getCallback()}.
     * 
     * Dans le cas contraire, un message est affich�, en utilisant le template 
     * sp�cifi� dans la cl� <code><errortemplate></code> du fichier de configuration.
     * 
     * @param string $Rev la revue � localiser
     */
    public function actionLocate($Rev)
    {
        $this->request->required('Rev')->unique()->ok();
        
        // Construit l'�quation de recherche
        $eq='rev=['.$Rev.'] AND Type=periodique';
        
        // Ouvre la base de donn�es
        $this->openDatabase();

		// Fiche P�riodique inexistante
        if (! $this->select($eq))
        {
        	$this->showError('Aucune localisation n\'est disponible pour le p�riodique '.$Rev.'.');
        	return;
        }
        
        // Fiche P�riodique existante 
        
        // D�termine le template � utiliser
        if (! $template=$this->getTemplate())
            throw new Exception('Le template � utiliser n\'a pas �t� indiqu�');

        // D�termine le callback � utiliser
        $callback=$this->getCallback();

        // Ex�cute le template
        Template::run
        (
            $template,  
            array($this, $callback),
            $this->selection->record,
            array('selection',$this->selection)  
        );
    }

    /**
     * Affiche la page de pr�sentation d'une revue.
     * 
     * Recherche, dans la base, la fiche P�riodique de $rev.
     * Si la fiche existe et que l'URL sp�cifi�e dans le champ Lien pointe bien
     * vers le site www.ascodocpsy.org, redirige vers cette URL.
     * 
     * Un message d'erreur est affich� dans les cas suivants :
     * - fiche inexistante,
     * - plusieurs fiches existent pour la revue,
     * - la fiche existe mais le lien ne pointe pas vers le site www.ascodocpsy.org.
     *
     * @param string $Rev la revue pour laquelle on veut afficher la page 
     * de pr�sentation.
     */
    public function actionInform($Rev)
    {              
        $this->request->required('Rev')->unique()->ok();
        
        // Construit l'�quation de recherche
        $eq='rev=['.$Rev.'] AND Type=periodique';
        
        // Ouvre la base de donn�es
        $this->openDatabase();

		// Fiche P�riodique inexistante
        if (! $this->select($eq))
        {
            $this->showError('Aucune page de pr�sentation n\'est disponible sur le site www.ascodocpsy.org, pour le p�riodique '.$Rev.'.');
            return;
        }
        
        // Erreur si plusieurs notices pour le p�riodique
        if ($this->selection->count() >= 2 )
        {
        	$this->showError('Il existe plusieurs notices descriptives pour le p�riodique '.$Rev.'.');
        	return;
        }
        
        // Fiche P�riodique existante mais le champ Lien ne contient pas www.ascodocpsy.org
        if (stripos($this->selection['Lien'], 'ascodocpsy') === false)
        {
        	$this->showError('Aucune page de pr�sentation n\'est disponible sur le site www.ascodocpsy.org, pour le p�riodique '.$Rev.'.');
        	return;
        }
        
        // Fiche P�riodique existante, redirige vers l'URL du champ Lien (lien sur le site ascodocpsy.org)
        Runtime::redirect($this->selection['Lien'], true);
    }

    /**
     * Affiche le formulaire permettant de choisir le type du document � cr�er.
     * 
     * Si un type de document est sp�cifi� en param�tre, affiche le formulaire 
     * indiqu� dans la cl� <code><template></code> de la configuration, sinon
     * affiche le formulaire <code>/templates/chooseType.html</code> pour choisir le type 
     * de document � cr�er.
     * 
     * @param string $Type le type du document � cr�er.
     */    
    public function actionNew($Type='')
    {
        // Si type non renseign�, affiche le formulaire pour le choisir
        if (is_null($this->request->unique('Type')->ok()))
        {
            Template::run
            (
                'templates/chooseType.html'
            );
        }
        // Sinon, appelle l'action par d�faut
        else
        {
            parent::actionNew();
        }
    }

    /**
     * Valide des notices.
     *
     * C'est en fait un chercher/remplacer ({@link actionReplace() action Replace}) : 
     * chercher "avalider", remplacer par "valide" dans le champ "Statut".
     * 
     * Affiche une demande de confirmation si l'utilisateur n'a pas confirm� la 
     * validation des notices (template <code>/templates/confirmValidate.html</code>).
     * 
     * @param string $_equation l'�quation de recherche qui d�finit les notices
     * � valider.
     * 
     * @param bool $confirm un bool�en indiquant si l'action a �t� confirm�e.
     * Lorsque <code>$confirm</code> est � <code>false</code>, une confirmation 
     * est demand�e � l'utilisateur. Lorsque <code>$confirm</code> 
     * est � <code>true</code>, l'action Replace est lanc�e.
     */
    public function actionValidate($_equation='', $confirm=false)
    {
        // R�cup�re l'�quation 
        $eq=$this->request->get('_equation');

        // Demande confirmation � l'utilisateur
        if (! $confirm)
        {
            // Ajoute, � l'�quation, un filtre sur les notices � valider
            $filter='Statut:avalider';
            $this->equation=$eq ? '('.$eq.') AND '.$filter : $filter;       
            
            // V�rifie qu'il y a des notices � valider
            $this->openDatabase(false);
            if (! $this->select($this->equation, -1) )
            {
                $this->showError('La recherche '. $this->equation. ' ne contient aucune notice � valider, dans la base '. Config::get('database'). '.');
                return;
            }

            // Affiche le template de confirmation
            Template::run
            (
            	'templates/confirmValidate.html'
            );
            return;
        }

        // Valide les notices
        
        // fixme : on devrait pouvoir appeler l'action Replace de la fa�on suivante :
        // parent::actionReplace($eq, 'avalider', 'valide', array('Statut'));
        // Pb : les param�tres de la fonction sont r�cup�r�s � partir de Request.
        // Dans le template confirmValidate, on doit donc passer les param�tres au
        // formulaire.
        parent::actionReplace($eq);
    }

    /**
     * Affiche le contenu du panier.
     * 
     * Si le panier est vide, affiche le template d�fini dans la cl� 
     * <code><noanswertemplate></code> du fichier de configuration.
     */
    public function actionShowCaddie()
    {
        // Charge le panier
        $ascoCart=Module::getModuleFor(Request::create()->setModule('AscoCart')->setAction('Show'));
        $ascoCart->preExecute();
        
        // Le module en cours devient Base et l'action en cours devient Search
        $base=Module::getModuleFor($this->request->copy()->setModule('Base')->setAction('Search'));
        
        // Charge la configuration de l'action ShowCaddie
        Config::addArray(Config::get('actionShowCaddie'));
        
        // Panier vide
        if (count($ascoCart->cart)==0)
        {
            Template::run
            (
                $this->getTemplate('noanswertemplate')
            );
            return;
        }
         
        // Le panier contient des notices, ajoute dans la config une equation par d�faut contenant toutes les notices du panier
        if (count($ascoCart->cart))
            Config::set('equation','REF:('.implode(' OR ', array_keys($ascoCart->cart)).')');
        
        // Lance /Base/Search sans param�tres pour qu'il utilise l'�quation par d�faut
        $base->execute();
    }
    
//    public function actionNewsletter()
//    {
//        global $selection;
//
//        header('content-type: text/plain');
//        
//        if (is_null($equation=Utils::get($_REQUEST['equation'], null)))
//        {
//            echo "return 'Les param�tres requis n'ont pas �t� indiqu�s.';";
//            return;
//        }
//
//        // Ouvre la s�lection
//        ob_start();
//        $selection=self::openDatabase($equation);
//        $h=ob_get_clean();
//        if ($h!=='' or is_null($selection))
//        { 
//            echo "return 'Impossible d\'ouvrir la base de donn�es :<br />".addslashes($h)."';";
//            return;
//        }
//        
//        // D�termine le template � utiliser
//        if (! $template=$this->getTemplate('template'))
//        {
//            echo "return 'Le template � utiliser n'a pas �t� indiqu�';";
//            return;
//        }
//        
//        // D�termine le callback � utiliser
//        $callback=$this->getCallback();
//
//        // Ex�cute le template
//        Template::run
//        (
//            $template,  
//            array($this, $callback),
//            'Base::newsletterCallback'
//        );
//        
//    }
    
    
    // ------------------- GESTION DU PANIER -------------------
    
    /**
     * Exporte des notices par type de documents.
     *
     */
    public function actionExportByType() // fixme: ne devrait pas �tre l�. Mettre dans DatabaseModule un foction g�n�rique ('categorize()') et se contenter de l'appeller ici
    {
        // Ouvre la base de donn�es
        $this->openDatabase();

        // D�termine la recherche � ex�cuter        
        $this->equation=$this->getEquation();

        // Pas d'�quation : erreur
        if (is_null($this->equation))
        {
            $this->showError('Aucun crit�re de recherche indiqu�.');
            return;
        }

        // Lance la recherche, si aucune r�ponse, erreur
        if (! $this->select($this->equation, -1))
        {
            $this->showNoAnswer("La requ�te $this->equation n'a donn� aucune r�ponse.");
            return;
        }
    	
        // IDEA: on pourrait utiliser les "collapse key" de xapian pour faire la m�me chose
        // de fa�on beaucoup plus efficace (collapser sur type : une seule r�ponse par type de
        // document, get_collapse_count() donne une estimation du nombre de documents pour chaque
        // type)
        // A voir �galement : utiliser un MatchSpy (xapian 1.0.3)
        $lastCount=$this->selection->count();

        $equation=$baseEquation='(' . $this->equation . ')';
        
        $catField='Type';
        $catIndex='Type';
        $phraseSearch=false;
        
        $categories=array();
        for($i=0;$i<100;$i++)
        {
        	$name=$cat=$this->selection[$catField];
            if (is_array($cat)) $name=$cat=reset($cat);
            if (is_null($cat) || $cat===false || $cat==='')
            {
                $cat='__empty';
                $name='Sans type';
            }
            elseif($phraseSearch)
                $cat="[$cat]";
            elseif(strpos($cat, ' ')!==false)
                $cat="($cat)";
            
            $equation.=" -$catIndex:$cat";
            $found=$this->select($equation, -1);

            $count=$this->selection->count();
            $diff=$lastCount-$count;
            if ($diff==0)
                throw new Exception("Impossible de cr�er des cat�gories sur le champ $catField, l'�quation $equation n'a pas diminu� le nombre de r�ponses obtenues (index sans attribut count ?)");
            if ($diff<0)
                throw new Exception("Impossible de cr�er des cat�gories sur le champ $catField, l'�quation $equation a augment� le nombre de notices obtenues (utiliser l'option phraseSearch ?)");

            $categories[$name]=array('equation'=>"$catIndex:$cat AND $baseEquation", 'count'=>$lastCount-$count);
            $lastCount=$count;

            if (!$found) break;
        }

        ksort($categories);

        // D�termine le template � utiliser
        if (! $template=$this->getTemplate())
            throw new Exception('Le template � utiliser n\'a pas �t� indiqu�');

        // D�termine le callback � utiliser
        $callback=$this->getCallback();

        // Ex�cute le template
        Template::run
        (
            $template,  
            array('categories'=>$categories)  
        );
        
    }
    
    /**
     * Callback utilis� pour les exports Vancouver.
     *
     * @param string $name nom de la balise mentionn�e dans le template associ�.
     * @return string la valeur � injecter � la place de la balise $name, dans 
     * le template associ�.
     */
    public function exportData($name)
    {
        switch ($name)
        {
            case 'Aut':
                if ($this->selection[$name]=='' ) return '';
                if (!$value=(array)$this->selection[$name]) return '';  // Cas o� $this->selection[$name] est null
                
                // R�cup�re le format d'export
                $format=Utils::get($_REQUEST['_format']);
                
                $i=6;   // On n'affiche que les 6 premiers auteurs et on met 'et al.'
                if (count($value)>$i)
                {
                    $value=array_slice($value,0,$i);
                    $value[$i]='et al.';
                    $value=implode(Config::get("formats.$format.sep"), $value);
                }
                else
                {
                    $value=implode(Config::get("formats.$format.sep"),$value);
                    // N'ajoute pas de point final, si on a une mention d'auteur (Dir.)
                    if (substr($value,-1,1)!='.') $value.='.';  
                }   
                return $value;
                
            case 'Tit':
                if (! $value=$this->selection[$name]) return '';

                // Ajoute un point � la fin du titre 
                if (strpos('.!?',substr($value,-1,1))===false) $value.='.';
                
                return $value;

            case 'PdPf':
                if (! $value=$this->selection[$name]) return '';
                
                // S'il n'y a qu'une seule page (19) ou si la pagination n'est pas continue (1 ; 3-5),
                // on laisse tel quel
                if (strpos($value,';')!==false || strpos($value,'-')===false) return $value;
                
                list($p1,$p2)=split('-',$value,2);
                $p1=trim($p1);
                $p2=trim($p2);
                
                // Si les 2 bornes de la pagination n'ont pas le m�me nombre de chiffres,
                // (95-120), on laisse tel quel
                if (strlen($p1)<>strlen($p2)) return $value;
                
                // Transforme la pagination (ex : 303-306 en 303-6) 
                for ($i=0;$i<strlen($p1);$i++)
                {
                    if ($p1[$i]<>$p2[$i])
                    {
                        $p2=substr($p2,$i);
                        break;
                    }
                }
                return $p1.'-'.$p2;
                
            default:
                return;
        }
    }
    
               
    // ------------------- IMPORT DE NOTICES -------------------
    
    /**
     * V�rifie que le fichier charg� pour l'import est valide.
     * 
     * Les v�rifications sont faites dans l'ordre suivant :
     * - le fichier n'est pas vide,
     * - la premi�re ligne du fichier n'est pas vide,
     * - la premi�re ligne fait une longueur maximum qui correspond � la longueur
     *   de l'ensemble des noms des champs de la base s�par�s par des tabulations,
     * - la premi�re ligne contient des tabulations,
     * - la premi�re ligne contient les noms des champs de la base.
     *
     * @param string $path chemin du fichier � charger sur le serveur.
     * @return string|bool message de l'erreur ou true si le fichier est valide.
     */
    public function checkImportFile($path)
    {
        // V�rifie que le fichier n'est pas vide
        if (filesize($path) == 0)
            return 'Le fichier est vide (z�ro octets)';

        // Ouvre le fichier
        $f=fopen($path,'r');

        // Lit la premi�re ligne et supprime les espaces et les tabulations de d�but et fin
        $fields=trim(fgets($f, 4096)," \t\r\n");

        // V�rifie que la ligne n'est pas vide
        if ($fields=='')
            return 'La premi�re ligne du fichier est vide.';
        
        // Calcule la longueur maximale de la premi�re ligne (doit contenir les noms des champs)
        // Ouvre la base de donn�es et r�cup�re les champs de la base
        $this->openDatabase();
        $dbFields=array_keys($this->selection->getSchema()->fields);
        $maxLen=strlen(implode("\t",$dbFields));
        
        // V�rifie qu'elle fait moins de $maxLen
        if (strlen($fields)>$maxLen)
            return 'La premi�re ligne du fichier fait plus de '.$maxLen.' caract�res. Elle ne contient pas les noms des champs.';
        
        // V�rifie qu'elle contient des tabulations
        if (strpos($fields,"\t")===false)
            return 'La premi�re ligne du fichier ne contient pas les noms de champs ou ne contient qu\'un seul nom.';
        
        // V�rifie que la premi�re ligne contient les noms de champs
        $fields=explode("\t",$fields);
        foreach ($fields as & $value) $value=trim($value,' "'); // Supprime les guillemets qui entourent les champs
        $dbFields=array_map('strtoupper',$dbFields);

        if (count($t=array_diff($fields, $dbFields)) > 0)
            return 'Champ(s) ' . implode(', ', array_values($t)) . ' non g�r�(s)';

        // La premi�re ligne du fichier contient bien les noms des champs, on lit
        // maintenant le reste du fichier
        
        // Initialise le rapport d'erreurs du fichier
        $report='';
        
        // Parcourt le fichier
        $ligne=1;
        while (($data=fgetcsv($f, 4096, "\t", '"')) !== false)
        { 
            $ligne++;
            $err='';
            
            // V�rifie que la ligne n'est pas vide
            $h=array_filter($data);
            if (count($h)==0)
            {
                $err='la ligne est vide.';
            }
            
            // V�rifie qu'il y a autant de champs que sur la premi�re ligne
            else
            {
                if (count($data)<>count($fields))
                    $err='il n\'y a pas autant de champs que sur la premi�re ligne du fichier (noms des champs).';
            }
            
            // Met � jour le rapport d'erreurs
            if ($err) $report.='Ligne '.$ligne.' : '.$err;
        }
        
        // Il y a des erreurs
        if ($report) return $report; 
        
        // Le fichier est valide
        return true; 
    } 
    

    /**
     * Callback d'import d'un fichier de notices.
     *
     * @param string $path le path et le nom du fichier � importer.
     * @param string $errorPath le path du fichier dans lequel sont stock�es les 
     * notices erron�es.
     * @return array tableau contenant :
     * - le r�sultat de l'ex�cution : true si l'import s'est bien d�roul�, false sinon
     * - le rapport d'ex�cution
     * - le num�ro de la premi�re notice import�e
     * - le num�ro de la derni�re notice import�e
     */
    public function importFile($path, $errorPath)
    {
        // Ouvre le fichier
        if (false === $f=fopen($path,'r'))
        {
            $execReport.=date('d/m/Y, H:i:s').' : Impossible d\'ouvrir le fichier '. $path.'. Le fichier n\'a pas �t� import�.';
            return array(false,$execReport,null,null);
        }
        
        // Heure de d�but de l'import
        $execReport='D�but de l\'import : '.date('d/m/Y, H:i:s')."\n";
        
        // Ouvre la base de donn�es en �criture
        $this->openDatabase(false);

        // Stocke la taille du fichier pour la barre de progression
        $filesize=filesize($path);

        // Lit la premi�re ligne et r�cup�re le nom des champs
        $fields=fgetcsv($f, 4096, "\t", '"');
        
        // Compte le nombre de champs
        $nbFields=count($fields);

        // Lit le fichier et met � jour la base
        $nbRef=$firstRef=$lastRef=0;
        while (($data=fgetcsv($f, 4096, "\t", '"')) !== false)
        {
            // Met � jour la barre de progression
            Taskmanager::progress(ftell($f), $filesize);
            
            // Ignore les lignes vides
            $h=array_filter($data);
            if (count($h)==0) continue;

            // Initialise le nombre de champ de la notice
            $nbRefFields=0;
            
            // Ajoute la notice
            $this->selection->addRecord();

            foreach ($data as $i=>$v)
            {
                // Ignore les tabulations situ�es apr�s le dernier champ
                $nbRefFields++;
                if ($nbRefFields>$nbFields) break;

                // Minusculise le nom des champs 
                // On n'a pas besoin de d�terminer le nom du champ � partir  
                // du sch�ma de la base car, pour $selection['X'], 
                // X est insensible � la casse
                $fieldname=strtolower($fields[$i]);
                
                $v=trim(str_replace('""', '"', $v));
                
                switch ($fieldname)                    
                {
                    // Champs articles : on transforme le contenu en tableau
                    case 'aut':
                    case 'motcle':
                    case 'nomp':
                    case 'candes':
                    case 'edit':
                    case 'lieu':
                    case 'etatcol':
                    case 'loc':
                    case 'prodfich':
                    case 'annexe':
                    case 'isbnissn':
                        $v=($v=='') ? null : array_map("trim",explode(trim(self::SEPARATOR),$v));
                        break;

                    // Champs articles : on transforme le contenu en tableau
                    case 'lienanne':
                        // Pour le champ LienAnne (Adresses Internet des annexes),
                        // le s�parateur d'articles est le ' ; '
                        $v=($v=='') ? null : array_map("trim",explode(' ; ',$v));
                        break;

                    default:
                        if ($v=='') $v=null;
                }
                
                $this->selection[$fieldname]=$v;
            }
            
            // Initialisation des champs de gestion
            // Dates de cr�ation et de derni�re modification
            $this->selection['Creation']=$this->selection['LastUpdate']=date('Ymd');
            
            // Statut de la notice
            // Les notices import�es sont � valider par un administrateur
            $this->selection['Statut']='avalider';
             
            // Enregistre la notice
            if ($firstRef===0)
                $firstRef=$this->selection->saveRecord();
            else
                $lastRef=$this->selection->saveRecord();
                
            $nbRef++;
        }
            
        // Ferme le fichier
        fclose($f);

        // Affiche le nombre de notices import�es
        if ($nbRef==1)
            echo '<p>1 notice import�e (REF ', $firstRef, ')</p>';
        else
            echo '<p>', $nbRef, ' notices import�es (REF ', $firstRef, ' � ', $lastRef, ')</p>';
        
        // Ferme la base
        unset($this->selection);

        // Ferme la barre de progression
        Taskmanager::progress();
        
        // Import termin� : toutes les notices ont �t� import�es
        $execReport.='Fin de l\'import : '.date('d/m/Y, H:i:s').".\n";
        if ($nbRef==1)
            $execReport.='1 notice a �t� import�e (REF '.$firstRef.').';
        else
            $execReport.=$nbRef. ' notices ont �t� import�es (REF '.$firstRef.' � '.$lastRef.').';
        
        return array(true, $execReport, $firstRef, $lastRef);
    }
    
}
?>