<?php
namespace RFC\AdminBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use RFC\CoreBundle\Entity\Category;
use RFC\CoreBundle\Entity\Game;
use RFC\CoreBundle\Form\CategoryType;

/**
 * Category controller.
 */
class CategoryController extends Controller
{

    /**
     * Lists all Category entities.
     */
    public function indexAction($gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $categories = $em->getRepository('RFCCoreBundle:Category')->findBy(array(
            'game' => $gameId
        ));
        $game = $em->getRepository('RFCCoreBundle:Game')->findById($gameId);
        
        return $this->render('RFCAdminBundle:Category:index.html.twig', array(
            'categories' => $categories,
            'gameId' => $gameId,
            'game' => $game
        ));
    }

    /**
     * Creates a new Category entity.
     */
    public function createAction(Request $request, $gameId)
    {
        $entity = new Category();
        $form = $this->createCreateForm($entity, $gameId);
        $form->handleRequest($request);
        
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();
            
            return $this->redirect($this->generateUrl('admin_category_show', array(
                'id' => $entity->getId(),
                'gameId' => $gameId
            )));
        }
        
        return $this->render('RFCAdminBundle:Category:new.html.twig', array(
            'entity' => $entity,
            'form' => $form->createView()
        ));
    }

    /**
     * Creates a form to create a Category entity.
     *
     * @param Category $entity
     *            The entity
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createCreateForm(Category $entity, $gameId)
    {
<<<<<<< HEAD
        $form = $this->createForm(new CategoryType($gameId), $entity, array(
=======
        $form = $this->createForm(new CategoryType(), $entity, array(
>>>>>>> WorkingBundles
            'em' => $this->getDoctrine()
                ->getManager(),
            'action' => $this->generateUrl('admin_category_create', array(
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
     * Displays a form to create a new Category entity.
     */
    public function newAction($gameId)
    {
        $entity = new Category();
        $em = $this->getDoctrine()->getManager();
        $entityGame = $em->getRepository('RFCCoreBundle:Game')->find($gameId);
        $entity->setGame($entityGame);
        $form = $this->createCreateForm($entity, $gameId);
        
        return $this->render('RFCAdminBundle:Category:new.html.twig', array(
            'entity' => $entity,
            'form' => $form->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Finds and displays a Category entity.
     */
    public function showAction($id, $gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:Category')->find($id);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Category entity.');
        }
        
        $deleteForm = $this->createDeleteForm($id, $gameId);
        
        return $this->render('RFCAdminBundle:Category:show.html.twig', array(
            'entity' => $entity,
            'delete_form' => $deleteForm->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Displays a form to edit an existing Category entity.
     */
    public function editAction($id, $gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:Category')->find($id);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Category entity.');
        }
        
        $editForm = $this->createEditForm($entity, $gameId);
        $deleteForm = $this->createDeleteForm($id, $gameId);
        
        return $this->render('RFCAdminBundle:Category:edit.html.twig', array(
            'entity' => $entity,
            'gameId' => $gameId,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView()
        ));
    }

    /**
     * Creates a form to edit a Category entity.
     *
     * @param Category $entity
     *            The entity
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createEditForm(Category $entity, $gameId)
    {
<<<<<<< HEAD
        $form = $this->createForm(new CategoryType($gameId), $entity, array(
=======
        $form = $this->createForm(new CategoryType(), $entity, array(
>>>>>>> WorkingBundles
            'em' => $this->getDoctrine()
                ->getManager(),
            'action' => $this->generateUrl('admin_category_update', array(
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
     * Edits an existing Category entity.
     */
    public function updateAction(Request $request, $id, $gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:Category')->find($id);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Category entity.');
        }
        
        $deleteForm = $this->createDeleteForm($id, $gameId);
        $editForm = $this->createEditForm($entity, $gameId);
        $editForm->handleRequest($request);
        
        if ($editForm->isValid()) {
            $em->flush();
            
            return $this->redirect($this->generateUrl('admin_category_edit', array(
                'id' => $id,
                'gameId' => $gameId
            )));
        }
        
        return $this->render('RFCAdminBundle:Category:edit.html.twig', array(
            'entity' => $entity,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Deletes a Category entity.
     */
    public function deleteAction(Request $request, $id, $gameId)
    {
        $form = $this->createDeleteForm($id, $gameId);
        $form->handleRequest($request);
        
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('RFCCoreBundle:Category')->find($id);
            
            if (! $entity) {
                throw $this->createNotFoundException('Unable to find Category entity.');
            }
            
            $em->remove($entity);
            $em->flush();
        }
        
        return $this->redirect($this->generateUrl('admin_category', array(
            'gameId' => $gameId
        )));
    }

    /**
     * Creates a form to delete a Category entity by id.
     *
     * @param mixed $id
     *            The entity id
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id, $gameId)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('admin_category_delete', array(
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
