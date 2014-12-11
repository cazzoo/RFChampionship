<?php

namespace RFC\FrameworkBundle\Services;

use Symfony\Component\HttpFoundation\RequestStack;

class LoadAppSettings
{
    private $requestStack;
    private $propertyRepository;
    private $gameRepository;

    public function __construct(RequestStack $requestStack, $propertyRepository,
                                $gameRepository)
    {
        $this->requestStack       = $requestStack;
        $this->propertyRepository = $propertyRepository;
        $this->gameRepository     = $gameRepository;
    }

    public function modifySession()
    {
        $request = $this->requestStack->getCurrentRequest ();
        $session = $request->getSession ();

        $gameId = $request->get ( 'gameId' );

        if (null == $gameId) {
            if ($session->has ( 'game' )) {
                $session->remove ( 'game' );
            }
        } else {
            if (!$session->has ( 'game' )) {
                $game = $this->gameRepository->find ( $gameId );
                $session->set ( 'game', $game );
            }
        }

        if (!$session->has ( 'parameters' )) {
            $data = $this->propertyRepository
                ->createQueryBuilder ( 'p' )
                ->where ( 'p.category != :category' )
                ->setParameter ( 'category', 'user' )
                ->getQuery ()
                ->getResult ();

            $session->set ( 'parameters', $data );
        }
    }

    /**
     *
     * @param type $paramName the name of the param we want to get
     * @return type the param or null if not found
     */
    public function getParam($name)
    {

        $request = $this->requestStack->getCurrentRequest ();
        $session = $request->getSession ();

        if (!$session->has ( 'parameters' )) {
            return null;
        } else {
            foreach ($session->get ( 'parameters' ) as $param) {
                $paramUpperName = strtoupper ( trim ( preg_replace ( '/\s+/',
                            ' ', $param->getName () ) ) );
                $upperName      = strtoupper ( trim ( preg_replace ( '/\s+/',
                            ' ', $name ) ) );
                if ($paramUpperName == $upperName) {
                    return $param;
                }
            }
        }
        return null;
    }

    /**
     *
     * @return type the game if exists in session
     */
    public function getGame()
    {

        $request = $this->requestStack->getCurrentRequest ();
        $session = $request->getSession ();

        if ($session->has ( 'game' )) {
            return game;
        }

        return null;
    }
}