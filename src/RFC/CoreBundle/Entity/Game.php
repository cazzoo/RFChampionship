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

use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping as ORM;
use RFC\CoreBundle\Entity\DescriptorTrait;

/**
 * Game
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\CoreBundle\Entity\GameRepository")
 */
class Game {
	use DescriptorTrait;
	
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
	 * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\Championship", mappedBy="game")
	 */
	private $listChampionships;
	
	/**
	 * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\MetaRule", mappedBy="game")
	 */
	private $listMetaRules;
	
	/**
	 * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\Rule", mappedBy="game")
	 */
	private $listRules;
	
	/**
	 * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\Track", mappedBy="game")
	 */
	private $listTracks;
	
	/**
	 * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\Vehicle", mappedBy="game")
	 */
	private $listVehicles;
	
	/**
	 * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\Category", mappedBy="game")
	 */
	private $listCategories;
	
	/**
	 * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\TypeSession", mappedBy="game")
	 */
	private $listTypeSessions;
	
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
		$this->listChampionships = new \Doctrine\Common\Collections\ArrayCollection ();
		$this->listMetaRules = new \Doctrine\Common\Collections\ArrayCollection ();
		$this->listRules = new \Doctrine\Common\Collections\ArrayCollection ();
		$this->listImages = new \Doctrine\Common\Collections\ArrayCollection ();
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
	
	/**
	 * Set shortName
	 *
	 * @param string $shortName        	
	 * @return Game
	 */
	public function setShortName($shortName) {
		$this->shortName = $shortName;
		
		return $this;
	}
	
	/**
	 * Get shortName
	 *
	 * @return string
	 */
	public function getShortName() {
		return $this->shortName;
	}
	
	/**
	 * Add listChampionships
	 *
	 * @param Championship $listChampionships 
	 * @return Game
	 */
	public function addListChampionship(\RFC\CoreBundle\Entity\Championship $listChampionships) {
		$this->listChampionships [] = $listChampionships;
		
		return $this;
	}
	
	/**
	 * Remove listChampionships
	 *
	 * @param \RFC\CoreBundle\Entity\MetaRule $listChampionships        	
	 */
	public function removeListChampionship(\RFC\CoreBundle\Entity\Championship $listChampionships) {
		$this->listChampionships->removeElement ( $listChampionships );
	}
	
	/**
	 * Get listChampionships
	 *
	 * @return \Doctrine\Common\Collections\Collection
	 */
	public function getListChampionships() {
		return $this->listChampionships;
	}
	
	/**
	 * Add listMetaRules
	 *
	 * @param \RFC\CoreBundle\Entity\MetaRule $listMetaRules        	
	 * @return Game
	 */
	public function addListMetaRule(\RFC\CoreBundle\Entity\MetaRule $listMetaRules) {
		$this->listMetaRules [] = $listMetaRules;
		
		return $this;
	}
	
	/**
	 * Remove listMetaRules
	 *
	 * @param \RFC\CoreBundle\Entity\MetaRule $listMetaRules        	
	 */
	public function removeListMetaRule(\RFC\CoreBundle\Entity\MetaRule $listMetaRules) {
		$this->listMetaRules->removeElement ( $listMetaRules );
	}
	
	/**
	 * Get listMetaRules
	 *
	 * @return \Doctrine\Common\Collections\Collection
	 */
	public function getListMetaRules() {
		return $this->listMetaRules;
	}
	
	/**
	 * Add listRules
	 *
	 * @param \RFC\CoreBundle\Entity\Rule $listRules        	
	 * @return Game
	 */
	public function addListRule(\RFC\CoreBundle\Entity\Rule $listRules) {
		$this->listRules [] = $listRules;
		
		return $this;
	}
	
	/**
	 * Remove listRules
	 *
	 * @param \RFC\CoreBundle\Entity\Rule $listRules        	
	 */
	public function removeListRule(\RFC\CoreBundle\Entity\Rule $listRules) {
		$this->listRules->removeElement ( $listRules );
	}
	
	/**
	 * Get listRules
	 *
	 * @return \Doctrine\Common\Collections\Collection
	 */
	public function getListRules() {
		return $this->listRules;
	}
	public function getListTracks() {
		return $this->listTracks;
	}
	public function setListTracks($listTracks) {
		$this->listTracks = $listTracks;
		return $this;
	}
	public function getListVehicles() {
		return $this->listVehicles;
	}
	public function setListVehicles($listVehicles) {
		$this->listVehicles = $listVehicles;
		return $this;
	}
	public function getListCategories() {
		return $this->listCategories;
	}
	public function setListCategories($listCategories) {
		$this->listCategories = $listCategories;
		return $this;
	}
	public function getListTypeSessions() {
		return $this->listTypeSessions;
	}
	public function setListTypeSessions($listTypeSessions) {
		$this->listTypeSessions = $listTypeSessions;
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
	 * @return Game
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
