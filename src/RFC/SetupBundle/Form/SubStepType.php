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
namespace RFC\SetupBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class SubStepType extends AbstractType {
	
	/**
	 *
	 * @param FormBuilderInterface $builder        	
	 * @param array $options        	
	 */
	public function buildForm(FormBuilderInterface $builder, array $options) {
		$builder->add ( 'name' )->add ( 'description', 'textarea', array (
				'required' => false 
		) )->add ( 'action', 'choice', array (
				'choices' => array (
						'next' => 'Go to next step',
						'stay' => 'Stay in step' 
				),
				'required' => true 
		) )->add ( 'stepCondition', 'textarea', array (
				'required' => false 
		) )->add ( 'toDoText', 'textarea', array (
				'required' => false 
		) )->add ( 'optimalAction', 'checkbox', array (
				'required' => false 
		) )->add ( 'commentsActive', 'hidden', array (
				'data' => '0'
		) )->add ( 'step', 'entity', array (
				'class' => 'RFC\SetupBundle\Entity\Step' 
		) );
	}
	
	/**
	 *
	 * @param OptionsResolverInterface $resolver        	
	 */
	public function setDefaultOptions(OptionsResolverInterface $resolver) {
		$resolver->setDefaults ( array (
				'data_class' => 'RFC\SetupBundle\Entity\SubStep' 
		) );
		
		$resolver->setRequired ( array (
				'em' 
		) );
		
		$resolver->setAllowedTypes ( array (
				'em' => 'Doctrine\Common\Persistence\ObjectManager' 
		) );
	}
	
	/**
	 *
	 * @return string
	 */
	public function getName() {
		return 'rfc_setupbundle_subStep';
	}
}