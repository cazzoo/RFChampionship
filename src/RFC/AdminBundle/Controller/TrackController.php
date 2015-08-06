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

namespace RFC\AdminBundle\Controller;

use Knp\Menu\Util\MenuManipulator;
use RFC\CoreBundle\Entity\Track;
use RFC\CoreBundle\Form\TrackType;
use RFC\FrameworkBundle\Controller\RFCController;
use Symfony\Component\Form\Form;
use Symfony\Component\HttpFoundation\Request;

/**
 * Track controller.
 */
class TrackController extends RFCController
{

    /**
     * Lists all Track entities.
     */
    public function indexAction($gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $tracks = $entityManager->getRepository('RFCCoreBundle:Track')->findBy(array(
            'game' => $gameId
        ));
        $game = $entityManager->getRepository('RFCCoreBundle:Game')->findOneBy(array('id' => $gameId));

        // Ajout du jeu sélectionné
        $menu = $this->get('rfc_admin.menu.breadcrumb');
        $menu->addChild($game->getName())->setUri($this->get("router")->generate('admin_game_manage', array(
            'gameId' => $gameId
        )));
        $manipulator = new MenuManipulator ();
        $manipulator->moveToPosition($menu->getChild($game->getName()), 1);

        return $this->render('RFCAdminBundle:Track:index.html.twig', array(
            'tracks' => $tracks,
            'gameId' => $gameId,
            'game' => $game
        ));
    }

    /**
     * Creates a new Track entity.
     */
    public function createAction(Request $request, $gameId)
    {
        $entity = new Track ();
        $form = $this->createCreateForm($entity, $gameId);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($entity);
            $entityManager->flush();

            return $this->redirect($this->generateUrl('rfcCore_gameParameters', array(
                    'gameId' => $gameId,
                )) . '#/tracks');
        }

        return $this->render('RFCAdminBundle:Track:new.html.twig', array(
            'entity' => $entity,
            'form' => $form->createView()
        ));
    }

    /**
     * Creates a form to create a Track entity.
     *
     * @param Track $entity
     *            The entity
     *
     * @return Form The form
     */
    private function createCreateForm(Track $entity, $gameId)
    {
        $form = $this->createForm(new TrackType (), $entity, array(
            'em' => $this->getDoctrine()->getManager(),
            'action' => $this->generateUrl('admin_track_create', array(
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
     * Displays a form to create a new Track entity.
     */
    public function newAction($gameId)
    {
        $entity = new Track ();
        $entityManager = $this->getDoctrine()->getManager();
        $entityGame = $entityManager->getRepository('RFCCoreBundle:Game')->find($gameId);
        $entity->setGame($entityGame);
        $form = $this->createCreateForm($entity, $gameId);

        return $this->render('RFCAdminBundle:Track:new.html.twig', array(
            'entity' => $entity,
            'form' => $form->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Finds and displays a Track entity.
     */
    public function showAction($trackId, $gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:Track')->find($trackId);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Track entity.');
        }

        $deleteForm = $this->createDeleteForm($trackId, $gameId);

        return $this->render('RFCAdminBundle:Track:show.html.twig', array(
            'entity' => $entity,
            'delete_form' => $deleteForm->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Displays a form to edit an existing Track entity.
     */
    public function editAction($trackId, $gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:Track')->find($trackId);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Track entity.');
        }

        $editForm = $this->createEditForm($entity, $gameId);
        $deleteForm = $this->createDeleteForm($trackId, $gameId);

        return $this->render('RFCAdminBundle:Track:edit.html.twig', array(
            'entity' => $entity,
            'gameId' => $gameId,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView()
        ));
    }

    /**
     * Creates a form to edit a Track entity.
     *
     * @param Track $entity
     *            The entity
     *
     * @return Form The form
     */
    private function createEditForm(Track $entity, $gameId)
    {
        $form = $this->createForm(new TrackType (), $entity, array(
            'em' => $this->getDoctrine()->getManager(),
            'action' => $this->generateUrl('admin_track_update', array(
                'trackId' => $entity->getId(),
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
     * Edits an existing Track entity.
     */
    public function updateAction(Request $request, $trackId, $gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:Track')->find($trackId);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Track entity.');
        }

        $deleteForm = $this->createDeleteForm($trackId, $gameId);
        $editForm = $this->createEditForm($entity, $gameId);
        $editForm->handleRequest($request);

        if ($editForm->isValid()) {
            $entityManager->flush();

            return $this->redirect($this->generateUrl('rfcCore_gameParameters', array(
                    'gameId' => $gameId,
                )) . '#/tracks');
        }

        return $this->render('RFCAdminBundle:Track:edit.html.twig', array(
            'entity' => $entity,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Deletes a Track entity.
     */
    public function deleteAction(Request $request, $trackId, $gameId)
    {
        $form = $this->createDeleteForm($trackId, $gameId);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entity = $entityManager->getRepository('RFCCoreBundle:Track')->find($trackId);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Track entity.');
            }

            $entityManager->remove($entity);
            $entityManager->flush();
        }

        return $this->redirect($this->generateUrl('rfcCore_gameParameters', array(
                'gameId' => $gameId,
            )) . '#/tracks');
    }

    /**
     * Creates a form to delete a Track entity by id.
     *
     * @param mixed $trackId
     *            The entity id
     *
     * @return Form The form
     */
    private function createDeleteForm($trackId, $gameId)
    {
        return $this->createFormBuilder()->setAction($this->generateUrl('admin_track_delete', array(
            'trackId' => $trackId,
            'gameId' => $gameId
        )))
            ->setMethod('DELETE')
            ->add('submit', 'submit', array(
                'label' => 'Delete'
            ))
            ->getForm();
    }
}
