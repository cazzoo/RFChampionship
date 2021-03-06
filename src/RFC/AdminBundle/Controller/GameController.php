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
use RFC\CoreBundle\Entity\Game;
use RFC\CoreBundle\Entity\Property;
use RFC\CoreBundle\Form\Type\GameType;
use RFC\FrameworkBundle\Controller\RFCController;
use Symfony\Component\Form\Form;
use Symfony\Component\HttpFoundation\Request;

/**
 * Game controller.
 */
class GameController extends RFCController
{

    /**
     * Lists all Game entities.
     */
    public function indexAction()
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entities = $entityManager->getRepository('RFCCoreBundle:Game')->findAll();

        return $this->render('RFCAdminBundle:Game:index.html.twig',
            array(
                'games' => $entities
            ));
    }

    /**
     * Creates a new Game entity.
     */
    public function createAction(Request $request)
    {
        $entity = new Game();
        $updatedEntity = $this->addDefaultProperties($entity);
        $form = $this->createCreateForm($updatedEntity);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($updatedEntity);

            $uploadableManager = $this->get('stof_doctrine_extensions.uploadable.manager');

            foreach ($updatedEntity->getListImages() as $image) {
                $uploadableManager->markEntityToUpload($image, $image->getPath());
            }

            $entityManager->flush();

            return $this->redirect($this->generateUrl('rfcCore_gameSelection',
                array(
                    'gameId' => $updatedEntity->getId()
                )));
        }

        return $this->render('RFCAdminBundle:Game:new.html.twig',
            array(
                'entity' => $updatedEntity,
                'form' => $form->createView()
            ));
    }

    /**
     * Adds the defaults elements to the give game and returns it.
     * @param Game $game
     */
    private function addDefaultProperties(Game $game)
    {
        $flashNews = Property::emptyProperty();
        $flashNews->setGame($game);
        $flashNews->setCategory("game");
        $flashNews->setName("flashNews");

        $weeklyDriver = Property::emptyProperty();
        $weeklyDriver->setGame($game);
        $weeklyDriver->setCategory("game");
        $weeklyDriver->setName("weeklyDriver");

        $game->addProperty($flashNews);
        $game->addProperty($weeklyDriver);
        return $game;
    }

    /**
     * Creates a form to create a Game entity.
     *
     * @param Game $entity
     *            The entity
     *
     * @return Form The form
     */
    private function createCreateForm(Game $entity)
    {
        $form = $this->createForm(new GameType(), $entity,
            array(
                'action' => $this->generateUrl('admin_game_create'),
                'method' => 'POST'
            ));

        return $form;
    }

    /**
     * Displays a form to create a new Game entity.
     */
    public function newAction()
    {
        $entity = new Game();

        $form = $this->createCreateForm($entity);

        return $this->render('RFCAdminBundle:Game:new.html.twig',
            array(
                'entity' => $entity,
                'form' => $form->createView()
            ));
    }

    /**
     * Finds and displays a Game entity.
     */
    public function showAction($gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:Game')->find($gameId);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Game entity.');
        }

        $deleteForm = $this->createDeleteForm($gameId);

        return $this->render('RFCAdminBundle:Game:show.html.twig',
            array(
                'entity' => $entity,
                'delete_form' => $deleteForm->createView()
            ));
    }

    /**
     * Displays a form to edit an existing Game entity.
     */
    public function editAction($gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:Game')->find($gameId);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Game entity.');
        }

        $editForm = $this->createEditForm($entity);
        $deleteForm = $this->createDeleteForm($gameId);

        return $this->render('RFCAdminBundle:Game:edit.html.twig',
            array(
                'entity' => $entity,
                'edit_form' => $editForm->createView(),
                'delete_form' => $deleteForm->createView()
            ));
    }

    /**
     * Creates a form to edit a Game entity.
     *
     * @param Game $entity
     *            The entity
     *
     * @return Form The form
     */
    private function createEditForm(Game $entity)
    {

        $form = $this->createForm(new GameType(), $entity,
            array(
                'action' => $this->generateUrl('admin_game_update',
                    array(
                        'gameId' => $entity->getId()
                    )),
                'method' => 'PUT'
            ));

        return $form;
    }

    /**
     * Edits an existing Game entity.
     */
    public function updateAction(Request $request, $gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:Game')->find($gameId);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Game entity.');
        }

        $deleteForm = $this->createDeleteForm($gameId);
        $editForm = $this->createEditForm($entity);
        $editForm->handleRequest($request);

        if ($editForm->isValid()) {

            $uploadableManager = $this->get('stof_doctrine_extensions.uploadable.manager');

            foreach ($entity->getListImages() as $image) {
                $uploadableManager->markEntityToUpload($image, $image->getPath());
            }

            $entityManager->flush();

            return $this->redirect($this->generateUrl('rfcCore_gameSelection',
                array(
                    'gameId' => $gameId
                )));
        }

        return $this->render('RFCAdminBundle:Game:edit.html.twig',
            array(
                'entity' => $entity,
                'edit_form' => $editForm->createView(),
                'delete_form' => $deleteForm->createView()
            ));
    }

    /**
     * Deletes a Game entity.
     */
    public function deleteAction(Request $request, $gameId)
    {
        $form = $this->createDeleteForm($gameId);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entity = $entityManager->getRepository('RFCCoreBundle:Game')->find($gameId);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Game entity.');
            }

            $entityManager->remove($entity);
            $entityManager->flush();
        }

        return $this->redirect($this->generateUrl('admin_game'));
    }

    /**
     * Creates a form to delete a Game entity by id.
     *
     * @param mixed $gameId
     *            The entity id
     *
     * @return Form The form
     */
    private function createDeleteForm($gameId)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('admin_game_delete',
                array(
                    'gameId' => $gameId
                )))
            ->setMethod('DELETE')
            ->add('submit', 'submit',
                array(
                    'label' => 'Delete'
                ))
            ->getForm();
    }

    public function manageAction($gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $game = $entityManager->getRepository('RFCCoreBundle:Game')->find($gameId);

        if (!$game) {
            throw $this->createNotFoundException('Unable to find Game entity.');
        }

        // Ajout du jeu sélectionné
        $menu = $this->get('rfc_admin.menu.breadcrumb');
        $menu->addChild($game->getName())
            ->setUri($this->get("router")
                ->generate('admin_game_manage',
                    array(
                        'gameId' => $gameId
                    )))
            ->setCurrent(true);
        $manipulator = new MenuManipulator();
        $manipulator->moveToPosition($menu->getChild($game->getName()), 1);

        return $this->render('RFCAdminBundle:Game:manage.html.twig',
            array(
                'game' => $game
            ));
    }
}