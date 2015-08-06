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
use RFC\CoreBundle\Entity\TypeSession;
use RFC\CoreBundle\Form\TypeSessionType;
use RFC\FrameworkBundle\Controller\RFCController;
use Symfony\Component\Form\Form;
use Symfony\Component\HttpFoundation\Request;

/**
 * TypeSession controller.
 */
class TypeSessionController extends RFCController
{

    /**
     * Lists all TypeSession entities.
     */
    public function indexAction($gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $typeSessions = $entityManager->getRepository('RFCCoreBundle:TypeSession')->findBy(array(
            'game' => $gameId
        ));
        $game = $entityManager->getRepository('RFCCoreBundle:Game')->findOneBy(array('id' => $gameId));

        // Ajout du jeu sélectionné
        $menu = $this->get('rfc_admin.menu.breadcrumb');
        $menu->addChild($game->getName())
            ->setUri($this->get("router")
                ->generate('admin_game_manage', array(
                    'gameId' => $gameId
                )));
        $manipulator = new MenuManipulator();
        $manipulator->moveToPosition($menu->getChild($game->getName()), 1);

        return $this->render('RFCAdminBundle:TypeSession:index.html.twig', array(
            'typeSessions' => $typeSessions,
            'gameId' => $gameId,
            'game' => $game
        ));
    }

    /**
     * Creates a new TypeSession entity.
     */
    public function createAction(Request $request, $gameId)
    {
        $entity = new TypeSession();
        $form = $this->createCreateForm($entity, $gameId);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($entity);
            $entityManager->flush();

            return $this->redirect($this->generateUrl('rfcCore_gameParameters', array(
                    'gameId' => $gameId,
                )) . '#/sessiontypes');
        }

        return $this->render('RFCAdminBundle:TypeSession:new.html.twig', array(
            'entity' => $entity,
            'form' => $form->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Creates a form to create a TypeSession entity.
     *
     * @param TypeSession $entity
     *            The entity
     *
     * @return Form The form
     */
    private function createCreateForm(TypeSession $entity, $gameId)
    {
        $form = $this->createForm(new TypeSessionType(), $entity, array(
            'em' => $this->getDoctrine()
                ->getManager(),
            'action' => $this->generateUrl('admin_typeSession_create', array(
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
     * Displays a form to create a new TypeSession entity.
     */
    public function newAction($gameId)
    {
        $entity = new TypeSession();
        $entityManager = $this->getDoctrine()->getManager();
        $entityGame = $entityManager->getRepository('RFCCoreBundle:Game')->find($gameId);
        $entity->setGame($entityGame);
        $form = $this->createCreateForm($entity, $gameId);

        return $this->render('RFCAdminBundle:TypeSession:new.html.twig', array(
            'entity' => $entity,
            'form' => $form->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Finds and displays a TypeSession entity.
     */
    public function showAction($typeSessionId, $gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:TypeSession')->find($typeSessionId);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find TypeSession entity.');
        }

        $deleteForm = $this->createDeleteForm($typeSessionId, $gameId);

        return $this->render('RFCAdminBundle:TypeSession:show.html.twig', array(
            'entity' => $entity,
            'delete_form' => $deleteForm->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Displays a form to edit an existing TypeSession entity.
     */
    public function editAction($typeSessionId, $gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:TypeSession')->find($typeSessionId);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find TypeSession entity.');
        }

        $editForm = $this->createEditForm($entity, $gameId);
        $deleteForm = $this->createDeleteForm($typeSessionId, $gameId);

        return $this->render('RFCAdminBundle:TypeSession:edit.html.twig', array(
            'entity' => $entity,
            'gameId' => $gameId,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView()
        ));
    }

    /**
     * Creates a form to edit a TypeSession entity.
     *
     * @param TypeSession $entity
     *            The entity
     *
     * @return Form The form
     */
    private function createEditForm(TypeSession $entity, $gameId)
    {
        $form = $this->createForm(new TypeSessionType(), $entity, array(
            'em' => $this->getDoctrine()
                ->getManager(),
            'action' => $this->generateUrl('admin_typeSession_update', array(
                'typeSessionId' => $entity->getId(),
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
     * Edits an existing TypeSession entity.
     */
    public function updateAction(Request $request, $typeSessionId, $gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:TypeSession')->find($typeSessionId);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find TypeSession entity.');
        }

        $deleteForm = $this->createDeleteForm($typeSessionId, $gameId);
        $editForm = $this->createEditForm($entity, $gameId);
        $editForm->handleRequest($request);

        if ($editForm->isValid()) {
            $entityManager->flush();

            return $this->redirect($this->generateUrl('rfcCore_gameParameters', array(
                    'gameId' => $gameId,
                )) . '#/sessiontypes');
        }

        return $this->render('RFCAdminBundle:TypeSession:edit.html.twig', array(
            'entity' => $entity,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Deletes a TypeSession entity.
     */
    public function deleteAction(Request $request, $typeSessionId, $gameId)
    {
        $form = $this->createDeleteForm($typeSessionId, $gameId);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entity = $entityManager->getRepository('RFCCoreBundle:TypeSession')->find($typeSessionId);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find TypeSession entity.');
            }

            $entityManager->remove($entity);
            $entityManager->flush();
        }

        return $this->redirect($this->generateUrl('rfcCore_gameParameters', array(
                'gameId' => $gameId,
            )) . '#/sessiontypes');
    }

    /**
     * Creates a form to delete a TypeSession entity by id.
     *
     * @param mixed $typeSessionId
     *            The entity id
     *
     * @return Form The form
     */
    private function createDeleteForm($typeSessionId, $gameId)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('admin_typeSession_delete', array(
                'typeSessionId' => $typeSessionId,
                'gameId' => $gameId
            )))
            ->setMethod('DELETE')
            ->add('submit', 'submit', array(
                'label' => 'Delete'
            ))
            ->getForm();
    }
}
