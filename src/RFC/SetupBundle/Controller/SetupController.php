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

// src/RFC/SetupBundle/Controller/SetupController.php
namespace RFC\SetupBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use RFC\SetupBundle\Entity\Setup;
use RFC\SetupBundle\Entity\Step;
use RFC\SetupBundle\Entity\SetupStep;
use RFC\SetupBundle\Form\SetupType;

class SetupController extends Controller {
	public function indexAction($gameId) {
		$em = $this->getDoctrine ()->getManager ();
		
		$setups = $em->getRepository ( 'RFCSetupBundle:Setup' )->findAll ();
		$steps = $em->getRepository ( 'RFCSetupBundle:Step' )->findAll ();
		
		return $this->render ( 'RFCSetupBundle:Setup:index.html.twig', array (
				'gameId' => $gameId,
				'setups' => $setups,
				'steps' => $steps 
		) );
	}

        public function debugAction() {
            $em = $this->getDoctrine ()->getManager ();

		$setups = $em->getRepository ( 'RFCSetupBundle:Setup' )->findAll ();
		$steps = $em->getRepository ( 'RFCSetupBundle:Step' )->findAll ();

		return $this->render ( 'RFCSetupBundle:Setup:debug.html.twig', array (
				'setups' => $setups,
				'steps' => $steps
		) );
        }

        /**
	 * Creates a new Setup entity.
	 */
	public function createAction(Request $request, $gameId) {
		$entity = new Setup ();
		$form = $this->createCreateForm ( $entity, $gameId );
		$form->handleRequest ( $request );

		if ($form->isValid ()) {
			$em = $this->getDoctrine ()->getManager ();
                        $steps = $em->getRepository ( 'RFCSetupBundle:Step' )->findby( array( 'game' => $gameId ) );

                        foreach ($steps as $step) {
                            $setupStep = new SetupStep();
                            $setupStep->setSetup($entity);
                            $setupStep->setStep($step);
                            $setupStep->setVersion(0);
                            $setupStep->setValue('');
                            $entity->addListSetupSteps($setupStep);
                        }
			$em->persist ( $entity );
			$em->flush ();

			return $this->redirect ( $this->generateUrl ( 'rfcSetup_index', array (
					'gameId' => $gameId
			) ) );
		}

		return $this->render ( 'RFCSetupBundle:Setup:new.html.twig', array (
				'entity' => $entity,
				'form' => $form->createView ()
		) );
	}

	/**
	 * Displays a form to create a new Setup entity.
	 */
	public function newAction($gameId) {
		$entity = new Setup ();
		$em = $this->getDoctrine ()->getManager ();
		$user = $this->container->get ( 'security.context' )->getToken ()->getUser ();
                $entity->setUser($user);
		$form = $this->createCreateForm ( $entity, $gameId );

		return $this->render ( 'RFCSetupBundle:Setup:new.html.twig', array (
				'entity' => $entity,
				'form' => $form->createView (),
				'gameId' => $gameId
		) );
	}

	/**
	 * Displays a form to edit an existing Setup entity.
	 */
	public function editAction($setupId, $gameId) {
		$em = $this->getDoctrine ()->getManager ();

		$entity = $em->getRepository ( 'RFCSetupBundle:Setup' )->find ( $setupId );

		if (! $entity) {
			throw $this->createNotFoundException ( 'Unable to find Setup entity.' );
		}

		$editForm = $this->createEditForm ( $entity, $gameId );
		$deleteForm = $this->createDeleteForm ( $setupId, $gameId );

		return $this->render ( 'RFCSetupBundle:Setup:edit.html.twig', array (
				'entity' => $entity,
				'gameId' => $gameId,
				'edit_form' => $editForm->createView (),
				'delete_form' => $deleteForm->createView ()
		) );
	}

	/**
	 * Edits an existing Setup entity.
	 */
	public function updateAction(Request $request, $setupId, $gameId) {
		$em = $this->getDoctrine ()->getManager ();

		$entity = $em->getRepository ( 'RFCSetupBundle:Setup' )->find ( $setupId );

		if (! $entity) {
			throw $this->createNotFoundException ( 'Unable to find Setup entity.' );
		}

		$deleteForm = $this->createDeleteForm ( $setupId, $gameId );
		$editForm = $this->createEditForm ( $entity, $gameId );
		$editForm->handleRequest ( $request );

		if ($editForm->isValid ()) {
			$em->flush ();

			return $this->redirect ( $this->generateUrl ( 'rfcSetup_index', array (
					'gameId' => $gameId
			) ) );
		}

		return $this->render ( 'RFCSetupBundle:Setup:edit.html.twig', array (
				'entity' => $entity,
				'edit_form' => $editForm->createView (),
				'delete_form' => $deleteForm->createView (),
				'gameId' => $gameId
		) );
	}

	/**
	 * Deletes a Setup entity.
	 */
	public function deleteAction(Request $request, $setupId, $gameId) {
		$form = $this->createDeleteForm ( $setupId, $gameId );
		$form->handleRequest ( $request );

		if ($form->isValid ()) {
			$em = $this->getDoctrine ()->getManager ();
			$entity = $em->getRepository ( 'RFCSetupBundle:Setup' )->find ( $setupId );

			if (! $entity) {
				throw $this->createNotFoundException ( 'Unable to find Setup entity.' );
			}

			$em->remove ( $entity );
			$em->flush ();
		}

		return $this->redirect ( $this->generateUrl ( 'rfcSetup_index', array (
				'gameId' => $gameId
		) ) );
	}

	/**
	 * Creates a form to create a Setup entity.
	 *
	 * @param Setup $entity
	 *        	The entity
	 *
	 * @return \Symfony\Component\Form\Form The form
	 */
	private function createCreateForm(Setup $entity, $gameId) {
		$form = $this->createForm ( new SetupType ($gameId), $entity, array (
				'em' => $this->getDoctrine ()->getManager (),
				'action' => $this->generateUrl ( 'setup_create', array (
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
	 * Creates a form to delete a Setup entity by id.
	 *
	 * @param mixed $setupId
	 *        	The entity id
	 *
	 * @return \Symfony\Component\Form\Form The form
	 */
	private function createDeleteForm($setupId, $gameId) {
		return $this->createFormBuilder ()->setAction ( $this->generateUrl ( 'setup_delete', array (
				'setupId' => $setupId,
				'gameId' => $gameId
		) ) )->setMethod ( 'DELETE' )->add ( 'submit', 'submit', array (
				'label' => 'Delete'
		) )->getForm ();
	}

	/**
	 * Creates a form to edit a Setup entity.
	 *
	 * @param Setup $entity
	 *        	The entity
	 *
	 * @return \Symfony\Component\Form\Form The form
	 */
	private function createEditForm(Setup $entity, $gameId) {
		$form = $this->createForm ( new SetupType ($gameId), $entity, array (
				'em' => $this->getDoctrine ()->getManager (),
				'action' => $this->generateUrl ( 'setup_update', array (
						'setupId' => $entity->getId (),
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