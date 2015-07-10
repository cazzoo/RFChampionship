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

use Doctrine\ORM\Mapping as ORM;
use RFC\CoreBundle\Entity\KnowledgeData;
use Doctrine\ORM\Mapping\JoinTable;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Team
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\CoreBundle\Entity\TeamRepository")
 */
class Team extends Descriptor {

    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Championship")
     * @ORM\JoinColumn(nullable=false)
     */
    protected $championship;

    /**
     * @ORM\ManyToMany(targetEntity="RFC\UserBundle\Entity\User")
     * @JoinTable(name="team_mainDrivers")
     */
    private $listMainDrivers;

    /**
     * @ORM\ManyToMany(targetEntity="RFC\UserBundle\Entity\User")
     * @JoinTable(name="team_secondaryDrivers")
     */
    private $listSecondaryDrivers;

    /**
     * @ORM\Column(type="integer")
     */
    private $maxMainDrivers;

    /**
     * @ORM\Column(type="integer")
     */
    private $maxSecondaryDrivers;

    public function __toString() {
        return $this->getName();
    }

    /**
     * Constructor
     */
    public function __construct() {
        parent::__construct();
        $this->listMainDrivers = new ArrayCollection();
        $this->listSecondaryDrivers = new ArrayCollection();
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId() {
        return $this->id;
    }

    function getChampionship() {
        return $this->championship;
    }

    function setChampionship($championship) {
        $this->championship = $championship;
    }

    /**
     * Get listMainDrivers
     *
     * @return ArrayCollection
     */
    public function getListMainDrivers() {
        return $this->listMainDrivers;
    }

    /**
     * Set listMainDrivers
     *
     * @param ArrayCollection $listMainDrivers
     * @return Team
     */
    public function setListMainDrivers(ArrayCollection $listMainDrivers) {
        $this->listMainDrivers = $listMainDrivers;

        return $this;
    }

    /**
     * Add user
     *
     * @param User $user
     * @return Team
     */
    public function addMainDriver(User $user) {
        $this->listMainDrivers[] = $user;

        return $this;
    }

    /**
     * Remove user
     *
     * @param User $user
     */
    public function removeMainDriver(User $user) {
        $this->listMainDrivers->removeElement($user);
    }

    /**
     * Get listSecondaryDrivers
     *
     * @return ArrayCollection
     */
    function getListSecondaryDrivers() {
        return $this->listSecondaryDrivers;
    }

    /**
     * Set listSecondaryDrivers
     *
     * @param ArrayCollection $listSecondaryDrivers
     * @return Team
     */
    function setListSecondaryDrivers($listSecondaryDrivers) {
        $this->listSecondaryDrivers = $listSecondaryDrivers;
    }

    /**
     * Add user
     *
     * @param User $user
     * @return Team
     */
    public function addSecondaryDriver(User $user) {
        $this->listSecondaryDrivers[] = $user;

        return $this;
    }

    /**
     * Remove user
     *
     * @param User $user
     */
    public function removeSecondaryDriver(User $user) {
        $this->listSecondaryDrivers->removeElement($user);
    }

    function getMaxMainDrivers() {
        return $this->maxMainDrivers;
    }

    function getMaxSecondaryDrivers() {
        return $this->maxSecondaryDrivers;
    }

    function setMaxMainDrivers($maxMainDrivers) {
        $this->maxMainDrivers = $maxMainDrivers;
        return $this;
    }

    function setMaxSecondaryDrivers($maxSecondaryDrivers) {
        $this->maxSecondaryDrivers = $maxSecondaryDrivers;
        return $this;
    }

}
