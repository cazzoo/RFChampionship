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

use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\JoinTable;
use Doctrine\Common\Collections\ArrayCollection;
use JMS\Serializer\Annotation\Groups;
use RFC\UserBundle\Entity\User;

/**
 * Team
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\CoreBundle\Entity\TeamRepository")
 */
class Team extends Descriptor
{
    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @Groups({"api", "id"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Championship", inversedBy="listTeams")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"api"})
     */
    protected $championship;

    /**
     * @ORM\ManyToMany(targetEntity="RFC\UserBundle\Entity\User")
     * @JoinTable(name="team_mainDrivers")
     * @Groups({"list","api"})
     */
    private $listMainDrivers;

    /**
     * @ORM\ManyToMany(targetEntity="RFC\UserBundle\Entity\User")
     * @JoinTable(name="team_secondaryDrivers")
     * @Groups({"list","api"})
     */
    private $listSecondaryDrivers;

    /**
     * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\Registration", mappedBy="team")
     * @ORM\JoinColumn(nullable=true)
     * @Groups({"list","api"})
     */
    private $listRegistration;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"list","api"})
     */
    private $maxMainDrivers;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"list","api"})
     */
    private $maxSecondaryDrivers;

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();
        $this->listMainDrivers = new ArrayCollection();
        $this->listSecondaryDrivers = new ArrayCollection();
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

    public function getChampionship()
    {
        return $this->championship;
    }

    /**
     * @param Championship $championship
     */
    public function setChampionship($championship)
    {
        $this->championship = $championship;
    }

    /**
     * Get listMainDrivers
     *
     * @return ArrayCollection
     */
    public function getListMainDrivers()
    {
        return $this->listMainDrivers;
    }

    /**
     * Set listMainDrivers
     *
     * @param ArrayCollection $listMainDrivers
     * @return Team
     */
    public function setListMainDrivers(ArrayCollection $listMainDrivers)
    {
        $this->listMainDrivers = $listMainDrivers;

        return $this;
    }

    /**
     * Add user
     *
     * @param User $user
     * @return addSuccess $this or false
     */
    public function addMainDriver(User $user)
    {
        if ($this->listMainDrivers->contains($user)) {
            return false;
        }
        return $this->listMainDrivers->add($user) ? $this : false;
    }

    /**
     * Remove user
     *
     * @param User $user
     * @return removeSuccess $this or false
     */
    public function removeMainDriver(
        User $user
    ) {
        if (!$this->listMainDrivers->contains($user)) {
            return false;
        }
        return $this->listMainDrivers->removeElement($user) ? $this : false;
    }

    /**
     * Get listSecondaryDrivers
     *
     * @return ArrayCollection
     */
    function getListSecondaryDrivers()
    {
        return $this->listSecondaryDrivers;
    }

    /**
     * Set listSecondaryDrivers
     *
     * @param ArrayCollection $listSecondaryDrivers
     * @return Team
     */
    function setListSecondaryDrivers($listSecondaryDrivers)
    {
        $this->listSecondaryDrivers = $listSecondaryDrivers;
    }

    /**
     * Add user
     *
     * @param User $user
     * @return addSuccess $this or false
     */
    public function addSecondaryDriver(
        User $user
    ) {
        if ($this->listSecondaryDrivers->contains($user)) {
            return false;
        }
        return $this->listSecondaryDrivers->add($user) ? $this : false;
    }

    /**
     * Remove user
     *
     * @param User $user
     * @return removeSuccess $this or false
     */
    public function removeSecondaryDriver(
        User $user
    ) {
        if (!$this->listSecondaryDrivers->contains($user)) {
            return false;
        }
        return $this->listSecondaryDrivers->removeElement($user) ? $this : false;
    }

    /**
     * @return mixed
     */
    public function getListRegistration()
    {
        return $this->listRegistration;
    }

    /**
     * @param mixed $listRegistration
     */
    public function setListRegistration($listRegistration)
    {
        $this->listRegistration = $listRegistration;
    }

    public function getMaxMainDrivers()
    {
        return $this->maxMainDrivers;
    }

    public function setMaxMainDrivers($maxMainDrivers)
    {
        $this->maxMainDrivers = $maxMainDrivers;
        return $this;
    }

    public function getMaxSecondaryDrivers()
    {
        return $this->maxSecondaryDrivers;
    }

    public function setMaxSecondaryDrivers($maxSecondaryDrivers)
    {
        $this->maxSecondaryDrivers = $maxSecondaryDrivers;
        return $this;
    }
}