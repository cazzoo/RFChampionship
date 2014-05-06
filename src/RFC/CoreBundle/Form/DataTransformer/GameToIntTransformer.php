<?php
 
namespace RFC\CoreBundle\Form\DataTransformer;
 
use Doctrine\Common\Persistence\ObjectManager;
 
class GameToIntTransformer extends EntityToIntTransformer
{
    /**
     * @param ObjectManager $om
     */
    public function __construct(ObjectManager $om)
    {
        parent::__construct($om);
        $this->setEntityClass("RFC\\CoreBundle\\Entity\\Game");
        $this->setEntityRepository("RFCCoreBundle:Game");
        $this->setEntityType("game");
    }
 
}