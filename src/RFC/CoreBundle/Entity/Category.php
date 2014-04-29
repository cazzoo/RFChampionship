<?php
namespace RFC\CoreBundle\Entity;

use Gedmo\Timestampable\Traits\TimestampableEntity;
use Gedmo\Mapping\Annotation as Gedmo;
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
     * Hook timestampable behavior
     * updates createdAt, updatedAt fields
     */
    use TimestampableEntity;

    /**
     *
     * @var integer @ORM\Column(name="id", type="integer")
     *      @ORM\Id
     *      @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\ManyToMany(targetEntity="RFC\CoreBundle\Entity\Vehicle"), cascade={"persist"}
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

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->listVehicles = new \Doctrine\Common\Collections\ArrayCollection();
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
