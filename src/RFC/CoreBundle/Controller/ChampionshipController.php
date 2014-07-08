<?php
namespace RFC\CoreBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use RFC\CoreBundle\Entity\Championship;
use RFC\UserBundle\Entity\User;

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
            ->andWhere('c.game = :gameId')
            ->setParameters(array(
            'sysdate' => new \DateTime(),
            'gameId' => $gameId
        ))
            ->getQuery()
            ->getResult();
        
        $pastChampionships = $em->getRepository('RFCCoreBundle:Championship')
            ->createQueryBuilder('c')
            ->join('c.listEvents', 'e')
            ->join('e.listSessions', 's')
            ->where('s.endDate < :sysdate')
            ->andWhere('c.game = :gameId')
            ->setParameters(array(
            'sysdate' => new \DateTime(),
            'gameId' => $gameId
        ))
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
        
        // Ajout de la miette de pain
        $menu = $this->get('rfc_core.menu.breadcrumb');
        $menu->addChild($entity->getName())
            ->setCurrent(true);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Championship entity.');
        }
        
        $threadId = substr(strrchr(get_class($entity), "\\"), 1) . '_' . $entity->getName();
        return $this->render('RFCCoreBundle:Championship:show.html.twig', array(
            'sessions' => null,
            'eventId' => null,
            'entity' => $entity,
            'game' => $game,
            'games' => $games,
            'threadId' => $threadId
        ));
    }

    public function registerUserAction()
    {
        $request = Request::createFromGlobals();
        
        if ($request->isXmlHttpRequest()) {
            
            $championshipId = $request->request->get('championshipId');
            $userId = $request->request->get('userId');
            $action = $request->request->get('action');
            
            var_dump($championshipId);
            
            $em = $this->getDoctrine()->getManager();
            
            $user = $em->getRepository('RFCUserBundle:User')->find($userId);
            $championship = $em->getRepository('RFCCoreBundle:Championship')->findBy($championshipId);
            
            switch ($action) {
                case 'register':
                    $user->addListChampionship($championship);
                    $em->flush();
                    break;
                case 'unregister':
                    $user->removeListChampionship($championship);
                    $em->flush();
                    break;
            }
            // Returning the status of the action : 0 = nothing done, 1 = registered, 2 = unregistered
            return $this->render('RFCCoreBundle:Championship:championshipRegistration.html.twig');
        } else
            return $this->render('RFCCoreBundle:Championship:championshipRegistration.html.twig', array(
                'status' => null
            ));
    }
}
