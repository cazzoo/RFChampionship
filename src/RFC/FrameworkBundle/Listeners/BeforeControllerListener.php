<?php

namespace RFC\FrameworkBundle\Listeners;

use RFC\FrameworkBundle\Controller\RFCController;
use RFC\FrameworkBundle\Services\LoadAppSettings;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;

class BeforeControllerListener
{
    private $appParamService;

    public function __construct(LoadAppSettings $appParamService)
    {
        $this->appParamService = $appParamService;
    }

    public function onKernelController(FilterControllerEvent $event)
    {
        $controller = $event->getController ();

        if (!is_array ( $controller )) {
            return;
        }

        if ($controller[0] instanceof RFCController) {

            $this->appParamService->modifySession ();
        }
    }
}