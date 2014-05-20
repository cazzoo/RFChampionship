<?php
<<<<<<< HEAD
=======

>>>>>>> WorkingBundles
namespace RFC\AdminBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
<<<<<<< HEAD
=======

>>>>>>> WorkingBundles
use RFC\CoreBundle\Entity\Event;
use RFC\CoreBundle\Form\EventType;

/**
 * Event controller.
<<<<<<< HEAD
=======
 *
>>>>>>> WorkingBundles
 */
class EventController extends Controller
{

    /**
     * Lists all Event entities.
<<<<<<< HEAD
     */
    public function indexAction($gameId, $championshipId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entities = $em->getRepository('RFCCoreBundle:Event')->findBy(array(
            'championship' => $championshipId
        ));
        
        return $this->render('RFCAdminBundle:Event:index.html.twig', array(
            'entities' => $entities,
            'gameId' => $gameId,
            'championshipId' => $championshipId
        ));
    }

    /**
     * Creates a new Event entity.
     */
    public function createAction(Request $request, $gameId, $championshipId)
    {
        $entity = new Event();
        $form = $this->createCreateForm($entity, $gameId, $championshipId);
        $form->handleRequest($request);
        
=======
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('RFCCoreBundle:Event')->findAll();

        return $this->render('RFCAdminBundle:Event:index.html.twig', array(
            'entities' => $entities,
        ));
    }
    /**
     * Creates a new Event entity.
     *
     */
    public function createAction(Request $request)
    {
        $entity = new Event();
        $form = $this->createCreateForm($entity);
        $form->handleRequest($request);

>>>>>>> WorkingBundles
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();
<<<<<<< HEAD
            
            return $this->redirect($this->generateUrl('admin_event_show', array(
                'id' => $entity->getId(),
                'gameId' => $gameId,
                'championshipId' => $championshipId
            )));
        }
        
        return $this->render('RFCAdminBundle:Event:new.html.twig', array(
            'entity' => $entity,
            'form' => $form->createView(),
            'gameId' => $gameId,
            'championshipId' => $championshipId
=======

            return $this->redirect($this->generateUrl('admin_event_show', array('id' => $entity->getId())));
        }

        return $this->render('RFCAdminBundle:Event:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
>>>>>>> WorkingBundles
        ));
    }

    /**
<<<<<<< HEAD
     * Creates a form to create a Event entity.
     *
     * @param Event $entity
     *            The entity
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createCreateForm(Event $entity, $gameId, $championshipId)
    {
        $form = $this->createForm(new EventType($gameId), $entity, array(
            'action' => $this->generateUrl('admin_event_create', array(
                'gameId' => $gameId,
                'championshipId' => $championshipId
            )),
            'method' => 'POST'
        ));
        
        $form->add('submit', 'submit', array(
            'label' => 'Create'
        ));
        
=======
    * Creates a form to create a Event entity.
    *
    * @param Event $entity The entity
    *
    * @return \Symfony\Component\Form\Form The form
    */
    private function createCreateForm(Event $entity)
    {
        $form = $this->createForm(new EventType(), $entity, array(
            'action' => $this->generateUrl('admin_event_create'),
            'method' => 'POST',
        ));

        $form->add('submit', 'submit', array('label' => 'Create'));

>>>>>>> WorkingBundles
        return $form;
    }

    /**
     * Displays a form to create a new Event entity.
<<<<<<< HEAD
     */
    public function newAction($gameId, $championshipId)
    {
        $entity = new Event();
        $form = $this->createCreateForm($entity, $gameId, $championshipId);
        
        return $this->render('RFCAdminBundle:Event:new.html.twig', array(
            'entity' => $entity,
            'form' => $form->createView(),
            'gameId' => $gameId,
            'championshipId' => $championshipId
=======
     *
     */
    public function newAction()
    {
        $entity = new Event();
        $form   = $this->createCreateForm($entity);

        return $this->render('RFCAdminBundle:Event:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
>>>>>>> WorkingBundles
        ));
    }

    /**
     * Finds and displays a Event entity.
<<<<<<< HEAD
     */
    public function showAction($id, $gameId, $championshipId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:Event')->find($id);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Event entity.');
        }
        
        $deleteForm = $this->createDeleteForm($id, $gameId, $championshipId);
        
        return $this->render('RFCAdminBundle:Event:show.html.twig', array(
            'entity' => $entity,
            'delete_form' => $deleteForm->createView(),
            'gameId' => $gameId,
            'championshipId' => $championshipId
        ));
=======
     *
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('RFCCoreBundle:Event')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Event entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return $this->render('RFCAdminBundle:Event:show.html.twig', array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),        ));
>>>>>>> WorkingBundles
    }

    /**
     * Displays a form to edit an existing Event entity.
<<<<<<< HEAD
     */
    public function editAction($id, $gameId, $championshipId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:Event')->find($id);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Event entity.');
        }
        
        $editForm = $this->createEditForm($entity, $gameId, $championshipId);
        $deleteForm = $this->createDeleteForm($id, $gameId, $championshipId);
        
        return $this->render('RFCAdminBundle:Event:edit.html.twig', array(
            'entity' => $entity,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
            'gameId' => $gameId,
            'championshipId' => $championshipId
=======
     *
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('RFCCoreBundle:Event')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Event entity.');
        }

        $editForm = $this->createEditForm($entity);
        $deleteForm = $this->createDeleteForm($id);

        return $this->render('RFCAdminBundle:Event:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
>>>>>>> WorkingBundles
        ));
    }

    /**
<<<<<<< HEAD
     * Creates a form to edit a Event entity.
     *
     * @param Event $entity
     *            The entity
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createEditForm(Event $entity, $gameId, $championshipId)
    {
        $form = $this->createForm(new EventType($gameId), $entity, array(
            'action' => $this->generateUrl('admin_event_update', array(
                'id' => $entity->getId(),
                'gameId' => $gameId,
                'championshipId' => $championshipId
            )),
            'method' => 'PUT'
        ));
        
        $form->add('submit', 'submit', array(
            'label' => 'Update'
        ));
        
        return $form;
    }

    /**
     * Edits an existing Event entity.
     */
    public function updateAction(Request $request, $id, $gameId, $championshipId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:Event')->find($id);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Event entity.');
        }
        
        $deleteForm = $this->createDeleteForm($id, $gameId, $championshipId);
        $editForm = $this->createEditForm($entity, $gameId, $championshipId);
        $editForm->handleRequest($request);
        
        if ($editForm->isValid()) {
            $em->flush();
            
            return $this->redirect($this->generateUrl('admin_event_edit', array(
                'id' => $id,
                'gameId' => $gameId,
                'championshipId' => $championshipId
            )));
        }
        
        return $this->render('RFCAdminBundle:Event:edit.html.twig', array(
            'entity' => $entity,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
            'gameId' => $gameId,
            'championshipId' => $championshipId
        ));
    }

    /**
     * Deletes a Event entity.
     */
    public function deleteAction(Request $request, $id, $gameId, $championshipId)
    {
        $form = $this->createDeleteForm($id, $gameId, $championshipId);
        $form->handleRequest($request);
        
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('RFCCoreBundle:Event')->find($id);
            
            if (! $entity) {
                throw $this->createNotFoundException('Unable to find Event entity.');
            }
            
            $em->remove($entity);
            $em->flush();
        }
        
        return $this->redirect($this->generateUrl('admin_event', array(
            'gameId' => $gameId,
            'championshipId' => $championshipId
        )));
=======
    * Creates a form to edit a Event entity.
    *
    * @param Event $entity The entity
    *
    * @return \Symfony\Component\Form\Form The form
    */
    private function createEditForm(Event $entity)
    {
        $form = $this->createForm(new EventType(), $entity, array(
            'action' => $this->generateUrl('admin_event_update', array('id' => $entity->getId())),
            'method' => 'PUT',
        ));

        $form->add('submit', 'submit', array('label' => 'Update'));

        return $form;
    }
    /**
     * Edits an existing Event entity.
     *
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('RFCCoreBundle:Event')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Event entity.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createEditForm($entity);
        $editForm->handleRequest($request);

        if ($editForm->isValid()) {
            $em->flush();

            return $this->redirect($this->generateUrl('admin_event_edit', array('id' => $id)));
        }

        return $this->render('RFCAdminBundle:Event:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }
    /**
     * Deletes a Event entity.
     *
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('RFCCoreBundle:Event')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Event entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('admin_event'));
>>>>>>> WorkingBundles
    }

    /**
     * Creates a form to delete a Event entity by id.
     *
<<<<<<< HEAD
     * @param mixed $id
     *            The entity id
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id, $gameId, $championshipId)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('admin_event_delete', array(
            'id' => $id,
            'gameId' => $gameId,
            'championshipId' => $championshipId
        )))
            ->setMethod('DELETE')
            ->add('submit', 'submit', array(
            'label' => 'Delete'
        ))
            ->getForm();
=======
     * @param mixed $id The entity id
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('admin_event_delete', array('id' => $id)))
            ->setMethod('DELETE')
            ->add('submit', 'submit', array('label' => 'Delete'))
            ->getForm()
        ;
>>>>>>> WorkingBundles
    }
}
