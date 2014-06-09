<?php
namespace RFC\CoreBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\CoreBundle\Entity\ImageRepository")
 */
class Image
{

    /**
     *
     * @var integer $id
     *     
     *      @ORM\Column(name="id", type="integer")
     *      @ORM\Id
     *      @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     *
     * @var string $url
     *     
     *      @ORM\Column(name="url", type="string", length=255)
     */
    private $url;

    /**
     *
     * @var string $alt
     *     
     *      @ORM\Column(name="alt", type="string", length=255)
     */
    private $alt;

    /**
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     *
     * @param string $url            
     * @return Image
     */
    public function setUrl($url)
    {
        $this->url = $url;
        return $this;
    }

    /**
     *
     * @return string
     */
    public function getUrl()
    {
        return $this->url;
    }

    /**
     *
     * @param string $alt            
     * @return Image
     */
    public function setAlt($alt)
    {
        $this->alt = $alt;
        return $this;
    }

    /**
     *
     * @return string
     */
    public function getAlt()
    {
        return $this->alt;
    }
}