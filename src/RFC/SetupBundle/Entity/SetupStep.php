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

/**
 * Game
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\SetupBundle\Entity\SetupStepRepository")
 */
class SetupStep {
	
	/**
	 * @ORM\Column(name="id", type="integer")
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 */
	private $id;
	
	/**
	 * @ORM\ManyToOne(targetEntity="RFC\SetupBundle\Entity\Setup", inversedBy="listSetupSteps")
	 */
	private $setup;
	
	/**
	 * @ORM\ManyToOne(targetEntity="RFC\SetupBundle\Entity\Step")
	 */
	private $step;
	
	/**
	 * @ORM\Column(name="value", type="text")
	 */
	private $value;
	
	/**
	 * @ORM\Column(name="version", type="integer")
	 */
	private $version;
	
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
	public function getStep() {
		return $this->step;
	}
	public function setStep($step) {
		$this->step = $step;
		return $this;
	}
	public function getValue() {
		return $this->value;
	}
	public function setValue($value) {
		$this->value = $value;
		return $this;
	}
	public function getVersion() {
		return $this->version;
	}
	public function setVersion($version) {
		$this->version = $version;
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

        public function clearId() {
            $this->id = null;
        }
}
