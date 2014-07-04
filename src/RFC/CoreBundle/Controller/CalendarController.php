<?php
namespace RFC\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use RFC\CoreBundle\Entity\Game;

class CalendarController extends Controller
{

    public function indexAction($gameId)
    {
        
        $em = $this->getDoctrine()->getManager();
        
        $g = $em->getRepository('RFCCoreBundle:Game')->findOneById($gameId);
        $games = $em->getRepository('RFCCoreBundle:Game')->findAll();

        return $this->render('RFCCoreBundle:Calendar:index.html.twig', array(
            'game' => $g,
            'games' => $games
        ));
    }
}