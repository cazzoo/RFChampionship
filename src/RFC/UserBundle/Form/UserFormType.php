<?php
namespace RFC\UserBundle\Form;

use FOS\UserBundle\Form\Type\RegistrationFormType;
use Symfony\Component\Form\FormBuilderInterface;
 
class UserFormType extends RegistrationFormType
{
 
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        parent::buildForm($builder, $options);
        $builder->add('roles')
        ->add('firstName')
        ->add('lastName')
        ->add('age')
        ->add('avatarUrl')
        ->add('steamId')
        ->add('mentor');
    }
}