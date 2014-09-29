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

use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping as ORM;
use RFC\CoreBundle\Entity\DescriptorTrait;

/**
 * Crew
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\CoreBundle\Entity\CrewRepository")
 */
class Crew
{

    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Game")
     * @ORM\JoinColumn(nullable=false)
     */
    private $game;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\UserBundle\Entity\User")
     * @ORM\JoinColumn(nullable=false)
     */
    private $manager;

    /**
     * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\CrewRequest", mappedBy="crew", cascade={"persist", "remove"})
     */
    private $listCrewRequests;

    /**
     * @Gedmo\Timestampable(on="create")
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @Gedmo\Timestampable(on="update")
     * @ORM\Column(type="datetime")
     */
    private $updatedAt;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->listCrewRequests = new \Doctrine\Common\Collections\ArrayCollection();
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

    public function getGame() {
        return $this->game;
    }

    public function setGame($game) {
        $this->game = $game;
        return $this;
    }

    /**
     * Return the manager
     *
     */
    public function getManager()
    {
        return $this->manager;
    }

    public function setManager($user) {
        $this->manager = $user;
        return $this;
    }

    public function isManager($userId) {
        return ($userId === $this->manager->getId()) ? true : false;
    }

    public function getMembers($state) {
        $members = array();
        foreach($this->listCrewRequests as $crewRequest)
        {
            if($state == $crewRequest->getState())
            {
                array_push($members, $crewRequest->getRequester());
            }
        }
        return $members;
    }

    public function getActiveMembers()
    {
        return $this->getMembers(2);
    }

    public function isActiveMember($userId)
    {
        foreach ($this->getActiveMembers() as $member)
        {
            if ($userId == $member->getId())
            {
                return true;
            }
        }
        return false;
    }

    public function getAwaitingMembers()
    {
        return $this->getMembers(1);
    }

    public function isAwaitingMember($userId)
    {
        foreach ($this->getAwaitingMembers() as $member)
        {
            if ($member->getId() == $userId)
            {
                return true;
            }
        }
        return false;
    }

    public function getUserState($userId)
    {
        if($this->isActiveMember($userId))
        {
            return 2;
        } else if($this->isAwaitingMember($userId))
        {
            return 1;
        } else 
        {
            return 4;
        }
    }

    /**
     * Add CrewRequest
     *
     * @param \RFC\CoreBundle\Entity\CrewRequest $listCrewRequest            
     * @return CrewRequest
     */
    public function addListCrewRequest(\RFC\CoreBundle\Entity\CrewRequest $crewRequest)
    {
        $this->listCrewRequests[] = $crewRequest;

        return $this;
    }

    /**
     * Remove listCrewRequests
     *
     * @param \RFC\CoreBundle\Entity\CrewRequest $listCrewRequests
     */
    public function removeListCrewRequest(\RFC\CoreBundle\Entity\CrewRequest $crewRequest)
    {
        $this->listCrewRequests->removeElement($crewRequest);
    }

    /**
     * Get listCrewRequests
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getListCrewRequests()
    {
        return $this->listCrewRequests;
    }

    public function getUserCrewRequest($userId)
    {
        foreach($this->listCrewRequests as $crewRequest)
        {
            if($userId == $crewRequest->getRequester()->getId())
            {
                return $crewRequest;            }
        }
        return null;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt            
     * @return Game
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Get createdAt
     *
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Set updatedAt
     *
     * @param \DateTime $updatedAt            
     * @return Game
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * Get updatedAt
     *
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }
}
