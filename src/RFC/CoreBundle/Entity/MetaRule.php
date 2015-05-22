<?php
/*  //RF//Championship is a multi-racing game team manager that allows members to organize and follow championships.
    Copyright (C) 2014 - //Racing-France//

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.*/

namespace RFC\CoreBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use RFC\CoreBundle\Entity\KnowledgeData;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * MetaRule
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\CoreBundle\Entity\MetaRuleRepository")
 */
class MetaRule extends KnowledgeData
{

    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Game", inversedBy="listMetaRules")
     * @ORM\JoinColumn(nullable=false)
     */
    protected $game;

    /**
     * @ORM\Column(name="metaRuleAgreed", type="boolean")
     */
    private $metaRuleAgreed;

    /**
     * @ORM\ManyToMany(targetEntity="RFC\CoreBundle\Entity\Rule", inversedBy="listMetaRules")
     */
    private $listRules;

    public function __construct()
    {
        parent::__construct();
        $this->listRules = new ArrayCollection();
    }

    public function __toString()
    {
        return $this->getName();
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
     * Set listRules
     *
     * @param ArrayCollection $listRules
     * @return MetaRule
     */
    public function setListRules(ArrayCollection $listRules)
    {
        $this->listRules = $listRules;
        
        return $this;
    }

    /**
     * Get listRules
     *
     * @return ArrayCollection
     */
    public function getListRules()
    {
        return $this->listRules;
    }

    /**
     * Add rule
     *
     * @param Rule $rule
     * @return MetaRule
     */
    public function addRule(Rule $rule)
    {
        $this->listRules[] = $rule;
        
        return $this;
    }

    /**
     * Remove listRules
     *
     * @param Rule $rule
     */
    public function removeRule(Rule $rule)
    {
        $this->listRules->removeElement($rule);
    }

    /**
     * Set metaRuleAgreed
     *
     * @param boolean $agreed
     * @return MetaRule
     */
    public function setMetaRuleAgreed($agreed)
    {
        $this->metaRuleAgreed = $agreed;
        
        return $this;
    }

    /**
     * Get metaRuleAgreed
     *
     * @return boolean
     */
    public function getMetaRuleAgreed()
    {
        return $this->metaRuleAgreed;
    }
}
