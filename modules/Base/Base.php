<?php

/**
 * Module Base - Consultation de la base documentaire
 * Transfert vers BisDatabase
 */

require_once dirname(__FILE__) . DIRECTORY_SEPARATOR. 'Cart.php';

class Base extends Database
{
    // TODO : A la place du template 'templates/error/error.yaml' mettre en place un syst�me de message d'erreur.
    
    // TODO : Faire en sorte de r�cup�rer le s�parateur d'articles (� partir
    // du .def, de la config, ...
    // S�parateur d'articles
    const SEPARATOR=' / ';
    
    private $error='';

    // Constantes et variables pour l'import de notices
    const dataPath='data/import/';
    const fileList='files.list';
    
    private $files=array();
    private $adminFiles=array();
    
    /**
     * Correspondances entre les champs des fichiers de notices
     * et les champs de la base
     */
    private $map=array();
    
    /**
     * Identifiant de la personne connect�e
     */
    private $ident;
    
    public function preExecute()
    {
        if ($this->action=='exportCart')
            $this->actionExportCart(true);

        // R�cup�re l'identifiant
        $this->ident=User::get('ident');
        
        // TODO : je ne veux pas de �a ! (le jour o� ils ajoutent un champ, faut mettre � jour le script)
        // prendre tous les champs de la base un par un et les mettre en maju, on devrait avoir la m�me chose
        $this->map=array
        (
            'ANNEXE' => 'Annexe',
            'AUT' => 'Aut',
            'CANDES' => 'CanDes',
            'COL' => 'Col',
            'CONGRDAT' => 'CongrDat',
            'CONGRLIE' => 'CongrLie',
            'CONGRNUM' => 'CongrNum',
            'CONGRTIT' => 'CongrTit',
            'DATE' => 'Date',
            'DATETEXT' => 'DateText',
            'DATEPUB' => 'DatePub',
            'DATEVALI' => 'DateVali',
            'DIPSPE' => 'DipSpe',
            'EDIT' => 'Edit',
            'ETATCOL' => 'EtatCol',
            'ISBNISSN' => 'IsbnIssn',
            'LIENANNE' => 'LienAnne',
            'LIEU' => 'Lieu',
            'LOC' => 'Loc',
            'MOTCLE' => 'MotCle',
            'NATTEXT' => 'NatText',
            'NOMP' => 'Nomp',
            'NOTES' => 'Notes',
            'NUM' => 'Num',
            'PAGE' => 'Page',
            'PDPF' => 'PdPf',
            'PRODFICH' => 'ProdFich',
            'REED' => 'Reed',
            'RESU' => 'Resu',
            'REV' => 'Rev',
            'THEME' => 'Theme',
            'TIT' => 'Tit',
            'TYPE' => 'Type',
            'LIEN' => 'Lien',
            'VIEPERIO' => 'ViePerio',
            'VOL' => 'Vol'
        );
    }
    
    
    /**
     * Lance une recherche si une �quation peut �tre construite � partir des 
     * param�tres pass�s et affiche les notices obtenues en utilisant le template 
     * indiqu� dans la cl� 'template' de la configuration.
     * Si aucun param�tre n'a �t� pass�, redirige vers le formulaire de recherche.
     * Si erreur lors de la recherche, affiche l'erreur en utilisant le template
     * indiqu� dans la cl� 'errortemplate' de la configuration. 
     */
    public function actionSearch()
    {
        global $selection;
        echo '<pre><big>',
            'login:', User::get('login'), "\n",
            'ident:', User::get('ident'), "\n",
            'email:', User::get('email'), "\n",
            'rights:', User::get('rights'), "\n",
            'toto:', User::get('toto'), "\n",
            '</big></pre>';
            
        // Construit l'�quation de recherche
        $this->equation=$this->makeBisEquation();
        
        debug && Debug::log('Equation construite : %s', $this->equation); 
        
        // Si aucun param�tre de recherche n'a �t� pass�, il faut afficher le formulaire
        // de recherche
        if (is_null($this->equation))
        {
            Runtime::redirect('searchform');
        }
        
        // Des param�tres ont �t� pass�s, mais tous sont vides et l'�quation obtenue est vide
        if ($this->equation==='')
            return $this->showError('Vous n\'avez indiqu� aucun crit�re de recherche.');
        
        // Ouvre la s�lection
        $selection=self::openDatabase($this->equation);
        if (is_null($selection)) return;
        
        // Si on n'a aucune r�ponse, erreur
        if ($selection->count == 0)
            return $this->showError("Aucune r�ponse. Equation : $this->equation");

        // Si on n'a qu'une seule r�ponse, affiche la notice compl�te
        if ($selection->count == 1)
            Runtime::redirect('show?ref='.$selection->field(1));

        // D�termine le template � utiliser
        if (! $template=$this->getTemplate('template'))
            throw new Exception('Le template � utiliser n\'a pas �t� indiqu�');
        
        // D�termine le callback � utiliser
        $callback=$this->getCallback();

        // Ex�cute le template
        Template::run
        (
            $template,  
            array($this, $callback),
            'Template::selectionCallback'
        );
    }

    public function getField($name)
    {
        global $selection;
        
        switch ($name)
        {
            case 'equation': 
                return $this->equation . '<br />eq. bis : ' . $selection->equation . '<br />R�ponses : ' . $selection->count;

            // TODO : voir si error utilis� 
            case 'error':
                return $this->error;

            case 'template':
            //case 'carttemplate':
                // Initialise le nom du template 
                if (User::hasAccess('EditBase,AdminBase')) // TODO : SF : le template admin n'existe pas
                    $tpl='member';
                else
                    $tpl='public';

                // M�me template pour les types Th�se et M�moire
                $type=(strtolower($selection->field('Type')) == 'th�se') ? 'm�moire' : strtolower($selection->field('Type'));

                // D�finit le template en fonction du nombre de r�ponses
                // TODO : probl�me pour le panier. On a show ou list suivant le nombre de notices dans le panier
                // Mettre carttemplate dans member_cart
                $tpl=($selection->count==1) ? "templates/${tpl}_show_$type.yaml" : "templates/${tpl}_list_$type.yaml";
//                if ($name=='template')
//                    $tpl=($selection->count==1) ? "templates/${tpl}_show_$type.yaml" : "templates/${tpl}_list_$type.yaml";
//                else
//                    $tpl="templates/${tpl}_list_$type.yaml";
                
                // Charge le template
                Template::run
                (
                    $tpl, 
                    array($this, 'getField'),
                    'Template::selectionCallback'
                );
                return '';

            case 'loadtemplate':
                // R�cup�re le type de document, � partir des param�tres ou � partir de la base
                if (! $type=strtolower(Utils::get($_REQUEST['Type'], ''))) $type=strtolower($selection->field('Type'));
                
                // M�me template pour les type Th�se et M�moire
                if ($type == 'th�se') $type= 'm�moire';

                Template::run
                (
                    "templates/load/load_$type.yaml", 
                    'Template::selectionCallback',
                    'Template::emptyCallback',
                    'Template::requestCallback'
                );
                return '';
                            
            case 'Tit':
                // Lien vers texte int�gral
                if (($tit=$selection->field($name)) && ($lien=$selection->field('Lien')))
                    return $this->link($tit, $lien, 'Acc�der au texte int�gral (ouverture dans une nouvelle fen�tre)', true);
                return;
            
            // TODO : revoir affichage avec le lien
//            case 'Annexe':
//                // Lien vers texte int�gral
//                if (($tit=$selection->field($name)) && ($lien=$selection->field('LienAnne')))
//                    return $this->link($tit, $lien, 'Acc�der au texte int�gral (ouverture dans une nouvelle fen�tre)', true);
//                return;
    
            case 'Aut':
                if (! $h=$selection->field($name)) return ;
                
                $t=explode(trim(self::SEPARATOR),$h);
                foreach ($t as $key=>$h)
                {
                    $h=trim($h);
                    if ($aut=$this->author($h))
                    {
                        $lien='search?aut='. urlencode('"'.$aut.'*"');
                        $h=$this->link($h, $lien, 'Bibliographie de '.$h);
                    }
                    $t[$key]=$h;
                }
                return implode(self::SEPARATOR, $t);
            
            case 'Page':
                if (! $h=$selection->field($name)) return ;
                
                if (stripos($h, 'p.') === false && stripos($h, 'pagination') === false)
                    return trim($h).' p.';
                return;
            
            case 'PageEdit':
                if (! $page=$selection->field('Page')) return;
                
                if ($selection->field('Type') == 'Rapport')
                {
                    if ($h=$selection->field('Lieu').$selection->field('Edit').$selection->field('Reed'))
                        return (stripos($page, 'p.') === false && stripos($page, 'pagination') === false) ? trim($page).' p.' : $page;
                }
                return '';    
            
            case 'PageRev':
                if (! $page=$selection->field('Page')) return;
                
                if ($selection->field('Type') == 'Rapport')
                {
                    if ($h=$selection->field('Rev').$selection->field('Vol').$selection->field('Num'))
                        return (stripos($page, 'p.') === false && stripos($page, 'pagination') === false) ? trim($page).' p.' : $page;
                }
                return '';    
                
            case 'MotCle':
            case 'Nomp':
            case 'CanDes':
            case 'Theme':
                if (! $h=$selection->field($name)) return;
    
                $t=explode(trim(self::SEPARATOR), $h);
                foreach ($t as $key=>$h)
                {
                    $h=trim($h);
                    $lien='search?motscles='. urlencode($h);
                    $h=$this->link($h, $lien, 'Notices index�es au descripteur '.$h);
                    $t[$key]=$h;
                }
                return implode(self::SEPARATOR, $t);
                
            case 'Rev':            
                if (Utils::convertString($selection->field('Type'))=='periodique' && ($lien=$selection->field('Lien')))
                {
                    // Lien vers texte int�gral sur le titre du p�riodique
                    return $this->link($selection->field($name), $lien, 'Acc�der au texte int�gral (ouverture dans une nouvelle fen�tre', true);
                }
                else
                {
                    // Lien vers une nouvelle recherche "notices de ce p�riodique"
                    if (! $h=$selection->field($name)) return ;
                    $h=trim($h);
                    $lien='search?rev='. urlencode($h);
                    return $this->link($h, $lien, 'Notices du p�riodique '.$h);
                };
            
            case 'DateText':
            case 'DatePub':
            case 'DateVali':
            case 'Creation':
            case 'LastUpdate':
                if (! isset($selection)) return;
                // Affiche les dates AAAA-MM-JJ et AAAAMMJJ sous la forme JJ/MM/AAAA
                if (! $h=$selection->field($name)) return ;
                return preg_replace('~(\d{4})[-]?(\d{2})[-]?(\d{2})~', '${3}/${2}/${1}', $h);

//            case 'Loc':
//            case 'ProdFich':
//                if (! $h=$selection->field($name)) return '';
                
            case 'Localisation': 
               if (! $h=$selection->field('Rev')) return '';
               
               // Lien vers la fiche P�riodique du titre de p�riodique contenu dans le champ Rev,
               // pour obtenir la localisation
               $lien='locate?rev='. urlencode($h);
               return '<a class="locate" href="' . Routing::linkFor($lien) . '" title="Localiser le p�riodique">&nbsp;<span>Localiser</span></a>';

            case 'EtatCol':
                return str_replace('/', '<br />', $selection->field($name));
                
            case 'ShowModifyBtn':
                if ($selection->field('FinSaisie') == false)
                {
                    
                }
            
        }
    }
    
    // TODO: apparemment, jamais utilis�
    public function getDates($name)
    {
        global $selection;
        
        switch ($name)
        {
            case 'Creation':
            case 'LastUpdate':
                if (! isset($selection) || ! $h=$selection->field($name)) return;
                // Affiche les dates AAAAMMJJ sous la forme JJ/MM/AAAA
                return preg_replace('~(\d{4})(\d{2})(\d{2})~', '${3}/${2}/${1}', $h);
            
            default:
                return;                 
        }
    }
   
    public function setField($name, &$value)
    {
        global $selection;
        
        switch ($name)
        {
            case 'FinSaisie':
                if (Utils::get($_REQUEST[$name], false)) $value=true; else $value=false;
                break;
            
            case 'Valide':
                if (User::hasAccess('EditBase'))
                {
                    // Si la notice est modifi�e par un membre du GIP, la notice repasse
                    // en statut "� valider par un administrateur"
                    $value=false;
                }
                else
                {
                    if (Utils::get($_REQUEST[$name], false)) $value=true; else $value=false;
                }
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
        }
    }
  
    public function actionNew()
    {
        // D�termine le template � utiliser
        if (! $template=$this->getTemplate('template'))
            throw new Exception('Le template � utiliser n\'a pas �t� indiqu�');
        
        // D�termine le callback � utiliser
        $callback=$this->getCallback();

        // Ex�cute le template
        Template::run
        (
            $template, 
            array($this, $callback)
        );
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
        $selection=self::openDatabase($eq);
        if (is_null($selection)) return;
        echo $eq, '   ', $selection->count;

        switch ($selection->count)
        {
            case 0:
                return $this->showError('Aucune localisation n\'est disponible pour le p�riodique '.$rev.'.');
            
            default:
                $revinit=$rev;
                $rev=Utils::convertString($rev);
                $selection->movefirst();
                while (! $selection->eof)
                {
                //echo "<li>compare [$rev] avec [" . $selection->field('Rev') . "]";
                    if ($rev == Utils::convertString($selection->field('Rev')))
                    {
                        // R�ouvre la s�lection contenant uniquement la notice du p�riodique 
                        $selection=self::openDatabase('REF='. $selection->field(1), true);
                        if (is_null($selection)) return;
                        
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
                            'Template::selectionCallback'
                        );
                        exit;
                    }
                    $selection->movenext();
                }
                return $this->showError('Aucune localisation n\'est disponible pour le p�riodique '.$revinit.'.');
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
    
    private function link($value, $lien, $title, $newwin=false)
    {
        $h=($newwin) ? ' onclick="window.open(this.href); return false;"' : '';       
        return '<a href="' . Routing::linkFor($lien) . '"' . $h . ' title="'.$title.'">'.$value.'</a>';        
    }

    // ------------------- GESTION DU PANIER -------------------
    
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
        $selection=self::openDatabase('');
        if (is_null($selection)) return;

        // Ajoute dans la s�lection toutes les notices pr�sentes dans le panier
//        if ($this->cart->count())
//            foreach ($this->cart->getItems() as $ref)
//                $selection->add($ref);

        if ($this->cart->count())
            foreach ($this->cart->getItems() as $ref)
                try
                {
                    $selection->add($ref);
                }
                catch (Exception $e)
                {
                    // Supprime la notice du panier
                    $this->cart->remove($ref);
                    $this->cart->count--;
                }
    } 
    
    public function actionShowCart()
    {
        $this->getCart();
        
        $this->selectionFromCart();
        
        if ($this->cart->count()==0)
        {
            Template::run('templates/empty_cart.yaml');
            return;
        }

        // Charge la liste des formats d'export disponibles
        Config::load($this->path. 'templates/export/formats.yaml', 'formats');
        global $formats; // pour que ce soit accessible dans le template 
        $formats=Config::get('formats');
        
        // D�finit le template d'affichage 
        if (User::hasAccess('EditBase,AdminBase')) // TODO: SF : le template admin n'existe pas
            $tpl='member';
        else
            $tpl='public';
        $tpl.='_cart.yaml';

        // Ex�cute le template
        Template::run
        (
            "templates/$tpl", 
            array($this, 'getField'),
            'Template::selectionCallback',
            array('format'=>'commun'),
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
            return $this->showError('Pour constituer votre panier, vous devez cocher les notices qui vous int�ressent.');

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
            return $this->showError('Vous devez cocher les notices � supprimer.');

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
            // TODO : le message d'erreur s'affiche en premier sur la page html
            return $this->showError('Le format d\'export n\'a pas �t� indiqu�.');

        $cmd=Utils::get($_REQUEST['cmd']);
        if (is_null($cmd))
            throw new Exception("La commande n'a pas �t� indiqu�e");
            
        if ($cmd !='export' && $cmd!='mail')
            throw new Exception("Commande incorrecte");

        if ($cmd=='mail')
        {
            $to=Utils::get($_REQUEST['to']);
            if (is_null($to))
                // TODO : le message d'erreur s'affiche en premier sur la page html
                return $this->showError('Le destinataire du mail n\'a pas �t� indiqu�.');

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
            throw new Exception('Le fichier contenant les diff�rents format n\'existe pas');

        // G�n�re l'export, en bufferisant : si on a une erreur, elle s'affiche � l'�cran, pas dans le fichier
        $this->selectionFromCart();

        ob_start();        
        Template::run
        (
            $template, 
           // array($this, 'getField'),
            'Template::selectionCallback'
        );
        $data=ob_get_clean();

        if ($cmd=='export')
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

            require_once(Runtime::$fabRoot.'lib/htmlMimeMail5/htmlMimeMail5.php');
        
            $mail = new htmlMimeMail5();
            //TODO : changer l'adresse e-mail
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
//                $this->setLayout(Config::get('layout'));
//                // Ex�cute le template
//                Template::run
//                (
//                    'templates/export/mailsent.yaml',
//                    array('to'=>$to)
//                );
                
                echo '<p>Vos notices ont �t� envoy�es � l\'adresse ', $to, '</p>';
                echo '<p>Retour � la <a href="javascript:history.back()"> page pr�c�dente</a>.</p>';
            }
            else
            {
                echo "<p>Impossible d'envoyer le mail � l'adresse '$to'</p>";
            }
            
        }
        
    }

    // ------------------- TRI DE LA BASE -------------------
    public function actionSort()
    {
        $start_time=microtime(true);
        
        $sort=array();
        
        // Ouvre la s�lection
        // TODO : ouvrir la base en mode exclusif
        $selection=self::openDatabase('*', true);
        if (is_null($selection)) return;
        
        // R�cup�re la cl� de tri
        $sortKey=Config::get('sortkey');
                
        // V�rrouille la base
        // TODO : Faire le lock sur la base si pas d�j� fait
        
        // Cr�e la cl� de tri
        $key=$this->createSortKey($sortKey);
        
        // Parcourt toute la s�lection en cr�ant les cl�s de tri
        TaskManager::progress('1. Calcul des cl�s de tri...', $selection->count);
        $i=0;
        $selection->movefirst();
        while (! $selection->eof())
        {
            $sort[$selection->field(1)]=$this->getKey($key, $selection);
            TaskManager::progress(++$i, 'Notice ' . $selection->field('REF'));
            $selection->movenext();
        }

        // Trie les cl�s
        TaskManager::progress('2. Tri des cl�s...');
        asort($sort);
        
        // Cr�e et ouvre la base r�sultat
        // Pour le moment, on part d'une base vide
        // Copie la base vide vers la base r�sultat
        // TODO : Ecrire un createdatabase
        $database=Config::get('database');
        $dbPath=Runtime::$root . "data/db/$database.bed";
        $dbSortPath=Runtime::$root . "data/db/$database.sort";
        
        TaskManager::progress('3. Cr�ation de la base vide...');
        if (! copy(Runtime::$root . "data/db/${database}Vide.bed", $dbSortPath))
            throw new Exception('La copie de la base n\'a pas r�ussi.');       
        $selSort=self::openDatabase('', false, $database.'sort');
        if (is_null($selSort)) return;
        
        // G�n�re la base tri�e
        TaskManager::progress('4. R��criture des enregistrements selon l\'ordre de tri...', count($sort));
        
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
            
            TaskManager::progress($ref, "Notice $ref");
        }
        echo '<p>tri r�alis� en '. number_format(microtime(true) - $start_time, 2, '.', '')
             . '&nbsp;secondes</p>';
        //TaskManager::progress('Tri de la base termin�.');
       
        TaskManager::progress('5. Fermeture et flush des bases...');

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
        TaskManager::progress('Termin�');
        
        // TODO : Faire en sorte d'avoir un lien http://xxx
        //echo '<a href="'.Routing::linkFor('/base/search').'">Interroger la nouvelle base...</a>';
    }
    
    /**
     * Cr�e un tableau contenant les cl�s utilis�es pour le tri, � partir
     * de la cha�ne pass�e en param�tre
     * 
     * @param string $sortKey cha�ne contenant les cl�s de tri, �crites sous la
     * forme Champ1:Champ2:Champ3,Longueur de la cl� (entier),Type,Ordre de tri (+ ou -);Autre cl�
     * 
     * @return array tableau contenant les cl�s de tri.
     * i => fieldnames => tableau contenant les champs utilis�s pour construire la cl�
     *                    array(0=>Champ1, 1=>Champ2, 2=>Champ3)
     *      length     => longeur de la cl� de tri
     *      type       => type � utiliser pour cr�er la cl�
     *      order      => ordre du tri : ascendant (+) ou descendant (-)
     */
    private function createSortKey($sortKey)
    {
        $keys=array();
        
        // Ajoute le champ REF comme dernier champ de la cl�
        $sortKey.=';Ref,6,KeyInteger,+';
        
        // Initialise tous les champs qui composent la cl�
        $t=split(';', $sortKey);
        foreach ($t as $key=>$value)
        {
            $items=split(',', trim($value));
            
            // Extrait les noms de champs
            $keys[$key]['fieldnames']=split(':', trim($items[0]));
            
            // Extrait la longueur de cl�
            $keys[$key]['length']=trim($items[1]);
            
            // Extrait le type
            $keys[$key]['type']=trim($items[2]);
            
            // Extrait l'ordre de tri
            $keys[$key]['order']=trim($items[3]);
        }
        
        // Retourne le r�sultat
        return $keys;
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
                    $pt=strpos($value, trim(self::SEPARATOR));
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
                    $pt=strpos($value, trim(self::SEPARATOR));
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
                    $pt=strpos($value, trim(self::SEPARATOR));
                    if ($pt !== false)
                        $value=trim(substr($value, 0, $pt-1)); 
                    if (strlen($value) > $nb)
                        $value=substr($value, 0, $nb-1);
                    else
                        $value=str_pad($value, $nb, '0', STR_PAD_LEFT);
                    break;
            
                // Traiter comme un champ date au format AAAAMMJJ
                case 'KeyDate':
                    $value=strtr($value, '/-', '');      // AAAA/MM/JJ et AAAA-MM-JJ -> AAAAMMJJ
                    if (strlen($value) > $nb)
                        $value=substr($value, 0, $nb-1);
                    else
                        $value=str_pad($value, $nb, ' ');                    
                    break;
                    
                default:
                    throw new Exception('Le type du champ n\'a pas �t� pr�cis�.');
                    break;
                    // TODO : que faire par d�faut ?
            }
            
            // Si tri descendant, commute la cl�
            if ($key[$i]['order']=='-')
                $this->switchKey($value);

            $getKey.=$value;
        }
        return $getKey;
    }

    private function switchKey(&$value)
    {
        if (! $value) return '';
        
        $value=str_split($value);
        foreach($value as $key=>$char)
            $value[$key]=chr(255-ord($char));
        $value=implode('',$value);
    }
    
    // ------------------- IMPORT DE NOTICES -------------------
         
    // affiche la liste des fichiers � importer
    public function actionImport()
    {
        // TODO : Am�liorer le module d'import :
        // - Permettre de choisir les fichiers � importer (case � cocher)
        // - Avoir une case � cocher "Marquer les notices comme valid�es"
        // - Avoir une case � cocher "Lancer le tri apr�s l'import"
        // - Avoir la possibilit� de lancer un tri � tout moment
        
        global $files, $error;
        
        $error='';
        
        // Importe les fichiers et trie la base
        if (! is_null(Utils::get($_REQUEST['import'])))
        {
            // V�rifie qu'il y a des fichiers � importer
            if (count($this->makeList())==0)
            {
                $error .= '<li>Il n\'y a aucun fichier � importer.</li>';
                Template::run('templates/import/import.yaml','Template::varCallback');
                return;
            }
            
            // V�rifie que le gestionnaire de t�che est d�marr�
            if (! TaskManager::isRunning())
                throw new Exception('Le gestionnaire de t�ches n\'est pas d�marr�.');

            // D�finit le moment du lancement de l'import : maintenant ou plus tard
            $timeImport=Utils::get($_REQUEST['now']);
            if (is_null($timeImport))
                throw new Exception('Le moment du lancement de l\'import n\'a pas �t� d�fini.');

            switch ($timeImport)
            {
                case 0: // plus tard
                    // R�cup�re la date et l'heure de lancement
                    // TODO : V�rifier que $datetime est dans le format attendu
                    $datetime = Utils::get($_REQUEST['delay'], '');
                    if (strlen(trim($datetime))==0)
                        throw new Exception('La date et l\'heure du lancement de l\'import n\'ont pas �t� indiqu�es.');
                    list($day, $month, $year, $hour, $minutes, $seconds) = split('[/: ]', $datetime);
                    
                    //checkdate
                    //^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/20[0-9]{2}[ ]([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$
                    
                    // Calcul le timestamp
                    $timestamp=mktime($hour, $minutes, $seconds, $month, $day, $year);
                    
                    $id=TaskManager::addTask('/base/importfiles', $timestamp, null, 'Import des fichiers de notices');
                    Runtime::redirect('/taskmanager/');
                    break;
                    
                case 1: // maintenant
                    $id=TaskManager::addTask('/base/importfiles', 0, null, 'Import des fichiers de notices');
                    break;
                
                default:
                    throw new Exception('Choix non valide pour d�finir le moment du lancement de l\'import');
            }
            
            Runtime::redirect('/taskmanager/taskstatus?id='.$id);
            return;
        }
        
        // Charge la liste des fichiers � importer
        // Les administrateurs voient tous les fichiers
        // Chaque membre voit uniquement ses propres fichiers
        $dir=Runtime::$root . self::dataPath . $this->ident;
        $path=$dir . '/' . self::fileList;

        if (file_exists($path))
        {
            $this->files=unserialize(file_get_contents($path));
        }
        else
        {
            // Cr�e le r�pertoire de stockage des fichiers (un r�pertoire par identifiant)
            if (! is_dir($dir)) Utils::makeDirectory($dir);
            $this->files=array();
        }
        
        // On a des fichiers upload�s -> ajoute � la liste
        if (count($_FILES)!=0)
            $this->upload();

        // Enregistre la liste
        file_put_contents(Runtime::$root . self::dataPath . $this->ident . '/' . self::fileList, serialize($this->files));

        // Initialise $files avec la liste compl�te des fichiers, pour affichage
        // Pour les administrateurs, $files contient l'ensemble des fichiers charg�s sur le serveur
        $files=$this->makeList(); // HACK: les templates ne savent looper que sur des globaux
        if (User::hasAccess('AdminBase')) $this->adminFiles=$files;
        
        // Supprime un fichier de la liste et enregistre la liste
        // Pour les administrateurs :
        // Pour les membres : appell� avec delete=i -> supprime de la liste le i�me fichier 
        $delete=Utils::get($_REQUEST['delete']);
        if (! is_null($delete))
            $this->delete($delete);
        
        // Initialise � nouveau $files avec la liste compl�te des fichiers, pour affichage
        $files=$this->makeList(); // HACK: les templates ne savent looper que sur des globaux
        if (User::hasAccess('AdminBase')) $this->adminFiles=$files;

        // Affiche la liste et le reste
        // Si administrateur, affiche l'ensemble des listes
        Template::run('templates/import/import.yaml','Template::varCallback');
    }
    
    /**
     * R�cup�re les fichiers charg�s upload�s
     * 
     */
    private function upload()
    {
        global $error;
        
        foreach($_FILES as $file)
        {
            switch($file['error'])
            {
                case UPLOAD_ERR_OK:
                    //$path=Runtime::$root . self::dataPath . $file['name'];
                    $path=Runtime::$root . self::dataPath . $this->ident . '/' . $file['name'];
                    if ($this->isValid($file['tmp_name'])== false)
                    {
                        $error .= "<li>Le fichier '" . $file['name'] . "' n'est pas valide.</li>";
                    }
                    else
                    {
                        if (move_uploaded_file($file['tmp_name'], $path)==false)
                            $error .= "<li>Impossible d'enregistrer le fichier '" . $file['name'] . "'.</li>";
                        else
                        {
                            $index=count($this->files);
                            $this->files[$index]=array
                            (
                                'index'=>$index,
                                'ident'=>$this->ident,
                                'name'=>$file['name'],
                                'path'=>$path, 
                                'size'=>$file['size'], 
                                'time'=>date('d/m/Y H:i:s')
                            );
                        }
                    }
                    break;
                case UPLOAD_ERR_INI_SIZE:
                    $error .= "<li>Impossible de charger le fichier '" . $file['name'] . "' : la taille d�passe le maximum indiqu� par upload_max_filesize.</li>";
                    break;
                case UPLOAD_ERR_FORM_SIZE:
                    $error .= "<li>Impossible de charger le fichier '" . $file['name'] . "' : la taille d�passe la valeur MAX_FILE_SIZE du formulaire.</li>";
                    break;
                case UPLOAD_ERR_PARTIAL:
                    $error .= "<li>Impossible de charger le fichier '" . $file['name'] . "' : le fichier n'a �t� que partiellement t�l�charg�.</li>";
                    break;
                case UPLOAD_ERR_NO_FILE: // le input file est vide
                    break;
                case UPLOAD_ERR_NO_TMP_DIR:                    
                    $error .= "<li>Impossible de charger le fichier '" . $file['name'] . "' : erreur de configuration, un dossier temporaire est manquant.</li>";
                    break;
                case UPLOAD_ERR_CANT_WRITE:                    
                    $error .= "<li>Impossible de charger le fichier '" . $file['name'] . "' : �chec de l'�criture du fichier sur le disque.</li>";
                    break;
                default:
                    $error .= "<li>Impossible de charger le fichier '" . $file['name'] . "' : erreur non g�r�e : '".$file['error']."'.</li>";
            } 
        }
    }
    
    /**
     * Supprime un fichier de la liste
     */
    private function delete($index)
    {
        if (User::hasAccess('AdminBase,cli'))
            $list=$this->adminFiles;
        else
            $list=$this->files;
        
        // R�cup�re l'ident du membre qui a charg� le fichier
        $ident=$list[$index]['ident'];

        // R�cup�re la liste de l'ident
        $files=unserialize(file_get_contents(Runtime::$root . self::dataPath . $ident . '/' . self::fileList));
    
        // Supprime le fichier du r�pertoire
        unlink ($list[$index]['path']);

        // Supprime le fichier de la liste et renum�rote la liste
        unset($files[$list[$index]['index']]);
        $files=array_values($files);
        foreach($files as $index=>&$value)
            $value['index']=$index;
        
        // Enregistre la liste
        file_put_contents(Runtime::$root . self::dataPath . $ident . '/' . self::fileList, serialize($files));
        
        // Initialise les listes de fichiers (pour membres et administrateurs)
        $this->files=$files;
        $this->adminFiles=$this->makeList();
    }

    /**
     * Construit la liste des fichiers charg�s, � afficher
     */
    private function makeList()
    {
        if (User::hasAccess('AdminBase,cli'))
        {
            $files=array();
            $dirImport=Runtime::$root . self::dataPath;
            $dirs=scandir($dirImport);
            foreach ($dirs as $key=>$value)
            {
                if ($value!='.' && $value!='..')
                {
                    $path=$dirImport . $value. '/' .self::fileList;
                    if (is_dir($dirImport . $value))
                    {
                        if (file_exists($path))                          
                            $files=array_merge($files, unserialize(file_get_contents($path)));
                    }
                }
            }
        }
        else
        {
            $files=$this->files;
        }
        
        return $files;
    }
    
    /**
     * Importe les fichiers
     */
    public function actionImportFiles()
    {
        global $files;
        
        // Verrouille la base
        // TODO : V�rouiller la base
        
        $files=$this->adminFiles=$this->makeList();

        // 1. Ajout des notices
        
        // Ouvre la s�lection
        $selection=self::openDatabase('*', false);
        if (is_null($selection)) return;

        // Initialise le compteur de fichiers
        $nb=1;
        
        // Initialise le nombre total de notices
        $nbreftotal=0;
        
        // Parcourt la liste des fichiers
        foreach ($files as $key=>$file)
        {
            TaskManager::progress($nb.'. Import du fichier ' . $file['name'], filesize($file['path']));
           
            // Ouvre le fichier
            $f=fopen($file['path'],'r');
            if ($f === false)
                throw new Exception('Impossible d\'ouvrir le fichier '. $file['name']);
            
            // Lit la premi�re ligne et r�cup�re le nom des champs
            $fields=fgetcsv($f, 0, "\t", '"');
            
            // Compte le nombre de champs
            $nbFields=count($fields);

            // Lit le fichier et met � jour la base
            $nbref=0;
            while (($data=fgetcsv($f, 0, "\t", '"')) !== false)
            {
                // Ignore les lignes vides
                $h=array_filter($data);
                if (count($h)==0) continue;

                // Initialise le nombre de champ de la notice
                $nbRefFields=0;
                
                Taskmanager::progress(ftell($f));
                usleep(200);

                // Ajoute la notice
                $selection->addnew();
                
                foreach ($data as $i=>$v)
                {
                    // Ignore les tabulations situ�es apr�s le dernier champ
                    $nbRefFields++;
                    if ($nbRefFields>$nbFields) break;
                    
                    $fieldname=$this->map[trim($fields[$i])];
                    $v=trim(str_replace('""', '"', $v));
                    
                    // TODO : traitement pour textes officiels � supprimer
                    // Traitement pour les textes officiels
                    if ($fieldname=='LienAnne') continue;
                    
                    // Transformation des dates DATETEXT et DATEPUB de JJ/MM/AAAA en AAAA-MM-JJ
                    if ($fieldname == 'DateText' || $fieldname == 'DatePub')
                        $v=preg_replace('~(\d{2})/(\d{2})/(\d{4})~', '${3}-${2}-${1}', $v);
                    
                    // Concat�nation des champs Annexe et LienAnne
                    // Annexe1 <url1>/Annexe2 <url2>
                    if ($fieldname=='Annexe')
                    {
                        $lienAnne=$data[array_search('LIENANNE', $fields)];
                        if ($lienAnne)
                            $v.=($v) ? ' <'.$lienAnne.'>' : '<'.$lienAnne.'>';

                    }

                    $selection->setfield($fieldname, $v);
                }
                                
                // Initialise les champs Creation et LastUpdate
                // On passe par une variable interm�diaire car le 2e arguement de setfield
                // doit �tre pass� par r�f�rence
                $d=date('Ymd');
                $selection->setfield('Creation', $d);
                $selection->setfield('LastUpdate', $d);
                
                // Initialise les champs FinSaisie et Valide
                // On passe par des variables interm�diaires car le 2e arguement de setfield
                // doit �tre pass� par r�f�rence
                $v=true;
                $selection->setfield('FinSaisie', $v);
                // TODO : remettre $v=false;
                //$v=false;
                $v=true;
                $selection->setfield('Valide', $v);
                
                $selection->update();

                $nbref++;
            }
            
            TaskManager::progress('Fichier ' . $file['name'].' : '.$nbref.' notices int�gr�es');
            
            // Ferme le fichier
            fclose($f);

            // Supprime le fichier de la liste et enregistre la liste
            $this->delete($key);
            
            $files=$this->adminFiles=$this->makeList();
            
            // Met � jour les compteurs
            $nb++;
            $nbreftotal=$nbreftotal+$nbref;
        }
        
        // Ferme la base
        unset($selection);

        // 2. Tri de la base
        TaskManager::progress('Chargement termin� : '. $nbreftotal.' notices int�gr�es dans la base, d�marrage du tri');

        Routing::dispatch('/base/sort'); // TODO : workaround       
        
//        $id=TaskManager::addTask('/base/sort', 0, null, 'Tri de la base');
////        Runtime::redirect('/taskmanager/taskstatus?id='.$id);
//        echo "Lancement d'une t�che pour trier la base obtenue...<br />";
//        echo '<a href="?id='.$id.'">Voir le tri</a>';
//
//        // D�v�rouille la base
//        // TODO : D�v�rouiller la base si pas d�j� fait
          TaskManager::progress('Import termin�');
    }
    
    /**
     * V�rifie que le fichier charg� est valide :
     *  - fichier non vide
     *  - fichier tabul�
     *  - la premi�re ligne contient uniquement des noms de champs
     *  - chaque ligne contient autant de tabulations que la 1�re ligne
     */
    private function isValid($path)
    {
        // V�rifie que le fichier n'est pas vide
        if (filesize($path) == 0)
            return false;
        
        // Ouvre le fichier
        $f=fopen($path,'r');

        // V�rifie que c'est un fichier tabul�
        $fields=fgetcsv($f, 0, "\t", '"');
        if (! is_array($fields) || count($fields) < 2)
            return false;
        
        // V�rifie que la premi�re ligne contient les noms de champs
        $fields=array_flip($fields);
        if (count(array_diff_key($fields, $this->map)) > 0)
            return false;
        
        return true; 
    } 
}
?>