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

use Gedmo\Timestampable\Traits\TimestampableEntity;
use Gedmo\Mapping\Annotation as Gedmo;
use FOS\UserBundle\Model\User as BaseUser;
use Doctrine\ORM\Mapping as ORM;

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
     * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\CrewRequest", mappedBy="requester")
     */
    protected  $listCrewRequests;

    /**
     * @ORM\ManyToMany(targetEntity="RFC\CoreBundle\Entity\Championship", mappedBy="listUsers", cascade={"persist"})
     */
    protected $listChampionships;

    public function __construct()
    {
        parent::__construct();
        $this->listChampionships = array();
        $this->listCrewRequests = array();
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

    public function eraseCredentials()
    {}

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

    public function getListCrewRequests()
    {
        return $this->listCrewRequests;
    }

    public function setListCrewRequests($listCrewRequests)
    {
        $this->listCrewRequests = $listCrewRequests;
        return $this;
    }
 
    /**
     * Add listChampionships
     *
     * @param \RFC\CoreBundle\Entity\Championship $listChampionships            
     * @return User
     */
    public function addListChampionship(\RFC\CoreBundle\Entity\Championship $listChampionships)
    {
        $this->listChampionships[] = $listChampionships;
        
        return $this;
    }

    /**
     * Remove listChampionships
     *
     * @param \RFC\CoreBundle\Entity\Championship $listChampionships            
     */
    public function removeListChampionship(\RFC\CoreBundle\Entity\Championship $listChampionships)
    {
        $this->listChampionships->removeElement($listChampionships);
    }

    /**
     * Get listChampionships
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getListChampionships()
    {
        return $this->listChampionships;
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
}
