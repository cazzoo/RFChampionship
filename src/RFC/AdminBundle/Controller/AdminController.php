<?php

// src/RFC/AdminBundle/Controller/AdminController.php

namespace RFC\AdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use RFC\CoreBundle\Entity\Game;
use RFC\CoreBundle\Form\GameType;

class AdminController extends Controller
{
    public function indexAction()
    {
    	$em = $this->getDoctrine()->getManager();
    	$games = $em->getRepository("RFCCoreBundle:Game")->findAll();
    	
        return $this->render('RFCAdminBundle:Admin:index.html.twig', array(
        	'games' => $games,
        ));
    }
}