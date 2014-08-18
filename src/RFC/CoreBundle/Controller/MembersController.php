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

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use RFC\CoreBundle\Entity\Game;

class MembersController extends Controller
{

    public function indexAction($gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $game = $em->getRepository('RFCCoreBundle:Game')->findOneById($gameId);
        $games = $em->getRepository('RFCCoreBundle:Game')->findAll();
        $users = $em->getRepository('RFCUserBundle:User')->findAll();
        
        return $this->render('RFCCoreBundle:Members:index.html.twig', array(
            'game' => $game,
            'games' => $games,
            'users' => $users
        ));
    }

    public function showAction($gameId, $userId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $game = $em->getRepository('RFCCoreBundle:Game')->findOneById($gameId);
        $games = $em->getRepository('RFCCoreBundle:Game')->findAll();
        $user = $em->getRepository('RFCUserBundle:User')->findOneById($userId);
        
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