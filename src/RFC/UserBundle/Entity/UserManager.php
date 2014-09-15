<?php
/*
 * //RF//Championship is a multi-racing game team manager that allows members to organize and follow championships.
 * Copyright (C) 2014 - //Racing-France//
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
namespace RFC\UserBundle\Entity;

use FOS\UserBundle\Doctrine\UserManager as FOSUserManager;
use Doctrine\ORM\EntityManager;
use Symfony\Component\Security\Core\Encoder\EncoderFactoryInterface;
use FOS\UserBundle\Util\CanonicalizerInterface;
use FOS\UserBundle\Model\UserInterface;

class UserManager extends FOSUserManager 
{

    public function __construct(EncoderFactoryInterface $encoderFactory, CanonicalizerInterface $usernameCanonicalizer, 
                                CanonicalizerInterface $emailCanonicalizer, EntityManager $em, $class) {

        parent::__construct($encoderFactory, $usernameCanonicalizer, $emailCanonicalizer, $em, $class);

    }

    /**
     * Returns all the users ordered by a field
     *
     * @param string $field
     * @param string $type
     *
     * @return UserInterface
     */
    public function findByAndOrderBy($field, $type)
    {
        return $this->repository->findBy(array(), array($field => $type));
    }
}