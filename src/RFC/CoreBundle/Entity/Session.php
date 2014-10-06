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

use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping as ORM;
use RFC\CoreBundle\Entity\Event;
use RFC\CoreBundle\Entity\DescriptorTrait;

/**
 * Session
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\CoreBundle\Entity\SessionRepository")
 */
class Session
{
    
    use DescriptorTrait;

    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\Result", mappedBy="session")
     * @ORM\JoinColumn(nullable=true)
     */
    private $listResults;

    /**
     * @ORM\Column(name="begin_date", type="datetime")
     */
    private $beginDate;

    /**
     * @ORM\Column(name="end_date", type="datetime")
     */
    private $endDate;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\TypeSession")
     * @ORM\JoinColumn(nullable=false)
     */
    private $typeSession;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Event", inversedBy="listSessions")
     * @ORM\JoinColumn(nullable=false)
     */
    private $event;

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

    public function __toString()
    {
        return $this->name;
    }
    
    public function __construct()
    {
    	$this->listResults = new \Doctrine\Common\Collections\ArrayCollection();
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
    
	public function getListResults() {
		return $this->listResults;
	}
	
	public function setListResults($listResults) {
		$this->listResults = $listResults;
		return $this;
	}
	
    public function addResult(\RFC\CoreBundle\Entity\Result $result)
    {
        $this->listResults[] = $result;
        
        return $this;
    }
    
    public function removeResult(\RFC\CoreBundle\Entity\Result $result)
    {
        $this->listResults->removeElement($result);
    }
		
    /**
     * Set beginDate
     *
     * @param \DateTime $beginDate            
     * @return Session
     */
    public function setBeginDate($beginDate)
    {
        $this->beginDate = $beginDate;
        
        return $this;
    }

    /**
     * Get beginDate
     *
     * @return \DateTime
     */
    public function getBeginDate()
    {
        return $this->beginDate;
    }

    /**
     * Set endDate
     *
     * @param \DateTime $endDate            
     * @return Session
     */
    public function setEndDate($endDate)
    {
        $this->endDate = $endDate;
        
        return $this;
    }

    /**
     * Get endDate
     *
     * @return \DateTime
     */
    public function getEndDate()
    {
        return $this->endDate;
    }

    /**
     * Set type
     *
     * @param integer $type            
     * @return Session
     */
    public function setTypeSession($typeSession)
    {
        $this->typeSession = $typeSession;
        
        return $this;
    }

    /**
     * Get type
     *
     * @return integer
     */
    public function getTypeSession()
    {
        return $this->typeSession;
    }

    /**
     * Set event
     *
     * @param \RFC\CoreBundle\Entity\Event $event            
     * @return Session
     */
    public function setEvent(\RFC\CoreBundle\Entity\Event $event)
    {
        $this->event = $event;
        
        return $this;
    }

    /**
     * Get event
     *
     * @return \RFC\CoreBundle\Entity\Event
     */
    public function getEvent()
    {
        return $this->event;
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
     * @return Session
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
     * @return Session
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
