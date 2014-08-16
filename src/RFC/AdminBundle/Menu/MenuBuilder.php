<?php
/*
 * //RF//Championship is a multi-racing game team manager that allows members to organize and follow championships.
 * Copyright (C) 2014 - //Racing-France//
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

// src/RFC/AdminBundle/Menu/MenuBuilder.php
namespace RFC\AdminBundle\Menu;

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

    public function createAdminMenu(Request $request)
    {
        $menu = $this->factory->createItem('root');
        
        // changement de l'affichage du menu
        $menu->setChildrenAttributes(array(
            'class' => 'nav nav-pills nav-stacked'
        ));
        
        $routeName = $request->get('_route');
        
        $nav = array(
            'Global' => array(
                'route' => '',
                'type' => 'label'
            ),
            'System' => array(
                'route' => 'admin_system',
                'type' => 'item'
            ),
            'Users' => array(
                'route' => 'admin_user',
                'type' => 'item'
            ),
            'Games' => array(
                'route' => 'admin_game',
                'type' => 'item'
            )
        );
        
        if ($request->get('gameId') != null) {
            $nav['Organization'] = array(
                'route' => '',
                'type' => 'item'
            );
            $nav['Championships'] = array(
                'route' => 'admin_championship',
                'type' => 'item',
                'routeParameters' => array(
                    'gameId' => $request->get('gameId')
                )
            );
            $nav['Data'] = array(
                'route' => '',
                'type' => 'label'
            );
            $nav['Vehicles'] = array(
                'route' => 'admin_vehicle',
                'type' => 'item',
                'routeParameters' => array(
                    'gameId' => $request->get('gameId')
                )
            );
            $nav['Tracks'] = array(
                'route' => 'admin_track',
                'type' => 'item',
                'routeParameters' => array(
                    'gameId' => $request->get('gameId')
                )
            );
            $nav['Categories'] = array(
                'route' => 'admin_category',
                'type' => 'item',
                'routeParameters' => array(
                    'gameId' => $request->get('gameId')
                )
            );
            $nav['Rules'] = array(
                'route' => 'admin_metaRule',
                'type' => 'item',
                'routeParameters' => array(
                    'gameId' => $request->get('gameId')
                )
            );
            $nav['Session types'] = array(
                'route' => 'admin_typeSession',
                'type' => 'item',
                'routeParameters' => array(
                    'gameId' => $request->get('gameId')
                )
            );
        }
        
        foreach ($nav as $name => $params) {
            $menu->addChild($name, $params);
            if (preg_match('/^' . $params['route'] . '/', $routeName)) {
                $menu[$name]->setAttribute('class', 'active');
            } else 
                if (preg_match('/^' . $params['type'] . '/', 'label')) {
                    $menu[$name]->setAttribute('class', 'disabled');
                }
        }
        
        return $menu;
    }

    public function createAdminBreadcrumbMenu(Request $request)
    {
        $menu = $this->factory->createItem('root');
        
        // changement de l'affichage du menu
        $menu->setChildrenAttributes(array(
            'class' => 'breadcrumb'
        ));
        
        $routeName = $request->get('_route');
        
        // cet item sera toujours affiché
        $menu->addChild('Admin home', array(
            'route' => 'rfcCore_gameSelection',
            'routeParameters' => array(
                'gameId' => $request->get('gameId')
            )
        ));
        
        // crée le menu en fonction de la route
        switch ($routeName) {
            case 'rfcCore_members':
                $menu->addChild('Members', array(
                    'route' => 'rfcCore_members',
                    'routeParameters' => array(
                        'gameId' => $request->get('gameId')
                    )
                ));
                break;
        }
        
        return $menu;
    }
}