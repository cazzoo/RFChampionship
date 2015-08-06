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

use RFC\CoreBundle\Entity\Session;
use RFC\CoreBundle\Form\SessionType;
use RFC\FrameworkBundle\Controller\RFCController;
use Symfony\Component\Form\Form;
use Symfony\Component\HttpFoundation\Request;

/**
 * Session controller.
 */
class SessionController extends RFCController
{

    /**
     * Creates a new Session entity.
     */
    public function createAction(Request $request, $gameId, $championshipId,
                                 $eventId)
    {
        $entity = new Session ();
        $form   = $this->createCreateForm($entity, $gameId, $championshipId,
            $eventId);
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

        return $this->render('RFCAdminBundle:Session:new.html.twig',
                array(
                'entity' => $entity,
                'form' => $form->createView(),
                'gameId' => $gameId,
                'championshipId' => $championshipId,
                'eventId' => $eventId
        ));
    }

    /**
     * Creates a form to create a Session entity.
     *
     * @param Session $entity
     *        	The entity
     *
     * @return Form The form
     */
    private function createCreateForm(Session $entity, $gameId, $championshipId,
                                      $eventId)
    {
        $form = $this->createForm(new SessionType($gameId), $entity,
            array(
            'em' => $this->getDoctrine()->getManager(),
            'action' => $this->generateUrl('admin_session_create',
                array(
                'gameId' => $gameId,
                'championshipId' => $championshipId,
                'eventId' => $eventId
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
     * Displays a form to create a new Session entity.
     */
    public function newAction($gameId, $championshipId, $eventId)
    {
        $entityManager = $this->getDoctrine()->getManager();
        $entity        = new Session ();
        $event         = $entityManager->getRepository('RFCCoreBundle:Event')->findBy(array(
            'id' => $eventId));
        $entity->setEvent($event [0]);
        $form          = $this->createCreateForm($entity, $gameId,
            $championshipId, $eventId);

        return $this->render('RFCAdminBundle:Session:new.html.twig',
                array(
                'entity' => $entity,
                'form' => $form->createView(),
                'gameId' => $gameId,
                'championshipId' => $championshipId,
                'eventId' => $eventId
        ));
    }

    /**
     * Finds and displays a Session entity.
     */
    public function showAction($sessionId, $gameId, $championshipId, $eventId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:Session')->find($sessionId);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Session entity.');
        }

        $deleteForm = $this->createDeleteForm($sessionId, $gameId,
            $championshipId, $eventId);

        return $this->render('RFCAdminBundle:Session:show.html.twig',
                array(
                'entity' => $entity,
                'delete_form' => $deleteForm->createView(),
                'gameId' => $gameId,
                'championshipId' => $championshipId,
                'eventId' => $eventId
        ));
    }

    /**
     * Displays a form to edit an existing Session entity.
     */
    public function editAction($sessionId, $gameId, $championshipId, $eventId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:Session')->find($sessionId);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Session entity.');
        }

        $editForm   = $this->createEditForm($entity, $gameId, $championshipId,
            $eventId);
        $deleteForm = $this->createDeleteForm($sessionId, $gameId,
            $championshipId, $eventId);

        return $this->render('RFCAdminBundle:Session:edit.html.twig',
                array(
                'entity' => $entity,
                'edit_form' => $editForm->createView(),
                'delete_form' => $deleteForm->createView(),
                'gameId' => $gameId,
                'championshipId' => $championshipId,
                'eventId' => $eventId
        ));
    }

    /**
     * Creates a form to edit a Session entity.
     *
     * @param Session $entity
     *        	The entity
     *
     * @return Form The form
     */
    private function createEditForm(Session $entity, $gameId, $championshipId,
                                    $eventId)
    {
        $form = $this->createForm(new SessionType($gameId), $entity,
            array(
            'em' => $this->getDoctrine()->getManager(),
            'action' => $this->generateUrl('admin_session_update',
                array(
                'sessionId' => $entity->getId(),
                'gameId' => $gameId,
                'championshipId' => $championshipId,
                'eventId' => $eventId
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
     * Edits an existing Session entity.
     */
    public function updateAction(Request $request, $sessionId, $gameId,
                                 $championshipId, $eventId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:Session')->find($sessionId);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Session entity.');
        }

        $deleteForm = $this->createDeleteForm($sessionId, $gameId,
            $championshipId, $eventId);
        $editForm   = $this->createEditForm($entity, $gameId, $championshipId,
            $eventId);
        $editForm->handleRequest($request);

        if ($editForm->isValid()) {
            $entityManager->flush();

            return $this->redirect($this->generateUrl('rfcCore_championships_show',
                        array(
                        'gameId' => $gameId,
                        'championshipId' => $championshipId
            )));
        }

        return $this->render('RFCAdminBundle:Session:edit.html.twig',
                array(
                'entity' => $entity,
                'edit_form' => $editForm->createView(),
                'delete_form' => $deleteForm->createView(),
                'gameId' => $gameId,
                'championshipId' => $championshipId,
                'eventId' => $eventId
        ));
    }

    /**
     * Deletes a Session entity.
     */
    public function deleteAction(Request $request, $sessionId, $gameId,
                                 $championshipId, $eventId)
    {
        $form = $this->createDeleteForm($sessionId, $gameId, $championshipId,
            $eventId);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entity        = $entityManager->getRepository('RFCCoreBundle:Session')->find($sessionId);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Session entity.');
            }

            $entityManager->remove($entity);
            $entityManager->flush();
        }

        return $this->redirect($this->generateUrl('rfcCore_championships_show'),
                array(
                'gameId' => $gameId,
                'championshipId' => $championshipId
        ));
    }

    /**
     * Creates a form to delete a Session entity by id.
     *
     * @param mixed $sessionId
     *        	The entity id
     *
     * @return Form The form
     */
    private function createDeleteForm($sessionId, $gameId, $championshipId,
                                      $eventId)
    {
        return $this->createFormBuilder()->setAction($this->generateUrl('admin_session_delete',
                    array(
                    'sessionId' => $sessionId,
                    'gameId' => $gameId,
                    'championshipId' => $championshipId,
                    'eventId' => $eventId
            )))->setMethod('DELETE')->add('submit', 'submit',
                array(
                'label' => 'Delete'
            ))->getForm();
    }

    public function searchAction(Request $request)
    {
        if ($request->isMethod('POST')) {
            $params = \json_decode($request->getContent(), true);

            $gameId         = $params ['gameId'];
            $championshipId = $params ['championshipId'];
            $eventId        = $params ['eventId'];

            $form = $this->createCreateForm(new Session(), $gameId,
                $championshipId, $eventId);

            $sessions = $this->getDoctrine()->getManager()
                    ->getRepository('RFCCoreBundle:Session')->findBy(array(
                'event' => $eventId
            ));

            return $this->render('RFCAdminBundle:Session:list.html.twig',
                    array(
                    'gameId' => $gameId,
                    'championshipId' => $championshipId,
                    'sessions' => $sessions,
                    'eventId' => $eventId,
                    'form' => $form->createView()
            ));
        }
    }

    public function sessionLoadAction(Request $request)
    {
        if ($request->isMethod('POST')) {
            $params = \json_decode($request->getContent(), true);

            $session = $this->getDoctrine()->getManager()
                ->getRepository('RFCCoreBundle:Session')
                ->findOneBy(array('id' => $params ['sessionId']));

            return $this->render('RFCAdminBundle:Session:showSession.html.twig',
                    array(
                    'session' => $session
            ));
        }
    }
}