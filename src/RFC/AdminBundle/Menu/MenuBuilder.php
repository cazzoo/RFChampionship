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

        function generateMenu($menu, $items, $current_route)
        {
            foreach ($items as $name => $params) {
                $menu->addChild($name, $params);
                if (preg_match('/^' . $params['type'] . '$/', 'Parent')) {
                    generateMenu($menu[$name], $params['sub'], $current_route);
                }
                if (preg_match('/^' . $params['route'] . '$/', $current_route)) {
                    $menu[$name]->setAttribute('class', 'active');
                }
                if (preg_match('/^' . $params['type'] . '/', 'label')) {
                    $menu[$name]->setAttribute('class', 'disabled');
                }
            }
        }
        $menu = $this->factory->createItem('root');

        $routeName = $request->get('_route');

        $paramsGameId = array(
                    'gameId' => $request->get('gameId')
                );

        $nav = array(
            'Global' => array(
                'route' => '',
                'type' => 'Parent',
                'sub' => array(
                    'Infos' => array(
                        'route' => 'RFCAdmin_index',
                        'type' => 'item'
                    ),
                    'System' => array(
                        'route' => 'admin_system',
                        'type' => 'item'
                    )
                )
            ),
            'Users' => array(
                'route' => 'admin_user',
                'type' => 'item'
            ),
            'Select a game' => array(
                'route' => 'admin_game',
                'type' => 'item'
            )
        );

        $gameNav = array(
            'Selected Game' => array(
                'route' => '',
                'type' => 'Parent',
                'sub' => array(
                    'Summary' => array(
                        'route' => 'admin_game_manage',
                        'type' => 'item',
                        'routeParameters' => $paramsGameId
                    ),
                    'Organization' => array(
                        'route' => '',
                        'type' => 'Parent',
                        'sub' => array(
                            'Championships' => array(
                                'route' => 'admin_championship',
                                'type' => 'item',
                                'routeParameters' => $paramsGameId
                            )
                        )
                    ),
                    'Data' => array(
                        'route' => '',
                        'type' => 'Parent',
                        'sub' => array(
                            'Vehicles' => array(
                                'route' => 'admin_vehicle',
                                'type' => 'item',
                                'routeParameters' => $paramsGameId
                            ),
                            'Tracks' => array(
                                'route' => 'admin_track',
                                'type' => 'item',
                                'routeParameters' => $paramsGameId
                            ),
                            'Categories' => array(
                                'route' => 'admin_category',
                                'type' => 'item',
                                'routeParameters' => $paramsGameId
                            ),
                            'Rules' => array(
                                'route' => 'admin_metaRule',
                                'type' => 'item',
                                'routeParameters' => $paramsGameId
                            ),
                            'Session types' => array(
                                'route' => 'admin_typeSession',
                                'type' => 'item',
                                'routeParameters' => $paramsGameId
                            ),
                            'Steps' => array(
                                'route' => 'setup_step_index',
                                'type' => 'item',
                                'routeParameters' => $paramsGameId
                            )
                        )
                    )
                )
            ));

        if ($request->get('gameId') != null) {
            $nav = array_merge($nav, $gameNav);
        }

        generateMenu($menu, $nav, $routeName);

        return $menu;
    }

    public function createAdminBreadcrumbMenu(Request $request)
    {
        $menu = $this->factory->createItem('root');

        $routeName = $request->get('_route');

        $paramsGameId = array(
                    'gameId' => $request->get('gameId')
                );

        // cet item sera toujours affiché
        $menu->addChild('Admin home', array(
            'route' => 'RFCAdmin_index'
        ));

        // crée le menu en fonction de la route
        switch ($routeName) {
            case 'admin_system':
            $menu->addChild('System', array(
                'route' => 'admin_system',
                'routeParameters' => $paramsGameId
            ));
            break;
            case 'admin_user':
            $menu->addChild('Users', array(
                'route' => 'admin_user',
                'routeParameters' => $paramsGameId
            ));
            break;
            case 'admin_game':
            $menu->addChild('Games', array(
                'route' => 'admin_game',
                'routeParameters' => $paramsGameId
            ));
            break;
            case 'admin_championship':
            $menu->addChild('Championships', array(
                'route' => 'admin_championship',
                'routeParameters' => $paramsGameId
            ));
            break;
            case 'admin_vehicle':
            $menu->addChild('Vehicles', array(
                'route' => 'admin_vehicle',
                'routeParameters' => $paramsGameId
            ));
            break;
            case 'admin_track':
            $menu->addChild('Tracks', array(
                'route' => 'admin_track',
                'routeParameters' => $paramsGameId
            ));
            break;
            case 'admin_category':
            $menu->addChild('Categories', array(
                'route' => 'admin_category',
                'routeParameters' => $paramsGameId
            ));
            break;
            case 'admin_metaRule':
            $menu->addChild('Rules', array(
                'route' => 'admin_metaRule',
                'routeParameters' => $paramsGameId
            ));
            break;
            case 'admin_typeSession':
            $menu->addChild('Session types', array(
                'route' => 'admin_typeSession',
                'routeParameters' => $paramsGameId
            ));
            break;
        }

        return $menu;
    }
}