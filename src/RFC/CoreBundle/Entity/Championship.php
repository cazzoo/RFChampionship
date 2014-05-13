<?php
namespace RFC\CoreBundle\Entity;

use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping as ORM;

/**
 * Championship
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\CoreBundle\Entity\ChampionshipRepository")
 */
class Championship
{

    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(name="isAgreed", type="boolean")
     */
    private $isAgreed;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Game")
     * @ORM\JoinColumn(nullable=false)
     */
    private $game;

    /**
     * @ORM\Column(name="list_managers", type="array")
     */
    private $listManagers;

    /**
     * @ORM\ManyToMany(targetEntity="RFC\CoreBundle\Entity\MetaRule"), cascade={"persist"}
     */
    private $metaRule;

    /**
     * @ORM\ManyToMany(targetEntity="RFC\CoreBundle\Entity\Rule"), cascade={"persist"}
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
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
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
     * Set game
     *
     * @param \RFC\CoreBundle\Entity\Game $game            
     * @return Championship
     */
    public function setGame(\RFC\CoreBundle\Entity\Game $game)
    {
        $this->game = $game;
        
        return $this;
    }

    /**
     * Get game
     *
     * @return \RFC\CoreBundle\Entity\Game
     */
    public function getGame()
    {
        return $this->game;
    }

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->metaRule = new \Doctrine\Common\Collections\ArrayCollection();
        $this->listRules = new \Doctrine\Common\Collections\ArrayCollection();
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
}
