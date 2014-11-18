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

// src/RFC/SetupBundle/Controller/StepController.php
namespace RFC\SetupBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use RFC\SetupBundle\Entity\Step;
use RFC\SetupBundle\Form\StepType;

class StepController extends Controller {

    public function indexAction($gameId) {
        $em = $this->getDoctrine ()->getManager ();

        $steps = $em->getRepository ( 'RFCSetupBundle:Step' )->findAll ();

        return $this->render ( 'RFCSetupBundle:Step:index.html.twig', array (
                        'gameId' => $gameId,
                        'steps' => $steps
        ) );
    }

    /**
     * Creates a new Step entity.
     */
    public function createAction(Request $request, $gameId) {
            $entity = new Step ();
            $form = $this->createCreateForm ( $entity, $gameId );
            $form->handleRequest ( $request );

            if ($form->isValid ()) {
                    $em = $this->getDoctrine ()->getManager ();
                    $em->persist ( $entity );
                    $em->flush ();

                    return $this->redirect ( $this->generateUrl ( 'setup_step_index', array (
                                    'gameId' => $gameId
                    ) ) );
            }

            return $this->render ( 'RFCSetupBundle:Step:new.html.twig', array (
                            'entity' => $entity,
                            'form' => $form->createView ()
            ) );
    }

    /**
     * Displays a form to create a new Step entity.
     */
    public function newAction($gameId) {
            $entity = new Step ();
            $em = $this->getDoctrine ()->getManager ();
            $entityGame = $em->getRepository ( 'RFCCoreBundle:Game' )->find ( $gameId );
            $max_value = $em->getRepository('RFCSetupBundle:Step')->findLastStepId( $gameId );
            $max_value['stepOrder'] = ( null == $max_value ? 1 : $max_value['stepOrder'] + 1);
            $entity->setStepOrder($max_value['stepOrder']);
            $entity->setGame ( $entityGame );
            $form = $this->createCreateForm ( $entity, $gameId );

            return $this->render ( 'RFCSetupBundle:Step:new.html.twig', array (
                            'entity' => $entity,
                            'form' => $form->createView (),
                            'gameId' => $gameId
            ) );
    }

    /**
     * Displays a form to edit an existing Step entity.
     */
    public function editAction($stepId, $gameId) {
            $em = $this->getDoctrine ()->getManager ();

            $entity = $em->getRepository ( 'RFCSetupBundle:Step' )->find ( $stepId );

            if (! $entity) {
                    throw $this->createNotFoundException ( 'Unable to find Step entity.' );
            }

            $editForm = $this->createEditForm ( $entity, $gameId );

            return $this->render ( 'RFCSetupBundle:Step:edit.html.twig', array (
                            'entity' => $entity,
                            'gameId' => $gameId,
                            'edit_form' => $editForm->createView ()
            ) );
    }

    /**
     * Edits an existing Step entity.
     */
    public function updateAction(Request $request, $stepId, $gameId) {
            $em = $this->getDoctrine ()->getManager ();

            $entity = $em->getRepository ( 'RFCSetupBundle:Step' )->find ( $stepId );

            if (! $entity) {
                    throw $this->createNotFoundException ( 'Unable to find Step entity.' );
            }

            $editForm = $this->createEditForm ( $entity, $gameId );
            $editForm->handleRequest ( $request );

            if ($editForm->isValid ()) {
                    $em->flush ();

                    return $this->redirect ( $this->generateUrl ( 'setup_step_index', array (
                                    'gameId' => $gameId
                    ) ) );
            }

            return $this->render ( 'RFCSetupBundle:Step:edit.html.twig', array (
                            'entity' => $entity,
                            'edit_form' => $editForm->createView (),
                            'gameId' => $gameId
            ) );
    }

    /**
     * Deletes a Step entity.
     */
    public function deleteAction($stepId, $gameId) {

            $em = $this->getDoctrine ()->getManager ();
            $entity = $em->getRepository ( 'RFCSetupBundle:Step' )->find ( $stepId );

            if (! $entity) {
                    throw $this->createNotFoundException ( 'Unable to find Step entity.' );
            }

            $em->remove ( $entity );
            $em->flush ();

            return $this->redirect ( $this->generateUrl ( 'rfcSetup_index', array (
                            'gameId' => $gameId
            ) ) );
    }

    /**
     * Creates a form to create a Step entity.
     *
     * @param Step $entity
     *        	The entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createCreateForm(Step $entity, $gameId) {
            $form = $this->createForm ( new StepType (), $entity, array (
                            'em' => $this->getDoctrine ()->getManager (),
                            'action' => $this->generateUrl ( 'setup_step_create', array (
                                            'gameId' => $gameId
                            ) ),
                            'method' => 'POST'
            ) );

            $form->add ( 'submit', 'submit', array (
                            'label' => 'Create'
            ) );

            return $form;
    }

    /**
     * Creates a form to delete a Step entity by id.
     *
     * @param mixed $stepId
     *        	The entity id
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($stepId, $gameId) {
            return $this->createFormBuilder ()->setAction ( $this->generateUrl ( 'setup_step_delete', array (
                            'stepId' => $stepId,
                            'gameId' => $gameId
            ) ) )->setMethod ( 'DELETE' )->add ( 'submit', 'submit', array (
                            'label' => 'Delete'
            ) )->getForm ();
    }

    /**
     * Creates a form to edit a Step entity.
     *
     * @param Step $entity
     *        	The entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createEditForm(Step $entity, $gameId) {
            $form = $this->createForm ( new StepType (), $entity, array (
                            'em' => $this->getDoctrine ()->getManager (),
                            'action' => $this->generateUrl ( 'setup_step_update', array (
                                            'stepId' => $entity->getId (),
                                            'gameId' => $gameId
                            ) ),
                            'method' => 'PUT'
            ) );

            $form->add ( 'submit', 'submit', array (
                            'label' => 'Update'
            ) );

            return $form;
    }
}