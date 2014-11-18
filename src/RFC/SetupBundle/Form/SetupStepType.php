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
use RFC\SetupBundle\Entity\SubStepRepository;

class SetupStepType extends AbstractType {
	public function __construct($stepId) {
		$this->stepId = $stepId;
	}
	
	/**
	 *
	 * @param FormBuilderInterface $builder        	
	 * @param array $options        	
	 */
	public function buildForm(FormBuilderInterface $builder, array $options) {
		$stepId = $this->stepId;
		$builder->add ( 'value' )->add ( 'subStep', 'entity', array (
				'required' => true,
				'class' => 'RFCSetupBundle:SubStep',
				'query_builder' => function (SubStepRepository $sr) use($stepId) {
					return $sr->createQueryBuilder ( 's' )->where ( 's.step = :stepId' )->setParameter ( 'stepId', $stepId );
				} 
		));
	}
	
	/**
	 *
	 * @param OptionsResolverInterface $resolver        	
	 */
	public function setDefaultOptions(OptionsResolverInterface $resolver) {
		$resolver->setDefaults ( array (
				'data_class' => 'RFC\SetupBundle\Entity\SetupStep' 
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
		return 'rfc_setupbundle_setupStep';
	}
}