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

namespace RFC\SetupBundle\Form\Type;

use RFC\CoreBundle\Entity\TrackRepository;
use RFC\CoreBundle\Entity\VehicleRepository;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class SetupType extends AbstractType
{
    private $gameId;

    public function __construct($gameId)
    {
        $this->gameId = $gameId;
    }

    /**
     *
     * @param FormBuilderInterface $builder        	
     * @param array $options        	
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $gameId = $this->gameId;

        $builder->add('name')->add('description', 'textarea',
            array(
            'required' => false
        ))->add('vehicle', 'entity',
            array(
            'required' => true,
            'class' => 'RFCCoreBundle:Vehicle',
            'query_builder' => function (VehicleRepository $er) use($gameId) {
                return $er->createQueryBuilder('v')->where('v.game = :gameId')->setParameter('gameId',
                        $gameId);
            }
        ))->add('track', 'entity',
            array(
            'required' => false,
            'class' => 'RFCCoreBundle:Track',
            'query_builder' => function (TrackRepository $er) use($gameId) {
                return $er->createQueryBuilder('t')->where('t.game = :gameId')->setParameter('gameId',
                        $gameId);
            }
        ))->add('commentsActive', 'checkbox',
            array(
            'required' => false
        ))->add('user', 'entity',
            array(
            'class' => 'RFC\UserBundle\Entity\User'
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
            'data_class' => 'RFC\SetupBundle\Entity\Setup'
        ));
    }

    /**
     *
     * @return string
     */
    public function getName()
    {
        return 'rfc_setupbundle_setup';
    }
}