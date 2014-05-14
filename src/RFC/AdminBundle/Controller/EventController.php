<?php
namespace RFC\AdminBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use RFC\CoreBundle\Entity\Event;
use RFC\CoreBundle\Form\EventType;

/**
 * Event controller.
 */
class EventController extends Controller
{

    /**
     * Lists all Event entities.
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
        
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();
            
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
        ));
    }

    /**
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
        
        return $form;
    }

    /**
     * Displays a form to create a new Event entity.
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
        ));
    }

    /**
     * Finds and displays a Event entity.
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
    }

    /**
     * Displays a form to edit an existing Event entity.
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
        ));
    }

    /**
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
    }

    /**
     * Creates a form to delete a Event entity by id.
     *
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
    }
}
