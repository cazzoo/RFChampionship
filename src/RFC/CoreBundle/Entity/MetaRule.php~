<?php

namespace RFC\CoreBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use RFC\CoreBundle\Entity\KnowledgeData;

/**
 * MetaRule
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\CoreBundle\Entity\MetaRuleRepository")
 */
class MetaRule extends KnowledgeData
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
     * @var \array
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
     * Set listRules
     *
     * @param \array $listRules
     * @return MetaRule
     */
    public function setListRules($listRules)
    {
        $this->listRules = $listRules;
    
        return $this;
    }

    /**
     * Get listRules
     *
     * @return \array 
     */
    public function getListRules()
    {
        return $this->listRules;
    }
}
