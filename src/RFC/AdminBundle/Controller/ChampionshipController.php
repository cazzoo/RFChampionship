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
namespace RFC\AdminBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use RFC\CoreBundle\Entity\Championship;
use RFC\CoreBundle\Form\ChampionshipType;

/**
 * Championship controller.
 */
class ChampionshipController extends Controller
{

    /**
     * Lists all Championship entities.
     */
    public function indexAction($gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entities = $em->getRepository('RFCCoreBundle:Championship')->findBy(array(
            'game' => $gameId
        ));
        $game = $em->getRepository('RFCCoreBundle:Game')->findOneById($gameId);
        
        // Ajout du jeu sélectionné
        $menu = $this->get('rfc_admin.menu.breadcrumb');
        $menu->addChild($game->getName())
            ->setUri($this->get("router")
            ->generate('admin_game_manage', array(
            'gameId' => $gameId
        )));
        $manipulator = new \Knp\Menu\Util\MenuManipulator();
        $manipulator->moveToPosition($menu->getChild($game->getName()), 1);
        
        return $this->render('RFCAdminBundle:Championship:index.html.twig', array(
            'entities' => $entities,
            'gameId' => $gameId,
            'game' => $game
        ));
    }

    /**
     * Creates a new Championship entity.
     */
    public function createAction(Request $request, $gameId)
    {
        $entity = new Championship();
        $form = $this->createCreateForm($entity, $gameId);
        $form->handleRequest($request);
        
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();
            
            return $this->redirect($this->generateUrl('admin_championship_show', array(
                'championshipId' => $entity->getId(),
                'gameId' => $gameId
            )));
        }
        
        return $this->render('RFCAdminBundle:Championship:new.html.twig', array(
            'entity' => $entity,
            'form' => $form->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Creates a form to create a Championship entity.
     *
     * @param Championship $entity
     *            The entity
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createCreateForm(Championship $entity, $gameId)
    {
        $form = $this->createForm(new ChampionshipType($gameId), $entity, array(
            'em' => $this->getDoctrine()
                ->getManager(),
            'action' => $this->generateUrl('admin_championship_create', array(
                'gameId' => $gameId
            )),
            'method' => 'POST'
        ));
        
        $form->add('submit', 'submit', array(
            'label' => 'Create'
        ));
        
        return $form;
    }

    /**
     * Displays a form to create a new Championship entity.
     */
    public function newAction($gameId)
    {
        $entity = new Championship();
        $em = $this->getDoctrine()->getManager();
        $entityGame = $em->getRepository('RFCCoreBundle:Game')->find($gameId);
        $entity->setGame($entityGame);
        $form = $this->createCreateForm($entity, $gameId);
        
        return $this->render('RFCAdminBundle:Championship:new.html.twig', array(
            'entity' => $entity,
            'form' => $form->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Finds and displays a Championship entity.
     */
    public function showAction($championshipId, $gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:Championship')->find($championshipId);
        $game = $em->getRepository('RFCCoreBundle:Game')->findById($gameId);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Championship entity.');
        }
        
        $deleteForm = $this->createDeleteForm($championshipId, $gameId);
        
        return $this->render('RFCAdminBundle:Championship:show.html.twig', array(
            'sessions' => null,
            'eventId' => null,
            'entity' => $entity,
            'delete_form' => $deleteForm->createView(),
            'game' => $game
        ));
    }

    /**
     * Displays a form to edit an existing Championship entity.
     */
    public function editAction($championshipId, $gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:Championship')->find($championshipId);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Championship entity.');
        }
        
        $editForm = $this->createEditForm($entity, $gameId);
        $deleteForm = $this->createDeleteForm($championshipId, $gameId);
        
        return $this->render('RFCAdminBundle:Championship:edit.html.twig', array(
            'entity' => $entity,
            'gameId' => $gameId,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView()
        ));
    }

    /**
     * Creates a form to edit a Championship entity.
     *
     * @param Championship $entity
     *            The entity
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createEditForm(Championship $entity, $gameId)
    {
        $form = $this->createForm(new ChampionshipType($gameId), $entity, array(
            'em' => $this->getDoctrine()
                ->getManager(),
            'action' => $this->generateUrl('admin_championship_update', array(
                'championshipId' => $entity->getId(),
                'gameId' => $gameId
            )),
            'method' => 'PUT'
        ));
        
        $form->add('submit', 'submit', array(
            'label' => 'Update'
        ));
        
        return $form;
    }

    /**
     * Edits an existing Championship entity.
     */
    public function updateAction(Request $request, $championshipId, $gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:Championship')->find($championshipId);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Championship entity.');
        }
        
        $deleteForm = $this->createDeleteForm($championshipId, $gameId);
        $editForm = $this->createEditForm($entity, $gameId);
        $editForm->handleRequest($request);
        
        if ($editForm->isValid()) {
            $em->flush();
            
            return $this->redirect($this->generateUrl('admin_championship_edit', array(
                'championshipId' => $championshipId,
                'gameId' => $gameId
            )));
        }
        
        return $this->render('RFCAdminBundle:Championship:edit.html.twig', array(
            'entity' => $entity,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Deletes a Championship entity.
     */
    public function deleteAction(Request $request, $championshipId, $gameId)
    {
        $form = $this->createDeleteForm($championshipId, $gameId);
        $form->handleRequest($request);
        
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('RFCCoreBundle:Championship')->find($championshipId);
            
            if (! $entity) {
                throw $this->createNotFoundException('Unable to find Championship entity.');
            }
            
            $em->remove($entity);
            $em->flush();
        }
        
        return $this->redirect($this->generateUrl('admin_championship', array(
            'gameId' => $gameId
        )));
    }

    /**
     * Creates a form to delete a Championship entity by id.
     *
     * @param mixed $championshipId
     *            The entity id
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($championshipId, $gameId)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('admin_championship_delete', array(
            'championshipId' => $championshipId,
            'gameId' => $gameId
        )))
            ->setMethod('DELETE')
            ->add('submit', 'submit', array(
            'label' => 'Delete'
        ))
            ->getForm();
    }
}
