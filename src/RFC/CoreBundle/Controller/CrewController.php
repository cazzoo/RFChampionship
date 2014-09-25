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

// src/RFC/CoreBundle/Controller/CrewController.php
namespace RFC\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use RFC\CoreBundle\Entity\Game;
use RFC\CoreBundle\Entity\CrewRequest;
use RFC\UserBundle\Entity\User;

class CrewController extends Controller
{

    public function indexAction($gameId)
    {
        $em = $this->getDoctrine()->getManager();
        $user = $this->container->get ( 'security.context' )->getToken ()->getUser ();

        $game = $em->getRepository('RFCCoreBundle:Game')->findOneById($gameId);
        $games = $em->getRepository('RFCCoreBundle:Game')->findAll();
        $users = $em->getRepository('RFCUserBundle:User')->findAll();
        $crewRequests = $em->getRepository('RFCCoreBundle:CrewRequest')->findBy(array('game' => $game->getId());

        $crew = null;
        $crewMembers = array();
        $awaitingMembers = array();

        if($user != 'anon.')
        {
            foreach($crewRequests as $crewRequest)
            {
                array_push($crewMembers, $crewRequest->getRequester());
            }
        }
            $crewRequests = $em->getRepository ( 'RFCCoreBundle:CrewRequest' )->findBy ( array (
                'requester' => $user->getId (),
                'game' => $gameId,
                'state' => '2'
            ));

        if(count($awaitingRequests) > 0)
        {   
            foreach($awaitingRequests as $awaitingRequest)
            {
                array_push($awaitingMembers, $awaitingRequest->getRequester());
            }
        }

        // Ajout du jeu sélectionné
        $menu = $this->get('rfc_core.menu.breadcrumb');
        $menu->addChild($game->getName())
            ->setUri($this->get("router")
                     ->generate('rfcCore_gameSelection', array(
                         'gameId' => $gameId
                     )));
        $manipulator = new \Knp\Menu\Util\MenuManipulator();
        $manipulator->moveToPosition($menu->getChild($game->getName()), 0);

        return $this->render('RFCCoreBundle:Crew:index.html.twig', array(
            'game' => $game,
            'games' => $games,
            'users' => $users,
            'crewMembers' => $crewMembers,
            'awaitingMembers' => $awaitingMembers
        ));
    }

    public function crewApplicationAction()
    {

        $params = array();
        $content = $this->get("request")->getContent();
        if (!empty($content))
        {
            $params = json_decode($content, true); // 2nd param to get as array
        }

        $em = $this->getDoctrine()->getManager();

        $game = $em->getRepository('RFCCoreBundle:Game')->findOneById($params['gameId']);
        $requester = $em->getRepository('RFCUserBundle:User')->findOneById($params['requesterId']);
        $mentor = $em->getRepository('RFCUserBundle:User')->findOneById($params['mentorId']);

        $request = new CrewRequest();
        $request->setRequester($requester);
        $request->setMentor($mentor);
        $request->setState(1);
        $request->setGame($game);

        try{
            $em->persist($request);
            $em->flush();
            $jsonResponse = new JsonResponse($request, 200);
        } catch (Exception $e){
            $jsonResponse = new JsonResponse($request, 400);
        }

        return $jsonResponse;
    }

    public function crewRetirementAction()
    {

        $params = array();
        $content = $this->get("request")->getContent();
        if (!empty($content))
        {
            $params = json_decode($content, true); // 2nd param to get as array
        }

        $em = $this->getDoctrine()->getManager();

        $crew = $em->getRepository('RFCCoreBundle:CrewRequest')->findOneById($params['crewId']);

        $crew->setState(4);

        try{
            $em->flush();
            $jsonResponse = new JsonResponse($crew, 200);
        } catch (Exception $e){
            $jsonResponse = new JsonResponse($crew, 400);
        }

        return $jsonResponse;
    }

    public function crewAcceptAction()
    {
        $params = array();
        $content = $this->get("request")->getContent();
        if (!empty($content))
        {
            $params = json_decode($content, true); // 2nd param to get as array
        }

        $em = $this->getDoctrine()->getManager();

        $crew = $em->getRepository('RFCCoreBundle:CrewRequest')->findOneById($params['crewId']);

        $crew->setState(2);

        try{
            $em->flush();
            $jsonResponse = new JsonResponse($crew, 200);
        } catch (Exception $e){
            $jsonResponse = new JsonResponse($crew, 400);
        }

        return $jsonResponse;
    }
}