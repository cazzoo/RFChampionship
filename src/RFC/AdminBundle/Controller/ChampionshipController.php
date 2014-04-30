<?php

namespace RFC\AdminBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use RFC\CoreBundle\Entity\Championship;
use RFC\CoreBundle\Form\ChampionshipType;

/**
 * Championship controller.
 *
 */
class ChampionshipController extends Controller
{

    /**
     * Lists all Championship entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('RFCCoreBundle:Championship')->findAll();

        return $this->render('RFCAdminBundle:Championship:index.html.twig', array(
            'entities' => $entities,
        ));
    }
    /**
     * Creates a new Championship entity.
     *
     */
    public function createAction(Request $request)
    {
        $entity = new Championship();
        $form = $this->createCreateForm($entity);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('admin_championship_show', array('id' => $entity->getId())));
        }

        return $this->render('RFCAdminBundle:Championship:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
    * Creates a form to create a Championship entity.
    *
    * @param Championship $entity The entity
    *
    * @return \Symfony\Component\Form\Form The form
    */
    private function createCreateForm(Championship $entity)
    {
        $form = $this->createForm(new ChampionshipType(), $entity, array(
            'action' => $this->generateUrl('admin_championship_create'),
            'method' => 'POST',
        ));

        $form->add('submit', 'submit', array('label' => 'Create'));

        return $form;
    }

    /**
     * Displays a form to create a new Championship entity.
     *
     */
    public function newAction()
    {
        $entity = new Championship();
        $form   = $this->createCreateForm($entity);

        return $this->render('RFCAdminBundle:Championship:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Finds and displays a Championship entity.
     *
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('RFCCoreBundle:Championship')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Championship entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return $this->render('RFCAdminBundle:Championship:show.html.twig', array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),        ));
    }

    /**
     * Displays a form to edit an existing Championship entity.
     *
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('RFCCoreBundle:Championship')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Championship entity.');
        }

        $editForm = $this->createEditForm($entity);
        $deleteForm = $this->createDeleteForm($id);

        return $this->render('RFCAdminBundle:Championship:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
    * Creates a form to edit a Championship entity.
    *
    * @param Championship $entity The entity
    *
    * @return \Symfony\Component\Form\Form The form
    */
    private function createEditForm(Championship $entity)
    {
        $form = $this->createForm(new ChampionshipType(), $entity, array(
            'action' => $this->generateUrl('admin_championship_update', array('id' => $entity->getId())),
            'method' => 'PUT',
        ));

        $form->add('submit', 'submit', array('label' => 'Update'));

        return $form;
    }
    /**
     * Edits an existing Championship entity.
     *
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('RFCCoreBundle:Championship')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Championship entity.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createEditForm($entity);
        $editForm->handleRequest($request);

        if ($editForm->isValid()) {
            $em->flush();

            return $this->redirect($this->generateUrl('admin_championship_edit', array('id' => $id)));
        }

        return $this->render('RFCAdminBundle:Championship:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }
    /**
     * Deletes a Championship entity.
     *
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('RFCCoreBundle:Championship')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Championship entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('admin_championship'));
    }

    /**
     * Creates a form to delete a Championship entity by id.
     *
     * @param mixed $id The entity id
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('admin_championship_delete', array('id' => $id)))
            ->setMethod('DELETE')
            ->add('submit', 'submit', array('label' => 'Delete'))
            ->getForm()
        ;
    }
}
