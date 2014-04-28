<?php

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
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var \stdClass
     *
     * @ORM\Column(name="list_vehicles", type="object")
     */
    private $listVehicles;


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
}
