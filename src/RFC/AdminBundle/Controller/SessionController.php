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
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use RFC\CoreBundle\Entity\Session;
use RFC\CoreBundle\Form\SessionType;
use Symfony\Component\HttpFoundation\JsonResponse;
use JMS\Serializer\SerializerBuilder;

/**
 * Session controller.
 */
class SessionController extends Controller {
	
	/**
	 * Creates a new Session entity.
	 */
	public function createAction(Request $request, $gameId, $championshipId, $eventId) {
		$entity = new Session ();
		$form = $this->createCreateForm ( $entity, $gameId, $championshipId, $eventId );
		$form->handleRequest ( $request );
		
		if ($form->isValid ()) {
			$em = $this->getDoctrine ()->getManager ();
			$em->persist ( $entity );
			$em->flush ();
			
			return $this->redirect ( $this->generateUrl ( 'admin_championship_show', array (
					'sessionId' => $entity->getId (),
					'gameId' => $gameId,
					'championshipId' => $championshipId,
					'eventId' => $eventId 
			) ) );
		}
		
		return $this->render ( 'RFCAdminBundle:Session:new.html.twig', array (
				'entity' => $entity,
				'form' => $form->createView (),
				'gameId' => $gameId,
				'championshipId' => $championshipId,
				'eventId' => $eventId 
		) );
	}
	
	/**
	 * Creates a form to create a Session entity.
	 *
	 * @param Session $entity
	 *        	The entity
	 *        	
	 * @return \Symfony\Component\Form\Form The form
	 */
	private function createCreateForm(Session $entity, $gameId, $championshipId, $eventId) {
		$form = $this->createForm ( new SessionType ( $gameId ), $entity, array (
				'em' => $this->getDoctrine ()->getManager (),
				'action' => $this->generateUrl ( 'admin_session_create', array (
						'gameId' => $gameId,
						'championshipId' => $championshipId,
						'eventId' => $eventId 
				) ),
				'method' => 'POST' 
		) );
		
		$form->add ( 'submit', 'submit', array (
				'label' => 'Create' 
		) );
		
		return $form;
	}
	
	/**
	 * Displays a form to create a new Session entity.
	 */
	public function newAction($gameId, $championshipId, $eventId) {
		$em = $this->getDoctrine ()->getManager ();
		$entity = new Session ();
		$event = $em->getRepository ( 'RFCCoreBundle:Event' )->findById ( $eventId );
		$entity->setEvent ( $event [0] );
		$form = $this->createCreateForm ( $entity, $gameId, $championshipId, $eventId );
		
		return $this->render ( 'RFCAdminBundle:Session:new.html.twig', array (
				'entity' => $entity,
				'form' => $form->createView (),
				'gameId' => $gameId,
				'championshipId' => $championshipId,
				'eventId' => $eventId 
		) );
	}
	
	/**
	 * Finds and displays a Session entity.
	 */
	public function showAction($sessionId, $gameId, $championshipId, $eventId) {
		$em = $this->getDoctrine ()->getManager ();
		
		$entity = $em->getRepository ( 'RFCCoreBundle:Session' )->find ( $sessionId );
		
		if (! $entity) {
			throw $this->createNotFoundException ( 'Unable to find Session entity.' );
		}
		
		$deleteForm = $this->createDeleteForm ( $sessionId, $gameId, $championshipId, $eventId );
		
		return $this->render ( 'RFCAdminBundle:Session:show.html.twig', array (
				'entity' => $entity,
				'delete_form' => $deleteForm->createView (),
				'gameId' => $gameId,
				'championshipId' => $championshipId,
				'eventId' => $eventId 
		) );
	}
	
	/**
	 * Displays a form to edit an existing Session entity.
	 */
	public function editAction($sessionId, $gameId, $championshipId, $eventId) {
		$em = $this->getDoctrine ()->getManager ();
		
		$entity = $em->getRepository ( 'RFCCoreBundle:Session' )->find ( $sessionId );
		
		if (! $entity) {
			throw $this->createNotFoundException ( 'Unable to find Session entity.' );
		}
		
		$editForm = $this->createEditForm ( $entity, $gameId, $championshipId, $eventId );
		$deleteForm = $this->createDeleteForm ( $sessionId, $gameId, $championshipId, $eventId );
		
		return $this->render ( 'RFCAdminBundle:Session:edit.html.twig', array (
				'entity' => $entity,
				'edit_form' => $editForm->createView (),
				'delete_form' => $deleteForm->createView (),
				'gameId' => $gameId,
				'championshipId' => $championshipId,
				'eventId' => $eventId 
		) );
	}
	
	/**
	 * Creates a form to edit a Session entity.
	 *
	 * @param Session $entity
	 *        	The entity
	 *        	
	 * @return \Symfony\Component\Form\Form The form
	 */
	private function createEditForm(Session $entity, $gameId, $championshipId, $eventId) {
		$form = $this->createForm ( new SessionType ($gameId), $entity, array (
				'em' => $this->getDoctrine ()->getManager (),
				'action' => $this->generateUrl ( 'admin_session_update', array (
						'sessionId' => $entity->getId (),
						'gameId' => $gameId,
						'championshipId' => $championshipId,
						'eventId' => $eventId 
				) ),
				'method' => 'PUT' 
		) );
		
		$form->add ( 'submit', 'submit', array (
				'label' => 'Update' 
		) );
		
		return $form;
	}
	
	/**
	 * Edits an existing Session entity.
	 */
	public function updateAction(Request $request, $sessionId, $gameId, $championshipId, $eventId) {
		$em = $this->getDoctrine ()->getManager ();
		
		$entity = $em->getRepository ( 'RFCCoreBundle:Session' )->find ( $sessionId );
		
		if (! $entity) {
			throw $this->createNotFoundException ( 'Unable to find Session entity.' );
		}
		
		$deleteForm = $this->createDeleteForm ( $sessionId, $gameId, $championshipId, $eventId );
		$editForm = $this->createEditForm ( $entity, $gameId, $championshipId, $eventId );
		$editForm->handleRequest ( $request );
		
		if ($editForm->isValid ()) {
			$em->flush ();
			
			return $this->redirect ( $this->generateUrl ( 'admin_championship_show', array (
					'sessionId' => $entity->getId (),
					'gameId' => $gameId,
					'championshipId' => $championshipId,
					'eventId' => $eventId 
			) ) );
		}
		
		return $this->render ( 'RFCAdminBundle:Session:edit.html.twig', array (
				'entity' => $entity,
				'edit_form' => $editForm->createView (),
				'delete_form' => $deleteForm->createView (),
				'gameId' => $gameId,
				'championshipId' => $championshipId,
				'eventId' => $eventId 
		) );
	}
	
	/**
	 * Deletes a Session entity.
	 */
	public function deleteAction(Request $request, $sessionId, $gameId, $championshipId, $eventId) {
		$form = $this->createDeleteForm ( $sessionId, $gameId, $championshipId, $eventId );
		$form->handleRequest ( $request );
		
		if ($form->isValid ()) {
			$em = $this->getDoctrine ()->getManager ();
			$entity = $em->getRepository ( 'RFCCoreBundle:Session' )->find ( $sessionId );
			
			if (! $entity) {
				throw $this->createNotFoundException ( 'Unable to find Session entity.' );
			}
			
			$em->remove ( $entity );
			$em->flush ();
		}
		
		return $this->redirect ( $this->generateUrl ( 'admin_session' ), array (
				'gameId' => $gameId,
				'championshipId' => $championshipId,
				'eventId' => $eventId 
		) );
	}
	
	/**
	 * Creates a form to delete a Session entity by id.
	 *
	 * @param mixed $sessionId
	 *        	The entity id
	 *        	
	 * @return \Symfony\Component\Form\Form The form
	 */
	private function createDeleteForm($sessionId, $gameId, $championshipId, $eventId) {
		return $this->createFormBuilder ()->setAction ( $this->generateUrl ( 'admin_session_delete', array (
				'sessionId' => $sessionId,
				'gameId' => $gameId,
				'championshipId' => $championshipId,
				'eventId' => $eventId 
		) ) )->setMethod ( 'DELETE' )->add ( 'submit', 'submit', array (
				'label' => 'Delete' 
		) )->getForm ();
	}
	public function searchAction() {
		$request = Request::createFromGlobals ();
		
		if ($request->isXmlHttpRequest ()) {
			
			$gameId = $request->request->get ( 'gameId' );
			$championshipId = $request->request->get ( 'championshipId' );
			$eventId = $request->request->get ( 'eventId' );
			
			$form = $this->createCreateForm ( new Session (), $gameId, $championshipId, $eventId );
			
			$em = $this->getDoctrine ()->getManager ();
			$sessions = $em->getRepository ( 'RFCCoreBundle:Session' )->findBy ( array (
					'event' => $eventId 
			) );
			
			return $this->render ( 'RFCAdminBundle:Session:list.html.twig', array (
					'gameId' => $gameId,
					'championshipId' => $championshipId,
					'sessions' => $sessions,
					'eventId' => $eventId,
					'form' => $form->createView () 
			) );
		} else
			return $this->render ( 'RFCAdminBundle:Session:list.html.twig', array (
					'sessions' => null 
			) );
	}
	public function sessionLoadAction() {
		$params = array ();
		$content = $this->get ( "request" )->getContent ();
		if (! empty ( $content )) {
			$params = json_decode ( $content, true );
		}
		
		$em = $this->getDoctrine ()->getManager ();
		$session = $em->getRepository ( 'RFCCoreBundle:Session' )->findOneById ( $params ['sessionId'] );
		
		return $this->render ( 'RFCAdminBundle:Session:showSession.html.twig', array (
				'session' => $session 
		) );
	}
}
