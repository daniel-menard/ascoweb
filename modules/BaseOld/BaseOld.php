<?php
/**
 * Module Base - Consultation de la base documentaire
 */

require_once 'Cart.php';

class BaseOld extends Module
{
    /**
     * Equation de recherche
     */
    private $equation='';
    
    /**
     * Message d'erreur lors d'une recherche
     */
    private $error='';
    
    public function preExecute()
    {
        // si c'est une action qui porte sur le panier de notice, d�marre les sessions
//        if (strpos($this->action, 'Cart') !== false)
//            Config::set('sessions.use', true);
        if ($this->action=='exportCart')
            $this->actionExportCart(true);
        
        //$this->addCSS('autosize');
        
//        if ($this->action=='load')                DM : fait dans le fichier de config, maintenant
//            $this->addJavascript('autosize');
    }
    
    public function postExecute()
    {
    }
    
    public function actionSearch()
    {
        $this->doSearch('simple');
    }
    
    public function actionAdvancedSearch()
    {
        $this->doSearch('advanced');
    }
    
    public function actionLocate()
    {
        global $selection;
               
        $rev=Utils::get($_REQUEST['rev']);
        
        // Si pas de nom de p�riodique
        if (is_null($rev))
            throw new Exception("Appel incorrect : aucun nom de p�riodique n'a �t� pr�cis�.");
        
        // Construit l'�quation de recherche
        $eq='rev="'.$rev.'" et Type=periodique';
        
        // Recherche la fiche P�riodique
        $selection=openselection($eq);

        switch ($selection->count)
        {
            case 0:
                throw new Exception('Aucune localisation n\'est disponible pour ce p�riodique. eq. bis:'.$selection->equation);
                break;
                
//            case 1:
//                // D�finit le template
//                $tpl="${droit}_show_p�riodique.yaml";
//                Template::run
//                (
//                     
//                    "templates/$tpl",
//                    array
//                    (
//                        array($this     , 'baseCallback'),
//                        array('Template', 'selectionCallback')
//                    )
//                );               
//                break;
                
            default:
                $rev=Utils::convertString($rev);
                $selection->movefirst();
                while (! $selection->eof)
                {
                //echo "<li>compare [$rev] avec [" . $selection->field('Rev') . "]";
                    if ($rev == Utils::convertString($selection->field('Rev')))
                    {
                        // D�finit le template
//                        if (User::hasAccess('AdminBase'))
//                            $tpl='admin';
//                        elseif (User::hasAccess('EditBase'))
                        if (User::hasAccess('EditBase,AdminBase'))
                            $tpl='member';   // TODO: SF : le template admin n'existe pas
                        else
                            $tpl='public';
                        
                        // R�ouvre la s�lection contenant uniquement la notice du p�riodique 
                        $selection=openselection('REF='. $selection->field(1), true);

                        // Affiche la notice
                        Template::run
                        (
                            "templates/${tpl}_show.yaml", 
                            array($this, 'chooseTplCallback'),
                            'Template::selectionCallback'
                        );

                        exit;
                    }
                    $selection->movenext();
                }
                throw new Exception('Aucune localisation n\'est disponible pour ce p�riodique. eq. bis:'.$selection->equation);
        };
    }
    
    private function doSearch($type)
    {
        global $selection;
        
        // Construit l'�quation
        $this->equation=$this->makeBisEquation();
                
        if ( $this->hasErrors() )
        {
            // D�termine le template � utiliser en fonction des droits d'utilisateur
//            if (User::hasAccess('AdminBase'))
//                $tpl='admin';
//            elseif (User::hasAccess('EditBase'))
            if (User::hasAccess('EditBase,AdminBase')) // TODO: SF : le template admin n'existe pas
                $tpl='member';
            else
                $tpl='public';
            
            $tpl.="_${type}_search.yaml";
            
            // Montre le formulaire
            Template::run
            (
                "templates/$tpl", 
                array($this, 'chooseTplCallback'),
                $_REQUEST,
                'Template::emptyCallback'
            );
        }
        else
        {
            // Ouvre la s�lection
           $selection=openselection($this->getFilter($this->equation), true);        
            
            // Charge le template
            // Affiche la notice compl�te si on a une seule r�ponse, la liste sinon
            //$tpl=($selection->count==1) ? "${droit}_show.yaml" : "${droit}_list.yaml";
            //$tpl="${droit}_list.yaml";
//            if (User::hasAccess('AdminBase'))
//                $tpl='admin';
//            elseif (User::hasAccess('EditBase'))
            if (User::hasAccess('EditBase,AdminBase')) // TODO: SF : le template admin n'existe pas
                $tpl='member';
            else
                $tpl='public';
            
            $tpl.='_list.yaml';
    
            Template::run
            (
                "templates/$tpl", 
                array($this, 'chooseTplCallback'),
                'Template::selectionCallback'
            );
        }
    }
    
    // ------------------- GESTION DU PANIER ------------------
    
    private function getCart()
    {
        // Cr�e (et charge s'il existe d�j�) le panier contenant les notices
        // s�lectionn�es. Si le panier est modifi�, il sera automatiquement
        // enregistr� � la fin de la requ�te en cours.
        if (! isset($this->cart))
            $this->cart=new Cart('selection');
    }
    
    private function selectionFromCart()
    {
        global $selection;

        $this->getCart();
        
        // Ouvre une s�lection vide
        $selection=openselection('');        

        // Ajoute dans la s�lection toures les notices pr�sentes dans le panier
        if ($this->cart->count())
            foreach ($this->cart->getItems() as $ref)
                $selection->add($ref);
    } 
    
    public function actionShowCart()
    {
        $this->getCart();
        if ($this->cart->count()==0)
        {
            Template::run('templates/empty_cart.yaml');
            return;
        }

        // Charge la liste des formats d'export disponibles
        Config::load($this->path. 'templates/export/formats.yaml', 'formats');
        global $formats; // pour que ce soit accessible dans le template 
        $formats=Config::get('formats');
        
        $this->selectionFromCart();        

        // D�finit le template d'affichage 
        if (User::hasAccess('EditBase,AdminBase')) // TODO: SF : le template admin n'existe pas
            $tpl='member';
        else
            $tpl='public';
        $tpl.='_cart.yaml';

        Template::run
        (
            "templates/$tpl", 
            array($this, 'chooseTplCallback'),
            'Template::selectionCallback',
            array('body'=>'Les notices s�lectionn�es figurent dans le document joint') // TODO: � virer, uniquement parce que le g�nrateur ne prends pas correctement 'value' en compte
        );


    }

    /**
     * Ajoute une ou plusieurs notices dans le panier
     */
    public function actionAddToCart()
    {
        $art=Utils::get($_REQUEST['art']);
        
        if (is_null($art))
            throw new Exception("Aucun num�ro de notice n'a �t� indiqu�e.");

        $this->getCart();
        $this->cart->add($art);
        $this->actionShowCart();
    }
    
    /**
     * Supprime une ou plusieurs notices du panier
     */
    public function actionRemoveFromCart()
    {
        $art=Utils::get($_REQUEST['art']);
        
        if (is_null($art))
            throw new Exception("Aucun num�ro de notice n'a �t� indiqu�e.");

        $this->getCart();

        if (is_array($art))
        {
            foreach ($art as $value)
                $this->cart->remove($value);
        }
        else
        {
            $this->cart->remove($art);
        }
        $this->actionShowCart();
    }
    
    /**
     * vide le panier
     */
    public function actionClearCart()
    {
        $this->getCart();

        $this->cart->clear();
        $this->actionShowCart();
    }
    
    public function actionExportCart($now=false)
    {
        if (! $now) return; // preExecute nous appelle avec now=true, on bosse, quand le framework nous appelle, rien � faire 
        // tout est fait dans preExecute
        $format=Utils::get($_REQUEST['format']);
        if (is_null($format))
            //$this->error='Le format n\'a pas �t� indiqu�';
            throw new Exception("Le format n'a pas �t� indiqu�");

        $cmd=Utils::get($_REQUEST['cmd']);
        if (is_null($cmd))
            throw new Exception("La commande n'a pas �t� indiqu�e");
            
        if ($cmd !='export' && $cmd!='mail' && $cmd !='show')
            throw new Exception("Commande incorrecte");

        if ($cmd=='mail')
        {
            $to=Utils::get($_REQUEST['to']);
            if (is_null($to))
                throw new Exception("Le destinataire n'a pas �t� indiqu�");

            $subject=Utils::get($_REQUEST['subject']);
            if (is_null($subject))
                $subject='Notices Ascodocpsy';

            $body=Utils::get($_REQUEST['body']);
            if (is_null($body))
                $body='Le fichier ci-joint contient les notices s�lectionn�es';
        }
    
        // Charge la liste des formats d'export disponibles
        Config::load($this->path. 'templates/export/formats.yaml', 'formats');
        if (! $format=Config::get("formats.$format"))
            throw new Exception('Format incorrect');
        
        $template=$this->path . 'templates/export/'.$format['template'];
        if (! file_exists($template))
            throw new Exception('Format incorrect');

        // G�n�re l'export, en bufferisant : si on a une erreur, elle s'affiche � l'�cran, pas dans le fichier
        $this->selectionFromCart();

        ob_start();        
        Template::run
        (
            $template, 
            array($this, 'chooseTplCallback'),
            'Template::selectionCallback'
        );
        $data=ob_get_clean();

        if ($cmd=='export' || $cmd=='show')
        {        
            if (isset($format['layout']))
                $this->setLayout($format['layout']);
            else
                $this->setLayout($format['none']);
    
            if (isset($format['content-type']))
                header('content-type: ' . $format['content-type']);
    
            if ($cmd=='export')
            {
                header
                (
                    'content-disposition: attachment; filename="' 
                    . (isset($format['filename']) ? $format['filename'] : 'notices.txt') 
                    . '"'
                );
            }
                        
            echo $data;
        }
        else
        {
            $this->setLayout('none');

            require_once(Runtime::$fabRoot.'htmlMimeMail5/htmlMimeMail5.php');
        
            $mail = new htmlMimeMail5();
            $mail->setFrom('Site AscodocPsy <daniel.menard@bdsp.tm.fr>');
            $mail->setSubject($subject);
            $mail->setText($body);
            $mail->addAttachment
            (
                new stringAttachment
                (
                    $data,
                    isset($format['filename']) ? $format['filename'] : 'notices.txt',
                    isset($format['content-type']) ? $format['content-type'] : 'text/plain'
                )
            );
        
            if ($mail->send( array($to)) )
            {
                echo '<p>Vos notices ont �t� envoy�es � l\'adresse ', $to, '</p>';
            }
            else
            {
                echo "<p>Impossible d'envoyer le mail � l'adresse '$to'</p>";
            }
            
        }
        
    }
    
    // TODO : � mettre ailleurs que dans ce module
    /**
     * Cr�e une �quation � partir des param�tres de la requ�te.
     * 
     * Les param�tres qui ont le m�me nom sont combin�s en 'OU', les param�tres
     * dont le nom diff�re sont combin�s en 'ET'.
     * 
     * Un m�me param�tre peut �tre combin� plusieurs fois : les diff�rentes
     * valeurs seront alors combin�s en 'OU'.
     * 
     * Un param�tre peut contenir une simple valeur, une expression entre
     * guillemets doubles ou une �quation de recherche combinant des valeurs ou
     * des expressions avec des op�rateurs. Les op�rateurs seront remplac�s
     * lorsqu'ils ne figurent pas dans une expression. (avec tit="a ou b"&tit=c
     * on obtient tit="a ou b" et tit=c et non pas tit="a ou tit=b" et tit=c)
     * 
     * Lors de la cr�ation de l'�quation, les param�tres dont le nom commence
     * par 'bq', les noms 'module' et 'action' ainsi que le nom utilis�
     * comme identifiant de session (sessin_name) sont ignor�s. Vous pouvez
     * indiquer des noms suppl�mentaires � ignorer en passant dans le param�tre
     * ignore une chaine contenant les noms � ignorer (s�par�s par une virgule).
     * Par exemple si votre formulaire a des param�tres nomm�s 'max' et 'order',
     * ceux-ci seront par d�faut pris en compte pour construire l'�quation (vous
     * obtiendrez quelque chose du style "tit=xxx et max=100 et order=1", ce qui
     * en g�n�ral n'est pas le r�sultat souhait�). Pour obtenir le r�sultat
     * correct, indiquez la chaine "max, order" en param�tre.
     * 
     * @param string $ignore optionnel, param�tres suppl�mentaires � ignorer.
     * (remarque : insensible � la casse).
     * 
     * @return mixed soit une chaine contenant l'�quation obtenue, soit une
     * chaine vide si tous les param�tres pass�s �taient vides (l'utilisateur a
     * valid� le formulaire de recherche sans rien remplir), soit null si aucun
     * param�tre n'a �t� pass� dans la requ�te (l'utilisateur a simplement
     * demand� l'affichage du formulaire de recherche)
     */
    private function makeBisEquation($ignore='')
    {
        if ($ignore) $ignore='|' . str_replace(',', '|', preg_quote($ignore, '~'));
        $namesToIgnore="~module|action|bq.+|".preg_quote(session_name())."$ignore~i";
        
        $equation='';
        $hasFields=false;
        foreach((Runtime::isGet() ? $_GET : $_POST) as $name=>$value)
        {
            if (preg_match($namesToIgnore, $name)) continue;	
            
            $hasFields=true; // il y a au moins un nom de champ non ignor� pass� en param�tre

            if (! is_array($value))
                if ($value=='') continue; else $value=array($value);
                
            $h='';
            
            foreach ($value as $item)
            {
                if ($item == '') continue;
                
                // remplace 'et/ou/sauf' par 'op $name=', mais pas dans les trucs entre guillemets
                $t=explode('"',$item);
                $parent=false;
                for ($i=0; $i<count($t); $i+=2)
                {
                    $nb=0;
                    if ($t[$i])
                    {
                        $t[$i]=str_ireplace
                        (
                            array(' ou ', ' or ', ' et ', ' sauf ', ' and not ', ' but ', ' and '),
                            array(" ou $name=", " ou $name=", " et $name=", " sauf $name=", " sauf $name=", " sauf $name=", " et $name="),
                            $t[$i],
                            $nb
                        );
                    	if ($nb) $parent=true;
                    }
                }
                $item="$name=" . implode('"',$t);
                $item=preg_replace('~'.$name.'\s*=((?:\s*\()+)~', '\1' . $name . '=', $item);
                $item=preg_replace('~\s+~', ' ', $item);
                $item=preg_replace('~=\s+~', '=', $item);
//                $item=implode('"',$t);
//                $item=preg_replace('~\(([^\(])~', '(/'.$name.'/=\1', $item);
                if ($parent) $item='(' . $item . ')';
                
                if ($h) 
                {
                    $h.=" ou $item"; 
                    $parent=true;
                }
                else
                {
                    $h=$item;
                    $parent=false;
                }
            }
                                    
            if ($parent) $h='(' . $h . ')';
            if ($h) if ($equation) $equation .= ' et ' . $h; else $equation=$h;
        }
        //echo "equation : [$equation]";
        if ($hasFields) return $equation; else return null;
    }

    /**
     * D�termine s'il y a un filtre � appliquer � l'�quation de recherche,
     * en fonction des droits d'utilisateur
     * 
     * @param string $equation l'�quation de recherche
     * @return string l'�quation inchang�e ou l'�quation
     * � laquelle un filtre a �t� appliqu�
     */
    private function getFilter($equation)
    {               
        if (! User::hasAccess('AdminBase,EditBase'))
            // TODO : A activer quand on aura plus de notices valid�s
            // Le grand public ne voit que les notices valid�es.
            // Ne voit pas les notices P�riodique
            //$equation='((' . $equation . ') sauf Type=periodique) and Valide=vrai';
            $equation='(' . $equation . ') sauf Type=periodique';

        return $equation;
    }

    /**
     * Callback. D�finit le template d'affichage � utiliser en fonction
     * des droits d'utilisateur, du type du document et de l'affichage
     * "liste des r�ponses" ou "notice compl�te"
     *   
     */
    public function chooseTplCallback($name)
    {
        global $selection;

//        if (User::hasAccess('AdminBase'))
//            $tpl='admin';
//        elseif (User::hasAccess('EditBase'))


        switch ($name)
        {
            case 'equation': return $this->equation . '<br />eq. bis : ' . $selection->equation . '<br />R�ponses : ' . $selection->count;
            
            case 'error':
                return $this->error;
                
            case 'template':
                // Initialise le nom du template 
                if (User::hasAccess('EditBase,AdminBase')) // TODO : SF : le template admin n'existe pas
                    $tpl='member';
                else
                    $tpl='public';               

                // M�me template pour les type Th�se et M�moire
                $type=(strtolower($selection->field('Type')) == 'th�se') ? 'm�moire' : strtolower($selection->field('Type'));

                // D�finit le template en fonction du nombre de r�ponses
                $tpl=($selection->count==1) ? "templates/${tpl}_show_$type.yaml" : "templates/${tpl}_list_$type.yaml";
                
                // Charge le template
                Template::run
                (
                    $tpl, 
                    array($this, 'baseCallback'),
                    'Template::selectionCallback'
                );
                return '';
        }
    }
 
    /**
     * 
     */
    public function baseCallback($name)
    {
        global $selection;
                
        switch ($name)
        {
            case 'Tit':
                // Lien vers texte int�gral
                if (($tit=$selection->field($name)) && ($lien=$selection->field('Lien')))
                    return $this->link($tit, $lien, 'Acc�der au texte int�gral');
                break;
            
            case 'Annexe':
                // Lien vers texte int�gral
                if (($tit=$selection->field($name)) && ($lien=$selection->field('LienAnne')))
                    return $this->link($tit, $lien, 'Acc�der au texte int�gral');
                break;
    
            case 'Aut':
                if (! $h=$selection->field($name)) return ;
                
                $t=explode(trim(SEPARATOR),$h);
                foreach ($t as $key=>$h)
                {
                    $h=trim($h);
                    if ($aut=$this->author($h))
                    {
                        $lien='/base/search?aut='. urlencode($aut);
                        $h=$this->link($h, $lien, 'Bibliographie de '.$h);
                    }
                    $t[$key]=$h;
                }
                return implode(SEPARATOR, $t);
                break;
                
            case 'MotCle':
            case 'Nomp':
            case 'CanDes':
            case 'Theme':
                if (! $h=$selection->field($name)) return;
    
                $t=explode(trim(SEPARATOR), $h);
                foreach ($t as $key=>$h)
                {
                    $h=trim($h);
                    $lien='/base/search?motscles='. urlencode($h);
                    $h=$this->link($h, $lien, 'Notices index�es au descripteur '.$h);
                    $t[$key]=$h;
                }
                return implode(SEPARATOR, $t);
                break;
                
            case 'Rev':            
                if (Utils::convertString($selection->field('Type'))=='periodique' && ($lien=$selection->field('Lien')))
                {
                    // Lien vers texte int�gral sur le titre du p�riodique
                    return $this->link($selection->field($name), $lien, 'Acc�der au texte int�gral');
                }
                else
                {
                    // Lien vers une nouvelle recherche "notices de ce p�riodique"
                    if (! $h=$selection->field($name)) return ;
                    $h=trim($h);
                    $lien='/base/search?rev='. urlencode($h);
                    return $this->link($h, $lien, 'Notices du p�riodique '.$h);
                };
                break;
            
            case 'DateText':
            case 'DatePub':
            case 'DateVali':
                return preg_replace('~(\d{4})\/(\d{2})\/(\d{2})~', '${3}/${2}/${1}', $selection->field($name));

            case 'Localisation': 
               if (! $h=$selection->field('Rev')) return '';
               
               // Lien vers la fiche P�riodique du titre de p�riodique contenu dans le champ Rev,
               // pour obtenir la localisation
               $lien='locate?rev='. urlencode($h);
               return '<a class="locate" href="' . Routing::linkFor($lien) . '" title="Localiser le p�riodique"><span>Localiser</span></a>';

//                // Construit l'�quation de recherche
//                $eq='Rev="'.$h.'" et Type=periodique';
//                
//                // Recherche la fiche P�riodique
//                $sel=openselection($eq);
//                
//                switch ($sel->count)
//                {
//                    case 0:
//                        return '';
//                        
//                    case 1:
//                        $lien='/base/show?ref='. $sel->field('REF');
//                        return '<a class="locate" href="' . Routing::linkFor($lien) . '" title="Localiser le p�riodique"><span>Localiser</span></a>';
//                    
//                    default:
//                        $sel->movefirst();
//                        while (! $sel->eof)
//                        {
//                            if (Utils::convertString($h) == Utils::convertString($sel->field('Rev')))
//                            {
//                                $lien='/base/localiser?rev=' . urlencode($h);
////                                $lien='/base/localiser?ref='. $sel->field('REF') . '&rev=' . urlencode($h);
//                                return $this->link('Localiser', $lien, 'Localiser le p�riodique');
//                                break;
//                            }
//                            $sel->movenext();
//                        }
//                };
                break;

            case 'EtatCol':
                return str_replace('/', '<br />', $selection->field($name));
                break;
                
    //        default:
    //            return false;
        };
    }
    
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
        
        $value=preg_replace('~(.+)(?:(n�|n�e)[ ].+)~','$1', $value);
        
        return trim($value);
        
//        return trim(preg_replace(
//            array
//            (
//                '~(.+)(?:(n�|n�e)[ ].+)~',
//                '/[s.n.]/',
//                '/collectif/i',
//                '/collab/i',
//                '/coord/i',
//                '/dir/i',
//                '/ed/i',
//                '/ill/i',
//                '/pr�f/i',
//                '/trad/i'
//            ),
//            array
//            (
//                '$1',
//                '',
//                '',
//                '',
//                '',
//                '',
//                '',
//                '',
//                '',
//                ''
//            ),
//            $value));
    }
    
    private function link($value, $lien, $title)
    {
        return '<a href="' . Routing::linkFor($lien) . '" title="'.$title.'">'.$value.'</a>';
    }

    /**
     * G�re les erreurs
     */
    private function hasErrors()
    {global $selection;
        // Aucun param�tre de recherche n'a �t� pass�, il faut juste afficher le formulaire, ce n'est pas une erreur
        if (is_null($this->equation)) 
            return true;
        
        // Des param�tres ont �t� pass�s, mais tous sont vides et l'�quation obtenue est vide, erreur
        if ($this->equation==='')
        {
            $this->error="Vous n'avez indiqu� aucun crit�re de recherche.";
            return true;
        }
    
        // Aucune r�ponse
        $selection=openselection($this->getFilter($this->equation), true);
        if ($selection->count == 0)
        {
//          $this->error="Aucune r�ponse.\n<!-- Equation : $this->equation -->\n";
            $this->error="Aucune r�ponse. Equation : $this->equation";
            return true;
        }
        
        return false;    
    }
    
    public function actionShow()
    {
        global $selection;

//        if (User::hasAccess('AdminBase'))
//            $tpl='admin';
//        elseif (User::hasAccess('EditBase'))
        if (User::hasAccess('EditBase,AdminBase'))
            $tpl='member';  // TODO: SF : le template admin n'existe pas
        else
            $tpl='public';
       
        if ($ref=Utils::get($_REQUEST['ref']))
            $selection=openselection("ref=$ref", true);
        else
            throw new Exception('appel de show incorrect');
        
        // Charge le template
        Template::run
        (
            "templates/${tpl}_show.yaml", 
            array($this, 'chooseTplCallback'),
            'Template::selectionCallback'
        );                
    }
    
    public function actionLoad()
    {
        global $selection;
        
        if ($ref=Utils::get($_REQUEST['ref']))
        {
            // Ouvre la s�lection
            $selection=openselection("ref=$ref");
        
            // D�finit le type de document
            $type=(strtolower($selection->field('Type')) == 'th�se') ? 'm�moire' : strtolower($selection->field('Type'));
            
            // Charge le template
            Template::run
            (
                "templates/load/load_$type.yaml", 
                'Template::selectionCallback',
                'Template::emptyCallback'
            );
        }
        else
        {
            // TODO : template en fonction du type de document
            Template::run
            (
                'templates/load/load.yaml', 
                'Template::emptyCallback'
            );
        }
    }
    
    /**
     * Enregistre la notice
     */
    public function actionSave()
    {
        global $selection;
        
        // Ouvre la s�lection
        $selection=openselection('', false); 
     
        if ($ref=Utils::get($_POST['REF']))
        {
            $selection->add($ref);
            $selection->edit();
        }
        else
        {
            $selection->addnew();
        }

        // Met � jour la notice
        for ($i=2; $i <= $selection->fieldscount; $i++)
        {
            $name=$selection->fieldname($i);
            
            switch ($name)
            {
                case 'FinSaisie':
                case 'Valide':
                    $value=Utils::get($_POST[$name], false);
                    if ($value) $value=true;
                    
//                    $value=@$_POST[$name];
//                    if (! isset($value))
//                        $value=$selection->field($name);      // SF : pourquoi cela ??
//                    else
//                    {
//                        if (! $value)
//                            $value=false;
//                        else
//                            $value=true;
//                    }
                    break;
                
                case 'Creation':
                    if (! $selection->field($name)) 
                        $value=date('Ymd');
                    else
                        $value=$selection->field($name);
                    break;
                        
                case 'LastUpdate':
                    $value=date('Ymd');
                    break;
                
                default:
                    $value=Utils::get($_POST[$name], '');
                    if (is_array($value))
                    {
                        $value=array_filter($value);
                        $value=implode(SEPARATOR, $value);
                    }
                    break;
            }
            $selection->setfield($i, $value);
        }
        $selection->update();
        
        // Affiche la notice
        if (User::hasAccess('EditBase,AdminBase'))
            $tpl='member';  // TODO: SF : le template admin n'existe pas
        else
            $tpl='public';
       
        // Charge le template
        Template::run
        (
            "templates/${tpl}_show.yaml", 
            array($this, 'chooseTplCallback'),
            'Template::selectionCallback'
        );
    }

    /**
     * Supprime la notice
     */
    public function actionDelete()
    {        
        if (! $ref=Utils::get($_POST['REF']))
            throw new Exception("Aucun num�ro de r�f�rence n'a �t� indiqu�.");

        $selection=openselection("ref=$ref", false);
        
        switch ($selection->count)
        {
            case 0:
                throw new Exception("La fiche n�$ref n'existe pas.");
                return;
            
            case 1:        
                $selection->delete();
                echo 'La notice a �t� supprim�e';                
                return;
                
            default:
                throw new Exception('Erreur : plusieurs fiches ont le m�me num�ro.');
        }
    }
    
    // -------------------- Tri de la base ------------------------------
    public function actionSort()
    {
        $start_time=microtime(true);
        
        // Ouvre la s�lection
        //$selection=openselection('ref=2032 or ref=2033 or ref=2094', true);
        // TODO : ouvrir la base en mode exclusif
        $selection=openselection('*', true);
        
        // R�cup�re la cl� de tri
        $sortKey=Config::get('sortkey');
                
        // V�rrouille la base
        // TODO : Faire le lock sur la base si pas d�j� fait
        
        // Cr�e la cl� de tri
        $key=$this->createSortKey($sortKey);
        
        // Parcourt toute la s�lection en cr�ant les cl�s de tri
//        TaskManager::progress('Calcul des cl�s de tri');
//        $count=$selection->count;
//        $i=0;
        while (! $selection->eof())
        {
            $sort[$selection->field('REF')]=$this->getKey($key, $selection);
            $selection->movenext();
//            $i++;
//            TaskManager::progress($i,$count);
        }

        // Trie les cl�s
//        TaskManager::progress('Tri des cl�s');
        //asort($sort);
        arsort($sort);
        
        // Cr�e et ouvre la base r�sultat
        // Pour le moment, on part d'une base vide
        // Copie la base vide vers la base r�sultat
        // TODO : Ecrire un createdatabase
        $dbPath=Runtime::$root . 'data/db/' . DEFAULT_DB . '.bed';
        $dbSortPath=Runtime::$root . 'data/db/' . DEFAULT_DB . '.sort.bed';
        
        if (! copy(Runtime::$root . 'data/db/' . DEFAULT_DB . 'Vide.bed', $dbSortPath))
            throw new Exception("La copie de la base n'a pas r�ussi.");
        $selSort=openselection('', false, DEFAULT_DB.'.sort');
        
        // G�n�re la base tri�e
//        TaskManager::progress('G�n�ration de la base tri�e');
//        $i=0;
        
        $ref=1;
        foreach ($sort as $key=>$value)
        {
            $selection->current=$key;
            $selSort->addnew();
            $selSort->setfield(1,$ref);
            for ($i=2;$i<=$selection->fieldscount;$i++)
            {
                // On passe par une variable interm�diaire car le 2e argument de
                // setfield doit �tre pass� par r�f�rence
                $h=$selection->field($i);
                if ($h===null) $h='';
                $selSort->setfield($i, $h);
            }
            $selSort->update();
            $ref++;
            
//            $i++;
//            TaskManager::progress($i,$count);
        }
        echo '<p>tri r�alis� en '. number_format(microtime(true) - $start_time, 2, '.', '')
             . '&nbsp;secondes</p>';
        //TaskManager::progress('Tri de la base termin�.');
       
        // Ferme la base non tri�e
        unset($selection);
        
        // Ferme la base tri�e
        unset($selSort);
        
        // Supprime la base non tri�e
        if (! unlink($dbPath))
            throw new Exception('La base non tri�e n\'a pas pu �tre supprim�e.');
        
        // Renomme la base tri�e
        if (! rename($dbSortPath, $dbPath))
            throw new Exception('La base tri�e n\'a pas pu �tre renomm�e.');
        
        // D�v�rrouille la base
        // TODO : Faire un unlock sur la base
    }
    
    /**
     * Cr�e un tableau contenant les cl�s utilis�es pour le tri, � partir
     * de la cha�ne pass�e en param�tre
     * 
     * @param string $sortKey cha�ne contenant les cl�s de tri, �crites sous la
     * forme Champ1:Champ2:Champ3,Longueur de la cl� (entier),Type;Autre cl�
     * 
     * @return array tableau contenant les cl�s de tri.
     * i => fieldnames => tableau contenant les champs utilis�s pour construire la cl�
     *                    array(0=>Champ1, 1=>Champ2, 2=>Champ3)
     *      length     => longeur de la cl� de tri
     *      type       => type � utiliser pour cr�er la cl�
     */
    private function createSortKey($sortKey)
    {
        $key=array();
        
        // Ajoute le champ REF comme dernier champ de la cl�
        $sortKey.=';Ref,6,KeyInteger';
        
        // Initialise tous les champs qui composent la cl�
        $t=split(';', $sortKey);
        $i=0;
        foreach ($t as $value)
        {
            $items=split(',', trim($value));
            
            // Extrait les noms de champs
            $key[$i]['fieldnames']=split(':', trim($items[0]));
            
            // Extrait la longueur de cl�
            $key[$i]['length']=$items[1];
            
            // Extrait le type
            $key[$i]['type']=trim($items[2]);
            
            $i++;       
        }
        
        // Retourne le r�sultat
        return $key;
    }
        
    /**
     * Cr�e la cl� de l'enregistrement en cours de la s�lection $selection
     * 
     * @param array $key tableau contenant les cl�s de tri
     * @param $selection la s�lection en cours
     * 
     * @return string la cl� de l'enregistrement en cours
     * 
     */
    private function getKey($key, $selection)
    {
        $getKey='';
        for ($i=0;$i<=count($key)-1;$i++)
        {
            // R�cup�re le premier champ rempli parmi la liste de champs
            for ($j=0;$j<=count($key[$i]['fieldnames'])-1;$j++)
            {
                $value=$selection->field($key[$i]['fieldnames'][$j]);
                if (strlen($value))
                    break;
            }
            
            // R�cup�re la longueur de la cl�
            $nb=$key[$i]['length'];
            
            // Construit la cl�
            switch ($key[$i]['type'])
            {
                // Prendre le champ tel quel sur n caract�res
                case 'KeyText':
                    if (strlen($value) > $nb)
                        $value=substr($value, 0, $nb-1);
                    else
                        $value=str_pad($value, $nb, ' ');
                    break;

                // Idem mais ignorer la casse des caract�res
                case 'KeyTextIgnoreCase':
                    if (strlen($value) > $nb)
                        $value=substr($value, 0, $nb-1);
                    else
                        $value=str_pad($value, $nb, ' ');
                    $value=Utils::convertString($value, 'lower');
                    break;
            
                // Prendre le premier article tel quel et padder sur n caract�res
                case 'KeyArticle':
                    // TODO : remplacer la cha�ne du s�parateur par la variable
                    $pt=strpos($value, trim(SEPARATOR));
                    if ($pt !== false)
                        $value=trim(substr($value, 0, $pt-1)); 
                    if (strlen($value) > $nb)
                        $value=substr($value, 0, $nb-1);
                    else
                        $value=str_pad($value, $nb, ' ');
                    break;
                    
                // Idem mais ignorer la casse des caract�res
                case 'KeyArticleIgnoreCase':
                    // TODO : remplacer la cha�ne du s�parateur par la variable
                    $pt=strpos($value, trim(SEPARATOR));
                    if ($pt !== false)
                        $value=trim(substr($value, 0, $pt-1)); 
                    if (strlen($value) > $nb)
                        $value=substr($value, 0, $nb-1);
                    else
                        $value=str_pad($value, $nb, ' ');
                    $value=Utils::convertString($value, 'lower');
                    break;

                // Traiter comme un entier (padder avec des z�ros sur n caract�res)
                case 'KeyInteger':
                    $pt=strpos($value, trim(SEPARATOR));
                    if ($pt !== false)
                        $value=trim(substr($value, 0, $pt-1)); 
                    if (strlen($value) > $nb)
                        $value=substr($value, 0, $nb-1);
                    else
                        $value=str_pad($value, $nb, '0', STR_PAD_LEFT);
                    break;
            
                // Traiter comme un champ date Bdsp au format AAAAMMJJ
                case 'KeyDateBdsp':
                    $value=str_replace('/', '', $value);  // AAAA/MM/JJ -> AAAAMMJJ
                    if (strlen($value) > $nb)
                        $value=substr($value, 0, $nb-1);
                    else
                        $value=str_pad($value, $nb, ' ');                    
                    break;
                    
                default:
                    // TODO : que faire par d�faut ?
                    
            }
            $getKey.=$value;
        }
        return $getKey;
    }
    
    
}
?>