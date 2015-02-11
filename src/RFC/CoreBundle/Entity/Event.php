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

/**
 * Event
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\CoreBundle\Entity\EventRepository")
 */
class Event extends Descriptor
{
    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(name="listBroadcast", type="array")
     */
    private $listBroadcast;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Track")
     * @ORM\JoinColumn(nullable=false)
     */
    private $track;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Vehicle")
     * @ORM\JoinColumn(nullable=true)
     */
    private $vehicle;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Category")
     * @ORM\JoinColumn(nullable=true)
     */
    private $category;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Championship", inversedBy="listEvents")
     * @ORM\JoinColumn(nullable=false)
     */
    private $championship;

    /**
     * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\Session", mappedBy="event", cascade={"persist", "remove"})
     */
    private $listSessions;

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();
        $this->listSessions = new \Doctrine\Common\Collections\ArrayCollection();
    }

    public function __toString()
    {
        return (string) $this->id;
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
     * Get Earlyer Date Form Sessions
     *
     * @return \DateTime
     */
    public function getBeginDate()
    {
        $template = new \DateTime('01/01/1900');
        $template->format('Y-m-d H:i:s');
        if ($this->listSessions[0] !== null) {
            $beginDate = $this->listSessions[0]->getBeginDate();
        } else {
            $beginDate = $template;
        }
        foreach ($this->listSessions as $session) {
            if ($beginDate > $session->getBeginDate()) {
                $beginDate = $session->getBeginDate();
            }
        }
        if ($beginDate != $template) {
            return $beginDate;
        } else {
            return null;
        }
    }

    /**
     * Get Lastest Date From Sessions
     *
     * @return \DateTime
     */
    public function getEndDate()
    {
        $template = new \DateTime('01/01/2100');
        $template->format('Y-m-d H:i:s');
        if ($this->listSessions[0] !== null) {
            $endDate = $this->listSessions[0]->getEndDate();
        } else {
            $endDate = $template;
        }
        foreach ($this->listSessions as $session) {
            if ($endDate < $session->getEndDate()) {
                $endDate = $session->getEndDate();
            }
        }
        if ($endDate != $template) {
            return $endDate;
        } else {
            return null;
        }
    }

    /**
     * Set listBroadcast
     *
     * @param array $listBroadcast            
     * @return Event
     */
    public function setListBroadcast($listBroadcast)
    {
        $this->listBroadcast = $listBroadcast;

        return $this;
    }

    /**
     * Get listBroadcast
     *
     * @return array
     */
    public function getListBroadcast()
    {
        return $this->listBroadcast;
    }

    /**
     * Set track
     *
     * @param \stdClass $track            
     * @return Event
     */
    public function setTrack($track)
    {
        $this->track = $track;

        return $this;
    }

    /**
     * Get track
     *
     * @return \stdClass
     */
    public function getTrack()
    {
        return $this->track;
    }

    /**
     * Set vehicle
     *
     * @param \stdClass $vehicle            
     * @return Event
     */
    public function setVehicle($vehicle)
    {
        $this->vehicle = $vehicle;

        return $this;
    }

    /**
     * Get vehicle
     *
     * @return \stdClass
     */
    public function getVehicle()
    {
        return $this->vehicle;
    }

    /**
     * Set category
     *
     * @param \stdClass $category            
     * @return Event
     */
    public function setCategory($category)
    {
        $this->category = $category;

        return $this;
    }

    /**
     * Get category
     *
     * @return \stdClass
     */
    public function getCategory()
    {
        return $this->category;
    }

    /**
     * Set championship
     *
     * @param \RFC\CoreBundle\Entity\Championship $championship            
     * @return Event
     */
    public function setChampionship(\RFC\CoreBundle\Entity\Championship $championship)
    {
        $this->championship = $championship;

        return $this;
    }

    /**
     * Get championship
     *
     * @return \RFC\CoreBundle\Entity\Championship
     */
    public function getChampionship()
    {
        return $this->championship;
    }

    /**
     * Add session
     *
     * @param \RFC\CoreBundle\Entity\Session $session
     * @return Event
     */
    public function addSession(\RFC\CoreBundle\Entity\Session $session)
    {
        $this->listSessions[] = $session;

        return $this;
    }

    /**
     * Remove session
     *
     * @param \RFC\CoreBundle\Entity\Session $session
     */
    public function removeSession(\RFC\CoreBundle\Entity\Session $session)
    {
        $this->listSessions->removeElement($session);
    }

    /**
     * Get listSessions
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getListSessions()
    {
        return $this->listSessions;
    }

    /**
     * Returns the last session of the event.
     * @return the last session of the event
     */
    public function getLastSession()
    {
        $lastSession = null;
        foreach ($this->listSessions as $session) {
            if (null == $lastSession) {
                $lastSession = $session;
            } else {
                if ($lastSession->getEndDate() < $session->getBeginDate()) {
                    $lastSession = $session;
                }
            }
            return $lastSession;
        }
    }
}