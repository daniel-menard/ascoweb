<?php
Config::addArray
(
    array
    (
        // Param�tres du cache
        'cache'=>array
        (
            // Indique si on autorise ou non le cache (true/false)
            'enabled'   => true,
            
            // Path du r�pertoire dans lequel seront stock�s les fichiers mis
            // en cache. Il peut s'agir d'un chemin absolu (c:/temp/cache/) ou
            // d'un chemin relatif � la racine de l'application ($root)
            'path'      => 'cache'
        )
    )
);
?>
