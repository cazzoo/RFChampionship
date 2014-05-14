<?php
namespace RFC\CoreBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use RFC\CoreBundle\Form\DataTransformer\GameToIntTransformer;

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
            ->add('description')
            ->add('isAgreed')
            ->add('listEvents', 'entity', array(
            'required' => false,
            'class' => 'RFCCoreBundle:Event',
            'multiple' => true
        ))
            ->add('listManagers', 'entity', array(
            'required' => false,
            'class' => 'RFCUserBundle:User',
            'multiple' => true
        ))
            ->add('metaRule', 'entity', array(
            'required' => false,
            'class' => 'RFCCoreBundle:MetaRule'
        ))
            ->add('listRules', 'entity', array(
            'required' => false,
            'class' => 'RFCCoreBundle:Rule',
            'multiple' => true
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
