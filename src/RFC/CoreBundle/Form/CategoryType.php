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

namespace RFC\CoreBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use RFC\CoreBundle\Entity\VehicleRepository;

class CategoryType extends AbstractType
{
    private $id;

    public function __construct($id)
    {
        $this->id = $id;
    }

    /**
     *
     * @param FormBuilderInterface $builder
     * @param array $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $id = $this->id;

        $builder->add('name')->add('description', 'textarea',
            array(
            'required' => false
        ))->add('listVehicles', null,
            array(
            'required' => false,
            'class' => 'RFCCoreBundle:Vehicle',
            'query_builder' => function (VehicleRepository $ve) use($id) {
                return $ve->createQueryBuilder('v')->where('v.game = :id')->setParameter('id',
                        $id);
            }
        ))->add('commentsActive', 'checkbox',
            array(
            'required' => false
        ))->add('game', 'entity',
            array(
            'class' => 'RFC\CoreBundle\Entity\Game'
        ));
    }

    /**
     *
     * @param OptionsResolverInterface $resolver
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'RFC\CoreBundle\Entity\Category'
        ));

        $resolver->setRequired(array(
            'em'
        ));

        $resolver->setAllowedTypes(array(
            'em' => 'Doctrine\Common\Persistence\ObjectManager'
        ));
    }

    /**
     *
     * @return string
     */
    public function getName()
    {
        return 'rfc_corebundle_category';
    }
}