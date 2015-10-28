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
use Gedmo\Mapping\Annotation as Gedmo;
use Gedmo\Timestampable\Traits\TimestampableEntity;
use JMS\Serializer\Annotation\Groups;
use RFC\UserBundle\Entity\User;

/**
 * Registration
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RegistrationRepository")
 */
class Registration
{

    const DRIVER_TYPE_MAIN = 1;
    const DRIVER_TYPE_SECONDARY = 2;

    /**
     * Hook timestampable behavior
     * updates createdAt, updatedAt fields
     */
    use TimestampableEntity;

    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @Groups({"api"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Championship", inversedBy="listRegistrations")
     * @ORM\JoinColumn(onDelete="cascade")
     * @Groups({"api"})
     */
    private $championship;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\UserBundle\Entity\User")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"api"})
     */
    private $user;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Vehicle")
     * @ORM\JoinColumn(nullable=true)
     * @Groups({"api"})
     */
    private $vehicle;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Team", inversedBy="listRegistration")
     * @ORM\JoinColumn(nullable=true)
     * @Groups({"api"})
     */
    private $team;

    /**
     * @ORM\Column(name="type", type="smallint")
     * @Groups({"api"})
     */
    private $type;

    /**
     * Class constructor
     */
    public function __construct(Championship $championship, User $user, $type = self::DRIVER_TYPE_MAIN, Team $team = NULL)
    {
        $this->championship = $championship;
        $this->user = $user;
        $this->type = $type;
        $this->team = $team;
    }

    public function __toString()
    {
        return $this->championship->getName();
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
     * @return Championship
     */
    public function getChampionship()
    {
        return $this->championship;
    }

    /**
     * @param Championship $championship
     * @return Registration
     */
    public function setChampionship(Championship $championship)
    {
        $this->championship = $championship;
        return $this;
    }

    /**
     * @return Team
     */
    public function getTeam()
    {
        return $this->team;
    }

    /**
     * @param Team $team
     * @return Registration
     */
    public function setTeam(Team $team)
    {
        $this->team = $team;
        return $this;
    }

    /**
     * @return Vehicle
     */
    public function getVehicle()
    {
        return $this->vehicle;
    }

    /**
     * @param Vehicle $vehicle
     * @return Registration
     */
    public function setVehicle(Vehicle $vehicle)
    {
        $this->vehicle = $vehicle;
        return $this;
    }

    /**
     * @return User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @param mixed $user
     * @return Registration
     */
    public function setUser($user)
    {
        $this->user = $user;
        return $this;
    }

    /**
     * @return integer
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param integer $type
     */
    public function setType($type)
    {
        $this->type = $type;
    }

}