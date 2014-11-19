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

use Gedmo\Timestampable\Traits\TimestampableEntity;
use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping as ORM;

/**
 * Result
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\CoreBundle\Entity\ResultRepository")
 */
class Result
{

    /**
     * Hook timestampable behavior
     * updates createdAt, updatedAt fields
     */
    use TimestampableEntity;

    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\UserBundle\Entity\User")
     */
    private $user;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Rule")
     */
    private $rule;

    /**
     * @ORM\Column(name="value", type="string", length=255)
     */
    private $value;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Session", inversedBy="listResults")
     * @ORM\JoinColumn(nullable=false)
     */
    private $session;

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
     * Set user
     *
     * @param \RFC\UserBundle\Entity\User $user        
     * @return $user
     */
    public function setUser($user)
    {
        $this->user = $user;
        
        return $this;
    }

    /**
     * Get user
     *
     * @return \RFC\UserBundle\Entity\User $user
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Set rule
     *
     * @param \RFC\CoreBundle\Entity\Rule $rule            
     * @return Result
     */
    public function setRule(\RFC\CoreBundle\Entity\Rule $rule)
    {
        $this->rule = $rule;
        
        return $this;
    }

    /**
     * Get rule
     *
     * @return \RFC\CoreBundle\Entity\Rule
     */
    public function getRule()
    {
        return $this->rule;
    }

    /**
     * Set value
     *
     * @param string $value            
     * @return Result
     */
    public function setValue($value)
    {
        $this->value = $value;
        
        return $this;
    }

    /**
     * Get value
     *
     * @return string
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * Set session
     *
     * @param \RFC\CoreBundle\Entity\Session $session            
     * @return Result
     */
    public function setSession(\RFC\CoreBundle\Entity\Session $session)
    {
        $this->session = $session;
        
        return $this;
    }

    /**
     * Get session
     *
     * @return \RFC\CoreBundle\Entity\Session
     */
    public function getSession()
    {
        return $this->session;
    }
}
