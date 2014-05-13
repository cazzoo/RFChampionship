<?php
namespace RFC\AdminBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use RFC\CoreBundle\Entity\Track;
use RFC\CoreBundle\Entity\Game;
use RFC\CoreBundle\Form\TrackType;

/**
 * Track controller.
 */
class TrackController extends Controller
{

    /**
     * Lists all Track entities.
     */
    public function indexAction($gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $tracks = $em->getRepository('RFCCoreBundle:Track')->findBy(array(
            'game' => $gameId
        ));
        $game = $em->getRepository('RFCCoreBundle:Game')->findById($gameId);
        
        return $this->render('RFCAdminBundle:Track:index.html.twig', array(
            'tracks' => $tracks,
            'gameId' => $gameId,
            'game' => $game
        ));
    }

    /**
     * Creates a new Track entity.
     */
    public function createAction(Request $request, $gameId)
    {
        $entity = new Track();
        $form = $this->createCreateForm($entity, $gameId);
        $form->handleRequest($request);
        
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();
            
            return $this->redirect($this->generateUrl('admin_track_show', array(
                'id' => $entity->getId(),
                'gameId' => $gameId
            )));
        }
        
        return $this->render('RFCAdminBundle:Track:new.html.twig', array(
            'entity' => $entity,
            'form' => $form->createView()
        ));
    }

    /**
     * Creates a form to create a Track entity.
     *
     * @param Track $entity
     *            The entity
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createCreateForm(Track $entity, $gameId)
    {
        $form = $this->createForm(new TrackType(), $entity, array(
            'em' => $this->getDoctrine()
                ->getManager(),
            'action' => $this->generateUrl('admin_track_create', array(
                'gameId' => $gameId
            )),
            'method' => 'POST'
        ));
        
        $form->add('submit', 'submit', array(
            'label' => 'Create'
        ));
        
        return $form;
    }

    /**
     * Displays a form to create a new Track entity.
     */
    public function newAction($gameId)
    {
        $entity = new Track();
        $em = $this->getDoctrine()->getManager();
        $entityGame = $em->getRepository('RFCCoreBundle:Game')->find($gameId);
        $entity->setGame($entityGame);
        $form = $this->createCreateForm($entity, $gameId);
        
        return $this->render('RFCAdminBundle:Track:new.html.twig', array(
            'entity' => $entity,
            'form' => $form->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Finds and displays a Track entity.
     */
    public function showAction($id, $gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:Track')->find($id);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Track entity.');
        }
        
        $deleteForm = $this->createDeleteForm($id, $gameId);
        
        return $this->render('RFCAdminBundle:Track:show.html.twig', array(
            'entity' => $entity,
            'delete_form' => $deleteForm->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Displays a form to edit an existing Track entity.
     */
    public function editAction($id, $gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:Track')->find($id);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Track entity.');
        }
        
        $editForm = $this->createEditForm($entity, $gameId);
        $deleteForm = $this->createDeleteForm($id, $gameId);
        
        return $this->render('RFCAdminBundle:Track:edit.html.twig', array(
            'entity' => $entity,
            'gameId' => $gameId,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView()
        ));
    }

    /**
     * Creates a form to edit a Track entity.
     *
     * @param Track $entity
     *            The entity
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createEditForm(Track $entity, $gameId)
    {
        $form = $this->createForm(new TrackType(), $entity, array(
            'em' => $this->getDoctrine()
                ->getManager(),
            'action' => $this->generateUrl('admin_track_update', array(
                'id' => $entity->getId(),
                'gameId' => $gameId
            )),
            'method' => 'PUT'
        ));
        
        $form->add('submit', 'submit', array(
            'label' => 'Update'
        ));
        
        return $form;
    }

    /**
     * Edits an existing Track entity.
     */
    public function updateAction(Request $request, $id, $gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:Track')->find($id);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Track entity.');
        }
        
        $deleteForm = $this->createDeleteForm($id, $gameId);
        $editForm = $this->createEditForm($entity, $gameId);
        $editForm->handleRequest($request);
        
        if ($editForm->isValid()) {
            $em->flush();
            
            return $this->redirect($this->generateUrl('admin_track_edit', array(
                'id' => $id,
                'gameId' => $gameId
            )));
        }
        
        return $this->render('RFCAdminBundle:Track:edit.html.twig', array(
            'entity' => $entity,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Deletes a Track entity.
     */
    public function deleteAction(Request $request, $id, $gameId)
    {
        $form = $this->createDeleteForm($id, $gameId);
        $form->handleRequest($request);
        
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('RFCCoreBundle:Track')->find($id);
            
            if (! $entity) {
                throw $this->createNotFoundException('Unable to find Track entity.');
            }
            
            $em->remove($entity);
            $em->flush();
        }
        
        return $this->redirect($this->generateUrl('admin_track', array(
            'gameId' => $gameId
        )));
    }

    /**
     * Creates a form to delete a Track entity by id.
     *
     * @param mixed $id
     *            The entity id
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id, $gameId)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('admin_track_delete', array(
            'id' => $id,
            'gameId' => $gameId
        )))
            ->setMethod('DELETE')
            ->add('submit', 'submit', array(
            'label' => 'Delete'
        ))
            ->getForm();
    }
}
