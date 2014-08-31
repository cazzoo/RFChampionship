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
        
        $game = $em->getRepository('RFCCoreBundle:Game')->findOneById($gameId);
        $games = $em->getRepository('RFCCoreBundle:Game')->findAll();
        $users = $em->getRepository('RFCUserBundle:User')->findAll();
        
        return $this->render('RFCCoreBundle:Crew:index.html.twig', array(
            'game' => $game,
            'games' => $games,
            'users' => $users
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
        
        $requester = $em->getRepository('RFCUserBundle:User')->findOneById($params['requesterId']);
        $mentor = $em->getRepository('RFCUserBundle:User')->findOneById($params['mentorId']);
        
        $request = new CrewRequest();
        $request->setRequester($requester);
        $request->setMentor($mentor);
        $request->setState(1);
        
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
}