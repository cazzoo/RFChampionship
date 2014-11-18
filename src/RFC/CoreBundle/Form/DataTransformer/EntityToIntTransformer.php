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

namespace RFC\CoreBundle\Form\DataTransformer;

use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;
use Doctrine\Common\Persistence\ObjectManager;

class EntityToIntTransformer implements DataTransformerInterface
{

    /**
     *
     * @var \Doctrine\Common\Persistence\ObjectManager
     */
    private $om;

    private $entityClass;

    private $entityType;

    private $entityRepository;

    /**
     *
     * @param ObjectManager $om            
     */
    public function __construct(ObjectManager $om)
    {
        $this->om = $om;
    }

    /**
     *
     * @param mixed $entity            
     *
     * @throws \Symfony\Component\Form\Exception\TransformationFailedException
     *
     * @return integer
     */
    public function transform($entity)
    {
        // Modified from comments to use instanceof so that base classes or interfaces can be specified
        if (null === $entity || ! $entity instanceof $this->entityClass) {
            throw new TransformationFailedException("$this->entityType object must be provided");
        }
        
        return $entity->getId();
    }

    /**
     *
     * @param mixed $id            
     *
     * @throws \Symfony\Component\Form\Exception\TransformationFailedException
     *
     * @return mixed|object
     */
    public function reverseTransform($id)
    {
        if (! $id) {
            throw new TransformationFailedException("No $this->entityType id was submitted");
        }
        
        $entity = $this->om->getRepository($this->entityRepository)->findOneBy(array(
            "id" => $id
        ));
        
        if (null === $entity) {
            throw new TransformationFailedException(sprintf('A %s with id "%s" does not exist!', $this->entityType, $id));
        }
        
        return $entity;
    }

    /**
     * @param string $entityType
     */
    public function setEntityType($entityType)
    {
        $this->entityType = $entityType;
    }

    /**
     * @param string $entityClass
     */
    public function setEntityClass($entityClass)
    {
        $this->entityClass = $entityClass;
    }

    /**
     * @param string $entityRepository
     */
    public function setEntityRepository($entityRepository)
    {
        $this->entityRepository = $entityRepository;
    }
}