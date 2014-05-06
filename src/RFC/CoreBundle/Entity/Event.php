<?php

namespace RFC\CoreBundle\Entity;

use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping as ORM;
use RFC\CoreBundle\Entity\Championship;

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
     * @ORM\ManyToMany(targetEntity="RFC\CoreBundle\Entity\Track"), cascade={"persist"}
     */
    private $track;

    /**
     * @var \stdClass
     *
     * @ORM\ManyToMany(targetEntity="RFC\CoreBundle\Entity\Vehicle"), cascade={"persist"}
     */
    private $vehicle;

    /**
     * @var \stdClass
     *
     * @ORM\ManyToMany(targetEntity="RFC\CoreBundle\Entity\Category"), cascade={"persist"}
     */
    private $category;
    
    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Championship")
  	 * @ORM\JoinColumn(nullable=false)
     */
    private $championship;

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
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
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
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->track = new \Doctrine\Common\Collections\ArrayCollection();
        $this->vehicle = new \Doctrine\Common\Collections\ArrayCollection();
        $this->category = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Add track
     *
     * @param \RFC\CoreBundle\Entity\Track $track
     * @return Event
     */
    public function addTrack(\RFC\CoreBundle\Entity\Track $track)
    {
        $this->track[] = $track;
    
        return $this;
    }

    /**
     * Remove track
     *
     * @param \RFC\CoreBundle\Entity\Track $track
     */
    public function removeTrack(\RFC\CoreBundle\Entity\Track $track)
    {
        $this->track->removeElement($track);
    }

    /**
     * Add vehicle
     *
     * @param \RFC\CoreBundle\Entity\Vehicle $vehicle
     * @return Event
     */
    public function addVehicle(\RFC\CoreBundle\Entity\Vehicle $vehicle)
    {
        $this->vehicle[] = $vehicle;
    
        return $this;
    }

    /**
     * Remove vehicle
     *
     * @param \RFC\CoreBundle\Entity\Vehicle $vehicle
     */
    public function removeVehicle(\RFC\CoreBundle\Entity\Vehicle $vehicle)
    {
        $this->vehicle->removeElement($vehicle);
    }

    /**
     * Add category
     *
     * @param \RFC\CoreBundle\Entity\Category $category
     * @return Event
     */
    public function addCategory(\RFC\CoreBundle\Entity\Category $category)
    {
        $this->category[] = $category;
    
        return $this;
    }

    /**
     * Remove category
     *
     * @param \RFC\CoreBundle\Entity\Category $category
     */
    public function removeCategory(\RFC\CoreBundle\Entity\Category $category)
    {
        $this->category->removeElement($category);
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
     * Set createdAt
     *
     * @param \DateTime $createdAt
     * @return Event
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
     * @return Event
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
