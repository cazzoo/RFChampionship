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
    //return $this->render('RFCCoreBundle:Core:gameIndex.html.twig', array('gameId' => $gameId));
    return new Response('Affichage du jeu ' . $gameId);
  }
public function menuAction($number)
{
    $gameList = array(
      array('id' => 1, 'name' => 'Jeu 1'),
      array('id' => 2, 'name' => 'Jeu 2'),
      array('id' => 3, 'name' => 'Jeu 3')
    );
    
    return $this->render('RFCCoreBundle:Core:menu.html.twig', array(
      'gameList' => $gameList
    ));
}
}