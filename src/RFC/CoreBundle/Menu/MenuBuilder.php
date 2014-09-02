<?php
/*  //RF//Championship is a multi-racing game team manager that allows members to organize and follow championships.
    Copyright (C) 2014 - //Racing-France//

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.*/

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
        
        $routeName = $request->get('_route');
        
        $nav = array(
            'Select a game' => array(
                'route' => 'rfcCore_accueil'
            ));
        
        $gameNav = array(
            'Game home' => array(
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
            ),
            'Crew' => array(
                'route' => 'rfcCore_crew',
                'routeParameters' => array(
                    'gameId' => $request->get('gameId')
                )
            ),
            'Members' => array(
                'route' => 'rfcCore_members',
                'routeParameters' => array(
                    'gameId' => $request->get('gameId')
                )
            ));
        
        $userNav = array(
            'User' => array(
                'route' => 'rfcCore_user',
                'routeParameters' => array(
                    'gameId' => $request->get('gameId')
                )
            ));
        
        if ($request->get('gameId') != null) {
            $nav = array_merge($nav, $gameNav);
            };
            
        $nav = array_merge($nav, $userNav);
        
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
        
        $routeName = $request->get('_route');
        
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
            case 'rfcCore_calendar':
                $menu->addChild('Calendar', array(
                    'route' => 'rfcCore_calendar',
                    'routeParameters' => array(
                        'gameId' => $request->get('gameId')
                    )
                ));
                break;
            case 'rfcCore_crew':
                $menu->addChild('Crew', array(
                    'route' => 'rfcCore_crew',
                    'routeParameters' => array(
                        'gameId' => $request->get('gameId')
                    )
                ));
                break;
            case 'rfcCore_members':
                $menu->addChild('Members', array(
                    'route' => 'rfcCore_members',
                    'routeParameters' => array(
                        'gameId' => $request->get('gameId')
                    )
                ));
                break;
            case 'rfcCore_members_show':
                $menu->addChild('Members', array(
                    'route' => 'rfcCore_members',
                    'routeParameters' => array(
                        'gameId' => $request->get('gameId')
                    )
                ));
                break;
            case 'rfcCore_user':
                $menu->addChild('User', array(
                    'route' => 'rfcCore_user',
                    'routeParameters' => array(
                        'gameId' => $request->get('gameId')
                    )
                ));
                break;
        }
        
        return $menu;
    }
}