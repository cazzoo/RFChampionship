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
  along with this program.  If not, see <http://www.gnu.org/licenses/>. */

namespace RFC\AdminBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use RFC\CoreBundle\Entity\Rule;
use RFC\CoreBundle\Form\RuleType;

/**
 * Rule controller.
 */
class RuleController extends Controller
{

    /**
     * Lists all Rule entities.
     */
    public function indexAction($gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $rules = $entityManager->getRepository('RFCCoreBundle:Rule')->findBy(array(
            'game' => $gameId
        ));

        return $this->render('RFCAdminBundle:Rule:index.html.twig',
                array(
                'rules' => $rules,
                'metaRuleId' => null,
                'gameId' => $gameId
        ));
    }

    /**
     * Creates a new Rule entity.
     */
    public function createAction(Request $request, $gameId)
    {
        $entity = new Rule();
        $form   = $this->createCreateForm($entity, $gameId);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($entity);
            $entityManager->flush();

            return $this->redirect($this->generateUrl('admin_metaRule',
                        array(
                        'gameId' => $gameId
            )));
        }

        return $this->render('RFCAdminBundle:Rule:new.html.twig',
                array(
                'entity' => $entity,
                'form' => $form->createView(),
                'gameId' => $gameId
        ));
    }

    /**
     * Creates a form to create a Rule entity.
     *
     * @param Rule $entity
     *            The entity
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createCreateForm(Rule $entity, $gameId)
    {
        $form = $this->createForm(new RuleType($gameId), $entity,
            array(
            'em' => $this->getDoctrine()
                ->getManager(),
            'action' => $this->generateUrl('admin_rule_create',
                array(
                'gameId' => $gameId
            )),
            'method' => 'POST'
        ));

        $form->add('submit', 'submit',
            array(
            'label' => 'Create'
        ));

        return $form;
    }

    /**
     * Displays a form to create a new Rule entity.
     */
    public function newAction($gameId)
    {
        $entity        = new Rule();
        $entityManager = $this->getDoctrine()->getManager();
        $entityGame    = $entityManager->getRepository('RFCCoreBundle:Game')->find($gameId);
        $entity->setGame($entityGame);
        $form          = $this->createCreateForm($entity, $gameId);

        return $this->render('RFCAdminBundle:Rule:new.html.twig',
                array(
                'entity' => $entity,
                'form' => $form->createView(),
                'gameId' => $gameId
        ));
    }

    /**
     * Finds and displays a Rule entity.
     */
    public function showAction($ruleId, $gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:Rule')->find($ruleId);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Rule entity.');
        }

        $deleteForm = $this->createDeleteForm($ruleId, $gameId);

        return $this->render('RFCAdminBundle:Rule:show.html.twig',
                array(
                'entity' => $entity,
                'delete_form' => $deleteForm->createView(),
                'gameId' => $gameId
        ));
    }

    /**
     * Displays a form to edit an existing Rule entity.
     */
    public function editAction($ruleId, $gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:Rule')->find($ruleId);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Rule entity.');
        }

        $editForm   = $this->createEditForm($entity, $gameId);
        $deleteForm = $this->createDeleteForm($ruleId, $gameId);

        return $this->render('RFCAdminBundle:Rule:edit.html.twig',
                array(
                'entity' => $entity,
                'gameId' => $gameId,
                'edit_form' => $editForm->createView(),
                'delete_form' => $deleteForm->createView()
        ));
    }

    /**
     * Creates a form to edit a Rule entity.
     *
     * @param Rule $entity
     *            The entity
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createEditForm(Rule $entity, $gameId)
    {
        $form = $this->createForm(new RuleType($gameId), $entity,
            array(
            'em' => $this->getDoctrine()
                ->getManager(),
            'action' => $this->generateUrl('admin_rule_update',
                array(
                'ruleId' => $entity->getId(),
                'gameId' => $gameId
            )),
            'method' => 'PUT'
        ));

        $form->add('submit', 'submit',
            array(
            'label' => 'Update'
        ));

        return $form;
    }

    /**
     * Edits an existing Rule entity.
     */
    public function updateAction(Request $request, $ruleId, $gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:Rule')->find($ruleId);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Rule entity.');
        }

        $deleteForm = $this->createDeleteForm($ruleId, $gameId);
        $editForm   = $this->createEditForm($entity, $gameId);
        $editForm->handleRequest($request);

        if ($editForm->isValid()) {
            $entityManager->flush();

            return $this->redirect($this->generateUrl('admin_metaRule',
                        array(
                        'gameId' => $gameId
            )));
        }

        return $this->render('RFCAdminBundle:Rule:edit.html.twig',
                array(
                'entity' => $entity,
                'edit_form' => $editForm->createView(),
                'delete_form' => $deleteForm->createView(),
                'gameId' => $gameId
        ));
    }

    /**
     * Deletes a Rule entity.
     */
    public function deleteAction(Request $request, $ruleId, $gameId)
    {
        $form = $this->createDeleteForm($ruleId, $gameId);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entity        = $entityManager->getRepository('RFCCoreBundle:Rule')->find($ruleId);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Rule entity.');
            }

            $entityManager->remove($entity);
            $entityManager->flush();
        }

        return $this->redirect($this->generateUrl('admin_rule',
                    array(
                    'gameId' => $gameId
        )));
    }

    /**
     * Creates a form to delete a Rule entity by id.
     *
     * @param mixed $ruleId
     *            The entity id
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($ruleId, $gameId)
    {
        return $this->createFormBuilder()
                ->setAction($this->generateUrl('admin_rule_delete',
                        array(
                        'ruleId' => $ruleId,
                        'gameId' => $gameId
                )))
                ->setMethod('DELETE')
                ->add('submit', 'submit',
                    array(
                    'label' => 'Delete'
                ))
                ->getForm();
    }

    public function searchAction(Request $request)
    {
        if ($request->isMethod('POST')) {
            $params = \json_decode($request->getContent(), true);

            $gameId     = $params ['gameId'];
            $metaRuleId = $params ['metaRuleId'];

            $rules = $this->getDoctrine()->getManager()
                    ->getRepository('RFCCoreBundle:Rule')->getForMetaRule($metaRuleId);

            $metaRule = $this->getDoctrine()->getManager()->getRepository('RFCCoreBundle:MetaRule')->find($metaRuleId);

            return $this->render('RFCAdminBundle:Rule:affectMetaRule.html.twig',
                    array(
                    'gameId' => $gameId,
                    'rules' => $rules,
                    'metaRule' => $metaRule
            ));
        }
    }
}