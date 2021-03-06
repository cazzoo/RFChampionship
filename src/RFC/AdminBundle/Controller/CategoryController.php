<?php
/*  //RF//Championship is a multi-racing game team manager that allows members to organize and follow championships.
    Copyright (C) 2014 - //Racing-France//

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.*/

namespace RFC\AdminBundle\Controller;

use Knp\Menu\Util\MenuManipulator;
use RFC\CoreBundle\Entity\Category;
use RFC\CoreBundle\Form\Type\CategoryType;
use RFC\FrameworkBundle\Controller\RFCController;
use Symfony\Component\Form\Form;
use Symfony\Component\HttpFoundation\Request;

/**
 * Category controller.
 */
class CategoryController extends RFCController
{

    /**
     * Lists all Category entities.
     */
    public function indexAction($gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();
        
        $categories = $entityManager->getRepository('RFCCoreBundle:Category')->findBy(array(
            'game' => $gameId
        ));
        $game = $entityManager->getRepository('RFCCoreBundle:Game')->findOneBy(array('id' =>$gameId));
        
        // Ajout du jeu sélectionné
        $menu = $this->get('rfc_admin.menu.breadcrumb');
        $menu->addChild($game->getName())
            ->setUri($this->get("router")
            ->generate('admin_game_manage', array(
            'gameId' => $gameId
        )));
        $manipulator = new MenuManipulator();
        $manipulator->moveToPosition($menu->getChild($game->getName()), 1);
        
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
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($entity);
            $entityManager->flush();
            
            return $this->redirect($this->generateUrl('rfcCore_gameParameters', array(
	            'gameId' => $gameId,
            )) . '#/categories');
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
     * @return Form The form
     */
    private function createCreateForm(Category $entity, $gameId)
    {
        $form = $this->createForm(new CategoryType($gameId), $entity, array(
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
        $entityManager = $this->getDoctrine()->getManager();
        $entityGame = $entityManager->getRepository('RFCCoreBundle:Game')->find($gameId);
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
    public function showAction($categoryId, $gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();
        
        $entity = $entityManager->getRepository('RFCCoreBundle:Category')->find($categoryId);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Category entity.');
        }
        
        $deleteForm = $this->createDeleteForm($categoryId, $gameId);
        
        return $this->render('RFCAdminBundle:Category:show.html.twig', array(
            'entity' => $entity,
            'delete_form' => $deleteForm->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Displays a form to edit an existing Category entity.
     */
    public function editAction($categoryId, $gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();
        
        $entity = $entityManager->getRepository('RFCCoreBundle:Category')->find($categoryId);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Category entity.');
        }
        
        $editForm = $this->createEditForm($entity, $gameId);
        $deleteForm = $this->createDeleteForm($categoryId, $gameId);
        
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
     * @return Form The form
     */
    private function createEditForm(Category $entity, $gameId)
    {
        $form = $this->createForm(new CategoryType($gameId), $entity, array(
            'em' => $this->getDoctrine()
                ->getManager(),
            'action' => $this->generateUrl('admin_category_update', array(
                'categoryId' => $entity->getId(),
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
    public function updateAction(Request $request, $categoryId, $gameId)
    {
        $entityManager = $this->getDoctrine()->getManager();
        
        $entity = $entityManager->getRepository('RFCCoreBundle:Category')->find($categoryId);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Category entity.');
        }
        
        $deleteForm = $this->createDeleteForm($categoryId, $gameId);
        $editForm = $this->createEditForm($entity, $gameId);
        $editForm->handleRequest($request);
        
        if ($editForm->isValid()) {
            $entityManager->flush();
            
            return $this->redirect($this->generateUrl('rfcCore_gameParameters', array(
	            'gameId' => $gameId,
            )) . '#/categories');
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
    public function deleteAction(Request $request, $categoryId, $gameId)
    {
        $form = $this->createDeleteForm($categoryId, $gameId);
        $form->handleRequest($request);
        
        if ($form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entity = $entityManager->getRepository('RFCCoreBundle:Category')->find($categoryId);
            
            if (! $entity) {
                throw $this->createNotFoundException('Unable to find Category entity.');
            }
            
            $entityManager->remove($entity);
            $entityManager->flush();
        }

        return $this->redirect($this->generateUrl('rfcCore_gameParameters', array(
                'gameId' => $gameId,
            )) . '#/categories');
    }

    /**
     * Creates a form to delete a Category entity by id.
     *
     * @param mixed $categoryId
     *            The entity id
     *            
     * @return Form The form
     */
    private function createDeleteForm($categoryId, $gameId)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('admin_category_delete', array(
            'categoryId' => $categoryId,
            'gameId' => $gameId
        )))
            ->setMethod('DELETE')
            ->add('submit', 'submit', array(
            'label' => 'Delete'
        ))
            ->getForm();
    }
}
