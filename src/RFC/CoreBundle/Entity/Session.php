<?php
namespace RFC\CoreBundle\Entity;

use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping as ORM;
use RFC\CoreBundle\Entity\Event;
use RFC\CoreBundle\Entity\DescriptorTrait;

/**
 * Session
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\CoreBundle\Entity\SessionRepository")
 */
class Session
{
    
    use DescriptorTrait;

    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(name="begin_date", type="date")
     */
    private $beginDate;

    /**
     * @ORM\Column(name="end_date", type="date")
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

    public function __toString()
    {
        return $this->name;
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
     * @param integer $type            
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
     * @param \RFC\CoreBundle\Entity\Event $event            
     * @return Session
     */
    public function setEvent(\RFC\CoreBundle\Entity\Event $event)
    {
        $this->event = $event;
        
        return $this;
    }

    /**
     * Get event
     *
     * @return \RFC\CoreBundle\Entity\Event
     */
    public function getEvent()
    {
        return $this->event;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt            
     * @return Session
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
     * @return Session
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
