<?php
namespace RFC\CoreBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use RFC\CoreBundle\Entity\Championship;

class ChampionshipController extends Controller
{

    public function indexAction($gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $currentChampionships = $em->getRepository('RFCCoreBundle:Championship')
            ->createQueryBuilder('c')
            ->join('c.listEvents', 'e')
            ->join('e.listSessions', 's')
            ->where('s.endDate > :sysdate')
            ->setParameter('sysdate', new \DateTime())
            ->getQuery()
            ->getResult();
        
        $pastChampionships = $em->getRepository('RFCCoreBundle:Championship')
            ->createQueryBuilder('c')
            ->join('c.listEvents', 'e')
            ->join('e.listSessions', 's')
            ->where('s.endDate < :sysdate')
            ->setParameter('sysdate', new \DateTime())
            ->getQuery()
            ->getResult();
        
        $game = $em->getRepository('RFCCoreBundle:Game')->findOneById($gameId);
        $games = $em->getRepository('RFCCoreBundle:Game')->findAll();
        
        return $this->render('RFCCoreBundle:Championship:index.html.twig', array(
            'currentChampionships' => $currentChampionships,
            'pastChampionships' => $pastChampionships,
            'gameId' => $gameId,
            'game' => $game,
            'games' => $games
        ));
    }

    /**
     * Finds and displays a Championship entity.
     */
    public function showAction($championshipId, $gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:Championship')->find($championshipId);
        $game = $em->getRepository('RFCCoreBundle:Game')->findOneById($gameId);
        $games = $em->getRepository('RFCCoreBundle:Game')->findAll();
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Championship entity.');
        }
        
        return $this->render('RFCCoreBundle:Championship:show.html.twig', array(
            'sessions' => null,
            'eventId' => null,
            'entity' => $entity,
            'game' => $game,
            'games' => $games
        ));
    }
}
