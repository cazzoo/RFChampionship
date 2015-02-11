<?php
/*
 * //RF//Championship is a multi-racing game team manager that allows members to organize and follow championships.
 * Copyright (C) 2014 - //Racing-France//
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

namespace RFC\CoreBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use RFC\CoreBundle\Entity\Descriptor;

/**
 * Game
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\CoreBundle\Entity\GameRepository")
 */
class Game extends Descriptor
{
    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(name="shortName", type="string", length=255)
     */
    private $shortName;

    /**
     * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\Championship", mappedBy="game", cascade={"persist", "remove"})
     */
    private $listChampionships;

    /**
     * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\MetaRule", mappedBy="game", cascade={"persist", "remove"})
     */
    private $listMetaRules;

    /**
     * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\Rule", mappedBy="game", cascade={"persist", "remove"})
     */
    private $listRules;

    /**
     * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\Track", mappedBy="game", cascade={"persist", "remove"})
     */
    private $listTracks;

    /**
     * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\Vehicle", mappedBy="game", cascade={"persist", "remove"})
     */
    private $listVehicles;

    /**
     * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\Category", mappedBy="game", cascade={"persist", "remove"})
     */
    private $listCategories;

    /**
     * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\TypeSession", mappedBy="game", cascade={"persist", "remove"})
     */
    private $listTypeSessions;

    /**
     * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\Property", mappedBy="game", cascade={"persist", "remove"})
     */
    private $listProperties;

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();
        $this->listChampionships = new \Doctrine\Common\Collections\ArrayCollection ();
        $this->listMetaRules     = new \Doctrine\Common\Collections\ArrayCollection ();
        $this->listRules         = new \Doctrine\Common\Collections\ArrayCollection ();
        $this->listProperties    = new \Doctrine\Common\Collections\ArrayCollection ();
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
     * Set shortName
     *
     * @param string $shortName
     * @return Game
     */
    public function setShortName($shortName)
    {
        $this->shortName = $shortName;

        return $this;
    }

    /**
     * Get shortName
     *
     * @return string
     */
    public function getShortName()
    {
        return $this->shortName;
    }

    /**
     * Add championship
     *
     * @param Championship $championship
     * @return Game
     */
    public function addChampionship(\RFC\CoreBundle\Entity\Championship $championship)
    {
        $this->listChampionships [] = $championship;

        return $this;
    }

    /**
     * Remove championship
     *
     * @param \RFC\CoreBundle\Entity\Championship $championship
     */
    public function removeChampionship(\RFC\CoreBundle\Entity\Championship $championship)
    {
        $this->listChampionships->removeElement($championship);
    }

    /**
     * Get listChampionships
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getListChampionships()
    {
        return $this->listChampionships;
    }

    /**
     * Add MetaRule
     *
     * @param \RFC\CoreBundle\Entity\MetaRule $metaRule
     * @return Game
     */
    public function addMetaRule(\RFC\CoreBundle\Entity\MetaRule $metaRule)
    {
        $this->listMetaRules [] = $metaRule;

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

    /**
     * Add Rule
     *
     * @param \RFC\CoreBundle\Entity\Rule $rule
     * @return Game
     */
    public function addRule(\RFC\CoreBundle\Entity\Rule $rule)
    {
        $this->listRules [] = $rule;

        return $this;
    }

    /**
     * Add Property
     *
     * @param \RFC\CoreBundle\Entity\Property $property
     * @return Game
     */
    public function addProperty(\RFC\CoreBundle\Entity\Property $property)
    {
        $this->listProperties [] = $property;

        return $this;
    }

    /**
     * Remove Rule
     *
     * @param \RFC\CoreBundle\Entity\Rule $rule
     */
    public function removeRule(\RFC\CoreBundle\Entity\Rule $rule)
    {
        $this->listRules->removeElement($rule);
    }

    /**
     * Remove property
     *
     * @param \RFC\CoreBundle\Entity\Property $property
     */
    public function removeProperty(\RFC\CoreBundle\Entity\Property $property)
    {
        $this->listProperties->removeElement($property);
    }

    /**
     * Get listRules
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getListRules()
    {
        return $this->listRules;
    }


    /**
     * Get listTracks
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getListTracks()
    {
        return $this->listTracks;
    }

    public function setListTracks($listTracks)
    {
        $this->listTracks = $listTracks;
        return $this;
    }


    /**
     * Get listVehicles
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getListVehicles()
    {
        return $this->listVehicles;
    }

    public function setListVehicles($listVehicles)
    {
        $this->listVehicles = $listVehicles;
        return $this;
    }


    /**
     * Get listCategories
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getListCategories()
    {
        return $this->listCategories;
    }

    public function setListCategories($listCategories)
    {
        $this->listCategories = $listCategories;
        return $this;
    }


    /**
     * Get listTypeSessions
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getListTypeSessions()
    {
        return $this->listTypeSessions;
    }

    public function setListTypeSessions($listTypeSessions)
    {
        $this->listTypeSessions = $listTypeSessions;
        return $this;
    }


    /**
     * Get listProperties
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getListProperties()
    {
        return $this->listProperties;
    }

    public function setListProperties($listProperties)
    {
        $this->listProperties = $listProperties;
        return $this;
    }

    public function getPropertyByName($name)
    {
        foreach ($this->listProperties as $property) {
            if ($property->getName() == $name) {
                return $property;
            }
        }
        return null;
    }

    public function getFlashNews()
    {
        return $this->getPropertyByName("flashNews");
    }

    public function getWeeklyDriver()
    {
        return $this->getPropertyByName("weeklyDriver");
    }

    /**
     * Returns the last Event within all the championships that begins the lastest.
     */
    public function getNextEvent()
    {
        $nextEvent = null;
        foreach ($this->listChampionships as $championships) {
            $lastChampionshipEvent = $championships->getLastEvent();
            if (null == $nextEvent) {
                $nextEvent = $lastChampionshipEvent;
            } else {
                if ($nextEvent->getBeginDate() > $lastChampionshipEvent->getBeginDate()) {
                    $nextEvent = $lastChampionshipEvent;
                }
            }
        }
        return $nextEvent;
    }
}