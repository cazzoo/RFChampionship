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
  along with this program.  If not, see <http://www.gnu.org/licenses/>. */

namespace RFC\CoreBundle\Entity;

use Gedmo\Timestampable\Traits\TimestampableEntity;
use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use JMS\Serializer\Annotation\Groups;

/**
 * Descriptor
 *
 * @ORM\MappedSuperclass
 */
abstract class Descriptor
{
    
    /**
     * Hook timestampable behavior
     * updates createdAt, updatedAt fields
     */
    use TimestampableEntity;

    /**
     * @ORM\Column(name="name", type="string", length=255)
     * @Groups({"api"})
     */
    protected $name;

    /**
     * @ORM\Column(name="description", type="text", nullable=true)
     */
    protected $description;

    /**
     * @ORM\Column(name="commentsActive", type="boolean")
     */
    protected $commentsActive;

    /**
     * @ORM\ManyToMany(targetEntity="RFC\CoreBundle\Entity\File", cascade={"persist"})
     */
    protected $listImages;

    public function __construct()
    {
        $this->listImages = new ArrayCollection();
    }

    public function __toString()
    {
        return $this->getName();
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
     * Set name
     *
     * @return Descriptor
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
     * @return Descriptor
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * @return boolean the comments are active or not
     */
    public function isCommentsActive()
    {
        return $this->commentsActive;
    }

    /**
     * Sets the parameter true or false
     * @param boolean $commentsActive
     * @return boolean the comments are active or not
     */
    public function setCommentsActive($commentsActive)
    {
        $this->commentsActive = $commentsActive;
        return $this;
    }

    /**
     * @return array the list of images
     */
    public function getListImages()
    {
        return $this->listImages;
    }

    /**
     * Sets a collection of images
     * @param type $listImages
     * @return array the list of images
     */
    public function setListImages($listImages)
    {
        $this->listImages = $listImages;
        return $this;
    }

    /**
     * Add image
     *
     * @param Image $image
     * @return Descriptor
     */
    public function addImage(Image $image)
    {
        $this->listImages[] = $image;

        return $this;
    }

    /**
     * Remove image
     *
     * @param Image $image
     */
    public function removeImage(Image $image)
    {
        $this->listImages->removeElement ( $image );
    }

}