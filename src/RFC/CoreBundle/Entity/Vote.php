<?php
// src/RFC/CoreBundle/Entity/Vote.php
namespace RFC\CoreBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use FOS\CommentBundle\Entity\Vote as BaseVote;
use FOS\CommentBundle\Model\SignedVoteInterface;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Entity
 */
class Vote extends BaseVote implements SignedVoteInterface
{

    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * Author of the vote
     *
     * @ORM\ManyToOne(targetEntity="RFC\UserBundle\Entity\User")
     */
    protected $voter;

    /**
     * Sets the owner of the vote
     *
     * @param string $user            
     */
    public function setVoter(UserInterface $voter)
    {
        $this->voter = $voter;
    }

    /**
     * Gets the owner of the vote
     *
     * @return UserInterface
     */
    public function getVoter()
    {
        return $this->voter;
    }
}