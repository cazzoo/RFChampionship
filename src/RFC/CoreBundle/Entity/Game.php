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
use Doctrine\Common\Collections\ArrayCollection;
use JMS\Serializer\Annotation\Groups;

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
     * @Groups({"api"})
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
        $this->listChampionships = new ArrayCollection ();
        $this->listMetaRules     = new ArrayCollection ();
        $this->listRules         = new ArrayCollection ();
        $this->listProperties    = new ArrayCollection ();
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
    public function addChampionship(Championship $championship)
    {
        $this->listChampionships [] = $championship;

        return $this;
    }

    /**
     * Remove championship
     *
     * @param Championship $championship
     */
    public function removeChampionship(Championship $championship)
    {
        $this->listChampionships->removeElement($championship);
    }

    /**
     * Get listChampionships
     *
     * @return ArrayCollection
     */
    public function getListChampionships()
    {
        return $this->listChampionships;
    }

    /**
     * Add MetaRule
     *
     * @param MetaRule $metaRule
     * @return Game
     */
    public function addMetaRule(MetaRule $metaRule)
    {
        $this->listMetaRules [] = $metaRule;

        return $this;
    }

    /**
     * Remove metaRule
     *
     * @param MetaRule $metaRule
     */
    public function removeMetaRule(MetaRule $metaRule)
    {
        $this->listMetaRules->removeElement($metaRule);
    }

    /**
     * Get listMetaRules
     *
     * @return ArrayCollection
     */
    public function getListMetaRules()
    {
        return $this->listMetaRules;
    }

    /**
     * Add Rule
     *
     * @param Rule $rule
     * @return Game
     */
    public function addRule(Rule $rule)
    {
        $this->listRules [] = $rule;

        return $this;
    }

    /**
     * Add Property
     *
     * @param Property $property
     * @return Game
     */
    public function addProperty(Property $property)
    {
        $this->listProperties [] = $property;

        return $this;
    }

    /**
     * Remove Rule
     *
     * @param Rule $rule
     */
    public function removeRule(Rule $rule)
    {
        $this->listRules->removeElement($rule);
    }

    /**
     * Remove property
     *
     * @param Property $property
     */
    public function removeProperty(Property $property)
    {
        $this->listProperties->removeElement($property);
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
     * Get listTracks
     *
     * @return ArrayCollection
     */
    public function getListTracks()
    {
        return $this->listTracks;
    }

    public function setListTracks(ArrayCollection $listTracks)
    {
        $this->listTracks = $listTracks;
        return $this;
    }

    /**
     * Get listVehicles
     *
     * @return ArrayCollection
     */
    public function getListVehicles()
    {
        return $this->listVehicles;
    }

    public function setListVehicles(ArrayCollection $listVehicles)
    {
        $this->listVehicles = $listVehicles;
        return $this;
    }

    /**
     * Get listCategories
     *
     * @return ArrayCollection
     */
    public function getListCategories()
    {
        return $this->listCategories;
    }

    public function setListCategories(ArrayCollection $listCategories)
    {
        $this->listCategories = $listCategories;
        return $this;
    }

    /**
     * Get listTypeSessions
     *
     * @return ArrayCollection
     */
    public function getListTypeSessions()
    {
        return $this->listTypeSessions;
    }

    public function setListTypeSessions(ArrayCollection $listTypeSessions)
    {
        $this->listTypeSessions = $listTypeSessions;
        return $this;
    }

    /**
     * Get listProperties
     *
     * @return ArrayCollection
     */
    public function getListProperties()
    {
        return $this->listProperties;
    }

    public function setListProperties(ArrayCollection $listProperties)
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
     * Get and returns all the pending events.
     * @return array all the pending events for each championships
     */
    public function getCurrentSessions()
    {
        $currentSessions = Array();

        foreach ($this->listChampionships as $championship) {
            if (null != $championship->getCurrentSession()) {
                array_push($currentSessions, $championship->getCurrentSession());
            }
        }

        return $currentSessions;
    }

    /**
     * Get and returns all the future sessions that are not started yet.
     * @return array all the future sessions
     */
    public function getNextSessions()
    {
        $nextSessions = Array();

        foreach ($this->listChampionships as $championship) {
            if ((null != $championship->getCurrentEvent() && null != $championship->getCurrentEvent()->getNextSession())
                || (null != $championship->getNextEvent() && null != $championship->getNextEvent()->getNextSession())) {
                array_push($nextSessions, $championship->getNextSession());
            }
        }

        return $nextSessions;
    }
}