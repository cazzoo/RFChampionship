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

namespace RFC\SetupBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use RFC\CoreBundle\Entity\KnowledgeData;
use RFC\UserBundle\Entity\User;
use RFC\CoreBundle\Entity\Vehicle;
use RFC\CoreBundle\Entity\Track;

/**
 * Game
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="SetupRepository")
 */
class Setup extends KnowledgeData
{
    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\OneToMany(targetEntity="SetupStep", mappedBy="setup", cascade={"persist", "remove"})
     */
    private $listSetupSteps;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\UserBundle\Entity\User")
     */
    private $user;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Track")
     * @ORM\JoinColumn(nullable=true, onDelete="CASCADE")
     */
    private $track;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Vehicle")
     * @ORM\JoinColumn(nullable=false, onDelete="CASCADE")
     */
    private $vehicle;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Game")
     * @ORM\JoinColumn(nullable=false, onDelete="CASCADE")
     */
    protected $game;

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();
        $this->listSetupSteps = new ArrayCollection ();
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
     *
     * @return ArrayCollection
     */
    public function getListSetupSteps()
    {
        return $this->listSetupSteps;
    }

    /**
     *
     * @param ArrayCollection $listSetupSteps
     * @return Setup
     */
    public function setListSetupSteps(ArrayCollection $listSetupSteps)
    {
        $this->listSetupSteps = $listSetupSteps;
        return $this;
    }

    /**
     * Add $setupStep
     *
     * @param SetupStep $setupStep
     * @return Setup
     */
    public function addListSetupSteps(SetupStep $setupStep)
    {
        $this->listSetupSteps->add($setupStep);

        return $this;
    }

    /**
     * Remove $setupStep
     *
     * @param SetupStep $setupStep
     */
    public function removeListSetupSteps(SetupStep $setupStep)
    {
        $this->listSetupSteps->removeElement($setupStep);
    }

    /**
     *
     * @return User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     *
     * @param User $user
     * @return Setup
     */
    public function setUser(User $user)
    {
        $this->user = $user;
        return $this;
    }

    /**
     *
     * @return Track
     */
    public function getTrack()
    {
        return $this->track;
    }

    /**
     *
     * @param Track $track
     * @return Setup
     */
    public function setTrack(Track $track)
    {
        $this->track = $track;
        return $this;
    }

    /**
     *
     * @return Vehicle
     */
    public function getVehicle()
    {
        return $this->vehicle;
    }

    /**
     *
     * @param Vehicle $vehicle
     * @return Setup
     */
    public function setVehicle(Vehicle $vehicle)
    {
        $this->vehicle = $vehicle;
        return $this;
    }

    /**
     * Returns all the steps and their version in a nested array
     * @return array the steps ordered
     */
    public function getOrderedSteps()
    {
        $ordoredSteps = array();
        foreach ($this->listSetupSteps as $setupStep) {
            $order = $setupStep->getStep()->getStepOrder();
            // Test if step does not exists or not new
            if (empty($ordoredSteps)) {
                $ordoredSteps [$order] = array(
                    $setupStep
                );
            } else {
                if (array_key_exists($order, $ordoredSteps)) {
                    array_push($ordoredSteps [$order], $setupStep);
                } else {
                    $ordoredSteps [$order] = array(
                        $setupStep
                    );
                }
            }
        }
        ksort($ordoredSteps);
        return $ordoredSteps;
    }

    /**
     * Returns the last step that contains data
     * @return Step the last step completed
     */
    public function getLastStepCompleted()
    {
        $lastVersionCompleted = null;
        foreach ($this->listSetupSteps as $setupStep) {
            $versionExists = null !== $lastVersionCompleted;
            if ((!$versionExists && $setupStep->getValue() != "") || ($versionExists
                && $this->getLastSetupStepVersion($setupStep->getStep()->getStepOrder())->getValue()
                != "")) {
                $lastVersionCompleted = $setupStep;
            }
        }
        return $lastVersionCompleted;
    }

    /**
     * Returns the last version of a SetupStep
     *
     * @param int $stepNumber
     * @return int the last setupstep version number
     */
    public function getLastSetupStepVersion($stepNumber)
    {
        $lastVersion = null;
        foreach ($this->listSetupSteps as $setupStep) {
            $sameStep       = $setupStep->getStep()->getStepOrder() == $stepNumber;
            $versionExists  = null !== $lastVersion;
            $versionGreater = $versionExists ? $lastVersion->getVersion() < $setupStep->getVersion()
                    : false;
            if ($sameStep && (!$versionExists || ($versionExists && $versionGreater))) {
                $lastVersion = $setupStep;
            }
        }
        return $lastVersion;
    }
}