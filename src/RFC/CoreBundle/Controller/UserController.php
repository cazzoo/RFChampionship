<?php

// src/RFC/CoreBundle/Controller/CoreController.php
namespace RFC\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use RFC\CoreBundle\Entity\Game;

class UserController extends Controller
{

    public function indexAction($gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $game = $em->getRepository('RFCCoreBundle:Game')->findOneById($gameId);
        $games = $em->getRepository('RFCCoreBundle:Game')->findAll();
        
        return $this->render('RFCCoreBundle:User:index.html.twig', array(
            'game' => $game,
            'games' => $games
        ));
    }
}