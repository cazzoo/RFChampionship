<?php

// src/RFC/CoreBundle/Controller/CoreController.php
namespace RFC\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use RFC\CoreBundle\Entity\Game;

class CoreController extends Controller {
	public function indexAction() {
		$em = $this->getDoctrine ()->getManager ();
		
		$games = $em->getRepository ( 'RFCCoreBundle:Game' )->findAll ();
		
		return $this->render ( 'RFCCoreBundle:Core:index.html.twig', array (
				'games' => $games 
		) );
	}
	public function accessGameAction($gameId) {
		$em = $this->getDoctrine ()->getManager ();
		$g = $em->getRepository ( 'RFCCoreBundle:Game' )->find ( $gameId );
		$games = $em->getRepository ( 'RFCCoreBundle:Game' )->findAll ();
		return $this->render ( 'RFCCoreBundle:Core:gameIndex.html.twig', array (
				'game' => $g,
				'games' => $games 
		) );
	}
}