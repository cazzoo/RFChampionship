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
use RFC\CoreBundle\Entity\Descriptor;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Session
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\CoreBundle\Entity\SessionRepository")
 */
class Session extends Descriptor
{
    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\Result", mappedBy="session", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=true)
     */
    private $listResults;

    /**
     * @ORM\Column(name="begin_date", type="datetime")
     */
    private $beginDate;

    /**
     * @ORM\Column(name="end_date", type="datetime")
     */
    private $endDate;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\TypeSession")
     * @ORM\JoinColumn(nullable=false)
     */
    private $typeSession;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Event", inversedBy="listSessions")
     * @ORM\JoinColumn(nullable=false)
     */
    private $event;

    public function __construct()
    {
        $this->listResults = new ArrayCollection();
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
     *
     * @return ArrayCollection
     */
    public function getListResults()
    {
        return $this->listResults;
    }

    public function setListResults(ArrayCollection $listResults)
    {
        $this->listResults = $listResults;
        return $this;
    }

    public function addResult(Result $result)
    {
        $this->listResults[] = $result;

        return $this;
    }

    public function removeResult(Result $result)
    {
        $this->listResults->removeElement($result);
    }

    /**
     * Set beginDate
     *
     * @param \DateTime $beginDate            
     * @return Session
     */
    public function setBeginDate($beginDate)
    {
        $this->beginDate = $beginDate;

        return $this;
    }

    /**
     * Get beginDate
     *
     * @return \DateTime
     */
    public function getBeginDate()
    {
        return $this->beginDate;
    }

    /**
     * Set endDate
     *
     * @param \DateTime $endDate            
     * @return Session
     */
    public function setEndDate($endDate)
    {
        $this->endDate = $endDate;

        return $this;
    }

    /**
     * Get endDate
     *
     * @return \DateTime
     */
    public function getEndDate()
    {
        return $this->endDate;
    }

    /**
     * Set type
     *
     * @param integer $typeSession
     * @return Session
     */
    public function setTypeSession($typeSession)
    {
        $this->typeSession = $typeSession;

        return $this;
    }

    /**
     * Get type
     *
     * @return integer
     */
    public function getTypeSession()
    {
        return $this->typeSession;
    }

    /**
     * Set event
     *
     * @param Event $event            
     * @return Session
     */
    public function setEvent(Event $event)
    {
        $this->event = $event;

        return $this;
    }

    /**
     * Get event
     *
     * @return Event
     */
    public function getEvent()
    {
        return $this->event;
    }
}