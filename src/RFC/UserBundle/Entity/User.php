<?php
namespace RFC\UserBundle\Entity;

use Gedmo\Timestampable\Traits\TimestampableEntity;
use Gedmo\Mapping\Annotation as Gedmo;
use FOS\UserBundle\Entity\User as BaseUser;
use Doctrine\ORM\Mapping as ORM;

/**
 * User
 *
 * @ORM\Table()
 * @ORM\Entity
 */
class User extends BaseUser
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
    protected $id;

    /**
     * @ORM\Column(name="$firstName", type="string", length=255, nullable=true)
     */
    protected $firstName;

    /**
     * @ORM\Column(name="$lastName", type="string", length=255, nullable=true)
     */
    protected $lastName;

    /**
     * @ORM\Column(name="$age", type="integer", nullable=true)
     */
    protected $age;

    /**
     * @ORM\Column(name="$avatarUrl", type="string", length=255, nullable=true)
     */
    protected $avatarUrl;

    /**
     * @ORM\Column(name="$steamId", type="string", length=255, nullable=true)
     */
    protected $steamId;

    /**
     * @ORM\ManyToOne(targetEntity="RFC\UserBundle\Entity\User")
     */
    protected $mentor;

    /**
     * @ORM\ManyToMany(targetEntity="RFC\CoreBundle\Entity\Championship"), cascade={"persist"}
     */
    protected $listChampionships;

    public function __construct()
    {
        parent::__construct();
        $this->listChampionships = array();
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

    public function eraseCredentials()
    {}

    /**
     * Set firstName
     *
     * @param string $firstName
     * @return User
     */
    public function setFirstName($firstName)
    {
        $this->firstName = $firstName;
    
        return $this;
    }

    /**
     * Get firstName
     *
     * @return string 
     */
    public function getFirstName()
    {
        return $this->firstName;
    }

    /**
     * Set lastName
     *
     * @param string $lastName
     * @return User
     */
    public function setLastName($lastName)
    {
        $this->lastName = $lastName;
    
        return $this;
    }

    /**
     * Get lastName
     *
     * @return string 
     */
    public function getLastName()
    {
        return $this->lastName;
    }

    /**
     * Set age
     *
     * @param integer $age
     * @return User
     */
    public function setAge($age)
    {
        $this->age = $age;
    
        return $this;
    }

    /**
     * Get age
     *
     * @return integer 
     */
    public function getAge()
    {
        return $this->age;
    }

    /**
     * Set avatarUrl
     *
     * @param string $avatarUrl
     * @return User
     */
    public function setAvatarUrl($avatarUrl)
    {
        $this->avatarUrl = $avatarUrl;
    
        return $this;
    }

    /**
     * Get avatarUrl
     *
     * @return string 
     */
    public function getAvatarUrl()
    {
        return $this->avatarUrl;
    }

    /**
     * Set steamId
     *
     * @param string $steamId
     * @return User
     */
    public function setSteamId($steamId)
    {
        $this->steamId = $steamId;
    
        return $this;
    }

    /**
     * Get steamId
     *
     * @return string 
     */
    public function getSteamId()
    {
        return $this->steamId;
    }

    /**
     * Set mentor
     *
     * @param \RFC\UserBundle\Entity\User $mentor
     * @return User
     */
    public function setMentor(\RFC\UserBundle\Entity\User $mentor = null)
    {
        $this->mentor = $mentor;
    
        return $this;
    }

    /**
     * Get mentor
     *
     * @return \RFC\UserBundle\Entity\User 
     */
    public function getMentor()
    {
        return $this->mentor;
    }

    /**
     * Add listChampionships
     *
     * @param \RFC\CoreBundle\Entity\Championship $listChampionships
     * @return User
     */
    public function addListChampionship(\RFC\CoreBundle\Entity\Championship $listChampionships)
    {
        $this->listChampionships[] = $listChampionships;
    
        return $this;
    }

    /**
     * Remove listChampionships
     *
     * @param \RFC\CoreBundle\Entity\Championship $listChampionships
     */
    public function removeListChampionship(\RFC\CoreBundle\Entity\Championship $listChampionships)
    {
        $this->listChampionships->removeElement($listChampionships);
    }

    /**
     * Get listChampionships
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getListChampionships()
    {
        return $this->listChampionships;
    }
}
