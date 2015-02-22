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

// src/RFC/CoreBundle/Controller/CoreController.php

namespace RFC\CoreBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use RFC\FrameworkBundle\Controller\RFCController;
use GitHubClient;

class CoreController extends RFCController
{

    public function indexAction()
    {

        $entityManager = $this->getDoctrine()->getManager();

        $games = $entityManager->getRepository('RFCCoreBundle:Game')->findAll();

        if (count($games) == 1) {

            return $this->redirect($games [0]->getId());
        }

        return $this->render('RFCCoreBundle:Core:index.html.twig',
                array(
                'games' => $games
        ));
    }

    public function accessGameAction($gameId)
    {

        $entityManager = $this->getDoctrine()->getManager();
        $g             = $entityManager->getRepository('RFCCoreBundle:Game')->find($gameId);
        $threadId      = null;
        $users         = $entityManager->getRepository('RFCUserBundle:User')->findAll();

        if (null != $g) {
            $threadId = substr(strrchr(get_class($g), "\\"), 1).'_'.$g->getName();
        }

        return $this->render('RFCCoreBundle:Core:gameIndex.html.twig',
                array(
                'game' => $g,
                'threadId' => $threadId,
                'users' => $users
        ));
    }

    public function gameParametersAction($gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $properties = $entityManager->getRepository('RFCCoreBundle:Property')
            ->createQueryBuilder('p')
            ->where('p.category = :categoryName')
            ->andWhere('p.game = :gameId')
            ->setParameters(array(
                'categoryName' => 'game',
                'gameId' => $gameId)
            )->getQuery()
            ->getResult();

        $users = $entityManager->getRepository('RFCUserBundle:User')->findAll();
        $game  = $entityManager->getRepository('RFCCoreBundle:Game')->find($gameId);

        return $this->render('RFCCoreBundle:Core:gameParameters.html.twig',
                array(
                'game' => $game,
                'properties' => $properties != null ? $properties : null,
                'users' => $users
        ));
    }

    public function systemParametersAction()
    {
        $entityManager = $this->getDoctrine()->getManager();

        $properties = $entityManager->getRepository('RFCCoreBundle:Property')
            ->createQueryBuilder('p')
            ->where('p.category != :category')
            ->andWhere('p.game is NULL')
            ->setParameter('category', 'user')
            ->getQuery()
            ->getResult();

        $games = $entityManager->getRepository('RFCCoreBundle:Game')->findAll();

        return $this->render('RFCCoreBundle:Core:systemParameters.html.twig',
                array(
                'games' => $games,
                'properties' => $properties
        ));
    }

    public function showGalleryAction($elementId, $elementType)
    {
        $entityManager = $this->getDoctrine()->getManager();
        $entity        = null;

        switch ($elementType) {
            case 'game' :
                $entity = $entityManager->getRepository('RFCCoreBundle:Game')->find($elementId);
                break;
            case 'vehicle' :
                $entity = $entityManager->getRepository('RFCCoreBundle:Vehicle')->find($elementId);
                break;
            case 'track' :
                $entity = $entityManager->getRepository('RFCCoreBundle:Track')->find($elementId);
                break;
            case 'typeSession' :
                $entity = $entityManager->getRepository('RFCCoreBundle:TypeSession')->find($elementId);
                break;
            case 'category' :
                $entity = $entityManager->getRepository('RFCCoreBundle:Category')->find($elementId);
                break;
        }

        return $this->render('RFCCoreBundle:Structure:gallery.html.twig',
                array(
                'listImages' => $entity->getListImages()
        ));
    }

    public function updatePropertiesAction()
    {
        $entityManager = $this->getDoctrine()->getManager();
        $properties    = $entityManager->getRepository("RFCCoreBundle:Property")->findAll();

        $params  = array();
        $content = $this->get("request")->getContent();
        if (!empty($content)) {
            $params = json_decode($content, true); // 2nd param to get as array
        }

        foreach ($properties as $property) {
            foreach ($params as $param) {
                if ($property->getId() == $param['name']) {
                    $property->setValue($param['value']);
                }
            }
        }

        try {
            $entityManager->flush();
            $this->container->get(' rfc_fwk.appSettingsLoader')->clearSession();
            $jsonResponse = new JsonResponse($properties, 200);
        } catch (\Exception $e) {
            $jsonResponse = new JsonResponse($properties, 400);
        }


        return $jsonResponse;
    }

    public function commitIssueToGithubAction(Request $request)
    {

        $owner = 'cazzoo';
        $repo  = 'RFChampionship';
        $title = 'Titre vide';
        $body  = '';

        if ($request->isMethod('POST')) {
            $params = \json_decode($request->getContent(), true);

            $user = $this->container->get('security.context')->getToken()->getUser();

            $title = $params[0]['value'];
            $body  = 'Reporter : '.$user->getUserName();
            $body .= "\r\n".$params[1]['value'];

            $client = new GitHubClient();
            $client->setCredentials('Racing-France', 'r112481632f');
            $issue  = $client->issues->createAnIssue($owner, $repo, $title,
                $body);

            return $this->render('RFCCoreBundle:Core:reportIssue.html.twig',
                    array(
                    'gitHubIssue' => $issue
            ));
        } else {
            return $this->render('RFCCoreBundle:Core:reportIssue.html.twig');
        }
    }
}