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
use RFC\SetupBundle\Entity\SetupStep;
use RFC\SetupBundle\Form\SetupType;
use RFC\SetupBundle\Form\SetupStepType;
use RFC\SetupBundle\Entity\SubStep;

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
	 * Show a setup with all its setupSteps.
	 *
	 * @param type $setupId        	
	 * @param type $gameId        	
	 * @return type
	 */
	public function showAction($setupId, $gameId) {
		$em = $this->getDoctrine ()->getManager ();
		
		$setup = $em->getRepository ( 'RFCSetupBundle:Setup' )->findOneById ( $setupId );
		$stepCount = $em->getRepository ( 'RFCSetupBundle:Step' )->findBy ( array (
				'game' => $gameId 
		) );
		
		return $this->render ( 'RFCSetupBundle:Setup:show.html.twig', array (
				'gameId' => $gameId,
				'setup' => $setup,
				'stepCount' => count ( $stepCount ) 
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
			$steps = $em->getRepository ( 'RFCSetupBundle:Step' )->findby ( array (
					'game' => $gameId 
			) );
			foreach ( $steps as $step ) {
				$setupStep = new SetupStep ();
				$setupStep->setSetup ( $entity );
				$setupStep->setStep ( $step );
				$setupStep->setVersion ( 0 );
				$setupStep->setValue ( '' );
				$entity->addListSetupSteps ( $setupStep );
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
		$user = $this->container->get ( 'security.context' )->getToken ()->getUser ();
		$entity->setUser ( $user );
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
		
		return $this->render ( 'RFCSetupBundle:Setup:edit.html.twig', array (
				'entity' => $entity,
				'gameId' => $gameId,
				'edit_form' => $editForm->createView () 
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
				'gameId' => $gameId 
		) );
	}
	public function upgradeAction($setupId, $gameId) {
		$em = $this->getDoctrine ()->getManager ();
		
		$entity = $em->getRepository ( 'RFCSetupBundle:Setup' )->find ( $setupId );
		$steps = $em->getRepository ( 'RFCSetupBundle:Step' )->findBy ( array (
				'game' => $gameId 
		) );
		
		if (! $entity) {
			throw $this->createNotFoundException ( 'Unable to find Setup entity.' );
		}
		
		$stepInEntity = $entity->getOrderedSteps ();
		$lastStepOrder = end ( $stepInEntity )[0]->getStep()->getStepOrder();
		
		foreach ( $steps as $step ) {
			if ($step->getStepOrder () > $lastStepOrder) {
				$setupStep = new SetupStep ();
				$setupStep->setSetup ( $entity );
				$setupStep->setStep ( $step );
				$setupStep->setVersion ( 0 );
				$setupStep->setValue ( '' );
				$entity->addListSetupSteps ( $setupStep );
			}
		}
		
		$em->flush ();
		
		return $this->redirect ( $this->generateUrl ( 'rfcSetup_index', array (
				'gameId' => $gameId 
		) ) );
	}
	
	/**
	 * Deletes a Setup entity.
	 */
	public function deleteAction($setupId, $gameId) {
		$em = $this->getDoctrine ()->getManager ();
		$entity = $em->getRepository ( 'RFCSetupBundle:Setup' )->find ( $setupId );
		
		if (! $entity) {
			throw $this->createNotFoundException ( 'Unable to find Setup entity.' );
		}
		
		$em->remove ( $entity );
		$em->flush ();
		
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
		$form = $this->createForm ( new SetupType ( $gameId ), $entity, array (
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
	 * Creates a form to edit a Setup entity.
	 *
	 * @param Setup $entity
	 *        	The entity
	 *        	
	 * @return \Symfony\Component\Form\Form The form
	 */
	private function createEditForm(Setup $entity, $gameId) {
		$form = $this->createForm ( new SetupType ( $gameId ), $entity, array (
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
	public function showSetupStepAction($setupStepId, $setupId, $gameId) {
		$em = $this->getDoctrine ()->getManager ();
		
		$setupStep = $em->getRepository ( 'RFCSetupBundle:SetupStep' )->findOneById ( $setupStepId );
		
		return $this->render ( 'RFCSetupBundle:SetupStep:show.html.twig', array (
				'setupStep' => $setupStep,
				'gameId' => $gameId,
				'setupId' => $setupId 
		) );
	}
	
	/**
	 * Displays a form to edit an existing Setup entity.
	 */
	public function editSetupStepAction($setupStepId, $setupId, $gameId) {
		$em = $this->getDoctrine ()->getManager ();
		
		$entity = $em->getRepository ( 'RFCSetupBundle:SetupStep' )->find ( $setupStepId );
		$stepCount = $em->getRepository ( 'RFCSetupBundle:Step' )->findBy ( array (
				'game' => $gameId 
		) );
		
		$subSteps = $em->getRepository ( 'RFCSetupBundle:SubStep' )->findBy ( array (
				'step' => $entity->getStep ()->getId () 
		) );
		
		if (! $entity) {
			throw $this->createNotFoundException ( 'Unable to find SetupStep entity.' );
		}
		
		$editForm = $this->createEditSetupStepForm ( $entity, $setupId, $gameId );
		
		return $this->render ( 'RFCSetupBundle:SetupStep:edit.html.twig', array (
				'entity' => $entity,
				'edit_form' => $editForm->createView (),
				'setupId' => $setupId,
				'gameId' => $gameId,
				'stepCount' => count ( $stepCount ),
				'subSteps' => $subSteps 
		) );
	}
	
	/**
	 * Edits an existing SetupStep entity.
	 */
	public function updateSetupStepAction(Request $request, $setupStepId, $setupId, $gameId) {
		$em = $this->getDoctrine ()->getManager ();
		
		$entity = $em->getRepository ( 'RFCSetupBundle:SetupStep' )->find ( $setupStepId );
		
		if (! $entity) {
			throw $this->createNotFoundException ( 'Unable to find SetupStep entity.' );
		}
		
		if ($entity->getVersion () != 0 || ($entity->getVersion () == 0 && $entity->getValue () != null)) {
			$copy = clone $entity;
			$copy->setVersion ( $entity->getVersion () + 1 );
			$em->persist ( $copy );
			$entity = $copy;
		}
		
		$editForm = $this->createEditSetupStepForm ( $entity, $setupId, $gameId );
		$editForm->handleRequest ( $request );
		
		if ($editForm->isValid ()) {
			$em->flush ();
			
			$url = $this->generateUrl ( 'setup_show', array (
					'setupId' => $setupId,
					'gameId' => $gameId 
			) );
			
			$stepNumber = $entity->getStep ()->getStepOrder ();
			switch ($entity->getSubStep ()->getAction ()) {
				case 'next' :
					$stepNumber += 1;
					break;
				case 'stay' :
					$stepNumber = $stepNumber;
					break;
			}
			
			return $this->redirect ( sprintf ( '%s#stepNumber=%s', $url, $stepNumber ) );
		}
		
		return $this->render ( 'RFCSetupBundle:SetupStep:edit.html.twig', array (
				'entity' => $entity,
				'edit_form' => $editForm->createView (),
				'setupId' => $setupId,
				'gameId' => $gameId 
		) );
	}
	
	/**
	 * Creates a form to edit a SetupStep entity.
	 *
	 * @param Setup $entity
	 *        	The entity
	 *        	
	 * @return \Symfony\Component\Form\Form The form
	 */
	private function createEditSetupStepForm(SetupStep $entity, $setupId, $gameId) {
		$form = $this->createForm ( new SetupStepType ( $entity->getStep ()->getId () ), $entity, array (
				'em' => $this->getDoctrine ()->getManager (),
				'action' => $this->generateUrl ( 'setupStep_update', array (
						'setupStepId' => $entity->getId (),
						'setupId' => $setupId,
						'gameId' => $gameId 
				) ),
				'method' => 'PUT' 
		) );
		
		$form->add ( 'reset', 'reset', array (
				'label' => 'Reset' 
		) );
		
		$form->add ( 'submit', 'submit', array (
				'label' => 'Save' 
		) );
		
		return $form;
	}
}