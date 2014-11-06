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
class Setup {
	use DescriptorTrait;
	
	/**
	 * @ORM\Column(name="id", type="integer")
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 */
	private $id;
	
	/**
	 * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\Championship", mappedBy="setup")
	 */
	private $listSetupSteps;
	
	/**
	 * @ORM\ManyToOne(targetEntity="RFC\UserBundle\Entity\User")
	 */
	private $user;
	
	/**
	 * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Track")
	 */
	private $track;
	
	/**
	 * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Vehicle")
	 */
	private $vehicle;
	
	/**
	 * @ORM\Column(name="state", type="string", length=255)
	 */
	private $state;
	
	/**
	 * @ORM\Column(name="version", type="integer")
	 */
	private $version;
	
	/**
	 * @ORM\ManyToMany(targetEntity="RFC\CoreBundle\Entity\Image", cascade={"persist"})
	 */
	private $listImages;
	
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
	public function getListSetupSteps() {
		return $this->listSetupSteps;
	}
	public function setListSetupSteps($listSetupSteps) {
		$this->listSetupSteps = $listSetupSteps;
		return $this;
	}
	public function getUser() {
		return $this->user;
	}
	public function setUser($user) {
		$this->user = $user;
		return $this;
	}
	public function getTrack() {
		return $this->track;
	}
	public function setTrack($track) {
		$this->track = $track;
		return $this;
	}
	public function getVehicle() {
		return $this->vehicle;
	}
	public function setVehicle($vehicle) {
		$this->vehicle = $vehicle;
		return $this;
	}
	public function getState() {
		return $this->state;
	}
	public function setState($state) {
		$this->state = $state;
		return $this;
	}
	public function getVersion() {
		return $this->version;
	}
	public function setVersion($version) {
		$this->version = $version;
		return $this;
	}
	public function getListImages() {
		return $this->listImages;
	}
	public function setListImages($listImages) {
		$this->listImages = $listImages;
		return $this;
	}
	
	/**
	 * Add listImages
	 *
	 * @param \RFC\CoreBundle\Entity\Image $listImages        	
	 * @return Image
	 */
	public function addListImage(\RFC\CoreBundle\Entity\Image $listImages) {
		$this->listImages [] = $listImages;
		
		return $this;
	}
	
	/**
	 * Remove listImages
	 *
	 * @param \RFC\CoreBundle\Entity\Image $listImages        	
	 */
	public function removeListImage(\RFC\CoreBundle\Entity\Image $listImages) {
		$this->listImages->removeElement ( $listImages );
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