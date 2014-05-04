<?php
namespace RFC\UserBundle\Form;

use FOS\UserBundle\Form\Type\RegistrationFormType as BaseType;
use Symfony\Component\Form\FormBuilderInterface;
use RFC\UserBundle\Entity\RoleEnum;

class UserFormType extends BaseType
{

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        parent::buildForm($builder, $options);
        
        $builder->add('roles', 'choice', array(
            'choices' => RoleEnum::getEnum(),
            'multiple' => true,
            'required' => true,
        ))
            ->add('firstName')
            ->add('lastName')
            ->add('age')
            ->add('avatarUrl')
            ->add('steamId')
            ->add('mentor');
    }
}