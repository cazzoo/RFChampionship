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
use RFC\CoreBundle\Entity\MetaRule;
use RFC\CoreBundle\Form\Type\MetaRuleType;
use RFC\FrameworkBundle\Controller\RFCController;
use Symfony\Component\Form\Form;
use Symfony\Component\HttpFoundation\Request;

/**
 * MetaRule controller.
 */
class MetaRuleController extends RFCController
{

    /**
     * Lists all MetaRule entities.
     */
    public function indexAction($gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $metaRules = $entityManager->getRepository('RFCCoreBundle:MetaRule')->findBy(array(
            'game' => $gameId
        ));
        $rules = $entityManager->getRepository('RFCCoreBundle:Rule')->findBy(array(
            'game' => $gameId
        ), array(
            'typeSession' => 'ASC',
            'value' => 'DESC'
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

        return $this->render('RFCAdminBundle:MetaRule:index.html.twig', array(
            'metaRules' => $metaRules,
            'rules' => $rules,
            'gameId' => $gameId,
            'game' => $game
        ));
    }

    /**
     * Creates a new MetaRule entity.
     */
    public function createAction(Request $request, $gameId)
    {
        $entity = new MetaRule();
        $form = $this->createCreateForm($entity, $gameId);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($entity);
            $entityManager->flush();

            return $this->redirect($this->generateUrl('rfcCore_gameParameters', array(
                    'gameId' => $gameId,
                )) . '#/metarules');
        }

        return $this->render('RFCAdminBundle:MetaRule:new.html.twig', array(
            'entity' => $entity,
            'form' => $form->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Creates a form to create a MetaRule entity.
     *
     * @param MetaRule $entity
     *            The entity
     *
     * @return Form The form
     */
    private function createCreateForm(MetaRule $entity, $gameId)
    {
        $form = $this->createForm(new MetaRuleType($gameId), $entity, array(
            'em' => $this->getDoctrine()
                ->getManager(),
            'action' => $this->generateUrl('admin_metaRule_create', array(
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
     * Displays a form to create a new MetaRule entity.
     */
    public function newAction($gameId)
    {
        $entity = new MetaRule();
        $entityManager = $this->getDoctrine()->getManager();
        $entityGame = $entityManager->getRepository('RFCCoreBundle:Game')->find($gameId);
        $entity->setGame($entityGame);
        $form = $this->createCreateForm($entity, $gameId);

        return $this->render('RFCAdminBundle:MetaRule:new.html.twig', array(
            'entity' => $entity,
            'form' => $form->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Finds and displays a MetaRule entity.
     */
    public function showAction($metaRuleId, $gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:MetaRule')->find($metaRuleId);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find MetaRule entity.');
        }

        $deleteForm = $this->createDeleteForm($metaRuleId, $gameId);

        return $this->render('RFCAdminBundle:MetaRule:show.html.twig', array(
            'entity' => $entity,
            'delete_form' => $deleteForm->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Displays a form to edit an existing MetaRule entity.
     */
    public function editAction($metaRuleId, $gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:MetaRule')->find($metaRuleId);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find MetaRule entity.');
        }

        $editForm = $this->createEditForm($entity, $gameId);
        $deleteForm = $this->createDeleteForm($metaRuleId, $gameId);

        return $this->render('RFCAdminBundle:MetaRule:edit.html.twig', array(
            'entity' => $entity,
            'gameId' => $gameId,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView()
        ));
    }

    /**
     * Creates a form to edit a MetaRule entity.
     *
     * @param MetaRule $entity
     *            The entity
     *
     * @return Form The form
     */
    private function createEditForm(MetaRule $entity, $gameId)
    {
        $form = $this->createForm(new MetaRuleType($gameId), $entity, array(
            'em' => $this->getDoctrine()
                ->getManager(),
            'action' => $this->generateUrl('admin_metaRule_update', array(
                'metaRuleId' => $entity->getId(),
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
     * Edits an existing MetaRule entity.
     */
    public function updateAction(Request $request, $metaRuleId, $gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:MetaRule')->find($metaRuleId);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find MetaRule entity.');
        }

        $deleteForm = $this->createDeleteForm($metaRuleId, $gameId);
        $editForm = $this->createEditForm($entity, $gameId);
        $editForm->handleRequest($request);

        if ($editForm->isValid()) {
            $entityManager->flush();

            return $this->redirect($this->generateUrl('rfcCore_gameParameters', array(
                    'gameId' => $gameId,
                )) . '#/metarules');
        }

        return $this->render('RFCAdminBundle:MetaRule:edit.html.twig', array(
            'entity' => $entity,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Deletes a MetaRule entity.
     */
    public function deleteAction(Request $request, $metaRuleId, $gameId)
    {
        $form = $this->createDeleteForm($metaRuleId, $gameId);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entity = $entityManager->getRepository('RFCCoreBundle:MetaRule')->find($metaRuleId);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find MetaRule entity.');
            }

            $entityManager->remove($entity);
            $entityManager->flush();
        }

        return $this->redirect($this->generateUrl('rfcCore_gameParameters', array(
                'gameId' => $gameId,
            )) . '#/metarules');
    }

    /**
     * Creates a form to delete a MetaRule entity by id.
     *
     * @param mixed $metaRuleId
     *            The entity id
     *
     * @return Form The form
     */
    private function createDeleteForm($metaRuleId, $gameId)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('admin_metaRule_delete', array(
                'metaRuleId' => $metaRuleId,
                'gameId' => $gameId
            )))
            ->setMethod('DELETE')
            ->add('submit', 'submit', array(
                'label' => 'Delete'
            ))
            ->getForm();
    }
}
