<?php
namespace RFC\CoreBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use RFC\CoreBundle\Form\DataTransformer\GameToIntTransformer;
use RFC\CoreBundle\Entity\VehicleRepository;

class CategoryType extends AbstractType
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
            ->add('description', 'textarea')
            ->add('listVehicles', null, array(
            'required' => false,
            'class' => 'RFCCoreBundle:Vehicle',
            'query_builder' => function (VehicleRepository $ve) use($id)
            {
                return $ve->createQueryBuilder('v')
                    ->where('v.game = :id')
                    ->setParameter('id', $id);
            }
        ))
            ->add('commentsActive', 'checkbox', array(
            'required' => false
        ))
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
            'data_class' => 'RFC\CoreBundle\Entity\Category'
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
        return 'rfc_corebundle_category';
    }
}
