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

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use RFC\CoreBundle\Entity\Result;
use RFC\CoreBundle\Form\ResultType;

/**
 * Result controller.
 */
class ResultController extends Controller {
	
	/**
	 * Lists all Result entities.
	 */
	public function indexAction() {
		$entityManager = $this->getDoctrine ()->getManager ();
		
		$entities = $entityManager->getRepository ( 'RFCCoreBundle:Result' )->findAll ();
		
		return $this->render ( 'RFCAdminBundle:Result:index.html.twig', array (
				'entities' => $entities 
		) );
	}
	
	/**
	 * Creates a new Result entity.
	 */
	public function createAction(Request $request) {
		$entity = new Result ();
		$form = $this->createCreateForm ( $entity );
		$form->handleRequest ( $request );
		
		if ($form->isValid ()) {
			$entityManager = $this->getDoctrine ()->getManager ();
			$entityManager->persist ( $entity );
			$entityManager->flush ();
			
			return $this->redirect ( $this->generateUrl ( 'admin_result_show', array (
					'resultId' => $entity->getId () 
			) ) );
		}
		
		return $this->render ( 'RFCAdminBundle:Result:new.html.twig', array (
				'entity' => $entity,
				'form' => $form->createView () 
		) );
	}
	
	/**
	 * Creates a form to create a Result entity.
	 *
	 * @param Result $entity
	 *        	The entity
	 *        	
	 * @return \Symfony\Component\Form\Form The form
	 */
	private function createCreateForm(Result $entity) {
		$form = $this->createForm ( new ResultType (), $entity, array (
				'action' => $this->generateUrl ( 'admin_result_create' ),
				'method' => 'POST' 
		) );
		
		$form->add ( 'submit', 'submit', array (
				'label' => 'Create' 
		) );
		
		return $form;
	}
	
	/**
	 * Displays a form to create a new Result entity.
	 */
	public function newAction() {
		$entity = new Result ();
		$form = $this->createCreateForm ( $entity );
		
		return $this->render ( 'RFCAdminBundle:Result:new.html.twig', array (
				'entity' => $entity,
				'form' => $form->createView () 
		) );
	}
	
	/**
	 * Finds and displays a Result entity.
	 */
	public function showAction($resultId) {
		$entityManager = $this->getDoctrine ()->getManager ();
		
		$entity = $entityManager->getRepository ( 'RFCCoreBundle:Result' )->find ( $resultId );
		
		if (! $entity) {
			throw $this->createNotFoundException ( 'Unable to find Result entity.' );
		}
		
		$deleteForm = $this->createDeleteForm ( $resultId );
		
		return $this->render ( 'RFCAdminBundle:Result:show.html.twig', array (
				'entity' => $entity,
				'delete_form' => $deleteForm->createView () 
		) );
	}
	
	/**
	 * Displays a form to edit an existing Result entity.
	 */
	public function editAction($resultId) {
		$entityManager = $this->getDoctrine ()->getManager ();
		
		$entity = $entityManager->getRepository ( 'RFCCoreBundle:Result' )->find ( $resultId );
		
		if (! $entity) {
			throw $this->createNotFoundException ( 'Unable to find Result entity.' );
		}
		
		$editForm = $this->createEditForm ( $entity );
		$deleteForm = $this->createDeleteForm ( $resultId );
		
		return $this->render ( 'RFCAdminBundle:Result:edit.html.twig', array (
				'entity' => $entity,
				'edit_form' => $editForm->createView (),
				'delete_form' => $deleteForm->createView () 
		) );
	}
	
	/**
	 * Creates a form to edit a Result entity.
	 *
	 * @param Result $entity
	 *        	The entity
	 *        	
	 * @return \Symfony\Component\Form\Form The form
	 */
	private function createEditForm(Result $entity) {
		$form = $this->createForm ( new ResultType (), $entity, array (
				'action' => $this->generateUrl ( 'admin_result_update', array (
						'resultId' => $entity->getId () 
				) ),
				'method' => 'PUT' 
		) );
		
		$form->add ( 'submit', 'submit', array (
				'label' => 'Update' 
		) );
		
		return $form;
	}
	
	/**
	 * Edits an existing Result entity.
	 */
	public function updateAction(Request $request, $resultId) {
		$entityManager = $this->getDoctrine ()->getManager ();
		
		$entity = $entityManager->getRepository ( 'RFCCoreBundle:Result' )->find ( $resultId );
		
		if (! $entity) {
			throw $this->createNotFoundException ( 'Unable to find Result entity.' );
		}
		
		$deleteForm = $this->createDeleteForm ( $resultId );
		$editForm = $this->createEditForm ( $entity );
		$editForm->handleRequest ( $request );
		
		if ($editForm->isValid ()) {
			$entityManager->flush ();
			
			return $this->redirect ( $this->generateUrl ( 'admin_result_edit', array (
					'resultId' => $resultId 
			) ) );
		}
		
		return $this->render ( 'RFCAdminBundle:Result:edit.html.twig', array (
				'entity' => $entity,
				'edit_form' => $editForm->createView (),
				'delete_form' => $deleteForm->createView () 
		) );
	}
	
	/**
	 * Deletes a Result entity.
	 */
	public function deleteAction(Request $request, $resultId) {
		$form = $this->createDeleteForm ( $resultId );
		$form->handleRequest ( $request );
		
		if ($form->isValid ()) {
			$entityManager = $this->getDoctrine ()->getManager ();
			$entity = $entityManager->getRepository ( 'RFCCoreBundle:Result' )->find ( $resultId );
			
			if (! $entity) {
				throw $this->createNotFoundException ( 'Unable to find Result entity.' );
			}
			
			$entityManager->remove ( $entity );
			$entityManager->flush ();
		}
		
		return $this->redirect ( $this->generateUrl ( 'admin_result' ) );
	}
	
	/**
	 * Creates a form to delete a Result entity by id.
	 *
	 * @param mixed $resultId
	 *        	The entity id
	 *        	
	 * @return \Symfony\Component\Form\Form The form
	 */
	private function createDeleteForm($resultId) {
		return $this->createFormBuilder ()->setAction ( $this->generateUrl ( 'admin_result_delete', array (
				'resultId' => $resultId 
		) ) )->setMethod ( 'DELETE' )->add ( 'submit', 'submit', array (
				'label' => 'Delete' 
		) )->getForm ();
	}
        
	public function setSessionResultsAction() {
		$entityManager = $this->getDoctrine ()->getManager ();
		
		$contents = array ();
		$results = array ();
		$resultsIds = array ();
		
		$content = $this->get ( "request" )->getContent ();
		if (! empty ( $content )) {
			$contents = json_decode ( $content, true ); // 2nd param to get as array
		}
		
		$firstResult = explode ( ',', $contents ['results'] [0] );
		
		if ($firstResult [3] !== null) {
			foreach ( $contents ['results'] as $contentResult ) {
				$resultData = explode ( ',', $contentResult );
				array_push ( $resultsIds, $resultData [3] );
			}
		}
		
		$session = $entityManager->getRepository ( "RFCCoreBundle:Session" )->findOneBy(array('id' => $contents ['sessionId'] ));
		$users = $entityManager->getRepository ( "RFCUserBundle:User" )->findAll ();
		$rules = $entityManager->getRepository ( "RFCCoreBundle:Rule" )->findAll ();
		
		$dbResults = $entityManager->getRepository ( "RFCCoreBundle:Result" )->createQueryBuilder ( 'r' )->where ( 'r.session = :sessionId' )->andWhere ( 'r.id IN (:arrayResultsId)' )->setParameters ( array (
				'sessionId' => $contents ['sessionId'],
				'arrayResultsId' => $resultsIds 
		) )->getQuery ()->getResult ();
		
		// List through results form ajax query
		foreach ( $contents ['results'] as $contentResult ) {
			$resultData = explode ( ',', $contentResult );
			$ruleId = $resultData [0];
			$value = $resultData [1];
			$userId = $resultData [2];
			$resultId = $resultData [3];
			$user = $this->getUserById ( $userId, $users );
			$rule = $this->getRuleById ( $ruleId, $rules );
			
			if (empty ( $dbResults )) {
				$result = new Result ();
			} else {
				$result = $this->getResultById ( $resultId, $dbResults );
			}
			$result->setRule ( $rule );
			$result->setSession ( $session );
			$result->setValue ( $value );
			$result->setUser ( $user );
			$entityManager->persist ( $result );
			array_push ( $results, $result );
		}
		
		try {
			$entityManager->flush ();
			$jsonResponse = new JsonResponse ( $results, 200 );
		} catch ( \Exception $e ) {
			$jsonResponse = new JsonResponse ( $results, 400 );
		}
		
		return $jsonResponse;
	}
	private function getRuleById($id, $ruleArray) {
		foreach ( $ruleArray as $rule ) {
			if ($rule->getId () == $id) {
				return $rule;
			}
		}
	}
	private function getUserById($id, $userArray) {
		foreach ( $userArray as $user ) {
			if ($user->getId () == $id) {
				return $user;
			}
		}
	}
	private function getResultById($id, $resultArray) {
		foreach ( $resultArray as $result ) {
			if ($result->getId () == $id) {
				return $result;
			}
		}
	}
}
