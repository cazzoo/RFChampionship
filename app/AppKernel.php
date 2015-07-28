<?php

use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\Config\Loader\LoaderInterface;

class AppKernel extends Kernel
{

    public function registerBundles()
    {
        $bundles = array(
            new Symfony\Bundle\FrameworkBundle\FrameworkBundle (),
            new Symfony\Bundle\SecurityBundle\SecurityBundle (),
            new Symfony\Bundle\TwigBundle\TwigBundle (),
            new Symfony\Bundle\MonologBundle\MonologBundle (),
            new Symfony\Bundle\SwiftmailerBundle\SwiftmailerBundle (),
            new Symfony\Bundle\AsseticBundle\AsseticBundle (),
            new Doctrine\Bundle\DoctrineBundle\DoctrineBundle (),
            new Sensio\Bundle\FrameworkExtraBundle\SensioFrameworkExtraBundle (),
            new Stof\DoctrineExtensionsBundle\StofDoctrineExtensionsBundle (),
            new Genemu\Bundle\FormBundle\GenemuFormBundle (),
            new FOS\UserBundle\FOSUserBundle (),
            new FOS\JsRoutingBundle\FOSJsRoutingBundle (),
            new ADesigns\CalendarBundle\ADesignsCalendarBundle (),
            new Knp\Bundle\MenuBundle\KnpMenuBundle (),
            new FOS\RestBundle\FOSRestBundle (),
            new FOS\CommentBundle\FOSCommentBundle (),
            new JMS\SerializerBundle\JMSSerializerBundle(),
            new JMS\TwigJsBundle\JMSTwigJsBundle(),
            new Ras\Bundle\FlashAlertBundle\RasFlashAlertBundle(),
            new RFC\FrameworkBundle\RFCFrameworkBundle (),
            new RFC\CoreBundle\RFCCoreBundle (),
            new RFC\UserBundle\RFCUserBundle (),
            new RFC\AdminBundle\RFCAdminBundle (),
            new RFC\SetupBundle\RFCSetupBundle ()
        );

        if (in_array($this->getEnvironment(),
                array(
                'dev',
                'test'
            ))) {
            $bundles [] = new Symfony\Bundle\WebProfilerBundle\WebProfilerBundle ();
            $bundles [] = new Sensio\Bundle\DistributionBundle\SensioDistributionBundle ();
            $bundles [] = new Sensio\Bundle\GeneratorBundle\SensioGeneratorBundle ();
        }

        return $bundles;
    }

    public function registerContainerConfiguration(LoaderInterface $loader)
    {
        $loader->load(__DIR__.'/config/config_'.$this->getEnvironment().'.yml');
    }
}