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
  along with this program.  If not, see <http://www.gnu.org/licenses/>. */

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
        $menu = $this->factory->createItem ( 'root' );
        $menu->setChildrenAttribute ( 'style', 'padding: 0;' );

        $routeName = $request->get ( '_route' );

        $paramsGameId = array(
            'gameId' => $request->get ( 'gameId' )
        );

        $mainNavigation = array(
            'Select a game' => array(
                'route' => 'rfcCore_accueil',
                'icon' => 'game'
        ));

        $gameNavigation = array(
            'Game home' => array(
                'route' => 'rfcCore_gameSelection',
                'routeParameters' => $paramsGameId,
                'icon' => 'home'
            ),
            'Championships' => array(
                'route' => 'rfcCore_championships',
                'routeParameters' => $paramsGameId,
                'icon' => 'trophy'
            ),
            'Calendar' => array(
                'route' => 'rfcCore_calendar',
                'routeParameters' => $paramsGameId,
                'icon' => 'calendar'
            ),
            'Crew' => array(
                'route' => 'rfcCore_crew',
                'routeParameters' => $paramsGameId,
                'icon' => 'comments'
            ),
            'Setup' => array(
                'route' => 'rfcSetup_index',
                'routeParameters' => $paramsGameId,
                'icon' => 'car'
            ),
            'Members' => array(
                'route' => 'rfcCore_members',
                'routeParameters' => $paramsGameId,
                'icon' => 'users'
        ));

        $userNavigation = ['User Panel' => ['route' => 'rfcCore_user'
        ]];

        if ($request->get ( 'gameId' ) !== null) {
            $mainNavigation = array_merge ( $mainNavigation, $gameNavigation );
        }

        $completeNavigation = array_merge ( $mainNavigation, $userNavigation );

        foreach ($completeNavigation as $name => $params) {
            $menu->addChild ( $name, $params );
            $menu[$name]->setLinkAttribute ( 'class', 'ui item' );
            if (isset ( $params['icon'] )) {
                $menu[$name]->setAttribute ( 'icon', $params['icon'] );
            }
            if (preg_match ( '/^'.$params['route'].'/', $routeName )) {
                $menu[$name]->setLinkAttribute ( 'class', 'ui item active' );
            }
        }

        return $menu;
    }

    public function createBreadcrumbMenu(Request $request)
    {
        $menu = $this->factory->createItem ( 'root' );

        $routeName = $request->get ( '_route' );

        $paramsGameId = array(
            'gameId' => $request->get ( 'gameId' )
        );

        // crée le menu en fonction de la route
        switch ($routeName) {
            case 'rfcCore_championships':
                $menu->addChild ( 'Championships',
                    array(
                    'route' => 'rfcCore_championships',
                    'routeParameters' => $paramsGameId,
                    'icon' => 'home'
                ) );
                break;
            case 'rfcCore_championships_show':
                $menu->addChild ( 'Championships',
                    array(
                    'route' => 'rfcCore_championships',
                    'routeParameters' => $paramsGameId
                ) );
                break;
            case 'rfcCore_calendar':
                $menu->addChild ( 'Calendar',
                    array(
                    'route' => 'rfcCore_calendar',
                    'routeParameters' => $paramsGameId
                ) );
                break;
            case 'rfcCore_crew':
                $menu->addChild ( 'Crew',
                    array(
                    'route' => 'rfcCore_crew',
                    'routeParameters' => $paramsGameId
                ) );
                break;
            case 'rfcCore_members':
                $menu->addChild ( 'Members',
                    array(
                    'route' => 'rfcCore_members',
                    'routeParameters' => $paramsGameId
                ) );
                break;
            case 'rfcCore_members_show':
                $menu->addChild ( 'Members',
                    array(
                    'route' => 'rfcCore_members',
                    'routeParameters' => $paramsGameId
                ) );
                break;
            case 'setup_show':
                $menu->addChild ( 'Setup',
                    array(
                    'route' => 'rfcSetup_index',
                    'routeParameters' => $paramsGameId
                ) );
                break;
            case 'rfcCore_user':
                $menu->addChild ( 'User Panel',
                    array(
                    'route' => 'rfcCore_user'
                ) );
                break;
        }

        foreach ($menu->getChildren () as $name => $params) {
            $menu[$name]->setLinkAttribute ( 'class', 'section' );
            if (isset ( $params['icon'] )) {
                $menu[$name]->setAttribute ( 'icon', $params['icon'] );
            }
            if (preg_match ( '/^'.$params['route'].'/', $routeName )) {
                $menu[$name]->setLinkAttribute ( 'class', 'active section' );
            }
        }

        return $menu;
    }
}