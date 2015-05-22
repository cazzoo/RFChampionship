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

use Gedmo\Timestampable\Traits\TimestampableEntity;
use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping as ORM;
use RFC\UserBundle\Entity\User;

/**
 * CrewRequest
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\CoreBundle\Entity\CrewRequestRepository")
 */
class CrewRequest
{

    /**
     * Hook timestampable behavior
     * updates createdAt, updatedAt fields
     */
    use TimestampableEntity;
    public static $stateEnum = array(
        '1' => 'New',
        '2' => 'Accepted',
        '3' => 'Refused',
        '4' => 'Abandonned'
    );

    public static function getStateEnum()
    {
        return self::$stateEnum;
    }

    public static function getStateKeys()
    {
        return array_keys(self::$stateEnum);
    }

    public static function getStateValues()
    {
        return array_values(self::$stateEnum);
    }

    public static function getKeyForValue($value)
    {
        return array_search($value, self::getStateValues(), true);
    }
    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Crew", inversedBy="listCrewRequests", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false, onDelete="cascade")
     */
    private $crew;

    /**
     * @ORM\Column(name="state", type="integer")
     */
    private $state;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\UserBundle\Entity\User", inversedBy="listCrewRequests")
     * @ORM\JoinColumn(nullable=false)
     */
    private $requester;

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     *
     * @return Crew
     */
    public function getCrew()
    {
        return $this->crew;
    }

    /**
     *
     * @param Crew $crew
     * @return CrewRequest
     */
    public function setCrew(Crew $crew)
    {
        $this->crew = $crew;
        return $this;
    }

    /**
     *
     * @return int
     */
    public function getState()
    {
        return $this->state;
    }

    /**
     * @param int $state
     * @return CrewRequest
     */
    public function setState($state)
    {
        $this->state = $state;
        return $this;
    }

    /**
     *
     * @return User
     */
    public function getRequester()
    {
        return $this->requester;
    }

    /**
     *
     * @param User $requester
     * @return CrewRequest
     */
    public function setRequester(User $requester)
    {
        $this->requester = $requester;
        return $this;
    }
}