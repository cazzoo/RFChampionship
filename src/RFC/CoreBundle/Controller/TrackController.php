<?php

namespace RFC\CoreBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use RFC\CoreBundle\Entity\Track;
use RFC\CoreBundle\Form\TrackType;

/**
 * Track controller.
 *
 */
class TrackController extends Controller
{

    /**
     * Lists all Track entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('RFCCoreBundle:Track')->findAll();

        return $this->render('RFCCoreBundle:Track:index.html.twig', array(
            'entities' => $entities,
        ));
    }
    /**
     * Creates a new Track entity.
     *
     */
    public function createAction(Request $request)
    {
        $entity = new Track();
        $form = $this->createCreateForm($entity);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('admin_track_show', array('id' => $entity->getId())));
        }

        return $this->render('RFCCoreBundle:Track:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
    * Creates a form to create a Track entity.
    *
    * @param Track $entity The entity
    *
    * @return \Symfony\Component\Form\Form The form
    */
    private function createCreateForm(Track $entity)
    {
        $form = $this->createForm(new TrackType(), $entity, array(
            'action' => $this->generateUrl('admin_track_create'),
            'method' => 'POST',
        ));

        $form->add('submit', 'submit', array('label' => 'Create'));

        return $form;
    }

    /**
     * Displays a form to create a new Track entity.
     *
     */
    public function newAction()
    {
        $entity = new Track();
        $form   = $this->createCreateForm($entity);

        return $this->render('RFCCoreBundle:Track:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Finds and displays a Track entity.
     *
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('RFCCoreBundle:Track')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Track entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return $this->render('RFCCoreBundle:Track:show.html.twig', array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),        ));
    }

    /**
     * Displays a form to edit an existing Track entity.
     *
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('RFCCoreBundle:Track')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Track entity.');
        }

        $editForm = $this->createEditForm($entity);
        $deleteForm = $this->createDeleteForm($id);

        return $this->render('RFCCoreBundle:Track:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
    * Creates a form to edit a Track entity.
    *
    * @param Track $entity The entity
    *
    * @return \Symfony\Component\Form\Form The form
    */
    private function createEditForm(Track $entity)
    {
        $form = $this->createForm(new TrackType(), $entity, array(
            'action' => $this->generateUrl('admin_track_update', array('id' => $entity->getId())),
            'method' => 'PUT',
        ));

        $form->add('submit', 'submit', array('label' => 'Update'));

        return $form;
    }
    /**
     * Edits an existing Track entity.
     *
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('RFCCoreBundle:Track')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Track entity.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createEditForm($entity);
        $editForm->handleRequest($request);

        if ($editForm->isValid()) {
            $em->flush();

            return $this->redirect($this->generateUrl('admin_track_edit', array('id' => $id)));
        }

        return $this->render('RFCCoreBundle:Track:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }
    /**
     * Deletes a Track entity.
     *
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('RFCCoreBundle:Track')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Track entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('admin_track'));
    }

    /**
     * Creates a form to delete a Track entity by id.
     *
     * @param mixed $id The entity id
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('admin_track_delete', array('id' => $id)))
            ->setMethod('DELETE')
            ->add('submit', 'submit', array('label' => 'Delete'))
            ->getForm()
        ;
    }
}
