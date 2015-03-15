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
use RFC\CoreBundle\Entity\TypeSessionRepository;

class SessionType extends AbstractType
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
        ))->add('beginDate', 'datetime',
            array(
            'widget' => 'single_text',
            'format' => 'yyyy/MM/dd HH:mm',
            'attr' => array(
                'class' => 'datetimepicker'
            )
        ))->add('endDate', 'datetime',
            array(
            'widget' => 'single_text',
            'format' => 'yyyy/MM/dd HH:mm',
            'attr' => array(
                'class' => 'datetimepicker'
            )
        ))->add('typeSession', 'entity',
            array(
            'required' => true,
            'class' => 'RFCCoreBundle:TypeSession',
            'query_builder' => function (TypeSessionRepository $ts) use($gameId) {
                return $ts->createQueryBuilder('t')->where('t.game = :gameId')->setParameter('gameId',
                        $gameId);
            }
        ))->add('commentsActive', 'checkbox',
            array(
            'required' => false
        ))->add('event');
    }

    /**
     *
     * @param OptionsResolverInterface $resolver
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'RFC\CoreBundle\Entity\Session'
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
        return 'rfc_corebundle_session';
    }
}