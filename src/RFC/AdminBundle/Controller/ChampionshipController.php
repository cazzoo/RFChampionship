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
use RFC\CoreBundle\Entity\Championship;
use RFC\CoreBundle\Form\ChampionshipType;

/**
 * Championship controller.
<<<<<<< HEAD
=======
 *
>>>>>>> WorkingBundles
 */
class ChampionshipController extends Controller
{

    /**
     * Lists all Championship entities.
<<<<<<< HEAD
     */
    public function indexAction($gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entities = $em->getRepository('RFCCoreBundle:Championship')->findBy(array(
            'game' => $gameId
        ));
        $game = $em->getRepository('RFCCoreBundle:Game')->findById($gameId);
        
        return $this->render('RFCAdminBundle:Championship:index.html.twig', array(
            'entities' => $entities,
            'gameId' => $gameId,
            'game' => $game
        ));
    }

    /**
     * Creates a new Championship entity.
     */
    public function createAction(Request $request, $gameId)
    {
        $entity = new Championship();
        $form = $this->createCreateForm($entity, $gameId);
        $form->handleRequest($request);
        
=======
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

>>>>>>> WorkingBundles
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();
<<<<<<< HEAD
            
            return $this->redirect($this->generateUrl('admin_championship_show', array(
                'id' => $entity->getId(),
                'gameId' => $gameId
            )));
        }
        
        return $this->render('RFCAdminBundle:Championship:new.html.twig', array(
            'entity' => $entity,
            'form' => $form->createView(),
            'gameId' => $gameId
=======

            return $this->redirect($this->generateUrl('admin_championship_show', array('id' => $entity->getId())));
        }

        return $this->render('RFCAdminBundle:Championship:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
>>>>>>> WorkingBundles
        ));
    }

    /**
<<<<<<< HEAD
     * Creates a form to create a Championship entity.
     *
     * @param Championship $entity
     *            The entity
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createCreateForm(Championship $entity, $gameId)
    {
        $form = $this->createForm(new ChampionshipType($gameId), $entity, array(
            'em' => $this->getDoctrine()
                ->getManager(),
            'action' => $this->generateUrl('admin_championship_create', array(
                'gameId' => $gameId
            )),
            'method' => 'POST'
        ));
        
        $form->add('submit', 'submit', array(
            'label' => 'Create'
        ));
        
=======
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

>>>>>>> WorkingBundles
        return $form;
    }

    /**
     * Displays a form to create a new Championship entity.
<<<<<<< HEAD
     */
    public function newAction($gameId)
    {
        $entity = new Championship();
        $em = $this->getDoctrine()->getManager();
        $entityGame = $em->getRepository('RFCCoreBundle:Game')->find($gameId);
        $entity->setGame($entityGame);
        $form = $this->createCreateForm($entity, $gameId);
        
        return $this->render('RFCAdminBundle:Championship:new.html.twig', array(
            'entity' => $entity,
            'form' => $form->createView(),
            'gameId' => $gameId
=======
     *
     */
    public function newAction()
    {
        $entity = new Championship();
        $form   = $this->createCreateForm($entity);

        return $this->render('RFCAdminBundle:Championship:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
>>>>>>> WorkingBundles
        ));
    }

    /**
     * Finds and displays a Championship entity.
<<<<<<< HEAD
     */
    public function showAction($id, $gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:Championship')->find($id);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Championship entity.');
        }
        
        $deleteForm = $this->createDeleteForm($id, $gameId);
        
        return $this->render('RFCAdminBundle:Championship:show.html.twig', array(
            'entity' => $entity,
            'delete_form' => $deleteForm->createView(),
            'gameId' => $gameId
        ));
=======
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
>>>>>>> WorkingBundles
    }

    /**
     * Displays a form to edit an existing Championship entity.
<<<<<<< HEAD
     */
    public function editAction($id, $gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:Championship')->find($id);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Championship entity.');
        }
        
        $editForm = $this->createEditForm($entity, $gameId);
        $deleteForm = $this->createDeleteForm($id, $gameId);
        
        return $this->render('RFCAdminBundle:Championship:edit.html.twig', array(
            'entity' => $entity,
            'gameId' => $gameId,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView()
=======
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
>>>>>>> WorkingBundles
        ));
    }

    /**
<<<<<<< HEAD
     * Creates a form to edit a Championship entity.
     *
     * @param Championship $entity
     *            The entity
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createEditForm(Championship $entity, $gameId)
    {
        $form = $this->createForm(new ChampionshipType($gameId), $entity, array(
            'em' => $this->getDoctrine()
                ->getManager(),
            'action' => $this->generateUrl('admin_championship_update', array(
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
     * Edits an existing Championship entity.
     */
    public function updateAction(Request $request, $id, $gameId)
    {
        $em = $this->getDoctrine()->getManager();
        
        $entity = $em->getRepository('RFCCoreBundle:Championship')->find($id);
        
        if (! $entity) {
            throw $this->createNotFoundException('Unable to find Championship entity.');
        }
        
        $deleteForm = $this->createDeleteForm($id, $gameId);
        $editForm = $this->createEditForm($entity, $gameId);
        $editForm->handleRequest($request);
        
        if ($editForm->isValid()) {
            $em->flush();
            
            return $this->redirect($this->generateUrl('admin_championship_edit', array(
                'id' => $id,
                'gameId' => $gameId
            )));
        }
        
        return $this->render('RFCAdminBundle:Championship:edit.html.twig', array(
            'entity' => $entity,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
            'gameId' => $gameId
        ));
    }

    /**
     * Deletes a Championship entity.
     */
    public function deleteAction(Request $request, $id, $gameId)
    {
        $form = $this->createDeleteForm($id, $gameId);
        $form->handleRequest($request);
        
        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('RFCCoreBundle:Championship')->find($id);
            
            if (! $entity) {
                throw $this->createNotFoundException('Unable to find Championship entity.');
            }
            
            $em->remove($entity);
            $em->flush();
        }
        
        return $this->redirect($this->generateUrl('admin_championship', array(
            'gameId' => $gameId
        )));
=======
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
>>>>>>> WorkingBundles
    }

    /**
     * Creates a form to delete a Championship entity by id.
     *
<<<<<<< HEAD
     * @param mixed $id
     *            The entity id
     *            
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id, $gameId)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('admin_championship_delete', array(
            'id' => $id,
            'gameId' => $gameId
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
            ->setAction($this->generateUrl('admin_championship_delete', array('id' => $id)))
            ->setMethod('DELETE')
            ->add('submit', 'submit', array('label' => 'Delete'))
            ->getForm()
        ;
>>>>>>> WorkingBundles
    }
}
