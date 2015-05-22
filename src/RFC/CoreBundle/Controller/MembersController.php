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

// src/RFC/CoreBundle/Controller/MembersController.php
namespace RFC\CoreBundle\Controller;

use RFC\FrameworkBundle\Controller\RFCController;

class MembersController extends RFCController
{

    public function indexAction($gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();
        $userManager = $this->get('fos_user.user_manager');
        
        $game = $entityManager->getRepository('RFCCoreBundle:Game')->findOneBy(array('id' => $gameId));
        $games = $entityManager->getRepository('RFCCoreBundle:Game')->findAll();
        $users = $userManager->findByAndOrderBy('roles', 'ASC');
        
        // Ajout du jeu sélectionné
        $menu = $this->get('rfc_core.menu.breadcrumb');
        $menu->addChild($game->getName())
            ->setUri($this->get("router")
            ->generate('rfcCore_gameSelection', array(
            'gameId' => $gameId
        )));
        $manipulator = new \Knp\Menu\Util\MenuManipulator();
        $manipulator->moveToPosition($menu->getChild($game->getName()), 0);
        
        return $this->render('RFCCoreBundle:Members:index.html.twig', array(
            'game' => $game,
            'games' => $games,
            'users' => $users
        ));
    }

    public function showAction($gameId, $userId)
    {
        $entityManager = $this->getDoctrine()->getManager();
        
        $game = $entityManager->getRepository('RFCCoreBundle:Game')->findOneBy(array('id' =>$gameId));
        $games = $entityManager->getRepository('RFCCoreBundle:Game')->findAll();
        $user = $entityManager->getRepository('RFCUserBundle:User')->findOneBy(array('id' =>$userId));
        
        // Ajout de la miette de pain
        $menu = $this->get('rfc_core.menu.breadcrumb');
        $menu->addChild($user->getUserName())
            ->setCurrent(true);
        
        return $this->render('RFCCoreBundle:Members:show.html.twig', array(
            'game' => $game,
            'games' => $games,
            'user' => $user
        ));
    }
}