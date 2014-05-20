<?php
namespace RFC\CoreBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use RFC\CoreBundle\Form\DataTransformer\GameToIntTransformer;
<<<<<<< HEAD
use RFC\CoreBundle\Entity\RuleRepository;
=======
>>>>>>> WorkingBundles

class MetaRuleType extends AbstractType
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
=======
>>>>>>> WorkingBundles
        $gameTransformer = new GameToIntTransformer($options['em']);
        
        $builder->add('name')
            ->add('description')
            ->add('isAgreed')
            ->add('listRules', null, array(
<<<<<<< HEAD
            'required' => false,
            'class' => 'RFCCoreBundle:Rule',
            'query_builder' => function (RuleRepository $er) use($id)
            {
                return $er->createQueryBuilder('r')
                    ->where('r.game = :id')
                    ->setParameter('id', $id);
            }
=======
            'required' => false
>>>>>>> WorkingBundles
        ))
            /*->add($builder->create('game', 'hidden')
            ->addModelTransformer($gameTransformer))*/
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
            'data_class' => 'RFC\CoreBundle\Entity\MetaRule'
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
        return 'rfc_corebundle_metarule';
    }
}
