<?php

namespace RFC\AdminBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use RFC\CoreBundle\Entity\Result;
use RFC\CoreBundle\Form\ResultType;

/**
 * Result controller.
 *
 */
class ResultController extends Controller
{

    /**
     * Lists all Result entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('RFCCoreBundle:Result')->findAll();

        return $this->render('RFCAdminBundle:Result:index.html.twig', array(
            'entities' => $entities,
        ));
    }
    /**
     * Creates a new Result entity.
     *
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

            return $this->redirect($this->generateUrl('admin_result_show', array('id' => $entity->getId())));
        }

        return $this->render('RFCAdminBundle:Result:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
    * Creates a form to create a Result entity.
    *
    * @param Result $entity The entity
    *
    * @return \Symfony\Component\Form\Form The form
    */
    private function createCreateForm(Result $entity)
    {
        $form = $this->createForm(new ResultType(), $entity, array(
            'action' => $this->generateUrl('admin_result_create'),
            'method' => 'POST',
        ));

        $form->add('submit', 'submit', array('label' => 'Create'));

        return $form;
    }

    /**
     * Displays a form to create a new Result entity.
     *
     */
    public function newAction()
    {
        $entity = new Result();
        $form   = $this->createCreateForm($entity);

        return $this->render('RFCAdminBundle:Result:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Finds and displays a Result entity.
     *
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('RFCCoreBundle:Result')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Result entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return $this->render('RFCAdminBundle:Result:show.html.twig', array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),        ));
    }

    /**
     * Displays a form to edit an existing Result entity.
     *
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('RFCCoreBundle:Result')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Result entity.');
        }

        $editForm = $this->createEditForm($entity);
        $deleteForm = $this->createDeleteForm($id);

        return $this->render('RFCAdminBundle:Result:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
    * Creates a form to edit a Result entity.
    *
    * @param Result $entity The entity
    *
    * @return \Symfony\Component\Form\Form The form
    */
    private function createEditForm(Result $entity)
    {
        $form = $this->createForm(new ResultType(), $entity, array(
            'action' => $this->generateUrl('admin_result_update', array('id' => $entity->getId())),
            'method' => 'PUT',
        ));

        $form->add('submit', 'submit', array('label' => 'Update'));

        return $form;
    }
    /**
     * Edits an existing Result entity.
     *
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('RFCCoreBundle:Result')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Result entity.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createEditForm($entity);
        $editForm->handleRequest($request);

        if ($editForm->isValid()) {
            $em->flush();

            return $this->redirect($this->generateUrl('admin_result_edit', array('id' => $id)));
        }

        return $this->render('RFCAdminBundle:Result:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }
    /**
     * Deletes a Result entity.
     *
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('RFCCoreBundle:Result')->find($id);

            if (!$entity) {
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
     * @param mixed $id The entity id
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('admin_result_delete', array('id' => $id)))
            ->setMethod('DELETE')
            ->add('submit', 'submit', array('label' => 'Delete'))
            ->getForm()
        ;
    }
}
