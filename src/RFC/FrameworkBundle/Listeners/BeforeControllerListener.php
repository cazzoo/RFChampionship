<?php

namespace RFC\FrameworkBundle\Listeners;

use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use RFC\FrameworkBundle\Services\LoadAppSettings;

class BeforeControllerListener
{
    private $appParamService;

    public function __construct(LoadAppSettings $appParamService)
    {
        $this->appParamService = $appParamService;
    }

    public function onKernelController(FilterControllerEvent $event)
    {
        $this->appParamService->modifySession();
    }
}
