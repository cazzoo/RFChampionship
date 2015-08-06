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
use RFC\CoreBundle\Entity\Vehicle;
use RFC\CoreBundle\Form\VehicleType;
use RFC\FrameworkBundle\Controller\RFCController;
use Symfony\Component\Form\Form;
use Symfony\Component\HttpFoundation\Request;

/**
 * Vehicle controller.
 */
class VehicleController extends RFCController
{

    /**
     * Lists all Vehicle entities.
     */
    public function indexAction($gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $vehicles = $entityManager->getRepository('RFCCoreBundle:Vehicle')->findBy(array(
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

        return $this->render('RFCAdminBundle:Vehicle:index.html.twig', array(
            'vehicles' => $vehicles,
            'gameId' => $gameId,
            'game' => $game
        ));
    }

    /**
     * Creates a new Vehicle entity.
     */
    public function createAction(Request $request, $gameId)
    {
        $entity = new Vehicle();
        $form = $this->createCreateForm($entity, $gameId);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($entity);
            $entityManager->flush();

            return $this->redirect($this->generateUrl('rfcCore_gameParameters', array(
                    'gameId' => $gameId,
                )) . '#/vehicles');
        }

        return $this->render('RFCAdminBundle:Vehicle:new.html.twig', array(
            'entity' => $entity,
            'form' => $form->createView()
        ));
    }

    /**
     * Creates a form to create a Vehicle entity.
     *
     * @param Vehicle $entity
     *            The entity
     *
     * @return Form The form
     */
    private function createCreateForm(Vehicle $entity, $gameId)
    {
        $form = $this->createForm(new VehicleType(), $entity, array(
            'em' => $this->getDoctrine()
                ->getManager(),
            'action' => $this->generateUrl('admin_vehicle_create', array(
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
     * Displays a form to create a new Vehicle entity.
     */
    public function newAction($gameId)
    {
        $entity = new Vehicle();
        $entityManager = $this->getDoctrine()->getManager();
        $entityGame = $entityManager->getRepository('RFCCoreBundle:Game')->find($gameId);
        $entity->setGame($entityGame);
        $form = $this->createCreateForm($entity, $gameId);

        return $this->render('RFCAdminBundle:Vehicle:new.html.twig', array(
            'entity' => $entity,
            'form' => $form->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Finds and displays a Vehicle entity.
     */
    public function showAction($vehicleId, $gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:Vehicle')->find($vehicleId);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Vehicle entity.');
        }

        $deleteForm = $this->createDeleteForm($vehicleId, $gameId);

        return $this->render('RFCAdminBundle:Vehicle:show.html.twig', array(
            'entity' => $entity,
            'delete_form' => $deleteForm->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Displays a form to edit an existing Vehicle entity.
     */
    public function editAction($vehicleId, $gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:Vehicle')->find($vehicleId);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Vehicle entity.');
        }

        $editForm = $this->createEditForm($entity, $gameId);
        $deleteForm = $this->createDeleteForm($vehicleId, $gameId);

        return $this->render('RFCAdminBundle:Vehicle:edit.html.twig', array(
            'entity' => $entity,
            'gameId' => $gameId,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView()
        ));
    }

    /**
     * Creates a form to edit a Vehicle entity.
     *
     * @param Vehicle $entity
     *            The entity
     *
     * @return Form The form
     */
    private function createEditForm(Vehicle $entity, $gameId)
    {
        $form = $this->createForm(new VehicleType(), $entity, array(
            'em' => $this->getDoctrine()
                ->getManager(),
            'action' => $this->generateUrl('admin_vehicle_update', array(
                'vehicleId' => $entity->getId(),
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
     * Edits an existing Vehicle entity.
     */
    public function updateAction(Request $request, $vehicleId, $gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:Vehicle')->find($vehicleId);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Vehicle entity.');
        }

        $deleteForm = $this->createDeleteForm($vehicleId, $gameId);
        $editForm = $this->createEditForm($entity, $gameId);
        $editForm->handleRequest($request);

        if ($editForm->isValid()) {
            $entityManager->flush();

            return $this->redirect($this->generateUrl('rfcCore_gameParameters', array(
                    'gameId' => $gameId,
                )) . '#/vehicles');
        }

        return $this->render('RFCAdminBundle:Vehicle:edit.html.twig', array(
            'entity' => $entity,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Deletes a Vehicle entity.
     */
    public function deleteAction(Request $request, $vehicleId, $gameId)
    {
        $form = $this->createDeleteForm($vehicleId, $gameId);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entity = $entityManager->getRepository('RFCCoreBundle:Vehicle')->find($vehicleId);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Vehicle entity.');
            }

            $entityManager->remove($entity);
            $entityManager->flush();
        }

        return $this->redirect($this->generateUrl('rfcCore_gameParameters', array(
                'gameId' => $gameId,
            )) . '#/vehicles');
    }

    /**
     * Creates a form to delete a Vehicle entity by id.
     *
     * @param mixed $vehicleId
     *            The entity id
     *
     * @return Form The form
     */
    private function createDeleteForm($vehicleId, $gameId)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('admin_vehicle_delete', array(
                'vehicleId' => $vehicleId,
                'gameId' => $gameId
            )))
            ->setMethod('DELETE')
            ->add('submit', 'submit', array(
                'label' => 'Delete'
            ))
            ->getForm();
    }
}
