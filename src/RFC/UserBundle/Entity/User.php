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
use JMS\Serializer\Annotation\Groups;
use RFC\CoreBundle\Entity\Championship;
use RFC\CoreBundle\Entity\CrewRequest;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * User
 *
 * @ORM\Table()
 * @ORM\Entity
 * @UniqueEntity("favoriteNumber",  message="user.fav_number.not_unique", ignoreNull=true)
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
     * @Groups({"api", "list", "details"})
     */
    protected $id;

    /**
     * @Groups({"api"})
     */
    protected $username;

    /**
     * @ORM\Column(name="firstName", type="string", length=255, nullable=true)
     * @Groups({"list", "details"})
     */
    protected $firstName;

    /**
     * @ORM\Column(name="lastName", type="string", length=255, nullable=true)
     * @Groups({"list", "details"})
     */
    protected $lastName;

    /**
     * @ORM\Column(name="age", type="integer", nullable=true)
     * @Groups({"details"})
     */
    protected $age;

    /**
     * @ORM\Column(name="avatarUrl", type="string", length=255, nullable=true)
     * @Groups({"api", "details"})
     */
    protected $avatarUrl;

    /**
     * @ORM\Column(name="steamId", type="string", length=255, nullable=true)
     * @Groups({"details"})
     */
    protected $steamId;

    /**
     * @ORM\Column(name="favoriteNumber", type="integer", nullable=true, unique=true)
     * @Assert\GreaterThan( value = 0, message="constraint.positive" )
     * @Groups({"api", "details"})
     */
    protected $favoriteNumber;

    /**
     * @ORM\ManyToMany(targetEntity="RFC\CoreBundle\Entity\Property")
     * @Groups({"relations"})
     */
    protected $listPreferences;

    /**
     * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\CrewRequest", mappedBy="requester", cascade={"persist", "remove"})
     * @Groups({"relations"})
     */
    protected $listCrewRequests;

    /**
     * @ORM\ManyToMany(targetEntity="RFC\CoreBundle\Entity\Championship", mappedBy="listUsers", cascade={"persist"})
     * @Groups({"relations"})
     */
    protected $listChampionships;

    /**
     * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\Registration", mappedBy="user")
     * @ORM\JoinColumn(nullable=true)
     * @Groups({"list","api"})
     */
    protected $listRegistrations;

    /**
     * @ORM\Column(name="locale", type="string", length=5)
     * @Groups({"details"})
     */
    protected $locale;

    public function __construct()
    {
        parent::__construct();
        $this->listChampionships = new ArrayCollection();
        $this->listCrewRequests = new ArrayCollection();
        $this->listPreferences = new ArrayCollection();
        $this->listRegistrations = new ArrayCollection();
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

    public function getFavoriteNumber()
    {
        return $this->favoriteNumber;
    }

    public function setFavoriteNumber($favoriteNumber)
    {
        $this->favoriteNumber = $favoriteNumber;
        return $this;
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

    /**
     * @return ArrayCollection
     */
    public function getListRegistrations()
    {
        return $this->listRegistrations;
    }

    /**
     * @param ArrayCollection $listRegistrations
     * @return User
     */
    public function setListRegistrations(ArrayCollection $listRegistrations)
    {
        $this->listRegistrations = $listRegistrations;
        return $this;
    }

    public function getLocale()
    {
        return $this->locale;
    }

    /**
     * @param string $locale
     */
    public function setLocale($locale)
    {
        $this->locale = $locale;
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
                == $gameId
            ) {
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
                    || $lastRequest->getCreatedAt() < $crewRequest->getCreatedAt())
            ) {
                $lastRequest = $crewRequest;
            }
        }
        return $lastRequest;
    }
}