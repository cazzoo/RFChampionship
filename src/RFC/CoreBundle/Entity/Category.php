<?php
/*  //RF//Championship is a multi-racing game team manager that allows members to organize and follow championships.
    Copyright (C) 2014 - //Racing-France//

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.*/

namespace RFC\CoreBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use RFC\CoreBundle\Entity\KnowledgeData;

/**
 * Category
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\CoreBundle\Entity\CategoryRepository")
 */
class Category extends KnowledgeData
{

    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Game", inversedBy="listCategories")
     * @ORM\JoinColumn(nullable=false)
     */
    protected $game;

    /**
     * @ORM\ManyToMany(targetEntity="RFC\CoreBundle\Entity\Vehicle", cascade={"persist"})
     */
    private $listVehicles;

    public function __toString()
    {
        return $this->getName();
    }

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->listVehicles = new \Doctrine\Common\Collections\ArrayCollection();
    	$this->listImages = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Set listVehicles
     *
     * @param \stdClass $listVehicles            
     * @return Category
     */
    public function setListVehicles($listVehicles)
    {
        $this->listVehicles = $listVehicles;
        
        return $this;
    }

    /**
     * Get listVehicles
     *
     * @return \stdClass
     */
    public function getListVehicles()
    {
        return $this->listVehicles;
    }

    /**
     * Add listVehicles
     *
     * @param \RFC\CoreBundle\Entity\Vehicle $listVehicles            
     * @return Category
     */
    public function addListVehicle(\RFC\CoreBundle\Entity\Vehicle $listVehicles)
    {
        $this->listVehicles[] = $listVehicles;
        
        return $this;
    }

    /**
     * Remove listVehicles
     *
     * @param \RFC\CoreBundle\Entity\Vehicle $listVehicles            
     */
    public function removeListVehicle(\RFC\CoreBundle\Entity\Vehicle $listVehicles)
    {
        $this->listVehicles->removeElement($listVehicles);
    }
}