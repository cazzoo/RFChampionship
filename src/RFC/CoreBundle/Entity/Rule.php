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

/**
 * Rule
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\CoreBundle\Entity\RuleRepository")
 */
class Rule extends KnowledgeData
{

    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Game", inversedBy="listRules")
     * @ORM\JoinColumn(nullable=false)
     */
    protected $game;

    /**
     * @ORM\Column(name="value", type="text")
     */
    private $value;

    /**
     * @ORM\ManyToMany(targetEntity="RFC\CoreBundle\Entity\MetaRule", mappedBy="listRules")
     */
    private $listMetaRules;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\TypeSession")
     * @ORM\JoinColumn(nullable=false)
     */
    private $typeSession;

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();
        $this->listMetaRules = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Set value
     *
     * @param string $value            
     * @return Rule
     */
    public function setValue($value)
    {
        $this->value = $value;
        
        return $this;
    }

    /**
     * Get value
     *
     * @return string
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * Add metaRule
     *
     * @param \RFC\CoreBundle\Entity\MetaRule $metaRule
     * @return Rule
     */
    public function addMetaRule(\RFC\CoreBundle\Entity\MetaRule $metaRule)
    {
        $this->listMetaRules[] = $metaRule;
        
        return $this;
    }

    /**
     * Remove metaRule
     *
     * @param \RFC\CoreBundle\Entity\MetaRule $metaRule
     */
    public function removeMetaRule(\RFC\CoreBundle\Entity\MetaRule $metaRule)
    {
        $this->listMetaRules->removeElement($metaRule);
    }

    /**
     * Get listMetaRules
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getListMetaRules()
    {
        return $this->listMetaRules;
    }

    public function getTypeSession()
    {
        return $this->typeSession;
    }

    public function setTypeSession($typeSession)
    {
        $this->typeSession = $typeSession;
        return $this;
    }
}
