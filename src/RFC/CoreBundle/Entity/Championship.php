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
  along with this program.  If not, see <http://www.gnu.org/licenses/>. */

namespace RFC\CoreBundle\Entity;

use DateTime;
use DateTimeZone;
use Doctrine\ORM\Mapping as ORM;
use RFC\CoreBundle\Entity\KnowledgeData;
use Doctrine\ORM\Mapping\JoinTable;
use Doctrine\Common\Collections\ArrayCollection;
use RFC\UserBundle\Entity\User;

/**
 * Championship
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\CoreBundle\Entity\ChampionshipRepository")
 */
class Championship extends KnowledgeData
{
    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(name="championshipAgreed", type="boolean")
     */
    private $championshipAgreed;

    /**
     * @ORM\Column(name="registrationInProgress", type="boolean")
     */
    private $registrationInProgress;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Game", inversedBy="listChampionships")
     * @ORM\JoinColumn(nullable=false)
     */
    protected $game;

    /**
     * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\Event", mappedBy="championship", cascade={"persist", "remove"})
     */
    private $listEvents;

    /**
     * @ORM\ManyToMany(targetEntity="RFC\UserBundle\Entity\User")
     * @JoinTable(name="championship_managers")
     */
    private $listManagers;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\MetaRule")
     * @ORM\JoinColumn(nullable=true)
     */
    private $metaRule;

    /**
     * @ORM\ManyToMany(targetEntity="RFC\CoreBundle\Entity\Rule")
     */
    private $listRules;

    /**
     * @ORM\ManyToMany(targetEntity="RFC\UserBundle\Entity\User", inversedBy="listChampionships")
     */
    private $listUsers;

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();
        $this->listEvents   = new ArrayCollection();
        $this->listManagers = new ArrayCollection();
        $this->listRules    = new ArrayCollection();
    }

    public function __toString()
    {
        return $this->getName();
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set agreed
     *
     * @param boolean $agreed
     * @return Championship
     */
    public function setChampionshipAgreed($agreed)
    {
        $this->championshipAgreed = $agreed;

        return $this;
    }

    /**
     * Get championshipAgreed
     *
     * @return boolean
     */
    public function getChampionshipAgreed()
    {
        return $this->championshipAgreed;
    }

    /**
     * Set registrationInProgress
     *
     * @param boolean $registrationInProgress
     * @return Championship
     */
    public function setRegistrationInProgress($registrationInProgress)
    {
        $this->registrationInProgress = $registrationInProgress;

        return $this;
    }

    /**
     * Get registrationrInProgress
     *
     * @return boolean
     */
    public function getRegistrationInProgress()
    {
        return $this->registrationInProgress;
    }

    /**
     * Set listEvents
     *
     * @param ArrayCollection $listEvents
     * @return Championship
     */
    public function setListEvents(ArrayCollection $listEvents)
    {
        $this->listEvents = $listEvents;

        return $this;
    }

    /**
     * Get listEvents
     *
     * @return ArrayCollection
     */
    public function getListEvents()
    {
        return $this->listEvents;
    }

    /**
     * Set managers
     *
     * @param ArrayCollection $managers
     * @return Championship
     */
    public function setManagers(ArrayCollection $managers)
    {
        $this->listManagers = $managers;

        return $this;
    }

    /**
     * Get listManagers
     *
     * @return ArrayCollection
     */
    public function getListManagers()
    {
        return $this->listManagers;
    }

    /**
     * Set metaRule
     *
     * @param MetaRule $metaRule
     * @return Championship
     */
    public function setMetaRule(MetaRule $metaRule)
    {
        $this->metaRule = $metaRule;

        return $this;
    }

    /**
     * Get metaRuleId
     *
     * @return MetaRule
     */
    public function getMetaRule()
    {
        return $this->metaRule;
    }

    /**
     * Set listRules
     *
     * @param ArrayCollection $listRules
     * @return Championship
     */
    public function setListRules(ArrayCollection $listRules)
    {
        $this->listRules = $listRules;

        return $this;
    }

    /**
     * Get listRules
     *
     * @return ArrayCollection
     */
    public function getListRules()
    {
        return $this->listRules;
    }

    /**
     * Add rule
     *
     * @param Rule $rule
     * @return Championship
     */
    public function addRule(Rule $rule)
    {
        $this->listRules[] = $rule;

        return $this;
    }

    /**
     * Remove rule from listRules
     *
     * @param Rule $rule
     */
    public function removeListRule(Rule $rule)
    {
        $this->listRules->removeElement($rule);
    }

    /**
     * Add events
     *
     * @param Event $event
     * @return Championship
     */
    public function addEvent(Event $event)
    {
        $this->listEvents[] = $event;

        return $this;
    }

    /**
     * Remove event
     *
     * @param Event $event
     */
    public function removeEvent(Event $event)
    {
        $this->listEvents->removeElement($event);
    }

    /**
     * Add manager
     *
     * @param User $manager
     * @return Championship
     */
    public function addManager(User $manager)
    {
        $this->listManagers[] = $manager;

        return $this;
    }

    /**
     * Remove manager
     *
     * @param User $manager
     */
    public function removeListManager(User $manager)
    {
        $this->listManagers->removeElement($manager);
    }

    /**
     *
     * @return ArrayCollection
     */
    public function getListUsers()
    {
        return $this->listUsers;
    }

    /**
     *
     * @param ArrayCollection $listUsers
     * @return Championship
     */
    public function setListUsers(ArrayCollection $listUsers)
    {
        $this->listUsers = $listUsers;
        return $this;
    }

    /**
     * Add User to list of participants
     *
     * @param User $user
     * @return Championship
     */
    public function registerUser(User $user)
    {
        $this->listUsers[] = $user;

        return $this;
    }

    /**
     * Remove User from list of participants
     *
     * @param User $user
     */
    public function unregisterUser(User $user)
    {
        $this->listUsers->removeElement($user);
    }

    /**
     *
     * @return Event
     */
    public function getFirstEvent()
    {
        $firstEvent = null;
        foreach ($this->listEvents as $event) {
            if (null == $firstEvent) {
                $firstEvent = $event;
            } else if ($event->getBeginDate() < $firstEvent->getBeginDate()) {
                $firstEvent = $event;
            }
        }
        return $firstEvent;
    }

    /**
     *
     * @return Event
     */
    public function getLastEvent()
    {
        $lastEvent = null;
        foreach ($this->listEvents as $event) {
            if (null == $lastEvent) {
                $lastEvent = $event;
            } else if ($event->getEndDate() > $lastEvent->getEndDate()) {
                $lastEvent = $event;
            }
        }
        return $lastEvent;
    }

    /**
     * Get Earlyer Date Form Events
     *
     * @return \DateTime
     */
    public function getBeginDate()
    {
        $template = new \DateTime('01/01/1900');
        $template->format('Y-m-d H:i:s');
        if ($this->listEvents[0] !== null) {
            $beginDate = $this->listEvents[0]->getBeginDate();
        } else {
            $beginDate = $template;
        }
        foreach ($this->listEvents as $event) {
            if ($beginDate > $event->getBeginDate()) {
                $beginDate = $event->getBeginDate();
            }
        }
        if ($beginDate != $template) {
            return $beginDate;
        } else {
            return null;
        }
    }

    /**
     * Get Lastest Date From Events
     *
     * @return \DateTime
     */
    public function getEndDate()
    {
        $template = new \DateTime('01/01/2100');
        $template->format('Y-m-d H:i:s');
        if ($this->listEvents[0] !== null) {
            $endDate = $this->listEvents[0]->getEndDate();
        } else {
            $endDate = $template;
        }
        foreach ($this->listEvents as $event) {
            if ($endDate < $event->getEndDate()) {
                $endDate = $event->getEndDate();
            }
        }
        if ($endDate != $template) {
            return $endDate;
        } else {
            return null;
        }
    }

    /**
     *
     * @param $userId
     * @return boolean
     */
    public function isManager($userId)
    {
        foreach ($this->listManagers as $manager) {
            if ($userId == $manager->getId()) {
                return true;
            }
        }
        return false;
    }

    public function getCurrentEvent()
    {
        $currentEvent = null;
        $now          = new \DateTime();

        foreach ($this->listEvents as $event) {
            if ($now > $event->getBeginDate() && $now < $event->getEndDate()) {
                $currentEvent = $event;
            }
        }
        return $currentEvent;
    }

    /**
     * Returns the next incoming event regarding the current date.
     * @return Event the next event
     */
    public function getNextEvent()
    {
        $nextEvent = null;
        $now       = new \DateTime();

        foreach ($this->listEvents as $event) {
            if ($now < $event->getBeginDate() && (null == $nextEvent || $nextEvent->getBeginDate()
                > $event->getBeginDate())) {
                $nextEvent = $event;
            }
        }

        return $nextEvent;
    }

    /**
     * Returns the previous finished event regarding the current date.
     * @return Event the previous event
     */
    public function getPreviousEvent()
    {
        $previousEvent = null;
        $now           = new \DateTime();

        foreach ($this->listEvents as $event) {
            if ($now > $event->getEndDate() && (null == $previousEvent || $previousEvent->getEndDate()
                > $event->getEndDate())) {
                $previousEvent = $event;
            }
        }

        return $previousEvent;
    }

    /**
     *
     * @return Session
     */
    public function getCurrentSession()
    {
        if (null != $this->getCurrentEvent()) {
            return $this->getCurrentEvent()->getCurrentSession();
        }
        return null;
    }

    /**
     *  Returns the nearest incoming session.
     * @return Session the next session that is not started.
     */
    public function getNextSession()
    {
        if (null != $this->getCurrentEvent()) {
            return $this->getCurrentEvent()->getNextSession();
        } else if (null != $this->getNextEvent()) {
            return $this->getNextEvent()->getNextSession();
        }
        return null;
    }

    /**
     *  Returns the nearest completed session.
     * @return Session the previous session that is completed.
     */
    public function getPreviousSession()
    {
        if (null != $this->getCurrentEvent()) {
            return $this->getCurrentEvent()->getPreviousSession();
        } else if (null != $this->getPreviousEvent()) {
            return $this->getPreviousEvent()->getPreviousSession();
        }
        return null;
    }

    /**
     * Returns if the championship is finished or not
     * @return boolean
     */
    public function getIsFinished()
    {
        $date = new \DateTime ();
        $date->setTimezone(new \DateTimeZone('Europe/Paris'));

        return $this->getEndDate()->format('Y-m-d H:i:s') < $date->format('Y-m-d H:i:s');
    }

    /**
     * Returns whether the championship has session dates or not
     * @return false if the entity has BeginDate or EndDate through session(s) or true if not
     */
    public function getIsDraft()
    {
        return ($this->getBeginDate() != null || $this->getEndDate() != null) ? false
                : true;
    }
}