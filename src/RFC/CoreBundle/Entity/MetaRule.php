<?php
namespace RFC\CoreBundle\Entity;

use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping as ORM;
use RFC\CoreBundle\Entity\KnowledgeData;

/**
 * MetaRule
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\CoreBundle\Entity\MetaRuleRepository")
 */
class MetaRule extends KnowledgeData
{

    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Game", inversedBy="listMetaRules")
     * @ORM\JoinColumn(nullable=false)
     */
    protected $game;

    /**
     * @ORM\Column(name="isAgreed", type="boolean")
     */
    private $isAgreed;

    /**
     * @ORM\ManyToMany(targetEntity="RFC\CoreBundle\Entity\Rule", inversedBy="listMetaRules")
     */
    private $listRules;

    /**
     * @ORM\ManyToMany(targetEntity="RFC\CoreBundle\Entity\Image",cascade={"persist"})
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

    public function __construct()
    {
        $this->listRules = new \Doctrine\Common\Collections\ArrayCollection();
    }

    public function __toString()
    {
        return $this->getName();
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
     * Set listRules
     *
     * @param \array $listRules            
     * @return MetaRule
     */
    public function setListRules($listRules)
    {
        $this->listRules = $listRules;
        
        return $this;
    }

    /**
     * Get listRules
     *
     * @return \array
     */
    public function getListRules()
    {
        return $this->listRules;
    }

    /**
     * Add listRules
     *
     * @param \RFC\CoreBundle\Entity\Rule $listRules            
     * @return MetaRule
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
     * Set isAgreed
     *
     * @param boolean $isAgreed            
     * @return MetaRule
     */
    public function setIsAgreed($isAgreed)
    {
        $this->isAgreed = $isAgreed;
        
        return $this;
    }

    /**
     * Get isAgreed
     *
     * @return boolean
     */
    public function getIsAgreed()
    {
        return $this->isAgreed;
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

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt            
     * @return MetaRule
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
     * @return MetaRule
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
}
