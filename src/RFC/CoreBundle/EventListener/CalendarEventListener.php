<?php
/*  //RF//Championship is a multi-racing game team manager that allows members to organize and follow championships.
    Copyright (C) 2014 - //Racing-France//

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.*/

// src/RFC/CoreBundle/EventListener/CalendarEventListener.php
namespace RFC\CoreBundle\EventListener;

use ADesigns\CalendarBundle\Event\CalendarEvent;
use ADesigns\CalendarBundle\Entity\EventEntity;
use Doctrine\ORM\EntityManager;
use RFC\CoreBundle\Entity\Session;

class CalendarEventListener
{

    private $entityManager;

    public function __construct(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function loadEvents(CalendarEvent $calendarEvent)
    {
        $startDate = $calendarEvent->getStartDatetime();
        $endDate = $calendarEvent->getEndDatetime();
        
        // The original request so you can get filters from the calendar
        // Use the filter in your query for example
        
        $request = $calendarEvent->getRequest();
        $filter = $request->get('filter');
        
        // load events using your custom logic here,
        // for instance, retrieving events from a repository
        
        $sessions = $this->entityManager->getRepository('RFCCoreBundle:Session')->findAll();
        
        foreach ($sessions as $session) {
            
            // create an event with a start/end time, or an all day event
            $isAllDayEvent = $session->getBeginDate() === $session->getEndDate() ? true : false;
            if ($isAllDayEvent) {
                $eventEntity = new EventEntity($session->getName(), $session->getBeginDate(), null, true);
            } else {
                $eventEntity = new EventEntity($session->getName(), $session->getBeginDate(), $session->getEndDate());
            }
            
            // optional calendar event settings
            $eventEntity->setAllDay($isAllDayEvent); // default is false, set to true if this is an all day event
            
            $now = new \DateTime();
            $now->format('Y-m-d H:i:s');
            
            if ($now < $session->getBeginDate()) { // Future event
                $eventEntity->setBgColor('#f0ad4e'); // orange
                $eventEntity->setFgColor('#FFFFFF');
            } else 
                if ($now > $session->getEndDate()) { // Future event
                    $eventEntity->setBgColor('#999999'); // grey
                    $eventEntity->setFgColor('#FFFFFF');
                } else { // Pending event
                    $eventEntity->setBgColor('#5cb85c'); // green
                    $eventEntity->setFgColor('#FFFFFF');
                }
            // $eventEntity->setUrl('http://www.google.com'); // url to send user to when event label is clicked
            // $eventEntity->setCssClass('my-custom-class'); // a custom class you may want to apply to event labels
            $game = $session->getEvent()->getChampionship()->getGame();
            $event = $session->getEvent();
            $eventEntity->setUrl('http://127.0.0.1/RFChampionship/web/app_dev.php/'. $game->getId() .'/Championship_'.$event->getId());
            
            // finally, add the event to the CalendarEvent for displaying on the calendar
            $calendarEvent->addEvent($eventEntity);
        }
    }
}