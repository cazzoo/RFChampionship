<?php
/*  //RF//Championship is a multi-racing game team manager that allows members to organize and follow championships.
    Copyright (C) 2014 - //Racing-France//

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.*/

namespace RFC\AdminBundle\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * System controller.
 */
class SystemController extends Controller
{

    /**
     * System properties.
     */
    public function indexAction()
    {
        $entityManager = $this->getDoctrine()->getManager();

        $properties = $entityManager->getRepository('RFCCoreBundle:Property')
            ->createQueryBuilder('p')
            ->where('p.category != :category')
            ->setParameter('category', 'user')
            ->getQuery()
            ->getResult();

        return $this->render('RFCAdminBundle:System:index.html.twig', array(
            'properties' => $properties
        ));
    }

    public function updatePropertiesAction()
    {
        $entityManager = $this->getDoctrine()->getManager();
        $properties = $entityManager->getRepository("RFCCoreBundle:Property")->findAll();

        $params = array();
        $content = $this->get("request")->getContent();
        if (!empty($content)) {
            $params = json_decode($content, true); // 2nd param to get as array
        }
        
        foreach($properties as $property)
        {
            foreach($params as $param)
            {
                if($property->getId() == $param['name'])
                {
                    $property->setValue($param['value']);
                }
            }
        }

        try {
            $entityManager->flush();
            $jsonResponse = new JsonResponse($properties, 200);
        } catch (\Exception $e) {
            $jsonResponse = new JsonResponse($properties, 400);
        }


        return $jsonResponse;
    }
}
