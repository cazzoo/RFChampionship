<?php
namespace RFC\CoreBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use RFC\CoreBundle\Entity\TrackRepository;
use RFC\CoreBundle\Entity\VehicleRepository;
use RFC\CoreBundle\Entity\CategoryRepository;

class EventType extends AbstractType
{

    public function __construct($gameId)
    {
        $this->gameId = $gameId;
    }

    /**
     *
     * @param FormBuilderInterface $builder            
     * @param array $options            
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $gameId = $this->gameId;
        
        $builder->add('listSessions', 'entity', array(
            'required' => false,
            'class' => 'RFCCoreBundle:Session',
            'multiple' => true
        ))
            ->add('beginDate')
            ->add('endDate')
            ->add('listBroadcast', 'collection', array(
            'allow_add' => true
        ))
            ->add('track', 'entity', array(
            'required' => false,
            'class' => 'RFCCoreBundle:Track',
            'required' => false,
            'query_builder' => function (TrackRepository $er) use($gameId)
            {
                return $er->createQueryBuilder('t')
                    ->where('t.game = :gameId')
                    ->setParameter('gameId', $gameId);
            }
        ))
            ->add('vehicle', 'entity', array(
            'required' => false,
            'class' => 'RFCCoreBundle:Vehicle',
            'required' => false,
            'query_builder' => function (VehicleRepository $er) use($gameId)
            {
                return $er->createQueryBuilder('v')
                    ->where('v.game = :gameId')
                    ->setParameter('gameId', $gameId);
            }
        ))
            ->add('category', 'entity', array(
            'required' => false,
            'class' => 'RFCCoreBundle:Category',
            'required' => false,
            'query_builder' => function (CategoryRepository $er) use($gameId)
            {
                return $er->createQueryBuilder('c')
                    ->where('c.game = :gameId')
                    ->setParameter('gameId', $gameId);
            }
        ))
            ->add('championship', 'entity', array(
            'class' => 'RFC\CoreBundle\Entity\Championship'
        ));
    }

    /**
     *
     * @param OptionsResolverInterface $resolver            
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'RFC\CoreBundle\Entity\Event'
        ));
    }

    /**
     *
     * @return string
     */
    public function getName()
    {
        return 'rfc_corebundle_event';
    }
}
