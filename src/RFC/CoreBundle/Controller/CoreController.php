<?php
/*  //RF//Championship is a multi-racing game team manager that allows members to organize and follow championships.
    Copyright (C) 2014 - //Racing-France//

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.*/

// src/RFC/CoreBundle/Controller/CoreController.php
namespace RFC\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use RFC\CoreBundle\Entity\Game;

class CoreController extends Controller
{

    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();
        
        $games = $em->getRepository('RFCCoreBundle:Game')->findAll();
        
        if (count($games) == 1) {
            
            return $this->redirect($games[0]->getId());
        }
        
        return $this->render('RFCCoreBundle:Core:index.html.twig', array(
            'games' => $games
        ));
    }

    public function accessGameAction($gameId)
    {
        $em = $this->getDoctrine()->getManager();
        $g = $em->getRepository('RFCCoreBundle:Game')->find($gameId);
        $games = $em->getRepository('RFCCoreBundle:Game')->findAll();
        
        $threadId = substr(strrchr(get_class($g), "\\"), 1) . '_' . $g->getName();
        return $this->render('RFCCoreBundle:Core:gameIndex.html.twig', array(
            'game' => $g,
            'games' => $games,
            'threadId' => $threadId
        ));
    }
}