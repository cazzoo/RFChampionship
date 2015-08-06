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

use Knp\Menu\Util\MenuManipulator;
use RFC\CoreBundle\Entity\Championship;
use RFC\CoreBundle\Form\ChampionshipType;
use RFC\FrameworkBundle\Controller\RFCController;
use Symfony\Component\Form\Form;
use Symfony\Component\HttpFoundation\Request;

/**
 * Championship controller.
 */
class ChampionshipController extends RFCController
{

    /**
     * Lists all Championship entities.
     */
    public function indexAction($gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $championships = $entityManager->getRepository('RFCCoreBundle:Championship')->findBy(array(
            'game' => $gameId
        ));
        $game          = $entityManager->getRepository('RFCCoreBundle:Game')->findOneBy(array(
            'id' => $gameId));

        // Ajout du jeu sélectionné
        $menu        = $this->get('rfc_admin.menu.breadcrumb');
        $menu->addChild($game->getName())
            ->setUri($this->get("router")
                ->generate('admin_game_manage',
                    array(
                    'gameId' => $gameId
        )));
        $manipulator = new MenuManipulator();
        $manipulator->moveToPosition($menu->getChild($game->getName()), 1);

        return $this->render('RFCAdminBundle:Championship:index.html.twig',
                array(
                'championships' => $championships,
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
        $form   = $this->createCreateForm($entity, $gameId);
        $form->handleRequest($request);

        if ($form->isValid()) {

            // If the championship is team based
            if ($form->get('teamChampionship')->getData()) {
                switch ($form->get('teamCountSelection')->getData()) {
                    case 'byVehicles':
                        $entity->generateTeams([
                            $form->get('listVehicles')->getData(),
                            $form->get('MaximumMainDrivers')->getData(),
                            $form->get('MaximumSecondaryDrivers')->getData()]);
                        break;
                    case 'byCategories':
                        $entity->generateTeams([
                            $form->get('listCategories')->getData(),
                            $form->get('MaximumMainDrivers')->getData(),
                            $form->get('MaximumSecondaryDrivers')->getData()]);
                        break;
                    case 'byChoice':
                        $entity->generateTeams([
                            $form->get('teamCount')->getData(),
                            $form->get('MaximumMainDrivers')->getData(),
                            $form->get('MaximumSecondaryDrivers')->getData()]);
                        break;
                }
            }

            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($entity);
            $entityManager->flush();

            return $this->redirect($this->generateUrl('rfcCore_championships_show',
                        array(
                        'championshipId' => $entity->getId(),
                        'gameId' => $gameId
            )));
        }

        return $this->render('RFCAdminBundle:Championship:new.html.twig',
                array(
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
     * @return Form The form
     */
    private function createCreateForm(Championship $entity, $gameId)
    {

        $form = $this->createForm(new ChampionshipType($gameId), $entity,
            array(
            'action' => $this->generateUrl('admin_championship_create',
                array(
                'gameId' => $gameId
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
     * Displays a form to create a new Championship entity.
     */
    public function newAction($gameId)
    {
        $entity        = new Championship();
        $entityManager = $this->getDoctrine()->getManager();
        $entityGame    = $entityManager->getRepository('RFCCoreBundle:Game')->find($gameId);
        $entity->setGame($entityGame);
        $form          = $this->createCreateForm($entity, $gameId);

        return $this->render('RFCAdminBundle:Championship:new.html.twig',
                array(
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
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:Championship')->find($championshipId);
        $game   = $entityManager->getRepository('RFCCoreBundle:Game')->findBy(array(
            'id' => $gameId));

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Championship entity.');
        }

        $deleteForm = $this->createDeleteForm($championshipId, $gameId);

        return $this->render('RFCAdminBundle:Championship:show.html.twig',
                array(
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
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:Championship')->find($championshipId);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Championship entity.');
        }

        $editForm   = $this->createEditForm($entity, $gameId);
        $deleteForm = $this->createDeleteForm($championshipId, $gameId);

        return $this->render('RFCAdminBundle:Championship:edit.html.twig',
                array(
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
     * @return Form The form
     */
    private function createEditForm(Championship $entity, $gameId)
    {

        $form = $this->createForm(new ChampionshipType($gameId), $entity,
            array(
            'action' => $this->generateUrl('admin_championship_update',
                array(
                'championshipId' => $entity->getId(),
                'gameId' => $gameId
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
     * Edits an existing Championship entity.
     */
    public function updateAction(Request $request, $championshipId, $gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:Championship')->find($championshipId);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Championship entity.');
        }

        $deleteForm = $this->createDeleteForm($championshipId, $gameId);
        $editForm   = $this->createEditForm($entity, $gameId);
        $editForm->handleRequest($request);

        if ($editForm->isValid()) {
            $entityManager->flush();

            return $this->redirect($this->generateUrl('rfcCore_championships_show',
                        array(
                        'championshipId' => $championshipId,
                        'gameId' => $gameId
            )));
        }

        return $this->render('RFCAdminBundle:Championship:edit.html.twig',
                array(
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
            $entityManager = $this->getDoctrine()->getManager();
            $entity        = $entityManager->getRepository('RFCCoreBundle:Championship')->find($championshipId);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Championship entity.');
            }

            $entityManager->remove($entity);
            $entityManager->flush();
        }

        return $this->redirect($this->generateUrl('rfcCore_gameSelection',
                    array(
                    'gameId' => $gameId
        )));
    }

    /**
     * Creates a form to delete a Championship entity by id.
     *
     * @param mixed $championshipId
     *            The entity id
     *            
     * @return Form The form
     */
    private function createDeleteForm($championshipId, $gameId)
    {
        return $this->createFormBuilder()
                ->setAction($this->generateUrl('admin_championship_delete',
                        array(
                        'championshipId' => $championshipId,
                        'gameId' => $gameId
                )))
                ->setMethod('DELETE')
                ->add('submit', 'submit',
                    array(
                    'label' => 'Delete'
                ))
                ->getForm();
    }

    /**
     * Upgrade an old fashioned championship using the category & vehicle single attributes for using new and nicer lists for both.
     */
    public function championshipUpgradeAction()
    {
        $entityManager = $this->getDoctrine()->getManager();

        $championships        = $entityManager->getRepository('RFCCoreBundle:Championship')->findAll();
        $updatedEvents = array();

        foreach ($championships as $championship) {
            if ($championship->getOutdated()) {
                foreach ($championship->getListEvents() as $event) {
                    if ($event->getVehicle() !== null) {
                        $event->getListVehicles()->add($event->getVehicle());
                        $event->setVehicle(null);
                        array_push($updatedEvents, $event);
                    }
                    if ($event->getCategory() !== null) {
                        $event->getListCategories()->add($event->getCategory());
                        $event->setCategory(null);
                        array_push($updatedEvents, $event);
                    }
                }
            }
        }

        $entityManager->flush();

        return $this->render('RFCAdminBundle:Championship:upgrade.html.twig',
                array(
                'updatedEvents' => $updatedEvents
        ));
    }
}