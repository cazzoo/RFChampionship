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

use RFC\CoreBundle\Entity\Registration;
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
                    $championship->addRegistration(new Registration($championship, $user));
                    $championship->registerUser($user);
                    $entityManager->flush();
                    break;
                case 'unregister' :
                    $userRegistration = $championship->getUserRegistration($user->getUsername());
                    $championship->removeRegistration($userRegistration);
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

            $userResults = array();
            $teamResults = array();

            $championship = $this->getDoctrine()->getManager()
                ->getRepository('RFCCoreBundle:Championship')
                ->findOneBy(array('id' => $params ['championshipId']));

            foreach ($championship->getListEvents() as $event) {
                foreach ($event->getListSessions() as $session) {
                    if ($session->getTypeSession()->isUsedForResults()) {
                        foreach ($session->getListResults() as $result) {
                            if ($result->getUser() !== null) {
                                $this->addPointsToUser($userResults, $result);
                                $this->addPointsToTeam($teamResults, $result);
                            }
                        }
                    }
                }
            }

            usort($userResults, "self::cmp");

            usort($teamResults, "self::cmp");

            return $this->render('RFCCoreBundle:Championship:globalResults.html.twig',
                array(
                    'userResults' => $userResults,
                    'teamResults' => $teamResults
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
        $session = $result->getSession();
        $value = $result->getRule()->getValue();
        if (array_key_exists($user->getId(), $array)) {
            $array[$user->getId()]['results'][$session->getId()] = [$session, $result];
            $array[$user->getId()]['sum'] += $value;
        } else {
            $array[$user->getId()] = [
                'user' => $user,
                'results' => [$session->getId() => [$session, $result]],
                'sum' => $value
            ];
        }
    }

    /**
     * Add points to team.
     * Create one entry if team is not in array.
     *
     * @param array $array
     *            the array with all the users
     * @param RFCCoreBundle :Result $result
     *            the result to add (user / value)
     */
    private function addPointsToTeam(&$array, $result)
    {
        $user = $result->getUser();
        $session = $result->getSession();
        $team = $session->getEvent()->getChampionship()->getTeamByUserId($user->getId());
        $value = $result->getRule()->getValue();
        if ($team) {
            if (array_key_exists($team->getId(), $array)) {
                $array[$team->getId()]['results'][$user->getId()] = [$session, $user, $result];
                $array[$team->getId()]['sum'] += $value;
            } else {
                $array[$team->getId()] = [
                    'team' => $team,
                    'results' => [$user->getId() => [$session, $user, $result]],
                    'sum' => $value
                ];
            }
        }
    }

    public function getEventResultsAction(Request $request)
    {
        if ($request->isMethod('POST')) {
            $params = \json_decode($request->getContent(), true);

            $userResults = array();
            $teamResults = array();

            $event = $this->getDoctrine()->getManager()
                ->getRepository('RFCCoreBundle:Event')
                ->findOneBy(array('id' => $params ['eventId']));

            foreach ($event->getListSessions() as $session) {
                if ($session->getTypeSession()->isUsedForResults()) {
                    foreach ($session->getListResults() as $result) {
                        if ($result->getUser() !== null) {
                            $this->addPointsToUser($userResults, $result);
                            $this->addPointsToTeam($teamResults, $result);
                        }
                    }
                }
            }


            usort($userResults, "self::cmp");

            usort($teamResults, "self::cmp");

            return $this->render('RFCCoreBundle:Championship:resultsTable.html.twig',
                array(
                    'userResults' => $userResults,
                    'teamResults' => $teamResults
                ));
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
        $data = ['championship' => $team->getChampionship(), 'app' => ['user' => $user]];
        $jsonData = $serializer->serialize($data, 'json', $context);

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
    public function userUnregisterTeamAction( $teamid, $drivertype, $driverid) {
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
        $data = ['championship' => $team->getChampionship(), 'app' => ['user' => $user]];
        $jsonData = $serializer->serialize($data, 'json', $context);

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

    /** This method register or un-register a user to a championship (or team).
     * @param $registrationaction
     * @param $championshipid
     * @param $driverid
     * @param int $drivertype
     * @param null $teamid
     * @return JsonResponse
     */
    public function registrationAction($registrationaction, $championshipid, $driverid, $drivertype = Registration::DRIVER_TYPE_MAIN, $teamid = NULL)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $championship = $entityManager->getRepository('RFCCoreBundle:Championship')->findOneBy([
            'id' => $championshipid
        ]);
        $team = $teamid !== NULL ? $championship->getTeam($teamid) : NULL;
        $user = $entityManager->getRepository('RFCUserBundle:User')->findOneBy([
            'id' => $driverid
        ]);

        if($registrationaction === 'register')
        {
            $championship->addRegistration(new Registration($championship, $user, $drivertype, $team));
            $teamMessage = $team !== null ? ' on ' . $team->getName() . ' as ' . ($drivertype === Registration::DRIVER_TYPE_MAIN ? 'main' : 'secondary') . ' driver.' : '';
            $message = 'Successfully registered to championship ' . $championship->getName() . $teamMessage;
        } else {
            $championship->removeRegistration($championship->getUserRegistration($user->getUsername()));
            $teamMessage = $team !== null ? '. Was previously on team ' . $team->getName() . ' as ' . ($drivertype === Registration::DRIVER_TYPE_MAIN ? 'main' : 'secondary') . ' driver.' : '';
            $message = 'Successfully un-registered from championship ' . $championship->getName() . $teamMessage;
        }
        $entityManager->flush();

        $success = true;
        $serializer = $this->get('jms_serializer');
        $context = SerializationContext::create();
        $context->setGroups(['api']);
        $data = ['championship' => $team->getChampionship(), 'user' => $user];
        $jsonData = $serializer->serialize($data, 'json', $context);

        $data = [
            'success' => $success,
            'action' => 'updated registration fo user ' . $user->getUsername(),
            'message' => $message,
            'data' => $jsonData
        ];

        return new JsonResponse($data, 200);
    }

    /** This method selects or un-selects a vehicle for a given registered user (represented by registration object)
     * @param $registrationaction
     * @param $registrationid
     * @param $vehicleid
     * @return JsonResponse
     */
    public function vehicleSelectionAction($registrationaction, $registrationid, $vehicleid) {
        $entityManager = $this->getDoctrine()->getManager();

        $registration = $entityManager->getRepository('RFCCoreBundle:Registration')->findOneBy([
            'id' => $registrationid
        ]);
        $vehicle = $entityManager->getRepository('RFCCoreBundle:Vehicle')->findOneBy([
            'id' => $vehicleid
        ]);

        if($registrationaction === 'register')
        {
            $registration->setVehicle($vehicle);
            $message = 'Successfully selected vehicle ' . $vehicle->getName() . ' for registered user ' . $registration->getUser()->getUsername();
        } else {
            $registration->setVehicle(null);
            $message = 'Successfully un-selected vehicle ' . $vehicle->getName() . ' for registered user ' . $registration->getUser()->getUsername();
        }
        $entityManager->flush();

        $success = true;
        $serializer = $this->get('jms_serializer');
        $context = SerializationContext::create();
        $context->setGroups(['api']);
        $data = ['championship' => $registration->getChampionship(), 'user' => $registration->getUser()];
        $jsonData = $serializer->serialize($data, 'json', $context);

        $data = [
            'success' => $success,
            'action' => 'updated vehicle ' . $vehicle->getName() . ' for ' . $registration->getUser()->getUsername(),
            'message' => $message,
            'data' => $jsonData
        ];

        return new JsonResponse($data, 200);
    }

    private function cmp($a, $b)
    {
        $val_a = (float) $a['sum'];
        $val_b = (float) $b['sum'];
        if ($val_a == $val_b) {
            return 0;
        }
        return $val_a < $val_b ? 1 : -1;
    }
}