<?php
namespace RFC\AdminBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use RFC\CoreBundle\Entity\TypeSession;
use RFC\CoreBundle\Entity\Game;
use RFC\CoreBundle\Form\TypeSessionType;

/**
 * TypeSession controller.
 */
class TypeSessionController extends Controller
{

    /**
     * Lists all TypeSession entities.
     */
    public function indexAction($gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $typeSessions = $em->getRepository('RFCCoreBundle:TypeSession')->findBy(array(
            'game' => $gameId
        ));
        $game = $em->getRepository('RFCCoreBundle:Game')->findById($gameId);
        
        return $this->render('RFCAdminBundle:TypeSession:index.html.twig', array(
            'typeSessions' => $typeSessions,
            'gameId' => $gameId,
            'game' => $game
        ));
    }

    /**
     * Creates a new TypeSession entity.
     */
    public function createAction(Request $request, $gameId)
    {
        $entity = new TypeSession();
        $form = $this->createCreateForm($entity, $gameId);
        $form->handleRequest($request);
        
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();
            
            return $this->redirect($this->generateUrl('admin_typeSession_show', array(
                'id' => $entity->getId(),
                'gameId' => $gameId
            )));
        }
        
        return $this->render('RFCAdminBundle:TypeSession:new.html.twig', array(
            'entity' => $entity,
            'form' => $form->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Creates a form to create a TypeSession entity.
     *
     * @param TypeSession $entity
     *            The entity
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createCreateForm(TypeSession $entity, $gameId)
    {
        $form = $this->createForm(new TypeSessionType(), $entity, array(
            'em' => $this->getDoctrine()
                ->getManager(),
            'action' => $this->generateUrl('admin_typeSession_create', array(
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
     * Displays a form to create a new TypeSession entity.
     */
    public function newAction($gameId)
    {
        $entity = new TypeSession();
        $em = $this->getDoctrine()->getManager();
        $entityGame = $em->getRepository('RFCCoreBundle:Game')->find($gameId);
        $entity->setGame($entityGame);
        $form = $this->createCreateForm($entity, $gameId);
        
        return $this->render('RFCAdminBundle:TypeSession:new.html.twig', array(
            'entity' => $entity,
            'form' => $form->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Finds and displays a TypeSession entity.
     */
    public function showAction($id, $gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:TypeSession')->find($id);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find TypeSession entity.');
        }
        
        $deleteForm = $this->createDeleteForm($id, $gameId);
        
        return $this->render('RFCAdminBundle:TypeSession:show.html.twig', array(
            'entity' => $entity,
            'delete_form' => $deleteForm->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Displays a form to edit an existing TypeSession entity.
     */
    public function editAction($id, $gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:TypeSession')->find($id);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find TypeSession entity.');
        }
        
        $editForm = $this->createEditForm($entity, $gameId);
        $deleteForm = $this->createDeleteForm($id, $gameId);
        
        return $this->render('RFCAdminBundle:TypeSession:edit.html.twig', array(
            'entity' => $entity,
            'gameId' => $gameId,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView()
        ));
    }

    /**
     * Creates a form to edit a TypeSession entity.
     *
     * @param TypeSession $entity
     *            The entity
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createEditForm(TypeSession $entity, $gameId)
    {
        $form = $this->createForm(new TypeSessionType(), $entity, array(
            'em' => $this->getDoctrine()
                ->getManager(),
            'action' => $this->generateUrl('admin_typeSession_update', array(
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
     * Edits an existing TypeSession entity.
     */
    public function updateAction(Request $request, $id, $gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:TypeSession')->find($id);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find TypeSession entity.');
        }
        
        $deleteForm = $this->createDeleteForm($id, $gameId);
        $editForm = $this->createEditForm($entity, $gameId);
        $editForm->handleRequest($request);
        
        if ($editForm->isValid()) {
            $em->flush();
            
            return $this->redirect($this->generateUrl('admin_typeSession_edit', array(
                'id' => $id,
                'gameId' => $gameId
            )));
        }
        
        return $this->render('RFCAdminBundle:TypeSession:edit.html.twig', array(
            'entity' => $entity,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Deletes a TypeSession entity.
     */
    public function deleteAction(Request $request, $id, $gameId)
    {
        $form = $this->createDeleteForm($id, $gameId);
        $form->handleRequest($request);
        
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('RFCCoreBundle:TypeSession')->find($id);
            
            if (! $entity) {
                throw $this->createNotFoundException('Unable to find TypeSession entity.');
            }
            
            $em->remove($entity);
            $em->flush();
        }
        
        return $this->redirect($this->generateUrl('admin_typeSession', array(
            'gameId' => $gameId
        )));
    }

    /**
     * Creates a form to delete a TypeSession entity by id.
     *
     * @param mixed $id
     *            The entity id
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id, $gameId)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('admin_typeSession_delete', array(
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
