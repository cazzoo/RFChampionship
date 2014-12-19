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
use RFC\CoreBundle\Entity\Descriptor;

/**
 * Game
 *
 * @ORM\Entity()
 * @ORM\Entity(repositoryClass="RFC\SetupBundle\Entity\SubStepRepository")
 */
class SubStep extends Descriptor
{

    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\SetupBundle\Entity\Step", inversedBy="listSubSteps")
     * @ORM\JoinColumn(nullable=false, onDelete="cascade")
     */
    private $step;

    /**
     * @ORM\Column(name="action", type="string", length=255)
     */
    private $action;

    /**
     * @ORM\Column(name="stepCondition", type="text", nullable=true)
     */
    private $stepCondition;

    /**
     * @ORM\Column(name="toDoText", type="text", nullable=true)
     */
    private $toDoText;

    /**
     * @ORM\Column(name="optimalAction", type="boolean")
     */
    private $optimalAction;

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();
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

    public function getStep()
    {
        return $this->step;
    }

    public function setStep($step)
    {
        $this->step = $step;
        return $this;
    }

    public function getAction()
    {
        return $this->action;
    }

    public function setAction($action)
    {
        $this->action = $action;
        return $this;
    }

    public function getStepCondition()
    {
        return $this->stepCondition;
    }

    public function setStepCondition($stepCondition)
    {
        $this->stepCondition = $stepCondition;
        return $this;
    }

    public function getToDoText()
    {
        return $this->toDoText;
    }

    public function setToDoText($toDoText)
    {
        $this->toDoText = $toDoText;
        return $this;
    }

    public function getOptimalAction()
    {
        return $this->optimalAction;
    }

    public function setOptimalAction($optimalAction)
    {
        $this->optimalAction = $optimalAction;
        return $this;
    }
}