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

namespace RFC\UserBundle\Form;

use FOS\UserBundle\Form\Type\RegistrationFormType as BaseType;
use Symfony\Component\Form\FormBuilderInterface;
use RFC\UserBundle\Entity\RoleEnum;

class UserFormType extends BaseType
{

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        parent::buildForm($builder, $options);

        $builder->add('roles', 'choice',
                array(
                'choices' => RoleEnum::getEnum(),
                'multiple' => true,
                'required' => true,
            ))
            ->add('firstName')
            ->add('lastName')
            ->add('age')
            ->add('avatarUrl', 'text',
                array(
                'required' => false
            ))
            ->add('steamId', 'text',
                array(
                'required' => false
            ))
            ->add('enabled', 'checkbox',
                array(
                'required' => false))
            ->add('locale', 'choice',
                array('choices' => array('en_UK' => 'English', 'fr_FR' => 'French'), 'required' => true));
    }
}