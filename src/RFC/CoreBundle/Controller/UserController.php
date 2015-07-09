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

class UserController extends RFCController
{

    public function indexAction(Request $request)
    {

        $entityManager = $this->getDoctrine()->getManager();

        $games         = $entityManager->getRepository('RFCCoreBundle:Game')->findAll();
        $championships = $entityManager
                ->getRepository('RFCCoreBundle:Championship')
                ->createQueryBuilder('c')
                ->join('c.listUsers', 'u', 'WITH', 'u.id = :userId')
                ->setParameter('userId', $this->getUser()->getId())
                ->getQuery()->getResult();

        $user = $this->container->get('security.context')->getToken()->getUser();

        $crewAwaitingRequests = $entityManager
            ->getRepository('RFCCoreBundle:CrewRequest')
            ->createQueryBuilder('cr')
            ->join('cr.crew', 'c')
            ->where('cr.state = 1')
            ->andwhere('c.manager = :userId')
            ->setParameter('userId', $this->getUser()->getId())
            ->getQuery()
            ->getResult();

        $userForm = $this->createEditForm($user);
        $userForm->handleRequest($request);

        if ($userForm->isValid()) {
            $entityManager->flush();

            $this->get('ras_flash_alert.alert_reporter')->addSuccess("Vos paramètres ont été correctement mis à jour");

            return $this->redirect($this->generateUrl('rfcCore_user'));
        } else {

            $this->get('ras_flash_alert.alert_reporter')->addError("Un des champs du formulaire est incorrect");

            return $this->render('RFCCoreBundle:User:index.html.twig',
                    [
                    'games' => $games,
                    'championships' => $championships,
                    'user' => $user,
                    'userForm' => $userForm->createView(),
                    'crewAwaitingRequests' => $crewAwaitingRequests
            ]);
        }

        return $this->render('RFCCoreBundle:User:index.html.twig',
                [
                'games' => $games,
                'championships' => $championships,
                'user' => $user,
                'userForm' => $userForm->createView(),
                'crewAwaitingRequests' => $crewAwaitingRequests
        ]);
    }

    private function createEditForm(User $entity)
    {
        $form = $this->createForm(new UserFormType('RFC\UserBundle\Entity\User'),
            $entity,
            array('action' => $this->generateUrl('rfcCore_user',
                array('userId' => $entity->getId())),
            'method' => 'PUT',
        ));

        $form->add('submit', 'submit', array('label' => 'Update'));

        return $form;
    }
}