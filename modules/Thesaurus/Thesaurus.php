<?php
/**
 * Module de consultation du thesaurus Sant�Psy. 
 */
class Thesaurus extends ThesaurusModule
{
    /**
     * Importe le thesaurus Sant�Psy dans une base de donn�es.
     * 
     * Le chargement du thesaurus se fait � partir des listes hi�rarchique et
     * alphab�tique export�es depuis Cindoc.
     * 
     * 
     * @param string $alpha le nom du fichier contenant la liste alphab�tique.
     * @param string $hiera le nom du fichier contenant la liste hi�rarchique.
     */
//     * Utilise la classe {@link ThesaurusCindoc}.
    
    public function actionImportAsco($alpha='', $hiera='')
    {
        if ($alpha==='' || $hiera==='')
        {
            $files=array();
            foreach (glob(Utils::makePath(Runtime::$root, 'data', 'thesaurus', '*.*')) as $path)
            {
                $files[]=basename($path);
            }
            
            Template::run
            (
                'import.html',
                array('files'=>$files)
            );
            return;
        }
        echo '<h1>Chargement du thesaurus</h1>';
        echo '<p>Liste alphab�tique : ', $alpha, '</p>';
        echo '<p>Liste hi�rarchique : ', $hiera, '</p>';

        require_once dirname(__FILE__).'/ThesaurusCindoc.php';
        
        // Path du fichier thesaurus � importer
        $alphaPath=Utils::makePath(Runtime::$root, 'data', 'thesaurus', $alpha);
        $hierPath=Utils::makePath(Runtime::$root, 'data', 'thesaurus', $hiera);

        // Charge le fichier thesaurus
        $theso=new ThesaurusCindoc($alphaPath, $hierPath);

        // Ouvre la base
        $this->openDatabase(false);
        
        // Charge tous les termes dans la base
        $nb=0;
        foreach($theso->getTerms() as $fre=>$term)
        {
            // Cr�e une nouvelle notice
            $this->selection->addRecord();
            
            // Initialise tous les champs
            foreach($term as $rel=>$value)
                $this->selection[$rel]=$value;
            
            // Ajoute la notice dans la base
            $this->selection->saveRecord();

            // Affiche les termes
            $nb++;
            echo $nb, ' ', $fre, '<br />';
        }
        
        // Ferme le fichier thesaurus
        unset($theso);

        // Ferme la base
        unset($this->selection);
    }
    
}
?>
