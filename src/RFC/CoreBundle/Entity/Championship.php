<?php
namespace RFC\CoreBundle\Entity;

use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping as ORM;
use RFC\CoreBundle\Entity\KnowledgeData;

/**
 * Championship
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\CoreBundle\Entity\ChampionshipRepository")
 */
class Championship extends KnowledgeData
{

    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(name="description", type="text", length=255, nullable=true)
     */
    private $description;

    /**
     * @ORM\Column(name="isAgreed", type="boolean")
     */
    private $isAgreed;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Game")
     * @ORM\JoinColumn(nullable=false)
     */
    protected $game;

    /**
     * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\Event", mappedBy="championship")
     */
    private $listEvents;

    /**
     * @ORM\ManyToMany(targetEntity="RFC\UserBundle\Entity\User")
     */
    private $listManagers;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\MetaRule")
     */
    private $metaRule;

    /**
     * @ORM\ManyToMany(targetEntity="RFC\CoreBundle\Entity\Rule")
     */
    private $listRules;

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
        $this->listEvents = new \Doctrine\Common\Collections\ArrayCollection();
        $this->listManagers = new \Doctrine\Common\Collections\ArrayCollection();
        $this->listRules = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
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
     * Set description
     *
     * @param string $description            
     * @return Game
     */
    public function setDescription($description)
    {
        $this->description = $description;
        
        return $this;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set isAgreed
     *
     * @param boolean $isAgreed            
     * @return Championship
     */
    public function setIsAgreed($isAgreed)
    {
        $this->isAgreed = $isAgreed;
        
        return $this;
    }

    /**
     * Get isAgreed
     *
     * @return boolean
     */
    public function getIsAgreed()
    {
        return $this->isAgreed;
    }

    /**
     * Set listEvents
     *
     * @param array $listEvents            
     * @return Championship
     */
    public function setListEvents($listEvents)
    {
        $this->listEvents = $listEvents;
        
        return $this;
    }

    /**
     * Get listEvents
     *
     * @return array
     */
    public function getListEvents()
    {
        return $this->listEvents;
    }

    /**
     * Set listManagers
     *
     * @param array $listManagers            
     * @return Championship
     */
    public function setListManagers($listManagers)
    {
        $this->listManagers = $listManagers;
        
        return $this;
    }

    /**
     * Get listManagers
     *
     * @return array
     */
    public function getListManagers()
    {
        return $this->listManagers;
    }

    /**
     * Set metaRuleId
     *
     * @param \stdClass $metaRuleId            
     * @return Championship
     */
    public function setMetaRule($metaRule)
    {
        $this->metaRule = $metaRule;
        
        return $this;
    }

    /**
     * Get metaRuleId
     *
     * @return \stdClass
     */
    public function getMetaRule()
    {
        return $this->metaRule;
    }

    /**
     * Set listRules
     *
     * @param array $listRules            
     * @return Championship
     */
    public function setListRules($listRules)
    {
        $this->listRules = $listRules;
        
        return $this;
    }

    /**
     * Get listRules
     *
     * @return array
     */
    public function getListRules()
    {
        return $this->listRules;
    }

    /**
     * Add metaRule
     *
     * @param \RFC\CoreBundle\Entity\MetaRule $metaRule            
     * @return Championship
     */
    public function addMetaRule(\RFC\CoreBundle\Entity\MetaRule $metaRule)
    {
        $this->metaRule[] = $metaRule;
        
        return $this;
    }

    /**
     * Remove metaRule
     *
     * @param \RFC\CoreBundle\Entity\MetaRule $metaRule            
     */
    public function removeMetaRule(\RFC\CoreBundle\Entity\MetaRule $metaRule)
    {
        $this->metaRule->removeElement($metaRule);
    }

    /**
     * Add listRules
     *
     * @param \RFC\CoreBundle\Entity\Rule $listRules            
     * @return Championship
     */
    public function addListRule(\RFC\CoreBundle\Entity\Rule $listRules)
    {
        $this->listRules[] = $listRules;
        
        return $this;
    }

    /**
     * Remove listRules
     *
     * @param \RFC\CoreBundle\Entity\Rule $listRules            
     */
    public function removeListRule(\RFC\CoreBundle\Entity\Rule $listRules)
    {
        $this->listRules->removeElement($listRules);
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt            
     * @return Championship
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
     * @return Championship
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
     * Add listEvents
     *
     * @param \RFC\CoreBundle\Entity\Event $listEvents
     * @return Championship
     */
    public function addListEvent(\RFC\CoreBundle\Entity\Event $listEvents)
    {
        $this->listEvents[] = $listEvents;
    
        return $this;
    }

    /**
     * Remove listEvents
     *
     * @param \RFC\CoreBundle\Entity\Event $listEvents
     */
    public function removeListEvent(\RFC\CoreBundle\Entity\Event $listEvents)
    {
        $this->listEvents->removeElement($listEvents);
    }

    /**
     * Add listManagers
     *
     * @param \RFC\UserBundle\Entity\User $listManagers
     * @return Championship
     */
    public function addListManager(\RFC\UserBundle\Entity\User $listManagers)
    {
        $this->listManagers[] = $listManagers;
    
        return $this;
    }

    /**
     * Remove listManagers
     *
     * @param \RFC\UserBundle\Entity\User $listManagers
     */
    public function removeListManager(\RFC\UserBundle\Entity\User $listManagers)
    {
        $this->listManagers->removeElement($listManagers);
    }
}
