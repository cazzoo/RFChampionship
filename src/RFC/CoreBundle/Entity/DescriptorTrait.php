<?php
namespace RFC\CoreBundle\Entity;

trait DescriptorTrait
{

    /**
     * @ORM\Column(name="name", type="string", length=255)
     */
    private $name;

    /**
     * @ORM\Column(name="description", type="text", nullable=true)
     */
    private $description;

    /**
     * @ORM\Column(name="commentsActive", type="boolean")
     */
    private $commentsActive;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Image")
     */
    private $listImages;

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
     * Set name
     *
     * @param string $name            
     * @return KnowledgeData
     */
    public function setName($name)
    {
        $this->name = $name;
        
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

    public function isCommentsActive()
    {
        return $this->commentsActive;
    }

    public function setCommentsActive($commentsActive)
    {
        $this->commentsActive = $commentsActive;
        return $this;
    }

    public function getListImages()
    {
        return $this->listImages;
    }

    public function setListImages($listImages)
    {
        $this->listImages = $listImages;
        return $this;
    }

    /**
     * Add listImages
     *
     * @param \RFC\CoreBundle\Entity\Image $listImages            
     * @return Image
     */
    public function addListImage(\RFC\CoreBundle\Entity\Image $listImages)
    {
        $this->listImages[] = $listImages;
        
        return $this;
    }

    /**
     * Remove listImages
     *
     * @param \RFC\CoreBundle\Entity\Image $listImages            
     */
    public function removeListImage(\RFC\CoreBundle\Entity\Image $listImages)
    {
        $this->listImages->removeElement($listImages);
    }
}