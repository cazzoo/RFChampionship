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

use Doctrine\ORM\Mapping as ORM;
use RFC\CoreBundle\Entity\Descriptor;

/**
 * Property
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="RFC\CoreBundle\Entity\PropertyRepository")
 */
class Property extends Descriptor
{
    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(name="value", type="text")
     */
    private $value;

    /**
     * @ORM\Column(name="type", type="string", length=32)
     */
    private $type;

    /**
     * @ORM\Column(name="category", type="string", length=32)
     */
    private $category;

    /**
     * @ORM\Column(name="min", type="string", length=16, nullable=true)
     */
    private $min;

    /**
     * @ORM\Column(name="max", type="string", length=16, nullable=true)
     */
    private $max;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\CoreBundle\Entity\Game", inversedBy="listProperties")
     * @ORM\JoinColumn(nullable=true)
     */
    private $game;

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Creates an empty property to be stored in the DB by the system
     * @return \self
     */
    public static function emptyProperty()
    {
        $instance = new self();
        $instance->setValue("");
        $instance->setType("");
        $instance->setCommentsActive(false);
        return $instance;
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
     * Set value
     *
     * @param string $value            
     * @return Property
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

    public function getType()
    {
        return $this->type;
    }

    public function setType($type)
    {
        $this->type = $type;
        return $this;
    }

    public function getCategory()
    {
        return $this->category;
    }

    public function setCategory($category)
    {
        $this->category = $category;
        return $this;
    }

    public function getMin()
    {
        return $this->min;
    }

    public function setMin($min)
    {
        $this->min = $min;
        return $this;
    }

    public function getMax()
    {
        return $this->max;
    }

    public function setMax($max)
    {
        $this->max = $max;
        return $this;
    }

    /**
     * Set game
     *
     * @param Game $game
     * @return KnowledgeData
     */
    public function setGame(Game $game)
    {
        $this->game = $game;

        return $this;
    }

    /**
     * Get game
     *
     * @return Game
     */
    public function getGame()
    {
        return $this->game;
    }
}