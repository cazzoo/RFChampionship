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

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class CalendarController extends Controller {
	public function indexAction($gameId) {
		$entityManager = $this->getDoctrine ()->getManager ();
		
		$game = $entityManager->getRepository ( 'RFCCoreBundle:Game' )->findOneBy(array('id' => $gameId ));
		$games = $entityManager->getRepository ( 'RFCCoreBundle:Game' )->findAll ();
		
		// Ajout du jeu sélectionné
		$menu = $this->get ( 'rfc_core.menu.breadcrumb' );
		$menu->addChild ( $game->getName () )->setUri ( $this->get ( "router" )->generate ( 'rfcCore_gameSelection', array (
				'gameId' => $gameId 
		) ) );
		$manipulator = new \Knp\Menu\Util\MenuManipulator ();
		$manipulator->moveToPosition ( $menu->getChild ( $game->getName () ), 0 );
		
		return $this->render ( 'RFCCoreBundle:Calendar:index.html.twig', array (
				'game' => $game,
				'games' => $games 
		) );
	}
}