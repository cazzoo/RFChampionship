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

use RFC\CoreBundle\Entity\CategoryRepository;
use RFC\CoreBundle\Entity\MetaRuleRepository;
use RFC\CoreBundle\Entity\RuleRepository;
use RFC\CoreBundle\Entity\VehicleRepository;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class ChampionshipType extends AbstractType
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
            ))->add('championshipAgreed', 'checkbox',
                array(
                'required' => false
            ))->add('registrationInProgress', 'checkbox',
                array(
                'required' => false
            ))->add('teamChampionship', 'checkbox',
                array(
                'required' => false,
                'mapped' => false))
            ->add('teamCountSelection', 'choice',
                array(
                'mapped' => false,
                'choices' => array(
                    'byChoice' => 'Based on manager choice',
                    'byVehicles' => 'Based on vehicle selection',
                    'byCategories' => 'Based on category selection')
            ))->add('listCategories', 'entity',
                array(
                'required' => false,
                'class' => 'RFCCoreBundle:Category',
                'multiple' => true,
                'query_builder' => function (CategoryRepository $cr) use($gameId) {
                    return $cr->createQueryBuilder('m')->where('m.game = :gameId')->setParameter('gameId',
                            $gameId);
                }
            ))->add('listVehicles', 'entity',
                array(
                'required' => false,
                'multiple' => true,
                'class' => 'RFCCoreBundle:Vehicle',
                'query_builder' => function (VehicleRepository $vr) use($gameId) {
                    return $vr->createQueryBuilder('m')->where('m.game = :gameId')->setParameter('gameId',
                            $gameId);
                }
            ))
            ->add('teamCount', 'integer',
                array(
                'required' => false,
                'mapped' => false
            ))
            ->add('MaximumMainDrivers', 'integer',
                array(
                'required' => false,
                'mapped' => false
            ))
            ->add('MaximumSecondaryDrivers', 'integer',
                array(
                'required' => false,
                'mapped' => false
            ))
            ->add('listManagers', 'entity',
                array(
                'required' => false,
                'class' => 'RFCUserBundle:User',
                'multiple' => true
            ))->add('metaRule', 'entity',
            array(
            'required' => false,
            'class' => 'RFCCoreBundle:MetaRule',
            'query_builder' => function (MetaRuleRepository $mr) use($gameId) {
                return $mr->createQueryBuilder('m')->where('m.game = :gameId')->setParameter('gameId',
                        $gameId);
            }
        ))->add('listRules', 'entity',
            array(
            'required' => false,
            'class' => 'RFCCoreBundle:Rule',
            'multiple' => true,
            'expanded' => true,
            'query_builder' => function (RuleRepository $er) use($gameId) {
                return $er->createQueryBuilder('r')->where('r.game = :gameId')->setParameter('gameId',
                        $gameId);
            }
        ))->add('commentsActive', 'checkbox',
            array(
            'required' => false
        ))->add('game', 'entity',
            array(
            'class' => 'RFC\CoreBundle\Entity\Game'
        ))->add('listImages', 'collection',
            array(
            'type' => new ImageType(),
            'allow_add' => true,
            'allow_delete' => true,
            'by_reference' => false
        ));
    }

    /**
     *
     * @param OptionsResolverInterface $resolver
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'RFC\CoreBundle\Entity\Championship'
        ));
    }

    /**
     *
     * @return string
     */
    public function getName()
    {
        return 'rfc_corebundle_championship';
    }
}