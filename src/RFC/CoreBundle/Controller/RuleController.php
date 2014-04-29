<?php

namespace RFC\CoreBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use RFC\CoreBundle\Entity\Rule;
use RFC\CoreBundle\Form\RuleType;

/**
 * Rule controller.
 *
 */
class RuleController extends Controller
{

    /**
     * Lists all Rule entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('RFCCoreBundle:Rule')->findAll();

        return $this->render('RFCCoreBundle:Rule:index.html.twig', array(
            'entities' => $entities,
        ));
    }
    /**
     * Creates a new Rule entity.
     *
     */
    public function createAction(Request $request)
    {
        $entity = new Rule();
        $form = $this->createCreateForm($entity);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('admin_rule_show', array('id' => $entity->getId())));
        }

        return $this->render('RFCCoreBundle:Rule:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
    * Creates a form to create a Rule entity.
    *
    * @param Rule $entity The entity
    *
    * @return \Symfony\Component\Form\Form The form
    */
    private function createCreateForm(Rule $entity)
    {
        $form = $this->createForm(new RuleType(), $entity, array(
            'action' => $this->generateUrl('admin_rule_create'),
            'method' => 'POST',
        ));

        $form->add('submit', 'submit', array('label' => 'Create'));

        return $form;
    }

    /**
     * Displays a form to create a new Rule entity.
     *
     */
    public function newAction()
    {
        $entity = new Rule();
        $form   = $this->createCreateForm($entity);

        return $this->render('RFCCoreBundle:Rule:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Finds and displays a Rule entity.
     *
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('RFCCoreBundle:Rule')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Rule entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return $this->render('RFCCoreBundle:Rule:show.html.twig', array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),        ));
    }

    /**
     * Displays a form to edit an existing Rule entity.
     *
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('RFCCoreBundle:Rule')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Rule entity.');
        }

        $editForm = $this->createEditForm($entity);
        $deleteForm = $this->createDeleteForm($id);

        return $this->render('RFCCoreBundle:Rule:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
    * Creates a form to edit a Rule entity.
    *
    * @param Rule $entity The entity
    *
    * @return \Symfony\Component\Form\Form The form
    */
    private function createEditForm(Rule $entity)
    {
        $form = $this->createForm(new RuleType(), $entity, array(
            'action' => $this->generateUrl('admin_rule_update', array('id' => $entity->getId())),
            'method' => 'PUT',
        ));

        $form->add('submit', 'submit', array('label' => 'Update'));

        return $form;
    }
    /**
     * Edits an existing Rule entity.
     *
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('RFCCoreBundle:Rule')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Rule entity.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createEditForm($entity);
        $editForm->handleRequest($request);

        if ($editForm->isValid()) {
            $em->flush();

            return $this->redirect($this->generateUrl('admin_rule_edit', array('id' => $id)));
        }

        return $this->render('RFCCoreBundle:Rule:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }
    /**
     * Deletes a Rule entity.
     *
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('RFCCoreBundle:Rule')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Rule entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('admin_rule'));
    }

    /**
     * Creates a form to delete a Rule entity by id.
     *
     * @param mixed $id The entity id
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('admin_rule_delete', array('id' => $id)))
            ->setMethod('DELETE')
            ->add('submit', 'submit', array('label' => 'Delete'))
            ->getForm()
        ;
    }
}
