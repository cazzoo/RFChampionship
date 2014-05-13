<?php
namespace RFC\CoreBundle\Entity;

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
     * @ORM\ManyToMany(targetEntity="RFC\CoreBundle\Entity\Vehicle"), cascade={"persist"}
     */
    private $listVehicles;

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

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt            
     * @return Category
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;
        
        return $this;
    }

    /**
     * Get createdAt
     *
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Set updatedAt
     *
     * @param \DateTime $updatedAt            
     * @return Category
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;
        
        return $this;
    }

    /**
     * Get updatedAt
     *
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    /**
     * Set name
     *
     * @param string $name            
     * @return Category
     */
    public function setName($name)
    {
        $this->name = $name;
        
        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set game
     *
     * @param \RFC\CoreBundle\Entity\Game $game            
     * @return Category
     */
    public function setGame(\RFC\CoreBundle\Entity\Game $game)
    {
        $this->game = $game;
        
        return $this;
    }

    /**
     * Get game
     *
     * @return \RFC\CoreBundle\Entity\Game
     */
    public function getGame()
    {
        return $this->game;
    }
}
