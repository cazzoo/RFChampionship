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

use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping as ORM;
use RFC\CoreBundle\Entity\DescriptorTrait;

/**
 * Game
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\CoreBundle\Entity\GameRepository")
 */
class Step {
	use DescriptorTrait;
	
	/**
	 * @ORM\Column(name="id", type="integer")
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 */
	private $id;
	
	/**
	 * @ORM\ManyToOne(targetEntity="RFC\SetupBundle\Entity\Setup", inversedBy="listSetupSteps")
     * @ORM\JoinColumn(nullable=false)
	 */
	private $setup;
	
	/**
	 * @ORM\OneToMany(targetEntity="RFC\SetupBundle\Entity\SubStep", mappedBy="step")
	 */
	private $listSubSteps;
	
	/**
	 * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Game")
	 */
	private $game;
	
	/**
	 * @ORM\Column(name="indicatorType", type="string", length=255)
	 */
	private $indicatorType;
	
	/**
	 * @ORM\Column(name="value", type="text")
	 */
	private $value;
	
	/**
	 * @ORM\Column(name="tip", type="text")
	 */
	private $tip;
	
	/**
	 * @ORM\Column(name="category", type="text")
	 */
	private $category;
	
	/**
	 * @ORM\Column(name="complexity", type="integer")
	 */
	private $complexity;
	
	/**
	 * @Gedmo\Timestampable(on="create")
	 * @ORM\Column(type="datetime")
	 */
	private $createdAt;
	
	/**
	 * @Gedmo\Timestampable(on="update")
	 * @ORM\Column(type="datetime")
	 */
	private $updatedAt;
	
	/**
	 * Constructor
	 */
	public function __construct() {
		$this->listSetupSteps = new \Doctrine\Common\Collections\ArrayCollection ();
	}
	public function __toString() {
		return $this->name;
	}
	
	/**
	 * Get id
	 *
	 * @return integer
	 */
	public function getId() {
		return $this->id;
	}
	public function getSetup() {
		return $this->setup;
	}
	public function setSetup($setup) {
		$this->setup = $setup;
		return $this;
	}
	public function getListSubSteps() {
		return $this->listSubSteps;
	}
	public function setListSubSteps($listSubSteps) {
		$this->listSubSteps = $listSubSteps;
		return $this;
	}
	public function getGame() {
		return $this->game;
	}
	public function setGame($game) {
		$this->game = $game;
		return $this;
	}
	public function getIndicatorType() {
		return $this->indicatorType;
	}
	public function setIndicatorType($indicatorType) {
		$this->indicatorType = $indicatorType;
		return $this;
	}
	public function getValue() {
		return $this->value;
	}
	public function setValue($value) {
		$this->value = $value;
		return $this;
	}
	public function getTip() {
		return $this->tip;
	}
	public function setTip($tip) {
		$this->tip = $tip;
		return $this;
	}
	public function getCategory() {
		return $this->category;
	}
	public function setCategory($category) {
		$this->category = $category;
		return $this;
	}
	public function getComplexity() {
		return $this->complexity;
	}
	public function setComplexity($complexity) {
		$this->complexity = $complexity;
		return $this;
	}
	
	/**
	 * Set createdAt
	 *
	 * @param \DateTime $createdAt        	
	 * @return Game
	 */
	public function setCreatedAt($createdAt) {
		$this->createdAt = $createdAt;
		
		return $this;
	}
	
	/**
	 * Get createdAt
	 *
	 * @return \DateTime
	 */
	public function getCreatedAt() {
		return $this->createdAt;
	}
	
	/**
	 * Set updatedAt
	 *
	 * @param \DateTime $updatedAt        	
	 * @return Game
	 */
	public function setUpdatedAt($updatedAt) {
		$this->updatedAt = $updatedAt;
		
		return $this;
	}
	
	/**
	 * Get updatedAt
	 *
	 * @return \DateTime
	 */
	public function getUpdatedAt() {
		return $this->updatedAt;
	}
}
