<?php
namespace RFC\UserBundle\Form;

use FOS\UserBundle\Form\Type\RegistrationFormType as BaseType;
use Symfony\Component\Form\FormBuilderInterface;

class RegistrationFormType extends BaseType
{

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        parent::buildForm($builder, $options);
        
        $builder->add('firstName')
            ->add('lastName')
            ->add('age')
            ->add('avatarUrl')
            ->add('steamId');
    }

    public function getName()
    {
        return 'rfc_user_registration';
    }
}