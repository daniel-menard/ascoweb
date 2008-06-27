<?php
/**
 * @package     ascoweb
 * @subpackage  SpipSecurity
 * @author      Daniel M�nard <Daniel.Menard@bdsp.tm.fr>
 * @version     SVN: $Id$
 */

/**
 * Module de s�curit�.
 * 
 * Ce module g�re la connexion des utilisateurs SPIP depuis le site web 
 * d'Ascodocpsy.
 * 
 * On distingue trois types d'utilisateurs :
 * - le grand public
 * - les membres du GIP
 * - les administrateurs
 * 
 * @package     ascoweb
 * @subpackage  SpipSecurity 
 */
class SpipSecurity extends NoSecurity
{
    /**
     * Identit� de la personne connect�e
     *
     * @var string
     */
    public $ident='';
    
    /**
     * Login de la personne connect�e
     *
     * @var string
     */
    public $login='';
    
    /**
     * Email de la personne connect�e
     *
     * @var string
     */
    public $email='';
    
    public function __construct()
    {
        if ($h=Utils::get($_COOKIE['user']))
        {
        	$t=@unserialize(base64_decode($h));
            if ($t)
            {
                $this->ident=$t['ident'];
                $this->login=$t['login'];
                $this->email=$t['email'];
                $this->rights=$t['rights'];
            }
        }
    }	

    /**
     * Connecte un utilisateur identifi� � partir du site Ascodocpsy sous SPIP et
     * lui attribue des droits en fonction du statut SPIP.
     *
     * On distingue trois types d'utilisateurs :
     * - le grand public : pas de droit particulier
     * - les membres du GIP : droit "Edit" 
     * - les administrateurs : droit "Admin"
     */
    public function actionConnect()
    {
        // on attend en querystring une chaine qui est la version base64 de la s�rialisation du tableau suivant :
        // $t=array (
        //   'ident' => 'Asco1',
        //   'login' => 'asco1',
        //   'email' => 'nadine.carrasco@ch-montperrin.fr',
        //   'statut' => '6forum',
        // );
        // Version s�rialis�e du tableau :
        // a:4:{s:5:"ident";s:5:"Asco1";s:5:"login";s:5:"asco1";s:5:"email";s:32:"nadine.carrasco@ch-montperrin.fr";s:6:"statut";s:6:"6forum";}
        // Version encod�e en base 64 :
        // YTo0OntzOjU6ImlkZW50IjtzOjU6IkFzY28xIjtzOjU6ImxvZ2luIjtzOjU6ImFzY28xIjtzOjU6ImVtYWlsIjtzOjMyOiJuYWRpbmUuY2FycmFzY29AY2gtbW9udHBlcnJpbi5mciI7czo2OiJzdGF0dXQiO3M6NjoiNmZvcnVtIjt9


        // D�code et d�s�rialise la query string qu'on nous a pass�e
        $request=unserialize(base64_decode($_SERVER['QUERY_STRING']));

        // R�cup�re l'ident, le login, l'email tel quel                
        $t=array
        (
            'ident'=>Utils::get($request['ident']),
            'login'=>Utils::get($request['login']),
            'email'=>Utils::get($request['email']),
        );
        
        // D�termine les droits en fonction du statut spip
        switch(Utils::get($request['statut']))
        {
            case '6forum': // visiteur authentifi� = membre du GIP pour Ascodocpsy
                $t['rights']='Edit';
                break;
            case '0minirezo': // administrateur
                $t['rights']='Admin';
                break;
//            case '1comite': // r�dacteur, non utilis�
//                $rights='';
//                break;
            default:
                $t['rights']='';
                break;
        }
         
        // Cr�e un cookie 'user' contenant la version base64 de $t
        setcookie('user', base64_encode(serialize($t)), 0, '/');
        
        // D�termine l'url de redirection
        $url=Utils::get($request['url'], '/Base/SearchForm');
        
        Runtime::redirect($url);
    }
}

?>
