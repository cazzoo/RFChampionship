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

namespace RFC\CoreBundle\Controller;

use RFC\FrameworkBundle\Controller\RFCController;
use RFC\CoreBundle\Entity\Team;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use JMS\Serializer\SerializationContext;

/**
 * Championship controller.
 */
class ChampionshipController extends RFCController
{

    public function indexAction($gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $championships = $entityManager->getRepository('RFCCoreBundle:Championship')->createQueryBuilder('c')->where('c.game = :gameId')->setParameters(array(
            'gameId' => $gameId
        ))->getQuery()->getResult();

        $pastChampionships = array();
        $currentChampionships = array();
        $draftChampionships = array();
        foreach ($championships as $championship) {
            if ($championship->getIsDraft()) {
                array_push($draftChampionships, $championship);
            } else {
                if ($championship->getIsFinished()) {
                    array_push($pastChampionships, $championship);
                } else {
                    array_push($currentChampionships, $championship);
                }
            }
        }

        return $this->render('RFCCoreBundle:Championship:index.html.twig',
            array(
                'currentChampionships' => $currentChampionships,
                'pastChampionships' => $pastChampionships,
                'draftChampionships' => $draftChampionships
            ));
    }

    /**
     * Finds and displays a Championship entity.
     */
    public function showAction($championshipId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:Championship')->find($championshipId);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Championship entity.');
        }

        $threadId = $entity->isCommentsActive() ? substr(strrchr(get_class($entity),
                "\\"), 1) . '_' . $championshipId : null;
        return $this->render('RFCCoreBundle:Championship:show.html.twig',
            array(
                'sessions' => null,
                'eventId' => null,
                'championship' => $entity,
                'threadId' => $threadId
            ));
    }

    public function userRegistrationAction(Request $request)
    {
        if ($request->isMethod('POST')) {
            $params = \json_decode($request->getContent(), true);

            $gameId = $params ['gameId'];
            $championshipId = $params ['championshipId'];
            $userId = $params ['userId'];
            $action = $params ['action'];

            $entityManager = $this->getDoctrine()->getManager();

            $user = $entityManager->getRepository('RFCUserBundle:User')->find($userId);
            $championship = $entityManager->getRepository('RFCCoreBundle:Championship')->find($championshipId);

            switch ($action) {
                case 'register' :
                    $championship->registerUser($user);
                    $entityManager->flush();
                    break;
                case 'unregister' :
                    $championship->unregisterUser($user);
                    $entityManager->flush();
                    break;
            }
            // Returning the status of the action : 0 = nothing done, 1 = registered, 2 = unregistered
            return $this->render('RFCCoreBundle:Championship:registration.html.twig',
                array(
                    'status' => $action,
                    'championship' => $championship,
                    'gameId' => $gameId
                ));
        } else {
            return $this->render('RFCCoreBundle:Championship:registration.html.twig',
                array(
                    'status' => ''
                ));
        }
    }

    public function getResultsAction(Request $request)
    {
        if ($request->isMethod('POST')) {
            $params = \json_decode($request->getContent(), true);

            $results = array();

            $championship = $this->getDoctrine()->getManager()
                ->getRepository('RFCCoreBundle:Championship')
                ->findOneBy(array('id' => $params ['championshipId']));

            foreach ($championship->getListEvents() as $event) {
                foreach ($event->getListSessions() as $session) {
                    if ($session->getTypeSession()->isUsedForResults()) {
                        foreach ($session->getListResults() as $result) {
                            if ($result->getUser() !== null) {
                                $this->addPointsToUser($results, $result);
                            }
                        }
                    }
                }
            }

            usort($results,
                function ($a, $b) {
                    return $b['sum'] - $a['sum'];
                });

            return $this->render('RFCCoreBundle:Championship:globalResults.html.twig',
                array(
                    'results' => $results
                ));
        }
    }

    public function getEventResultsAction(Request $request)
    {
        if ($request->isMethod('POST')) {
            $params = \json_decode($request->getContent(), true);

            $results = array();

            $event = $this->getDoctrine()->getManager()
                ->getRepository('RFCCoreBundle:Event')
                ->findOneBy(array('id' => $params ['eventId']));

            foreach ($event->getListSessions() as $session) {
                if ($session->getTypeSession()->isUsedForResults()) {
                    foreach ($session->getListResults() as $result) {
                        if ($result->getUser() !== null) {
                            $this->addPointsToUser($results, $result);
                        }
                    }
                }
            }

            usort($results,
                function ($a, $b) {
                    return $b['sum'] - $a['sum'];
                });

            return $this->render('RFCCoreBundle:Championship:resultsTable.html.twig',
                array(
                    'results' => $results
                ));
        }
    }

    /**
     * Add points to users in array.
     * Create one entry if user is not in array.
     *
     * @param array $array
     *            the array with all the users
     * @param RFCCoreBundle :Result $result
     *            the result to add (user / value)
     */
    private function addPointsToUser(&$array, $result)
    {
        $user = $result->getUser();
        $value = $result->getRule()->getValue();
        if (array_key_exists($user->getId(), $array)) {
            array_push($array[$user->getId()]['results'], $result);
            $array[$user->getId()]['sum'] += $value;
        } else {
            $array[$user->getId()] = array(
                'user' => $user,
                'results' => array($result),
                'sum' => $value
            );
        }
    }

    /**
     * This action register a specified user to a specified team
     * @param type $teamid the team on which we add the user
     * @param type $drivertype the type of the driver added (main|secondary)
     * @param type $driverid The driver we want to add
     * @return JsonResponse 200 if success (with team object), 400 if issue when flusing
     */
    public function userRegisterTeamAction($teamid, $drivertype, $driverid)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $team = $entityManager->getRepository('RFCCoreBundle:Team')->findOneBy([
            'id' =>
                $teamid
        ]);
        $user = $entityManager->getRepository('RFCUserBundle:User')->findOneBy([
            'id' =>
                $driverid
        ]);

        $added = false;

        switch ($drivertype) {
            case 'main':
                if ($team->addMainDriver($user)) {
                    $added = true;
                }
                break;
            case 'secondary':
                if ($team->addSecondaryDriver($user)) {
                    $added = true;
                }
                break;
        }

        $serializer = $this->get('jms_serializer');
        $context = SerializationContext::create();
        $context->setGroups(['api']);
        $jsonData = $serializer->serialize($team, 'json', $context);

        $message = 'Error with insertion, you are already registered on this team';
        if ($added) {
            $entityManager->flush();
            $message = 'Successfully added to team';
        }

        $data = [
            'success' => $added,
            'action' => 'register user team ' . $drivertype,
            'message' => $message,
            'data' => $jsonData
        ];

        return new JsonResponse($data, 200);
    }

    /**
     * This action register a specified user to a specified team
     * @param Team $teamid the team on which we add the user
     * @param type $drivertype the type of the driver added (main|secondary)
     * @param type $driverid The driver we want to add
     * @return JsonResponse 200 if success (with team object), 400 if issue when flusing
     */
    public
    function userUnregisterTeamAction(
        $teamid,
        $drivertype,
        $driverid
    ) {
        $entityManager = $this->getDoctrine()->getManager();

        $team = $entityManager->getRepository('RFCCoreBundle:Team')->findOneBy([
            'id' =>
                $teamid
        ]);
        $user = $entityManager->getRepository('RFCUserBundle:User')->findOneBy([
            'id' =>
                $driverid
        ]);

        $removed = false;

        switch ($drivertype) {
            case 'main':
                if ($team->removeMainDriver($user)) {
                    $removed = true;
                }
                break;
            case 'secondary':
                if ($team->removeSecondaryDriver($user)) {
                    $removed = true;
                }
                break;
        }

        $success = true;
        $serializer = $this->get('jms_serializer');
        $context = SerializationContext::create();
        $context->setGroups(['api']);
        $jsonData = $serializer->serialize($team, 'json', $context);

        $message = 'Error with suppression, you are not registered on this team';
        if ($removed) {
            $message = 'Successfully removed from team';
            $entityManager->flush();
        }

        $data = [
            'success' => $success,
            'action' => 'unregister user team ' . $drivertype,
            'message' => $message,
            'data' => $jsonData
        ];

        return new JsonResponse($data, 200);
    }

    function renderTeamPopupAction($championshipId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $championship = $entityManager->getRepository('RFCCoreBundle:Championship')->findOneBy([
            'id' =>
                $championshipId
        ]);

        return $this->render('RFCCoreBundle:Championship:listTeams.html.twig',
            array(
                'championship' => $championship
            ));
    }
}