<?php
namespace RFC\CoreBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
<<<<<<< HEAD
use RFC\CoreBundle\Entity\TypeSessionRepository;
=======
>>>>>>> WorkingBundles

class RuleType extends AbstractType
{

<<<<<<< HEAD
    public function __construct($id)
    {
        $this->id = $id;
    }

=======
>>>>>>> WorkingBundles
    /**
     *
     * @param FormBuilderInterface $builder            
     * @param array $options            
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
<<<<<<< HEAD
        $id = $this->id;
        
        $builder->add('name')
            ->add('value')
            ->add('typeSession', null, array(
            'required' => true,
            'class' => 'RFCCoreBundle:TypeSession',
            'query_builder' => function (TypeSessionRepository $er) use($id)
            {
                return $er->createQueryBuilder('t')
                    ->where('t.game = :id')
                    ->setParameter('id', $id);
            }
        ))
=======
        $builder->add('name')
            ->add('value')
>>>>>>> WorkingBundles
            ->add('game', 'entity', array(
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
            'data_class' => 'RFC\CoreBundle\Entity\Rule'
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
        return 'rfc_corebundle_rule';
    }
}
