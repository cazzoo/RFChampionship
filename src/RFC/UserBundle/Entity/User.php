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

namespace RFC\UserBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use FOS\UserBundle\Model\User as BaseUser;
use Gedmo\Mapping\Annotation as Gedmo;
use Gedmo\Timestampable\Traits\TimestampableEntity;
use RFC\CoreBundle\Entity\Championship;
use RFC\CoreBundle\Entity\CrewRequest;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * User
 *
 * @ORM\Table()
 * @ORM\Entity
 */
class User extends BaseUser
{

    /**
     * Hook timestampable behavior
     * updates createdAt, updatedAt fields
     */
    use TimestampableEntity;
    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(name="firstName", type="string", length=255, nullable=true)
     */
    protected $firstName;

    /**
     * @ORM\Column(name="lastName", type="string", length=255, nullable=true)
     */
    protected $lastName;

    /**
     * @ORM\Column(name="age", type="integer", nullable=true)
     */
    protected $age;

    /**
     * @ORM\Column(name="avatarUrl", type="string", length=255, nullable=true)
     */
    protected $avatarUrl;

    /**
     * @ORM\Column(name="steamId", type="string", length=255, nullable=true)
     */
    protected $steamId;

    /**
     * @ORM\ManyToMany(targetEntity="RFC\CoreBundle\Entity\Property")
     */
    protected $listPreferences;

    /**
     * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\CrewRequest", mappedBy="requester", cascade={"persist", "remove"})
     */
    protected $listCrewRequests;

    /**
     * @ORM\ManyToMany(targetEntity="RFC\CoreBundle\Entity\Championship", mappedBy="listUsers", cascade={"persist"})
     */
    protected $listChampionships;

    public function __construct()
    {
        parent::__construct();
        $this->listChampionships = ArrayCollection();
        $this->listCrewRequests  = ArrayCollection();
        $this->listPreferences   = ArrayCollection();
    }

    public function eraseCredentials()
    {
        
    }

    /**
     * Set firstName
     *
     * @param string $firstName            
     * @return User
     */
    public function setFirstName($firstName)
    {
        $this->firstName = $firstName;

        return $this;
    }

    /**
     * Get firstName
     *
     * @return string
     */
    public function getFirstName()
    {
        return $this->firstName;
    }

    /**
     * Set lastName
     *
     * @param string $lastName            
     * @return User
     */
    public function setLastName($lastName)
    {
        $this->lastName = $lastName;

        return $this;
    }

    /**
     * Get lastName
     *
     * @return string
     */
    public function getLastName()
    {
        return $this->lastName;
    }

    /**
     * Set age
     *
     * @param integer $age            
     * @return User
     */
    public function setAge($age)
    {
        $this->age = $age;

        return $this;
    }

    /**
     * Get age
     *
     * @return integer
     */
    public function getAge()
    {
        return $this->age;
    }

    /**
     * Set avatarUrl
     *
     * @param string $avatarUrl            
     * @return User
     */
    public function setAvatarUrl($avatarUrl)
    {
        $this->avatarUrl = $avatarUrl;

        return $this;
    }

    /**
     * Get avatarUrl
     *
     * @return string
     */
    public function getAvatarUrl()
    {
        return $this->avatarUrl;
    }

    /**
     * Set steamId
     *
     * @param string $steamId            
     * @return User
     */
    public function setSteamId($steamId)
    {
        $this->steamId = $steamId;

        return $this;
    }

    /**
     * Get steamId
     *
     * @return string
     */
    public function getSteamId()
    {
        return $this->steamId;
    }

    /**
     *
     * @return ArrayCollection
     */
    public function getListPreferences()
    {
        return $this->listPreferences;
    }

    /**
     *
     * @param ArrayCollection $listPreferences
     * @return User
     */
    public function setListPreferences(ArrayCollection $listPreferences)
    {
        $this->listPreferences = $listPreferences;
        return $this;
    }

    /**
     *
     * @return ArrayCollection
     */
    public function getListCrewRequests()
    {
        return $this->listCrewRequests;
    }

    /**
     *
     * @param ArrayCollection $listCrewRequests
     * @return User
     */
    public function setListCrewRequests(ArrayCollection $listCrewRequests)
    {
        $this->listCrewRequests = $listCrewRequests;
        return $this;
    }

    public function addListCrewRequest(CrewRequest $crewRequest)
    {
        $this->listCrewRequests[] = $crewRequest;

        return $this;
    }

    public function removeListCrewRequest(CrewRequest $crewRequest)
    {
        $this->listCrewRequests->removeElement($crewRequest);
    }

    /**
     * Add listChampionships
     *
     * @param Championship $listChampionships
     * @return User
     */
    public function addListChampionship(Championship $listChampionships)
    {
        $this->listChampionships[] = $listChampionships;

        return $this;
    }

    /**
     * Remove listChampionships
     *
     * @param Championship $listChampionships
     */
    public function removeListChampionship(Championship $listChampionships)
    {
        $this->listChampionships->removeElement($listChampionships);
    }

    /**
     * Get listChampionships
     *
     * @return ArrayCollection
     */
    public function getListChampionships()
    {
        return $this->listChampionships;
    }

    /**
     * Set listChampionships
     *
     * @param ArrayCollection the collection to replace
     * @return User
     */
    public function setListChampionships(ArrayCollection $listChampionships)
    {
        $this->listChampionships = $listChampionships;
        return $this;
    }

    public function isRoleAdmin()
    {
        return $this->hasRole('ROLE_ADMIN');
    }

    public function isRoleCertifiedManager()
    {
        return $this->hasRole('ROLE_CERTIFIED_MANAGER');
    }

    public function isRoleManager()
    {
        return $this->hasRole('ROLE_MANAGER');
    }

    public function isRoleUser()
    {
        return $this->hasRole('ROLE_USER');
    }

    public function getHighestRole()
    {
        $role = 'ROLE_BANNED';
        if ($this->isRoleUser()) {
            $role = 'ROLE_USER';
        }
        if ($this->isRoleManager()) {
            $role = 'ROLE_MANAGER';
        }
        if ($this->isRoleCertifiedManager()) {
            $role = 'ROLE_CERTIFIED_MANAGER';
        }
        if ($this->isRoleAdmin()) {
            $role = 'ROLE_ADMIN';
        }
        return $role;
    }

    public function getCrew($gameId)
    {
        foreach ($this->listCrewRequests as $crewRequest) {
            if ($crewRequest->getState() == 2 && $crewRequest->getCrew()->getGame()->getId()
                == $gameId) {
                return $crewRequest->getCrew();
            }
        }
        return null;
    }

    /**
     * @param integer $type
     * @return array
     */
    public function getRequestsByType($type)
    {
        $crewRequests = array();
        foreach ($this->listCrewRequests as $crewRequest) {
            if ($crewRequest->getState() == $type) {
                array_push($crewRequests, $crewRequest);
            }
        }
        return $crewRequests;
    }

    public function getPendingRequests()
    {
        return $this->getRequestsByType(4);
    }

    public function getCrews()
    {
        $crews = array();
        foreach ($this->getRequestsByType(2) as $crewRequest) {
            array_push($crews, $crewRequest->getCrew());
        }
        return $crews;
    }

    public function getLastCrewRequest($crewId)
    {
        $lastRequest = null;

        foreach ($this->listCrewRequests as $crewRequest) {
            if ($crewId === $crewRequest->getCrew()->getId() && ($lastRequest === null
                || $lastRequest->getCreatedAt() < $crewRequest->getCreatedAt())) {
                $lastRequest = $crewRequest;
            }
        }
        return $lastRequest;
    }
}