<?php
namespace RFC\CoreBundle\Entity;

use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping as ORM;

/**
 * Game
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\CoreBundle\Entity\GameRepository")
 */
class Game
{

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
     * @ORM\Column(name="name", type="string", length=255)
     */
    private $name;

    /**
     * @ORM\Column(name="description", type="text", length=255, nullable=true)
     */
    private $description;

    /**
     * @ORM\Column(name="imageUrl", type="string", length=255)
     */
    private $imageUrl;

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
    public 

    function __construct()
    {
        $this->listMetaRules = new \Doctrine\Common\Collections\ArrayCollection();
        $this->listRules = new \Doctrine\Common\Collections\ArrayCollection();
    }

    public function __toString()
    {
        return $this->name;
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
     * Set name
     *
     * @param string $name            
     * @return Game
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
     * Set image
     *
     * @param \string $image_url            
     * @return Game
     */
    public function setImage($image)
    {
        $this->image = $image;
        
        return $this;
    }

    /**
     * Get image
     *
     * @return \stdClass
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * Set image_url
     *
     * @param string $imageUrl            
     * @return Game
     */
    public function setImageUrl($imageUrl)
    {
        $this->imageUrl = $imageUrl;
        
        return $this;
    }

    /**
     * Get image_url
     *
     * @return string
     */
    public function getImageUrl()
    {
        return $this->imageUrl;
    }

    /**
     * Set shortName
     *
     * @param string $shortName            
     * @return Game
     */
    public function setShortName($shortName)
    {
        $this->shortName = $shortName;
        
        return $this;
    }

    /**
     * Get shortName
     *
     * @return string
     */
    public function getShortName()
    {
        return $this->shortName;
    }

    /**
     * Set description
     *
     * @param string $description            
     * @return Game
     */
    public function setDescription($description)
    {
        $this->description = $description;
        
        return $this;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt            
     * @return Game
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
     * @return Game
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
     * Add listMetaRules
     *
     * @param \RFC\CoreBundle\Entity\MetaRule $listMetaRules            
     * @return Game
     */
    public function addListMetaRule(\RFC\CoreBundle\Entity\MetaRule $listMetaRules)
    {
        $this->listMetaRules[] = $listMetaRules;
        
        return $this;
    }

    /**
     * Remove listMetaRules
     *
     * @param \RFC\CoreBundle\Entity\MetaRule $listMetaRules            
     */
    public function removeListMetaRule(\RFC\CoreBundle\Entity\MetaRule $listMetaRules)
    {
        $this->listMetaRules->removeElement($listMetaRules);
    }

    /**
     * Get listMetaRules
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getListMetaRules()
    {
        return $this->listMetaRules;
    }

    /**
     * Add listRules
     *
     * @param \RFC\CoreBundle\Entity\Rule $listRules            
     * @return Game
     */
    public function addListRule(\RFC\CoreBundle\Entity\Rule $listRules)
    {
        $this->listRules[] = $listRules;
        
        return $this;
    }

    /**
     * Remove listRules
     *
     * @param \RFC\CoreBundle\Entity\Rule $listRules            
     */
    public function removeListRule(\RFC\CoreBundle\Entity\Rule $listRules)
    {
        $this->listRules->removeElement($listRules);
    }

    /**
     * Get listRules
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getListRules()
    {
        return $this->listRules;
    }
}
