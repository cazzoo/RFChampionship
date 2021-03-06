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
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\SetupBundle\Entity\StepRepository")
 */
class Step extends Descriptor
{
    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\OneToMany(targetEntity="RFC\SetupBundle\Entity\SubStep", mappedBy="step", cascade={"remove"})
     */
    private $listSubSteps;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Game")
     * @ORM\joinColumn(nullable=true, onDelete="SET NULL")
     */
    private $game;

    /**
     * @ORM\Column(name="category", type="string", length=100)
     */
    private $category;

    /**
     * @ORM\Column(name="indicatorType", type="string", length=255)
     */
    private $indicatorType;

    /**
     * @ORM\Column(name="tip", type="text", nullable=true)
     */
    private $tip;

    /**
     * @ORM\Column(name="complexity", type="integer")
     */
    private $complexity;

    /**
     * @ORM\Column(name="stepOrder", type="integer")
     */
    private $stepOrder;

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();
        $this->listSubSteps = new \Doctrine\Common\Collections\ArrayCollection ();
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

    public function getListSubSteps()
    {
        return $this->listSubSteps;
    }

    public function setListSubSteps($listSubSteps)
    {
        $this->listSubSteps = $listSubSteps;
        return $this;
    }

    public function getGame()
    {
        return $this->game;
    }

    public function setGame($game)
    {
        $this->game = $game;
        return $this;
    }

    public function getIndicatorType()
    {
        return $this->indicatorType;
    }

    public function setIndicatorType($indicatorType)
    {
        $this->indicatorType = $indicatorType;
        return $this;
    }

    public function getTip()
    {
        return $this->tip;
    }

    public function setTip($tip)
    {
        $this->tip = $tip;
        return $this;
    }

    public function getCategory()
    {
        return $this->category;
    }

    public function setCategory($category)
    {
        $this->category = $category;
        return $this;
    }

    public function getComplexity()
    {
        return $this->complexity;
    }

    public function setComplexity($complexity)
    {
        $this->complexity = $complexity;
        return $this;
    }

    public function getStepOrder()
    {
        return $this->stepOrder;
    }

    /**
     * @param integer $stepOrder
     * @return \RFC\SetupBundle\Entity\Step
     */
    public function setStepOrder($stepOrder)
    {
        $this->stepOrder = $stepOrder;
        return $this;
    }
}
