<?php

namespace RFC\CoreBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Event
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\CoreBundle\Entity\EventRepository")
 */
class Event
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var array
     *
     * @ORM\Column(name="list_sessions", type="array")
     */
    private $listSessions;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="begin_date", type="date")
     */
    private $beginDate;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="end_date", type="date")
     */
    private $endDate;

    /**
     * @var array
     *
     * @ORM\Column(name="list_broadcast", type="array")
     */
    private $listBroadcast;

    /**
     * @var \stdClass
     *
     * @ORM\Column(name="track", type="object")
     */
    private $track;

    /**
     * @var \stdClass
     *
     * @ORM\Column(name="vehicle", type="object")
     */
    private $vehicle;

    /**
     * @var \stdClass
     *
     * @ORM\Column(name="category", type="object")
     */
    private $category;


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
     * Set listSessions
     *
     * @param array $listSessions
     * @return Event
     */
    public function setListSessions($listSessions)
    {
        $this->listSessions = $listSessions;
    
        return $this;
    }

    /**
     * Get listSessions
     *
     * @return array 
     */
    public function getListSessions()
    {
        return $this->listSessions;
    }

    /**
     * Set beginDate
     *
     * @param \DateTime $beginDate
     * @return Event
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
     * @return Event
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
}
