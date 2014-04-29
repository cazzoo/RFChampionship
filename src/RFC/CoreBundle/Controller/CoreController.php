<?php

// src/RFC/CoreBundle/Controller/CoreController.php

namespace RFC\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class CoreController extends Controller
{
    public function indexAction()
    {
        return $this->render('RFCCoreBundle:Core:index.html.twig', array('games' => array()));
    }

    public function accessGameAction($gameId)
    {
        return $this->render('RFCCoreBundle:Core:gameIndex.html.twig', array('gameId' => $gameId));
    }

    public function menuAction($number)
    {
    	$em = $this->getDoctrine()->getManager();
    	
    	$gameList = $em->getRepository('RFCCoreBundle:Game')->findAll();

        return $this->render('RFCCoreBundle:Core:menu.html.twig', array(
            'gameList' => $gameList
        ));
    }
}