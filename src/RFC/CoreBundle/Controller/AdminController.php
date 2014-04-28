<?php

// src/RFC/CoreBundle/Controller/AdminController.php

namespace RFC\CoreBundle\Controller;

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
    	
        return $this->render('RFCCoreBundle:Admin:index.html.twig', array(
        	'games' => $games,
        ));
    }

    public function addGameAction()
    {
        $em = $this->getDoctrine()->getManager();

        $gameEntity = new Game();
        $form = $this->createForm(new GameType(), $gameEntity);

        $request = $this->getRequest();
        if($request->isMethod("post"))
        {
            $form->bind($request);
            
            $gameEntity = $form->getData();
            $em->persist($gameEntity);
            $em->flush();
            
            $this-> redirect($this->generateUrl("rfcCore_admin_index"));
        }

        return $this->render('RFCCoreBundle:Admin:addGame.html.twig', array(
            'form' => $form->createView(),
        ));
    }
}