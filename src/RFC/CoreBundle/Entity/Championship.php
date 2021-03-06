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

namespace RFC\CoreBundle\Entity;

use DateTime;
use DateTimeZone;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Groups;
use JMS\Serializer\Annotation\VirtualProperty;
use JMS\Serializer\Annotation\SerializedName;
use JMS\Serializer\Annotation\MaxDepth;
use Doctrine\ORM\Mapping\JoinTable;
use Doctrine\Common\Collections\ArrayCollection;
use RFC\CoreBundle\Entity\KnowledgeData;
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
     * @Groups({"id", "api"})
     */
    private $id;

    /**
     * @ORM\Column(name="championshipAgreed", type="boolean")
     */
    private $championshipAgreed;

    /**
     * @ORM\Column(name="registrationInProgress", type="boolean")
     * @Groups({"api"})
     */
    private $registrationInProgress;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Game", inversedBy="listChampionships")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"api"})
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
     * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\Team", mappedBy="championship", cascade={"persist", "remove"})
     * @Groups({"api"})
     */
    private $listTeams;

    /**
     * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\Registration", mappedBy="championship", cascade={"persist"}, orphanRemoval=true)
     * @Groups({"list","api"})
     * @MaxDepth(2)
     */
    private $listRegistrations;

    /**
     * @ORM\ManyToMany(targetEntity="RFC\CoreBundle\Entity\Category")
     */
    private $listCategories;

    /**
     * @ORM\ManyToMany(targetEntity="RFC\CoreBundle\Entity\Vehicle")
     */
    private $listVehicles;

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();
        $this->listEvents = new ArrayCollection();
        $this->listManagers = new ArrayCollection();
        $this->listRules = new ArrayCollection();
        $this->listTeams = new ArrayCollection();
        $this->listCategories = new ArrayCollection();
        $this->listVehicles = new ArrayCollection();
        $this->listRegistrations = new ArrayCollection();
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
    public function removeManager(User $manager)
    {
        $this->listManagers->removeElement($manager);
    }

    /**
     * Add user to a specidied team
     * @param User $user
     * @param \RFC\CoreBundle\Entity\Team $team
     * @param type $isMain
     * @return \RFC\CoreBundle\Entity\Championship
     */
    public function registerUserTeam(User $user, Team $team, $isMain)
    {
        if ($isMain) {
            $team->addMainDriver($user);
        } else {
            $team->addSecondaryDriver($user);
        }
        return $this;
    }

    /**
     * Remove user from a specidied team
     * @param User $user
     * @param \RFC\CoreBundle\Entity\Team $team
     * @param type $isMain
     * @return \RFC\CoreBundle\Entity\Championship
     */
    public function unregisterUserTeam(User $user, Team $team, $isMain)
    {
        if ($isMain) {
            $team->removeMainDriver($user);
        } else {
            $team->removeSecondaryDriver($user);
        }
        return $this;
    }

    /**
     * @return ArrayCollection
     */
    public function getListRegistrations()
    {
        return $this->listRegistrations;
    }

    /**
     * @param ArrayCollection $listRegistrations
     * @return Championship
     */
    public function setListRegistrations(ArrayCollection $listRegistrations)
    {
        $this->listRegistrations = $listRegistrations;
        return $this;
    }

    /**
     * Add registration
     *
     * @param Registration $registration
     * @return Championship
     */
    public function addRegistration(Registration $registration)
    {
        $this->listRegistrations->add($registration);
        return $this;
    }

    /**
     * This method create a regsitration for a given user
     * @param User $user
     * @param int $drivertype
     * @param Team $team
     * @return Registration user registration
     */
    public function addUserRegistration(User $user, $drivertype, $team = NULL)
    {
        $userRegistration = $this->getUserRegistration($user->getUsername());
        if($userRegistration !== null) {
            return $userRegistration;
        } else {
            $registration = new Registration($this, $user, $drivertype, $team);
            $this->addRegistration($registration);
            return $registration;
        }

    }

    /**
     * Remove registration
     *
     * @param Registration $registration
     * @return Championship
     */
    public function removeRegistration(Registration $registration)
    {
        $this->listRegistrations->removeElement($registration);
        return $this;
    }

    /** This method removes a registration for a giver username
     *
     * @param string $username the username we want to remove
     * @return Championship|false true if success, false otherwise
     */
    public function removeUserRegistration($username)
    {
        $userRegistration = $this->getUserRegistration($username);
        if($userRegistration !== null) {
            return $this->removeRegistration($userRegistration);
        } else {
            return false;
        }
    }

    /**
     * This method returns a registration based on user name, null if not found.
     * @param $userName
     * @return Registration|null
     */
    public function getUserRegistration($userName)
    {
        foreach($this->listRegistrations as $registration)
        {
            if($registration->getUser()->getUsername() === $userName){
                return $registration;
            }
        }
        return null;
    }

    /**
     * This method returns all the registration for a given team id
     * @param $teamId
     * @return array
     */
    public function getRegistrationByTeam($teamId, $type = null) {
        $teamRegistration = array();
        foreach($this->listRegistrations as $registration)
        {
            if($registration->getTeam()->getId() === $teamId){
                if($type && $registration->getType() === $type) {
                    $teamRegistration[] = $registration;
                } else {
                    $teamRegistration[] = $registration;
                }
            }
        }
        return $teamRegistration;
    }

    /**
     *
     * @return ArrayCollection
     */
    public function getListTeams()
    {
        return $this->listTeams;
    }

    /**
     *
     * @param ArrayCollection $listTeams
     * @return Championship
     */
    public function setListTeams(ArrayCollection $listTeams)
    {
        $this->listTeams = $listTeams;
        return $this;
    }

    /**
     * Add team
     *
     * @param Team $team
     * @return Championship
     */
    public function addTeam(Team $team)
    {
        $this->listTeams[] = $team;
        return $this;
    }

    /**
     * Remove team
     *
     * @param Team $team
     * @return Championship
     */
    public function removeTeam(Team $team)
    {
        $this->listTeams->removeElement($team);
        return $this;
    }

    /**
     * Returns the team associated to id
     * @param int $teamId
     * @return Team the team
     */
    public function getTeam($teamId)
    {
        foreach ($this->listTeams as $team) {
            if ($teamId === $team->getId()) {
                return $team;
            }
        }
        return null;
    }

    /**
     *
     * @return ArrayCollection
     */
    public function getListCategories()
    {
        return $this->listCategories;
    }

    public function getListUsersTeams($type = 'main')
    {
        $users = array();
        foreach ($this->listRegistrations as $registration) {
            switch ($type) {
                case 'main':
                    if ($registration->getType() === Registration::DRIVER_TYPE_MAIN) {
                        $users[] = $registration->getUser();
                    }
                    break;
                case 'secondary':
                    if ($registration->getType() === Registration::DRIVER_TYPE_SECONDARY) {
                        $users[] = $registration->getUser();
                    }
                    break;
            }

        }

        return $users;
    }

    /**
     *
     * @param ArrayCollection $listCategories
     * @return Championship
     */
    public function setListCategories(ArrayCollection $listCategories)
    {
        $this->listCategories = $listCategories;
        return $this;
    }

    /**
     * This method returns all the allowed vehicles for the current championship.
     * All the allowed vehicles are :
     *  - Every vehicles if championship has vehicle list
     *  - Every vehicles of every categories if championship has category list
     * @return array|ArrayCollection
     */
    public function getAllowedVehicles()
    {
        $allowedVehicles = array();
        if(count($this->listCategories) === 0 ) {
            $allowedVehicles = $this->listVehicles;
        } else {
            foreach($this->listCategories as $category) {
                $allowedVehicles += $category->getListVehicles()->toArray();
            }
        }

        return $allowedVehicles;
    }

    /**
     *
     * @return ArrayCollection
     */
    public function getListVehicles()
    {
        return $this->listVehicles;
    }

    /**
     *
     * @param ArrayCollection $listVehicles
     * @return Championship
     */
    public function setListVehicles(ArrayCollection $listVehicles)
    {
        $this->listVehicles = $listVehicles;
        return $this;
    }

    /**
     * This method generates the teams assigning default options like name and max values
     * @param Array $baseData The base data on which we create the team, It could be list of Vehicles, list of Categories or number
     */
    public function generateTeams(Array $baseData)
    {
        foreach ($baseData[0] as $data) {
            $t = new Team();
            $isVehicle = get_class($data) == 'RFC\CoreBundle\Entity\Vehicle';
            $isCategory = get_class($data) == 'RFC\CoreBundle\Entity\Category';
            if ($isVehicle || $isCategory) {
                // We generate the team name using the Data name
                $t->setName($data->getName());
                $t->setMaxMainDrivers($baseData[1]);
                $t->setMaxSecondaryDrivers($baseData[2]);
                $t->setCommentsActive(false);
                $t->setChampionship($this);
                if($isVehicle) {
                    $t->setVehicle($data);
                }
                if($isCategory) {
                    $t->setCategory($data);
                }
                $this->addTeam($t);
            } else {
                // We wait here an array with only one integer that represents the number of teams we want
                for ($i = 0; $i < $baseData[0]; $i++) {
                    $t = new Team();
                    // We generate a dummy text : Team + number of team
                    $t->setName('Team ' . ($i + 1));
                    $t->setMaxMainDrivers($baseData[1]);
                    $t->setMaxSecondaryDrivers($baseData[2]);
                    $t->setCommentsActive(false);
                    $t->setChampionship($this);
                    $this->addTeam($t);
                }
            }
        }
    }

    /**
     * Checks and returns a team looking on the userId.
     * @param $userId the Id of the user.
     * @return The team if the drivers is registered to, null otherwise
     */
    public function getTeamByUserId($userId)
    {
        foreach ($this->listTeams as $team) {
            foreach ($team->getListMainDrivers() as $mainDriver) {
                if ($mainDriver->getUser()->getId() === $userId) {
                    return $team;
                }
            }
            foreach ($team->getListSecondaryDrivers() as $secondaryDriver) {
                if ($secondaryDriver->getUser()->getId() === $userId) {
                    return $team;
                }
            }
        }
        return null;
    }

    /**
     * The first event of the championship
     * @return Event
     */
    public function getFirstEvent()
    {
        $firstEvent = null;
        foreach ($this->listEvents as $event) {
            if (null === $firstEvent) {
                $firstEvent = $event;
            } else {
                if ($event->getBeginDate() < $firstEvent->getBeginDate()) {
                    $firstEvent = $event;
                }
            }
        }
        return $firstEvent;
    }

    /**
     * The last event of the championship
     * @return Event
     */
    public function getLastEvent()
    {
        $lastEvent = null;
        foreach ($this->listEvents as $event) {
            if (null === $lastEvent) {
                $lastEvent = $event;
            } else {
                if ($event->getEndDate() > $lastEvent->getEndDate()) {
                    $lastEvent = $event;
                }
            }
        }
        return $lastEvent;
    }

    /**
     * @Groups({"api"})
     * @VirtualProperty
     * @SerializedName("beginDate")
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
        if ($beginDate !== $template) {
            return $beginDate;
        } else {
            return null;
        }
    }

    /**
     * @Groups({"api"})
     * @VirtualProperty
     * @SerializedName("endDate")
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
        if ($endDate !== $template) {
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
    public function isManager(
        $userId
    ) {
        foreach ($this->listManagers as $manager) {
            if ($userId === $manager->getId()) {
                return true;
            }
        }
        return false;
    }

    public function getCurrentEvent()
    {
        $currentEvent = null;
        $now = new \DateTime();

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
        $now = new \DateTime();

        foreach ($this->listEvents as $event) {
            if ($now < $event->getBeginDate() && ($nextEvent === null || $nextEvent->getBeginDate()
                    > $event->getBeginDate())
            ) {
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
        $now = new \DateTime();

        foreach ($this->listEvents as $event) {
            if ($now > $event->getEndDate() && ($previousEvent === null || $previousEvent->getEndDate()
                    < $event->getEndDate())
            ) {
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
        if ($this->getCurrentEvent() !== null) {
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
        if ($this->getCurrentEvent() !== null) {
            return $this->getCurrentEvent()->getNextSession();
        } else {
            if ($this->getNextEvent() !== null) {
                return $this->getNextEvent()->getNextSession();
            }
        }
        return null;
    }

    /**
     *  Returns the nearest completed session.
     * @return Session the previous session that is completed.
     */
    public function getPreviousSession()
    {
        if ($this->getCurrentEvent() !== null) {
            return $this->getCurrentEvent()->getPreviousSession();
        } else {
            if ($this->getPreviousEvent() !== null) {
                return $this->getPreviousEvent()->getPreviousSession();
            }
        }
        return null;
    }

    /**
     * @Groups({"api"})
     * @VirtualProperty
     * @SerializedName("isBeforeBeginDate")
     * @return bool
     */
    public function getIsBeforeBeginDate()
    {
        return new \DateTime() < $this->getBeginDate();
    }

    /**
     * @Groups({"api"})
     * @VirtualProperty
     * @SerializedName("isAfterBeginDate")
     * @return bool
     */
    public function getIsAfterBeginDate()
    {
        return new \DateTime() > $this->getBeginDate();
    }

    /**
     * @Groups({"api"})
     * @VirtualProperty
     * @SerializedName("isBeforeEndDate")
     * @return bool
     */
    public function getIsBeforeEndDate()
    {
        return new \DateTime() < $this->getEndDate();
    }

    /**
     * @Groups({"api"})
     * @VirtualProperty
     * @SerializedName("isAfterEndDate")
     * @return bool
     */
    public function getIsAfterEndDate()
    {
        return new \DateTime() > $this->getEndDate();
    }

    /**
     * @Groups({"api"})
     * @VirtualProperty
     * @SerializedName("isFinished")
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
     * @Groups({"api"})
     * @VirtualProperty
     * @SerializedName("isDraft")
     * Returns whether the championship has session dates or not
     * @return false if the entity has BeginDate or EndDate through session(s) or true if not
     */
    public function getIsDraft()
    {
        return ($this->getBeginDate() !== null || $this->getEndDate() !== null) ? false : true;
    }

    /**
     * @Groups({"api"})
     * @VirtualProperty
     * @SerializedName("isTeamChampionship")
     * Returns true if the championship is team based. False otherwise.
     * @return boolean the championship is team based or not
     */
    public function getTeamChampionship()
    {
        return count($this->listTeams) > 0 ? true : false;
    }

    /** This method returns whether the championship allows new registration or not.
     * @return bool
     */
    public function getRegistrationAllowed() {
        $registrationAllowed = true;
        if($this->getIsDraft()) {
            $registrationAllowed = false;
        }
        if((!$this->getRegistrationInProgress() && $this->getIsAfterBeginDate()) || $this->getIsAfterEndDate()) {
            $registrationAllowed = false;
        }
        return $registrationAllowed;
    }
}