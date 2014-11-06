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
use Symfony\Component\HttpFoundation\Response;
use RFC\SetupBundle\Entity\Setup;

class SetupController extends Controller
{

    public function indexAction()
    {
        $em = $this->getDoctrine ()->getManager ();

        $setups = $em->getRepository ( 'RFCSetupBundle:Setup' )->findAll ();

        return $this->render ( 'RFCSetupBundle:Setup:index.html.twig',
                array(
                'setups' => $setups
            ) );
    }
}