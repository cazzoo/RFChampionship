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
  along with this program.  If not, see <http://www.gnu.org/licenses/>. */

namespace RFC\AdminBundle\Controller;

use RFC\CoreBundle\Entity\Event;
use RFC\CoreBundle\Form\Type\EventType;
use RFC\CoreBundle\Form\Type\SimpleEventType;
use RFC\FrameworkBundle\Controller\RFCController;
use Symfony\Component\Form\Form;
use Symfony\Component\HttpFoundation\Request;

/**
 * Event controller.
 */
class EventController extends RFCController
{

    /**
     * Lists all Event entities.
     */
    public function indexAction($gameId, $championshipId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entities = $entityManager->getRepository('RFCCoreBundle:Event')->findBy(array(
            'championship' => $championshipId
        ));

        return $this->render('RFCAdminBundle:Event:index.html.twig',
                array(
                'entities' => $entities,
                'gameId' => $gameId,
                'championshipId' => $championshipId
        ));
    }

    /**
     * Creates a new Event entity.
     */
    public function createAction(Request $request, $gameId, $championshipId)
    {
        $entity = new Event();
        $form   = $this->createCreateForm($entity, $gameId, $championshipId,
            false);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($entity);
            $entityManager->flush();

            return $this->redirect($this->generateUrl('rfcCore_championships_show',
                        array(
                        'gameId' => $gameId,
                        'championshipId' => $championshipId
            )));
        }

        return $this->render('RFCAdminBundle:Event:new.html.twig',
                array(
                'entity' => $entity,
                'form' => $form->createView(),
                'gameId' => $gameId,
                'championshipId' => $championshipId
        ));
    }

    /**
     * Creates a form to create a Event entity.
     *
     * @param Event $entity
     *            The entity
     * @param boolean $gameId
     *            The game id
     * @param boolean $championshipId
     *            The championship id
     * @param boolean $teamChampionship
     * @return Form The form
     */
    private function createCreateForm(Event $entity, $gameId, $championshipId,
                                      $teamChampionship)
    {

        if ($teamChampionship) {
            $entityType = new SimpleEventType($gameId);
        } else {
            $entityType = new EventType($gameId);
        }
        $form = $this->createForm($entityType, $entity,
            array(
            'action' => $this->generateUrl('admin_event_create',
                array(
                'gameId' => $gameId,
                'championshipId' => $championshipId
            )),
            'method' => 'POST'
        ));

        $form->add('submit', 'submit',
            array(
            'label' => 'Create'
        ));

        return $form;
    }

    /**
     * Displays a form to create a new Event entity.
     */
    public function newAction($gameId, $championshipId)
    {
        $entity             = new Event();
        $entityManager      = $this->getDoctrine()->getManager();
        $entityChampionship = $entityManager->getRepository('RFCCoreBundle:Championship')->find($championshipId);
        $entity->setChampionship($entityChampionship);

        $teamChampionship = false;

        if (count($entityChampionship->getListTeams()) > 0) {
            $teamChampionship = true;
        }

        $form = $this->createCreateForm($entity, $gameId, $championshipId,
            $teamChampionship);

        return $this->render('RFCAdminBundle:Event:new.html.twig',
                array(
                'entity' => $entity,
                'form' => $form->createView(),
                'gameId' => $gameId,
                'championshipId' => $championshipId
        ));
    }

    /**
     * Finds and displays a Event entity.
     */
    public function showAction($eventId, $gameId, $championshipId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:Event')->find($eventId);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Event entity.');
        }

        $deleteForm = $this->createDeleteForm($eventId, $gameId, $championshipId);

        return $this->render('RFCAdminBundle:Event:show.html.twig',
                array(
                'entity' => $entity,
                'delete_form' => $deleteForm->createView(),
                'gameId' => $gameId,
                'championshipId' => $championshipId
        ));
    }

    /**
     * Displays a form to edit an existing Event entity.
     */
    public function editAction($eventId, $gameId, $championshipId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:Event')->find($eventId);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Event entity.');
        }

        $editForm   = $this->createEditForm($entity, $gameId, $championshipId);
        $deleteForm = $this->createDeleteForm($eventId, $gameId, $championshipId);

        return $this->render('RFCAdminBundle:Event:edit.html.twig',
                array(
                'entity' => $entity,
                'edit_form' => $editForm->createView(),
                'delete_form' => $deleteForm->createView(),
                'gameId' => $gameId,
                'championshipId' => $championshipId
        ));
    }

    /**
     * Creates a form to edit a Event entity.
     *
     * @param Event $entity
     *            The entity
     *            
     * @return Form The form
     */
    private function createEditForm(Event $entity, $gameId, $championshipId)
    {
        $form = $this->createForm(new EventType($gameId), $entity,
            array(
            'action' => $this->generateUrl('admin_event_update',
                array(
                'eventId' => $entity->getId(),
                'gameId' => $gameId,
                'championshipId' => $championshipId
            )),
            'method' => 'PUT'
        ));

        $form->add('submit', 'submit',
            array(
            'label' => 'Update'
        ));

        return $form;
    }

    /**
     * Edits an existing Event entity.
     */
    public function updateAction(Request $request, $eventId, $gameId,
                                 $championshipId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:Event')->find($eventId);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Event entity.');
        }

        $deleteForm = $this->createDeleteForm($eventId, $gameId, $championshipId);
        $editForm   = $this->createEditForm($entity, $gameId, $championshipId);
        $editForm->handleRequest($request);

        if ($editForm->isValid()) {
            $entityManager->flush();

            return $this->redirect($this->generateUrl('rfcCore_championships_show',
                        array(
                        'gameId' => $gameId,
                        'championshipId' => $championshipId
            )));
        }

        return $this->render('RFCAdminBundle:Event:edit.html.twig',
                array(
                'entity' => $entity,
                'edit_form' => $editForm->createView(),
                'delete_form' => $deleteForm->createView(),
                'gameId' => $gameId,
                'championshipId' => $championshipId
        ));
    }

    /**
     * Deletes a Event entity.
     */
    public function deleteAction(Request $request, $eventId, $gameId,
                                 $championshipId)
    {
        $form = $this->createDeleteForm($eventId, $gameId, $championshipId);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entity        = $entityManager->getRepository('RFCCoreBundle:Event')->find($eventId);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Event entity.');
            }

            $entityManager->remove($entity);
            $entityManager->flush();
        }

        return $this->redirect($this->generateUrl('rfcCore_championships_show',
                    array(
                    'gameId' => $gameId,
                    'championshipId' => $championshipId
        )));
    }

    /**
     * Creates a form to delete a Event entity by id.
     *
     * @param mixed $eventId
     *            The entity id
     *            
     * @return Form The form
     */
    private function createDeleteForm($eventId, $gameId, $championshipId)
    {
        return $this->createFormBuilder()
                ->setAction($this->generateUrl('admin_event_delete',
                        array(
                        'eventId' => $eventId,
                        'gameId' => $gameId,
                        'championshipId' => $championshipId
                )))
                ->setMethod('DELETE')
                ->add('submit', 'submit',
                    array(
                    'label' => 'Delete'
                ))
                ->getForm();
    }
}