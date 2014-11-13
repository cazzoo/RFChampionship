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
use RFC\SetupBundle\Entity\SetupStep;

/**
 * Game
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\SetupBundle\Entity\SetupRepository")
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
	 * @ORM\OneToMany(targetEntity="RFC\SetupBundle\Entity\SetupStep", mappedBy="setup", cascade={"persist", "remove"})
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
	
	/**
	 * Add listImages
	 *
	 * @param SetupStep $setupStep        	
	 * @return Image
	 */
	public function addListSetupSteps(SetupStep $setupStep) {
		$this->listSetupSteps->add ( $setupStep );
		
		return $this;
	}
	
	/**
	 * Remove listImages
	 *
	 * @param SetupStep $setupStep        	
	 */
	public function removeListSetupSteps(SetupStep $setupStep) {
		$this->listSetupSteps->removeElement ( $setupStep );
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

        /**
         * Returns all the steps and their version in a nested array
         */
        public function getOrderedSteps() {
            $ordoredSteps = array();
            foreach($this->listSetupSteps as $setupStep) {
                $order = $setupStep->getStep()->getOrder();
                // Test if step does not exists or not new
                if(empty($ordoredSteps)) {
                    $ordoredSteps[$order] = array($setupStep);
                } else {
                    if(array_key_exists($order, $ordoredSteps)) {
                        array_push($ordoredSteps[$order], $setupStep);
                    } else {
                        $ordoredSteps[$order] = array($setupStep);
                    }
                }
            }
            ksort($ordoredSteps);
            return $ordoredSteps;
        }
}
