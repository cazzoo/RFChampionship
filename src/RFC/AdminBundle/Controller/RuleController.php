<?php
namespace RFC\AdminBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use RFC\CoreBundle\Entity\Rule;
use RFC\CoreBundle\Entity\Game;
use RFC\CoreBundle\Form\RuleType;

/**
 * Rule controller.
 */
class RuleController extends Controller
{

    /**
     * Lists all Rule entities.
     */
    public function indexAction($gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $rules = $em->getRepository('RFCCoreBundle:Rule')->findBy(array(
            'game' => $gameId
        ));
        
        return $this->render('RFCAdminBundle:Rule:index.html.twig', array(
            'rules' => $rules,
            'gameId' => $gameId
        ));
    }

    /**
     * Creates a new Rule entity.
     */
    public function createAction(Request $request, $gameId)
    {
        $entity = new Rule();
        $form = $this->createCreateForm($entity, $gameId);
        $form->handleRequest($request);
        
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();
            
            return $this->redirect($this->generateUrl('admin_rule_show', array(
                'id' => $entity->getId(),
                'gameId' => $gameId
            )));
        }
        
        return $this->render('RFCAdminBundle:Rule:new.html.twig', array(
            'entity' => $entity,
            'form' => $form->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Creates a form to create a Rule entity.
     *
     * @param Rule $entity
     *            The entity
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createCreateForm(Rule $entity, $gameId)
    {
<<<<<<< HEAD
        $form = $this->createForm(new RuleType($gameId), $entity, array(
            'em' => $this->getDoctrine()
                ->getManager(),
=======
        $form = $this->createForm(new RuleType(), $entity, array(
>>>>>>> WorkingBundles
            'action' => $this->generateUrl('admin_rule_create', array(
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
     * Displays a form to create a new Rule entity.
     */
    public function newAction($gameId)
    {
        $entity = new Rule();
        $em = $this->getDoctrine()->getManager();
        $entityGame = $em->getRepository('RFCCoreBundle:Game')->find($gameId);
        $entity->setGame($entityGame);
        $form = $this->createCreateForm($entity, $gameId);
        
        return $this->render('RFCAdminBundle:Rule:new.html.twig', array(
            'entity' => $entity,
            'form' => $form->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Finds and displays a Rule entity.
     */
    public function showAction($id, $gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:Rule')->find($id);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Rule entity.');
        }
        
        $deleteForm = $this->createDeleteForm($id, $gameId);
        
        return $this->render('RFCAdminBundle:Rule:show.html.twig', array(
            'entity' => $entity,
            'delete_form' => $deleteForm->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Displays a form to edit an existing Rule entity.
     */
    public function editAction($id, $gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:Rule')->find($id);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Rule entity.');
        }
        
        $editForm = $this->createEditForm($entity, $gameId);
        $deleteForm = $this->createDeleteForm($id, $gameId);
        
        return $this->render('RFCAdminBundle:Rule:edit.html.twig', array(
            'entity' => $entity,
            'gameId' => $gameId,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView()
        ));
    }

    /**
     * Creates a form to edit a Rule entity.
     *
     * @param Rule $entity
     *            The entity
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createEditForm(Rule $entity, $gameId)
    {
<<<<<<< HEAD
        $form = $this->createForm(new RuleType($gameId), $entity, array(
            'em' => $this->getDoctrine()
                ->getManager(),
            'action' => $this->generateUrl('admin_rule_update', array(
=======
        $form = $this->createForm(new RuleType(), $entity, array(
            'em' => $this->getDoctrine()
                ->getManager(),'action' => $this->generateUrl('admin_rule_update', array(
>>>>>>> WorkingBundles
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
     * Edits an existing Rule entity.
     */
    public function updateAction(Request $request, $id, $gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:Rule')->find($id);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Rule entity.');
        }
        
        $deleteForm = $this->createDeleteForm($id, $gameId);
        $editForm = $this->createEditForm($entity, $gameId);
        $editForm->handleRequest($request);
        
        if ($editForm->isValid()) {
            $em->flush();
            
            return $this->redirect($this->generateUrl('admin_metaRule', array(
                'gameId' => $gameId
            )));
        }
        
        return $this->render('RFCAdminBundle:Rule:edit.html.twig', array(
            'entity' => $entity,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Deletes a Rule entity.
     */
    public function deleteAction(Request $request, $id, $gameId)
    {
        $form = $this->createDeleteForm($id, $gameId);
        $form->handleRequest($request);
        
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('RFCCoreBundle:Rule')->find($id);
            
            if (! $entity) {
                throw $this->createNotFoundException('Unable to find Rule entity.');
            }
            
            $em->remove($entity);
            $em->flush();
        }
        
        return $this->redirect($this->generateUrl('admin_rule', array(
            'gameId' => $gameId
        )));
    }

    /**
     * Creates a form to delete a Rule entity by id.
     *
     * @param mixed $id
     *            The entity id
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id, $gameId)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('admin_rule_delete', array(
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
