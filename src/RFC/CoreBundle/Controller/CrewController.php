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

// src/RFC/CoreBundle/Controller/CrewController.php

namespace RFC\CoreBundle\Controller;

use Exception;
use RFC\CoreBundle\Entity\Crew;
use RFC\CoreBundle\Entity\CrewRequest;
use RFC\FrameworkBundle\Controller\RFCController;
use Symfony\Component\HttpFoundation\JsonResponse;

class CrewController extends RFCController
{

    public function indexAction($gameId)
    {
        $entityManager = $this->getDoctrine ()->getManager ();
        $user          = $this->container->get ( 'security.context' )->getToken ()->getUser ();

        $game  = $entityManager->getRepository ( 'RFCCoreBundle:Game' )->findOneBy ( array(
            'id' => $gameId) );
        $games = $entityManager->getRepository ( 'RFCCoreBundle:Game' )->findAll ();
        $users = $entityManager->getRepository ( 'RFCUserBundle:User' )->findAll ();
        $crews = $entityManager->getRepository ( 'RFCCoreBundle:Crew' )->findBy ( array(
            'game' => $gameId
            ) );

        $crew = null;

        // User is logged
        if ($this->container->get ( 'security.context' )->isGranted ( 'IS_AUTHENTICATED_FULLY' )) {
            foreach ($crews as $cur_crew) {
                if ($cur_crew->isManager ( $user->getId () ) || $cur_crew->isActiveMember ( $user->getId () )
                    || $cur_crew->isAwaitingMember ( $user->getId () )) {
                    $crew = $cur_crew;
                }
            }
        }

        // Ajout du jeu sélectionné
        if (null != $game) {
            $menu        = $this->get ( 'rfc_core.menu.breadcrumb' );
            $menu->addChild ( $game->getName () )->setUri ( $this->get ( "router" )->generate ( 'rfcCore_gameSelection',
                    array(
                    'gameId' => $gameId
            ) ) );
            $manipulator = new \Knp\Menu\Util\MenuManipulator ();
            $manipulator->moveToPosition ( $menu->getChild ( $game->getName () ),
                0 );
        }

        return $this->render ( 'RFCCoreBundle:Crew:index.html.twig',
                array(
                'game' => $game,
                'games' => $games,
                'users' => $users,
                'crew' => $crew
            ) );
    }

    public function crewApplicationAction()
    {
        $params  = array();
        $content = $this->get ( "request" )->getContent ();
        if (!empty ( $content )) {
            $params = json_decode ( $content, true ); // 2nd param to get as array
        }

        $entityManager = $this->getDoctrine ()->getManager ();
        $requester     = $entityManager->getRepository ( 'RFCUserBundle:User' )->findOneBy ( array(
            'id' => $params ['requesterId']) );
        $crew          = $entityManager->getRepository ( 'RFCCoreBundle:Crew' )->findOneBy ( array(
            'game' => $params ['gameId'],
            'manager' => $params ['managerId']
            ) );

        // Create crew if none exists for this game and manager
        if ($crew === null) {
            $game    = $entityManager->getRepository ( 'RFCCoreBundle:Game' )->findOneBy ( array(
                'id' => $params ['gameId']) );
            $manager = $entityManager->getRepository ( 'RFCUserBundle:User' )->findOneBy ( array(
                'id' => $params ['managerId']) );
            $crew    = new Crew ();
            $crew->setGame ( $game );
            $crew->setManager ( $manager );
            $entityManager->persist ( $crew );
        }

        $request = new CrewRequest ();
        $request->setRequester ( $requester );
        $request->setCrew ( $crew );
        $request->setState ( 1 );
        $entityManager->persist ( $request );

        try {
            $entityManager->flush ();
            $jsonResponse = new JsonResponse ( $request, 200 );
        } catch (Exception $e) {
            $jsonResponse = new JsonResponse ( $request, 400 );
        }

        return $jsonResponse;
    }

    public function crewRetirementAction()
    {
        $params  = array();
        $content = $this->get ( "request" )->getContent ();
        if (!empty ( $content )) {
            $params = json_decode ( $content, true ); // 2nd param to get as array
        }

        $entityManager = $this->getDoctrine ()->getManager ();

        $crewRequest = $entityManager->getRepository ( 'RFCCoreBundle:CrewRequest' )->findOneBy ( array(
            'id' => $params ['crewRequestId']) );

        $crewRequest->setState ( 4 );

        try {
            $entityManager->flush ();
            $jsonResponse = new JsonResponse ( $crewRequest, 200 );
        } catch (Exception $e) {
            $jsonResponse = new JsonResponse ( $crewRequest, 400 );
        }

        return $jsonResponse;
    }

    public function crewAcceptAction()
    {
        $params  = array();
        $content = $this->get ( "request" )->getContent ();
        if (!empty ( $content )) {
            $params = json_decode ( $content, true ); // 2nd param to get as array
        }

        $entityManager = $this->getDoctrine ()->getManager ();

        $crewRequest = $entityManager->getRepository ( 'RFCCoreBundle:CrewRequest' )->findOneBy ( array(
            'id' => $params ['crewRequestId']) );

        $crewRequest->setState ( 2 );

        try {
            $entityManager->flush ();
            $jsonResponse = new JsonResponse ( $crewRequest, 200 );
        } catch (Exception $e) {
            $jsonResponse = new JsonResponse ( $crewRequest, 400 );
        }

        return $jsonResponse;
    }
}