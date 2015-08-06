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

    public function clearSession()
    {
        $request = $this->requestStack->getCurrentRequest();
        $session = $request->getSession();

        if ($session->has('game')) {
            $session->remove('game');
        }

        if (!$session->has('parameters')) {
            $session->remove('parameters');
        }
    }

    public function modifySession()
    {
        $request = $this->requestStack->getCurrentRequest();
        $session = $request->getSession();

        $gameId = $request->get('gameId');

        if (null == $gameId) {
            if ($session->has('game')) {
                $session->remove('game');
            }
        } else {
            $game = $this->gameRepository->find($gameId);
            if (!$session->has('game')) {
                $session->set('game', $game);
            } else {
                if (null != $game) {
                    $session->set('game', $game);
                } else {
                    $session->remove('game');
                }
            }
        }

        if (!$session->has('parameters')) {
            $data = $this->propertyRepository
                ->createQueryBuilder('p')
                ->where('p.category != :category')
                ->andWhere('p.game is NULL')
                ->setParameter('category', 'user')
                ->getQuery()
                ->getResult();

            $session->set('parameters', $data);
        }
    }

    /**
     *
     * @param string $name : the name of the param we want to get
     * @return type the param or null if not found
     */
    public function getParam($name)
    {

        $request = $this->requestStack->getCurrentRequest();
        $session = $request->getSession();

        if (!$session->has('parameters')) {
            return null;
        } else {
            foreach ($session->get('parameters') as $param) {
                $paramUpperName = strtoupper(preg_replace('/\s+/', '',
                        trim($param->getName())));
                $upperName      = strtoupper(preg_replace('/\s+/', '',
                        trim($name)));
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

        $request = $this->requestStack->getCurrentRequest();
        $session = $request->getSession();

        if ($session->has('game')) {
            return $session->get('game');
        }

        return null;
    }
}