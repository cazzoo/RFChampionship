<?php
namespace RFC\UserBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class UserType extends AbstractType
{

    /**
     *
     * @param FormBuilderInterface $builder            
     * @param array $options            
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('username')
            ->add('email')
            ->add('password')
            ->add('roles')
            ->add('firstName')
            ->add('lastName')
            ->add('age')
            ->add('avatarUrl')
            ->add('steamId')
            ->add('mentor');
    }

    /**
     *
     * @param OptionsResolverInterface $resolver            
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'RFC\UserBundle\Entity\User'
        ));
    }

    /**
     *
     * @return string
     */
    public function getName()
    {
        return 'rfc_userbundle_user';
    }
}
