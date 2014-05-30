<?php
namespace RFC\CoreBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use RFC\CoreBundle\Entity\Game;
use RFC\CoreBundle\Entity\DescriptorTrait;

/**
 * KnowledgeData
 *
 * @ORM\MappedSuperclass
 */
abstract class KnowledgeData
{

    use DescriptorTrait;

    protected $game;

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
