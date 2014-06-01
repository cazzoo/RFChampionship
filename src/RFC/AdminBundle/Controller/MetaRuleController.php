<?php
namespace RFC\AdminBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use RFC\CoreBundle\Entity\MetaRule;
use RFC\CoreBundle\Entity\Game;
use RFC\CoreBundle\Form\MetaRuleType;

/**
 * MetaRule controller.
 */
class MetaRuleController extends Controller
{

    /**
     * Lists all MetaRule entities.
     */
    public function indexAction($gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $metaRules = $em->getRepository('RFCCoreBundle:MetaRule')->findBy(array('game' => $gameId));
        $game = $em->getRepository('RFCCoreBundle:Game')->findById($gameId);
        
        return $this->render('RFCAdminBundle:MetaRule:index.html.twig', array(
            'metaRules' => $metaRules,
            'metaRuleId' => null,
            'rules' => null,
            'gameId' => $gameId,
            'game' => $game
        ));
    }

    /**
     * Creates a new MetaRule entity.
     */
    public function createAction(Request $request, $gameId)
    {
        $entity = new MetaRule();
        $form = $this->createCreateForm($entity, $gameId);
        $form->handleRequest($request);
        
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();
            
            return $this->redirect($this->generateUrl('admin_metaRule_show', array(
                'id' => $entity->getId(),
                'gameId' => $gameId
            )));
        }
        
        return $this->render('RFCAdminBundle:MetaRule:new.html.twig', array(
            'entity' => $entity,
            'form' => $form->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Creates a form to create a MetaRule entity.
     *
     * @param MetaRule $entity
     *            The entity
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createCreateForm(MetaRule $entity, $gameId)
    {
        $form = $this->createForm(new MetaRuleType($gameId), $entity, array(
            'em' => $this->getDoctrine()
                ->getManager(),
            'action' => $this->generateUrl('admin_metaRule_create', array(
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
     * Displays a form to create a new MetaRule entity.
     */
    public function newAction($gameId)
    {
        $entity = new MetaRule();
        $em = $this->getDoctrine()->getManager();
        $entityGame = $em->getRepository('RFCCoreBundle:Game')->find($gameId);
        $entity->setGame($entityGame);
        $form = $this->createCreateForm($entity, $gameId);
        
        return $this->render('RFCAdminBundle:MetaRule:new.html.twig', array(
            'entity' => $entity,
            'form' => $form->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Finds and displays a MetaRule entity.
     */
    public function showAction($id, $gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:MetaRule')->find($id);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find MetaRule entity.');
        }
        
        $deleteForm = $this->createDeleteForm($id, $gameId);
        
        return $this->render('RFCAdminBundle:MetaRule:show.html.twig', array(
            'entity' => $entity,
            'delete_form' => $deleteForm->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Displays a form to edit an existing MetaRule entity.
     */
    public function editAction($id, $gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:MetaRule')->find($id);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find MetaRule entity.');
        }
        
        $editForm = $this->createEditForm($entity, $gameId);
        $deleteForm = $this->createDeleteForm($id, $gameId);
        
        return $this->render('RFCAdminBundle:MetaRule:edit.html.twig', array(
            'entity' => $entity,
            'gameId' => $gameId,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView()
        ));
    }

    /**
     * Creates a form to edit a MetaRule entity.
     *
     * @param MetaRule $entity
     *            The entity
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createEditForm(MetaRule $entity, $gameId)
    {
        $form = $this->createForm(new MetaRuleType($gameId), $entity, array(
            'em' => $this->getDoctrine()
                ->getManager(),
            'action' => $this->generateUrl('admin_metaRule_update', array(
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
     * Edits an existing MetaRule entity.
     */
    public function updateAction(Request $request, $id, $gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:MetaRule')->find($id);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find MetaRule entity.');
        }
        
        $deleteForm = $this->createDeleteForm($id, $gameId);
        $editForm = $this->createEditForm($entity, $gameId);
        $editForm->handleRequest($request);
        
        if ($editForm->isValid()) {
            $em->flush();
            
            return $this->redirect($this->generateUrl('admin_metaRule_edit', array(
                'id' => $id,
                'gameId' => $gameId
            )));
        }
        
        return $this->render('RFCAdminBundle:MetaRule:edit.html.twig', array(
            'entity' => $entity,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Deletes a MetaRule entity.
     */
    public function deleteAction(Request $request, $id, $gameId)
    {
        $form = $this->createDeleteForm($id, $gameId);
        $form->handleRequest($request);
        
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('RFCCoreBundle:MetaRule')->find($id);
            
            if (! $entity) {
                throw $this->createNotFoundException('Unable to find MetaRule entity.');
            }
            
            $em->remove($entity);
            $em->flush();
        }
        
        return $this->redirect($this->generateUrl('admin_metaRule', array(
            'gameId' => $gameId
        )));
    }

    /**
     * Creates a form to delete a MetaRule entity by id.
     *
     * @param mixed $id
     *            The entity id
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id, $gameId)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('admin_metaRule_delete', array(
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
