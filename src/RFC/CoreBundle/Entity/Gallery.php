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

use Doctrine\Common\Collections\ArrayCollection;
use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping as ORM;
use RFC\CoreBundle\Entity\File;

/**
 * @ORM\Entity
 */
class Gallery
{
    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\File", mappedBy="gallery", cascade={"persist"})
     */
    protected $listImages;

    public function __construct() {
        $this->listImages = new ArrayCollection();
    }


    /**
     * Get id
     * @return integer
     */
    public function getId()
    {
        return $this->id;
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
     * @param File $image
     * @return Descriptor
     */
    public function addImage(File $image)
    {
        $this->listImages[] = $image;

        return $this;
    }

    /**
     * Remove image
     *
     * @param File $image
     */
    public function removeImage(File $image)
    {
        $this->listImages->removeElement($image);
    }
}