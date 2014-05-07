<?php
namespace RFC\CoreBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use RFC\CoreBundle\Entity\Game;

/**
 * KnowledgeData
 *
 * @ORM\MappedSuperclass
 */
abstract class KnowledgeData
{

    /**
     * @ORM\Column(name="name", type="string", length=255)
     */
    protected $name;

    protected $game;

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
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set game
     *
     * @param \RFC\CoreBundle\Entity\Game $game            
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
     * @return \RFC\CoreBundle\Entity\Game
     */
    public function getGame()
    {
        return $this->game;
    }
}
