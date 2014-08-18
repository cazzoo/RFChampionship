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
use RFC\CoreBundle\Form\DataTransformer\GameToIntTransformer;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use RFC\CoreBundle\Entity\RuleRepository;
use RFC\CoreBundle\Entity\MetaRuleRepository;

class ChampionshipType extends AbstractType
{

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
        $gameTransformer = new GameToIntTransformer($options['em']);
        
        $builder->add('name')
            ->add('description', 'textarea', array(
            'required' => false
        ))
            ->add('isAgreed', 'checkbox', array(
            'required' => false
        ))
            ->add('listManagers', 'entity', array(
            'required' => false,
            'class' => 'RFCUserBundle:User',
            'multiple' => true
        ))
            ->add('metaRule', 'entity', array(
            'required' => false,
            'class' => 'RFCCoreBundle:MetaRule',
            'query_builder' => function (MetaRuleRepository $mr) use($id)
            {
                return $mr->createQueryBuilder('m')
                    ->where('m.game = :id')
                    ->setParameter('id', $id);
            }
        ))
            ->add('listRules', 'entity', array(
            'required' => false,
            'class' => 'RFCCoreBundle:Rule',
            'multiple' => true,
            'expanded' => true,
            'query_builder' => function (RuleRepository $er) use($id)
            {
                return $er->createQueryBuilder('r')
                    ->where('r.game = :id')
                    ->setParameter('id', $id);
            }
        ))
            ->add('commentsActive', 'checkbox', array(
            'required' => false
        ))
            /*->add($builder->create('game', 'hidden')
            ->addModelTransformer($gameTransformer))*/
            ->
        
        add('game', 'entity', array(
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
            'data_class' => 'RFC\CoreBundle\Entity\Championship'
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
        return 'rfc_corebundle_championship';
    }
}
