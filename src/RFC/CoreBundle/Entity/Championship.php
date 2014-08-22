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
use RFC\CoreBundle\Entity\KnowledgeData;
use Doctrine\ORM\Mapping\JoinTable;

/**
 * Championship
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\CoreBundle\Entity\ChampionshipRepository")
 */
class Championship extends KnowledgeData
{
    
    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(name="isAgreed", type="boolean")
     */
    private $isAgreed;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Game" , inversedBy="listChampionships")
     * @ORM\JoinColumn(nullable=false)
     */
    protected $game;

    /**
     * @ORM\OneToMany(targetEntity="RFC\CoreBundle\Entity\Event", mappedBy="championship")
     */
    private $listEvents;

    /**
     * @ORM\ManyToMany(targetEntity="RFC\UserBundle\Entity\User")
     * @JoinTable(name="championship_managers")
     */
    private $listManagers;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\MetaRule")
     */
    private $metaRule;

    /**
     * @ORM\ManyToMany(targetEntity="RFC\CoreBundle\Entity\Rule")
     */
    private $listRules;
    
    /**
     * @ORM\ManyToMany(targetEntity="RFC\UserBundle\Entity\User", inversedBy="listChampionships")
     */
    private $listUsers;

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

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->listEvents = new \Doctrine\Common\Collections\ArrayCollection();
        $this->listManagers = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Set isAgreed
     *
     * @param boolean $isAgreed            
     * @return Championship
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

    /**
     * Set listEvents
     *
     * @param array $listEvents            
     * @return Championship
     */
    public function setListEvents($listEvents)
    {
        $this->listEvents = $listEvents;
        
        return $this;
    }

    /**
     * Get listEvents
     *
     * @return array
     */
    public function getListEvents()
    {
        return $this->listEvents;
    }

    /**
     * Set listManagers
     *
     * @param array $listManagers            
     * @return Championship
     */
    public function setListManagers($listManagers)
    {
        $this->listManagers = $listManagers;
        
        return $this;
    }

    /**
     * Get listManagers
     *
     * @return array
     */
    public function getListManagers()
    {
        return $this->listManagers;
    }

    /**
     * Set metaRuleId
     *
     * @param \stdClass $metaRuleId            
     * @return Championship
     */
    public function setMetaRule($metaRule)
    {
        $this->metaRule = $metaRule;
        
        return $this;
    }

    /**
     * Get metaRuleId
     *
     * @return \stdClass
     */
    public function getMetaRule()
    {
        return $this->metaRule;
    }

    /**
     * Set listRules
     *
     * @param array $listRules            
     * @return Championship
     */
    public function setListRules($listRules)
    {
        $this->listRules = $listRules;
        
        return $this;
    }

    /**
     * Get listRules
     *
     * @return array
     */
    public function getListRules()
    {
        return $this->listRules;
    }

    /**
     * Add listRules
     *
     * @param \RFC\CoreBundle\Entity\Rule $listRules            
     * @return Championship
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
     * Add listEvents
     *
     * @param \RFC\CoreBundle\Entity\Event $listEvents
     * @return Championship
     */
    public function addListEvent(\RFC\CoreBundle\Entity\Event $listEvents)
    {
        $this->listEvents[] = $listEvents;
    
        return $this;
    }

    /**
     * Remove listEvents
     *
     * @param \RFC\CoreBundle\Entity\Event $listEvents
     */
    public function removeListEvent(\RFC\CoreBundle\Entity\Event $listEvents)
    {
        $this->listEvents->removeElement($listEvents);
    }

    /**
     * Add listManagers
     *
     * @param \RFC\UserBundle\Entity\User $listManagers
     * @return Championship
     */
    public function addListManager(\RFC\UserBundle\Entity\User $listManagers)
    {
        $this->listManagers[] = $listManagers;
    
        return $this;
    }

    /**
     * Remove listManagers
     *
     * @param \RFC\UserBundle\Entity\User $listManagers
     */
    public function removeListManager(\RFC\UserBundle\Entity\User $listManagers)
    {
        $this->listManagers->removeElement($listManagers);
    }

    public function getListUsers()
    {
        return $this->listUsers;
    }

    public function setListUsers($listUsers)
    {
        $this->listUsers = $listUsers;
        return $this;
    }

    /**
     * Add User to list of participants
     *
     * @param \RFC\UserBundle\Entity\User $listUsers
     * @return Championship
     */
    public function registerUser(\RFC\UserBundle\Entity\User $user)
    {
        $this->listUsers[] = $user;
    
        return $this;
    }
    
    /**
     * Remove User from list of participants
     *
     * @param \RFC\UserBundle\Entity\User $listManagers
     */
    public function unregisterUser(\RFC\UserBundle\Entity\User $user)
    {
        $this->listUsers->removeElement($user);
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
     * @return Championship
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
     * @return Championship
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
     * Get Earlyer Date Form Events
     *
     * @return \DateTime
     */
    public function getBeginDate()
    {
        $template = new \DateTime('01/01/1900');
        $template->format('Y-m-d H:i:s');
        if ($this->listEvents[0] != null) {
            $beginDate = $this->listEvents[0]->getBeginDate();
        } else
            $beginDate = $template;
        foreach ($this->listEvents as $event) {
            if ($beginDate > $event->getBeginDate()) {
                $beginDate = $event->getBeginDate();
            }
        }
        if ($beginDate != $template)
            return $beginDate;
        else
            return null;
    }

    /**
     * Get Lastest Date From Events
     *
     * @return \DateTime
     */
    public function getEndDate()
    {
        $template = new \DateTime('01/01/2100');
        $template->format('Y-m-d H:i:s');
        if ($this->listEvents[0] != null) {
            $endDate = $this->listEvents[0]->getEndDate();
        } else
            $endDate = $template;
        foreach ($this->listEvents as $event) {
            if ($endDate < $event->getEndDate()) {
                $endDate = $event->getEndDate();
            }
        }
        if ($endDate != $template)
            return $endDate;
        else
            return null;
    }
}