<?php

namespace RFC\CoreBundle\Entity;

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
     * @var array
     *
     * @ORM\Column(name="list_events", type="array")
     */
    private $listEvents;

    /**
     * @var array
     *
     * @ORM\Column(name="list_managers", type="array")
     */
    private $listManagers;

    /**
     * @var array
     *
     * @ORM\Column(name="meta_rule", type="array")
     */
    private $metaRule;

    /**
     * @var array
     *
     * @ORM\Column(name="list_rules", type="array")
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
}
