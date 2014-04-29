<?php

namespace RFC\CoreBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use RFC\CoreBundle\Entity\MetaRule;
use RFC\CoreBundle\Form\MetaRuleType;

/**
 * MetaRule controller.
 *
 */
class MetaRuleController extends Controller
{

    /**
     * Lists all MetaRule entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('RFCCoreBundle:MetaRule')->findAll();

        return $this->render('RFCCoreBundle:MetaRule:index.html.twig', array(
            'entities' => $entities,
        ));
    }
    /**
     * Creates a new MetaRule entity.
     *
     */
    public function createAction(Request $request)
    {
        $entity = new MetaRule();
        $form = $this->createCreateForm($entity);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('admin_metaRule_show', array('id' => $entity->getId())));
        }

        return $this->render('RFCCoreBundle:MetaRule:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
    * Creates a form to create a MetaRule entity.
    *
    * @param MetaRule $entity The entity
    *
    * @return \Symfony\Component\Form\Form The form
    */
    private function createCreateForm(MetaRule $entity)
    {
        $form = $this->createForm(new MetaRuleType(), $entity, array(
            'action' => $this->generateUrl('admin_metaRule_create'),
            'method' => 'POST',
        ));

        $form->add('submit', 'submit', array('label' => 'Create'));

        return $form;
    }

    /**
     * Displays a form to create a new MetaRule entity.
     *
     */
    public function newAction()
    {
        $entity = new MetaRule();
        $form   = $this->createCreateForm($entity);

        return $this->render('RFCCoreBundle:MetaRule:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Finds and displays a MetaRule entity.
     *
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('RFCCoreBundle:MetaRule')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find MetaRule entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return $this->render('RFCCoreBundle:MetaRule:show.html.twig', array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),        ));
    }

    /**
     * Displays a form to edit an existing MetaRule entity.
     *
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('RFCCoreBundle:MetaRule')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find MetaRule entity.');
        }

        $editForm = $this->createEditForm($entity);
        $deleteForm = $this->createDeleteForm($id);

        return $this->render('RFCCoreBundle:MetaRule:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
    * Creates a form to edit a MetaRule entity.
    *
    * @param MetaRule $entity The entity
    *
    * @return \Symfony\Component\Form\Form The form
    */
    private function createEditForm(MetaRule $entity)
    {
        $form = $this->createForm(new MetaRuleType(), $entity, array(
            'action' => $this->generateUrl('admin_metaRule_update', array('id' => $entity->getId())),
            'method' => 'PUT',
        ));

        $form->add('submit', 'submit', array('label' => 'Update'));

        return $form;
    }
    /**
     * Edits an existing MetaRule entity.
     *
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('RFCCoreBundle:MetaRule')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find MetaRule entity.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createEditForm($entity);
        $editForm->handleRequest($request);

        if ($editForm->isValid()) {
            $em->flush();

            return $this->redirect($this->generateUrl('admin_metaRule_edit', array('id' => $id)));
        }

        return $this->render('RFCCoreBundle:MetaRule:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }
    /**
     * Deletes a MetaRule entity.
     *
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('RFCCoreBundle:MetaRule')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find MetaRule entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('admin_metaRule'));
    }

    /**
     * Creates a form to delete a MetaRule entity by id.
     *
     * @param mixed $id The entity id
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('admin_metaRule_delete', array('id' => $id)))
            ->setMethod('DELETE')
            ->add('submit', 'submit', array('label' => 'Delete'))
            ->getForm()
        ;
    }
}
