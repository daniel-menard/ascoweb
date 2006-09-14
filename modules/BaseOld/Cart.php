<?php
/**
 * Panier
 */

class Cart
{
    /**
     * @var string Nombre maximum d'items autoris�s dans le panier
     * @access public
     */
    public $maxCount=10000;
    
    /**
     * @var array Tableau contenant les items du panier
     * @access private
     */
    private $items;
    
    /**
     * @var boolean Indique si le panier contient des items ou uniquement des
     * cl�s.
     */
    private $hasValues=false;
    
    /**
     * Constructeur. Cr�e (et charge s'il existe d�j�) le panier indiqu�.
     * Le panier sera automatiquement enregistr� � la fin de la requ�te en
     * cours.
     * 
     * @param string $name le nom du panier
     */
    public function __construct($name)
    {
        // Cr�e le panier s'il n'existe pas d�j� dans la session
        if (!isset($_SESSION[$name])) 
            $_SESSION[$name]=array();
        
        // Cr�e une r�f�rence entre notre tableau item et le tableau stock� 
        // en session pour que le tableau de la session soit automatiquement modifi�
        // et enregistr� 
        $this->items =& $_SESSION[$name];
    }

    /**
     * Ajoute un item dans le panier. Si un item ayant la m�me cl� figurait d�j�
     * dans le panier, il est �cras�.
     * 
     * @param mixed $key la cl� de l'item � ajouter
     * @param mixed $item optionnel : les donn�es � associer � la cl�. Si votre
     * panier contient de l'information structur�e, vous passerez en g�n�ral un
     * tableau associatif. Si votre panier contient des �l�ments simples (par
     * exemple une liste de notices pertinentes), vous passerez uniquement
     * le champ REF comme param�tre $key.
     */
    public function add($key, $item=null)
    {
        if ($this->count() > $this->maxCount)
            throw new Exception("Le panier est plein, impossible d'ajouter qq chose");
            
        if (is_int($key) || ctype_digit($key)) $key=(int)$key;
        if ($item)
        {
            $this->items[$key]=$item;
            $this->hasValues=true;
        }
        else
        {
            if (is_array($key))
            {
                foreach ($key as $value)
                {
                    if (is_int($value) || ctype_digit($value)) $value=(int)$value;
                    $this->items[$value]=$value;
                }
            }
            else
            {
                $this->items[$key]=$key;
            }
        }
        //$this->dump();
    }
    
    /**
     * Supprime du panier l'�l�ment dont la cl� est pass�e en param�tre.
     * remarque : Aucune erreur n'est g�n�r�e si l'item ne figurait pas dans le
     * panier
     * @param mixed $key
     */
    public function remove($key)
    {
        if (is_int($key) || ctype_digit($key)) $key=(int)$key;
        unset($this->items[$key]);
    }
    
    /**
     * Vide le panier
     */
    public function clear()
    {
        $this->items=null;
    }
    
    /** 
     * Retourne le nombre d'�l�ments d'items dans le panier
     */
    public function count()
    {
        return count($this->items);
    }
    
    /**
     * Retourne un tableau contenant tous les items pr�sents dans le panier.
     * @return array
     */
    public function & getItems()
    {
        return $this->items;
    }
    
//    /**
//     * Si le tableau ne contient que des cl�s, optimize un peu le tableau pour
//     * ne s�rialiser que les cl�s.
//     */
//    public function __sleep()
//    {
//    	if (! $this->hasValues)
//            $this->items=implode('/',array_keys($this->items));
//        return array('items');
//    }

//    /**
//     * Si seules les cl�s du tableau ont �t� enregistr�es, restaure le tableau
//     * sous la forme attendue par les autres m�thodes (cl�=valeur)
//     */
//    public function __wakeup()
//    {
//        if (! $this->hasValues)
//        {
//        	$t=explode('/',$this->items);
//            $this->items=array_combine($t,$t);
//        }
//    }
    
//    public function dump()
//    {
//        
//        echo'<h2>Etat du panier</h2><pre>';
//        var_dump($this);
//        echo'</pre>';
//    }
}

?>