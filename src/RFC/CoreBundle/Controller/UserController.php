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

// src/RFC/CoreBundle/Controller/UserController.php
namespace RFC\CoreBundle\Controller;

use RFC\FrameworkBundle\Controller\RFCController;
use RFC\UserBundle\Entity\User;
use RFC\UserBundle\Form\UserFormType;
use Symfony\Component\HttpFoundation\Request;

class UserController extends RFCController {
    
    public function indexAction() {
        if ($this->getUser () !== null) {
            $entityManager = $this->getDoctrine ()->getManager ();

            $games = $entityManager->getRepository ( 'RFCCoreBundle:Game' )->findAll ();
            $championships = $entityManager
                ->getRepository ( 'RFCCoreBundle:Championship' )
                ->createQueryBuilder ( 'c' )
                ->join ( 'c.listUsers', 'u', 'WITH', 'u.id = :userId' )
                ->setParameter ( 'userId', $this->getUser ()->getId () )
                ->getQuery ()->getResult ();

            $user = $this->container->get ( 'security.context' )->getToken ()->getUser ();
            
            $crewAwaitingRequests = $entityManager
                ->getRepository ( 'RFCCoreBundle:CrewRequest' )
                ->createQueryBuilder ( 'cr' )
                ->join ( 'cr.crew', 'c')
                ->where ('cr.state = 1')
                ->andwhere ('c.manager = :userId')
                ->setParameter ( 'userId', $this->getUser ()->getId () )
                ->getQuery ()
                ->getResult ();
            
            $userForm = $this->createForm(new UserFormType('RFC\UserBundle\Entity\User'), $user, array(
                'action' => $this->generateUrl('rfcCore_user_update'),
                'method' => 'PUT',
            ));

            $userForm->add('submit', 'submit', array('label' => 'Update'));
            
            $userFormView = $userForm->createView();

            return $this->render ( 'RFCCoreBundle:User:index.html.twig',                    ['games' => $games,
                'championships' => $championships,
                'user' => $user,
                'userForm' => $userFormView,
                'crewAwaitingRequests' => $crewAwaitingRequests
                ] );
        } else {
            return $this->redirect ( $this->generateUrl ( 'fos_user_security_login' ) );
        }
    }
    
    /**
     * Edits an existing User entity.
     */
    public function updateAction(Request $request)
    {
        $user = $this->container->get ( 'security.context' )->getToken ()->getUser ();
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCUserBundle:User')->find($user->getId());

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find User entity.');
        }

        $deleteForm = $this->createDeleteForm($user->getId());
        $editForm = $this->createEditForm($entity);
        $editForm->handleRequest($request);

        if ($editForm->isValid()) {
            $entityManager->flush();

            return $this->redirect($this->generateUrl('rfcCore_user'));
        }

        return array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    private function createEditForm(User $entity)
    {
        $form = $this->createForm(new UserFormType('RFC\UserBundle\Entity\User'), $entity, array(
            'action' => $this->generateUrl('admin_user_update', array('userId' => $entity->getId())),
            'method' => 'PUT',
        ));

        $form->add('submit', 'submit', array('label' => 'Update'));

        return $form;
    }

    private function createDeleteForm($userId)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('admin_user_delete', array('userId' => $userId)))
            ->setMethod('DELETE')
            ->add('submit', 'submit', array('label' => 'Delete'))
            ->getForm()
        ;
    }
}