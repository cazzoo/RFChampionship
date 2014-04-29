<?php

namespace RFC\CoreBundle\Entity;

use Gedmo\Timestampable\Traits\TimestampableEntity;
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
     * Hook timestampable behavior
     * updates createdAt, updatedAt fields
     */
    use TimestampableEntity;
    
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var boolean
     *
     * @ORM\Column(name="isAgreed", type="boolean")
     */
    private $isAgreed;
    
    /**
     * @var RFC\CoreBundle\Entity\Game
     * 
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Game")
  	 * @ORM\JoinColumn(nullable=false)
     */
    private $game;

    /**
     * @var array
     *
     * @ORM\Column(name="list_managers", type="array")
     */
    private $listManagers;

    /**
     * @var array
     *
     * @ORM\ManyToMany(targetEntity="RFC\CoreBundle\Entity\MetaRule"), cascade={"persist"}
     */
    private $metaRule;

    /**
     * @var array
     *
     * @ORM\ManyToMany(targetEntity="RFC\CoreBundle\Entity\Rule"), cascade={"persist"}
     */
    private $listRules;


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
}
