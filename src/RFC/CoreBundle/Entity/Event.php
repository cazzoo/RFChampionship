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
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(name="beginDate", type="date")
     */
    private $beginDate;

    /**
     * @ORM\Column(name="endDate", type="date")
     */
    private $endDate;

    /**
     * @ORM\Column(name="listBroadcast", type="array")
     */
    private $listBroadcast;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Track")
     */
    private $track;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Vehicle")
     */
    private $vehicle;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Category")
     */
    private $category;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Championship", inversedBy="listEvents")
     * @ORM\JoinColumn(nullable=false)
     */
    private $championship;
    
    /**
     * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\Session", mappedBy="event")
     */
    private $listSessions;

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
        $this->listSessions = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    public function __toString()
    {
        return (String) $this->id;
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

    /**
     * Add listSessions
     *
     * @param \RFC\CoreBundle\Entity\Session $listSessions
     * @return Event
     */
    public function addListSession(\RFC\CoreBundle\Entity\Session $listSessions)
    {
        $this->listSessions[] = $listSessions;
    
        return $this;
    }

    /**
     * Remove listSessions
     *
     * @param \RFC\CoreBundle\Entity\Session $listSessions
     */
    public function removeListSession(\RFC\CoreBundle\Entity\Session $listSessions)
    {
        $this->listSessions->removeElement($listSessions);
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
}
