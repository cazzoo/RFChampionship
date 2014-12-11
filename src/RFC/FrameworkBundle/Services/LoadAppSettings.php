<?php

namespace RFC\FrameworkBundle\Services;

use Symfony\Component\HttpFoundation\RequestStack;

class LoadAppSettings
{
    private $requestStack;
    private $propertyRepository;

    public function __construct(RequestStack $requestStack, $propertyRepository)
    {
        $this->requestStack       = $requestStack;
        $this->propertyRepository = $propertyRepository;
    }

    public function modifySession()
    {
        $request = $this->requestStack->getCurrentRequest();
        $session = $request->getSession();

        if ($session->has('parameters')) {
            return;
        }

        $data = $this->propertyRepository
            ->createQueryBuilder('p')
            ->where('p.category != :category')
            ->setParameter('category', 'user')
            ->getQuery()
            ->getResult();

        $session->set('parameters', $data);
    }

    /**
     *
     * @param type $paramName the name of the param we want to get
     * @return type the param or null if not found
     */
    public function getParam($paramName)
    {

        $request = $this->requestStack->getCurrentRequest();
        $session = $request->getSession();

        if (!$session->has('parameters')) {
            return null;
        } else {
            foreach ($session->get('parameters') as $param) {
                if ($param->getName() == $paramName) {
                    return $param;
                }
            }
        }
        return null;
    }
}
