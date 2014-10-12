<?php
/*
 * //RF//Championship is a multi-racing game team manager that allows members to organize and follow championships.
 * Copyright (C) 2014 - //Racing-France//
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
namespace RFC\CoreBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use RFC\CoreBundle\Entity\Championship;
use RFC\UserBundle\Entity\User;
use RFC\CoreBundle\RFCCoreBundle;

/**
 * Championship controller.
 */
class ChampionshipController extends Controller {
	public function indexAction($gameId) {
		$em = $this->getDoctrine ()->getManager ();
		
		$currentChampionships = $em->getRepository ( 'RFCCoreBundle:Championship' )->createQueryBuilder ( 'c' )->join ( 'c.listEvents', 'e' )->join ( 'e.listSessions', 's' )->where ( 's.endDate > :sysdate' )->andWhere ( 'c.game = :gameId' )->setParameters ( array (
				'sysdate' => new \DateTime (),
				'gameId' => $gameId 
		) )->getQuery ()->getResult ();
		
		$pastChampionships = $em->getRepository ( 'RFCCoreBundle:Championship' )->createQueryBuilder ( 'c' )->join ( 'c.listEvents', 'e' )->join ( 'e.listSessions', 's' )->where ( 's.endDate < :sysdate' )->andWhere ( 'c.game = :gameId' )->setParameters ( array (
				'sysdate' => new \DateTime (),
				'gameId' => $gameId 
		) )->getQuery ()->getResult ();
		
		$game = $em->getRepository ( 'RFCCoreBundle:Game' )->findOneById ( $gameId );
		$games = $em->getRepository ( 'RFCCoreBundle:Game' )->findAll ();
		
		// Ajout du jeu sélectionné
		$menu = $this->get ( 'rfc_core.menu.breadcrumb' );
		$menu->addChild ( $game->getName () )->setUri ( $this->get ( "router" )->generate ( 'rfcCore_gameSelection', array (
				'gameId' => $gameId 
		) ) );
		$manipulator = new \Knp\Menu\Util\MenuManipulator ();
		$manipulator->moveToPosition ( $menu->getChild ( $game->getName () ), 0 );
		
		return $this->render ( 'RFCCoreBundle:Championship:index.html.twig', array (
				'currentChampionships' => $currentChampionships,
				'pastChampionships' => $pastChampionships,
				'gameId' => $gameId,
				'game' => $game,
				'games' => $games 
		) );
	}
	
	/**
	 * Finds and displays a Championship entity.
	 */
	public function showAction($championshipId, $gameId) {
		$em = $this->getDoctrine ()->getManager ();
		
		$entity = $em->getRepository ( 'RFCCoreBundle:Championship' )->find ( $championshipId );
		$game = $em->getRepository ( 'RFCCoreBundle:Game' )->findOneById ( $gameId );
		$games = $em->getRepository ( 'RFCCoreBundle:Game' )->findAll ();
		
		// Ajout du jeu sélectionné
		$menu = $this->get ( 'rfc_core.menu.breadcrumb' );
		$menu->addChild ( $game->getName () )->setUri ( $this->get ( "router" )->generate ( 'rfcCore_gameSelection', array (
				'gameId' => $gameId 
		) ) );
		$manipulator = new \Knp\Menu\Util\MenuManipulator ();
		$manipulator->moveToPosition ( $menu->getChild ( $game->getName () ), 0 );
		
		// Ajout de la miette de pain
		$menu = $this->get ( 'rfc_core.menu.breadcrumb' );
		$menu->addChild ( $entity->getName () )->setCurrent ( true );
		
		if (! $entity) {
			throw $this->createNotFoundException ( 'Unable to find Championship entity.' );
		}
		
		$threadId = substr ( strrchr ( get_class ( $entity ), "\\" ), 1 ) . '_' . $entity->getName ();
		return $this->render ( 'RFCCoreBundle:Championship:show.html.twig', array (
				'sessions' => null,
				'eventId' => null,
				'entity' => $entity,
				'game' => $game,
				'games' => $games,
				'threadId' => $threadId 
		) );
	}
	public function userRegistrationAction() {
		$request = Request::createFromGlobals ();
		
		if ($request->isXmlHttpRequest ()) {
			
			$championshipId = $request->request->get ( 'championshipId' );
			$userId = $request->request->get ( 'userId' );
			$action = $request->request->get ( 'action' );
			$gameId = $request->request->get ( 'gameId' );
			
			$em = $this->getDoctrine ()->getManager ();
			
			$user = $em->getRepository ( 'RFCUserBundle:User' )->find ( $userId );
			$championship = $em->getRepository ( 'RFCCoreBundle:Championship' )->find ( $championshipId );
			
			switch ($action) {
				case 'register' :
					$championship->registerUser ( $user );
					$em->flush ();
					break;
				case 'unregister' :
					$championship->unregisterUser ( $user );
					$em->flush ();
					break;
			}
			// Returning the status of the action : 0 = nothing done, 1 = registered, 2 = unregistered
			return $this->render ( 'RFCCoreBundle:Championship:registration.html.twig', array (
					'status' => $action,
					'entity' => $championship,
					'gameId' => $gameId 
			) );
		} else {
			return $this->render ( 'RFCCoreBundle:Championship:registration.html.twig', array (
					'status' => '' 
			) );
		}
	}
	public function getResultsAction() {
		$params = array ();
		$results = array ();
		$content = $this->get ( "request" )->getContent ();
		if (! empty ( $content )) {
			$params = json_decode ( $content, true );
		}
		
		$em = $this->getDoctrine ()->getManager ();
		$championship = $em->getRepository ( 'RFCCoreBundle:Championship' )->findOneById ( $params ['championshipId'] );
		
		foreach ( $championship->getListEvents () as $event ) {
			foreach ( $event->getListSessions () as $session ) {
				foreach ( $session->getListResults () as $result ) {
					if ($result->getUser () != null) {
						$this->addPointsToUser ( $results, $result );
					}
				}
			}
		}
		
		return $this->render ( 'RFCCoreBundle:Championship:globalResults.html.twig', array (
				'results' => $results 
		) );
	}
	
	/**
	 * Add points to users in array.
	 * Create one entry if user is not in array.
	 *
	 * @param array $array
	 *        	the array with all the users
	 * @param RFCCoreBundle:Result $result
	 *        	the result to add (user / value)
	 */
	private function addPointsToUser(&$array, $result) {
		$userId = $result->getUser ()->getUserName ();
		$value = $result->getValue ();
		if (isset ( $array [$userId] )) {
			$array [$userId] += $value;
		} else {
			$array [$userId] = $value;
		}
	}
}