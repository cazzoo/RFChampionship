<?php
namespace RFC\AdminBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use RFC\CoreBundle\Entity\Vehicle;
use RFC\CoreBundle\Entity\Game;
use RFC\CoreBundle\Form\VehicleType;

/**
 * Vehicle controller.
 */
class VehicleController extends Controller
{

    /**
     * Lists all Vehicle entities.
     */
    public function indexAction($gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $vehicles = $em->getRepository('RFCCoreBundle:Vehicle')->findBy(array(
            'game' => $gameId
        ));
        $game = $em->getRepository('RFCCoreBundle:Game')->findById($gameId);
        
        return $this->render('RFCAdminBundle:Vehicle:index.html.twig', array(
            'vehicles' => $vehicles,
            'gameId' => $gameId,
            'game' => $game
        ));
    }

    /**
     * Creates a new Vehicle entity.
     */
    public function createAction(Request $request, $gameId)
    {
        $entity = new Vehicle();
        $form = $this->createCreateForm($entity, $gameId);
        $form->handleRequest($request);
        
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();
            
            return $this->redirect($this->generateUrl('admin_vehicle_show', array(
                'vehicleId' => $entity->getId(),
                'gameId' => $gameId
            )));
        }
        
        return $this->render('RFCAdminBundle:Vehicle:new.html.twig', array(
            'entity' => $entity,
            'form' => $form->createView()
        ));
    }

    /**
     * Creates a form to create a Vehicle entity.
     *
     * @param Vehicle $entity
     *            The entity
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createCreateForm(Vehicle $entity, $gameId)
    {
        $form = $this->createForm(new VehicleType(), $entity, array(
            'em' => $this->getDoctrine()
                ->getManager(),
            'action' => $this->generateUrl('admin_vehicle_create', array(
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
     * Displays a form to create a new Vehicle entity.
     */
    public function newAction($gameId)
    {
        $entity = new Vehicle();
        $em = $this->getDoctrine()->getManager();
        $entityGame = $em->getRepository('RFCCoreBundle:Game')->find($gameId);
        $entity->setGame($entityGame);
        $form = $this->createCreateForm($entity, $gameId);
        
        return $this->render('RFCAdminBundle:Vehicle:new.html.twig', array(
            'entity' => $entity,
            'form' => $form->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Finds and displays a Vehicle entity.
     */
    public function showAction($vehicleId, $gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:Vehicle')->find($vehicleId);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Vehicle entity.');
        }
        
        $deleteForm = $this->createDeleteForm($vehicleId, $gameId);
        
        return $this->render('RFCAdminBundle:Vehicle:show.html.twig', array(
            'entity' => $entity,
            'delete_form' => $deleteForm->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Displays a form to edit an existing Vehicle entity.
     */
    public function editAction($vehicleId, $gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:Vehicle')->find($vehicleId);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Vehicle entity.');
        }
        
        $editForm = $this->createEditForm($entity, $gameId);
        $deleteForm = $this->createDeleteForm($vehicleId, $gameId);
        
        return $this->render('RFCAdminBundle:Vehicle:edit.html.twig', array(
            'entity' => $entity,
            'gameId' => $gameId,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView()
        ));
    }

    /**
     * Creates a form to edit a Vehicle entity.
     *
     * @param Vehicle $entity
     *            The entity
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createEditForm(Vehicle $entity, $gameId)
    {
        $form = $this->createForm(new VehicleType(), $entity, array(
            'em' => $this->getDoctrine()
                ->getManager(),
            'action' => $this->generateUrl('admin_vehicle_update', array(
                'vehicleId' => $entity->getId(),
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
     * Edits an existing Vehicle entity.
     */
    public function updateAction(Request $request, $vehicleId, $gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:Vehicle')->find($vehicleId);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Vehicle entity.');
        }
        
        $deleteForm = $this->createDeleteForm($vehicleId, $gameId);
        $editForm = $this->createEditForm($entity, $gameId);
        $editForm->handleRequest($request);
        
        if ($editForm->isValid()) {
            $em->flush();
            
            return $this->redirect($this->generateUrl('admin_vehicle_edit', array(
                'vehicleId' => $vehicleId,
                'gameId' => $gameId
            )));
        }
        
        return $this->render('RFCAdminBundle:Vehicle:edit.html.twig', array(
            'entity' => $entity,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Deletes a Vehicle entity.
     */
    public function deleteAction(Request $request, $vehicleId, $gameId)
    {
        $form = $this->createDeleteForm($vehicleId, $gameId);
        $form->handleRequest($request);
        
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('RFCCoreBundle:Vehicle')->find($vehicleId);
            
            if (! $entity) {
                throw $this->createNotFoundException('Unable to find Vehicle entity.');
            }
            
            $em->remove($entity);
            $em->flush();
        }
        
        return $this->redirect($this->generateUrl('admin_vehicle', array(
            'gameId' => $gameId
        )));
    }

    /**
     * Creates a form to delete a Vehicle entity by id.
     *
     * @param mixed $vehicleId
     *            The entity id
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($vehicleId, $gameId)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('admin_vehicle_delete', array(
            'vehicleId' => $vehicleId,
            'gameId' => $gameId
        )))
            ->setMethod('DELETE')
            ->add('submit', 'submit', array(
            'label' => 'Delete'
        ))
            ->getForm();
    }
}
