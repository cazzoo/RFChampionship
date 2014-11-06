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
use RFC\SetupBundle\Entity\Step;
use RFC\SetupBundle\Form\StepType;

class StepController extends Controller
{

    /**
     * Creates a new Track entity.
     */
    public function createAction(Request $request)
    {
        $entity = new Step();
        $form   = $this->createCreateForm ( $entity );
        $form->handleRequest ( $request );

        if ($form->isValid ()) {
            $em = $this->getDoctrine ()->getManager ();
            $em->persist ( $entity );
            $em->flush ();

            return $this->redirect ( $this->generateUrl ( 'rfcSetup_index' ) );
        }

        // IF ERROR
        return $this->render ( 'RFCSetupBundle:Step:new.html.twig',
                array(
                'entity' => $entity,
                'form' => $form->createView ()
            ) );
    }

    /**
     * Creates a form to create a Step entity.
     *
     * @param Step $entity
     *            The entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createCreateForm(Step $entity)
    {
        $form = $this->createForm ( new StepType (), $entity,
            array(
            'em' => $this->getDoctrine()
                ->getManager(),
            'action' => $this->generateUrl ( 'setup_step_create' ),
            'method' => 'POST'
            ) );

        $form->add ( 'submit', 'submit',
            array(
            'label' => 'Create'
        ) );

        return $form;
    }
}