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

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use RFC\CoreBundle\Entity\Result;
use RFC\CoreBundle\Form\ResultType;

/**
 * Result controller.
 */
class ResultController extends Controller
{

    /**
     * Lists all Result entities.
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();
        
        $entities = $em->getRepository('RFCCoreBundle:Result')->findAll();
        
        return $this->render('RFCAdminBundle:Result:index.html.twig', array(
            'entities' => $entities
        ));
    }

    /**
     * Creates a new Result entity.
     */
    public function createAction(Request $request)
    {
        $entity = new Result();
        $form = $this->createCreateForm($entity);
        $form->handleRequest($request);
        
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();
            
            return $this->redirect($this->generateUrl('admin_result_show', array(
                'resultId' => $entity->getId()
            )));
        }
        
        return $this->render('RFCAdminBundle:Result:new.html.twig', array(
            'entity' => $entity,
            'form' => $form->createView()
        ));
    }

    /**
     * Creates a form to create a Result entity.
     *
     * @param Result $entity
     *            The entity
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createCreateForm(Result $entity)
    {
        $form = $this->createForm(new ResultType(), $entity, array(
            'action' => $this->generateUrl('admin_result_create'),
            'method' => 'POST'
        ));
        
        $form->add('submit', 'submit', array(
            'label' => 'Create'
        ));
        
        return $form;
    }

    /**
     * Displays a form to create a new Result entity.
     */
    public function newAction()
    {
        $entity = new Result();
        $form = $this->createCreateForm($entity);
        
        return $this->render('RFCAdminBundle:Result:new.html.twig', array(
            'entity' => $entity,
            'form' => $form->createView()
        ));
    }

    /**
     * Finds and displays a Result entity.
     */
    public function showAction($resultId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:Result')->find($resultId);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Result entity.');
        }
        
        $deleteForm = $this->createDeleteForm($resultId);
        
        return $this->render('RFCAdminBundle:Result:show.html.twig', array(
            'entity' => $entity,
            'delete_form' => $deleteForm->createView()
        ));
    }

    /**
     * Displays a form to edit an existing Result entity.
     */
    public function editAction($resultId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:Result')->find($resultId);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Result entity.');
        }
        
        $editForm = $this->createEditForm($entity);
        $deleteForm = $this->createDeleteForm($resultId);
        
        return $this->render('RFCAdminBundle:Result:edit.html.twig', array(
            'entity' => $entity,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView()
        ));
    }

    /**
     * Creates a form to edit a Result entity.
     *
     * @param Result $entity
     *            The entity
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createEditForm(Result $entity)
    {
        $form = $this->createForm(new ResultType(), $entity, array(
            'action' => $this->generateUrl('admin_result_update', array(
                'resultId' => $entity->getId()
            )),
            'method' => 'PUT'
        ));
        
        $form->add('submit', 'submit', array(
            'label' => 'Update'
        ));
        
        return $form;
    }

    /**
     * Edits an existing Result entity.
     */
    public function updateAction(Request $request, $resultId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:Result')->find($resultId);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Result entity.');
        }
        
        $deleteForm = $this->createDeleteForm($resultId);
        $editForm = $this->createEditForm($entity);
        $editForm->handleRequest($request);
        
        if ($editForm->isValid()) {
            $em->flush();
            
            return $this->redirect($this->generateUrl('admin_result_edit', array(
                'resultId' => $resultId
            )));
        }
        
        return $this->render('RFCAdminBundle:Result:edit.html.twig', array(
            'entity' => $entity,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView()
        ));
    }

    /**
     * Deletes a Result entity.
     */
    public function deleteAction(Request $request, $resultId)
    {
        $form = $this->createDeleteForm($resultId);
        $form->handleRequest($request);
        
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('RFCCoreBundle:Result')->find($resultId);
            
            if (! $entity) {
                throw $this->createNotFoundException('Unable to find Result entity.');
            }
            
            $em->remove($entity);
            $em->flush();
        }
        
        return $this->redirect($this->generateUrl('admin_result'));
    }

    /**
     * Creates a form to delete a Result entity by id.
     *
     * @param mixed $resultId
     *            The entity id
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($resultId)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('admin_result_delete', array(
            'resultId' => $resultId
        )))
            ->setMethod('DELETE')
            ->add('submit', 'submit', array(
            'label' => 'Delete'
        ))
            ->getForm();
    }
    
    public function setSessionResultsAction()
    {
        $em = $this->getDoctrine()->getManager();

        $contents = array();
        $results = array();
        
        $content = $this->get("request")->getContent();
        if (!empty($content)) {
            $contents = json_decode($content, true); // 2nd param to get as array
        }
        
        $session = $em->getRepository("RFCCoreBundle:Session")->findOneById($contents['sessionId']);
        $users = $em->getRepository("RFCUserBundle:User")->findAll();
        $rules = $em->getRepository("RFCCoreBundle:Rule")->findAll();

        // List through results form ajax query
        foreach($contents['results'] as $contentResult)
        {
            $resultData = explode(',', $contentResult);
            $ruleId = $resultData[0];
            $value = $resultData[1];
            $userId = $resultData[2];
            $user = $this->getUserById($userId,$users);
            $rule = $this->getRuleById($ruleId,$rules);
            
            $result = new Result();
            $result->setRule($rule);
            $result->setSession($session);
            $result->setValue($value);
            $result->setUser($user);
            $em->persist($result);
            array_push($results, $result);
        }

        try {
            $em->flush();
            $jsonResponse = new JsonResponse($results, 200);
        } catch (Exception $e) {
            $jsonResponse = new JsonResponse($results, 400);
        }

        return $jsonResponse;
    }
    
    public function updateSessionResultsAction()
    {
        $em = $this->getDoctrine()->getManager();

        $contents = array();
        $results = array();
        $resultsIds = array();
        
        $content = $this->get("request")->getContent();
        if (!empty($content)) {
            $contents = json_decode($content, true); // 2nd param to get as array
        }
        
        var_dump($contents);
        
        $results = $contents[1];
        
        foreach($results as $res)
        {
            array_push($resultsIds, $res->getId());
        }
        
        var_dump('results ids : '.$resultsIds);
        
        $session = $em->getRepository("RFCCoreBundle:Session")->findOneById($contents[0]);
        
        $dbResults = $em->getRepository("RFCCoreBundle:Result")
            ->createQueryBuilder('r')
            ->where('r.session = :sessionId')
            ->andWhere('r.id IN (:arrayResultsId)')
            ->setParameters(array(
            'sessionId' => $contents[0],
            'arrayResultsId' => $resultsIds
            ))
            ->getQuery()
            ->getResult();
        
        $users = $em->getRepository("RFCUserBundle:User")->findAll();

        // List through results form ajax query
        for ($i=0, $size = count($results); $i < $size; ++$i)
        {
            $resultFound = false;
            $resultData = explode($results[$i], ',');
            $ruleId = $resultData[0];
            $resultId = $resultData[1];
            $value = $resultData[2];
            $userId = $resultData[3];
            $user = $this->getUserById($userId,$users);
            $rule = $this->getRuleById($ruleId,$rules);
            
            // List through all DB results for this session
            for ($j=0, $sizej = count($dbResults); $j < $sizej; ++$j)
            {
                if($dbResults[$j]->getId() == $resultId)
                {
                    $resultFound = true;
                    $dbResults[$j]->setRule($rule);
                    $dbResults[$j]->setValue($value);
                    $dbResults[$j]->setSession($session);
                    $dbResults[$j]->setUser($user);
                }
            }
            //If result is not found id DB, create it
            if(!$resultFound)
            {
                $result = new Result();
                $result->setRule($rule);
                $result->setSession($session);
                $result->setValue($value);
                $result->setUser($user);
                array_push($dbResults, $result);
                $em->persist($result);
            }
        }

        try {
            $em->flush();
            $jsonResponse = new JsonResponse($dbResults, 200);
        } catch (Exception $e) {
            $jsonResponse = new JsonResponse($dbResults, 400);
        }

        return $jsonResponse;
    }
    
    private function getRuleById($id, $ruleArray)
    {
        foreach($ruleArray as $rule)
        {
            if($rule->getId() == $id)
            {
                return $rule;
            }
        }
    }
    
    private function getUserById($id, $userArray)
    {
        foreach($userArray as $user)
        {
            if($user->getId() == $id)
            {
                return $user;
            }
        }
    }
}
