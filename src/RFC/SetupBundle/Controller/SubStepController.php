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
use RFC\SetupBundle\Entity\SubStep;
use RFC\SetupBundle\Form\SubStepType;

class SubStepController extends Controller {
	
	/**
	 * Creates a new Step entity.
	 */
	public function createAction(Request $request, $gameId, $stepId) {
		$entity = new SubStep ();
		$form = $this->createCreateForm ( $entity, $stepId, $gameId );
		$form->handleRequest ( $request );
		
		if ($form->isValid ()) {
			$em = $this->getDoctrine ()->getManager ();
			$em->persist ( $entity );
			$em->flush ();
			
			return $this->redirect ( $this->generateUrl ( 'rfcSetup_index', array (
					'gameId' => $gameId 
			) ) );
		}
		
		return $this->render ( 'RFCSetupBundle:SubStep:new.html.twig', array (
				'entity' => $entity,
				'form' => $form->createView (),
                                'stepId' => $stepId,
				'gameId' => $gameId
		) );
	}
	
	/**
	 * Displays a form to create a new Step entity.
	 */
	public function newAction($gameId, $stepId) {
		$entity = new SubStep ();
		$em = $this->getDoctrine ()->getManager ();
		$entityStep = $em->getRepository ( 'RFCSetupBundle:Step' )->find ( $stepId );
		$entity->setStep( $entityStep );
		$form = $this->createCreateForm ( $entity, $stepId, $gameId );
		
		return $this->render ( 'RFCSetupBundle:SubStep:new.html.twig', array (
				'entity' => $entity,
				'form' => $form->createView (),
                                'stepId' => $stepId,
				'gameId' => $gameId 
		) );
	}
	
	/**
	 * Displays a form to edit an existing Step entity.
	 */
	public function editAction($subStepId, $stepId, $gameId) {
		$em = $this->getDoctrine ()->getManager ();
		
		$entity = $em->getRepository ( 'RFCSetupBundle:SubStep' )->find ( $subStepId );
		
		if (! $entity) {
			throw $this->createNotFoundException ( 'Unable to find Step entity.' );
		}
		
		$editForm = $this->createEditForm ( $entity, $stepId, $gameId );
		$deleteForm = $this->createDeleteForm ( $stepId, $stepId, $gameId );
		
		return $this->render ( 'RFCSetupBundle:SubStep:edit.html.twig', array (
				'entity' => $entity,
				'stepId' => $stepId,
				'gameId' => $gameId,
				'edit_form' => $editForm->createView (),
				'delete_form' => $deleteForm->createView () 
		) );
	}
	
	/**
	 * Edits an existing Step entity.
	 */
	public function updateAction(Request $request, $subStepId, $stepId, $gameId) {
		$em = $this->getDoctrine ()->getManager ();
		
		$entity = $em->getRepository ( 'RFCSetupBundle:SubStep' )->find ( $subStepId );
		
		if (! $entity) {
			throw $this->createNotFoundException ( 'Unable to find Step entity.' );
		}
		
		$deleteForm = $this->createDeleteForm ( $subStepId, $stepId, $gameId );
		$editForm = $this->createEditForm ( $entity, $stepId, $gameId );
		$editForm->handleRequest ( $request );
		
		if ($editForm->isValid ()) {
			$em->flush ();
			
			return $this->redirect ( $this->generateUrl ( 'rfcSetup_index', array (
					'gameId' => $gameId 
			) ) );
		}
		
		return $this->render ( 'RFCSetupBundle:Step:edit.html.twig', array (
				'entity' => $entity,
				'edit_form' => $editForm->createView (),
				'delete_form' => $deleteForm->createView (),
				'gameId' => $gameId 
		) );
	}
	
	/**
	 * Deletes a Step entity.
	 */
	public function deleteAction(Request $request, $subStepId, $stepId, $gameId) {
		$form = $this->createDeleteForm ( $subStepId, $stepId, $gameId );
		$form->handleRequest ( $request );
		
		if ($form->isValid ()) {
			$em = $this->getDoctrine ()->getManager ();
			$entity = $em->getRepository ( 'RFCSetupBundle:SubStep' )->find ( $subStepId );
			
			if (! $entity) {
				throw $this->createNotFoundException ( 'Unable to find Step entity.' );
			}
			
			$em->remove ( $entity );
			$em->flush ();
		}
		
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
	private function createCreateForm(SubStep $entity, $stepId, $gameId) {
		$form = $this->createForm ( new SubStepType (), $entity, array (
				'em' => $this->getDoctrine ()->getManager (),
				'action' => $this->generateUrl ( 'setup_subStep_create', array (
                                                'stepId' => $stepId,
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
	private function createDeleteForm($subStepId, $stepId, $gameId) {
		return $this->createFormBuilder ()->setAction ( $this->generateUrl ( 'setup_subStep_delete', array (
				'stepId' => $stepId,
				'subStepId' => $subStepId,
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
	private function createEditForm(SubStep $entity, $stepId, $gameId) {
		$form = $this->createForm ( new SubStepType (), $entity, array (
				'em' => $this->getDoctrine ()->getManager (),
				'action' => $this->generateUrl ( 'setup_subStep_update', array (
                                                'stepId' => $stepId,
						'subStepId' => $entity->getId (),
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