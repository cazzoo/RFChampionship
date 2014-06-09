<?php
namespace RFC\CoreBundle\Entity;

use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping as ORM;
use RFC\CoreBundle\Entity\Championship;
use RFC\CoreBundle\Entity\Session;
use RFC\CoreBundle\Entity\DescriptorTrait;

/**
 * Event
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\CoreBundle\Entity\EventRepository")
 */
class Event
{
    use DescriptorTrait;

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
        if ($this->listSessions[0] != null) {
            $beginDate = $this->listSessions[0]->getBeginDate();
        } else
            $beginDate = $template;
        foreach ($this->listSessions as $session) {
            if ($beginDate > $session->getBeginDate()) {
                $beginDate = $session->getBeginDate();
            }
        }
        if ($beginDate != $template)
            return $beginDate;
        else
            return null;
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
        if ($this->listSessions[0] != null) {
            $endDate = $this->listSessions[0]->getEndDate();
        } else
            $endDate = $template;
        foreach ($this->listSessions as $session) {
            if ($endDate < $session->getEndDate()) {
                $endDate = $session->getEndDate();
            }
        }
        if ($endDate != $template)
            return $endDate;
        else
            return null;
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
