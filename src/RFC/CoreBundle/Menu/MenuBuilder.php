<?php
// src/RFC/CoreBundle/Menu/MenuBuilder.php
namespace RFC\CoreBundle\Menu;

use Knp\Menu\FactoryInterface;
use Symfony\Component\HttpFoundation\Request;

class MenuBuilder
{

    private $factory;

    /**
     *
     * @param FactoryInterface $factory            
     */
    public function __construct(FactoryInterface $factory)
    {
        $this->factory = $factory;
    }

    public function createMainMenu(Request $request)
    {
        $menu = $this->factory->createItem('root');
        
        // changement de l'affichage du menu
        $menu->setChildrenAttributes(array(
            'class' => 'nav navbar-nav'
        ));
        
        $routeName = $request->get('_route');
        
        $nav = array(
            'Home' => array(
                'route' => 'rfcCore_gameSelection',
                'routeParameters' => array(
                    'gameId' => $request->get('gameId')
                )
            ),
            'Championships' => array(
                'route' => 'rfcCore_championships',
                'routeParameters' => array(
                    'gameId' => $request->get('gameId')
                )
            ),
            'Calendar' => array(
                'route' => 'rfcCore_calendar',
                'routeParameters' => array(
                    'gameId' => $request->get('gameId')
                )
            )
        );
        
        foreach ($nav as $name => $params) {
            $menu->addChild($name, $params);
            if (preg_match('/^' . $params['route'] . '/', $routeName)) {
                $menu[$name]->setAttribute('class', 'active');
            }
        }
        
        return $menu;
    }

    public function createBreadcrumbMenu(Request $request)
    {
        $menu = $this->factory->createItem('root');
        
        // changement de l'affichage du menu
        $menu->setChildrenAttributes(array(
            'class' => 'breadcrumb'
        ));
        
        $routeName = $request->get('_route');
        
        // cet item sera toujours affiché
        $menu->addChild('Home', array(
            'route' => 'rfcCore_gameSelection',
            'routeParameters' => array(
                'gameId' => $request->get('gameId')
            )
        ));
        
        // crée le menu en fonction de la route
        switch ($routeName) {
            case 'rfcCore_championships':
                $menu->addChild('Championships', array(
                    'route' => 'rfcCore_championships',
                    'routeParameters' => array(
                        'gameId' => $request->get('gameId')
                    )
                ));
                break;
            case 'rfcCore_championships_show':
                $menu->addChild('Championships', array(
                    'route' => 'rfcCore_championships',
                    'routeParameters' => array(
                        'gameId' => $request->get('gameId')
                    )
                ));
                break;
        }
        
        return $menu;
    }
}