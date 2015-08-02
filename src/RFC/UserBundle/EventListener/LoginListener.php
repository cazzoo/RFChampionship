<?php
// file : src/RFC/UserBundle\EventListener/LoginListener.php

namespace RFC\UserBundle\EventListener;

use Symfony\Bundle\FrameworkBundle\Routing\Router;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\HttpKernel\HttpKernel;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\Security\Core\Event\AuthenticationEvent;
use Symfony\Component\Security\Core\SecurityContext;

class LoginListener
{
    /**
     * @var string
     */
    protected $locale;

    /**
     * Router
     *
     * @var Router
     */
    protected $router;

    /**
     * @var SecurityContext
     */
    protected $securityContext;

    /**
     * @param SecurityContext $securityContext
     * @param Router $router The router
     */
    public function __construct(SecurityContext $securityContext, Router $router)
    {
        $this->securityContext = $securityContext;
        $this->router          = $router;
    }

    /**
     * Set locale to parameter if user has local stored in DB
     * @param AuthenticationEvent $event
     */
    public function handle(AuthenticationEvent $event)
    {
        $token = $event->getAuthenticationToken();
        if ('anon.' != $token->getUser()) {
            $this->locale = $token->getUser()->getLocale();
        }
    }

    /**
     * Set locale in request if logged user has request
     * @param FilterResponseEvent $event
     * @return type
     */
    public function onKernelResponse(FilterResponseEvent $event)
    {
        if (HttpKernelInterface::MASTER_REQUEST !== $event->getRequestType()) {
            return;
        }
        if (null !== $this->locale) {
            $request = $event->getRequest();
            $request->getSession()->set('_locale', $this->locale);
        }
    }
}