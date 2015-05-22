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

// src/RFC/CoreBundle/EventListener/CalendarEventListener.php

namespace RFC\CoreBundle\EventListener;

use ADesigns\CalendarBundle\Event\CalendarEvent;
use ADesigns\CalendarBundle\Entity\EventEntity;
use Doctrine\ORM\EntityManager;
use Symfony\Component\Routing\Router;

class CalendarEventListener
{
    private $entityManager;
    private $router;

    public function __construct(EntityManager $entityManager, Router $router)
    {
        $this->entityManager = $entityManager;
        $this->router        = $router;
    }

    public function loadEvents(CalendarEvent $calendarEvent)
    {

        $sessions = $this->entityManager->getRepository('RFCCoreBundle:Session')->findAll();

        foreach ($sessions as $session) {

            // create an event with a start/end time, or an all day event
            $isAllDayEvent = $session->getBeginDate() === $session->getEndDate()
                    ? true : false;
            if ($isAllDayEvent) {
                $eventEntity = new EventEntity($session->getName(),
                    $session->getBeginDate(), null, true);
            } else {
                $eventEntity = new EventEntity($session->getName(),
                    $session->getBeginDate(), $session->getEndDate());
            }

            // optional calendar event settings
            $eventEntity->setAllDay($isAllDayEvent); // default is false, set to true if this is an all day event

            $now = new \DateTime ();
            $now->format('Y-m-d H:i:s');

            if ($now < $session->getBeginDate()) { // Future event
                $eventEntity->setBgColor('#f0ad4e'); // orange
                $eventEntity->setFgColor('#FFFFFF');
            } else if ($now > $session->getEndDate()) { // Future event
                $eventEntity->setBgColor('#999999'); // grey
                $eventEntity->setFgColor('#FFFFFF');
            } else { // Pending event
                $eventEntity->setBgColor('#5cb85c'); // green
                $eventEntity->setFgColor('#FFFFFF');
            }
            
            $game           = $session->getEvent()->getChampionship()->getGame();
            $championshipId = $session->getEvent()->getChampionship()->getId();
            $event          = $session->getEvent();
            $url            = $this->router->generate('rfcCore_championships_show',
                array(
                'gameId' => $game->getId(),
                'championshipId' => $championshipId
            ));

            $url .= '#eventId='.$event->getId();

            $eventEntity->setUrl($url);

            $calendarEvent->addEvent($eventEntity);
        }
    }
}